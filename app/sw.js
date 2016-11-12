self.addEventListener('install', function(event) {
  // pre cache a load of stuff:
  event.waitUntil(
    caches.open('transApp').then(function(cache) {
      return cache.addAll([
        '/',
        './vendor/jquery/dist/jquery.min.js',
        './vendor/materialize/dist/js/materialize.min.js',
        './vendor/materialize/dist/css/materialize.min.css',
        './vendor/materialize/dist/fonts/roboto/Roboto-Regular.woff2',
        './vendor/materialize/dist/fonts/roboto/Roboto-Regular.woff',
        './vendor/materialize/dist/fonts/roboto/Roboto-Regular.ttf',
        './vendor/angular/angular.js',
        './vendor/angular-ui-router/release/angular-ui-router.min.js',
        // './build/trans.js',
        './build/trans.min.js',
        './build/app.min.css',
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
