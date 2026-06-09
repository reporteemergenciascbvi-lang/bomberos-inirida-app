/* Service Worker v5.18 - CBVI Reportes (network-first: logo y archivos siempre frescos) */
const CACHE = 'bomberos-inirida-v5-18';
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

  // Network-first: siempre intenta la red primero, fallback al caché
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.status === 200 && e.request.method === 'GET') {
        const clon = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clon)).catch(() => {});
      }
      return r;
    }).catch(() => caches.match(e.request).then(cached => cached || caches.match('./index.html')))
  );
});