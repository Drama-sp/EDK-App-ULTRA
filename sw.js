// Cambiamos el nombre de la caché (v1 -> v2) para forzar la actualización
const CACHE_NAME = 'edk-ultra-v2'; 
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './edkultra.svg'
];

// Instalación: Guardar nuevos archivos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Fuerza al nuevo SW a tomar el control de inmediato
});

// Activación: Borrar cachés antiguas (donde está la imagen vieja)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
