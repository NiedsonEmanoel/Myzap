var CACHE_NAME = 'otimigas-app';

var urlsToCache = [
    '/',
    '/admin',
    '/admin/usuarios',
    '/admin/funcionarios',
    '/admin/whatsapp',
    '/admin/login',
    '/static/js/bundle.js',
    '/static/js/main.chunk.js',
    '/static/js/1.chunk.js',
    '/static/js/0.chunk.js',
    '/favicon.ico',
    '/static/css/main.51722f45.chunk.css',
    '/static/js/2.24e3552f.chunk.js',
    '/static/js/main.46f083bb.chunk.js',
    '/wall.png',
    '/notify.mp3',
    '/manifest.json',
    '/android-chrome-192x192.png',
    '/sw.js',
    '/notify2.mp3',
    '/css?family=Open+Sans',
    '/icon?family=Material+Icons'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});