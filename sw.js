const CACHE_NAME = 'todo-v1';
const ASSETS_TO_CACHE = [
  './',                       // this will usually serve to-do.html
  './index.html',
  './Neue-Roman.otf',
  './Coolvetica Rg.otf'
  // No need to list CSS/JS separately – they are inside the HTML file
];

// Install event: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: cache-first, falling back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // Optional: cache new requests dynamically
            // (not strictly necessary for this small app)
            return networkResponse;
          }
        );
      })
  );
});
