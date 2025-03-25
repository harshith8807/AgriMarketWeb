// Cache name
const CACHE_NAME = 'agri-market-cache-v1';

// Files to cache
const filesToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/market-data.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request)
          .then((response) => {
              if (response) {
                  return response;
              }
              
              return fetch(event.request)
                  .then((fetchResponse) => {
                      return caches.open(CACHE_NAME).then(cache => {
                          // Cache JSON data for offline mode
                          if (event.request.url.includes('.json')) {
                              cache.put(event.request, fetchResponse.clone());
                          }
                          return fetchResponse;
                      });
                  })
                  .catch(() => {
                      // If fetching fails, return cached page for HTML requests
                      if (event.request.url.endsWith('.html')) {
                          return caches.match('/index.html');
                      }
                  });
          })
  );
});


// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});