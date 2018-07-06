const CACHE_NAME = 'inversive.space-v1'

const CACHED_URLS = [
  '/',
  '/animation.js',
  '/cache.js',
  '/manifest.json',
  '/logo/512x512.png'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(
      cache => cache.addAll(CACHED_URLS)
    ).catch(error => { console.error(error) })
  )
})

// Cache falling back to the network.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    ).catch(error => { console.error(error) })
  )
})
