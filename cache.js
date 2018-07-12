const CACHE_NAME = 'inversive.space-v1.0'

const CACHED_URLS = [
  '/',
  '/animation.js',
  '/cache.js',
  '/favicon.ico',
  '/manifest.json',
  '/media/logo/36x36.png',
  '/media/logo/48x48.png',
  '/media/logo/72x72.png',
  '/media/logo/96x96.png',
  '/media/logo/144x144.png',
  '/media/logo/192x192.png',
  '/media/logo/256x256.png',
  '/media/logo/384x384.png',
  '/media/logo/512x512.png'
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
