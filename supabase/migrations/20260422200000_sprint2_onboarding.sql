-- Sprint 2: mentor onboarding tracking + Google Calendar scaffold
-- Run in Supabase SQL Editor.

-- mentor_profiles: onboarding status + calendar integration columns
ALTER TABLE public.mentor_profiles
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS calendar_connected  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS google_refresh_token text,   -- stored after OAuth; treat as secret
  ADD COLUMN IF NOT EXISTS google_calendar_id  text;    -- which calendar to create events on

-- sessions: calendar event tracking (populated when Phase 3 creates Google Calendar events)
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS google_event_id text,
  ADD COLUMN IF NOT EXISTS meet_link        text;

-- All rows currently in the table are the 30 seeded mentors.
-- Mark them as fully onboarded + calendar-connected so they stay visible.
UPDATE public.mentor_profiles
  SET onboarding_complete = true,
      calendar_connected  = true
  WHERE onboarding_complete = false;
