import supabase from './supabase';

/**
 * @param {{ sessionId: string, mentorId: string, rating: number, comment?: string|null }} params
 */
export async function createReview({ sessionId, mentorId, rating, comment }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) return { data: null, error: userError };
  if (!user) return { data: null, error: new Error('You must be signed in to leave a review.') };

  const result = await supabase
    .from('reviews')
    .insert({
      session_id: sessionId,
      mentor_id: mentorId,
      reviewer_id: user.id,
      rating,
      comment: comment ?? null,
    })
    .select()
    .single();

  // Rating is recalculated server-side via a Supabase database trigger on the
  // reviews table. See CLAUDE.md. Doing it client-side raced when two reviews
  // landed simultaneously and the mentor_profiles UPDATE silently failed under
  // RLS for any caller other than the mentor themselves.

  return result;
}

export async function getReviewsForMentor(mentorId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false });

  return { data: data ?? [], error };
}

/**
 * Returns the set of session IDs that the current user has already reviewed.
 * Used to hide the "Leave a Review" button once a review is submitted.
 */
export async function getMyReviewedSessionIds() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: new Set(), error: null };

  const { data, error } = await supabase
    .from('reviews')
    .select('session_id')
    .eq('reviewer_id', user.id);

  return { data: new Set((data ?? []).map((r) => r.session_id)), error };
}

/**
 * Notifies the mentor via Supabase Edge Function (Resend) when a new review is submitted.
 * Failures are non-fatal — the review is already saved in the DB by the time this runs.
 */
export async function sendReviewNotificationEmail({
  mentorName,
  mentorEmail,
  reviewerEmail,
  rating,
  comment,
  sessionId,
}) {
  if (!mentorEmail?.trim()) return;

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const ticketId = `REV-${sessionId.slice(0, 8).toUpperCase()}`;
  const commentText = comment?.trim() || '(No written comment left)';
  const meta = {
    Mentor: mentorName,
    'Mentor Email': mentorEmail,
    Rating: `${rating}/5  ${stars}`,
    'Session ID': sessionId,
    'Sent to': mentorEmail,
  };

  try {
    await supabase.functions.invoke('send-support-email', {
      body: {
        kind: 'feedback',
        ticketId,
        subject: `[Bridge] You received a new review — ${stars}`,
        body: commentText,
        replyTo: reviewerEmail || undefined,
        fromName: 'Bridge Review System',
        meta,
        toOverride: mentorEmail,
      },
    });
  } catch (err) {
    console.warn('[review] Mentor email failed:', err?.message ?? err);
  }
}
