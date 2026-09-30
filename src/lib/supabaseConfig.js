/**
 * Pure config resolver (unit-tested). Returns:
 *  - { status: 'local' }                      neither var set → no-login fallback
 *  - { status: 'ok', url, key }               both valid → login required
 *  - { status: 'invalid', problem }           something set but unusable → show an error, never silently fall back
 */
const clean = (v) => (v ?? '').toString().trim().replace(/^['"]|['"]$/g, '')

export function resolveSupabaseConfig(rawUrl, rawKey) {
  let url = clean(rawUrl)
  const key = clean(rawKey)
  if (!url && !key) return { status: 'local' }
  if (!url) return { status: 'invalid', problem: 'VITE_SUPABASE_URL is empty in .env.local.' }
  if (!key) return { status: 'invalid', problem: 'VITE_SUPABASE_ANON_KEY is empty in .env.local.' }

  // Supabase shows the "Data API URL" as https://xxxx.supabase.co/rest/v1 — supabase-js needs only the origin.
  url = url.replace(/\/+$/, '').replace(/\/(rest|auth)\/v1$/, '')
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:' && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1') throw new Error('protocol')
    url = u.origin
  } catch {
    return { status: 'invalid', problem: `VITE_SUPABASE_URL is not a valid URL (got "${url}"). Expected https://xxxx.supabase.co` }
  }
  if (key.startsWith('sb_secret_')) {
    return { status: 'invalid', problem: 'VITE_SUPABASE_ANON_KEY contains a SECRET key. Use the publishable key (sb_publishable_…).' }
  }
  return { status: 'ok', url, key }
}
