/* Service Worker v5.6 - CBVI Reportes (network-first — siempre sirve versión más reciente) */
const CACHE = 'bomberos-inirida-v5-6';
const ARCHIVOS = [
  './',
  './index.html',
  './app.js',
  './logos.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARCHIVOS).catch(() => {}))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // No interceptar peticiones a Google (login) ni al backend
  const url = e.request.url;
  if (url.includes('accounts.google.com') ||
      url.includes('googleapis.com') ||
      url.includes('script.google.com') ||
      url.includes('nominatim.openstreetmap.org') ||
      url.includes('googleusercontent.com')) {
    return;
  }

  // NETWORK-FIRST: intentar red siempre; solo usar caché si la red falla (modo offline)
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.status === 200 && e.request.method === 'GET') {
        const clon = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clon)).catch(() => {});
      }
      return r;
    }).catch(() =>
      caches.match(e.request).then(cached => cached || caches.match('./index.html'))
    )
  );
});
