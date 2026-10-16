// Minimal service worker: makes the app installable and keeps the app shell
// available offline. It NEVER touches /api or /uploads, so data is always live.
const CACHE = 'magazine-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  if (req.method !== 'GET') return
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/uploads')) return

  // Network first (always fresh), fall back to cache when offline
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
        }
        return res
      })
      .catch(async () => {
        const cached = await caches.match(req)
        if (cached) return cached
        if (req.mode === 'navigate') {
          const shell = await caches.match('/')
          if (shell) return shell
        }
        return Response.error()
      })
  )
})
