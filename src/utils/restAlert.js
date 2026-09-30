/**
 * Rest-timer alert helpers. See docs/notifications.md for the full picture
 * and the platform limitations.
 *
 *  - Foreground / recently-backgrounded: play a real audio FILE (public/sounds/rest-done.wav)
 *    via an <audio> element that was "unlocked" by a user tap, plus vibrate.
 *  - Background: a service-worker timer shows a system notification at endTimestamp
 *    (best effort — the OS may suspend the SW when the phone has been locked a while).
 */

const SOUND_URL = '/sounds/rest-done.wav'
let audio = null

function getAudio() {
  if (!audio && typeof Audio !== 'undefined') {
    audio = new Audio(SOUND_URL)
    audio.preload = 'auto'
  }
  return audio
}

/** Call from a user tap (e.g. tapping a rest preset): unlocks audio playback + asks for notification permission. */
export function prepareRestAlerts() {
  const a = getAudio()
  if (a) {
    a.muted = true
    a.play()
      .then(() => {
        a.pause()
        a.currentTime = 0
        a.muted = false
      })
      .catch(() => {
        a.muted = false
      })
  }
  if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    try {
      Notification.requestPermission()
    } catch {
      /* older Safari signature — ignore */
    }
  }
}

export function notificationsGranted() {
  return typeof Notification !== 'undefined' && Notification.permission === 'granted'
}

async function swController() {
  if (!('serviceWorker' in navigator)) return null
  try {
    const reg = await navigator.serviceWorker.ready
    return reg.active || navigator.serviceWorker.controller || null
  } catch {
    return null
  }
}

export async function scheduleRestNotification(endTimestamp) {
  if (!notificationsGranted()) return
  const sw = await swController()
  sw?.postMessage({ type: 'SCHEDULE_REST', endTimestamp })
}

export async function cancelRestNotification() {
  const sw = await swController()
  sw?.postMessage({ type: 'CANCEL_REST' })
}

/** Fire the in-app alert: sound + vibration. (System notification is handled by the SW when hidden.) */
export function fireRestAlert() {
  const a = getAudio()
  if (a) {
    a.currentTime = 0
    a.volume = 1
    a.play().catch(() => {})
  }
  if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300])
}
