const CACHE_NAME = 'edk-ultra-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon1.svg'
];

// Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Estrategia: Cargar desde caché, si no hay, ir a la red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
