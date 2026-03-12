// Cambiamos el nombre a v1.9.4 para forzar el borrado de la caché antigua
const CACHE_NAME = 'edk-ultra-v1.9.4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './edkultra.svg'
];

self.addEventListener('install', (event) => {
  // Forzar que el nuevo Service Worker se instale de inmediato
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Borrar cualquier caché antigua que no coincida con el nombre actual
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Limpiando caché antigua:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Reclamar el control de las pestañas abiertas inmediatamente
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
