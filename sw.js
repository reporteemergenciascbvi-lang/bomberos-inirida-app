/* Service Worker - Bomberos Inírida
   Hace que la app funcione sin conexión incluso después de cerrar el navegador */

const CACHE = 'bomberos-inirida-v1';
const ARCHIVOS = [
  './',
  './index.html',
  './app.js',
  './manifest.json'
];

// Al instalar, cachear todo
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

// Al activar, limpiar caches viejos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(claves =>
      Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia: cache primero, red como respaldo
self.addEventListener('fetch', (e) => {
  // No cachear las llamadas al backend (sincronización)
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    caches.match(e.request).then(respuesta => {
      return respuesta || fetch(e.request).then(red => {
        // Cachear nuevas respuestas
        if (red && red.status === 200 && e.request.method === 'GET') {
          const copia = red.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, copia));
        }
        return red;
      }).catch(() => {
        // Si no hay red ni cache, devolver respuesta vacía
        return new Response('Sin conexión', { status: 503 });
      });
    })
  );
});
