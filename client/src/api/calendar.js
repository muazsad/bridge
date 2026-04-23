/**
 * Phase 3: Google Calendar client helpers — scaffold
 *
 * Called from:
 *   - MentorOnboarding.jsx step 4 "Connect Google Calendar" button → connectGoogleCalendar()
 *   - Session booking flow (after a session is created/accepted) → createSessionCalendarEvent()
 *
 * To activate: set VITE_API_URL in client/.env and implement server/routes/calendar.js
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * Initiates the Google OAuth flow for the signed-in mentor.
 * Redirects the browser to the Express OAuth endpoint which redirects to Google.
 *
 * Phase 3: call this from the disabled button in MentorOnboarding step 4.
 * Replace the `disabled` attribute on the button and wire up onClick={connectGoogleCalendar}.
 */
export function connectGoogleCalendar(mentorProfileId) {
  // Phase 3: uncomment when server/routes/calendar.js is configured.
  // window.location.href = `${API_BASE}/api/calendar/connect?mentor_profile_id=${mentorProfileId}`;
  throw new Error('Google Calendar integration not yet configured.');
}

/**
 * Creates a Google Calendar event for an accepted session.
 * Returns { googleEventId, meetLink } to store on the session row.
 *
 * Phase 3: call this after a mentor accepts a session request (updateSessionStatus → 'accepted').
 * Only call for sessions where the mentor has calendar_connected = true.
 */
export async function createSessionCalendarEvent({ sessionId, mentorProfileId, menteeName, sessionType, scheduledDate }) {
  // Phase 3: uncomment when server/routes/calendar.js is configured.
  // const res = await fetch(`${API_BASE}/api/calendar/events`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     session_id: sessionId,
  //     mentor_profile_id: mentorProfileId,
  //     mentee_name: menteeName,
  //     session_type: sessionType,
  //     scheduled_date: scheduledDate,
  //   }),
  // });
  // if (!res.ok) throw new Error(await res.text());
  // return res.json();
  throw new Error('Google Calendar integration not yet configured.');
}
