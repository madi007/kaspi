const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'idcard.html',
    'styles/style.css',
    'styles/adcard.css', 
    'scripts/script.js', 
    'scripts/idcard.js', 
    'app.js',
    'manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});