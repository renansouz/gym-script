# 🏋️ Gym Script

A zero-friction, mobile-first gym tracking PWA. Log your **best set** per exercise, beat your PR, keep your streak no bloat, no backend, no lag.

Built with React + Vite + Tailwind CSS + Zustand. Deploys free to Vercel or Netlify in under a minute, and installs to your phone's home screen as a real app.

---

## Why Gym Script exists

Most gym-tracking apps make you log every set of every exercise, which is friction you don't need mid-workout. Gym Script is built around **the Best Set Principle**: for each exercise, you record only the single best (heaviest/hardest) set you completed. That's the number that matters for progression, and it's the number Gym Script shows you next time alongside your all-time PR so you always know exactly what to beat.

## Features

- **Today / Yesterday dashboard** see what's scheduled today and what you did last session at a glance.
- **Duolingo-style streak counter** consistency-based, forgiving up to 2 rest days per rolling week without breaking your streak.
- **One-exercise-at-a-time workout flow** no scrolling through a wall of exercises; swipe/tap through your session with a drawer to jump around.
- **Last time + All-time PR**, shown live for every exercise.
- **Built-in rest timer** quick-tap presets derived from each exercise's target rest range, countdown ring, audio beep + vibration when done. No need to leave the app.
- **Preloaded 6-day split** (Push A / Pull A / Legs+Abs / Shoulders+Arms / Push-Pull Hypertrophy / Arms+Rear Delts+Abs), structured so a future "customize program" UI can edit it without touching your logged history.
- **100% client-side** all data lives in `localStorage` via Zustand's persist middleware. Instant reads/writes, zero backend, zero cost, works offline.
- **Installable PWA** add to your home screen on iOS or Android and it behaves like a native app (standalone window, custom icon, offline-capable).

## Tech Stack

| Layer     | Choice                           | Why                                                   |
| --------- | -------------------------------- | ----------------------------------------------------- |
| Framework | React 18 + Vite                  | Fast dev server, tiny production bundle               |
| Styling   | Tailwind CSS                     | Rapid, consistent, mobile-first utility styling       |
| Icons     | lucide-react                     | Lightweight, consistent icon set                      |
| State     | Zustand (+ `persist` middleware) | Minimal boilerplate, built-in localStorage sync       |
| PWA       | vite-plugin-pwa                  | Manifest + service worker generation, offline caching |

## Project Structure

```
gym-script/
├── public/
│   └── icons/                  # PWA home-screen icons (192px, 512px)
├── src/
│   ├── data/
│   │   └── workoutProgram.js   # Preloaded 6-day split (seed data)
│   ├── store/
│   │   └── useGymStore.js      # Zustand store: program, history, sessions, active workout
│   ├── utils/
│   │   ├── dateHelpers.js      # Local-date string helpers, week keys
│   │   ├── streak.js           # Duolingo-style streak algorithm
│   │   └── rest.js             # Rest timer preset + formatting helpers
│   ├── components/
│   │   ├── Dashboard/          # Home view: streak, today, yesterday
│   │   ├── Workout/            # Active workout flow: exercise view, drawer, rest timer
│   │   └── shared/             # Button, BottomSheet, NumberStepper
│   ├── App.jsx                 # Root: switches between Dashboard and Active Workout
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind + PWA-friendly base styles
├── docs/
│   ├── architecture.md
│   ├── state-management.md
│   └── data-model.md
├── index.html
├── vite.config.js              # Includes vite-plugin-pwa manifest config
├── tailwind.config.js
├── vercel.json                 # SPA rewrite rule for Vercel
└── netlify.toml                # Build + SPA redirect config for Netlify
```

## Getting Started (Local Development)

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the printed local URL on your phone (same Wi-Fi network) or in your desktop browser's mobile device emulator to test the mobile-first layout.

## Building for Production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

This outputs a static `dist/` folder plain HTML/CSS/JS, deployable anywhere that serves static files.

## Deploying for Free

### Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`. (Already configured via `vercel.json`.)
4. Deploy you'll get a free `https://your-app.vercel.app` URL.

### Netlify

1. Push this folder to a GitHub repo.
2. "Add new site" → "Import an existing project" at [app.netlify.com](https://app.netlify.com).
3. Build settings are pre-configured in `netlify.toml` (`npm run build`, publish `dist`).
4. Deploy.

### Installing on your phone (PWA)

Once deployed:

- **iOS (Safari):** open the URL → Share button → "Add to Home Screen".
- **Android (Chrome):** open the URL → menu (⋮) → "Add to Home screen" / "Install app".

The app will open full-screen with its own icon, no browser chrome, and works offline after the first load.

## Data & Privacy

All workout data (history, sessions, streak, program) is stored **only** in your browser's `localStorage` under the key `gym-script-storage`. Nothing is sent to a server. Clearing your browser data or uninstalling the PWA will erase your history there is currently no cloud backup or export feature (see "Roadmap" below).

## Customizing the Program

V1 ships with a hardcoded 6-day split in `src/data/workoutProgram.js`, but the data model was deliberately designed for future editability:

- Every exercise has a **permanent, stable `id`** history and PRs are keyed by this id, not by name or position, so reordering or renaming exercises later won't orphan your logged data.
- The store copies `WORKOUT_PROGRAM` into its own persisted `program` field on first load, so a future in-app editor can mutate the user's copy without ever touching the seed file.

To hand-edit the program today, just modify `src/data/workoutProgram.js` before your first run (or clear `localStorage` to re-seed).

## Roadmap Ideas (not in V1)

- In-app program editor (add/remove/reorder days & exercises)
- Data export/import (JSON) and optional cloud sync
- Per-set logging mode (opt-in) alongside Best Set mode
- Progress charts per exercise (weight/reps over time)
- Warm-up set calculator

## Documentation

See the [`docs/`](./docs) directory for deeper dives:

- [`docs/architecture.md`](./docs/architecture.md) component tree, data flow, view lifecycle
- [`docs/state-management.md`](./docs/state-management.md) full store shape, actions, streak algorithm rationale
- [`docs/data-model.md`](./docs/data-model.md) workout program schema, exercise fields, extensibility notes
