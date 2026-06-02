/* Service Worker v5.19 - CBVI Reportes
   NETWORK-FIRST para los archivos del propio sitio: con internet SIEMPRE
   baja la última versión (se acabó el caché viejo pegado en el teléfono).
   El caché queda solo como respaldo cuando NO hay señal. */
const CACHE = 'bomberos-inirida-v5-19';
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
    caches.open(CACHE).then(c =>
      // add individual: si un archivo falla (404), los demás igual se guardan.
      Promise.allSettled(ARCHIVOS.map(a => c.add(a)))
    ).catch(() => {})
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
  const req = e.request;
  const url = req.url;

  // No interceptar Google (login), backend ni mapas: pasan directo a la red.
  if (url.includes('accounts.google.com') ||
      url.includes('googleapis.com') ||
      url.includes('script.google.com') ||
      url.includes('nominatim.openstreetmap.org') ||
      url.includes('googleusercontent.com')) {
    return;
  }

  // Solo manejar GET del propio origen. El resto pasa directo.
  let mismoOrigen = false;
  try { mismoOrigen = (new URL(url).origin === self.location.origin); } catch (_) {}
  if (req.method !== 'GET' || !mismoOrigen) {
    return;
  }

  // NETWORK-FIRST: intenta la red; si falla (sin señal), usa el caché.
  e.respondWith(
    fetch(req).then(r => {
      if (r && r.status === 200) {
        const clon = r.clone();
        caches.open(CACHE).then(c => c.put(req, clon)).catch(() => {});
      }
      return r;
    }).catch(() =>
      caches.match(req).then(resp => resp || caches.match('./index.html'))
    )
  );
});
