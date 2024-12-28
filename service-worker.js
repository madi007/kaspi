const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'idcard.html',
    'stucard.html',
    'medcard.html',
    'styles/style.css',
    'styles/idcard.css',
    'styles/stucard.css',
    'styles/medcard.css',
    'scripts/script.js',
    'scripts/stucard.js',
    'scripts/medcard.js',
    'scripts/idcard.js',
    'app.js',
    'manifest.json',
    'idcard.html' // Оффлайн-страница
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => caches.match('idcard.html'));
        })
    );
});