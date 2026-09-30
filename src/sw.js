/* Gym Script service worker (injectManifest): precache + rest-timer notification. */
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

let restTimeout = null

async function showRestNotification() {
  // If the app is visible, the page already plays the sound — don't double-alert.
  const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  if (wins.some((c) => c.visibilityState === 'visible')) return
  await self.registration.showNotification('Rest over — Go!', {
    body: 'Time for your next set.',
    icon: '/icons/icon-192.png',
    badge: '/icons/favicon-32.png',
    tag: 'rest-timer',
    renotify: true,
    vibrate: [300, 100, 300, 100, 300]
  })
}

self.addEventListener('message', (event) => {
  const data = event.data || {}
  if (data.type === 'SCHEDULE_REST') {
    clearTimeout(restTimeout)
    const ms = data.endTimestamp - Date.now()
    if (ms > 0) restTimeout = setTimeout(showRestNotification, ms)
  } else if (data.type === 'CANCEL_REST') {
    clearTimeout(restTimeout)
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      if (wins.length) return wins[0].focus()
      return self.clients.openWindow('/')
    })
  )
})
