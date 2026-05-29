/* ============================================================
   APP DE REPORTE DE EMERGENCIAS - BOMBEROS INÍRIDA v4
   Login con Google, Sistema de administrador, Auto-completado GPS
   ============================================================ */

// ==================== CONFIGURACIÓN HARDCODED ====================
const GOOGLE_CLIENT_ID = '1091938050057-ccvp04hm6mg5m1aao1j3lv2cqn474vs5.apps.googleusercontent.com';
const ADMIN_EMAIL = 'gilrangeljeancarlosjeferson@gmail.com';
const ADMIN_PASSWORD = '12345Jj*'; // Contraseña para acceder al Panel Admin
const TELEFONO_ESTACION = '314 531 1605';
const NOMBRE_ESTACION = 'CBVI';
const URL_BACKEND = 'https://script.google.com/macros/s/AKfycbzVI3oEk78vHY2kQ15oz-U1jpkR0-L56cxEwby8tMi2mVJi5A5D74XMi25WKdod6wn2QA/exec';

// ===== VERSIONADO DE LA APP =====
// Subir este número cada vez que se despliegue una versión nueva.
// Cuando un dispositivo detecta versión distinta a la guardada,
// muestra el banner verde por 10 min con la lista de cambios.
const APP_VERSION = '5.18.2';
const APP_VERSION_FECHA = '29 de mayo de 2026';
const APP_VERSION_NOTAS = [
  'Autocompletado de nombres de bomberos al registrar personal en recursos (evita duplicados).',
  'Lista canónica oficial de 31 bomberos del CBVI integrada en la app.',
  'Sistema de corrección automática de nombres en bonificaciones.',
  'Herramienta admin para limpiar y reconstruir hojas auxiliares del libro Excel.',
  'Corrección: al editar un reporte propio, ahora carga recursos/personal del servidor antes de abrir el formulario.'
];

const CREDITO_AUTOR = {
  nombre: 'Bombero Jeferson Jeancarlos Rangel Gil',
  cuerpo: 'Cuerpo de Bomberos Voluntarios de Inírida',
  correo: 'gilrangeljeancarlosjeferson@gmail.com',
  telefono: '320 960 6428',
  facebook: 'https://www.facebook.com/jeancarlos.rangel.1420'
};

// ===== PERSONAL CANÓNICO CBVI =====
// Lista oficial de bomberos según Base de Datos Personal Bomberil.
// Usada para autocompletado y normalización de nombres en bonificaciones.
// Actualizar aquí cuando ingrese o retire un miembro.
const PERSONAL_CANONICO = [
  { nombre: "WILLIAM MARTINEZ PATIÑO",          rango: "CAPITAN",   cargo: "COMANDANTE" },
  { nombre: "ELIODORO LOPEZ MARTINEZ",           rango: "SARGENTO",  cargo: "SUB-CTE" },
  { nombre: "HERBHERT ARTEMIO DIAZ AGAPITO",     rango: "SARGENTO",  cargo: "CTE DE GUARDIA" },
  { nombre: "FREDY ANDREY SIERRA BORRERO",       rango: "NO APLICA", cargo: "MAQUINISTA" },
  { nombre: "GERMAN ALONSO ROJAS GARZON",        rango: "BOMBERO",   cargo: "MAQUINISTA" },
  { nombre: "JOSE ROSENDO PALMA NARVAEZ",        rango: "BOMBERO",   cargo: "MAQUINISTA" },
  { nombre: "LEONIDAS DOMINGUEZ RAMIREZ",        rango: "NO APLICA", cargo: "MAQUINISTA" },
  { nombre: "JEFERSON JEANCARLOS RANGEL GIL",    rango: "BOMBERO",   cargo: "CTE DE GUARDIA" },
  { nombre: "ARIEL FERNANDO CARDENAS TEJEIRO",   rango: "BOMBERO",   cargo: "TESORERO" },
  { nombre: "DELIO PINZON ALDANA",               rango: "BOMBERO",   cargo: "JEFE DE PRENSA" },
  { nombre: "HAROLD HENDER BARRETO SAENZ",       rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "HELIODORO LOPEZ VALENCIA",          rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "MERY JOSEFINA MORILLO MARIÑO",      rango: "BOMBERO",   cargo: "SERV. GENERALES" },
  { nombre: "MIGUEL ANGEL CONTRERAS PACHECO",    rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "MONICA LUZ MERY DIAZ AGAPITO",      rango: "BOMBERO",   cargo: "SECRETARIA" },
  { nombre: "OSCAR ESTIBEN MARTINEZ LOPEZ",      rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "THANYA EDITH RODRIGUEZ AGAPITO",    rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "VERONICA ALEJANDRA CAMICO GARRIDO", rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "WILDER JOSE GAITAN DIAZ",           rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "YADHIRA NAYERLY DIAZ AGAPITO",      rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "YORDY ALONSO MARTINEZ SAMPAYO",     rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "LEIDY KATHERINE ZAPATA RINCON",     rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "ELENA PATRICIA RAMIREZ PEREZ",      rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "ELIPSYS ALEXANDRA RONDON MORILLO",  rango: "ASPIRANTE", cargo: "B. VOLUNTARIO" },
  { nombre: "DAVID FELIPE MUÑOZ ACOSTA",         rango: "ASPIRANTE", cargo: "B. VOLUNTARIO" },
  { nombre: "JOSE LUIS FERNANDEZ RODRIGUEZ",     rango: "ASPIRANTE", cargo: "B. VOLUNTARIO" },
  { nombre: "DARLINGTON ESTIVEN DELGADO MOLINA", rango: "NO APLICA", cargo: "COORDINADOR SG-SST" },
  { nombre: "CRISTIAN ANDRES VIDAL TRUJILLO",    rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
  { nombre: "HECTOR DE JESUS GARCIA CUARTAS",    rango: "TENIENTE",  cargo: "VICEPRESIDENTE C.O." },
  { nombre: "GUILLERMO DIAZ SABOGAL",            rango: "CAPITAN",   cargo: "PRESIDENTE C.O." },
  { nombre: "WILSON GARCIA AGAPITO",             rango: "BOMBERO",   cargo: "B. VOLUNTARIO" },
];

const TIPOS_EVENTO = [
  'Incendio estructural', 'Incendio forestal', 'Incendio vehicular', 'Rescate vehicular',
  'Rescate en altura', 'Rescate acuático', 'Primeros auxilios', 'Materiales peligrosos (MATPEL)',
  'Inundación / desastre natural', 'Colapso estructural', 'Rescate animal', 'Otra'
];

const CAUSAS = [
  'Accidental – falla eléctrica', 'Accidental – descuido humano',
  'Accidental – niño con fósforos', 'Técnica – fuga de gas',
  'Técnica – cortocircuito', 'Técnica – falla mecánica',
  'Intencional (incendio provocado)', 'Natural (rayo, sismo, etc.)',
  'En investigación', 'Otra'
];

// ==================== BASE DE DATOS LOCAL ====================
const DB = {
  db: null,
  NOMBRE: 'BomberosIniridaDB',
  VERSION: 2,

  abrir() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.NOMBRE, this.VERSION);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => { this.db = req.result; resolve(this.db); };
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('reportes')) {
          const store = db.createObjectStore('reportes', { keyPath: 'id' });
          store.createIndex('estado', 'estado');
          store.createIndex('fecha', 'fechaCreacion');
        }
        if (!db.objectStoreNames.contains('config')) {
          db.createObjectStore('config', { keyPath: 'clave' });
        }
        if (!db.objectStoreNames.contains('contador')) {
          db.createObjectStore('contador', { keyPath: 'anio' });
        }
      };
    });
  },

  guardarReporte(r) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['reportes'], 'readwrite');
      tx.objectStore('reportes').put(r);
      tx.oncomplete = () => resolve(r);
      tx.onerror = () => reject(tx.error);
    });
  },

  obtenerReporte(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['reportes'], 'readonly');
      const req = tx.objectStore('reportes').get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  listarReportes() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['reportes'], 'readonly');
      const req = tx.objectStore('reportes').getAll();
      req.onsuccess = () => resolve(req.result.sort((a, b) =>
        new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      ));
      req.onerror = () => reject(req.error);
    });
  },

  eliminarReporte(id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['reportes'], 'readwrite');
      tx.objectStore('reportes').delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  guardarConfig(clave, valor) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['config'], 'readwrite');
      tx.objectStore('config').put({ clave, valor });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  obtenerConfig(clave) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['config'], 'readonly');
      const req = tx.objectStore('config').get(clave);
      req.onsuccess = () => resolve(req.result?.valor);
      req.onerror = () => reject(req.error);
    });
  }
};

