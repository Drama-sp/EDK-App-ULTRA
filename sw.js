// Actualizado a v11.8 para coincidir con el núcleo Fluid Forge
const CACHE_NAME = 'edk-ultra-v11.8-forge';
const ASSETS = [
  './',
  './index.html',
  './EDKSTUDIOS2.png',
  // Si tienes un manifest.json, asegúrate de que el nombre coincida aquí:
  './manifest.json' 
];

// 1. INSTALACIÓN: Almacena los activos críticos
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Fuerza la activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("EDK Core: Archivos cacheteados con éxito");
      return cache.addAll(ASSETS);
    })
  );
});

// 2. ACTIVACIÓN: Limpieza profunda de versiones antiguas (v1.9.4, etc.)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("EDK System: Purgando base de datos antigua:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Toma el control de la web de inmediato
});

// 3. FETCH: Estrategia Inteligente (Cache First + Network Update)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna la caché si existe, pero dispara un fetch en paralelo para actualizarla
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Si la respuesta es válida, actualizamos la caché para la próxima vez
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline: si falla la red y no hay caché, podrías retornar una página de error aquí
      });

      return cachedResponse || fetchPromise;
    })
  );
});
