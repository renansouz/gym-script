import { createClient } from '@supabase/supabase-js'
import { resolveSupabaseConfig } from './supabaseConfig'

export const config = resolveSupabaseConfig(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

/** True only when Supabase is fully configured → login is required. */
export const cloudEnabled = config.status === 'ok'
/** Something is configured but broken → App shows an error screen instead of silently skipping login. */
export const configProblem = config.status === 'invalid' ? config.problem : null

export const supabase = cloudEnabled
  ? createClient(config.url, config.key, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

if (import.meta.env.DEV) {
  // Visible in the browser console so "is .env.local being read?" is never a guess.
  console.info(
    `[Gym Script] Supabase config: ${config.status}` +
      (config.status === 'ok' ? ` → ${config.url}` : config.status === 'local' ? ' (no VITE_SUPABASE_* found — restart `npm run dev` after editing .env.local)' : ` — ${config.problem}`)
  )
}