// ==================== APP ====================
const app = {
  reporteActual: null,
  pantallaActual: 'pantallaLogin',
  pilaPantallas: [],  // Para navegación atrás

  config: {
    urlBackend: URL_BACKEND,
    token: '',
    proximoNumero: 1,
    prefijo: 'RE'
  },

  usuario: null,  // {email, nombre, foto, grado, cedula, telefono}

  fotosTemp: [null, null, null, null, null, null],
  firmas: { afectado: null, comandante: null },
  modalCallback: null,
  fotoSlotActivo: null,
  modoUbicacion: 'auto',

  async init() {
    if (typeof LOGO_SMALL !== 'undefined') {
      document.getElementById('logoHeader').src = LOGO_SMALL;
      document.getElementById('logoLogin').src = LOGO_SMALL;
    }

    // === Detectar nueva versión y mostrar banner por 10 min ===
    this._mostrarBannerSiHayNuevaVersion();

    await DB.abrir();
    await this.cargarConfig();
    this.escucharConexion();
    this.inicializarCheckboxes();
    this.inicializarFirmas();
    this.configurarFoto();
    this.configurarBotonAtrasMovil();
    this.registrarServiceWorker();
    // Intentar iniciar brújula sin permiso (Android la deja directo; iOS necesitará botón)
    try { this.iniciarEscuchaBrujula(); } catch (e) {}

    // Verificar si hay sesión activa
    const sesion = await DB.obtenerConfig('sesion');
    if (sesion && sesion.email) {
      this.usuario = sesion;
      this.actualizarUIUsuario();
      // Si ya completó registro complementario, ir a Home
      if (sesion.registroCompleto) {
        this.irA('pantallaHome');
        await this.actualizarHome();
        // Sincronizar reportes del servidor en segundo plano
        // (al abrir la app con sesión activa también, no solo tras login nuevo).
        // Esto permite que un reporte hecho en otro dispositivo con el mismo
        // correo aparezca aquí al refrescar.
        this.sincronizarReportesDesdeServidor().catch(e => console.warn('Sincronización falló:', e));
      } else {
        this.irA('pantallaRegistroComplemento');
      }
    } else {
      // Esperar a que cargue Google Identity Services
      this.iniciarGoogleSignIn();
    }

    window.addEventListener('online', () => {
      this.toast('Conexión restablecida. Sincronizando...', 'exito');
      this.sincronizarPendientes(true);
    });
  },

  // Banner de notificación de nueva versión.
  // Compara APP_VERSION con la guardada en localStorage; si cambió o no
  // existe, muestra un banner verde arriba con la versión y los cambios.
  // El banner se auto-oculta a los 10 minutos o cuando el usuario pulsa "Cerrar".
  _mostrarBannerSiHayNuevaVersion() {
    let versionGuardada = null;
    try { versionGuardada = localStorage.getItem('cbvi_app_version'); }
    catch (e) { /* localStorage puede no estar disponible */ }

    // Primera vez en este dispositivo: solo guardar la versión, no mostrar banner
    if (!versionGuardada) {
      try { localStorage.setItem('cbvi_app_version', APP_VERSION); } catch (e) {}
      return;
    }
    if (versionGuardada === APP_VERSION) return; // ya está al día

    // Hay versión nueva → mostrar banner
    const versionAnterior = versionGuardada;
    try { localStorage.setItem('cbvi_app_version', APP_VERSION); } catch (e) {}

    const notasHTML = (APP_VERSION_NOTAS || [])
      .map(n => `<li style="margin:2px 0;">${n}</li>`).join('');

    const banner = document.createElement('div');
    banner.id = 'bannerNuevaVersion';
    banner.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0',
      'background:#065f46', 'color:#fff',
      'padding:12px 16px', 'z-index:10000',
      'font-size:13px', 'line-height:1.5',
      'box-shadow:0 2px 12px rgba(0,0,0,0.3)',
      'display:flex', 'gap:12px', 'align-items:flex-start',
      'flex-wrap:wrap'
    ].join(';');
    banner.innerHTML = `
      <div style="flex:1;min-width:220px;">
        <div style="font-weight:700;font-size:14px;margin-bottom:4px;">
          🆕 App actualizada — v${APP_VERSION}
          ${typeof APP_VERSION_FECHA !== 'undefined' ? '<span style="font-weight:600;color:#6ee7b7;"> · ' + APP_VERSION_FECHA + '</span>' : ''}
        </div>
        <div style="font-size:11px;opacity:0.75;margin-bottom:6px;">Versión anterior: v${versionAnterior}</div>
        <div style="font-size:12px;opacity:0.95;margin-bottom:4px;">✅ Cambios incluidos:</div>
        <ul style="margin:0;padding-left:18px;font-size:12px;opacity:0.95;">${notasHTML}</ul>
      </div>
      <button onclick="document.getElementById('bannerNuevaVersion').remove()"
              style="flex-shrink:0;background:rgba(255,255,255,0.25);color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;align-self:center;">
        ✕ Cerrar
      </button>
    `;
    if (document.body) {
      document.body.appendChild(banner);
      // Auto-quitar a los 10 minutos
      setTimeout(() => {
        const el = document.getElementById('bannerNuevaVersion');
        if (el) el.remove();
      }, 10 * 60 * 1000);
    } else {
      // Por si el DOM no está aún listo
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(banner);
        setTimeout(() => {
          const el = document.getElementById('bannerNuevaVersion');
          if (el) el.remove();
        }, 10 * 60 * 1000);
      });
    }
  },

  // ==================== LOGIN GOOGLE ====================
  iniciarGoogleSignIn() {
    const intentar = () => {
      if (typeof google === 'undefined' || !google.accounts) {
        setTimeout(intentar, 500);
        return;
      }
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (resp) => this.manejarRespuestaGoogle(resp),
          auto_select: false
        });
        const btnDiv = document.getElementById('google-signin-btn');
        if (btnDiv) {
          btnDiv.innerHTML = '';
          google.accounts.id.renderButton(btnDiv, {
            theme: 'filled_blue',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 280
          });
        }
      } catch (err) {
        console.error('Error iniciando Google:', err);
        document.getElementById('loginErrorBox').style.display = 'block';
        document.getElementById('loginErrorBox').textContent =
          'Error cargando login de Google. Verifique que tiene conexión a internet y recargue la página.';
      }
    };
    intentar();
  },

  async manejarRespuestaGoogle(response) {
    try {
      // Decodificar el JWT (sin verificar firma — Google ya lo firmó)
      const payload = JSON.parse(atob(response.credential.split('.')[1]));

      // 1. Buscar perfil LOCAL primero (más rápido)
      const claveBomberoPorCorreo = 'bombero:' + payload.email;
      let perfilGuardado = await DB.obtenerConfig(claveBomberoPorCorreo);

      // 2. Si NO hay perfil local, intentar traerlo del SERVIDOR (sobrevive a borrar caché)
      if (!perfilGuardado || !perfilGuardado.registroCompleto) {
        try {
          this.toast('Buscando tu perfil en el servidor...', 'info');
          const respServ = await fetch(URL_BACKEND, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ accion: 'obtenerPerfilBombero', email: payload.email })
          });
          const dataServ = await respServ.json();
          if (dataServ.ok && dataServ.perfil && dataServ.perfil.registroCompleto) {
            perfilGuardado = dataServ.perfil;
            // Guardar localmente para próximas veces
            await DB.guardarConfig(claveBomberoPorCorreo, perfilGuardado);
            this.toast('Perfil restaurado del servidor', 'exito');
          }
        } catch (e) {
          console.warn('No se pudo consultar perfil en servidor:', e);
        }
      }

      const usuario = {
        email: payload.email,
        nombre: payload.name || '',
        nombrePila: payload.given_name || '',
        foto: payload.picture || '',
        emailVerificado: payload.email_verified,
        nombreCompleto: perfilGuardado?.nombreCompleto || '',
        grado: perfilGuardado?.grado || '',
        cedula: perfilGuardado?.cedula || '',
        telefono: perfilGuardado?.telefono || '',
        registroCompleto: !!(perfilGuardado && perfilGuardado.registroCompleto)
      };

      this.usuario = usuario;
      await DB.guardarConfig('sesion', usuario);

      this.toast(`Bienvenido, ${usuario.nombrePila || usuario.email}`, 'exito');

      if (usuario.registroCompleto) {
        this.actualizarUIUsuario();
        this.irA('pantallaHome');
        await this.actualizarHome();
        // Sincronizar reportes del servidor en segundo plano (tipo Gmail)
        this.sincronizarReportesDesdeServidor().catch(e => console.warn('Sincronización falló:', e));
      } else {
        document.getElementById('saludoRegistro').textContent =
          `${usuario.email} — Complete sus datos para empezar`;
        document.getElementById('reg_nombre').value = usuario.nombre || '';
        this.irA('pantallaRegistroComplemento');
      }

    } catch (err) {
      console.error('Error procesando login:', err);
      document.getElementById('loginErrorBox').style.display = 'block';
      document.getElementById('loginErrorBox').textContent =
        'Error procesando el login. Intente de nuevo.';
    }
  },

  async completarRegistro() {
    const nombre = document.getElementById('reg_nombre').value.trim();
    const grado = document.getElementById('reg_grado').value;
    const cedula = document.getElementById('reg_cedula').value.trim();
    const telefono = document.getElementById('reg_telefono').value.trim();

    if (!nombre || !grado || !cedula || !telefono) {
      this.toast('Llene todos los campos obligatorios', 'error');
      return;
    }

    this.usuario.nombreCompleto = nombre;
    this.usuario.grado = grado;
    this.usuario.cedula = cedula;
    this.usuario.telefono = telefono;
    this.usuario.registroCompleto = true;
    await DB.guardarConfig('sesion', this.usuario);

    // GUARDAR PERFIL POR CORREO (persiste aunque se cierre sesión)
    await this.guardarPerfilBombero();

    this.actualizarUIUsuario();
    this.toast(`Listo, ${this.usuario.nombrePila || nombre.split(' ')[0]} 🚒`, 'exito');
    this.irA('pantallaHome');
    await this.actualizarHome();
  },

  // Guarda el perfil del bombero asociado a su correo (sobrevive a cerrar sesión + borrar caché)
  async guardarPerfilBombero() {
    if (!this.usuario || !this.usuario.email) return;
    const clave = 'bombero:' + this.usuario.email;
    const perfil = {
      email: this.usuario.email,
      nombreCompleto: this.usuario.nombreCompleto,
      grado: this.usuario.grado,
      cedula: this.usuario.cedula,
      telefono: this.usuario.telefono,
      foto: this.usuario.foto,
      registroCompleto: true,
      ultimaActualizacion: new Date().toISOString()
    };
    // 1. Guardar local
    await DB.guardarConfig(clave, perfil);
    // 2. Guardar también en SERVIDOR (sobrevive a limpiar caché del teléfono)
    try {
      await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'guardarPerfilBombero', ...perfil })
      });
    } catch (e) {
      console.warn('No se pudo guardar perfil en servidor (se reintentará):', e);
    }
  },

  // SINCRONIZACIÓN TIPO GMAIL: descargar del servidor todos los reportes del usuario
  // y reconciliarlos con los locales. Sobrevive a borrar caché del teléfono.
  async sincronizarReportesDesdeServidor() {
    if (!this.usuario || !this.usuario.email) return;
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarMisReportes', email: this.usuario.email })
      });
      const data = await resp.json();
      if (!data.ok) return;

      const reportesServidor = data.reportes || [];
      let nuevos = 0;
      let rehidratados = 0;
      // Reportes locales indexados por id
      const locales = await DB.listarReportes();
      const localesPorId = new Map(locales.map(l => [l.id, l]));

      for (const r of reportesServidor) {
        if (!r.id) continue;
        const local = localesPorId.get(r.id);

        if (!local) {
          // Reporte que está en servidor pero NO en local: descargar TODO
          // (campos planos + fotos + firmas + recursos + víctimas + organizaciones)
          // para que el bombero vea la info completa al cambiar de dispositivo
          // o reinstalar la app.
          const completo = await this._descargarMiReporteCompleto(r.id);
          const final = completo ? Object.assign({}, r, completo) : r;
          final.estado = 'enviado';
          final.sincronizado = true;
          final._hidratadoServidor = true;
          await DB.guardarReporte(final);
          nuevos++;
          continue;
        }

        // Reporte YA está en local pero nunca fue hidratado con el endpoint
        // nuevo Y le faltan fotos/recursos (descargado con código viejo).
        // Re-hidratar UNA sola vez para completar la información.
        const necesitaHidratacion =
          !local._hidratadoServidor &&
          local.estado === 'enviado' &&
          (local.fotos === undefined || local.recursos === undefined);
        if (necesitaHidratacion) {
          const completo = await this._descargarMiReporteCompleto(r.id);
          if (completo) {
            const merged = Object.assign({}, local, completo);
            merged._hidratadoServidor = true;
            merged.estado = 'enviado';
            merged.sincronizado = true;
            await DB.guardarReporte(merged);
            rehidratados++;
          }
        }
      }
      if (rehidratados > 0) {
        this.toast(`🔄 Se completó la información de ${rehidratados} reporte(s)`, 'exito');
        await this.actualizarHome();
      }

      if (nuevos > 0) {
        this.toast(`Se descargaron ${nuevos} reportes del servidor`, 'exito');
        await this.actualizarHome();
      }

      // === Auto-sincronización de bonificaciones ===
      // Para cada reporte LOCAL ya enviado que tenga recursos+personal,
      // mandar los recursos al servidor. El backend es IDEMPOTENTE: solo
      // llena la hoja Bonificaciones si está vacía para ese reporte
      // (no sobreescribe lo que el admin haya registrado manualmente).
      // Esto permite que los reportes viejos (sin bonificaciones) se
      // completen automáticamente cuando el bombero original abre su app.
      this._sincronizarBonificacionesLocales(locales).catch(e =>
        console.warn('Auto-sync bonificaciones falló:', e)
      );

    } catch (e) {
      console.warn('Sincronización falló:', e);
    }
  },

  // Descarga UN reporte propio completo desde el servidor (con fotos+firmas+
  // recursos+víctimas+organizaciones). El backend valida que el email del
  // solicitante coincida con el operadorEmail del reporte.
  // Devuelve el objeto reporte o null si falla.
  async _descargarMiReporteCompleto(idReporte) {
    if (!this.usuario || !this.usuario.email) return null;
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'obtenerMiReporteCompleto',
          email: this.usuario.email,
          idReporte: idReporte
        })
      });
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { return null; }
      if (data && data.ok && data.reporte) return data.reporte;
      return null;
    } catch (e) {
      console.warn('No se pudo descargar reporte completo ' + idReporte, e);
      return null;
    }
  },

  // Recorre los reportes locales del usuario y sube sus recursos al servidor.
  // El backend decide por sí mismo si ese reporte necesita llenar bonificaciones.
  async _sincronizarBonificacionesLocales(locales) {
    if (!this.usuario || !this.usuario.email) return;
    const candidatos = (locales || []).filter(r =>
      r &&
      r.id &&
      r.estado === 'enviado' &&
      Array.isArray(r.recursos) &&
      r.recursos.length > 0
    );
    if (candidatos.length === 0) return;

    let sincronizados = 0;
    for (const r of candidatos) {
      try {
        const resp = await fetch(URL_BACKEND, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            accion: 'sincronizarRecursosReporte',
            email: this.usuario.email,
            idReporte: r.id,
            recursos: r.recursos
          })
        });
        const data = await resp.json();
        if (data && data.ok && data.sincronizado) sincronizados++;
        // Si responde { omitido: true } no contamos (ya estaba sincronizado)
      } catch (e) {
        // Silencioso: si falla, el admin puede registrar manual con los chips
        console.warn('No se pudo sincronizar bonificaciones del reporte ' + r.id, e);
      }
    }
    if (sincronizados > 0) {
      this.toast(`✅ ${sincronizados} reporte(s) sincronizaron sus bonificaciones`, 'exito');
    }
  },

  esAdmin() {
    return this.usuario && this.usuario.email === ADMIN_EMAIL;
  },

  actualizarUIUsuario() {
    if (!this.usuario) return;
    const inicial = (this.usuario.nombreCompleto || this.usuario.nombre || this.usuario.email).charAt(0).toUpperCase();

    // Avatar header
    const avatar = document.getElementById('userAvatar');
    if (this.esAdmin()) avatar.classList.add('admin');
    else avatar.classList.remove('admin');

    if (this.usuario.foto) {
      avatar.innerHTML = `<img src="${this.usuario.foto}" alt="">`;
    } else {
      avatar.innerHTML = `<span>${inicial}</span>`;
    }

    // Menú desplegable
    const avatarGrande = document.getElementById('avatarGrande');
    if (this.usuario.foto) {
      avatarGrande.innerHTML = `<img src="${this.usuario.foto}" alt="">`;
    } else {
      avatarGrande.innerHTML = `<span>${inicial}</span>`;
    }
    document.getElementById('menuNombreUsuario').textContent = this.usuario.nombreCompleto || this.usuario.nombre;
    document.getElementById('menuGradoUsuario').textContent =
      (this.usuario.grado || 'Bombero') + ' · ' + NOMBRE_ESTACION;
    document.getElementById('menuCorreoUsuario').textContent = this.usuario.email;
    document.getElementById('menuBadgeAdmin').style.display = this.esAdmin() ? 'inline-block' : 'none';
  },

  toggleUserMenu() {
    document.getElementById('userMenu').classList.toggle('visible');
  },

  cerrarUserMenu() {
    document.getElementById('userMenu').classList.remove('visible');
  },

  async cerrarSesion() {
    // Cerrar el menú primero para que la confirmación se vea bien
    this.cerrarUserMenu();
    // Usar confirm() nativo (más robusto que el modal personalizado)
    const ok = window.confirm('¿Cerrar sesión?\n\nLos reportes ya enviados al servidor seguirán disponibles cuando vuelva a iniciar sesión.\nLos borradores locales no enviados se mantendrán en este dispositivo.');
    if (!ok) return;

    try {
      await DB.guardarConfig('sesion', null);
      // Limpiar reportes ENVIADOS del usuario actual (los descargará del servidor al volver a entrar)
      // Mantenemos los borradores y pendientes (no se han subido aún)
      if (this.usuario && this.usuario.email) {
        const todos = await DB.listarReportes();
        const emailUsuario = this.usuario.email.toLowerCase();
        for (const r of todos) {
          // Borrar reportes enviados del usuario actual
          // (porque están en el servidor y se redescargarán al iniciar sesión)
          if (r.estado === 'enviado' &&
              r.operadorEmail &&
              r.operadorEmail.toLowerCase() === emailUsuario) {
            try { await DB.eliminarReporte(r.id); } catch (e) { /* ignore */ }
          }
        }
      }
    } catch (e) {
      console.error('Error borrando sesión:', e);
    }
    this.usuario = null;

    // Avisar a Google que no auto-seleccione esta cuenta
    try {
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
      }
    } catch (e) {}

    // Forzar recarga limpia (con timestamp para evitar cache)
    location.replace(location.pathname + '?t=' + Date.now());
  },

  // ==================== CONFIG ====================
  async cargarConfig() {
    const cfg = await DB.obtenerConfig('app');
    if (cfg) this.config = { ...this.config, ...cfg };
    // SIEMPRE forzar la URL hardcoded (los bomberos no pueden cambiarla)
    this.config.urlBackend = URL_BACKEND;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
    set('cfg_url_backend', this.config.urlBackend);
    set('cfg_token', this.config.token);
    set('cfg_proximo_numero', this.config.proximoNumero || 1);
    set('cfg_prefijo', this.config.prefijo || 'RE');
  },

  async guardarConfig() {
    // Datos del usuario (todos pueden editar los suyos)
    if (this.usuario) {
      this.usuario.nombreCompleto = document.getElementById('cfg_perfil_nombre').value.trim();
      this.usuario.grado = document.getElementById('cfg_perfil_grado').value.trim();
      this.usuario.cedula = document.getElementById('cfg_perfil_cedula').value.trim();
      this.usuario.telefono = document.getElementById('cfg_perfil_telefono').value.trim();
      await DB.guardarConfig('sesion', this.usuario);
      // También actualizar el perfil persistente por correo
      await this.guardarPerfilBombero();
      this.actualizarUIUsuario();
    }

    // URL del backend está HARDCODEADA — siempre se usa la del código
    this.config.urlBackend = URL_BACKEND;
    this.config.token = document.getElementById('cfg_token').value.trim();

    // Solo admin puede cambiar consecutivo
    if (this.esAdmin()) {
      this.config.proximoNumero = +document.getElementById('cfg_proximo_numero').value || 1;
      this.config.prefijo = document.getElementById('cfg_prefijo').value.trim().toUpperCase() || 'RE';
    }

    await DB.guardarConfig('app', this.config);
    this.toast('Configuración guardada', 'exito');
  },

  // ==================== NAVEGACIÓN ====================
  irA(pantallaId, sinHistorial = false) {
    if (!sinHistorial && this.pantallaActual !== pantallaId) {
      // Solo guardamos en historial las pantallas principales
      if (['pantallaHome', 'pantallaForm', 'pantallaDetalle', 'pantallaConfig'].includes(this.pantallaActual)) {
        this.pilaPantallas.push(this.pantallaActual);
      }
    }

    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    document.getElementById(pantallaId).classList.add('activa');
    this.pantallaActual = pantallaId;
    window.scrollTo(0, 0);

    const header = document.getElementById('header');
    const btnVolver = document.getElementById('btnVolver');

    if (pantallaId === 'pantallaLogin' || pantallaId === 'pantallaRegistroComplemento') {
      header.style.display = 'none';
      return;
    }
    header.style.display = 'flex';

    // Llenar configuración con datos del usuario actual
    if (pantallaId === 'pantallaConfig' && this.usuario) {
      document.getElementById('cfg_perfil_nombre').value = this.usuario.nombreCompleto || this.usuario.nombre || '';
      document.getElementById('cfg_perfil_grado').value = this.usuario.grado || '';
      document.getElementById('cfg_perfil_cedula').value = this.usuario.cedula || '';
      document.getElementById('cfg_perfil_correo').value = this.usuario.email || '';
      document.getElementById('cfg_perfil_telefono').value = this.usuario.telefono || '';
      // Mostrar zona admin solo si es administrador
      document.getElementById('zonaAdmin').style.display = this.esAdmin() ? 'block' : 'none';
    }

    if (pantallaId === 'pantallaHome') {
      btnVolver.style.display = 'none';
      document.getElementById('headerTitulo').textContent = 'CBVI Reportes';
      this.actualizarHome();
    } else {
      btnVolver.style.display = 'inline-block';
      btnVolver.onclick = () => this.atras();
      const titulos = {
        pantallaForm: 'Reporte de Emergencia',
        pantallaDetalle: 'Detalle del Reporte',
        pantallaConfig: 'Configuración'
      };
      document.getElementById('headerTitulo').textContent = titulos[pantallaId] || 'CBVI Reportes';
    }
  },

  async atras() {
    // Si estamos en formulario, preguntar si quiere guardar borrador
    if (this.pantallaActual === 'pantallaForm') {
      const ok = await this.confirmar('Salir del reporte',
        '¿Desea salir? Los cambios sin guardar se perderán. Use "Borrador" para guardar el progreso.');
      if (!ok) return;
    }

    if (this.pilaPantallas.length > 0) {
      const anterior = this.pilaPantallas.pop();
      this.irA(anterior, true);
    } else {
      this.irA('pantallaHome', true);
    }
  },

  configurarBotonAtrasMovil() {
    // Manejar el botón Atrás del navegador y del celular
    history.pushState({ pantalla: 'inicio' }, '');
    window.addEventListener('popstate', (e) => {
      // Cerrar menús/modales primero
      const userMenu = document.getElementById('userMenu');
      if (userMenu.classList.contains('visible')) {
        userMenu.classList.remove('visible');
        history.pushState({ pantalla: this.pantallaActual }, '');
        return;
      }
      const modalConfirmar = document.getElementById('modalConfirmar');
      if (modalConfirmar.classList.contains('visible')) {
        this.cerrarModal();
        history.pushState({ pantalla: this.pantallaActual }, '');
        return;
      }
      const modalFoto = document.getElementById('modalFotoOpciones');
      if (modalFoto.classList.contains('visible')) {
        modalFoto.classList.remove('visible');
        history.pushState({ pantalla: this.pantallaActual }, '');
        return;
      }

      // Si está en login, dejar que el navegador haga su acción
      if (this.pantallaActual === 'pantallaLogin' || this.pantallaActual === 'pantallaRegistroComplemento') {
        return;
      }

      // Si está en home, preguntar antes de cerrar
      if (this.pantallaActual === 'pantallaHome') {
        if (confirm('¿Cerrar la app?')) {
          // Permitir que el navegador cierre
          history.back();
        } else {
          history.pushState({ pantalla: 'pantallaHome' }, '');
        }
        return;
      }

      // En cualquier otra pantalla, ir atrás
      this.atras();
      history.pushState({ pantalla: this.pantallaActual }, '');
    });
  },

  // ==================== HOME ====================
  async actualizarHome() {
    let reportes = await DB.listarReportes();
    // FILTRO POR CORREO: cada bombero solo ve SUS propios reportes
    // Identificamos por operadorEmail (el correo con que se creó el reporte)
    if (this.usuario && this.usuario.email) {
      reportes = reportes.filter(r => {
        // Reportes legacy sin email se atribuyen al usuario actual la primera vez
        if (!r.operadorEmail) return true;
        return r.operadorEmail.toLowerCase() === this.usuario.email.toLowerCase();
      });
    }
    document.getElementById('statTotal').textContent = reportes.length;
    document.getElementById('statPendientes').textContent =
      reportes.filter(r => r.estado === 'pendiente').length;
    document.getElementById('statEnviados').textContent =
      reportes.filter(r => r.estado === 'enviado').length;

    const lista = document.getElementById('listaReportes');
    if (reportes.length === 0) {
      lista.innerHTML = `
        <div class="vacio-estado">
          <div class="icono">📋</div>
          <div>No hay reportes aún</div>
          <div style="font-size: 12px; margin-top: 4px;">Toque "Nueva emergencia" para empezar</div>
        </div>`;
      return;
    }
    lista.innerHTML = reportes.slice(0, 20).map(r => {
      const tipos = (r.clasificacion || []).slice(0, 2).join(', ') || 'Sin clasificar';
      const fecha = new Date(r.fechaCreacion).toLocaleString('es-CO', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });
      return `
        <div class="reporte-item ${r.estado}" onclick="app.verDetalle('${r.id}')">
          <div class="info">
            <div class="consec">${r.consecutivo || 'Sin asignar'}</div>
            <div class="desc">${tipos}</div>
            <div class="fecha">${fecha}</div>
          </div>
          <span class="badge ${r.estado}">${this.etiquetaEstado(r.estado)}</span>
        </div>`;
    }).join('');
  },

  etiquetaEstado(estado) {
    return { borrador: 'Borrador', pendiente: 'Pendiente', enviado: 'Enviado' }[estado] || estado;
  },

  // ==================== NUEVO REPORTE ====================
  generarConsecutivoLocal() {
    const anio = new Date().getFullYear();
    const numero = String(this.config.proximoNumero || 1).padStart(4, '0');
    return `${this.config.prefijo}-${anio}-${numero}`;
  },

  async nuevoReporte() {
    const ahora = new Date();
    this.reporteActual = {
      id: this.uuid(),
      consecutivo: '',  // El backend lo asigna al enviar
      estado: 'borrador',
      fechaCreacion: ahora.toISOString(),
      fechaModificacion: ahora.toISOString(),
      operador: this.usuario?.nombreCompleto || '',
      operadorEmail: this.usuario?.email || '',
      operadorGrado: this.usuario?.grado || '',
      operadorCC: this.usuario?.cedula || '',
      operadorTel: this.usuario?.telefono || '',
      clasificacion: [],
      causas: [],
      recursos: [],
      victimas: [],
      organizaciones: [],
      gps: null,
      gpsManual: false,
      fotos: [],
      firmas: {}
    };

    this.fotosTemp = [null, null, null, null, null, null];
    this.firmas = { afectado: null, comandante: null };
    this.modoUbicacion = 'auto';

    this.limpiarFormulario();
    document.getElementById('f_consecutivo').value = 'Se asigna al enviar';
    document.getElementById('f_fecha_llamada').value = this.fechaLocalISO(ahora);
    document.getElementById('f_municipio').value = 'Inírida';

    // Pre-llenar comandante con datos del usuario
    if (this.usuario && this.usuario.nombreCompleto) {
      document.getElementById('f_comandante_nombre').value = this.usuario.nombreCompleto;
      document.getElementById('f_comandante_grado').value = this.usuario.grado || '';
      document.getElementById('f_comandante_cc').value = this.usuario.cedula || '';
      document.getElementById('f_comandante_estacion').value = NOMBRE_ESTACION;
    }

    this.actualizarUIGPS();
    this.capturarGPS();
    this.actualizarProgreso();
    this.irA('pantallaForm');
  },

  limpiarFormulario() {
    document.querySelectorAll('#pantallaForm input:not([type=file]), #pantallaForm textarea').forEach(el => {
      if (el.type === 'checkbox') el.checked = false;
      else if (el.type === 'number') el.value = el.defaultValue || '';
      else el.value = '';
    });
    document.getElementById('f_municipio').value = 'Inírida';
    document.getElementById('f_comandante_estacion').value = NOMBRE_ESTACION;
    document.querySelectorAll('.foto-slot').forEach((slot, i) => {
      slot.innerHTML = `<span class="icono">📷</span><span>Foto ${i+1}</span>`;
      slot.classList.remove('con-foto');
    });
    this.limpiarFirma('firmaAfectado');
    this.limpiarFirma('firmaComandante');
    document.getElementById('tablaRecursos').innerHTML = '';
    document.getElementById('tablaVictimas').innerHTML = '';
    document.getElementById('tablaOrgs').innerHTML = '';
    document.getElementById('autoCompletarInfo').classList.remove('visible');
  },

  inicializarCheckboxes() {
    const clasif = document.getElementById('checkboxClasificacion');
    clasif.innerHTML = TIPOS_EVENTO.map(t => `
      <label class="checkbox-card">
        <input type="checkbox" value="${t}" data-grupo="clasificacion">
        <span>${t}</span>
      </label>
    `).join('');

    const causas = document.getElementById('checkboxCausas');
    causas.innerHTML = CAUSAS.map(c => `
      <label class="checkbox-card">
        <input type="checkbox" value="${c}" data-grupo="causas">
        <span>${c}</span>
      </label>
    `).join('');
  },

  // ==================== GPS Y AUTO-COMPLETADO ====================
  modoGPS(modo) {
    this.modoUbicacion = modo;
    this.actualizarUIGPS();
    if (modo === 'auto') {
      this.capturarGPS();
    } else {
      const coords = document.getElementById('gpsCoords');
      coords.textContent = 'Modo manual — escriba las coordenadas abajo';
      if (this.reporteActual?.gps) {
        document.getElementById('f_lat_manual').value = this.reporteActual.gps.lat || '';
        document.getElementById('f_lng_manual').value = this.reporteActual.gps.lng || '';
      }
    }
  },

  actualizarUIGPS() {
    const card = document.getElementById('gpsCard');
    const btnAuto = document.getElementById('btnGpsAuto');
    const btnManual = document.getElementById('btnGpsManual');
    const btnActualizar = document.getElementById('btnGpsActualizar');

    card.classList.remove('manual', 'error');
    btnAuto.classList.remove('activo');
    btnManual.classList.remove('activo');

    if (this.modoUbicacion === 'manual') {
      card.classList.add('manual');
      btnManual.classList.add('activo');
      btnActualizar.style.display = 'none';
      const detalles = document.getElementById('gpsDetalles');
      if (detalles) detalles.style.display = 'none';
    } else {
      btnAuto.classList.add('activo');
      btnActualizar.style.display = 'inline-block';
    }
  },

  // Convertir decimal a Grados Minutos Segundos (formato 3°52'11"N)
  decimalAGMS(decimal, esLatitud) {
    if (decimal === null || decimal === undefined || isNaN(decimal)) return '';
    const dir = decimal >= 0 ? (esLatitud ? 'N' : 'E') : (esLatitud ? 'S' : 'W');
    const abs = Math.abs(decimal);
    const grados = Math.floor(abs);
    const minutosFlotante = (abs - grados) * 60;
    const minutos = Math.floor(minutosFlotante);
    const segundos = Math.round((minutosFlotante - minutos) * 60);
    return `${grados}°${String(minutos).padStart(2,'0')}'${String(segundos).padStart(2,'0')}"${dir}`;
  },

  // Orientación brújula a texto (105 → "105° E")
  headingATexto(grados) {
    if (grados === null || grados === undefined || isNaN(grados)) return '';
    const g = Math.round(grados);
    let dir = 'N';
    if (g >= 22 && g < 67) dir = 'NE';
    else if (g >= 67 && g < 112) dir = 'E';
    else if (g >= 112 && g < 157) dir = 'SE';
    else if (g >= 157 && g < 202) dir = 'S';
    else if (g >= 202 && g < 247) dir = 'SW';
    else if (g >= 247 && g < 292) dir = 'W';
    else if (g >= 292 && g < 337) dir = 'NW';
    return `${g}° ${dir}`;
  },

  capturarGPS() {
    if (this.modoUbicacion !== 'auto') return;
    const card = document.getElementById('gpsCard');
    const coords = document.getElementById('gpsCoords');
    const detalles = document.getElementById('gpsDetalles');

    if (!navigator.geolocation) {
      coords.textContent = 'GPS no disponible. Use modo manual.';
      card.classList.add('error');
      return;
    }
    coords.textContent = '⏳ Obteniendo ubicación precisa...';
    card.classList.remove('error');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = pos.coords.accuracy;
        const altitude = pos.coords.altitude; // metros sobre nivel del mar (msnm)
        const speed = pos.coords.speed;       // m/s
        const speedKmh = (speed !== null && speed !== undefined) ? speed * 3.6 : null;
        const headingTxt = this.headingATexto(this._brujulaActual);
        const gmsLat = this.decimalAGMS(lat, true);
        const gmsLng = this.decimalAGMS(lng, false);
        const gmsTexto = `${gmsLat} ${gmsLng}`;

        // Resumen breve
        coords.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)} (±${Math.round(acc)}m)`;

        // Detalles completos
        if (detalles) {
          detalles.style.display = 'block';
          detalles.innerHTML = `
            <div class="gps-fila"><span class="gps-etiq">📍 Coords GMS:</span><span class="gps-val">${gmsTexto}</span></div>
            <div class="gps-fila"><span class="gps-etiq">🌐 Decimal:</span><span class="gps-val">${lat.toFixed(6)}, ${lng.toFixed(6)}</span></div>
            <div class="gps-fila"><span class="gps-etiq">🎯 Precisión:</span><span class="gps-val">±${Math.round(acc)} m</span></div>
            ${altitude !== null && altitude !== undefined ? `<div class="gps-fila"><span class="gps-etiq">⛰️ Altitud:</span><span class="gps-val">${altitude.toFixed(1)} msnm</span></div>` : ''}
            ${speedKmh !== null && speedKmh !== undefined ? `<div class="gps-fila"><span class="gps-etiq">💨 Velocidad:</span><span class="gps-val">${speedKmh.toFixed(1)} km/h</span></div>` : ''}
            ${headingTxt ? `<div class="gps-fila"><span class="gps-etiq">🧭 Orientación:</span><span class="gps-val">${headingTxt}</span></div>` : '<div class="gps-fila"><span class="gps-etiq">🧭 Orientación:</span><button onclick="app.activarBrujula()" style="background:rgba(255,255,255,0.2);color:white;border:none;padding:3px 8px;border-radius:3px;font-size:10px;cursor:pointer;">Activar brújula</button></div>'}
            <div class="gps-fila"><span class="gps-etiq">🕒 Capturado:</span><span class="gps-val">${new Date().toLocaleString('es-CO')}</span></div>
          `;
        }

        if (this.reporteActual) {
          this.reporteActual.gps = {
            lat, lng,
            accuracy: acc,
            altitude: altitude !== null ? altitude : null,
            speedKmh: speedKmh,
            heading: headingTxt
          };
          this.reporteActual.gpsGMS = gmsTexto;
          this.reporteActual.gpsManual = false;
        }
        // Auto-completar dirección
        this.autoCompletarDireccion(lat, lng);
        this.actualizarProgreso();
      },
      (err) => {
        const msgs = {
          1: 'Permiso denegado. Active GPS en su celular o use modo manual.',
          2: 'Sin señal GPS. Salga al exterior o use modo manual.',
          3: 'Tiempo agotado. Reintente o use modo manual.'
        };
        coords.textContent = msgs[err.code] || 'Error de GPS';
        card.classList.add('error');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  },

  // Activar brújula del celular (requiere permiso en iOS)
  async activarBrujula() {
    try {
      // iOS 13+ requiere permiso explícito
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permiso = await DeviceOrientationEvent.requestPermission();
        if (permiso !== 'granted') {
          this.toast('Permiso de brújula denegado', 'error');
          return;
        }
      }
      this.iniciarEscuchaBrujula();
      this.toast('Brújula activada. Vuelva a tocar GPS.', 'exito');
    } catch (e) {
      console.error('Error activando brújula:', e);
      this.toast('Brújula no disponible', 'error');
    }
  },

  iniciarEscuchaBrujula() {
    if (this._brujulaActiva) return;
    this._brujulaActiva = true;
    const handler = (e) => {
      // En iOS Safari: webkitCompassHeading; en otros navegadores: alpha
      let heading = null;
      if (typeof e.webkitCompassHeading === 'number') {
        heading = e.webkitCompassHeading;
      } else if (e.alpha !== null && e.alpha !== undefined) {
        heading = (360 - e.alpha) % 360;
      }
      if (heading !== null) this._brujulaActual = heading;
    };
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handler);
    } else {
      window.addEventListener('deviceorientation', handler);
    }
  },

  async autoCompletarDireccion(lat, lng) {
    if (!navigator.onLine) return;

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'CBVI-Reportes/4.1 (gilrangeljeancarlosjeferson@gmail.com)' }
      });
      if (!resp.ok) return;
      const data = await resp.json();
      if (!data || !data.address) return;

      const addr = data.address;
      const direccionInput = document.getElementById('f_direccion');
      const barrioInput = document.getElementById('f_barrio');
      const localidadInput = document.getElementById('f_localidad');
      const municipioInput = document.getElementById('f_municipio');
      const referenciaInput = document.getElementById('f_referencia');

      let huboCambio = false;

      // Solo llenar si están vacíos (no sobrescribir lo que el bombero ya escribió)
      if (!direccionInput.value) {
        const partesDir = [];
        if (addr.road) partesDir.push(addr.road);
        if (addr.house_number) partesDir.push('#' + addr.house_number);
        if (partesDir.length > 0) {
          direccionInput.value = partesDir.join(' ');
          huboCambio = true;
        }
      }

      if (!barrioInput.value) {
        const barrio = addr.suburb || addr.neighbourhood || addr.quarter ||
                       addr.village || addr.hamlet || '';
        if (barrio) { barrioInput.value = barrio; huboCambio = true; }
      }

      if (!localidadInput.value) {
        const loc = addr.city_district || addr.borough || addr.county || '';
        if (loc) { localidadInput.value = loc; huboCambio = true; }
      }

      if (!municipioInput.value || municipioInput.value === 'Inírida') {
        const mun = addr.city || addr.town || addr.municipality || '';
        if (mun) { municipioInput.value = mun; huboCambio = true; }
      }

      // Si Nominatim no dio dirección detallada, sugerir el display_name como referencia
      if (!referenciaInput.value && data.display_name && !direccionInput.value) {
        referenciaInput.value = data.display_name;
        huboCambio = true;
      }

      const aviso = document.getElementById('autoCompletarInfo');
      if (huboCambio) {
        aviso.classList.add('visible');
        aviso.innerHTML = '✅ Datos detectados automáticamente. Puede editar abajo si necesita corregir.';
      } else {
        aviso.classList.add('visible');
        aviso.innerHTML = '⚠️ El GPS detectó la zona pero <strong>no tiene la dirección detallada</strong> registrada. Por favor escriba la dirección manualmente abajo. Las coordenadas SÍ quedaron guardadas.';
      }
    } catch (err) {
      console.log('No se pudo auto-completar dirección:', err);
      const aviso = document.getElementById('autoCompletarInfo');
      aviso.classList.add('visible');
      aviso.innerHTML = '⚠️ Sin internet o falló auto-completado. Escriba la dirección manualmente. Las coordenadas SÍ quedaron guardadas.';
    }
  },

  // ==================== FOTOS ====================
  configurarFoto() {
    const handler = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const slot = this.fotoSlotActivo;
      if (slot === null) return;
      const dataUrl = await this.comprimirImagen(file, 1280, 0.7);
      this.fotosTemp[slot] = dataUrl;
      const slotEl = document.querySelector(`.foto-slot[data-foto="${slot}"]`);
      slotEl.innerHTML = `
        <img src="${dataUrl}" alt="">
        <button class="quitar" onclick="event.stopPropagation(); app.quitarFoto(${slot})">×</button>
      `;
      slotEl.classList.add('con-foto');
      e.target.value = '';
      this.actualizarProgreso();
    };
    document.getElementById('inputFotoCamara').addEventListener('change', handler);
    document.getElementById('inputFotoGaleria').addEventListener('change', handler);
  },

  elegirFoto(slot) {
    this.fotoSlotActivo = slot;
    document.getElementById('modalFotoOpciones').classList.add('visible');
  },

  cerrarModalFoto() {
    document.getElementById('modalFotoOpciones').classList.remove('visible');
    this.fotoSlotActivo = null;
  },

  tomarFoto(origen) {
    document.getElementById('modalFotoOpciones').classList.remove('visible');
    if (this.fotoSlotActivo === null) return;
    const input = origen === 'camara'
      ? document.getElementById('inputFotoCamara')
      : document.getElementById('inputFotoGaleria');
    input.click();
  },

  quitarFoto(slot) {
    this.fotosTemp[slot] = null;
    const slotEl = document.querySelector(`.foto-slot[data-foto="${slot}"]`);
    slotEl.innerHTML = `<span class="icono">📷</span><span>Foto ${slot+1}</span>`;
    slotEl.classList.remove('con-foto');
    this.actualizarProgreso();
  },

  comprimirImagen(file, maxWidth, calidad) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxWidth) { h = h * maxWidth / w; w = maxWidth; }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', calidad));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // ==================== FIRMAS ====================
  inicializarFirmas() {
    ['firmaAfectado', 'firmaComandante'].forEach(id => this.configurarCanvasFirma(id));
  },

  configurarCanvasFirma(canvasId) {
    const canvas = document.getElementById(canvasId);
    const observer = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0) {
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#1a1a1a';
      }
    });
    observer.observe(canvas);

    let dibujando = false;
    let tieneFirma = false;
    const ctx = canvas.getContext('2d');

    const inicio = (e) => {
      e.preventDefault();
      dibujando = true;
      tieneFirma = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
      const y = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    const dibujar = (e) => {
      if (!dibujando) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
      const y = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const fin = () => {
      if (dibujando && tieneFirma) {
        const tipo = canvasId === 'firmaAfectado' ? 'afectado' : 'comandante';
        this.firmas[tipo] = canvas.toDataURL('image/png');
      }
      dibujando = false;
    };

    canvas.addEventListener('mousedown', inicio);
    canvas.addEventListener('mousemove', dibujar);
    canvas.addEventListener('mouseup', fin);
    canvas.addEventListener('mouseleave', fin);
    canvas.addEventListener('touchstart', inicio, { passive: false });
    canvas.addEventListener('touchmove', dibujar, { passive: false });
    canvas.addEventListener('touchend', fin);
  },

  limpiarFirma(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const tipo = canvasId === 'firmaAfectado' ? 'afectado' : 'comandante';
    this.firmas[tipo] = null;
  },

  // Redibuja las firmas guardadas en sus canvas correspondientes.
  // Se llama al cargar un borrador o al editar un reporte enviado.
  // Reintenta hasta 3 segundos por si el canvas no es visible aún.
  redibujarFirmasGuardadas() {
    ['firmaAfectado', 'firmaComandante'].forEach(canvasId => {
      const tipo = canvasId === 'firmaAfectado' ? 'afectado' : 'comandante';
      const dataURL = this.firmas[tipo];
      if (!dataURL) return;

      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      let intentos = 0;
      const dibujar = () => {
        const rect = canvas.getBoundingClientRect();
        // Si el canvas no es visible o no tiene dimensiones, reintentar
        if (rect.width === 0 || canvas.width === 0) {
          if (intentos < 30) {
            intentos++;
            setTimeout(dibujar, 100);
          }
          return;
        }

        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          // Guardar transformación actual (que tiene scale 2,2 por high-DPI)
          ctx.save();
          // Resetear a identidad para dibujar al tamaño nativo del canvas
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Restaurar transformación (vuelve a tener scale 2,2 para futuros trazos)
          ctx.restore();
        };
        img.src = dataURL;
      };
      dibujar();
    });
  },

  // ==================== TABLAS DINÁMICAS ====================
  agregarRecurso(datos) {
    const cont = document.getElementById('tablaRecursos');
    const div = document.createElement('div');
    div.className = 'fila';
    div.innerHTML = `
      <button class="quitar-fila" onclick="this.parentElement.remove()">×</button>
      <div class="campo">
        <label>Recurso</label>
        <select data-campo="recurso" onchange="app.cambioTipoRecurso(this)">
          <option value="">-- Seleccione --</option>
          <option>Máquina extintora 1</option>
          <option>Máquina extintora 2</option>
          <option>Intervención rápida (camioneta)</option>
          <option>Carro tanque 1</option>
          <option>Carro tanque 2</option>
          <option>Vehículo liviano</option>
          <option>Ambulancia</option>
          <option>Personal</option>
          <option>Otro</option>
        </select>
        <input type="text" data-campo="recurso_otro" placeholder="Especifique" style="display:none; margin-top: 6px;">
      </div>
      <div class="campo-fila">
        <div class="campo"><label>Cantidad</label><input type="number" data-campo="cantidad" min="0" value="1"></div>
        <div class="campo"><label>Placa/Código</label><input type="text" data-campo="codigo"></div>
      </div>
      <div class="campo">
        <label>Responsable / Maquinista</label>
        <input type="text" data-campo="responsable" placeholder="Nombre del bombero a cargo"
               oninput="app.autocompletarBombero(this)" autocomplete="off">
        <div class="autocomplete-lista" style="display:none;"></div>
      </div>
      <div class="campo personal-bloque" style="display:none;">
        <label>Bomberos asistentes</label>
        <div class="personal-lista" data-personal></div>
        <button type="button" class="agregar-personal" onclick="app.agregarBombero(this)">+ Agregar bombero</button>
      </div>
    `;
    cont.appendChild(div);

    if (datos) {
      const sel = div.querySelector('[data-campo="recurso"]');
      const opciones = ['Máquina extintora 1', 'Máquina extintora 2', 'Intervención rápida (camioneta)', 'Carro tanque 1', 'Carro tanque 2', 'Vehículo liviano', 'Ambulancia', 'Personal', 'Otro'];
      if (opciones.includes(datos.recurso)) {
        sel.value = datos.recurso;
      } else if (datos.recurso) {
        sel.value = 'Otro';
        div.querySelector('[data-campo="recurso_otro"]').value = datos.recurso;
        div.querySelector('[data-campo="recurso_otro"]').style.display = 'block';
      }
      this.cambioTipoRecurso(sel);
      div.querySelector('[data-campo="cantidad"]').value = datos.cantidad || 1;
      div.querySelector('[data-campo="codigo"]').value = datos.codigo || '';
      div.querySelector('[data-campo="responsable"]').value = datos.responsable || '';
      if (datos.personal && Array.isArray(datos.personal)) {
        datos.personal.forEach(nombre => this.agregarBomberoConNombre(div, nombre));
      }
    }
  },

  cambioTipoRecurso(select) {
    const fila = select.closest('.fila');
    const otroInput = fila.querySelector('[data-campo="recurso_otro"]');
    const personalBloque = fila.querySelector('.personal-bloque');

    if (select.value === 'Otro') otroInput.style.display = 'block';
    else otroInput.style.display = 'none';

    if (select.value === 'Personal') personalBloque.style.display = 'block';
    else personalBloque.style.display = 'none';
  },

  agregarBombero(btn) {
    this.agregarBomberoConNombre(btn.closest('.fila'), '');
  },

  agregarBomberoConNombre(filaRecurso, nombre) {
    const lista = filaRecurso.querySelector('[data-personal]');
    const item = document.createElement('div');
    item.className = 'item-personal';
    item.style.cssText = 'position:relative;';
    item.innerHTML = `
      <input type="text" placeholder="Escriba nombre del bombero..." value="${nombre.replace(/"/g, '&quot;')}"
             oninput="app.autocompletarBombero(this)" autocomplete="off"
             style="flex:1;">
      <div class="autocomplete-lista" style="display:none;"></div>
      <button type="button" class="quitar-personal" onclick="this.closest('.item-personal').remove()">×</button>
    `;
    lista.appendChild(item);
  },

  // Autocompletado de nombres de bomberos usando PERSONAL_CANONICO
  // ─── AUTOCOMPLETADO DE BOMBEROS ───────────────────────────────────────
  // Estrategia: un único listener global en document para manejar la
  // selección. Evita el problema de blur vs click/touch en móvil y APK.
  _initAutocompletadoGlobal() {
    if (this._autocompletadoGlobalListo) return;
    this._autocompletadoGlobalListo = true;

    // Cerrar cualquier lista abierta al tocar fuera
    document.addEventListener('touchstart', (e) => {
      if (!e.target.closest('.autocomplete-lista') &&
          !e.target.closest('input[oninput*="autocompletarBombero"]')) {
        document.querySelectorAll('.autocomplete-lista').forEach(l => l.style.display = 'none');
      }
    }, { passive: true });

    document.addEventListener('mousedown', (e) => {
      // Si el click es DENTRO de una lista de autocompletado → seleccionar
      const item = e.target.closest('.autocomplete-item');
      if (item) {
        e.preventDefault();
        const nombre = item.dataset.nombre;
        const lista = item.closest('.autocomplete-lista');
        if (lista && nombre) {
          // Encontrar el input asociado a esta lista
          const contenedor = lista.parentElement;
          const inp = contenedor.querySelector('input[type="text"]');
          if (inp) inp.value = nombre;
          lista.style.display = 'none';
        }
        return;
      }
      // Si el click es fuera de cualquier lista → cerrar todas
      if (!e.target.closest('.autocomplete-lista')) {
        document.querySelectorAll('.autocomplete-lista').forEach(l => l.style.display = 'none');
      }
    });
  },

  autocompletarBombero(input) {
    // Inicializar listener global la primera vez
    this._initAutocompletadoGlobal();

    // Asociar blur con delay solo una vez por input
    if (!input._autoBlurListo) {
      input._autoBlurListo = true;
      input.addEventListener('blur', () => {
        // Delay: deja que el mousedown global se procese primero
        setTimeout(() => {
          const lista = input.parentElement.querySelector('.autocomplete-lista');
          if (lista) lista.style.display = 'none';
        }, 250);
      });
    }

    const lista = input.parentElement.querySelector('.autocomplete-lista');
    if (!lista) return;

    const q = input.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (q.length < 2) { lista.style.display = 'none'; return; }

    const coincidencias = (typeof PERSONAL_CANONICO !== 'undefined' ? PERSONAL_CANONICO : [])
      .filter(p => {
        const haystack = (p.nombre + ' ' + p.cargo + ' ' + p.rango)
          .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return haystack.includes(q);
      })
      .slice(0, 8);

    if (coincidencias.length === 0) { lista.style.display = 'none'; return; }

    // Construir items con data-nombre en el elemento — el listener global los lee
    lista.innerHTML = coincidencias.map(p =>
      `<div class="autocomplete-item" data-nombre="${p.nombre.replace(/"/g, '&quot;')}">
        <span style="font-weight:600;pointer-events:none;">${p.nombre}</span>
        <span style="font-size:11px;color:#666;margin-left:8px;pointer-events:none;">${p.cargo}</span>
      </div>`
    ).join('');

    lista.style.cssText = [
      'display:block', 'position:absolute', 'top:100%', 'left:0', 'right:0',
      'background:#fff', 'border:1px solid #ccc', 'border-radius:0 0 6px 6px',
      'z-index:9999', 'max-height:200px', 'overflow-y:auto',
      'box-shadow:0 4px 12px rgba(0,0,0,0.15)'
    ].join(';');
  },

  seleccionarBombero() { /* deprecated — manejo vía listener global */ },

  agregarVictima(datos) {
    const cont = document.getElementById('tablaVictimas');
    const div = document.createElement('div');
    div.className = 'fila';
    div.innerHTML = `
      <button class="quitar-fila" onclick="this.parentElement.remove()">×</button>
      <div class="campo-fila">
        <div class="campo"><label>Nombre</label><input type="text" data-campo="nombre" placeholder="Nombre de la víctima"></div>
        <div class="campo"><label>Edad</label><input type="number" data-campo="edad" min="0"></div>
      </div>
      <div class="campo">
        <label>Tipo</label>
        <select data-campo="tipo">
          <option>Lesionado</option><option>Fallecido</option><option>Ileso</option>
        </select>
      </div>
      <div class="campo"><label>Lesiones</label><input type="text" data-campo="lesiones" placeholder="Ej. quemaduras de 2do grado"></div>
      <div class="campo"><label>Atención brindada</label><input type="text" data-campo="atencion" placeholder="Ej. primeros auxilios, oxígeno"></div>
      <div class="campo"><label>Trasladado a</label><input type="text" data-campo="traslado" placeholder="Ej. Hospital Manuel Elkin Patarroyo"></div>
    `;
    cont.appendChild(div);
    if (datos) {
      div.querySelectorAll('[data-campo]').forEach(inp => {
        if (datos[inp.dataset.campo] !== undefined) inp.value = datos[inp.dataset.campo];
      });
    }
  },

  agregarOrg(datos) {
    const cont = document.getElementById('tablaOrgs');
    const div = document.createElement('div');
    div.className = 'fila';
    div.innerHTML = `
      <button class="quitar-fila" onclick="this.parentElement.remove()">×</button>
      <div class="campo"><label>Entidad / Persona</label><input type="text" data-campo="entidad" placeholder="Ej. Policía Nacional, Defensa Civil"></div>
      <div class="campo"><label>Rol / Función</label><input type="text" data-campo="rol" placeholder="Ej. Acordonamiento, traslado de heridos"></div>
      <div class="campo"><label>Contacto</label><input type="text" data-campo="contacto" placeholder="Nombre y teléfono"></div>
    `;
    cont.appendChild(div);
    if (datos) {
      div.querySelectorAll('[data-campo]').forEach(inp => {
        if (datos[inp.dataset.campo] !== undefined) inp.value = datos[inp.dataset.campo];
      });
    }
  },

  toggleSeccion(header) {
    header.parentElement.classList.toggle('colapsada');
  },

  // ==================== LECTURA / ESCRITURA FORMULARIO ====================
  leerFormulario() {
    const r = this.reporteActual;
    r.fechaModificacion = new Date().toISOString();
    r.estacion = NOMBRE_ESTACION;
    r.fechaLlamada = document.getElementById('f_fecha_llamada').value;
    r.fechaLlegada = document.getElementById('f_fecha_llegada').value;
    r.fechaCierre = document.getElementById('f_fecha_cierre').value;
    r.reportaNombre = document.getElementById('f_reporta_nombre').value;
    r.reportaTel = document.getElementById('f_reporta_tel').value;
    r.reportaRelacion = document.getElementById('f_reporta_relacion').value;
    r.turno = document.getElementById('f_turno').value;

    r.clasificacion = Array.from(document.querySelectorAll('[data-grupo="clasificacion"]:checked')).map(c => c.value);
    r.clasificacionOtra = document.getElementById('f_clasif_otra').value;

    if (this.modoUbicacion === 'manual') {
      const lat = parseFloat(document.getElementById('f_lat_manual').value);
      const lng = parseFloat(document.getElementById('f_lng_manual').value);
      if (!isNaN(lat) && !isNaN(lng)) {
        r.gps = { lat, lng, accuracy: 0, altitude: null, speedKmh: null, heading: '' };
        r.gpsGMS = `${this.decimalAGMS(lat, true)} ${this.decimalAGMS(lng, false)}`;
        r.gpsManual = true;
      }
    }

    r.direccion = document.getElementById('f_direccion').value;
    r.barrio = document.getElementById('f_barrio').value;
    r.localidad = document.getElementById('f_localidad').value;
    r.municipio = document.getElementById('f_municipio').value;
    r.referencia = document.getElementById('f_referencia').value;

    r.narrativa = document.getElementById('f_narrativa').value;
    r.condiciones = document.getElementById('f_condiciones').value;
    r.fotos = this.fotosTemp.filter(f => f);

    r.recursos = this.leerRecursos();
    r.victimas = this.leerTabla('tablaVictimas');
    r.organizaciones = this.leerTabla('tablaOrgs');

    r.muertos = +document.getElementById('f_muertos').value || 0;
    r.heridos = +document.getElementById('f_heridos').value || 0;
    r.desaparecidos = +document.getElementById('f_desaparecidos').value || 0;
    r.personasAfectadas = +document.getElementById('f_personas_afectadas').value || 0;
    r.familiasAfectadas = +document.getElementById('f_familias_afectadas').value || 0;
    r.viviendasDestruidas = +document.getElementById('f_viv_destruidas').value || 0;
    r.viviendasAveriadas = +document.getElementById('f_viv_averiadas').value || 0;
    r.hectareas = +document.getElementById('f_hectareas').value || 0;
    r.viasAfectadas = +document.getElementById('f_vias').value || 0;
    r.puentesAfectados = +document.getElementById('f_puentes').value || 0;
    r.perdidaEstimada = +document.getElementById('f_perdida').value || 0;
    r.zonaOrigen = document.getElementById('f_origen').value;
    r.areasAfectadas = document.getElementById('f_areas_afectadas').value;

    r.afectadoNombre = document.getElementById('f_afectado_nombre').value;
    r.afectadoCC = document.getElementById('f_afectado_cc').value;
    r.afectadoCel = document.getElementById('f_afectado_cel').value;

    r.acciones = document.getElementById('f_acciones').value;

    r.causas = Array.from(document.querySelectorAll('[data-grupo="causas"]:checked')).map(c => c.value);
    r.causaProbable = document.getElementById('f_causa_prob').value;
    r.evidencias = document.getElementById('f_evidencias').value;
    r.causaConfirmada = document.getElementById('f_causa_confirm').value;

    r.observaciones = document.getElementById('f_observaciones').value;
    r.recomendaciones = document.getElementById('f_recomendaciones').value;

    r.comandanteNombre = document.getElementById('f_comandante_nombre').value;
    r.comandanteGrado = document.getElementById('f_comandante_grado').value;
    r.comandanteCC = document.getElementById('f_comandante_cc').value;
    r.comandanteEstacion = document.getElementById('f_comandante_estacion').value;

    // Datos del operador (quien creó el reporte) - viene del usuario logueado
    r.operador = this.usuario?.nombreCompleto || '';
    r.operadorEmail = this.usuario?.email || '';
    r.operadorGrado = this.usuario?.grado || '';
    r.operadorCC = this.usuario?.cedula || '';
    r.operadorTel = this.usuario?.telefono || '';

    r.firmas = { ...this.firmas };
    return r;
  },

  leerRecursos() {
    const filas = document.querySelectorAll('#tablaRecursos .fila');
    return Array.from(filas).map(fila => {
      const sel = fila.querySelector('[data-campo="recurso"]');
      let recurso = sel.value;
      if (recurso === 'Otro') {
        recurso = fila.querySelector('[data-campo="recurso_otro"]').value || 'Otro';
      }
      const personal = Array.from(fila.querySelectorAll('[data-personal] input'))
        .map(i => i.value.trim()).filter(v => v);
      return {
        recurso,
        cantidad: fila.querySelector('[data-campo="cantidad"]').value,
        codigo: fila.querySelector('[data-campo="codigo"]').value,
        responsable: fila.querySelector('[data-campo="responsable"]').value,
        personal
      };
    });
  },

  leerTabla(idTabla) {
    const filas = document.querySelectorAll(`#${idTabla} .fila`);
    return Array.from(filas).map(fila => {
      const obj = {};
      fila.querySelectorAll('[data-campo]').forEach(input => {
        obj[input.dataset.campo] = input.value;
      });
      return obj;
    });
  },

  // Convierte una fecha ISO o cualquier string parseable a 'YYYY-MM-DDTHH:MM'
  // que es el formato requerido por <input type="datetime-local">.
  // Devuelve '' si la fecha no es válida o está vacía.
  _isoADatetimeLocal(v) {
    if (!v) return '';
    // Si ya viene en formato datetime-local (sin Z ni segundos), respetar
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) {
      return v;
    }
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    // Construir 'YYYY-MM-DDTHH:MM' en HORA LOCAL (no UTC)
    const pad = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' +
           pad(d.getMonth() + 1) + '-' +
           pad(d.getDate()) + 'T' +
           pad(d.getHours()) + ':' +
           pad(d.getMinutes());
  },

  cargarEnFormulario(r) {
    document.getElementById('f_consecutivo').value = r.consecutivo || 'Se asigna al enviar';
    document.getElementById('f_fecha_llamada').value = this._isoADatetimeLocal(r.fechaLlamada);
    document.getElementById('f_fecha_llegada').value = this._isoADatetimeLocal(r.fechaLlegada);
    document.getElementById('f_fecha_cierre').value = this._isoADatetimeLocal(r.fechaCierre);
    document.getElementById('f_reporta_nombre').value = r.reportaNombre || '';
    document.getElementById('f_reporta_tel').value = r.reportaTel || '';
    document.getElementById('f_reporta_relacion').value = r.reportaRelacion || '';
    document.getElementById('f_turno').value = r.turno || '';

    document.querySelectorAll('[data-grupo="clasificacion"]').forEach(c => {
      c.checked = (r.clasificacion || []).includes(c.value);
    });
    document.getElementById('f_clasif_otra').value = r.clasificacionOtra || '';

    document.getElementById('f_direccion').value = r.direccion || '';
    document.getElementById('f_barrio').value = r.barrio || '';
    document.getElementById('f_localidad').value = r.localidad || '';
    document.getElementById('f_municipio').value = r.municipio || 'Inírida';
    document.getElementById('f_referencia').value = r.referencia || '';

    document.getElementById('f_narrativa').value = r.narrativa || '';
    document.getElementById('f_condiciones').value = r.condiciones || '';

    // FIX foto fantasma: primero limpiar TODOS los 6 slots (no solo los que
    // tengan foto), si no quedan visibles las del reporte anterior.
    this.fotosTemp = [null, null, null, null, null, null];
    document.querySelectorAll('.foto-slot').forEach((slot, i) => {
      slot.innerHTML = `<span class="icono">📷</span><span>Foto ${i+1}</span>`;
      slot.classList.remove('con-foto');
    });
    (r.fotos || []).forEach((f, i) => {
      if (i < 6 && f) {
        this.fotosTemp[i] = f;
        const slotEl = document.querySelector(`.foto-slot[data-foto="${i}"]`);
        if (slotEl) {
          slotEl.innerHTML = `
            <img src="${f}" alt="">
            <button class="quitar" onclick="event.stopPropagation(); app.quitarFoto(${i})">×</button>
          `;
          slotEl.classList.add('con-foto');
        }
      }
    });

    document.getElementById('tablaRecursos').innerHTML = '';
    (r.recursos || []).forEach(rec => this.agregarRecurso(rec));

    document.getElementById('tablaVictimas').innerHTML = '';
    (r.victimas || []).forEach(v => this.agregarVictima(v));

    document.getElementById('tablaOrgs').innerHTML = '';
    (r.organizaciones || []).forEach(o => this.agregarOrg(o));

    document.getElementById('f_muertos').value = r.muertos || 0;
    document.getElementById('f_heridos').value = r.heridos || 0;
    document.getElementById('f_desaparecidos').value = r.desaparecidos || 0;
    document.getElementById('f_personas_afectadas').value = r.personasAfectadas || 0;
    document.getElementById('f_familias_afectadas').value = r.familiasAfectadas || 0;
    document.getElementById('f_viv_destruidas').value = r.viviendasDestruidas || 0;
    document.getElementById('f_viv_averiadas').value = r.viviendasAveriadas || 0;
    document.getElementById('f_hectareas').value = r.hectareas || 0;
    document.getElementById('f_vias').value = r.viasAfectadas || 0;
    document.getElementById('f_puentes').value = r.puentesAfectados || 0;
    document.getElementById('f_perdida').value = r.perdidaEstimada || 0;
    document.getElementById('f_origen').value = r.zonaOrigen || '';
    document.getElementById('f_areas_afectadas').value = r.areasAfectadas || '';

    document.getElementById('f_afectado_nombre').value = r.afectadoNombre || '';
    document.getElementById('f_afectado_cc').value = r.afectadoCC || '';
    document.getElementById('f_afectado_cel').value = r.afectadoCel || '';

    document.getElementById('f_acciones').value = r.acciones || '';

    document.querySelectorAll('[data-grupo="causas"]').forEach(c => {
      c.checked = (r.causas || []).includes(c.value);
    });
    document.getElementById('f_causa_prob').value = r.causaProbable || '';
    document.getElementById('f_evidencias').value = r.evidencias || '';
    document.getElementById('f_causa_confirm').value = r.causaConfirmada || '';

    document.getElementById('f_observaciones').value = r.observaciones || '';
    document.getElementById('f_recomendaciones').value = r.recomendaciones || '';

    document.getElementById('f_comandante_nombre').value = r.comandanteNombre || '';
    document.getElementById('f_comandante_grado').value = r.comandanteGrado || '';
    document.getElementById('f_comandante_cc').value = r.comandanteCC || '';
    document.getElementById('f_comandante_estacion').value = r.comandanteEstacion || NOMBRE_ESTACION;

    this.firmas = { ...(r.firmas || {}) };
    // Redibujar las firmas guardadas en los canvas (fix bug firma vacía al editar)
    this.redibujarFirmasGuardadas();
    this.modoUbicacion = r.gpsManual ? 'manual' : 'auto';
    this.actualizarUIGPS();

    if (r.gps) {
      const coords = `${r.gps.lat.toFixed(6)}, ${r.gps.lng.toFixed(6)}`;
      document.getElementById('gpsCoords').textContent = r.gpsManual
        ? `${coords} (manual)`
        : `${coords} (±${Math.round(r.gps.accuracy)}m)`;
      document.getElementById('f_lat_manual').value = r.gps.lat;
      document.getElementById('f_lng_manual').value = r.gps.lng;
    }

    this.actualizarProgreso();
  },

  actualizarProgreso() {
    const total = 13;
    let llenas = 0;
    if (document.getElementById('f_reporta_nombre').value) llenas++;
    if (document.querySelectorAll('[data-grupo="clasificacion"]:checked').length > 0) llenas++;
    if (document.getElementById('f_direccion').value) llenas++;
    if (document.getElementById('f_narrativa').value) llenas++;
    if (document.getElementById('tablaRecursos').children.length > 0) llenas++;
    if (+document.getElementById('f_personas_afectadas').value > 0 || +document.getElementById('f_muertos').value > 0 || +document.getElementById('f_heridos').value > 0) llenas++;
    if (document.getElementById('f_afectado_nombre').value) llenas++;
    if (document.getElementById('f_acciones').value) llenas++;
    if (document.getElementById('tablaVictimas').children.length > 0 || (+document.getElementById('f_heridos').value === 0 && +document.getElementById('f_muertos').value === 0)) llenas++;
    if (document.querySelectorAll('[data-grupo="causas"]:checked').length > 0) llenas++;
    llenas++;
    llenas++;
    if (document.getElementById('f_comandante_nombre').value) llenas++;

    const pct = Math.min(100, Math.round((llenas / total) * 100));
    document.getElementById('progresoFill').style.width = pct + '%';
    document.getElementById('progresoTexto').textContent = pct + '%';
  },

  // ==================== GUARDAR Y ENVIAR ====================
  async guardarBorrador() {
    const r = this.leerFormulario();
    r.estado = 'borrador';
    await DB.guardarReporte(r);
    this.toast('Borrador guardado', 'exito');
    if (navigator.vibrate) navigator.vibrate(50);
    this.irA('pantallaHome');
  },

  async enviarReporte() {
    const r = this.leerFormulario();
    if (!r.narrativa || !r.direccion || !r.comandanteNombre || !r.fechaLlamada) {
      this.toast('Faltan: fecha llamada, narrativa, dirección y comandante', 'error');
      return;
    }
    r.estado = 'pendiente';

    // === EDICIÓN vs CREACIÓN ===
    // Si esta sesión del formulario es una edición de un reporte que ya está
    // en el servidor, preservamos el consecutivo y marcamos _actualizar:true
    // para que el backend actualice la fila + regenere hojas auxiliares
    // (Recursos, Personal, Victimas, Organizaciones, Bonificaciones).
    // Si es uno nuevo: consecutivo vacío → el servidor asigna nuevo.
    const esEdicion = this._esEdicionReporteExistente && r.id === this._idReporteEditandoBombero;
    if (esEdicion) {
      r.consecutivo = this._consecutivoOriginalBombero || '';
      r._actualizar = true;
    } else {
      r.consecutivo = '';
    }

    await DB.guardarReporte(r);

    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    this.toast(esEdicion ? 'Cambios guardados. Sincronizando...' : 'Reporte guardado. Sincronizando...', 'exito');
    this.irA('pantallaHome');

    if (navigator.onLine && this.config.urlBackend) {
      this.sincronizarReporte(r);
    }

    // Limpiar bandera de edición después de enviar
    this._esEdicionReporteExistente = false;
    this._idReporteEditandoBombero = null;
    this._consecutivoOriginalBombero = '';
  },

  async sincronizarReporte(reporte) {
    if (!this.config.urlBackend) return false;
    try {
      const payload = { ...reporte, token: this.config.token || '' };
      // Usamos modo 'cors' para PODER LEER la respuesta del servidor
      // El servidor devuelve el consecutivo asignado oficialmente
      const resp = await fetch(this.config.urlBackend, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      let consecutivoServidor = '';
      try {
        const data = await resp.json();
        if (data && data.ok && data.consecutivo) {
          consecutivoServidor = data.consecutivo;
        }
      } catch (e) {
        // Si no se puede leer la respuesta (no-cors fallback), seguimos
        console.warn('No se pudo leer respuesta del servidor:', e);
      }

      // Si el servidor devolvió un consecutivo, lo guardamos en el reporte local
      if (consecutivoServidor) {
        reporte.consecutivo = consecutivoServidor;
      }

      reporte.estado = 'enviado';
      reporte.fechaEnviado = new Date().toISOString();
      delete reporte._actualizar; // bandera temporal, no debe persistir local
      await DB.guardarReporte(reporte);
      this.actualizarHome();
      return true;
    } catch (err) {
      console.error('Error al sincronizar:', err);
      return false;
    }
  },

  // Solo admin: renumerar reportes en el servidor
  async renumerarReportes() {
    if (!this.esAdmin()) {
      this.toast('Solo el administrador puede renumerar', 'error');
      return;
    }
    if (!this.config.urlBackend) {
      this.toast('Configure URL del backend primero', 'error');
      return;
    }
    const ok = await this.confirmar(
      '⚠️ Renumerar todos los reportes',
      'Esto reasignará TODOS los consecutivos en orden cronológico. La acción NO se puede deshacer. ¿Continuar?'
    );
    if (!ok) return;

    this.toast('Renumerando... espere', 'exito');
    try {
      const resp = await fetch(this.config.urlBackend, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'renumerar',
          adminEmail: this.usuario.email,
          token: this.config.token || ''
        })
      });
      const data = await resp.json();
      if (data && data.ok) {
        this.toast(`✅ ${data.actualizados || 0} reportes renumerados correctamente`, 'exito');
      } else {
        this.toast('Error al renumerar: ' + (data?.error || 'desconocido'), 'error');
      }
    } catch (err) {
      console.error('Error renumerando:', err);
      this.toast('Error de red al renumerar', 'error');
    }
  },

  // ========== 🆕 v5.3: CIERRE DE MES POR FECHA DE LLAMADA ==========
  // Renumera SOLO los reportes de un mes específico, ordenándolos
  // cronológicamente por fecha de llamada.
  async abrirCierreMes() {
    if (!this.esAdmin()) {
      this.toast('Solo el administrador', 'error');
      return;
    }
    if (!this.config.urlBackend) {
      this.toast('Configure URL del backend primero', 'error');
      return;
    }

    // Construir selector de mes/año
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();
    const nombresMeses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    // Generar opciones de meses
    const opcionesMeses = nombresMeses.map((nom, idx) =>
      `<option value="${idx + 1}" ${idx + 1 === mesActual ? 'selected' : ''}>${nom}</option>`
    ).join('');

    // Generar opciones de años (3 años atrás, año actual, 1 adelante)
    const opcionesAnios = [];
    for (let a = anioActual - 3; a <= anioActual + 1; a++) {
      opcionesAnios.push(`<option value="${a}" ${a === anioActual ? 'selected' : ''}>${a}</option>`);
    }

    const html = `
      <div style="padding: 20px;">
        <h3 style="color: #7a1010; margin-bottom: 12px;">📅 Cierre de mes y renumeración</h3>
        <p style="font-size: 14px; color: #555; margin-bottom: 16px; line-height: 1.5;">
          Esta acción reorganizará los consecutivos del mes seleccionado en <strong>orden cronológico por fecha de llamada</strong>.
          Los reportes de otros meses NO se tocan.
        </p>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px;">Mes:</label>
          <select id="cierre_mes" style="width: 100%; padding: 10px; font-size: 16px; border: 2px solid #ddd; border-radius: 8px;">
            ${opcionesMeses}
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 6px;">Año:</label>
          <select id="cierre_anio" style="width: 100%; padding: 10px; font-size: 16px; border: 2px solid #ddd; border-radius: 8px;">
            ${opcionesAnios.join('')}
          </select>
        </div>
        <div id="cierre_previsualizacion" style="margin-top: 12px;"></div>
        <div style="display: flex; gap: 8px; margin-top: 20px;">
          <button class="btn btn-secundario" onclick="app.cerrarModalCierreMes()" style="flex: 1;">Cancelar</button>
          <button class="btn" onclick="app.previsualizarCierreMes()" style="flex: 1; background: #f59e0b; color: #fff;">👁️ Previsualizar</button>
        </div>
        <button id="btn_aplicar_cierre" class="btn btn-completo" onclick="app.aplicarCierreMes()" style="display: none; margin-top: 8px; background: #7a1010; color: #fff;">
          ✅ Aplicar cambios definitivamente
        </button>
      </div>
    `;

    this.mostrarModalCierreMes(html);
  },

  mostrarModalCierreMes(html) {
    // Crear o reutilizar modal
    let modal = document.getElementById('modalCierreMes');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modalCierreMes';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div style="background:#fff;border-radius:12px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;">
        ${html}
      </div>
    `;
    modal.style.display = 'flex';
  },

  cerrarModalCierreMes() {
    const modal = document.getElementById('modalCierreMes');
    if (modal) modal.style.display = 'none';
  },

  async previsualizarCierreMes() {
    const mes = parseInt(document.getElementById('cierre_mes').value, 10);
    const anio = parseInt(document.getElementById('cierre_anio').value, 10);
    const cont = document.getElementById('cierre_previsualizacion');
    cont.innerHTML = '<p style="text-align:center;padding:12px;">⏳ Consultando servidor...</p>';

    try {
      const resp = await fetch(this.config.urlBackend, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'previsualizarCierreMes',
          adminEmail: this.usuario.email,
          mes: mes,
          anio: anio,
          token: this.config.token || ''
        })
      });
      const data = await resp.json();

      if (!data.ok) {
        cont.innerHTML = `<div style="background:#fee;padding:12px;border-radius:8px;color:#c00;">❌ ${data.error}</div>`;
        return;
      }

      if (data.totalReportesMes === 0) {
        cont.innerHTML = `<div style="background:#f0f0f0;padding:12px;border-radius:8px;">ℹ️ No hay reportes en ${data.nombreMes} ${data.anio}</div>`;
        document.getElementById('btn_aplicar_cierre').style.display = 'none';
        return;
      }

      if (data.cambiosRealizarian === 0) {
        cont.innerHTML = `
          <div style="background:#dcfce7;padding:12px;border-radius:8px;color:#15803d;">
            ✅ <strong>Todo está en orden</strong><br>
            ${data.totalReportesMes} reportes en ${data.nombreMes} ${data.anio} ya están en el orden correcto. No es necesario renumerar.
          </div>`;
        document.getElementById('btn_aplicar_cierre').style.display = 'none';
        return;
      }

      // Construir tabla de cambios
      const filasCambios = data.previsualizacion
        .filter(p => p.cambio)
        .slice(0, 20)
        .map(p => {
          const fecha = new Date(p.fechaLlamada).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
          return `
            <tr>
              <td style="padding:6px;font-size:12px;">${fecha}</td>
              <td style="padding:6px;font-size:12px;color:#999;text-decoration:line-through;">${p.consecutivoAnterior}</td>
              <td style="padding:6px;font-size:12px;color:#15803d;font-weight:700;">→ ${p.consecutivoNuevo}</td>
            </tr>`;
        }).join('');

      const masTexto = data.cambiosRealizarian > 20 ? `<p style="font-size:12px;color:#888;text-align:center;margin-top:8px;">... y ${data.cambiosRealizarian - 20} cambios más</p>` : '';

      cont.innerHTML = `
        <div style="background:#fff7ed;padding:12px;border-radius:8px;border:1px solid #fed7aa;">
          <p style="font-weight:600;margin-bottom:8px;">
            📊 ${data.nombreMes} ${data.anio}: ${data.totalReportesMes} reportes totales · ${data.cambiosRealizarian} cambiarán
          </p>
          <div style="max-height:280px;overflow-y:auto;background:#fff;border-radius:6px;">
            <table style="width:100%;border-collapse:collapse;font-size:12px;">
              <thead>
                <tr style="background:#f3f4f6;position:sticky;top:0;">
                  <th style="padding:6px;text-align:left;">Fecha llamada</th>
                  <th style="padding:6px;text-align:left;">Antes</th>
                  <th style="padding:6px;text-align:left;">Después</th>
                </tr>
              </thead>
              <tbody>${filasCambios}</tbody>
            </table>
          </div>
          ${masTexto}
        </div>
      `;

      // Guardar el mes/año para el botón de aplicar
      this._cierreMesPendiente = { mes, anio, totalReportesMes: data.totalReportesMes, cambiosRealizarian: data.cambiosRealizarian, nombreMes: data.nombreMes };
      document.getElementById('btn_aplicar_cierre').style.display = 'block';
    } catch (err) {
      console.error('Error previsualizando:', err);
      cont.innerHTML = `<div style="background:#fee;padding:12px;border-radius:8px;color:#c00;">❌ Error de red: ${err.message}</div>`;
    }
  },

  async aplicarCierreMes() {
    if (!this._cierreMesPendiente) {
      this.toast('Primero debes previsualizar', 'error');
      return;
    }
    const info = this._cierreMesPendiente;

    const ok = await this.confirmar(
      '⚠️ ¿Confirmar cierre de mes?',
      `Se renumerarán ${info.cambiosRealizarian} reportes de ${info.nombreMes} ${info.anio}. Esta acción NO se puede deshacer. ¿Continuar?`
    );
    if (!ok) return;

    this.cerrarModalCierreMes();
    this.toast('Aplicando cierre de mes... espere', 'exito');

    try {
      const resp = await fetch(this.config.urlBackend, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'cerrarMesYRenumerar',
          adminEmail: this.usuario.email,
          mes: info.mes,
          anio: info.anio,
          token: this.config.token || ''
        })
      });
      const data = await resp.json();

      if (data && data.ok) {
        this.toast(`✅ ${info.nombreMes} ${info.anio}: ${data.cambiosRealizados} consecutivos actualizados`, 'exito');
        // Re-sincronizar reportes locales para reflejar los nuevos consecutivos
        if (this.sincronizarReportesDesdeServidor) {
          setTimeout(() => this.sincronizarReportesDesdeServidor(), 1500);
        }
      } else {
        this.toast('Error: ' + (data?.error || 'desconocido'), 'error');
      }
    } catch (err) {
      console.error('Error aplicando cierre de mes:', err);
      this.toast('Error de red: ' + err.message, 'error');
    }

    this._cierreMesPendiente = null;
  },

  // ========== HERRAMIENTAS DE MANTENIMIENTO (admin) ==========

  async normalizarBonificaciones() {
    if (!this._adminAutorizado) { this.toast('Debes abrir el panel admin primero', 'error'); return; }
    const ok = await this.confirmar(
      '🧹 Normalizar nombres',
      'Esto corregirá nombres como "Maquinista Sierra" → "FREDY ANDREY SIERRA BORRERO" en la hoja Bonificaciones usando la lista oficial del CBVI.\n\n¿Continuar?'
    );
    if (!ok) return;
    this.toast('Normalizando nombres...', 'info');
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'normalizarBonificaciones',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD
        })
      });
      const data = await resp.json();
      if (data.ok) {
        this.toast('✅ ' + data.mensaje, 'exito');
      } else {
        this.toast('Error: ' + (data.error || 'desconocido'), 'error');
      }
    } catch (e) {
      this.toast('Error de red: ' + e.message, 'error');
    }
  },

  async reconstruirHojasAuxiliares() {
    if (!this._adminAutorizado) { this.toast('Debes abrir el panel admin primero', 'error'); return; }
    const ok = await this.confirmar(
      '🗑️ Limpiar hojas auxiliares',
      '⚠️ Esto BORRARÁ las hojas: Recursos, Personal_por_Recurso, Víctimas, Organizaciones, Bonificaciones, Bonificaciones_Resumen y Estadísticas_Mensuales.\n\nNO toca la hoja Reportes ni Bomberos.\n\nLos datos de bomberos por reporte se regeneran cuando cada bombero reenvíe su reporte.\n\n¿Continuar?'
    );
    if (!ok) return;
    this.toast('Limpiando hojas auxiliares...', 'info');
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'reconstruirHojasAuxiliares',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD
        })
      });
      const data = await resp.json();
      if (data.ok) {
        this.toast('✅ ' + data.mensaje, 'exito');
      } else {
        this.toast('Error: ' + (data.error || 'desconocido'), 'error');
      }
    } catch (e) {
      this.toast('Error de red: ' + e.message, 'error');
    }
  },

  // ========== PANEL ADMIN CON CONTRASEÑA ==========
  // Lista TODOS los reportes (no solo del usuario actual) para que el admin pueda editar
  async abrirPanelAdmin() {
    if (!this.esAdmin()) {
      this.toast('Solo el administrador', 'error');
      return;
    }
    // Pedir contraseña
    const pw = window.prompt('🔐 Contraseña de administrador:');
    if (pw === null) return; // canceló
    if (pw !== ADMIN_PASSWORD) {
      this.toast('Contraseña incorrecta', 'error');
      return;
    }
    this._adminAutorizado = true;
    this.irA('pantallaPanelAdmin');
    await this.cargarReportesAdmin();
  },

  async cargarReportesAdmin() {
    const cont = document.getElementById('listaReportesAdmin');
    if (!cont) return;
    cont.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">Cargando reportes del servidor...</div>';
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'listarTodosReportes',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD
        })
      });
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); }
      catch (e) {
        cont.innerHTML = '<div style="padding:20px;color:#c00;">Error: respuesta del servidor no es JSON. Verifica que el backend Apps Script esté actualizado a la versión más reciente.<br><br><small>Respuesta: ' + text.substring(0, 200) + '</small></div>';
        return;
      }
      if (!data.ok) {
        cont.innerHTML = '<div style="padding:20px;color:#c00;">Error: ' + (data.error || 'desconocido') + '<br><br><small>Si dice "No autorizado", verifica que el backend tenga la versión nueva.</small></div>';
        return;
      }
      this._reportesAdmin = data.reportes || [];
      if (this._reportesAdmin.length === 0) {
        cont.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">El servidor respondió correctamente, pero no hay reportes registrados aún.</div>';
        return;
      }
      this.renderizarListaAdmin();
    } catch (e) {
      cont.innerHTML = '<div style="padding:20px;color:#c00;">Error de red: ' + e.message + '<br><br><small>Verifica tu conexión a internet.</small></div>';
    }
  },

  renderizarListaAdmin(filtro = '') {
    const cont = document.getElementById('listaReportesAdmin');
    if (!cont || !this._reportesAdmin) return;
    const f = filtro.toLowerCase();
    const reportes = this._reportesAdmin
      .filter(r => !f || (r.consecutivo + ' ' + (r.operadorEmail || '') + ' ' + (r.direccion || '')).toLowerCase().includes(f))
      .sort((a, b) => (b.consecutivo || '').localeCompare(a.consecutivo || ''));

    if (reportes.length === 0) {
      cont.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">No hay reportes</div>';
      return;
    }

    cont.innerHTML = reportes.map(r => `
      <div class="reporte-card" style="margin-bottom:10px;padding:12px;border-left:4px solid #7a1010;background:#fff;border-radius:6px;">
        <div style="font-weight:bold;color:#7a1010;font-size:15px;">${r.consecutivo || '(sin consecutivo)'}</div>
        <div style="font-size:13px;color:#333;margin-top:2px;">${r.direccion || 'Sin dirección'}</div>
        <div style="font-size:11px;color:#888;margin-top:4px;">
          ${r.operadorEmail || ''} · ${(r.clasificacion || []).join(', ') || 'Sin clasificar'}
        </div>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
          <button onclick="app.verReporteAdmin('${r.id}')"
                  style="flex:1;min-width:80px;padding:8px 6px;background:#065f46;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:12px;">
            👁️ Ver
          </button>
          <button onclick="app.editarReporteAdmin('${r.id}')"
                  style="flex:1;min-width:80px;padding:8px 6px;background:#7a1010;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:12px;">
            ✏️ Editar
          </button>
          <button onclick="app.imprimirReporteAdmin('${r.id}')"
                  style="flex:1;min-width:80px;padding:8px 6px;background:#1e40af;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:12px;">
            🖨️ Imprimir
          </button>
          <button onclick="app.eliminarReporteAdmin('${r.id}', '${(r.consecutivo || '').replace(/'/g, '')}')"
                  style="flex:1;min-width:80px;padding:8px 6px;background:#991b1b;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:12px;">
            🗑️ Eliminar
          </button>
        </div>
      </div>
    `).join('');
  },

  async eliminarReporteAdmin(id, consecutivo) {
    if (!this.esAdmin()) {
      this.toast('Solo el administrador', 'error');
      return;
    }
    const ok = window.confirm(
      `⚠️ ELIMINAR REPORTE\n\n` +
      `Consecutivo: ${consecutivo || '(sin consecutivo)'}\n\n` +
      `Se borrará la fila del Google Sheets Y la subcarpeta de fotos/firmas en Drive.\n\n` +
      `Esta acción NO se puede deshacer.\n\n` +
      `¿Continuar?`
    );
    if (!ok) return;

    const cont = document.getElementById('listaReportesAdmin');
    const cardOriginal = cont ? cont.innerHTML : '';
    if (cont) cont.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">Eliminando reporte del servidor...</div>';

    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'eliminarReporte',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD,
          idReporte: id
        })
      });
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); }
      catch (e) {
        if (cont) cont.innerHTML = cardOriginal;
        this.toast('Respuesta del servidor no válida. Verifica que el backend esté actualizado.', 'error');
        return;
      }
      if (!data.ok) {
        if (cont) cont.innerHTML = cardOriginal;
        this.toast('Error: ' + (data.error || 'desconocido'), 'error');
        return;
      }
      // También borrar localmente si está en este dispositivo
      try { await DB.eliminarReporte(id); } catch (e) { /* ignore */ }
      this._reportesAdmin = (this._reportesAdmin || []).filter(r => r.id !== id);
      this.renderizarListaAdmin(document.getElementById('filtroAdmin')?.value || '');
      await this.actualizarHome();
      this.toast(`Reporte ${consecutivo || ''} eliminado`, 'exito');
    } catch (e) {
      if (cont) cont.innerHTML = cardOriginal;
      this.toast('Error de red al eliminar: ' + e.message, 'error');
    }
  },

  filtrarAdmin() {
    const f = document.getElementById('filtroAdmin');
    this.renderizarListaAdmin(f ? f.value : '');
  },

  // ========== VER DETALLE DE UN REPORTE (admin) ==========
  // Descarga el reporte completo del servidor (con fotos+firmas) y lo muestra
  // en read-only dentro del panel admin, sin tocar la BD local del bombero.
  async verReporteAdmin(idReporte) {
    const rBase = (this._reportesAdmin || []).find(x => x.id === idReporte);
    if (!rBase) { this.toast('Reporte no encontrado', 'error'); return; }

    // Mostrar el panel de visualización
    document.getElementById('listaReportesAdminWrap').style.display = 'none';
    document.getElementById('panelAdminViendo').style.display = 'block';
    const cont = document.getElementById('panelAdminViendoContenido');
    cont.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">Cargando reporte completo desde el servidor...</div>';

    // Descargar reporte completo
    const r = await this._descargarReporteCompletoAdmin(idReporte) || rBase;
    this._reporteAdminViendo = r;

    // Conectar el botón "Imprimir" del panel a este reporte
    const btnImpr = document.getElementById('btnImprimirDesdeVista');
    if (btnImpr) {
      btnImpr.onclick = () => this._imprimirReporteEnVentanaNueva(r);
    }

    // Renderizar contenido
    cont.innerHTML = this._renderDetalleReporteAdmin(r);

    // Cargar chips de bomberos para bonificaciones (asíncrono, no bloquea render)
    this._cargarBomberosBonifAdmin(r.id);
  },

  cerrarVistaAdmin() {
    document.getElementById('panelAdminViendo').style.display = 'none';
    document.getElementById('listaReportesAdminWrap').style.display = 'block';
    this._reporteAdminViendo = null;
  },

  // Renderiza el HTML de detalle de un reporte (read-only) — incluye todas
  // las secciones del formulario más fotos clickeables (se abren a tamaño real).
  _renderDetalleReporteAdmin(r) {
    const fmt = (v) => (v === null || v === undefined || v === '') ? '<span style="color:#999;">—</span>' : String(v);
    const fecha = (v) => {
      if (!v) return '—';
      try { return new Date(v).toLocaleString('es-CO'); } catch (e) { return String(v); }
    };
    const lista = (arr) => (arr && arr.length) ? arr.join(', ') : '—';

    const fotos = r.fotos || [];
    const fotosHTML = fotos.length === 0
      ? '<div style="color:#999;font-style:italic;padding:8px;">Sin fotografías</div>'
      : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;">${
          fotos.map((url, i) => `
            <a href="${url}" target="_blank" style="display:block;border:1px solid #ccc;border-radius:6px;overflow:hidden;text-decoration:none;">
              <img src="${url}" alt="Foto ${i+1}"
                   style="width:100%;height:120px;object-fit:cover;background:#f0f0f0;display:block;"
                   onerror="this.style.display='none';this.parentNode.innerHTML+='<div style=&quot;padding:8px;color:#c00;font-size:11px;&quot;>No se pudo cargar la foto ${i+1}</div>';">
              <div style="padding:4px;font-size:11px;text-align:center;background:#f8f8f8;color:#333;">📷 Foto ${i+1}</div>
            </a>
          `).join('')
        }</div>`;

    const firmas = r.firmas || {};
    const renderFirma = (url, etiqueta) => {
      if (!url) return `<div style="color:#999;font-style:italic;">${etiqueta}: —</div>`;
      return `
        <div style="border:1px solid #ccc;border-radius:6px;padding:6px;background:#fafafa;">
          <div style="font-size:11px;color:#666;margin-bottom:4px;">${etiqueta}</div>
          <a href="${url}" target="_blank">
            <img src="${url}" alt="${etiqueta}"
                 style="max-width:100%;max-height:80px;background:white;border:1px solid #eee;"
                 onerror="this.style.display='none';">
          </a>
        </div>
      `;
    };

    const card = (titulo, contenidoHTML) => `
      <div style="background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:12px;margin-bottom:10px;">
        <h4 style="color:#7a1010;margin:0 0 8px 0;font-size:14px;">${titulo}</h4>
        <div style="font-size:13px;color:#222;line-height:1.5;">${contenidoHTML}</div>
      </div>
    `;

    const fila = (label, valor) => `<div><strong>${label}:</strong> ${fmt(valor)}</div>`;

    return `
      <h3 style="color:#7a1010;margin:0 0 12px 0;">📄 ${r.consecutivo || '(sin consecutivo)'}</h3>
      <div style="font-size:12px;color:#666;margin-bottom:12px;">
        ID: <code>${r.id}</code> · Estación: ${fmt(r.estacion)}
      </div>

      ${card('🕐 Fechas y reportante', `
        ${fila('Creación', fecha(r.fechaCreacion))}
        ${fila('Llamada', fecha(r.fechaLlamada))}
        ${fila('Llegada', fecha(r.fechaLlegada))}
        ${fila('Cierre', fecha(r.fechaCierre))}
        ${fila('Reporta nombre', r.reportaNombre)}
        ${fila('Reporta tel', r.reportaTel)}
        ${fila('Relación', r.reportaRelacion)}
        ${fila('Turno', r.turno)}
      `)}

      ${card('🚨 Clasificación', `
        ${fila('Tipos', lista(r.clasificacion))}
        ${fila('Otra clasificación', r.clasificacionOtra)}
      `)}

      ${card('📍 Ubicación', `
        ${fila('Dirección', r.direccion)}
        ${fila('Barrio', r.barrio)}
        ${fila('Localidad', r.localidad)}
        ${fila('Municipio', r.municipio)}
        ${fila('Referencia', r.referencia)}
      `)}

      ${card('📝 Descripción del evento', `
        <div><strong>Narrativa:</strong><br>${fmt(r.narrativa)}</div>
        <div style="margin-top:6px;"><strong>Condiciones al llegar:</strong><br>${fmt(r.condiciones)}</div>
      `)}

      ${card('🩺 Diagnóstico', `
        ${fila('Muertos', r.muertos)}
        ${fila('Heridos', r.heridos)}
        ${fila('Desaparecidos', r.desaparecidos)}
        ${fila('Personas afectadas', r.personasAfectadas)}
        ${fila('Familias afectadas', r.familiasAfectadas)}
        ${fila('Viviendas destruidas', r.viviendasDestruidas)}
        ${fila('Viviendas averiadas', r.viviendasAveriadas)}
        ${fila('Hectáreas', r.hectareas)}
        ${fila('Vías afectadas', r.viasAfectadas)}
        ${fila('Puentes', r.puentesAfectados)}
        ${fila('Pérdida estimada $', r.perdidaEstimada)}
        ${fila('Zona origen', r.zonaOrigen)}
        ${fila('Áreas afectadas', r.areasAfectadas)}
      `)}

      ${card('👤 Afectado', `
        ${fila('Nombre', r.afectadoNombre)}
        ${fila('CC', r.afectadoCC)}
        ${fila('Celular', r.afectadoCel)}
      `)}

      ${card('🛠️ Acciones y causas', `
        <div><strong>Acciones realizadas:</strong><br>${fmt(r.acciones)}</div>
        <div style="margin-top:6px;">${fila('Causas', lista(r.causas))}</div>
        ${fila('Causa probable', r.causaProbable)}
        <div><strong>Evidencias:</strong><br>${fmt(r.evidencias)}</div>
        ${fila('Causa confirmada', r.causaConfirmada)}
      `)}

      ${card('💬 Observaciones', `
        <div><strong>Observaciones:</strong><br>${fmt(r.observaciones)}</div>
        <div style="margin-top:6px;"><strong>Recomendaciones:</strong><br>${fmt(r.recomendaciones)}</div>
      `)}

      ${card('👨‍🚒 Comandante', `
        ${fila('Nombre', r.comandanteNombre)}
        ${fila('Grado', r.comandanteGrado)}
        ${fila('CC', r.comandanteCC)}
        ${fila('Estación', r.comandanteEstacion)}
      `)}

      ${card('📱 Operador que reportó', `
        ${fila('Nombre', r.operador)}
        ${fila('Email', r.operadorEmail)}
        ${fila('Grado', r.operadorGrado)}
        ${fila('CC', r.operadorCC)}
        ${fila('Tel', r.operadorTel)}
      `)}

      ${card(`📷 Fotografías (${fotos.length})`, fotosHTML)}

      ${card('✍️ Firmas', `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${renderFirma(firmas.afectado, 'Firma del afectado')}
          ${renderFirma(firmas.comandante, 'Firma del comandante')}
        </div>
      `)}

      ${card('💰 Bonificaciones — bomberos que participaron', `
        <div style="font-size:12px;color:#555;background:#fffbe6;padding:8px;border-radius:4px;margin-bottom:10px;border:1px solid #f0dca0;">
          Lista de bomberos registrados en la hoja <em>Bonificaciones</em>
          para este reporte. Agrega o quita uno a uno. Cada cambio se guarda
          inmediatamente y recalcula el resumen del tesorero.
        </div>
        <div id="adminBonifChips_${r.id}" style="min-height:36px;display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:#f8f8f8;border:1px solid #e5e5e5;border-radius:6px;margin-bottom:8px;">
          <span style="color:#888;font-style:italic;font-size:12px;">Cargando...</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <input id="adminBonifInput_${r.id}"
                 type="text"
                 placeholder="Nombre completo del bombero"
                 onkeydown="if(event.key==='Enter'){event.preventDefault();app.agregarBomberoBonifAdmin('${r.id}')}"
                 style="flex:1;min-width:180px;padding:8px;border:1px solid #ccc;border-radius:4px;font-size:13px;">
          <button onclick="app.agregarBomberoBonifAdmin('${r.id}')"
                  style="padding:8px 14px;background:#065f46;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px;">
            + Agregar
          </button>
        </div>
      `)}
    `;
  },

  // Carga la lista de bomberos registrados en Bonificaciones para un reporte
  // y la pinta como chips dentro del contenedor adminBonifChips_<id>.
  async _cargarBomberosBonifAdmin(idReporte) {
    const cont = document.getElementById('adminBonifChips_' + idReporte);
    if (!cont) return;
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'listarBomberosBonificacion',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD,
          idReporte: idReporte
        })
      });
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); }
      catch (e) {
        cont.innerHTML = '<span style="color:#c00;font-size:12px;">Error de respuesta del servidor</span>';
        return;
      }
      if (!data.ok) {
        cont.innerHTML = '<span style="color:#c00;font-size:12px;">' + (data.error || 'Error') + '</span>';
        return;
      }
      const bomberos = data.bomberos || [];
      if (bomberos.length === 0) {
        cont.innerHTML = '<span style="color:#888;font-style:italic;font-size:12px;">Sin bomberos registrados aún. Agrega el primero abajo.</span>';
        return;
      }
      // Render chips
      cont.innerHTML = bomberos.map(nombre => {
        const safe = String(nombre).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        return `
          <span style="display:inline-flex;align-items:center;gap:6px;background:#065f46;color:#fff;padding:5px 8px 5px 10px;border-radius:14px;font-size:12px;font-weight:600;">
            ${safe}
            <button onclick="app.quitarBomberoBonifAdmin('${idReporte}', '${safe}')"
                    title="Quitar"
                    style="background:rgba(255,255,255,0.25);color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:14px;line-height:1;padding:0;display:inline-flex;align-items:center;justify-content:center;">×</button>
          </span>
        `;
      }).join('') +
      `<span style="width:100%;font-size:11px;color:#666;margin-top:4px;">Total: ${bomberos.length} bombero(s)</span>`;
    } catch (e) {
      cont.innerHTML = '<span style="color:#c00;font-size:12px;">Error de red: ' + e.message + '</span>';
    }
  },

  // Agrega UN bombero a Bonificaciones del reporte
  async agregarBomberoBonifAdmin(idReporte) {
    const inp = document.getElementById('adminBonifInput_' + idReporte);
    if (!inp) return;
    const nombre = (inp.value || '').trim();
    if (!nombre) { this.toast('Escribe un nombre', 'error'); return; }

    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'agregarBomberoBonificacion',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD,
          idReporte: idReporte,
          nombre: nombre
        })
      });
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); }
      catch (e) {
        this.toast('Respuesta no válida del servidor', 'error');
        return;
      }
      if (!data.ok) {
        this.toast('Error: ' + (data.error || '?'), 'error');
        return;
      }
      if (data.duplicado) {
        this.toast(data.mensaje || 'Ya estaba registrado', 'info');
      } else {
        this.toast(`✅ ${data.bombero} agregado`, 'exito');
      }
      inp.value = '';
      inp.focus();
      await this._cargarBomberosBonifAdmin(idReporte);
    } catch (e) {
      this.toast('Error de red: ' + e.message, 'error');
    }
  },

  // Quita UN bombero específico de Bonificaciones del reporte
  async quitarBomberoBonifAdmin(idReporte, nombre) {
    const ok = window.confirm(`¿Quitar a "${nombre}" de las bonificaciones de este reporte?`);
    if (!ok) return;
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'quitarBomberoBonificacion',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD,
          idReporte: idReporte,
          nombre: nombre
        })
      });
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); }
      catch (e) {
        this.toast('Respuesta no válida del servidor', 'error');
        return;
      }
      if (!data.ok) {
        this.toast('Error: ' + (data.error || '?'), 'error');
        return;
      }
      this.toast(`🗑️ ${nombre} eliminado`, 'exito');
      await this._cargarBomberosBonifAdmin(idReporte);
    } catch (e) {
      this.toast('Error de red: ' + e.message, 'error');
    }
  },

  async editarReporteAdmin(idReporte) {
    const rBase = (this._reportesAdmin || []).find(x => x.id === idReporte);
    if (!rBase) { this.toast('Reporte no encontrado', 'error'); return; }

    // Descargar reporte completo (con fotos+firmas) para poder editar TODO
    this.toast('Cargando reporte completo para editar...', 'info');
    const r = (await this._descargarReporteCompletoAdmin(idReporte)) || rBase;

    // === MODO EDICIÓN ADMIN ===
    // Reusamos el formulario principal (las 14 secciones) en lugar de
    // un editor con solo 6 campos. Se marca una bandera para que al
    // guardar se llame al endpoint editarReporte (no a crear uno nuevo).
    this._modoEdicionAdmin = true;
    this._reporteAdminEditando = r;
    this._reporteAdminOriginalId = r.id;
    this._reporteAdminOriginalConsec = r.consecutivo;

    // Cargar el reporte completo en el formulario principal
    this.cargarEnFormulario(r);
    this.fotosTemp = [...(r.fotos || []), null, null, null, null, null, null].slice(0, 6);

    // Cambiar UI a modo edición admin
    this._aplicarUIEdicionAdmin(true, r);

    this.irA('pantallaForm');
  },

  // Aplica los cambios de UI cuando entramos / salimos del modo edición admin
  _aplicarUIEdicionAdmin(activo, r) {
    const acciones = document.querySelector('#pantallaForm .acciones-form, #pantallaForm .acciones-flotantes, #pantallaForm .botones-form');
    // Si no encontramos el contenedor por clase, buscar por botones conocidos
    const btnEnviar  = document.querySelector('#pantallaForm button[onclick*="enviarReporte"]');
    const btnBorrad  = document.querySelector('#pantallaForm button[onclick*="guardarBorrador"]');

    // Marcar consecutivo si está visible (solo lectura)
    const lblConsec = document.getElementById('f_consecutivo');
    if (lblConsec) {
      if (activo) {
        lblConsec.value = (r && r.consecutivo) || lblConsec.value;
      }
    }

    // Quitar / reponer botones que YA existían (los conservamos pero ocultos en modo admin)
    if (btnEnviar) btnEnviar.style.display = activo ? 'none' : '';
    if (btnBorrad) btnBorrad.style.display = activo ? 'none' : '';

    // Crear o quitar barra admin
    let barra = document.getElementById('barraEdicionAdmin');
    if (activo) {
      if (!barra) {
        barra = document.createElement('div');
        barra.id = 'barraEdicionAdmin';
        barra.style.cssText = 'position:sticky;bottom:0;left:0;right:0;background:#7a1010;color:#fff;padding:10px 12px;display:flex;gap:8px;flex-wrap:wrap;z-index:50;box-shadow:0 -2px 8px rgba(0,0,0,0.25);';
        barra.innerHTML = `
          <div style="flex:1 1 100%;font-size:13px;font-weight:700;margin-bottom:4px;">
            🛡️ Editando como administrador — ${ (r && r.consecutivo) || '' }
          </div>
          <button onclick="app.cancelarEdicionAdminCompleta()"
                  style="flex:1;min-width:120px;padding:10px;background:#444;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;">
            ← Cancelar
          </button>
          <button onclick="app.guardarEdicionAdminCompleta()"
                  style="flex:2;min-width:160px;padding:10px;background:#065f46;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;">
            💾 Guardar cambios admin
          </button>
        `;
        const formContenedor = document.getElementById('pantallaForm');
        if (formContenedor) formContenedor.appendChild(barra);
      } else {
        barra.style.display = 'flex';
      }
    } else if (barra) {
      barra.remove();
    }
  },

  cancelarEdicionAdminCompleta() {
    const ok = window.confirm('¿Cancelar la edición? Los cambios no guardados se perderán.');
    if (!ok) return;
    this._modoEdicionAdmin = false;
    this._reporteAdminEditando = null;
    this._aplicarUIEdicionAdmin(false);
    // Volver al panel admin
    this.irA('pantallaPanelAdmin');
  },

  // Lee el formulario completo y envía editarReporte al backend con TODOS los campos
  // (incluye recursos, víctimas, organizaciones para regenerar hojas auxiliares)
  async guardarEdicionAdminCompleta() {
    if (!this._modoEdicionAdmin) { this.toast('No está en modo edición admin', 'error'); return; }
    const idOrig = this._reporteAdminOriginalId;
    if (!idOrig) { this.toast('Falta ID del reporte', 'error'); return; }

    const r = this.leerFormulario();

    // Aviso: las fotos NO se actualizan desde el editor admin
    // (las fotos del Sheet/Drive se mantienen intactas; este editor edita
    // solo campos de texto, datos numéricos y listas de recursos/víctimas).
    const fotosOriginal = (this._reporteAdminEditando.fotos || []).filter(Boolean);
    const fotosActual = (r.fotos || []).filter(Boolean);
    const fotosCambiadas =
      fotosOriginal.length !== fotosActual.length ||
      fotosActual.some((f, i) => f !== fotosOriginal[i]);
    if (fotosCambiadas) {
      const ok = window.confirm(
        '⚠️ Detecté cambios en las FOTOS de este reporte.\n\n' +
        'El editor admin NO sube fotos nuevas al servidor. ' +
        'Las fotos que ya tenía el reporte en Drive se mantienen igual.\n\n' +
        'Si necesitas cambiar fotos, pídele al bombero original que abra ' +
        'el reporte desde su dispositivo (dentro de 24h) o elimínalo y ' +
        'créalo de nuevo.\n\n' +
        '¿Continuar y guardar el resto de cambios?'
      );
      if (!ok) return;
    }

    // Si cambió el consecutivo, hacer cambio aparte
    const consecForm = (document.getElementById('admin_consecutivo')?.value || r.consecutivo || '').trim();

    // Construir payload de cambios (todos los campos del reporte)
    const cambios = {
      fechaLlamada: r.fechaLlamada || '',
      fechaLlegada: r.fechaLlegada || '',
      fechaCierre: r.fechaCierre || '',
      reportaNombre: r.reportaNombre || '',
      reportaTel: r.reportaTel || '',
      reportaRelacion: r.reportaRelacion || '',
      turno: r.turno || '',
      clasificacion: r.clasificacion || [],
      clasificacionOtra: r.clasificacionOtra || '',
      direccion: r.direccion || '',
      barrio: r.barrio || '',
      localidad: r.localidad || '',
      municipio: r.municipio || '',
      referencia: r.referencia || '',
      narrativa: r.narrativa || '',
      condiciones: r.condiciones || '',
      muertos: r.muertos || 0,
      heridos: r.heridos || 0,
      desaparecidos: r.desaparecidos || 0,
      personasAfectadas: r.personasAfectadas || 0,
      familiasAfectadas: r.familiasAfectadas || 0,
      viviendasDestruidas: r.viviendasDestruidas || 0,
      viviendasAveriadas: r.viviendasAveriadas || 0,
      hectareas: r.hectareas || 0,
      viasAfectadas: r.viasAfectadas || 0,
      puentesAfectados: r.puentesAfectados || 0,
      perdidaEstimada: r.perdidaEstimada || 0,
      zonaOrigen: r.zonaOrigen || '',
      areasAfectadas: r.areasAfectadas || '',
      afectadoNombre: r.afectadoNombre || '',
      afectadoCC: r.afectadoCC || '',
      afectadoCel: r.afectadoCel || '',
      acciones: r.acciones || '',
      causas: r.causas || [],
      causaProbable: r.causaProbable || '',
      evidencias: r.evidencias || '',
      causaConfirmada: r.causaConfirmada || '',
      observaciones: r.observaciones || '',
      recomendaciones: r.recomendaciones || '',
      comandanteNombre: r.comandanteNombre || '',
      comandanteGrado: r.comandanteGrado || '',
      comandanteCC: r.comandanteCC || '',
      comandanteEstacion: r.comandanteEstacion || ''
    };

    try {
      // 1) Cambios de campos planos + recursos/victimas/organizaciones
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'editarReporte',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD,
          idReporte: idOrig,
          cambios: cambios,
          recursos: r.recursos || [],
          victimas: r.victimas || [],
          organizaciones: r.organizaciones || []
        })
      });
      const data = await resp.json();
      if (!data.ok) {
        this.toast('Error guardando: ' + (data.error || '?'), 'error');
        return;
      }

      // 2) Si cambió consecutivo, llamar cambiarConsecutivo
      const consecOrig = this._reporteAdminOriginalConsec || '';
      if (consecForm && consecForm !== consecOrig) {
        const respC = await fetch(URL_BACKEND, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            accion: 'cambiarConsecutivo',
            adminEmail: this.usuario.email,
            adminPassword: ADMIN_PASSWORD,
            idReporte: idOrig,
            nuevoConsecutivo: consecForm
          })
        });
        const dataC = await respC.json();
        if (!dataC.ok) {
          this.toast('Datos guardados, pero el consecutivo no cambió: ' + (dataC.error || '?'), 'error');
        }
      }

      this.toast(`✅ Reporte actualizado (${data.actualizados || 0} campos)`, 'exito');
      this._modoEdicionAdmin = false;
      this._reporteAdminEditando = null;
      this._aplicarUIEdicionAdmin(false);
      this.irA('pantallaPanelAdmin');
      await this.cargarReportesAdmin();
    } catch (e) {
      this.toast('Error de red al guardar: ' + e.message, 'error');
    }
  },

  cancelarEdicionAdmin() {
    document.getElementById('panelAdminEditando').style.display = 'none';
    document.getElementById('listaReportesAdminWrap').style.display = 'block';
    this._reporteAdminEditando = null;
  },

  async guardarEdicionAdmin() {
    const r = this._reporteAdminEditando;
    if (!r) return;
    const nuevoCons = document.getElementById('admin_consecutivo').value.trim();

    const cambios = {
      direccion: document.getElementById('admin_direccion').value.trim(),
      barrio: document.getElementById('admin_barrio').value.trim(),
      municipio: document.getElementById('admin_municipio').value.trim(),
      narrativa: document.getElementById('admin_narrativa').value.trim(),
      acciones: document.getElementById('admin_acciones').value.trim(),
      observaciones: document.getElementById('admin_observaciones').value.trim()
    };

    try {
      // Si cambió consecutivo, hacer cambio especial
      if (nuevoCons && nuevoCons !== r.consecutivo) {
        const respC = await fetch(URL_BACKEND, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            accion: 'cambiarConsecutivo',
            adminEmail: this.usuario.email,
            adminPassword: ADMIN_PASSWORD,
            idReporte: r.id,
            nuevoConsecutivo: nuevoCons
          })
        });
        const dataC = await respC.json();
        if (!dataC.ok) {
          this.toast('Error cambiando consecutivo: ' + dataC.error, 'error');
          return;
        }
      }

      // Guardar otros cambios
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'editarReporte',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD,
          idReporte: r.id,
          cambios: cambios
        })
      });
      const data = await resp.json();
      if (data.ok) {
        this.toast(`✅ ${data.actualizados} campos actualizados`, 'exito');
        this.cancelarEdicionAdmin();
        await this.cargarReportesAdmin();
      } else {
        this.toast('Error: ' + (data.error || '?'), 'error');
      }
    } catch (e) {
      this.toast('Error de red: ' + e.message, 'error');
    }
  },

  // ========== IMPRIMIR DESDE ADMIN ==========
  // Imprime el reporte que se está editando ACTUALMENTE en el panel admin,
  // tomando los cambios sin guardar como parte del PDF (vista previa de la edición).
  async imprimirReporteEditandoAdmin() {
    const r = this._reporteAdminEditando;
    if (!r) {
      this.toast('No hay reporte abierto para imprimir', 'error');
      return;
    }
    // Tomar valores actuales del formulario (incluso si no se guardó)
    const rConCambios = {
      ...r,
      consecutivo: document.getElementById('admin_consecutivo').value.trim() || r.consecutivo,
      direccion: document.getElementById('admin_direccion').value.trim() || r.direccion,
      barrio: document.getElementById('admin_barrio').value.trim() || r.barrio,
      municipio: document.getElementById('admin_municipio').value.trim() || r.municipio,
      narrativa: document.getElementById('admin_narrativa').value.trim() || r.narrativa,
      acciones: document.getElementById('admin_acciones').value.trim() || r.acciones,
      observaciones: document.getElementById('admin_observaciones').value.trim() || r.observaciones
    };
    await this._imprimirReporteEnVentanaNueva(rConCambios);
  },

  // ========== IMPRIMIR DESDE LISTA ADMIN ==========
  // Genera el PDF directamente del reporte del servidor SIN tocar la BD local del bombero,
  // así puede imprimir reportes de otros usuarios sin que aparezcan en su lista personal.
  // Primero descarga el reporte COMPLETO del servidor (con fotos+firmas extraídas
  // de los hipervínculos del Sheet) para que aparezcan en el PDF.
  async imprimirReporteAdmin(idReporte) {
    const rBase = (this._reportesAdmin || []).find(x => x.id === idReporte);
    if (!rBase) {
      this.toast('Reporte no encontrado', 'error');
      return;
    }
    this.toast('Cargando fotos y firmas del servidor...', 'info');
    try {
      const r = await this._descargarReporteCompletoAdmin(idReporte) || rBase;
      await this._imprimirReporteEnVentanaNueva(r);
    } catch (e) {
      // Fallback: imprimir con lo que ya tenemos (sin fotos)
      console.warn('No se pudo obtener reporte completo, imprimiendo con datos básicos:', e);
      await this._imprimirReporteEnVentanaNueva(rBase);
    }
  },

  // Descarga UN reporte completo del backend (incluye fotos+firmas como URLs).
  // Devuelve null si falla.
  async _descargarReporteCompletoAdmin(idReporte) {
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'obtenerReporteCompleto',
          adminEmail: this.usuario.email,
          adminPassword: ADMIN_PASSWORD,
          idReporte: idReporte
        })
      });
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { return null; }
      if (data && data.ok && data.reporte) return data.reporte;
      return null;
    } catch (e) {
      return null;
    }
  },

  // Helper interno: abre ventana nueva con el HTML del reporte y lanza el diálogo de impresión
  async _imprimirReporteEnVentanaNueva(r) {
    try {
      const html = this.generarHTMLImpresion(r);
      const ventana = window.open('', '_blank', 'width=900,height=1200');
      if (!ventana) {
        this.toast('El navegador bloqueó la ventana emergente. Permita pop-ups e intente de nuevo.', 'error');
        return;
      }
      ventana.document.open();
      ventana.document.write(html);
      ventana.document.close();
      ventana.onload = () => {
        setTimeout(() => {
          try { ventana.print(); } catch (e) { console.warn(e); }
        }, 800);
      };
    } catch (e) {
      this.toast('Error al generar PDF: ' + e.message, 'error');
      console.error(e);
    }
  },

  async sincronizarPendientes(silencioso = false) {
    if (!navigator.onLine) {
      if (!silencioso) this.toast('Sin conexión a internet', 'error');
      return;
    }
    if (!this.config.urlBackend) {
      if (!silencioso) this.toast('Configure la URL del backend primero', 'error');
      return;
    }
    const reportes = await DB.listarReportes();
    const pendientes = reportes.filter(r => r.estado === 'pendiente');
    if (pendientes.length === 0) {
      if (!silencioso) this.toast('No hay reportes pendientes', 'exito');
      return;
    }
    let exitos = 0;
    for (const r of pendientes) {
      const ok = await this.sincronizarReporte(r);
      if (ok) exitos++;
    }
    this.toast(`${exitos} de ${pendientes.length} reportes sincronizados`, exitos === pendientes.length ? 'exito' : 'error');
    this.actualizarHome();
  },

  async reintentarEnvio() {
    if (!this.reporteActual) return;
    if (!navigator.onLine) { this.toast('Sin conexión', 'error'); return; }
    const ok = await this.sincronizarReporte(this.reporteActual);
    this.toast(ok ? 'Reporte enviado' : 'Error al enviar', ok ? 'exito' : 'error');
    if (ok) this.verDetalle(this.reporteActual.id);
  },

  // ==================== DETALLE ====================
  async verDetalle(id) {
    const r = await DB.obtenerReporte(id);
    if (!r) return;
    this.reporteActual = r;
    const cont = document.getElementById('detalleContenido');
    const fecha = new Date(r.fechaCreacion).toLocaleString('es-CO');
    const tipos = (r.clasificacion || []).join(', ') || '—';
    const fotosHTML = (r.fotos || []).map(f =>
      `<img src="${f}" style="width:100%; max-width:200px; border-radius: 8px; margin: 4px;">`
    ).join('');

    const recursosHTML = (r.recursos || []).map(rec => {
      const personalStr = (rec.personal && rec.personal.length)
        ? `<br><small>👥 ${rec.personal.join(', ')}</small>` : '';
      return `<li><strong>${rec.recurso}</strong> (cant: ${rec.cantidad}) ${rec.codigo ? '— ' + rec.codigo : ''} ${rec.responsable ? '— ' + rec.responsable : ''}${personalStr}</li>`;
    }).join('');

    cont.innerHTML = `
      <div class="config-card">
        <h3>${r.consecutivo || 'Sin consecutivo'}</h3>
        <p style="font-size: 12px; color: var(--gris-texto); margin-bottom: 12px;">
          <span class="badge ${r.estado}">${this.etiquetaEstado(r.estado)}</span>
          ${fecha}
        </p>
        <p><strong>Tipo:</strong> ${tipos}</p>
        <p><strong>Dirección:</strong> ${r.direccion || '—'}</p>
        <p><strong>Barrio:</strong> ${r.barrio || '—'}</p>
        ${r.gps ? `<p><strong>GPS:</strong> ${r.gps.lat.toFixed(6)}, ${r.gps.lng.toFixed(6)} ${r.gpsManual ? '(manual)' : ''}</p>` : ''}
        <p><strong>Narrativa:</strong> ${r.narrativa || '—'}</p>
        ${r.operador ? `<p style="font-size:12px; color: var(--gris-texto); margin-top:8px;"><strong>Reporte realizado por:</strong> ${r.operador} ${r.operadorGrado ? '(' + r.operadorGrado + ')' : ''}</p>` : ''}
      </div>
      ${recursosHTML ? `<div class="config-card"><h3>Recursos</h3><ul style="padding-left: 20px;">${recursosHTML}</ul></div>` : ''}
      <div class="config-card">
        <h3>Diagnóstico</h3>
        <p>Muertos: ${r.muertos||0} · Heridos: ${r.heridos||0} · Desaparecidos: ${r.desaparecidos||0}</p>
        <p>Personas afectadas: ${r.personasAfectadas||0} · Familias: ${r.familiasAfectadas||0}</p>
      </div>
      ${r.fotos && r.fotos.length ? `<div class="config-card"><h3>Fotografías (${r.fotos.length})</h3>${fotosHTML}</div>` : ''}
      <div class="config-card">
        <h3>Comandante</h3>
        <p>${r.comandanteNombre || '—'} ${r.comandanteGrado ? `(${r.comandanteGrado})` : ''}</p>
      </div>
    `;

    document.getElementById('btnReintentarEnvio').style.display =
      r.estado === 'pendiente' ? 'inline-flex' : 'none';

    // === REGLA 24 HORAS ===
    // El bombero solo puede editar/eliminar su reporte durante las
    // primeras 24 horas después de creado. Pasado ese plazo, solo el
    // administrador (desde el Panel Admin) puede modificarlo.
    const btnEdit = document.getElementById('btnEditarDetalle');
    const btnDel  = document.getElementById('btnEliminarDetalle');
    const puede = this.puedeEditarReporte(r);

    if (btnEdit && btnDel) {
      if (puede.permitido) {
        btnEdit.style.display = '';
        btnDel.style.display = '';
        btnEdit.disabled = false;
        btnDel.disabled = false;
        btnEdit.title = '';
        btnDel.title = '';
      } else {
        // Bombero NO-admin con reporte >24h: ocultar acciones destructivas
        btnEdit.style.display = 'none';
        btnDel.style.display = 'none';
        btnEdit.disabled = true;
        btnDel.disabled = true;
      }
    }

    // Banner amarillo visible cuando el reporte ya pasó las 24h y NO es admin
    // (también muestra ventana restante cuando aún se puede editar pero está cerca del límite).
    if (!puede.permitido) {
      const banner = document.createElement('div');
      banner.style.cssText = 'margin:0 0 12px 0;padding:12px 14px;background:#fff3cd;border:1px solid #f0b800;border-left:4px solid #f0b800;border-radius:6px;color:#5a4500;font-size:13px;line-height:1.5;';
      banner.innerHTML = `
        <strong>🔒 Reporte protegido (más de 24 horas)</strong><br>
        Este reporte ya no puede ser modificado ni eliminado por usted.
        Si necesita corregir información, <strong>comuníquese con el administrador</strong>
        del Cuerpo de Bomberos para que realice el cambio desde el Panel Admin.
      `;
      cont.insertBefore(banner, cont.firstChild);
    } else if (puede.horas && puede.horas > 20 && !this.esAdmin()) {
      // Aviso amistoso cuando se acerca el límite (faltan menos de 4h)
      const horasRest = (24 - puede.horas).toFixed(1);
      const banner = document.createElement('div');
      banner.style.cssText = 'margin:0 0 12px 0;padding:10px 12px;background:#fef3c7;border-left:4px solid #f0b800;border-radius:6px;color:#5a4500;font-size:12px;';
      banner.innerHTML = `⏳ <strong>Quedan ~${horasRest} horas</strong> para editar este reporte. Después solo el administrador podrá modificarlo.`;
      cont.insertBefore(banner, cont.firstChild);
    }

    this.irA('pantallaDetalle');
  },

  // Política de edición: admin SIEMPRE puede; bombero solo durante las
  // primeras 24h desde fechaCreacion. Devuelve { permitido, razon, horas }.
  puedeEditarReporte(r) {
    if (this.esAdmin()) return { permitido: true, razon: 'admin' };
    if (!r || !r.fechaCreacion) return { permitido: true, razon: 'sin fecha' };
    const creado = new Date(r.fechaCreacion);
    if (isNaN(creado.getTime())) return { permitido: true, razon: 'fecha inválida' };
    const horas = (Date.now() - creado.getTime()) / 36e5;
    if (horas <= 24) return { permitido: true, razon: 'dentro de 24h', horas };
    return {
      permitido: false,
      razon: `Han pasado ${Math.floor(horas)} horas desde la creación. ` +
             `Solo el administrador puede modificar reportes con más de 24 horas. ` +
             `Si necesita corregir información, comuníquese con el administrador.`,
      horas
    };
  },

  async editarReporte() {
    if (!this.reporteActual) return;
    const puede = this.puedeEditarReporte(this.reporteActual);
    if (!puede.permitido) {
      this.toast(puede.razon, 'error');
      return;
    }

    // === HIDRATACIÓN ANTES DE EDITAR ===
    // Si el reporte fue descargado con datos planos (sin recursos/víctimas/orgs
    // completos desde el servidor), primero lo descargamos completo para no
    // sobrescribir con datos vacíos al guardar.
    let reporteParaEditar = this.reporteActual;
    const necesitaHidratar = reporteParaEditar.estado === 'enviado' &&
      navigator.onLine &&
      (!Array.isArray(reporteParaEditar.recursos) || reporteParaEditar.recursos.length === 0);

    if (necesitaHidratar) {
      this.toast('Descargando datos completos...', 'info');
      try {
        const completo = await this._descargarMiReporteCompleto(reporteParaEditar.id);
        if (completo && completo.recursos !== undefined) {
          reporteParaEditar = Object.assign({}, reporteParaEditar, completo);
          reporteParaEditar._hidratadoServidor = true;
          await DB.guardarReporte(reporteParaEditar);
          this.reporteActual = reporteParaEditar;
        }
      } catch (e) {
        console.warn('No se pudo hidratar reporte antes de editar:', e);
      }
    }

    // Marcar que esta sesión del formulario es una EDICIÓN de un reporte
    // que ya está en el servidor, para que al pulsar "Enviar" el cliente
    // mande _actualizar:true (en lugar de pedir nuevo consecutivo).
    this._esEdicionReporteExistente = true;
    this._idReporteEditandoBombero = reporteParaEditar.id;
    this._consecutivoOriginalBombero = reporteParaEditar.consecutivo || '';

    this.cargarEnFormulario(reporteParaEditar);
    this.fotosTemp = [...(reporteParaEditar.fotos || []), null, null, null, null, null, null].slice(0, 6);
    this.irA('pantallaForm');
  },

  async confirmarEliminar() {
    if (!this.reporteActual) return;
    const puede = this.puedeEditarReporte(this.reporteActual);
    if (!puede.permitido) {
      this.toast(puede.razon, 'error');
      return;
    }
    const ok = await this.confirmar('Eliminar reporte', '¿Seguro que desea eliminar este reporte? Esta acción no se puede deshacer.');
    if (!ok) return;
    await DB.eliminarReporte(this.reporteActual.id);
    this.toast('Reporte eliminado', 'exito');
    this.irA('pantallaHome');
  },

  // ==================== IMPRESIÓN PDF ====================
  async imprimirReporte() {
    if (!this.reporteActual) return;
    const r = this.reporteActual;
    const html = this.generarHTMLImpresion(r);

    const ventana = window.open('', '_blank');
    if (!ventana) {
      this.toast('Bloqueador de ventanas activo. Permita ventanas emergentes.', 'error');
      return;
    }
    ventana.document.write(html);
    ventana.document.close();
    setTimeout(() => {
      ventana.focus();
      ventana.print();
    }, 500);
  },

  generarHTMLImpresion(r) {
    const fecha = (s) => s ? new Date(s).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : '';
    const sn = (v) => v || '_____________';
    const checkbox = (chk) => chk ? '☒' : '☐';
    const isClasif = (t) => (r.clasificacion || []).includes(t);
    const isCausa = (c) => (r.causas || []).includes(c);

    const recursosFilas = (r.recursos || []).map(rec => `
      <tr>
        <td>${rec.recurso || ''}</td>
        <td style="text-align:center;">${rec.cantidad || ''}</td>
        <td>${rec.codigo || ''}</td>
        <td>${rec.responsable || ''}${rec.personal && rec.personal.length ? '<br><small>' + rec.personal.join(', ') + '</small>' : ''}</td>
      </tr>
    `).join('');

    const victimasFilas = (r.victimas || []).map(v => `
      <tr>
        <td>${v.nombre || ''} ${v.edad ? '/ ' + v.edad : ''}</td>
        <td>${v.tipo || ''}</td>
        <td>${v.lesiones || ''}</td>
        <td>${v.atencion || ''}</td>
        <td>${v.traslado || ''}</td>
      </tr>
    `).join('');

    const orgsFilas = (r.organizaciones || []).map(o => `
      <tr>
        <td>${o.entidad || ''}</td>
        <td>${o.rol || ''}</td>
        <td>${o.contacto || ''}</td>
      </tr>
    `).join('');

    const filaVacia = '<tr><td>&nbsp;</td><td></td><td></td><td></td></tr>';
    const filaVacia5 = '<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>';
    const filaVacia3 = '<tr><td>&nbsp;</td><td></td><td></td></tr>';

    const fotos = r.fotos || [];
    const tieneFotos = fotos.length > 0;

    // Genera una hoja de anexo con 3 fotos (indiceInicio..indiceInicio+2)
    const construirHojaFotos = (indiceInicio, etiquetaHoja, totalHojas) => {
      const slotsFotos = [];
      for (let i = indiceInicio; i < indiceInicio + 3; i++) {
        if (fotos[i]) {
          slotsFotos.push(`
            <div class="foto-grande">
              <img src="${fotos[i]}" alt="Foto ${i+1}">
              <div class="foto-pie">Fotografía ${i+1}</div>
            </div>
          `);
        } else {
          slotsFotos.push(`<div class="foto-grande vacia"></div>`);
        }
      }
      return `
        <div class="pagina pagina-fotos">
          <div class="header-mini">
            <img src="${typeof LOGO_BIG !== 'undefined' ? LOGO_BIG : ''}" alt="">
            <div>
              <strong>CUERPO DE BOMBEROS VOLUNTARIOS — INÍRIDA, GUAINÍA</strong><br>
              <span style="font-size: 9pt;">Anexo fotográfico — Reporte ${r.consecutivo || ''} — Hoja ${etiquetaHoja}/${totalHojas}</span>
            </div>
          </div>
          <div class="fotos-grid-pdf">
            ${slotsFotos.join('')}
          </div>
        </div>
      `;
    };

    let paginaFotos = '';
    if (tieneFotos) {
      // Hoja 1: fotos 1-3. Hoja 2: fotos 4-6 (solo si hay al menos una de las últimas tres).
      const hayHoja2 = fotos.length > 3;
      const totalHojas = hayHoja2 ? 2 : 1;
      paginaFotos = construirHojaFotos(0, 1, totalHojas);
      if (hayHoja2) {
        paginaFotos += construirHojaFotos(3, 2, totalHojas);
      }
    }

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${r.consecutivo}</title>
<style>
  :root { --logo-watermark: url("${typeof LOGO_BIG !== 'undefined' ? LOGO_BIG : ''}"); }
  @page { size: A4; margin: 10mm; }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt; color: #000 !important; margin: 0; padding: 0;
    line-height: 1.3;
    font-weight: 500;   /* texto más sólido para que no se vea opaco al imprimir */
  }
  .pagina {
    width: 100%; max-width: 190mm; margin: 0 auto;
    page-break-after: always;
    position: relative;
  }
  .pagina:last-child { page-break-after: auto; }
  /* Marca de agua del logo institucional — MUY tenue para no opacar el texto */
  .pagina::before {
    content: "";
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 120mm; height: 120mm;
    background-image: var(--logo-watermark);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.035;     /* bajada de 0.06 → 0.035 para que el texto se vea negro nítido */
    z-index: 0;
    pointer-events: none;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .pagina > * { position: relative; z-index: 1; }
  .header {
    display: flex; align-items: center; gap: 10px;
    border: 1px solid #000; padding: 5px;
    margin-bottom: 5px;
  }
  .header img.logo-h { width: 70px; height: 70px; object-fit: contain; background: white; }
  .header .info { flex: 1; text-align: center; font-size: 8pt; color: #000; }
  .header .info h2 { font-size: 11pt; margin: 0 0 2px 0; color: #000; }
  .header .invisible { width: 70px; visibility: hidden; }
  .titulo { text-align: center; font-size: 12pt; font-weight: bold; margin: 8px 0 3px; color: #000; }
  .lema { text-align: center; font-style: italic; font-size: 8pt; margin-bottom: 8px; color: #000; }
  .seccion { margin-bottom: 4px; }
  .seccion-titulo {
    background: #000; color: #fff; padding: 2px 5px;
    font-size: 9pt; font-weight: bold;
  }
  table { width: 100%; border-collapse: collapse; font-size: 8pt; color: #000; }
  table.tabla-datos td {
    border: 1px solid #000; padding: 2px 4px; vertical-align: top;
    color: #000;
  }
  table.tabla-datos td.label {
    font-weight: bold; background: #e8e8e8; width: 30%; color: #000;
  }
  .checkbox-row { display: flex; gap: 10px; flex-wrap: wrap; padding: 3px; font-size: 8pt; border: 1px solid #000; color: #000; }
  .checkbox-row > div { flex: 0 0 calc(25% - 8px); color: #000; }
  .narrativa-box {
    border: 1px solid #000; padding: 4px; min-height: 30px; font-size: 8pt; color: #000;
  }
  .firma-img { max-height: 40px; max-width: 100px; }
  .pie-pagina {
    border-top: 1px solid #000; padding-top: 3px; margin-top: 5px;
    font-size: 7pt; text-align: center; font-style: italic; color: #000;
  }
  .pie-pagina .credito {
    display: block; margin-top: 2px; font-style: normal; font-size: 6.5pt; color: #222;
  }
  .aviso { font-size: 7pt; font-style: italic; margin: 3px 0; padding: 2px; background: #fffbe6; color: #000; }

  .pagina-fotos {
    display: flex; flex-direction: column;
  }
  .header-mini {
    display: flex; align-items: center; gap: 10px;
    border: 1px solid #000; padding: 4px; margin-bottom: 6px; font-size: 9pt; color: #000;
  }
  .header-mini img { width: 40px; height: 40px; object-fit: contain; }
  /* === Anexo fotográfico ===
     3 fotos por hoja apiladas verticalmente, cada slot con tamaño fijo
     (no flex) para evitar desalineación al imprimir. Las imágenes se
     recortan al aspect ratio 3:2 horizontal uniforme (object-fit: cover)
     para que TODAS encajen igual, sean verticales u horizontales. */
  .fotos-grid-pdf {
    display: flex;
    flex-direction: column;
    gap: 4mm;
  }
  .foto-grande {
    border: 1px solid #000;
    background: #fafafa;
    width: 100%;
    height: 82mm;          /* 3 × 82mm + 2 × 4mm gap = 254mm — cabe en A4 */
    display: flex; flex-direction: column;
    overflow: hidden;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .foto-grande.vacia { background: white; border: 1px dashed #888; }
  .foto-grande img {
    width: 100%;
    height: calc(82mm - 6mm);   /* descuenta alto del pie */
    object-fit: cover;          /* uniforma todas las fotos: recorta sin distorsionar */
    object-position: center;
    background: white;
    display: block;
  }
  .foto-grande .foto-pie {
    font-size: 8pt; text-align: center;
    padding: 1px 2px; background: #e8e8e8; border-top: 1px solid #000; color: #000;
    height: 5mm; line-height: 5mm;
    flex-shrink: 0;
  }
</style>
</head>
<body>

<div class="pagina">
  <div class="header">
    <img class="logo-h" src="${typeof LOGO_BIG !== 'undefined' ? LOGO_BIG : ''}" alt="">
    <div class="info">
      <h2>CUERPO DE BOMBEROS VOLUNTARIOS</h2>
      <div>INÍRIDA – GUAINÍA</div>
      <div>Personería Jurídica N° 3561 del 5 de Agosto de 1976</div>
      <div>NIT: 843000056-0  |  Tel. ${TELEFONO_ESTACION}  |  Calle 15 N° 5-07 Zona Indígena</div>
    </div>
    <div class="invisible"></div>
  </div>

  <div class="titulo">REPORTE OFICIAL DE EMERGENCIAS</div>
  <div class="lema">"ABNEGACIÓN Y DISCIPLINA"</div>

  <div class="seccion">
    <div class="seccion-titulo">1. DATOS GENERALES DEL INCIDENTE</div>
    <table class="tabla-datos">
      <tr>
        <td class="label">N° DE REPORTE / RADICADO:</td><td>${sn(r.consecutivo)}</td>
        <td class="label">ESTACIÓN QUE ATIENDE:</td><td>${sn(r.estacion || NOMBRE_ESTACION)}</td>
      </tr>
      <tr>
        <td class="label">FECHA Y HORA DE LLAMADA:</td><td>${sn(fecha(r.fechaLlamada))}</td>
        <td class="label">FECHA/HORA DE LLEGADA:</td><td>${sn(fecha(r.fechaLlegada))}</td>
      </tr>
      <tr>
        <td class="label">FECHA/HORA DE CIERRE:</td><td>${sn(fecha(r.fechaCierre))}</td>
        <td class="label">TURNO / GUARDIA:</td><td>${sn(r.turno)}</td>
      </tr>
      <tr>
        <td class="label">QUIÉN REPORTA:</td><td>${sn(r.reportaNombre)}</td>
        <td class="label">TELÉFONO REPORTANTE:</td><td>${sn(r.reportaTel)}</td>
      </tr>
      <tr>
        <td class="label">RELACIÓN CON EL EVENTO:</td>
        <td colspan="3">${sn(r.reportaRelacion)}</td>
      </tr>
    </table>
  </div>

  <div class="seccion">
    <div class="seccion-titulo">2. CLASIFICACIÓN DEL EVENTO</div>
    <div class="checkbox-row">
      ${TIPOS_EVENTO.map(t => `<div>${checkbox(isClasif(t))} ${t}</div>`).join('')}
    </div>
    ${r.clasificacionOtra ? `<div style="font-size:8pt; padding: 2px;"><strong>Otra:</strong> ${r.clasificacionOtra}</div>` : ''}
  </div>

  <div class="seccion">
    <div class="seccion-titulo">3. UBICACIÓN DEL INCIDENTE</div>
    <table class="tabla-datos">
      <tr>
        <td class="label">DIRECCIÓN:</td><td>${sn(r.direccion)}</td>
        <td class="label">BARRIO / SECTOR:</td><td>${sn(r.barrio)}</td>
      </tr>
      <tr>
        <td class="label">MUNICIPIO:</td><td>${sn(r.municipio)}</td>
        <td class="label">LOCALIDAD / ZONA:</td><td>${sn(r.localidad)}</td>
      </tr>
      <tr>
        <td class="label">COORDENADAS:</td>
        <td>${r.gps ? `${r.gps.lat.toFixed(6)}, ${r.gps.lng.toFixed(6)}` : '_____________'}</td>
        <td class="label">REFERENCIA:</td><td>${sn(r.referencia)}</td>
      </tr>
    </table>
  </div>

  <div class="seccion">
    <div class="seccion-titulo">4. DESCRIPCIÓN DEL EVENTO</div>
    <div style="font-size:8pt; font-weight:bold;">NARRATIVA INICIAL:</div>
    <div class="narrativa-box">${sn(r.narrativa)}</div>
    <div style="font-size:8pt; font-weight:bold; margin-top:3px;">CONDICIONES AL LLEGAR:</div>
    <div class="narrativa-box">${sn(r.condiciones)}</div>
    ${tieneFotos ? `<div style="font-size:7pt; font-style:italic; margin-top:3px;">📷 Las ${fotos.length} fotografía(s) del incidente están en el anexo fotográfico al final del reporte.</div>` : ''}
  </div>

  <div class="seccion">
    <div class="seccion-titulo">5. RECURSOS DESPLEGADOS</div>
    <table class="tabla-datos">
      <tr>
        <td class="label" style="width:30%;">RECURSO</td>
        <td class="label" style="width:15%;">CANTIDAD</td>
        <td class="label" style="width:25%;">PLACA / CÓDIGO</td>
        <td class="label" style="width:30%;">RESPONSABLE</td>
      </tr>
      ${recursosFilas || filaVacia + filaVacia + filaVacia}
    </table>
  </div>

  <div class="seccion">
    <div class="seccion-titulo">6. DIAGNÓSTICO Y ÁREAS AFECTADAS</div>
    <table class="tabla-datos">
      <tr>
        <td class="label">MUERTOS:</td><td>${r.muertos||0}</td>
        <td class="label">HERIDOS:</td><td>${r.heridos||0}</td>
        <td class="label">DESAPARECIDOS:</td><td>${r.desaparecidos||0}</td>
      </tr>
      <tr>
        <td class="label">PERSONAS AFECTADAS:</td><td>${r.personasAfectadas||0}</td>
        <td class="label">FAMILIAS AFECTADAS:</td><td>${r.familiasAfectadas||0}</td>
        <td class="label">VIVIENDAS DESTRUIDAS:</td><td>${r.viviendasDestruidas||0}</td>
      </tr>
      <tr>
        <td class="label">VIVIENDAS AVERIADAS:</td><td>${r.viviendasAveriadas||0}</td>
        <td class="label">HECTÁREAS:</td><td>${r.hectareas||0}</td>
        <td class="label">VÍAS / PUENTES:</td><td>${r.viasAfectadas||0} / ${r.puentesAfectados||0}</td>
      </tr>
      <tr>
        <td class="label">PÉRDIDA ESTIMADA ($):</td><td colspan="5">${(r.perdidaEstimada||0).toLocaleString('es-CO')}</td>
      </tr>
      <tr>
        <td class="label">ZONA / PUNTO DE ORIGEN:</td><td colspan="5">${sn(r.zonaOrigen)}</td>
      </tr>
      <tr>
        <td class="label">ÁREAS AFECTADAS:</td><td colspan="5">${sn(r.areasAfectadas)}</td>
      </tr>
    </table>
  </div>

  <div class="seccion">
    <div class="seccion-titulo">7. DATOS DEL AFECTADO / PROPIETARIO</div>
    <table class="tabla-datos">
      <tr>
        <td class="label" style="width:25%;">NOMBRE COMPLETO</td>
        <td class="label" style="width:20%;">N° CÉDULA</td>
        <td class="label" style="width:20%;">CELULAR</td>
        <td class="label">FIRMA / HUELLA</td>
      </tr>
      <tr>
        <td>${sn(r.afectadoNombre)}</td>
        <td>${sn(r.afectadoCC)}</td>
        <td>${sn(r.afectadoCel)}</td>
        <td>${r.firmas?.afectado ? `<img src="${r.firmas.afectado}" class="firma-img">` : '&nbsp;'}</td>
      </tr>
    </table>
    <div class="aviso">⚠ Aviso Ley 1581 de 2012 (Habeas Data): Los datos personales recolectados serán tratados exclusivamente para la gestión y estadística de emergencias del Cuerpo de Bomberos Voluntarios de Inírida.</div>
  </div>
</div>

<div class="pagina">
  <div class="seccion">
    <div class="seccion-titulo">8. ACCIONES REALIZADAS</div>
    <div style="font-size:8pt; font-weight:bold;">ESTRATEGIAS Y TÁCTICAS EMPLEADAS:</div>
    <div class="narrativa-box" style="min-height: 50px;">${sn(r.acciones)}</div>
  </div>

  <div class="seccion">
    <div class="seccion-titulo">9. VÍCTIMAS / LESIONADOS / FALLECIDOS</div>
    <table class="tabla-datos">
      <tr>
        <td class="label">NOMBRE / EDAD</td>
        <td class="label">TIPO</td>
        <td class="label">LESIONES</td>
        <td class="label">ATENCIÓN</td>
        <td class="label">TRASLADO A</td>
      </tr>
      ${victimasFilas || filaVacia5 + filaVacia5}
    </table>
  </div>

  <div class="seccion">
    <div class="seccion-titulo">10. INVESTIGACIÓN Y DETERMINACIÓN DE CAUSAS</div>
    <div class="checkbox-row">
      ${CAUSAS.map(c => `<div>${checkbox(isCausa(c))} ${c}</div>`).join('')}
    </div>
    <table class="tabla-datos" style="margin-top:3px;">
      <tr><td class="label">CAUSA PROBABLE:</td><td colspan="3">${sn(r.causaProbable)}</td></tr>
      <tr><td class="label">EVIDENCIAS / INDICIOS:</td><td colspan="3">${sn(r.evidencias)}</td></tr>
      <tr><td class="label">CAUSA CONFIRMADA POR COMANDANTE:</td><td colspan="3">${sn(r.causaConfirmada)}</td></tr>
    </table>
  </div>

  <div class="seccion">
    <div class="seccion-titulo">11. OTRAS ORGANIZACIONES / PERSONAS QUE PARTICIPARON</div>
    <table class="tabla-datos">
      <tr>
        <td class="label" style="width:35%;">ENTIDAD / PERSONA</td>
        <td class="label" style="width:35%;">ROL / FUNCIÓN</td>
        <td class="label">CONTACTO</td>
      </tr>
      ${orgsFilas || filaVacia3 + filaVacia3}
    </table>
  </div>

  <div class="seccion">
    <div class="seccion-titulo">12. OBSERVACIONES Y RECOMENDACIONES</div>
    <div style="font-size:8pt; font-weight:bold;">OBSERVACIONES GENERALES:</div>
    <div class="narrativa-box">${sn(r.observaciones)}</div>
    <div style="font-size:8pt; font-weight:bold; margin-top:3px;">RECOMENDACIONES DE PREVENCIÓN:</div>
    <div class="narrativa-box">${sn(r.recomendaciones)}</div>
  </div>

  <div class="seccion">
    <div class="seccion-titulo">13. FIRMA DEL COMANDANTE DEL INCIDENTE</div>
    <table class="tabla-datos">
      <tr>
        <td class="label">COMANDANTE DEL INCIDENTE:</td><td>${sn(r.comandanteNombre)}</td>
        <td class="label">GRADO:</td><td>${sn(r.comandanteGrado)}</td>
      </tr>
      <tr>
        <td class="label">CÉDULA:</td><td>${sn(r.comandanteCC)}</td>
        <td class="label">ESTACIÓN:</td><td>${sn(r.comandanteEstacion)}</td>
      </tr>
      <tr>
        <td class="label">FIRMA:</td>
        <td colspan="3" style="height: 60px;">
          ${r.firmas?.comandante ? `<img src="${r.firmas.comandante}" class="firma-img" style="max-height: 55px;">` : '&nbsp;'}
        </td>
      </tr>
    </table>
  </div>

  ${r.operador ? `
    <div style="font-size:7pt; margin-top: 5px; padding: 3px; background: #f9fafb; border: 1px solid #ddd;">
      Reporte registrado en la app por: <strong>${r.operador}</strong>${r.operadorGrado ? ' (' + r.operadorGrado + ')' : ''}${r.operadorTel ? ' · Tel: ' + r.operadorTel : ''}
    </div>
  ` : ''}

  <div class="pie-pagina">
    Documento bajo Ley 1575 de 2012 (Ley General de Bomberos de Colombia) | Ley 1581 de 2012 (Habeas Data)<br>
    Cuerpo de Bomberos Voluntarios Inírida – Guainía | "ABNEGACIÓN Y DISCIPLINA" | Calle 15 N° 5-07 Zona Indígena | Tel. ${TELEFONO_ESTACION}
    <span class="credito">— App desarrollada por ${CREDITO_AUTOR.nombre} · ${CREDITO_AUTOR.cuerpo} · 📧 ${CREDITO_AUTOR.correo} · 📱 ${CREDITO_AUTOR.telefono} —</span>
  </div>
</div>

${paginaFotos}

</body>
</html>`;
  },

  async exportarTodo() {
    const reportes = await DB.listarReportes();
    if (reportes.length === 0) { this.toast('No hay reportes', 'error'); return; }
    const blob = new Blob([JSON.stringify(reportes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bomberos_inirida_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast(`${reportes.length} reportes exportados`, 'exito');
  },

  // ==================== UTILIDADES ====================
  toast(mensaje, tipo = '') {
    const t = document.getElementById('toast');
    t.textContent = mensaje;
    t.className = 'toast visible ' + tipo;
    setTimeout(() => t.classList.remove('visible'), 3000);
  },

  confirmar(titulo, mensaje) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensaje').textContent = mensaje;
    document.getElementById('modalConfirmar').classList.add('visible');
    const btnConfirmar = document.getElementById('modalConfirmarBtn');
    return new Promise(resolve => {
      // Función única que resuelve y cierra (sin doble llamada)
      this._modalResolve = (valor) => {
        document.getElementById('modalConfirmar').classList.remove('visible');
        const r = this._modalResolve;
        this._modalResolve = null;
        if (r) resolve(valor);
      };
      btnConfirmar.onclick = () => { if (this._modalResolve) this._modalResolve(true); };
    });
  },

  cerrarModal() {
    if (this._modalResolve) {
      this._modalResolve(false);
    } else {
      document.getElementById('modalConfirmar').classList.remove('visible');
    }
  },

  escucharConexion() {
    const actualizar = () => {
      const header = document.getElementById('header');
      const texto = document.getElementById('estadoTexto');
      if (navigator.onLine) {
        header.classList.remove('offline');
        texto.textContent = 'En línea';
      } else {
        header.classList.add('offline');
        texto.textContent = 'Sin conexión';
      }
    };
    actualizar();
    window.addEventListener('online', actualizar);
    window.addEventListener('offline', actualizar);
  },

  registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  },

  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  fechaLocalISO(fecha) {
    const offset = fecha.getTimezoneOffset();
    const local = new Date(fecha.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }
};

// Cerrar menú usuario al tocar afuera
document.addEventListener('click', (e) => {
  const userMenu = document.getElementById('userMenu');
  const userAvatar = document.getElementById('userAvatar');
  if (userMenu && userMenu.classList.contains('visible')) {
    if (!userMenu.contains(e.target) && !userAvatar.contains(e.target)) {
      userMenu.classList.remove('visible');
    }
  }
});

window.addEventListener('DOMContentLoaded', () => app.init());

document.addEventListener('input', (e) => {
  if (e.target.closest('#pantallaForm')) app.actualizarProgreso();
});
document.addEventListener('change', (e) => {
  if (e.target.closest('#pantallaForm')) app.actualizarProgreso();
});
