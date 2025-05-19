
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('recarra-cache').then(function(cache) {
      return cache.addAll([
        './Recarra_Complete_Master.html',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
