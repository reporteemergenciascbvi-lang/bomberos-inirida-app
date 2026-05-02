/* ============================================================
   APP DE REPORTE DE EMERGENCIAS - BOMBEROS INÍRIDA v2
   Funciona 100% offline, sincroniza cuando hay señal.
   ============================================================ */

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

/* ============================================================
   BASE DE DATOS LOCAL (IndexedDB)
   ============================================================ */
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

/* ============================================================
   APLICACIÓN PRINCIPAL
   ============================================================ */
const app = {
  reporteActual: null,
  pantallaActual: 'pantallaHome',
  config: { estacion: 'CBVI', operador: '', urlBackend: '', token: '', proximoNumero: 1, prefijo: 'RE' },
  fotosTemp: [null, null, null],
  firmas: { afectado: null, comandante: null },
  modalCallback: null,
  fotoSlotActivo: null,
  modoUbicacion: 'auto', // auto | manual

  async init() {
    // Cargar logos en el header
    if (typeof LOGO_SMALL !== 'undefined') {
      document.getElementById('logoHeader').src = LOGO_SMALL;
    }

    await DB.abrir();
    await this.cargarConfig();
    this.escucharConexion();
    this.inicializarCheckboxes();
    this.inicializarFirmas();
    this.configurarFoto();
    await this.actualizarHome();
    this.registrarServiceWorker();

    window.addEventListener('online', () => {
      this.toast('Conexión restablecida. Sincronizando...', 'exito');
      this.sincronizarPendientes(true);
    });
  },

  async cargarConfig() {
    const cfg = await DB.obtenerConfig('app');
    if (cfg) this.config = { ...this.config, ...cfg };
    document.getElementById('cfg_estacion').value = this.config.estacion || 'CBVI';
    document.getElementById('cfg_operador').value = this.config.operador || '';
    document.getElementById('cfg_url_backend').value = this.config.urlBackend || '';
    document.getElementById('cfg_token').value = this.config.token || '';
    document.getElementById('cfg_proximo_numero').value = this.config.proximoNumero || 1;
    document.getElementById('cfg_prefijo').value = this.config.prefijo || 'RE';
  },

  async guardarConfig() {
    this.config.estacion = document.getElementById('cfg_estacion').value.trim() || 'CBVI';
    this.config.operador = document.getElementById('cfg_operador').value.trim();
    this.config.urlBackend = document.getElementById('cfg_url_backend').value.trim();
    this.config.token = document.getElementById('cfg_token').value.trim();
    this.config.proximoNumero = +document.getElementById('cfg_proximo_numero').value || 1;
    this.config.prefijo = document.getElementById('cfg_prefijo').value.trim().toUpperCase() || 'RE';
    await DB.guardarConfig('app', this.config);
    this.toast('Configuración guardada', 'exito');
    this.irA('pantallaHome');
  },

  /* --- NAVEGACIÓN --- */
  irA(pantallaId) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    document.getElementById(pantallaId).classList.add('activa');
    this.pantallaActual = pantallaId;
    window.scrollTo(0, 0);

    const btnVolver = document.getElementById('btnVolver');
    if (pantallaId === 'pantallaHome') {
      btnVolver.style.display = 'none';
      document.getElementById('headerTitulo').textContent = 'Bomberos Inírida';
      this.actualizarHome();
    } else {
      btnVolver.style.display = 'inline-block';
      btnVolver.onclick = () => this.irA('pantallaHome');
      const titulos = {
        pantallaForm: 'Reporte de Emergencia',
        pantallaDetalle: 'Detalle del Reporte',
        pantallaConfig: 'Configuración'
      };
      document.getElementById('headerTitulo').textContent = titulos[pantallaId] || '';
    }
  },

  /* --- HOME --- */
  async actualizarHome() {
    const reportes = await DB.listarReportes();
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
            <div class="consec">${r.consecutivo || 'Sin número'}</div>
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

  /* --- NUEVO REPORTE --- */
  generarConsecutivo() {
    const anio = new Date().getFullYear();
    const numero = String(this.config.proximoNumero || 1).padStart(4, '0');
    return `${this.config.prefijo}-${anio}-${numero}`;
  },

  async nuevoReporte() {
    const consec = this.generarConsecutivo();
    const ahora = new Date();
    this.reporteActual = {
      id: this.uuid(),
      consecutivo: consec,
      estado: 'borrador',
      fechaCreacion: ahora.toISOString(),
      fechaModificacion: ahora.toISOString(),
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

    this.fotosTemp = [null, null, null];
    this.firmas = { afectado: null, comandante: null };
    this.modoUbicacion = 'auto';

    this.limpiarFormulario();
    document.getElementById('f_consecutivo').value = consec;
    document.getElementById('f_estacion').value = this.config.estacion || 'CBVI';
    document.getElementById('f_fecha_llamada').value = this.fechaLocalISO(ahora);
    document.getElementById('f_municipio').value = 'Inírida';

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
    document.querySelectorAll('.foto-slot').forEach((slot, i) => {
      slot.innerHTML = `<span class="icono">📷</span><span>Foto ${i+1}</span>`;
      slot.classList.remove('con-foto');
    });
    this.limpiarFirma('firmaAfectado');
    this.limpiarFirma('firmaComandante');
    document.getElementById('tablaRecursos').innerHTML = '';
    document.getElementById('tablaVictimas').innerHTML = '';
    document.getElementById('tablaOrgs').innerHTML = '';
  },

  /* --- CHECKBOXES --- */
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

  /* --- GPS --- */
  modoGPS(modo) {
    this.modoUbicacion = modo;
    this.actualizarUIGPS();
    if (modo === 'auto') {
      this.capturarGPS();
    } else {
      const card = document.getElementById('gpsCard');
      const coords = document.getElementById('gpsCoords');
      coords.textContent = 'Modo manual — escriba las coordenadas abajo';
      // Si hay coordenadas guardadas, ponerlas en los campos manuales
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
    } else {
      btnAuto.classList.add('activo');
      btnActualizar.style.display = 'inline-block';
    }
  },

  capturarGPS() {
    if (this.modoUbicacion !== 'auto') return;
    const card = document.getElementById('gpsCard');
    const coords = document.getElementById('gpsCoords');

    if (!navigator.geolocation) {
      coords.textContent = 'GPS no disponible. Use modo manual.';
      card.classList.add('error');
      return;
    }
    coords.textContent = 'Obteniendo ubicación...';
    card.classList.remove('error');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const acc = Math.round(pos.coords.accuracy);
        coords.textContent = `${lat}, ${lng} (±${acc}m)`;
        if (this.reporteActual) {
          this.reporteActual.gps = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
          this.reporteActual.gpsManual = false;
        }
        this.actualizarProgreso();
      },
      (err) => {
        const msgs = {
          1: 'Permiso denegado. Active GPS o use modo manual.',
          2: 'Sin ubicación. Use modo manual.',
          3: 'Tiempo agotado. Use modo manual.'
        };
        coords.textContent = msgs[err.code] || 'Error de GPS';
        card.classList.add('error');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  },

  /* --- FOTOS --- */
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

  /* --- FIRMAS --- */
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

  /* --- TABLAS DINÁMICAS --- */
  agregarRecurso(datos) {
    const cont = document.getElementById('tablaRecursos');
    const idx = cont.children.length;
    const div = document.createElement('div');
    div.className = 'fila';
    div.innerHTML = `
      <button class="quitar-fila" onclick="this.parentElement.remove()">×</button>
      <div class="campo">
        <label>Recurso</label>
        <select data-campo="recurso" onchange="app.cambioTipoRecurso(this)">
          <option value="">-- Seleccione --</option>
          <option>Carro bomba 1</option>
          <option>Carro bomba 2</option>
          <option>Vehículo de rescate</option>
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
        <input type="text" data-campo="responsable">
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
      const opciones = ['Carro bomba 1', 'Carro bomba 2', 'Vehículo de rescate', 'Ambulancia', 'Personal', 'Otro'];
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

    if (select.value === 'Otro') {
      otroInput.style.display = 'block';
    } else {
      otroInput.style.display = 'none';
    }

    if (select.value === 'Personal') {
      personalBloque.style.display = 'block';
    } else {
      personalBloque.style.display = 'none';
    }
  },

  agregarBombero(btn) {
    const fila = btn.previousElementSibling;
    this.agregarBomberoConNombre(btn.closest('.fila'), '');
  },

  agregarBomberoConNombre(filaRecurso, nombre) {
    const lista = filaRecurso.querySelector('[data-personal]');
    const item = document.createElement('div');
    item.className = 'item-personal';
    item.innerHTML = `
      <input type="text" placeholder="Nombre del bombero" value="${nombre.replace(/"/g, '&quot;')}">
      <button type="button" class="quitar-personal" onclick="this.parentElement.remove()">×</button>
    `;
    lista.appendChild(item);
  },

  agregarVictima(datos) {
    const cont = document.getElementById('tablaVictimas');
    const div = document.createElement('div');
    div.className = 'fila';
    div.innerHTML = `
      <button class="quitar-fila" onclick="this.parentElement.remove()">×</button>
      <div class="campo-fila">
        <div class="campo"><label>Nombre</label><input type="text" data-campo="nombre"></div>
        <div class="campo"><label>Edad</label><input type="number" data-campo="edad" min="0"></div>
      </div>
      <div class="campo">
        <label>Tipo</label>
        <select data-campo="tipo">
          <option>Lesionado</option><option>Fallecido</option><option>Ileso</option>
        </select>
      </div>
      <div class="campo"><label>Lesiones</label><input type="text" data-campo="lesiones"></div>
      <div class="campo"><label>Atención brindada</label><input type="text" data-campo="atencion"></div>
      <div class="campo"><label>Trasladado a</label><input type="text" data-campo="traslado"></div>
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
      <div class="campo"><label>Entidad / Persona</label><input type="text" data-campo="entidad"></div>
      <div class="campo"><label>Rol / Función</label><input type="text" data-campo="rol"></div>
      <div class="campo"><label>Contacto</label><input type="text" data-campo="contacto"></div>
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

  /* --- LECTURA DEL FORMULARIO --- */
  leerFormulario() {
    const r = this.reporteActual;
    r.fechaModificacion = new Date().toISOString();
    r.estacion = document.getElementById('f_estacion').value;
    r.fechaLlamada = document.getElementById('f_fecha_llamada').value;
    r.fechaLlegada = document.getElementById('f_fecha_llegada').value;
    r.fechaCierre = document.getElementById('f_fecha_cierre').value;
    r.reportaNombre = document.getElementById('f_reporta_nombre').value;
    r.reportaTel = document.getElementById('f_reporta_tel').value;
    r.reportaRelacion = document.getElementById('f_reporta_relacion').value;
    r.turno = document.getElementById('f_turno').value;

    r.clasificacion = Array.from(document.querySelectorAll('[data-grupo="clasificacion"]:checked')).map(c => c.value);
    r.clasificacionOtra = document.getElementById('f_clasif_otra').value;

    // Ubicación con soporte manual
    if (this.modoUbicacion === 'manual') {
      const lat = parseFloat(document.getElementById('f_lat_manual').value);
      const lng = parseFloat(document.getElementById('f_lng_manual').value);
      if (!isNaN(lat) && !isNaN(lng)) {
        r.gps = { lat, lng, accuracy: 0 };
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

  cargarEnFormulario(r) {
    document.getElementById('f_consecutivo').value = r.consecutivo || '';
    document.getElementById('f_estacion').value = r.estacion || '';
    document.getElementById('f_fecha_llamada').value = r.fechaLlamada || '';
    document.getElementById('f_fecha_llegada').value = r.fechaLlegada || '';
    document.getElementById('f_fecha_cierre').value = r.fechaCierre || '';
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
    document.getElementById('f_municipio').value = r.municipio || '';
    document.getElementById('f_referencia').value = r.referencia || '';

    document.getElementById('f_narrativa').value = r.narrativa || '';
    document.getElementById('f_condiciones').value = r.condiciones || '';

    this.fotosTemp = [null, null, null];
    (r.fotos || []).forEach((f, i) => {
      if (i < 3) {
        this.fotosTemp[i] = f;
        const slotEl = document.querySelector(`.foto-slot[data-foto="${i}"]`);
        slotEl.innerHTML = `
          <img src="${f}" alt="">
          <button class="quitar" onclick="event.stopPropagation(); app.quitarFoto(${i})">×</button>
        `;
        slotEl.classList.add('con-foto');
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
    document.getElementById('f_comandante_estacion').value = r.comandanteEstacion || '';

    this.firmas = { ...(r.firmas || {}) };
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

  /* --- PROGRESO --- */
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
    llenas++; // Sec 11 opcional
    llenas++; // Sec 12 opcional
    if (document.getElementById('f_comandante_nombre').value) llenas++;

    const pct = Math.min(100, Math.round((llenas / total) * 100));
    document.getElementById('progresoFill').style.width = pct + '%';
    document.getElementById('progresoTexto').textContent = pct + '%';
  },

  /* --- GUARDAR / ENVIAR --- */
  async guardarBorrador() {
    const r = this.leerFormulario();
    r.estado = 'borrador';
    await DB.guardarReporte(r);
    this.toast('Borrador guardado', 'exito');
    this.irA('pantallaHome');
  },

  async enviarReporte() {
    const r = this.leerFormulario();
    if (!r.narrativa || !r.direccion || !r.comandanteNombre) {
      this.toast('Faltan: narrativa, dirección y comandante', 'error');
      return;
    }
    r.estado = 'pendiente';
    await DB.guardarReporte(r);

    // Incrementar consecutivo solo cuando se envía exitosamente o queda pendiente
    if (r.consecutivo && r.consecutivo.includes(this.config.prefijo + '-')) {
      const numActual = parseInt(r.consecutivo.split('-').pop());
      if (numActual === this.config.proximoNumero) {
        this.config.proximoNumero = numActual + 1;
        await DB.guardarConfig('app', this.config);
      }
    }

    this.toast('Reporte guardado. Sincronizando...', 'exito');
    this.irA('pantallaHome');

    if (navigator.onLine && this.config.urlBackend) {
      this.sincronizarReporte(r);
    }
  },

  async sincronizarReporte(reporte) {
    if (!this.config.urlBackend) return false;
    try {
      const payload = { ...reporte, token: this.config.token || '' };
      await fetch(this.config.urlBackend, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      reporte.estado = 'enviado';
      reporte.fechaEnviado = new Date().toISOString();
      await DB.guardarReporte(reporte);
      this.actualizarHome();
      return true;
    } catch (err) {
      console.error('Error al sincronizar:', err);
      return false;
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

  /* --- DETALLE --- */
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
        <h3>${r.consecutivo}</h3>
        <p style="font-size: 12px; color: var(--gris-texto); margin-bottom: 12px;">
          <span class="badge ${r.estado}">${this.etiquetaEstado(r.estado)}</span>
          ${fecha}
        </p>
        <p><strong>Tipo:</strong> ${tipos}</p>
        <p><strong>Dirección:</strong> ${r.direccion || '—'}</p>
        <p><strong>Barrio:</strong> ${r.barrio || '—'}</p>
        ${r.gps ? `<p><strong>GPS:</strong> ${r.gps.lat.toFixed(6)}, ${r.gps.lng.toFixed(6)} ${r.gpsManual ? '(manual)' : ''}</p>` : ''}
        <p><strong>Narrativa:</strong> ${r.narrativa || '—'}</p>
      </div>
      ${recursosHTML ? `<div class="config-card"><h3>Recursos</h3><ul style="padding-left: 20px;">${recursosHTML}</ul></div>` : ''}
      <div class="config-card">
        <h3>Diagnóstico</h3>
        <p>Muertos: ${r.muertos||0} · Heridos: ${r.heridos||0} · Desaparecidos: ${r.desaparecidos||0}</p>
        <p>Personas afectadas: ${r.personasAfectadas||0} · Familias: ${r.familiasAfectadas||0}</p>
      </div>
      ${r.fotos && r.fotos.length ? `<div class="config-card"><h3>Fotografías</h3>${fotosHTML}</div>` : ''}
      <div class="config-card">
        <h3>Comandante</h3>
        <p>${r.comandanteNombre || '—'} ${r.comandanteGrado ? `(${r.comandanteGrado})` : ''}</p>
      </div>
    `;

    document.getElementById('btnReintentarEnvio').style.display =
      r.estado === 'pendiente' ? 'inline-flex' : 'none';

    this.irA('pantallaDetalle');
  },

  async editarReporte() {
    if (!this.reporteActual) return;
    this.cargarEnFormulario(this.reporteActual);
    this.fotosTemp = [...(this.reporteActual.fotos || []), null, null, null].slice(0, 3);
    this.irA('pantallaForm');
  },

  async confirmarEliminar() {
    const ok = await this.confirmar('Eliminar reporte', '¿Seguro que desea eliminar este reporte? Esta acción no se puede deshacer.');
    if (!ok) return;
    await DB.eliminarReporte(this.reporteActual.id);
    this.toast('Reporte eliminado', 'exito');
    this.irA('pantallaHome');
  },

  /* ============================================================
     IMPRESIÓN - genera el PDF estilo formato oficial
     ============================================================ */
  async imprimirReporte() {
    if (!this.reporteActual) return;
    const r = this.reporteActual;
    const html = this.generarHTMLImpresion(r);

    // Abrir en nueva ventana para imprimir
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

    const fotos = (r.fotos || []).slice(0, 3).map(f =>
      `<img src="${f}" style="max-width: 30%; max-height: 100px; margin: 2px; border: 1px solid #ccc;">`
    ).join('');

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${r.consecutivo}</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt; color: #000; margin: 0; padding: 0;
    line-height: 1.3;
  }
  .pagina {
    width: 100%; max-width: 190mm; margin: 0 auto;
    page-break-after: always;
  }
  .pagina:last-child { page-break-after: auto; }
  .header {
    display: flex; align-items: center; gap: 10px;
    border: 1px solid #000; padding: 5px;
    margin-bottom: 5px;
  }
  .header img { width: 70px; height: 70px; object-fit: contain; }
  .header .info { flex: 1; text-align: center; font-size: 8pt; }
  .header .info h2 { font-size: 11pt; margin: 0 0 2px 0; }
  .titulo {
    text-align: center; font-size: 12pt; font-weight: bold;
    margin: 8px 0 3px;
  }
  .lema { text-align: center; font-style: italic; font-size: 8pt; margin-bottom: 8px; }
  .seccion {
    margin-bottom: 4px;
  }
  .seccion-titulo {
    background: #000; color: #fff; padding: 2px 5px;
    font-size: 9pt; font-weight: bold;
  }
  table {
    width: 100%; border-collapse: collapse;
    font-size: 8pt;
  }
  table.tabla-datos td {
    border: 1px solid #000; padding: 2px 4px; vertical-align: top;
  }
  table.tabla-datos td.label {
    font-weight: bold; background: #f0f0f0; width: 30%;
  }
  .checkbox-row { display: flex; gap: 10px; flex-wrap: wrap; padding: 3px; font-size: 8pt; border: 1px solid #000; }
  .checkbox-row > div { flex: 0 0 calc(25% - 8px); }
  .narrativa-box {
    border: 1px solid #000; padding: 4px; min-height: 30px;
    font-size: 8pt;
  }
  .firma-img { max-height: 40px; max-width: 100px; }
  .pie-pagina {
    border-top: 1px solid #000;
    padding-top: 3px;
    margin-top: 5px;
    font-size: 7pt; text-align: center; font-style: italic;
  }
  .aviso { font-size: 7pt; font-style: italic; margin: 3px 0; padding: 2px; background: #fffbe6; }
  .fotos { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 3px; }
</style>
</head>
<body>

<!-- PÁGINA 1 -->
<div class="pagina">
  <div class="header">
    <img src="${typeof LOGO_BIG !== 'undefined' ? LOGO_BIG : ''}" alt="">
    <div class="info">
      <h2>CUERPO DE BOMBEROS VOLUNTARIOS</h2>
      <div>INÍRIDA – GUAINÍA</div>
      <div>Personería Jurídica N° 3561 del 5 de Agosto de 1976</div>
      <div>NIT: 843000056-0  |  Tel. 5 656007  |  Calle 15 N° 5-07 Zona Indígena</div>
    </div>
    <img src="${typeof LOGO_BIG !== 'undefined' ? LOGO_BIG : ''}" alt="" style="visibility:hidden;">
  </div>

  <div class="titulo">REPORTE OFICIAL DE EMERGENCIAS</div>
  <div class="lema">"ABNEGACIÓN Y DISCIPLINA"</div>

  <!-- 1. DATOS GENERALES -->
  <div class="seccion">
    <div class="seccion-titulo">1. DATOS GENERALES DEL INCIDENTE</div>
    <table class="tabla-datos">
      <tr>
        <td class="label">N° DE REPORTE / RADICADO:</td><td>${sn(r.consecutivo)}</td>
        <td class="label">ESTACIÓN QUE ATIENDE:</td><td>${sn(r.estacion)}</td>
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
        <td class="label" colspan="1">RELACIÓN CON EL EVENTO:</td>
        <td colspan="3">${sn(r.reportaRelacion)}</td>
      </tr>
    </table>
  </div>

  <!-- 2. CLASIFICACIÓN -->
  <div class="seccion">
    <div class="seccion-titulo">2. CLASIFICACIÓN DEL EVENTO</div>
    <div class="checkbox-row">
      ${TIPOS_EVENTO.map(t => `<div>${checkbox(isClasif(t))} ${t}</div>`).join('')}
    </div>
    ${r.clasificacionOtra ? `<div style="font-size:8pt; padding: 2px;"><strong>Otra:</strong> ${r.clasificacionOtra}</div>` : ''}
  </div>

  <!-- 3. UBICACIÓN -->
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

  <!-- 4. DESCRIPCIÓN -->
  <div class="seccion">
    <div class="seccion-titulo">4. DESCRIPCIÓN DEL EVENTO</div>
    <div style="font-size:8pt; font-weight:bold;">NARRATIVA INICIAL:</div>
    <div class="narrativa-box">${sn(r.narrativa)}</div>
    <div style="font-size:8pt; font-weight:bold; margin-top:3px;">CONDICIONES AL LLEGAR:</div>
    <div class="narrativa-box">${sn(r.condiciones)}</div>
    ${fotos ? `<div class="fotos">${fotos}</div>` : ''}
  </div>

  <!-- 5. RECURSOS -->
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

  <!-- 6. DIAGNÓSTICO -->
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

  <!-- 7. AFECTADO -->
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

<!-- PÁGINA 2 -->
<div class="pagina">
  <!-- 8. ACCIONES -->
  <div class="seccion">
    <div class="seccion-titulo">8. ACCIONES REALIZADAS</div>
    <div style="font-size:8pt; font-weight:bold;">ESTRATEGIAS Y TÁCTICAS EMPLEADAS:</div>
    <div class="narrativa-box" style="min-height: 50px;">${sn(r.acciones)}</div>
  </div>

  <!-- 9. VÍCTIMAS -->
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

  <!-- 10. CAUSAS -->
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

  <!-- 11. ORGANIZACIONES -->
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

  <!-- 12. OBSERVACIONES -->
  <div class="seccion">
    <div class="seccion-titulo">12. OBSERVACIONES Y RECOMENDACIONES</div>
    <div style="font-size:8pt; font-weight:bold;">OBSERVACIONES GENERALES:</div>
    <div class="narrativa-box">${sn(r.observaciones)}</div>
    <div style="font-size:8pt; font-weight:bold; margin-top:3px;">RECOMENDACIONES DE PREVENCIÓN:</div>
    <div class="narrativa-box">${sn(r.recomendaciones)}</div>
  </div>

  <!-- 13. COMANDANTE -->
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

  <div class="pie-pagina">
    Documento bajo Ley 1575 de 2012 (Ley General de Bomberos de Colombia) | Ley 1581 de 2012 (Habeas Data)<br>
    Cuerpo de Bomberos Voluntarios Inírida – Guainía | "ABNEGACIÓN Y DISCIPLINA" | Calle 15 N° 5-07 Zona Indígena | Tel. 5 656007
  </div>
</div>

</body>
</html>`;
  },

  /* --- EXPORTAR --- */
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

  /* --- UI HELPERS --- */
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
      const cerrar = (valor) => {
        this.cerrarModal();
        resolve(valor);
      };
      btnConfirmar.onclick = () => cerrar(true);
      this.modalCallback = () => cerrar(false);
    });
  },

  cerrarModal() {
    document.getElementById('modalConfirmar').classList.remove('visible');
    if (this.modalCallback) {
      const cb = this.modalCallback;
      this.modalCallback = null;
      cb();
    }
  },

  /* --- ESTADO DE CONEXIÓN --- */
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

window.addEventListener('DOMContentLoaded', () => app.init());

document.addEventListener('input', (e) => {
  if (e.target.closest('#pantallaForm')) app.actualizarProgreso();
});
document.addEventListener('change', (e) => {
  if (e.target.closest('#pantallaForm')) app.actualizarProgreso();
});
