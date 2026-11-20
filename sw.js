/* Service Worker v6.76 - CBVI Reportes
   v6.76: con señal débil la app abre con lo guardado (espera la red 4 s una sola vez) y se
          actualiza por detrás.
   v6.75: aviso de horas en desorden en el reporte; fondo nuevo en el ingreso.
   v6.74: control de acceso reforzado; una cuenta sin acceso sale de inmediato.
   v6.73: control de acceso por aprobación.
   v6.72: fotos y firmas en el PDF de reportes descargados e Inicio reorganizado.
   v6.71: identidad propia de los impresos y verificación por QR.
   v6.70: fotos múltiples, sin Turno / Guardia e impresiones con el diseño de los certificados.
   v6.69: EDAN con fotos, jerarquía visual más clara y censo con las listas del -08 oficial.
   v6.68: EDAN — censo de familias (formato -08), impresión de 13 por hoja y CSV.
   v6.67: sección EDAN (evaluación de daños y necesidades), funciona sin señal.
   NETWORK-FIRST para los archivos del propio sitio: con internet SIEMPRE
   baja la última versión (se acabó el caché viejo pegado en el teléfono).
   El caché queda solo como respaldo cuando NO hay señal. */
const CACHE = 'bomberos-inirida-v6-76';
/* v6.76: tiempo de espera de la red antes de abrir con lo guardado. Sin este tope, con señal débil
   (no nula) el teléfono esperaba la red indefinidamente. Solo actúa si hay copia guardada: sin copia
   se sigue esperando la red, igual que antes. */
const ESPERA_RED_MS = 4000;
/* MODO SEÑAL DÉBIL: el navegador pide la app en oleadas (página → estilos y mapa → logos y app), y
   con un tope por petición los 4 s se SUMABAN (medido en Chromium: 16 s con la red a 15 s). Cuando una
   petición agota el tope, durante 30 s las siguientes salen de lo guardado SIN esperar (la red sigue
   por detrás y actualiza el caché). Al vencer la ventana se vuelve a red primero.
   La ventana NO se corta porque algo llegue rápido: con señal débil lo pequeño (el CSS) llega a tiempo
   y lo grande no; cortarla ahí hacía esperar otros 4 s por logos.js (medido: 8,2 s en vez de 4,1 s).
   Solo afecta archivos de la app: el backend y Google nunca pasan por aquí, los datos siempre son de la red. */
const VENTANA_LENTA_MS = 30000;
let lentaHasta = 0;
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
  // La red sigue siendo la fuente: aunque se abra con lo guardado, la descarga continúa por detrás
  // (waitUntil) y actualiza el caché, así que la versión nueva llega en la apertura siguiente.
  const red = fetch(req);
  e.waitUntil(red.then(r => {
    if (r && r.status === 200) {
      const clon = r.clone();
      return caches.open(CACHE).then(c => c.put(req, clon));
    }
  }).catch(() => {}));
  const respaldo = () => caches.match(req).then(resp => {
    if (resp) return resp;
    // Solo devolver index.html como respaldo en navegaciones (SPA).
    // Para un JS/CSS/imagen que falte en caché, devolver index.html rompería
    // la app (HTML servido como script). Mejor un error de red limpio.
    if (req.mode === 'navigate') return caches.match('./index.html');
    return null;
  });
  const inicio = Date.now();
  const espera = inicio < lentaHasta ? 0 : ESPERA_RED_MS;   // en modo señal débil, sin esperar
  e.respondWith(new Promise(resolve => {
    let listo = false;
    const dar = (r) => { if (!listo && r) { listo = true; resolve(r); } };
    const reloj = setTimeout(() => {
      if (espera) lentaHasta = Date.now() + VENTANA_LENTA_MS;
      respaldo().then(dar).catch(() => {});      // sin copia: se sigue esperando la red
    }, espera);
    red.then(r => { clearTimeout(reloj); dar(r); })
      .catch(() => {
        clearTimeout(reloj);
        respaldo().then(r => dar(r || Response.error())).catch(() => dar(Response.error()));
      });
  }));
});
