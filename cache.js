const CACHE_NAME = 'inversive.space-v1.0'

const REQUIRED_FILES = [
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

const showError = error => {
  console.error(error)
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(
      cache => cache.addAll(REQUIRED_FILES)
    ).catch(showError)
  )
})

function cached (request) {
  return caches.open(CACHE_NAME).then(cache => {
    return cache.match(request).then(matching => {
      return matching || Promise.reject(new Error(`no match for ${request.url}`))
    }).catch(showError)
  }).catch(showError)
}

function updated (request) {
  return caches.open(CACHE_NAME).then(cache => {
    return fetch(request).then(response => {
      return cache.put(request, response)
    }).catch(showError)
  }).catch(showError)
}

// Cache and update.
self.addEventListener('fetch', event => {
  event.respondWith(cached(event.request))

  event.waitUntil(updated(event.request))
})
