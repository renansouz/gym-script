# Auth (Supabase, email + password)

Google login was dropped (needs a Google Cloud account); email/password only.

## Setup
1. Supabase project → Project Settings → API: copy **Project URL** and the **publishable** key.
2. Copy `.env.example` → `.env.local` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. SQL Editor: run `supabase/migrations/0001_init.sql`.
4. Authentication → URL Configuration: set **Site URL** to your deployed URL and add `http://localhost:5173` and the deployed URL to **Redirect URLs** (needed for confirmation and reset links).
5. Vercel/Netlify: add the same two env vars.

**Never** put the `sb_secret_...` key in the frontend, the repo, or chat. It bypasses RLS.

## Behavior
- Env vars missing → app runs local-only (V1 behavior, no login).
- Env vars present → login required. supabase-js caches the session in localStorage, so reopening offline works.
- Email confirmation on (Supabase default) → sign-up shows "check your email". Turn it off in Authentication → Providers → Email for faster testing.

## RLS
Every user table has `user_id = auth.uid()` policies. The exercise library is readable by everyone signed in
(global rows, `owner_id is null`) plus the user's own custom rows; users can only write their own rows.
Friends' read access is added with the friends feature. RLS tests are planned once the project URL is connected.

## Troubleshooting: "I see the dashboard, not the login page"
1. Open the browser console (dev mode). Gym Script logs one line: `[Gym Script] Supabase config: ok → https://…`.
   `local` means the env vars were not read.
2. Vite only reads `.env.local` at startup — stop and restart `npm run dev` after editing it. The file must be in the
   project root (next to `package.json`), named exactly `.env.local` (not `.env.local.txt`), with no spaces around `=`.
3. Use the Project URL (`https://xxxx.supabase.co`). The "Data API URL" (`…/rest/v1`) is accepted and trimmed automatically.
4. In dev, stale service workers/caches from earlier builds are removed automatically on load (one reload).
5. A half-configured or invalid setup (one var missing, bad URL, secret key used) shows an on-screen error instead of silently skipping login.
