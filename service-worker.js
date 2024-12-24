const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    'kaspi/index.html',
    'kaspi/idcard.html',
    'kaspi/styles/style.css',
    'kaspi/styles/adcard.css', 
    'kaspi/scripts/script.js', 
    'kaspi/scripts/idcard.js', 
    'kaspi/app.js',
    'kaspi/manifest.json'
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