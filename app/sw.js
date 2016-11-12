self.addEventListener('install', function(event) {
  // pre cache a load of stuff:
  event.waitUntil(
    caches.open('transApp').then(function(cache) {
      return cache.addAll([
        '/',
        './vendor/jquery/dist/jquery.min.js',
        './vendor/what-input/what-input.min.js',
        './vendor/foundation-sites/dist/foundation.min.js',
        './vendor/foundation-sites/dist/foundation.min.css',
        './vendor/angular/angular.js',
        './vendor/angular-ui-router/release/angular-ui-router.min.js',
        './build/trans.js',
        './controllers/home/home.html',
        './data/json/caltrain.json'
      ]);
    })
  )
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      return cachedResponse || fetch(event.request);
    })
  );
});
