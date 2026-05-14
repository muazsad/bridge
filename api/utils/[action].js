import supabase from '../_lib/supabase.js';
import { verifyAuthUser } from '../_lib/auth.js';
import { applyCors } from '../_lib/allowedOrigins.js';
import { applySecurityHeaders, jsonError } from '../_lib/security.js';
import { finalizeRun, recomputeRun } from '../_lib/verification/orchestrator.js';
import { randomBytes } from 'node:crypto';

export default async function handler(req, res) {
  const action = String(req.query?.action ?? '').toLowerCase();
  if (action === 'user-names') return handleUserNames(req, res);
  if (action === 'mentor-room-slug') return handleMentorRoomSlug(req, res);
  if (action === 'verification-retry') return handleVerificationRetry(req, res);
  return jsonError(res, 404, 'Unknown util action');
}

// ── user-names ──────────────────────────────────────────────────────────────

async function handleUserNames(req, res) {
  applyCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return jsonError(res, 405, 'Method not allowed');

  const { user, error: authErr } = await verifyAuthUser(req);
  if (authErr || !user) return jsonError(res, 401, 'Unauthorized');

  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};
  const userIds = Array.isArray(body.userIds)
    ? [...new Set(body.userIds.filter((id) => typeof id === 'string' && id.length > 0))]
    : [];
  if (!userIds.length) return res.status(200).json({});

  const nameMap = {};

  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id, personal_info')
    .in('user_id', userIds);
  if (Array.isArray(profiles)) {
    for (const p of profiles) {
      const name = p.personal_info?.full_name;
      if (name) nameMap[p.user_id] = name;
    }
  }

  const missing = userIds.filter((id) => !nameMap[id]);
  await Promise.all(missing.map(async (id) => {
    try {
      const { data } = await supabase.auth.admin.getUserById(id);
      const fullName = data?.user?.user_metadata?.full_name;
      if (fullName) nameMap[id] = fullName;
    } catch { /* ignore — leave id unmapped */ }
  }));

  return res.status(200).json(nameMap);
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}

// ── mentor-room-slug ─────────────────────────────────────────────────────────

function makeSlug() {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = randomBytes(12);
  let out = '';
  for (let i = 0; i < 12; i += 1) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

async function handleMentorRoomSlug(req, res) {
  applySecurityHeaders(res);
  if (req.method !== 'GET' && req.method !== 'POST') {
    return jsonError(res, 405, 'Method not allowed');
  }

  const { user, error: authError } = await verifyAuthUser(req);
  if (!user) return jsonError(res, 401, authError || 'Unauthorized');

  const { data: profile, error: profileError } = await supabase
    .from('mentor_profiles')
    .select('id, room_slug')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('[mentor-room-slug] profile read failed', { message: profileError.message });
    return jsonError(res, 500, 'Could not load mentor profile.');
  }
  if (!profile) return jsonError(res, 404, 'Mentor profile not found.');
  if (profile.room_slug) return res.json({ slug: profile.room_slug });

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = makeSlug();
    const { data: updated, error: updateError } = await supabase
      .from('mentor_profiles')
      .update({ room_slug: slug })
      .eq('id', profile.id)
      .is('room_slug', null)
      .select('room_slug')
      .maybeSingle();
    if (!updateError && updated?.room_slug) return res.json({ slug: updated.room_slug });
    if (updateError && updateError.code !== '23505') {
      console.error('[mentor-room-slug] update failed', { message: updateError.message });
      return jsonError(res, 500, 'Could not assign meeting link.');
    }
    const { data: refreshed } = await supabase
      .from('mentor_profiles')
      .select('room_slug')
      .eq('id', profile.id)
      .maybeSingle();
    if (refreshed?.room_slug) return res.json({ slug: refreshed.room_slug });
  }
  return jsonError(res, 500, 'Could not assign meeting link.');
}

// ── verification-retry (cron sweep) ─────────────────────────────────────────

const STALE_HOURS = 24;

async function handleVerificationRetry(req, res) {
  applySecurityHeaders(res);

  if (!isAuthorizedCronRequest(req)) return jsonError(res, 404, 'Not found');

  const summary = { expired: 0, finalized: 0, ref_aggregated: 0, errors: [] };

  try {
    const cutoff = new Date(Date.now() - STALE_HOURS * 3600 * 1000).toISOString();
    const { data: stale } = await supabase
      .from('mentor_verification_runs')
      .select('id, mentor_profile_id, started_at')
      .eq('status', 'in_progress')
      .lt('started_at', cutoff)
      .limit(50);

    for (const r of stale || []) {
      const { error } = await supabase
        .from('mentor_verification_runs')
        .update({ status: 'expired', completed_at: new Date().toISOString() })
        .eq('id', r.id);
      if (error) summary.errors.push({ runId: r.id, where: 'expire', message: error.message });
      else summary.expired += 1;
    }
  } catch (e) {
    summary.errors.push({ where: 'expire-loop', message: String(e?.message || e) });
  }

  try {
    const { data: orphanRefs } = await supabase
      .from('mentor_references')
      .select('run_id')
      .not('submitted_at', 'is', null)
      .not('run_id', 'is', null)
      .limit(200);
    const runIds = [...new Set((orphanRefs || []).map((r) => r.run_id))];
    for (const runId of runIds) {
      const { error } = await recomputeRun(runId);
      if (error) summary.errors.push({ runId, where: 'recompute', message: error });
      else summary.ref_aggregated += 1;
    }
  } catch (e) {
    summary.errors.push({ where: 'ref-aggregate-loop', message: String(e?.message || e) });
  }

  try {
    const { data: candidates } = await supabase
      .from('mentor_verification_runs')
      .select('id, components')
      .eq('status', 'in_progress')
      .limit(100);
    for (const run of candidates || []) {
      const decidedCount = Object.values(run.components || {})
        .filter((c) => c.status && c.status !== 'pending').length;
      if (decidedCount >= 7) {
        const result = await finalizeRun(run.id);
        if (result.error) summary.errors.push({ runId: run.id, where: 'finalize', message: result.error });
        else summary.finalized += 1;
      }
    }
  } catch (e) {
    summary.errors.push({ where: 'finalize-loop', message: String(e?.message || e) });
  }

  return res.json({ ok: true, summary });
}

function isAuthorizedCronRequest(req) {
  if (req.headers?.['x-vercel-cron']) return true;
  const secret = req.query?.secret || req.headers?.['x-cron-secret'];
  if (process.env.CRON_SECRET && secret === process.env.CRON_SECRET) return true;
  return false;
}
