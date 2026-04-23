import supabase from './supabase';

export const DEFAULT_BIO =
  "You're live on Bridge as a mentor. Update your headline, story, and focus areas so the right mentees know what to book you for.";

/** Dedupe concurrent ensure calls per user (sign-in + session restore). */
const ensurePromises = new Map();

/**
 * Ensures a mentor_profiles row exists for this auth user when they registered as a mentor.
 * Idempotent: returns existing row id if already present.
 */
export async function ensureMentorProfileForUser(user) {
  if (!user?.id) return null;

  const pending = ensurePromises.get(user.id);
  if (pending) return pending;

  const run = (async () => {
    const { data: existing, error: selErr } = await supabase
      .from('mentor_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (selErr) throw selErr;
    if (existing?.id) return existing;

    const meta = user.user_metadata ?? {};
    const name =
      (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
      user.email?.split('@')[0] ||
      'New mentor';

    const { data: created, error: insErr } = await supabase
      .from('mentor_profiles')
      .insert({
        user_id: user.id,
        name,
        email: user.email ?? null,
        title: 'Mentor',
        company: null,
        industry: 'technology',
        bio: DEFAULT_BIO,
        years_experience: null,
        expertise: [],
        rating: 0,
        total_sessions: 0,
        available: true,
        tier: 'rising',
        image_url: meta.avatar_url ?? null,
      })
      .select('id')
      .single();

    if (insErr) throw insErr;
    return created;
  })();

  ensurePromises.set(user.id, run);
  try {
    return await run;
  } finally {
    ensurePromises.delete(user.id);
  }
}

/** Returns the full mentor_profiles row needed for the onboarding form. */
export async function getMentorOnboardingProfile(userId) {
  const { data, error } = await supabase
    .from('mentor_profiles')
    .select('id, name, title, company, industry, bio, expertise, years_experience, session_rate, available, onboarding_complete, calendar_connected')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** Saves arbitrary mentor_profiles fields during an onboarding step. */
export async function saveMentorOnboardingStep(profileId, data) {
  const { error } = await supabase
    .from('mentor_profiles')
    .update(data)
    .eq('id', profileId);
  if (error) throw error;
}

/** Marks the profile form as complete (steps 1–3 done). Calendar flag stays false until Phase 3. */
export async function completeMentorOnboarding(profileId) {
  const { error } = await supabase
    .from('mentor_profiles')
    .update({ onboarding_complete: true })
    .eq('id', profileId);
  if (error) throw error;
}
