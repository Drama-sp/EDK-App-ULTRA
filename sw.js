const CACHE_NAME = 'edk-ultra-v1.4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './edkultra.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
