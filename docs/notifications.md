# Notifications & Rest Timer

## How the rest timer works
- State lives in the global store (`restTimer` in `useGymStore`), persisted to localStorage:
  `{ endTimestamp, totalSeconds, pausedRemainingMs, alerted }`.
- Remaining time is always `endTimestamp - Date.now()` (never a decrementing counter), so throttled
  background timers cannot cause drift. Pausing stores `pausedRemainingMs`; resuming sets a new `endTimestamp`.
- `<RestTimer/>` is mounted once in `App.jsx` (not inside a screen), so it keeps running while the user
  changes weights, opens the drawer or moves between exercises. Default view is a compact bar; tap to expand.
- Reopening the app mid-rest restores the timer; if it already expired, the alert fires on return.

## Alerts
| Situation | Mechanism |
|---|---|
| App visible / just returned to | `public/sounds/rest-done.wav` played through an `<audio>` element unlocked by the user's tap on a preset, plus vibration |
| App backgrounded / phone locked | Service worker (`src/sw.js`) `setTimeout` shows a system notification at `endTimestamp` (skipped if a window is visible) |

Notification permission is requested on the first preset tap (`prepareRestAlerts`).

## Platform limitations (important)
- Pure web/PWA timers cannot guarantee exact-second delivery after the phone has been locked for a while;
  iOS and Android may suspend the page and the service worker. This is a platform limit, not an implementation gap.
- Web notifications cannot play a custom sound (the OS uses its default notification sound), and the
  Notification Triggers API (scheduled local notifications) is not available in shipping browsers.
- Reliable background alerts need either (a) Web Push sent by a server at `endTimestamp` (needs the Supabase
  backend + VAPID keys, planned with V2 accounts), or (b) a Capacitor native wrapper with local notifications
  and audio-session ducking. Path (b) is the fully reliable one.
- iOS only supports notifications for PWAs installed to the Home Screen (iOS 16.4+).
