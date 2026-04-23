import supabase from "./supabase";

// Prevents concurrent duplicate inserts for the same user across simultaneous callers
// (e.g. AuthContext.register + onboarding page mount both calling at once).
const _ensureInFlight = new Map();

export async function ensureMentorProfileForUser(user) {
  if (!user?.id) return null;
  if (_ensureInFlight.has(user.id)) return _ensureInFlight.get(user.id);

  const p = (async () => {
    const { data: existing } = await supabase
      .from("mentor_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing?.id) return existing;

    const meta = user.user_metadata ?? {};
    const { data, error } = await supabase
      .from("mentor_profiles")
      .insert({
        user_id: user.id,
        email: user.email ?? "",
        name: meta.full_name ?? meta.first_name ?? "",
        onboarding_complete: false,
        calendar_connected: false,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data;
  })();

  _ensureInFlight.set(user.id, p);
  try {
    return await p;
  } finally {
    _ensureInFlight.delete(user.id);
  }
}

export async function getMentorOnboardingProfile(userId) {
  const { data, error } = await supabase
    .from("mentor_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveMentorOnboardingStep(profileId, updates) {
  const { data, error } = await supabase
    .from("mentor_profiles")
    .update(updates)
    .eq("id", profileId)
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function completeMentorOnboarding(profileId) {
  const { data, error } = await supabase
    .from("mentor_profiles")
    .update({ onboarding_complete: true })
    .eq("id", profileId)
    .select("id")
    .single();
  if (error) throw error;
  return data;
}
