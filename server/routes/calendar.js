/**
 * Phase 3: Google Calendar integration — scaffold
 *
 * To activate:
 *   1. Create a Google Cloud project and enable the Google Calendar API.
 *   2. Create OAuth 2.0 credentials (Web application) and set the redirect URI
 *      to `${YOUR_SERVER_URL}/api/calendar/callback`.
 *   3. Add to server/.env:
 *        GOOGLE_CLIENT_ID=...
 *        GOOGLE_CLIENT_SECRET=...
 *        GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/callback
 *        SUPABASE_URL=...
 *        SUPABASE_SERVICE_ROLE_KEY=...   (needs UPDATE on mentor_profiles + INSERT on sessions)
 *   4. npm install googleapis @supabase/supabase-js in /server
 *   5. Uncomment the implementation sections below.
 */

import express from 'express';
// import { google }        from 'googleapis';
// import { createClient }  from '@supabase/supabase-js';

const router = express.Router();

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI,
// );

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY,
// );

const NOT_CONFIGURED = { error: 'Google Calendar integration not yet configured.' };

/**
 * GET /api/calendar/connect?mentor_profile_id=<uuid>
 *
 * Redirects the mentor to the Google OAuth consent screen.
 * After consent, Google redirects to /api/calendar/callback with `code` and `state`.
 */
router.get('/connect', (req, res) => {
  // Phase 3: uncomment below.
  //
  // const { mentor_profile_id } = req.query;
  // if (!mentor_profile_id) return res.status(400).json({ error: 'mentor_profile_id required' });
  //
  // const url = oauth2Client.generateAuthUrl({
  //   access_type: 'offline',
  //   prompt: 'consent',        // force refresh_token on every connect
  //   scope: ['https://www.googleapis.com/auth/calendar.events'],
  //   state: mentor_profile_id, // passed back in callback so we know which mentor
  // });
  // return res.redirect(url);

  res.status(501).json(NOT_CONFIGURED);
});

/**
 * GET /api/calendar/callback?code=<auth_code>&state=<mentor_profile_id>
 *
 * Google redirects here after the mentor approves access.
 * Exchanges the code for tokens, stores the refresh token in mentor_profiles,
 * sets calendar_connected = true, then redirects to /dashboard.
 */
router.get('/callback', async (req, res) => {
  // Phase 3: uncomment below.
  //
  // const { code, state: mentorProfileId } = req.query;
  // if (!code || !mentorProfileId) return res.status(400).json({ error: 'Missing code or state' });
  //
  // try {
  //   const { tokens } = await oauth2Client.getToken(code);
  //   // tokens.refresh_token is only present when prompt: 'consent' is used
  //   const { error } = await supabase
  //     .from('mentor_profiles')
  //     .update({
  //       google_refresh_token: tokens.refresh_token,
  //       calendar_connected: true,
  //     })
  //     .eq('id', mentorProfileId);
  //   if (error) throw error;
  //   return res.redirect(`${process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'}/dashboard`);
  // } catch (err) {
  //   console.error('Calendar callback error:', err);
  //   return res.status(500).json({ error: err.message });
  // }

  res.status(501).json(NOT_CONFIGURED);
});

/**
 * POST /api/calendar/events
 * Body: { session_id, mentor_profile_id, mentee_name, session_type, scheduled_date }
 *
 * Creates a Google Calendar event with a Google Meet link for the session.
 * Stores the event id and meet link back on the sessions row.
 *
 * Call this from the server-side session creation logic (api/sessions.js → Express)
 * after a session is accepted, only when the mentor has calendar_connected = true.
 */
router.post('/events', async (req, res) => {
  // Phase 3: uncomment below.
  //
  // const { session_id, mentor_profile_id, mentee_name, session_type, scheduled_date } = req.body;
  //
  // try {
  //   // 1. Fetch the mentor's stored refresh token
  //   const { data: mentor, error: mentorErr } = await supabase
  //     .from('mentor_profiles')
  //     .select('name, google_refresh_token, google_calendar_id')
  //     .eq('id', mentor_profile_id)
  //     .single();
  //   if (mentorErr || !mentor.google_refresh_token) throw new Error('Mentor calendar not connected');
  //
  //   // 2. Build an authenticated client for this mentor
  //   oauth2Client.setCredentials({ refresh_token: mentor.google_refresh_token });
  //   const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  //
  //   // 3. Create the event (1-hour duration assumed; adjust per session_type if needed)
  //   const start = new Date(scheduled_date);
  //   const end   = new Date(start.getTime() + 60 * 60 * 1000);
  //   const event = await calendar.events.insert({
  //     calendarId: mentor.google_calendar_id ?? 'primary',
  //     conferenceDataVersion: 1,
  //     requestBody: {
  //       summary: `Bridge session: ${session_type.replace(/_/g, ' ')} with ${mentee_name}`,
  //       description: `Mentorship session booked via Bridge.\nSession type: ${session_type}`,
  //       start: { dateTime: start.toISOString() },
  //       end:   { dateTime: end.toISOString() },
  //       conferenceData: {
  //         createRequest: { requestId: session_id, conferenceSolutionKey: { type: 'hangoutsMeet' } },
  //       },
  //     },
  //   });
  //
  //   const googleEventId = event.data.id;
  //   const meetLink = event.data.conferenceData?.entryPoints?.[0]?.uri ?? null;
  //
  //   // 4. Persist on the session row
  //   const { error: sessErr } = await supabase
  //     .from('sessions')
  //     .update({ google_event_id: googleEventId, meet_link: meetLink })
  //     .eq('id', session_id);
  //   if (sessErr) throw sessErr;
  //
  //   return res.json({ googleEventId, meetLink });
  // } catch (err) {
  //   console.error('Calendar event creation error:', err);
  //   return res.status(500).json({ error: err.message });
  // }

  res.status(501).json(NOT_CONFIGURED);
});

export default router;
