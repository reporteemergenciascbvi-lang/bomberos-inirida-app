/* Service Worker v6.20 - CBVI Reportes
   NETWORK-FIRST para los archivos del propio sitio: con internet SIEMPRE
   baja la última versión (se acabó el caché viejo pegado en el teléfono).
   El caché queda solo como respaldo cuando NO hay señal. */
const CACHE = 'bomberos-inirida-v6-29';
// v5.99: se agregan los archivos de Leaflet (ahora autoalojados). Antes venían
// de unpkg.com y NO se cacheaban: sin señal, la libreria del mapa no existia y
// la pantalla solo podia mostrar el aviso de "revisa tu conexion".
const ARCHIVOS = ['./', './index.html', './app.js', './logos.js', './manifest.json',
  './vendor/leaflet/leaflet.js', './vendor/leaflet/leaflet.css'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.allSettled(ARCHIVOS.map(a => c.add(a)))).catch(() => {})
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
  if (url.includes('accounts.google.com') || url.includes('googleapis.com') ||
      url.includes('script.google.com') || url.includes('nominatim.openstreetmap.org') ||
      url.includes('googleusercontent.com')) {
    return;
  }
  let mismoOrigen = false;
  try { mismoOrigen = (new URL(url).origin === self.location.origin); } catch (_) {}
  if (req.method !== 'GET' || !mismoOrigen) return;
  e.respondWith(
    fetch(req).then(r => {
      if (r && r.status === 200) {
        const clon = r.clone();
        caches.open(CACHE).then(c => c.put(req, clon)).catch(() => {});
      }
      return r;
    }).catch(() => caches.match(req).then(resp => {
      if (resp) return resp;
      // Solo devolver index.html como respaldo en navegaciones (SPA).
      // Para un JS/CSS/imagen que falte en caché, devolver index.html rompería
      // la app (HTML servido como script). Mejor un error de red limpio.
      if (req.mode === 'navigate') return caches.match('./index.html');
      return Response.error();
    }))
  );
});
