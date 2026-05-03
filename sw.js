/* Service Worker - Bomberos Inírida v3
   Hace que la app funcione sin conexión y se actualice sola */

const CACHE = 'bomberos-inirida-v3';
const ARCHIVOS = [
  './',
  './index.html',
  './app.js',
  './logos.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(claves =>
      Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    caches.match(e.request).then(respuesta => {
      return respuesta || fetch(e.request).then(red => {
        if (red && red.status === 200 && e.request.method === 'GET') {
          const copia = red.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, copia));
        }
        return red;
      }).catch(() => {
        return new Response('Sin conexión', { status: 503 });
      });
    })
  );
});
