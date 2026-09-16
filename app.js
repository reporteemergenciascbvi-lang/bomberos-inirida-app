/* ============================================================
   REPORTES DE BOMBEROS — App de gestión operativa multi-cuerpo
   Login con Google · Panel de administrador · GPS · offline-first

   © 2026 Jeferson Jeancarlos Rangel Gil. Todos los derechos reservados.
   Prohibida la reproducción o distribución de este código sin autorización
   escrita del autor.
   ============================================================ */

/* El tutorial en video lo graba el autor; hasta que exista, esta constante va vacía
   y la pantalla "Acerca de" muestra "próximamente" en vez de abrir una página rota.
   Cuando esté, se pega acá el enlace (YouTube, Drive, lo que sea) y listo. */
const URL_TUTORIAL_VIDEO = '';

// ==================== CONFIGURACIÓN ====================
/* ⚠️⚠️ ACOPLAMIENTO PENDIENTE DE ROMPER — ya es el Client ID del producto.
   Un solo Client ID = un solo proyecto de Google Cloud = una sola cuota y un solo
   estado de verificación. Si el producto genera tráfico sospechoso en pruebas, o
   toca el tope de ~100 usuarios sin verificar (ver T7 en ESTADO_PRODUCTO.md),
   Google puede limitar el Client ID COMPLETO — y eso apagaría el login de la estación de origen
   el mismo día, sin que ella haya hecho nada.
   Jeferson debe crear un proyecto de Google Cloud NUEVO y separado para el
   producto (ver ESTADO_PRODUCTO.md) y reemplazar este valor antes de dar acceso
   a cualquier cuerpo externo. NO desplegar a un cliente real con este ID. */
const GOOGLE_CLIENT_ID = '938285517928-k50ohvdskleg4vt8hkklnc7ul2bi2044.apps.googleusercontent.com';

/* ⚠️ T1 — VACÍO A PROPÓSITO. Antes acá vivían los 4 correos de administrador de
   de una estación, QUEMADOS EN EL FRONTEND, que se publica abierto en GitHub Pages.
   Mandar el producto así le daba privilegio de admin a 4 personas ajenas sobre
   los datos de cualquier cuerpo que lo instalara.

   Y era la SEGUNDA fuente de verdad sobre quién es admin: el front decidía por su
   cuenta e ignoraba la lista del backend. Ese bug ya mordió antes.

   AHORA: quién es admin lo dice SOLO el servidor, en la respuesta de iniciarSesion
   (`esAdmin`). El front no vota. */
const ADMIN_EMAILS = [];
const ADMIN_EMAIL = '';
const ADMIN_PASSWORD = ''; // La contraseña NO está en el código — el admin la escribe al entrar al panel.

/* Datos de la institución: los entrega el backend en iniciarSesion (`institucion`).
   Vacíos hasta que el asistente de arranque los llene. */
let TELEFONO_ESTACION = '';
let NOMBRE_ESTACION = '';

/* ⚠️⚠️ URL DEL BACKEND — VACÍA A PROPÓSITO, Y ES LO MÁS IMPORTANTE DE ESTE ARCHIVO.
   Antes apuntaba al Apps Script de la estación de origen. Si el producto saliera así, CADA cuerpo
   que lo instalara estaría escribiendo dentro de la base de datos de otro cuerpo:
   sus emergencias, su personal y sus sanciones mezclados con los de otra institución.

   No es una fuga de datos: es corrupción de datos en las dos direcciones.

   Se llena con la URL del despliegue del PRODUCTO cuando exista. Mientras esté
   vacía, `_exigirBackend()` corta con un mensaje claro en vez de fallar raro.
   El invariante I1 protege también la URL de la estación de origen, que vive aparte.

   14/08/2026 — YA EXISTE. Desplegada desde la cuenta monitoreojean@gmail.com,
   con `executeAs: USER_ACCESSING` (ver appsscript.json): el script corre como
   QUIEN ENTRA, así que la hoja de cálculo se crea en el Drive de cada cuerpo y
   no en el de nadie más. Ese ajuste es el que sostiene el modelo entero.

   🔴 DESDE HOY ESTA URL TIENE EL MISMO ESTATUS QUE LA DE LA ESTACIÓN DE ORIGEN (invariante I1):
   NO se cambia. Para publicar un backend nuevo: Implementar → Administrar
   implementaciones → ✏️ Editar → Nueva versión, SOBRE LA MISMA implementación.
   Crear una implementación nueva genera otra URL y deja ciega a toda app ya
   instalada — que para entonces será la de otro cuerpo de bomberos, no la tuya. */
const URL_BACKEND = 'https://script.google.com/macros/s/AKfycbz2jTdG0iDudW1phC8IyEMOyWmzkZs7kgOx3zCMxgqE7IlRn5y1IaGVhx8h_mGufg4/exec';

function _exigirBackend() {
  if (!URL_BACKEND) {
    throw new Error('Esta copia todavía no tiene servidor configurado. ' +
                    'Falta publicar el backend del producto y poner su URL en URL_BACKEND.');
  }
  return URL_BACKEND;
}

// ===== VERSIONADO DE LA APP =====
// Subir este número cada vez que se despliegue una versión nueva.
// Cuando un dispositivo detecta versión distinta a la guardada,
// muestra el banner verde por 10 min con la lista de cambios.
/* Versión del PRODUCTO. Arranca en 1.00 a propósito: heredó el número de la
   app de una estación (iba en 6.08) y eso no significa nada para un cuerpo que
   la instala hoy por primera vez. El historial de esa estación tampoco está —
   ver APP_VERSION_NOTAS. */
const APP_VERSION = '1.50';
/* Novedades que ve el usuario. ARRANCA VACÍO A PROPÓSITO.
   Antes heredaba las 133 notas de la estación de origen: un cuerpo nuevo instalaba la app y
   leía el diario de otra estación —sus cuentas, su regla de sanciones, sus
   arreglos internos—. Eso no solo confunde: filtra cómo opera un tercero.
   Cada nota nueva describe un cambio DEL PRODUCTO, no de una estación. */
const APP_VERSION_NOTAS = [
  'v1.50: 🛡️ La última tanda visual convierte acceso, ayuda, configuración y administración en un puesto de mando más claro. Los vacíos, errores, cargas y ventanas tienen señales operativas consistentes; los cuatro accesos de ayuda ahora funcionan correctamente con teclado. No cambia datos, permisos ni servidor.',
  'v1.49: 📟 Mesa de operaciones más clara. Las actividades se leen como una bitácora; los detalles parecen expedientes; Operatividad organiza mejor filtros, cifras y rankings; y el mapa reúne sus controles en un panel más limpio. También se ampliaron a 44 px los botones pequeños de firma. No cambia datos ni permisos.',
  'v1.48: 🧭 Reportar un incidente ahora es más fácil de recorrer: las 13 secciones están agrupadas en tres fases (aviso, respuesta y cierre), la sección abierta se distingue mejor y las filas, fotos, firmas y botones son más cómodos en el celular. No cambia tus datos ni la forma de guardarlos.',
  'v1.47: 🧾 Formulario más simple: en Recursos ya no se piden "Cantidad" ni "Placa" — la placa y la clase del vehículo salen del catálogo del cuerpo y van al PDF solas. Se aclaró quién es el afectado que firma y quiénes son las víctimas. Tus reportes anteriores no cambian.',
  'v1.46: 🛡️ Blindaje de seguridad. El prefijo del consecutivo (Configuración) ahora solo acepta letras y números, y todos los números de reporte se muestran de forma segura en la app y en el PDF. No cambia cómo trabajas ni tus datos.',
  'v1.45: 🆕 Más completo el registro. En un INCIDENTE se agregó la “Fecha y hora de salida de la estación” (entre la llamada y la llegada). En una ACTIVIDAD ahora se puede: marcar si fue VOLUNTARIA o PAGA (contratada), elegir el tipo “Pernotar” (servicio nocturno, cuyas horas cuentan aunque el turno cruce la medianoche), adjuntar hasta 6 fotos, y registrar VARIAS ATENCIONES (primeros auxilios, traslados, etc.), cada una con sus datos y hasta 3 fotos propias. Todo se ve en el detalle y en el PDF. Las columnas nuevas van al final de las hojas: los datos viejos no se tocan.',
  'v1.44: 🚨 Cargas con carácter. Los “girando…” genéricos se reemplazaron por animaciones del oficio, repartidas por toda la app: una SIRENA que parpadea, un DESPACHO de puntos que rebotan y una barra de SINCRONIZANDO. Se ven al enviar un reporte, al verificar el PIN, al guardar una actividad y al abrir cualquier lista que carga. Livianas y respetan el modo “reducir movimiento”. No cambian datos ni cómo funciona.',
  'v1.43: ✨ Cierre de las animaciones. Los pines del Mapa de Emergencias ahora CAEN al aparecer, y las cifras de la pantalla de Operatividad (unidades, emergencias) SUBEN desde 0 al abrir. Todo respeta el modo "reducir movimiento".',
  'v1.42: ✨ Animaciones que SE NOTAN. Ahora CADA botón, al tocarlo, hace una onda (ripple) que confirma el toque. Los números del Inicio (total, pendientes, enviados) SUBEN desde 0 al abrir. Y al enviar un reporte con un campo obligatorio vacío, ese campo se MARCA EN ROJO, se SACUDE, y la app te LLEVA directo a él. Todo respeta el modo "reducir movimiento".',
  'v1.41: ✨ Movimiento en el Panel de Administrador. Antes el Panel entraba sin animación; ahora las listas de reportes, de personal pendiente y de Operatividad entran escalonadas (una tarjeta tras otra) al abrirlas. Todo liviano y respeta el modo "reducir movimiento". No cambia datos ni cómo funciona.',
  'v1.40: ✨ Más movimiento (Fase 2). Ahora TODAS las ventanas emergentes se cierran con una animación suave (antes algunas desaparecían de golpe), el PIN muestra una rueda girando mientras verifica y SACUDE si te equivocás, el aviso verde de nueva versión baja y sube suave, y en el reporte la foto recién tomada y cada vehículo/víctima que agregás entran con una pequeña animación. Todo liviano y respeta el modo "reducir movimiento". No cambia datos ni cómo funciona.',
  'v1.39: ✨ La app se siente más viva. Se agregó movimiento en las piezas que se usan en todos lados: las ventanas de confirmación y el menú ahora también se cierran con una animación suave (antes desaparecían de golpe), los avisos suben al aparecer, las listas de reportes y actividades entran escalonadas, los botones "ocupados" se atenúan suave, y los campos muestran mejor cuál está activo. Todo liviano para que no trabe, y respeta el modo "reducir movimiento" del celular. No cambia ningún dato ni cómo funciona: solo cómo se ve.',
  'v1.38: 🛟 Menos riesgo de perder trabajo. (1) Al salir de una Actividad que estabas registrando sin haber guardado, la app ahora avisa antes de descartar lo que cargaste (antes se perdía de un toque). (2) El reporte que estás llenando se autoguarda solo: si el celular cierra la app de golpe, no pierdes lo dictado. (3) Los reportes que quedaron "pendientes" por falta de señal ahora se envían solos al reabrir la app con internet, sin forzarlos a mano. Además, un ajuste interno de seguridad al mostrar fotos y firmas.',
  'v1.37: 🪪 Ajustes reportados en producción. Al entrar al Panel de Administrador, ahora pregunta "qué administrador entra" (antes decía "quién está de guardia", que ahí no aplicaba — los guardias no llegan a ese modal). En sanciones, asistencia y demás sigue preguntando por la guardia, sin cambios. Además, "🚒 Vehículos del cuerpo" ahora distingue un error de carga (revise su conexión) de una flota genuinamente vacía, para no mostrar un mensaje que confunda a otro administrador.',
  'v1.36: 📋 Vista RUE más completa y más exacta. Nuevo bloque "Recursos desplegados" que cruza los vehículos del incidente con la clase que pide el RUE. Además, "Quien Reporta" ahora muestra el nombre completo de quien avisó (antes solo mostraba la relación), y se corrigió un caso donde un incidente con varias clasificaciones podía dejar mal marcado ese tipo en informes futuros.',
  'v1.35: 👥 Unidades vinculadas. En el Panel de Administrador → "Unidades vinculadas" (solo el administrador principal), vea todo correo que ya usa la app y cuándo entró por última vez, y bloquéele el acceso a quien haga falta — sin borrar sus datos, y siempre reversible. Además: el tour explica dónde vive su base de datos (el Google Sheets del cuerpo), la explicación de "Quién opera" en el Panel Admin ahora habla de qué administrador firma (no de guardia, que ahí no aplica), y se corrigieron un par de palabras ambiguas ("emergencia" → "incidente", "cobertura" → "señal").',
  'v1.34: 🧭 Tour más completo. El de unidades (antes "para bomberos") ahora también recorre su perfil en Configuración. El de administrador creció bastante: ahora explica el escudo/logo del cuerpo, el relevo de guardia, invitar unidades e importar personal por separado, y el ranking y el mapa con más detalle.',
  'v1.33: 🧭 Tour interactivo renovado. El recorrido de ayuda ya no es una tarjeta de texto: ahora se mueve de verdad por la app y señala cada botón real. Hay uno para bomberos y otro, distinto, para administradores (Panel Admin, Operatividad, Mapa, Zona Administrador). Se abre desde ℹ️ Acerca de.',
  'v1.32: 🌈 Los emojis vuelven a color. Se probó ponerlos en gris/silueta, pero se ven mejor a color. El resto del nuevo diseño se mantiene.',
  'v1.31: 🩶 Emojis más legibles. Algunos quedaban como cuadrado negro o no se veían sobre los botones de color. Ahora van en escala de grises: conservan su forma y se ven bien en todos lados.',
  'v1.30: 🖼️ Panel de administrador y ventanas al estilo "Acta Oficial". Las tarjetas del panel pasan a fondo blanco con una franja de color a la izquierda (aire de documento) y las ventanas de confirmación llevan borde dorado y título de imprenta. Solo cambia el aspecto.',
  'v1.29: 🎯 Emojis en monocromo. Los emojis de colores se convierten en siluetas tipo ícono (oscuras sobre fondo claro, blancas sobre el rojo) para que peguen con el diseño institucional y no se vean como "stickers". Solo cambia el aspecto.',
  'v1.28: 🎨 Rediseño visual "Acta Oficial". Tipografía de imprenta (Oswald + Barlow), el rojo institucional usado con disciplina y un dorado de seguridad como acento. La app se ve como un instrumento oficial de bomberos, no una plantilla genérica. Cambia solo el aspecto: la lógica, la estructura y tus datos NO cambian.',
  'v1.27: ✅ Aprobación de ingreso. Ahora, cuando alguien abre el link o el QR, NO entra solo: queda como una SOLICITUD (con su nombre y una descripción de quién es). Cualquier administrador la aprueba o la descarta desde el Panel → "📥 Solicitudes de ingreso", y queda registrado quién decidió. Así, si a una unidad se le filtra el link a un tercero, ese tercero no entra sin permiso.',
  'v1.26: 📷 Código QR para invitar. Al generar el link de invitación ahora sale también un QR: tus unidades lo escanean con la cámara del celular y entran, sin copiar ni pegar nada. Y cuando una unidad se une, ve un aviso claro de a qué cuerpo pertenece.',
  'v1.25: 🔗 Invitar unidades por link. En el Panel de Administrador → "🔗 Invitar unidades", generás un link y lo compartís con tus bomberos: al abrirlo y entrar con Google quedan enlazados a tu cuerpo, sin configurar nada. Si un link se filtra, generás uno nuevo (invalida los anteriores).',
  'v1.24: ⭕ Los pines del mapa ahora se AGRUPAN cuando están amontonados: en vez de muchos marcadores encimados, ves un círculo con el número, y al acercar el zoom se abren. La estación (🚒) y el mapa de calor no se agrupan.',
  'v1.23: 🔥 Mapa de calor. En ⚙️ Herramientas → ✨ Vistas, el botón "Mapa de calor" pinta en rojo las zonas donde más se repiten los incidentes. Respeta el filtro que tengas puesto (tipo y fecha).',
  'v1.22: 🚒 Estación en el mapa. En ⚙️ Herramientas → "Fijar estación (mi ubicación)" guardás dónde queda la estación de su cuerpo (parado ahí, una sola vez). Después el mapa muestra un 🚒 y, en cada reporte, a cuántos km está de la estación.',
  'v1.21: 🗺️ Mapa más ordenado: los controles ahora se despliegan en dos menús — "⚙️ Herramientas" (fechas y acciones) y "🏷️ Tipos" (la leyenda) — para no saturar la pantalla. Además, filtros rápidos de fecha: Últimos 30 días, Este mes, Este año.',
  'v1.20: 🗺️ Ajustes al mapa: la capa 🛰️ Satélite ahora deja acercar más (antes salía "sin datos" al hacer zoom, según la zona), y el botón 📍 Mi ubicación dibuja un círculo con la precisión — en el celular con GPS es exacta; en el computador es aproximada (no tiene GPS).',
  'v1.19: 🗺️ Mapa de Incidentes mejorado. Botones "✓ Todos" y "✕ Ninguno", y un "solo" en cada tipo para ver únicamente ese de un toque (antes había que apagar los demás uno por uno). Nueva capa 🛰️ Satélite (además de calles) y botón 📍 Mi ubicación.',
  'v1.18: 📥 Importar personal, más robusto: reconoce cuando el nombre y el apellido vienen en columnas separadas (los une en el nombre completo) y detecta la cédula aunque el título diga "Cédula (CC)", "Documento" u otras variantes. Antes esas columnas se perdían.',
  'v1.17: ⚡ Nuevo tipo "Incendio en red eléctrica" (transformadores, loncheras, cables y redes del servicio público; en el RUE es FALLA ELÉCTRICA), separado de "Incendio de interfaz", que queda para el fuego en la franja donde el monte se junta con el pueblo.',
  'v1.16: 🖨️ Se depuró el pie de página de los informes impresos: ya no incluye datos de contacto del autor.',
  'v1.15: 🖨️ Arreglada la impresión: antes el botón abría una pestaña EN BLANCO. Ahora el informe se genera y sale listo para imprimir o guardar como PDF. Además, el escudo que usted sube en el Panel de Administrador ya aparece en el encabezado y como marca de agua de los informes; si no subió ninguno, se usa la cruz de bombero por defecto.',
  'v1.05: 🔑 El asistente de instalación ahora le pide su contraseña de administrador. Con eso el fundador queda habilitado para NOMBRAR Y QUITAR administradores, que antes era imposible: la app exigía una contraseña que ninguna pantalla creaba, y quien instalaba quedaba como único admin para siempre.',
  'v1.04: 🧹 Se retiró del servidor todo lo que quedó del módulo dominical: 54 funciones y 14 rutas. Las rutas importan aunque no se vean: la dirección del servidor es pública, así que una ruta abierta se puede llamar desde afuera aunque ninguna pantalla la use. Nada cambia en el uso diario.',
  'v1.03: 🧹 Se terminó de sacar todo lo que ataba la app a una sola estación: ícono propio (cruz de Malta, el símbolo del bombero en todo el mundo), nombres internos, comentarios y datos de personas. El Manual, Cómo funciona y Bases legales se reescribieron: ahora describen la app que usted tiene y citan solo norma nacional. Y se retiró el código muerto del módulo dominical: 1.480 líneas menos.',
  'v1.02: 🧹 La app dejó de hablar como una estación y empezó a hablar como el gremio. Salen la asistencia de domingos y las sanciones por horas: son el régimen interno de UN cuerpo, no una norma nacional, y no tenían por qué venir puestas. El vocabulario pasa a INCIDENTE (Sistema Comando de Incidentes, Res. 358/2014). Y se corrigió el fallo que impedía iniciar sesión: el servidor rechazaba TODAS las credenciales.',
  'v1.01: 🔌 La app ya se comunica con su servidor. Con esto se puede crear la base de datos del cuerpo, iniciar sesión y guardar información. Antes la pantalla cargaba pero no podía guardar nada.',
  'v1.00: 🚒 Primera versión. La app arranca vacía: al entrar por primera vez, quien lo haga queda como administrador y se crea la base de datos en su propio Google Drive. Nadie más ve esos datos.',
];

// === ROSTER DE BOMBEROS (autocompletar) ===
// v5.98: ESTA LISTA YA NO MANDA. Es solo la SEMILLA para una instalación nueva
// que todavía no se ha conectado nunca (celular recién instalado y sin señal).
// La lista de verdad se lee de la hoja Personal al iniciar sesión y queda
// cacheada en IndexedDB: ver `_cargarRosterDesdeHoja()` y `_rosterVigente()`.
// Cadena de respaldo: hoja → caché → esta semilla.
//
// Antes de v5.98 esta lista era la ÚNICA fuente y estaba congelada: mostraba 10
// personas que ya no estaban en la hoja y escondía 6 que sí (entre ellas una con
// un apellido compuesto). Peor: el autocompletado escribía nombres con una grafía
// distinta a la de la hoja, y esos registros después no cruzaban en Operatividad.
// NO hace falta editarla a mano nunca más; se actualiza sola desde la hoja.
const ROSTER_BOMBEROS = [
  /* T1 — VACÍO A PROPÓSITO.
     Antes esta lista traía los ~30 nombres reales del personal de una estación,
     quemados en el frontend, que se publica abierto en GitHub Pages. Mandar el
     producto así sería repartir datos personales de terceros (Ley 1581 de 2012).

     No hace falta: desde v5.98 el roster sale de la hoja Personal de cada
     cuerpo. Esta constante quedó solo como respaldo del autocompletado cuando
     todavía no hay hoja, y vacía cumple ese papel sin filtrar a nadie. */
];

/* Crédito del AUTOR de la app. Se conserva a propósito: es atribución de autoría.

   14/08/2026 — SE QUITÓ EL CAMPO `cuerpo`. Decía "Cuerpo de Bomberos Voluntarios de
   la estación de origen" y se imprimía en el pie de TODOS los PDF oficiales — actas, informes de
   incidente, anexos fotográficos. O sea que el documento oficial de cualquier otro
   cuerpo salía firmado al pie con el nombre de OTRA institución.

   La autoría de la persona y el nombre de su estación no son lo mismo, y estaban en el
   mismo renglón. El membrete del documento ya lleva el cuerpo que corresponde: el del
   comandante que lo emite, que sale de INSTITUCION. */
const CREDITO_AUTOR = {
  nombre: 'Bombero Jeferson Jeancarlos Rangel Gil',
  correo: 'gilrangeljeancarlosjeferson@gmail.com',
  telefono: '320 960 6428',
  facebook: 'https://www.facebook.com/jeancarlos.rangel.1420'
};

// v5.94: tipos nuevos pedidos por la comandancia — incendio de interfaz,
// árbol caído, abejas/avispas, búsqueda y rescate (la modalidad exacta se
// escribe en "Otra") y "Traslado" como casilla propia junto a Primeros
// auxilios. Agregar tipos aquí es seguro: la lista de casillas, el PDF y el
// mapa se pintan DESDE este arreglo; los reportes viejos no se afectan.
const TIPOS_EVENTO = [
  'Incendio estructural', 'Incendio forestal', 'Incendio de interfaz', 'Incendio vehicular',
  // v1.17: "Incendio en red eléctrica" = transformadores, loncheras, cables y redes del
  // servicio público → en el RUE es FALLA ELÉCTRICA. Distinto de "Incendio de interfaz"
  // (fuego monte-pueblo), que sigue existiendo con su significado real.
  'Incendio en red eléctrica',
  'Rescate vehicular', 'Rescate en altura', 'Rescate acuático', 'Búsqueda y rescate',
  'Primeros auxilios', 'Traslado', 'Materiales peligrosos (MATPEL)',
  'Atención de árbol caído', 'Atención de abejas / avispas', 'Rescate animal',
  'Inundación / desastre natural', 'Colapso estructural', 'Otra'
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
  NOMBRE: 'ReportesBomberilesDB',   // T1: nombre genérico, no de un cuerpo
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
    // T1b: pinta la identidad del cuerpo desde el caché ANTES de nada más, para que
    // quien vuelve no vea un parpadeo con el nombre neutro.
    try { this._pintarInstitucion(); } catch (e) {}

    // v1.25: si la URL trae ?unir=TOKEN (link de invitación), guardarlo antes de nada.
    this._detectarInvitacion();

    // v5.48 SEGURIDAD: inyecta el idToken de Google en toda petición al backend.
    this._instalarFetchToken();

    // v5.88: aplica el diseño elegido (original | apple) antes de pintar la UI.
    this.aplicarTema(this._temaGuardado(), true);

    /* Escudo: el del CUERPO que usa la app, no uno fijo. En el original acá iba
       el escudo de una estación quemado en logos.js (247 KB de base64), que le
       habría puesto ese emblema a todos los cuerpos del país.
       Orden: el que configuró el cuerpo → el genérico de logos.js → nada.
       "Nada" es aceptable: mejor sin escudo que con el de otra institución. */
    /* El pintado del logo se movió a _pintarLogos() para poder refrescarlo al instante
       cuando el admin sube o quita el escudo, sin recargar la app. */
    this._pintarLogos();

    // === Detectar nueva versión y mostrar banner por 10 min ===
    this._mostrarBannerSiHayNuevaVersion();

    await DB.abrir();
    await this.cargarConfig();
    this.escucharConexion();
    this.inicializarCheckboxes();
    this.poblarRosterBomberos();
    this.inicializarFirmas();
    this.configurarFoto();
    this.configurarBotonAtrasMovil();
    this.registrarServiceWorker();
    // Intentar iniciar brújula sin permiso (Android la deja directo; iOS necesitará botón)
    try { this.iniciarEscuchaBrujula(); } catch (e) {}

    // Verificar si hay sesión activa
    const sesion = await DB.obtenerConfig('sesion');
    if (sesion && sesion.email) {
      // v5.53: la sesión local NUNCA se borra sola → la app funciona OFFLINE
      // siempre (su razón de ser). La seguridad de admin la controla el backend
      // con el "pase" de 8h: si vence, las acciones admin piden re-login SOLO
      // cuando hay internet. Un bombero normal trabaja sin conexión sin límite.
      this.usuario = sesion;
      this._googleIdToken = sesion.idToken || '';
      this._googleTokenExp = sesion.tokenExp || 0;
      this._pase = sesion.pase || '';
      // v5.63 (BUG 9): renovar el pase de 30 días en segundo plano cada vez
      // que se abre la app → el admin ya no queda atado al token de 1h.
      this._renovarPaseSesion().catch(() => {});
      // v5.98: refrescar el roster desde la hoja Personal (caché primero,
      // red después). En segundo plano: no debe demorar el arranque de la app.
      this._cargarRosterDesdeHoja().catch(() => {});
      // v1.25: unidad que abre el link estando YA logueada → unirse y recargar limpio.
      if (await this._manejarIngreso()) return; // v1.27: solicitud/pendiente/rechazado toma la pantalla
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
        /* v1.38: subir también lo que quedó PENDIENTE (creado sin señal). El evento
           'online' solo dispara en la transición sin-señal→con-señal con la app viva;
           si el equipo mató el WebView y se reabre YA en línea, el pendiente se quedaba
           pegado hasta forzarlo a mano. sincronizarReporte es idempotente y tiene candado
           _syncEnCurso, así que subir al arranque no duplica. */
        if (navigator.onLine) this.sincronizarPendientes(true).catch(() => {});
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

  // v1.25: link de UNIRSE. Si la URL trae ?unir=TOKEN, se guarda (sobrevive al login de
  // Google) y se limpia la URL para que un refresh no lo repita.
  _detectarInvitacion() {
    try {
      const tok = new URLSearchParams(location.search || '').get('unir');
      if (tok) {
        try { localStorage.setItem('_invitacionPendiente', tok); } catch (e) {}
        try { history.replaceState({}, '', location.pathname + location.hash); } catch (e) {}
      }
    } catch (e) {}
  },

  // v1.27: GATE DE INGRESO. Reemplaza el auto-join. Devuelve true si toma la pantalla
  // (el init/login NO debe seguir al Home).
  //  - Si hay un link guardado → muestra el FORMULARIO de solicitud (nombre + descripción).
  //  - Si no, y la persona quedó PENDIENTE/RECHAZADA de una solicitud previa → esa pantalla.
  //  - Si ya está aprobada (o nunca pidió) → false (sigue el flujo normal).
  async _manejarIngreso() {
    if (!this._pase && !this._googleIdToken) return false;   // sin identidad aún: espera al login
    let token = '';
    try { token = localStorage.getItem('_invitacionPendiente') || ''; } catch (e) {}
    if (token) { this._mostrarFormSolicitud(token); return true; }
    // ¿ya aprobado antes? evita la llamada extra a los miembros de siempre.
    let aprobadoLocal = false;
    try { aprobadoLocal = localStorage.getItem('_ingresoAprobado') === '1'; } catch (e) {}
    if (aprobadoLocal) return false;
    try {
      const r = await fetch(_exigirBackend(), {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'estadoMiSolicitud', pase: this._pase || '', idToken: this._googleIdToken || '' })
      });
      const d = await r.json();
      if (d && d.ok) {
        if (d.estado === 'aprobado') {
          // bienvenida notoria SOLO a quien venía de una solicitud pendiente (no a los
          // miembros de siempre, que no pasaron por la cola).
          let fuiPend = false; try { fuiPend = localStorage.getItem('_fuiPendiente') === '1'; } catch (e) {}
          if (fuiPend) {
            try { localStorage.setItem('_bienvenidaCuerpo', String(d.cuerpo || 'tu cuerpo')); } catch (e) {}
            try { localStorage.removeItem('_fuiPendiente'); } catch (e) {}
          }
          try { localStorage.setItem('_ingresoAprobado', '1'); } catch (e) {}
          return false;
        }
        if (d.estado === 'pendiente') { this._mostrarEstadoIngreso('pendiente', d.cuerpo || ''); return true; }
        if (d.estado === 'rechazada') { this._mostrarEstadoIngreso('rechazada', d.cuerpo || ''); return true; }
      }
    } catch (e) { /* sin red: sigue normal; el backend igual bloquea escrituras de un pendiente */ }
    return false;
  },
  _mostrarFormSolicitud(token) {
    this._tokenSolicitud = token;
    const viejo = document.getElementById('_overlayIngreso'); if (viejo) viejo.remove();
    const nombreGoogle = (this.usuario && this.usuario.nombre) ? this.usuario.nombre : '';
    const correo = (this.usuario && this.usuario.email) ? this.usuario.email : '';
    const cont = document.createElement('div');
    cont.id = '_overlayIngreso';
    cont.style.cssText = 'position:fixed;inset:0;background:#0f172a;z-index:10050;display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto;';
    cont.innerHTML =
      '<div style="background:#fff;border-radius:16px;max-width:400px;width:100%;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,.4);">'
      + '<div style="font-size:40px;text-align:center;line-height:1;">🔗</div>'
      + '<div style="font-size:18px;font-weight:800;color:#1e40af;text-align:center;margin:6px 0 4px;">Solicitar ingreso</div>'
      + '<div style="font-size:12px;color:#64748b;text-align:center;margin-bottom:16px;">Un administrador debe aprobar tu ingreso antes de que puedas usar la app.</div>'
      + '<label style="font-size:12px;font-weight:600;color:#334155;">Tu nombre completo</label>'
      + '<input id="_solNombre" type="text" value="' + app._esc(nombreGoogle) + '" placeholder="Nombre y apellido" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:8px;font-size:15px;margin:4px 0 12px;">'
      + '<label style="font-size:12px;font-weight:600;color:#334155;">¿Quién eres? (para que te reconozcan)</label>'
      + '<textarea id="_solDesc" rows="2" maxlength="200" placeholder="Ej: Soy Juan, unidad de rescate M-3" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;margin:4px 0 16px;resize:vertical;"></textarea>'
      + '<button id="_solEnviar" style="width:100%;padding:13px;background:#2563eb;color:#fff;border:none;border-radius:10px;font-weight:700;font-size:15px;cursor:pointer;">Enviar solicitud</button>'
      + '<div style="font-size:11px;color:#94a3b8;text-align:center;margin-top:10px;word-break:break-all;">Entrarás con: ' + app._esc(correo) + '</div>'
      + '</div>';
    document.body.appendChild(cont);
    const btn = document.getElementById('_solEnviar');
    if (btn) btn.onclick = () => this._enviarSolicitud();
  },
  async _enviarSolicitud() {
    const btn = document.getElementById('_solEnviar');
    const nombre = ((document.getElementById('_solNombre') || {}).value || '').trim();
    const descripcion = ((document.getElementById('_solDesc') || {}).value || '').trim();
    if (!nombre) { this.toast('Escribe tu nombre', 'error'); return; }
    await this._conBloqueo(btn, 'Enviando…', async () => {
      try {
        const r = await fetch(_exigirBackend(), {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'unirseACuerpo', invitacion: this._tokenSolicitud, nombre: nombre, descripcion: descripcion, pase: this._pase || '', idToken: this._googleIdToken || '' })
        });
        const d = await r.json();
        if (!d.ok) { this.toast(d.error || 'No se pudo enviar la solicitud', 'error'); return; }
        try { localStorage.removeItem('_invitacionPendiente'); } catch (e) {}
        if (d.estado === 'aprobado') {   // ya era miembro → entra directo
          try { localStorage.setItem('_ingresoAprobado', '1'); } catch (e) {}
          try { localStorage.setItem('_bienvenidaCuerpo', String(d.cuerpo || 'tu cuerpo')); } catch (e) {}
          location.reload(); return;
        }
        this._mostrarEstadoIngreso('pendiente', d.cuerpo || '');
      } catch (e) { this.toast('Sin conexión. Intenta de nuevo.', 'error'); }
    });
  },
  _mostrarEstadoIngreso(estado, cuerpo) {
    const viejo = document.getElementById('_overlayIngreso'); if (viejo) viejo.remove();
    const esPend = estado === 'pendiente';
    // marca para la bienvenida notoria cuando lo aprueben (solo quien pasó por la cola)
    if (esPend) { try { localStorage.setItem('_fuiPendiente', '1'); } catch (e) {} }
    const cont = document.createElement('div');
    cont.id = '_overlayIngreso';
    cont.style.cssText = 'position:fixed;inset:0;background:#0f172a;z-index:10050;display:flex;align-items:center;justify-content:center;padding:20px;text-align:center;';
    cont.innerHTML =
      '<div style="background:#fff;border-radius:16px;max-width:360px;width:100%;padding:28px 22px;box-shadow:0 10px 40px rgba(0,0,0,.4);">'
      + '<div style="font-size:52px;line-height:1;">' + (esPend ? '⏳' : '🚫') + '</div>'
      + '<div style="font-size:19px;font-weight:800;color:' + (esPend ? '#b45309' : '#b91c1c') + ';margin:8px 0;">' + (esPend ? 'Solicitud enviada' : 'Solicitud no aprobada') + '</div>'
      + '<div style="font-size:13px;color:#475569;line-height:1.55;margin-bottom:18px;">'
      +   (esPend
          ? 'Tu ingreso a <b>' + app._esc(cuerpo || 'el cuerpo') + '</b> está esperando que un administrador lo apruebe. Vuelve a abrir la app más tarde.'
          : 'Un administrador no aprobó tu ingreso a <b>' + app._esc(cuerpo || 'el cuerpo') + '</b>. Si crees que es un error, pídele el link de invitación otra vez.')
      + '</div>'
      + '<button onclick="app._salirIngreso()" style="width:100%;padding:12px;background:#e2e8f0;color:#0f172a;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;">Cerrar sesión</button>'
      + '</div>';
    document.body.appendChild(cont);
  },
  _salirIngreso() {
    const o = document.getElementById('_overlayIngreso'); if (o) o.remove();
    try { this.cerrarSesion(); } catch (e) { try { location.reload(); } catch (e2) {} }
  },

  // v1.27: SOLICITUDES DE INGRESO (lado admin). Cualquier admin lista/aprueba/descarta.
  async cargarSolicitudes(btn) {
    const cont = document.getElementById('listaSolicitudes');
    if (!cont) return;
    if (btn) return this._conBloqueo(btn, 'Actualizando…', () => this.cargarSolicitudes());
    cont.innerHTML = this._skeleton(2, 'linea');
    try {
      const r = await fetch(URL_BACKEND, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarSolicitudesIngreso', adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '', pase: this._pase || '' }) });
      const d = await r.json();
      if (!d.ok) { cont.innerHTML = '<div style="font-size:12px;color:#c00;padding:8px;">' + app._esc(d.error || 'Error') + '</div>'; return; }
      const lista = d.solicitudes || [];
      const badge = document.getElementById('solicitudesBadge');
      if (badge) badge.innerHTML = lista.length ? '<span style="background:#dc2626;color:#fff;border-radius:10px;padding:1px 7px;font-size:11px;">' + lista.length + '</span>' : '';
      if (!lista.length) { cont.innerHTML = '<div style="font-size:12px;color:#78350f;padding:6px;">No hay solicitudes pendientes.</div>'; return; }
      cont.innerHTML = lista.map(function (s) {
        const c = encodeURIComponent(s.correo || '');
        const desc = app._esc(s.descripcion || '');
        return '<div style="background:#fff;border:1px solid #fde68a;border-radius:8px;padding:10px;margin-bottom:8px;">'
          + '<div style="font-weight:700;font-size:13px;color:#78350f;">' + app._esc(s.nombre || '(sin nombre)') + '</div>'
          + '<div style="font-size:11px;color:#92400e;word-break:break-all;">' + app._esc(s.correo || '') + '</div>'
          + (desc ? '<div style="font-size:12px;color:#334155;margin-top:4px;font-style:italic;">“' + desc + '”</div>' : '')
          + (s.fecha ? '<div style="font-size:10px;color:#a16207;margin-top:3px;">' + app._esc(s.fecha) + '</div>' : '')
          + '<div style="display:flex;gap:6px;margin-top:8px;">'
          +   '<button onclick="app._aprobarSolicitud(this,\'' + c + '\')" style="flex:1;padding:8px;background:#16a34a;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:12px;">✅ Aceptar</button>'
          +   '<button onclick="app._rechazarSolicitud(this,\'' + c + '\')" style="flex:1;padding:8px;background:#e5e7eb;color:#7f1d1d;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:12px;">✕ Descartar</button>'
          + '</div></div>';
      }).join('');
    } catch (e) { cont.innerHTML = '<div style="font-size:12px;color:#c00;padding:8px;">Sin conexión</div>'; }
  },
  async _aprobarSolicitud(btn, correoEnc) {
    const correo = decodeURIComponent(correoEnc || '');
    await this._conBloqueo(btn, 'Aprobando…', async () => {
      try {
        const r = await fetch(URL_BACKEND, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'aprobarSolicitudIngreso', correo: correo, adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '', pase: this._pase || '' }) });
        const d = await r.json();
        if (!d.ok) { this.toast(d.error || 'No se pudo aprobar', 'error'); return; }
        this.toast('✅ Ingreso aprobado', 'exito');
        this.cargarSolicitudes();
      } catch (e) { this.toast('Sin conexión', 'error'); }
    });
  },
  async _rechazarSolicitud(btn, correoEnc) {
    const correo = decodeURIComponent(correoEnc || '');
    const ok = await this.confirmar('Descartar solicitud', '¿Descartar esta solicitud? La persona no entrará (podría volver a pedir con el link).');
    if (!ok) return;
    await this._conBloqueo(btn, 'Descartando…', async () => {
      try {
        const r = await fetch(URL_BACKEND, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'rechazarSolicitudIngreso', correo: correo, adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '', pase: this._pase || '' }) });
        const d = await r.json();
        if (!d.ok) { this.toast(d.error || 'No se pudo descartar', 'error'); return; }
        this.toast('Solicitud descartada', 'info');
        this.cargarSolicitudes();
      } catch (e) { this.toast('Sin conexión', 'error'); }
    });
  },

  // v1.25: el comandante genera un link de invitación (firmado por el backend) y lo comparte.
  async compartirInvitacion(btn, rotar) {
    await this._conBloqueo(btn, 'Generando…', async () => {
      try {
        const r = await fetch(_exigirBackend(), {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'generarInvitacion', rotar: !!rotar,
            adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '', pase: this._pase || '' })
        });
        const d = await r.json();
        if (!d.ok) { this.toast(d.error || 'No se pudo generar la invitación', 'error'); return; }
        const url = location.origin + location.pathname + '?unir=' + encodeURIComponent(d.token);
        this._invUrlActual = url;
        this._mostrarModalInvitacion(url, d.cuerpo || '');
      } catch (e) { this.toast('Sin conexión para generar la invitación', 'error'); }
    });
  },

  // v1.26: QR del link (qrcode-generator, incrustado en index.html). Genera un GIF
  // en data:URL SIN canvas → funciona en el WebView del APK y offline. Si por lo que
  // sea la librería no cargó, devuelve '' y el modal sigue con copiar/compartir.
  _qrImg(url) {
    try {
      if (typeof qrcode === 'undefined') return '';
      const qr = qrcode(0, 'M'); qr.addData(String(url || '')); qr.make();
      return '<div style="text-align:center;margin:12px 0 2px;">'
        + '<img alt="Código QR de la invitación" src="' + qr.createDataURL(5, 4) + '" style="max-width:100%;image-rendering:pixelated;background:#fff;border-radius:6px;">'
        + '<div style="font-size:11px;color:#64748b;margin-top:4px;">📷 Escanéalo con la cámara del celular</div></div>';
    } catch (e) { return ''; }
  },
  _mostrarModalInvitacion(url, cuerpo) {
    this._cerrarModalInvitacion();
    const cont = document.createElement('div');
    cont.id = '_modalInvitacion';
    cont.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px;';
    cont.innerHTML =
      '<div style="background:#fff;border-radius:14px;max-width:420px;width:100%;padding:18px;box-shadow:0 8px 30px rgba(0,0,0,.3);">'
      + '<div style="font-weight:700;font-size:15px;color:#1e40af;margin-bottom:4px;">🔗 Invitación a ' + app._esc(cuerpo) + '</div>'
      + '<div style="font-size:12px;color:#555;margin-bottom:10px;">Compártelo con tus unidades. Al abrirlo y entrar con Google, quedan enlazadas a este cuerpo — sin configurar nada.</div>'
      + this._qrImg(url)
      + '<div style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font-size:11px;word-break:break-all;">' + app._esc(url) + '</div>'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;">'
      +   '<button onclick="app._copiarInvitacion()" style="flex:1;min-width:110px;padding:10px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:12px;">📋 Copiar link</button>'
      +   '<button onclick="app._compartirInvitacionNativo()" style="flex:1;min-width:110px;padding:10px;background:#16a34a;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:12px;">📤 Compartir</button>'
      + '</div>'
      + '<button onclick="app.compartirInvitacion(this,true)" style="width:100%;margin-top:8px;padding:8px;background:#fff;color:#b45309;border:1px dashed #fbbf24;border-radius:8px;font-weight:600;cursor:pointer;font-size:11px;">↻ Generar link nuevo (invalida los anteriores)</button>'
      + '<button onclick="app._cerrarModalInvitacion()" style="width:100%;margin-top:8px;padding:10px;background:#e5e7eb;color:#111;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:12px;">Cerrar</button>'
      + '</div>';
    document.body.appendChild(cont);
  },
  _cerrarModalInvitacion() { const m = document.getElementById('_modalInvitacion'); if (m) m.remove(); },
  // v1.26: bienvenida PROMINENTE al unirse a un cuerpo. Se muestra UNA vez, tras
  // recargar como miembro (el flag lo pone _procesarInvitacionPendiente). Deja
  // claro a qué cuerpo pertenece la unidad, sin tener que "probar subiendo algo".
  _mostrarBienvenidaCuerpo() {
    let cuerpo = '';
    try { cuerpo = localStorage.getItem('_bienvenidaCuerpo') || ''; } catch (e) {}
    if (!cuerpo) return;
    try { localStorage.removeItem('_bienvenidaCuerpo'); } catch (e) {}
    const cont = document.createElement('div');
    cont.id = '_modalBienvenida';
    cont.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10002;display:flex;align-items:center;justify-content:center;padding:20px;';
    cont.innerHTML =
      '<div style="background:#fff;border-radius:16px;max-width:360px;width:100%;padding:26px 22px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.35);">'
      + '<div style="font-size:52px;line-height:1;margin-bottom:6px;">✅</div>'
      + '<div style="font-size:14px;color:#475569;font-weight:600;">Ya perteneces a</div>'
      + '<div style="font-size:22px;font-weight:800;color:#166534;margin:4px 0 12px;line-height:1.15;">' + app._esc(cuerpo) + '</div>'
      + '<div style="font-size:12px;color:#64748b;line-height:1.5;margin-bottom:16px;">Tus reportes, actividades y asistencias quedan registrados en este cuerpo. Lo ves siempre en la parte de arriba, junto al nombre de la app.</div>'
      + '<button onclick="app._cerrarBienvenidaCuerpo()" style="width:100%;padding:12px;background:#166534;color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px;">Entendido</button>'
      + '</div>';
    document.body.appendChild(cont);
  },
  _cerrarBienvenidaCuerpo() { const m = document.getElementById('_modalBienvenida'); if (m) m.remove(); },
  _copiarInvitacion() {
    const url = this._invUrlActual || '';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(() => this.toast('📋 Link copiado', 'exito')); return; }
    } catch (e) {}
    try { const t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); this.toast('📋 Link copiado', 'exito'); }
    catch (e) { this.toast('Copia el link a mano', 'info'); }
  },
  async _compartirInvitacionNativo() {
    const url = this._invUrlActual || '';
    try { if (navigator.share) { await navigator.share({ title: 'Únete al cuerpo de bomberos', text: 'Ábrelo para unirte:', url: url }); return; } } catch (e) { return; }
    this._copiarInvitacion();
  },

  // Banner de notificación de nueva versión.
  // Compara APP_VERSION con la guardada en localStorage; si cambió o no
  // existe, muestra un banner verde arriba con la versión y los cambios.
  // El banner se auto-oculta a los 10 minutos o cuando el usuario pulsa "Cerrar".
  _mostrarBannerSiHayNuevaVersion() {
    let versionGuardada = null;
    try { versionGuardada = localStorage.getItem('app_version'); }
    catch (e) { /* localStorage puede no estar disponible */ }

    // Primera vez en este dispositivo: solo guardar la versión, no mostrar banner
    if (!versionGuardada) {
      try { localStorage.setItem('app_version', APP_VERSION); } catch (e) {}
      return;
    }
    if (versionGuardada === APP_VERSION) return; // ya está al día

    // Hay versión nueva → mostrar banner
    const versionAnterior = versionGuardada;
    try { localStorage.setItem('app_version', APP_VERSION); } catch (e) {}

    // v5.64 (BUG 5): solo las notas de ESTA versión — mostrar TODO el
    // historial (v5.59, v5.63...) hacía crecer el banner cada release hasta
    // tapar el botón de cerrar, sobre todo en pantallas chicas.
    const prefijoVersion = 'v' + APP_VERSION + ':';
    const notasHTML = (APP_VERSION_NOTAS || [])
      .filter(n => n.startsWith(prefijoVersion))
      .map(n => `<li style="margin:2px 0;">${n.slice(prefijoVersion.length).trim()}</li>`).join('');

    const banner = document.createElement('div');
    banner.id = 'bannerNuevaVersion';
    banner.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0',
      'max-height:85vh', 'overflow-y:auto',
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
          🆕 Nueva versión instalada: v${APP_VERSION}
          <span style="font-weight:400;opacity:0.75;font-size:11px;">
            (anterior: v${versionAnterior})
          </span>
        </div>
        <div style="font-size:12px;opacity:0.95;margin-bottom:4px;">Cambios:</div>
        <ul style="margin:0;padding-left:18px;font-size:12px;opacity:0.95;">${notasHTML}</ul>
      </div>
      <button onclick="app._cerrarBanner()"
              style="position:sticky;top:0;flex-shrink:0;background:rgba(255,255,255,0.25);color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;align-self:flex-start;">
        ✕ Cerrar
      </button>
    `;
    if (document.body) {
      document.body.appendChild(banner);
      // Auto-quitar a los 10 minutos (con la misma salida animada que el botón ✕).
      setTimeout(() => this._cerrarBanner(), 10 * 60 * 1000);
    } else {
      // Por si el DOM no está aún listo
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(banner);
        setTimeout(() => this._cerrarBanner(), 10 * 60 * 1000);
      });
    }
  },

  /* v1.40: cierre animado del banner de nueva versión — sube y se va (antes hacía un
     .remove() seco). NO se le quita el id: la animación de subida (CSS) depende de él,
     y el banner es único (no se reabre), así que no hay colisión posible. */
  _cerrarBanner() {
    const el = document.getElementById('bannerNuevaVersion');
    if (!el || el._cerrando) return;
    el._cerrando = true;
    el.classList.add('subiendo');
    setTimeout(() => { try { el.remove(); } catch (e) {} }, 320);
  },

  // ==================== LOGIN GOOGLE ====================
  iniciarGoogleSignIn() {
    let intentos = 0;
    const MAX_INTENTOS = 24; // ~12 segundos esperando a Google
    const mostrarErrorLogin = (msg) => {
      const box = document.getElementById('loginErrorBox');
      if (!box) return;
      box.style.display = 'block';
      box.innerHTML =
        (msg || 'No se pudo cargar el inicio de sesión de Google.') +
        '<br><button onclick="location.reload()" ' +
        'style="margin-top:10px;background:#991b1b;color:#fff;border:none;padding:10px 18px;border-radius:6px;font-size:14px;cursor:pointer;">' +
        '🔄 Reintentar / Recargar</button>';
    };
    const intentar = () => {
      if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
        intentos++;
        if (intentos >= MAX_INTENTOS) {
          mostrarErrorLogin('No se pudo conectar con Google. Revise su conexión a internet y toque Reintentar.');
          return;
        }
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
          setTimeout(() => {
            if (btnDiv && btnDiv.childElementCount === 0) {
              mostrarErrorLogin('El botón de Google no se mostró. Toque Reintentar.');
            }
          }, 3000);
        }
      } catch (err) {
        console.error('Error iniciando Google:', err);
        mostrarErrorLogin('Error cargando login de Google. Verifique su conexión y toque Reintentar.');
      }
    };
    intentar();
  },

  // ── v5.48 SEGURIDAD ────────────────────────────────────────────────────────
  // Envuelve window.fetch UNA sola vez. Para cualquier POST al backend, agrega
  // el idToken de Google si no viene ya. Es DEFENSIVO: si algo falla, deja la
  // petición original intacta (nunca rompe el flujo existente).
  _instalarFetchToken() {
    if (window.__fetchPatched) return;
    window.__fetchPatched = true;
    const _orig = window.fetch.bind(window);
    const self = this;
    window.fetch = function (url, opts) {
      try {
        if (typeof url === 'string' && url.indexOf(URL_BACKEND) === 0 &&
            opts && opts.method && String(opts.method).toUpperCase() === 'POST' &&
            typeof opts.body === 'string') {
          const tok = (self.usuario && self.usuario.idToken) || self._googleIdToken || '';
          const obj = JSON.parse(opts.body);
          if (obj && typeof obj === 'object') {
            let cambio = false;
            if (tok && !obj.idToken) { obj.idToken = tok; cambio = true; }
            // v5.51: pase de 8h (no depende del token de 1h de Google)
            const pase = (self.usuario && self.usuario.pase) || self._pase || '';
            if (pase && !obj.pase) { obj.pase = pase; cambio = true; }
            /* v6.01: FIRMA DEL OPERADOR. El correo admin vive en el celular de la
               guardia y la guardia rota, así que el correo no dice quién operó.
               Acá se inyecta el nombre que la unidad declaró al entrar al Panel,
               y el backend lo guarda en el log de auditoría. Va en el interceptor
               a propósito: así viaja en TODA llamada sin tener que acordarse de
               agregarlo en cada fetch (que es como se cuelan los olvidos). */
            // Una firma vencida NO puede viajar. Se comprueba acá porque este es
            // el único punto por el que pasan TODAS las llamadas.
            if (self._firmaVencida && self._firmaVencida()) self._borrarFirma();
            const oper = self._operadorSesion || '';
            if (oper && !obj.operador) {
              // Usar la app cuenta como actividad: el reloj de los 30 minutos se
              // reinicia con cada llamada, así que a nadie trabajando se le vence.
              if (self._tocarFirma) self._tocarFirma();
              obj.operador = oper;
              // v6.02: van también cédula y PIN porque el backend NO se cree el
              // nombre: valida el PIN y saca el nombre de Personal por cédula.
              obj.operadorCedula = self._operadorCedula || '';
              obj.operadorPin = self._operadorPin || '';
              // v6.03: si se firmó con la llave de comandancia, viaja la llave en
              // vez del PIN, y el backend la registra como excepción.
              if (self._operadorLlave) obj.llaveComandancia = self._operadorLlave;
              cambio = true;
            }
            if (cambio) opts = Object.assign({}, opts, { body: JSON.stringify(obj) });
          }
        }
      } catch (e) { /* nunca romper la petición original */ }

      const p = _orig(url, opts);
      // Detectar "No autorizado" + token vencido → sugerir re-login (sin cortar nada).
      try {
        if (typeof url === 'string' && url.indexOf(URL_BACKEND) === 0) {
          return p.then(function (resp) {
            try {
              if (resp && resp.ok) {
                resp.clone().json().then(function (j) {
                  if (j && j.ok === false && /no autorizado/i.test(j.error || '')) {
                    self._avisarTokenSiExpirado();
                    /* Si el servidor rechazó por CONTRASEÑA, hay que olvidarla en
                       el acto o queda cacheada y todo lo demás falla en cadena sin
                       volver a preguntarla nunca. Se hace acá, en el interceptor,
                       porque el problema aparecía en las ~20 pantallas que mandan
                       adminPassword. Se excluyen los rechazos por PIN: ahí la
                       contraseña puede estar perfecta. */
                    if (!/\bPIN\b/i.test(String(j.error || ''))) self._olvidarPwdAdmin();
                  }
                }).catch(function () {});
              }
            } catch (e2) {}
            return resp;
          });
        }
      } catch (e3) {}
      return p;
    };
  },

  _avisarTokenSiExpirado() {
    const ahora = Date.now();
    const vencido = !this._googleTokenExp || ahora >= this._googleTokenExp;
    if (!vencido) return; // no era por token; el backend negó por otra razón
    if (this._avisoTokenMostrado) return; // no spamear
    this._avisoTokenMostrado = true;
    try {
      this.toast('Tu sesión expiró. Cierra sesión y vuelve a iniciar sesión para continuar.', 'error');
    } catch (e) {}
    setTimeout(() => { this._avisoTokenMostrado = false; }, 30000);
  },

  async manejarRespuestaGoogle(response) {
    try {
      // Decodificar el JWT (sin verificar firma — Google ya lo firmó).
      // Usa decodificador base64url + UTF-8 (nombres con tildes/Ñ, tokens con - _).
      const payload = this._decodificarJWT(response.credential);

      // v5.48 SEGURIDAD: guardamos el idToken firmado por Google. El backend lo
      // verifica para confirmar la identidad real (anti-suplantación de admin).
      this._googleIdToken = response.credential;
      this._googleTokenExp = (payload.exp ? payload.exp * 1000 : 0); // ms epoch

      // v5.74: limpiar cualquier pase de una sesión ANTERIOR (otra cuenta de
      // Google en el mismo teléfono). Sin esto, el inyector de fetch adjuntaba
      // el pase viejo y el backend (que prefiere pase sobre token) respondía
      // con la identidad de la cuenta anterior → sesiones mezcladas.
      this._pase = '';

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
        registroCompleto: !!(perfilGuardado && perfilGuardado.registroCompleto),
        idToken: response.credential,            // v5.48: token verificable por el backend
        tokenExp: this._googleTokenExp || 0,
        creadaEn: Date.now()                     // v5.49: para expirar sesión a las 8h
      };

      this.usuario = usuario;
      await DB.guardarConfig('sesion', usuario);

      // v5.51: pedir al backend un "pase" de 8h (no depende del token de 1h de Google).
      // Si falla, no se rompe el login; el admin caería al modo token de 1h.
      try {
        const rPase = await fetch(URL_BACKEND, {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'iniciarSesion', idToken: response.credential })
        });
        const dPase = await rPase.json();
        if (dPase && dPase.ok && dPase.pase) {
          this._pase = dPase.pase;
          this.usuario.pase = dPase.pase;
          // v6.05: el backend ya dice si es admin SEGÚN LA HOJA. Guardarlo es lo
          // que hace que "Agregar administrador" sirva de algo: sin esta línea,
          // la persona agregada nunca veía la zona de administrador.
          if (typeof dPase.esAdmin === 'boolean') this.usuario.esAdminSrv = dPase.esAdmin;
          // T1: el superadmin lo decide el servidor (es el FUNDADOR de esta
          // instalación), no una comparación de correo quemada en el front.
          if (typeof dPase.esSuperAdmin === 'boolean') this.usuario.esSuperAdmin = dPase.esSuperAdmin;
          // Firma con PIN: el backend dice si ESTE cuerpo la exige. Apagada por defecto
          // (cada admin entra con su propia cuenta), así que normalmente nunca se pide.
          this._firmaObligatoria = (dPase.firmaObligatoria === true);
          // T1b: la identidad del cuerpo llega en el login y se cachea para el
          // próximo arranque, cuando todavía no hay servidor que preguntar.
          if (dPase.institucion) { try { this._pintarInstitucion(dPase.institucion); } catch (e) {} }
          // Asistente: el backend dice si esta copia ya tiene cuerpo configurado.
          this._instalacionConfigurada = (dPase.instalacionConfigurada !== false);
          await DB.guardarConfig('sesion', this.usuario);
        }
      } catch (ePase) { console.warn('No se pudo obtener pase de 8h:', ePase); }

      this.toast(`Bienvenido, ${usuario.nombrePila || usuario.email}`, 'exito');

      // v5.98: tras un login NUEVO también se trae el roster de la hoja
      // (el arranque con sesión ya restaurada lo hace en su propia rama).
      this._cargarRosterDesdeHoja().catch(() => {});

      // v1.25: si la unidad venía con una invitación, unirse ANTES de decidir si es
      // fundador (un miembro nuevo NO debe caer en la pantalla de instalación).
      if (await this._manejarIngreso()) return; // v1.27: solicitud/pendiente/rechazado toma la pantalla

      /* ⚠️ EL ASISTENTE VA PRIMERO QUE TODO. Sin base de datos configurada no hay
         dónde guardar el registro del bombero, así que mandarlo a completar sus
         datos antes de instalar lo dejaría escribiendo contra el vacío. */
      if (this._instalacionConfigurada === false) {
        document.getElementById('saludoInstalacion').textContent =
          `${usuario.email} · Usted será el administrador de este cuerpo`;
        this._cargarCatalogos().catch(() => {});
        this.irA('pantallaInstalacion');
        return;
      }

      if (usuario.registroCompleto) {
        this.actualizarUIUsuario();
        this.irA('pantallaHome');
        await this.actualizarHome();
        // Sincronizar reportes del servidor en segundo plano (tipo Gmail)
        this.sincronizarReportesDesdeServidor().catch(e => console.warn('Sincronización falló:', e));
        // v1.38: subir lo pendiente también tras un login nuevo (ver init).
        if (navigator.onLine) this.sincronizarPendientes(true).catch(() => {});
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
    this.toast(`Listo, ${this.usuario.nombrePila || String(nombre || '').split(' ')[0]} 🚒`, 'exito');
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

      // === Auto-sincronización del personal que participó ===
      // Para cada reporte LOCAL ya enviado que tenga recursos+personal,
      // mandar los recursos al servidor. El backend es IDEMPOTENTE: solo
      // llena la hoja Personal_por_Incidente si está vacía para ese informe
      // (no sobreescribe lo que el admin haya registrado manualmente).
      // Esto permite que los informes viejos (sin participación registrada) se
      // completen automáticamente cuando el bombero original abre su app.
      this._sincronizarParticipacionLocal(locales).catch(e =>
        console.warn('Auto-sync de participación falló:', e)
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
  // El backend decide por sí mismo si ese informe necesita llenar la participación.
  async _sincronizarParticipacionLocal(locales) {
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
        console.warn('No se pudo sincronizar la participación del informe ' + r.id, e);
      }
    }
    if (sincronizados > 0) {
      this.toast(`✅ ${sincronizados} reporte(s) sincronizaron su personal participante`, 'exito');
    }
  },

  /* v6.05: quién es administrador lo decide la HOJA, no el código.
     Bug reportado por Jeferson ("Agregar administrador está de adorno"): el
     backend YA respondía `esAdmin` en iniciarSesion (Codigo.gs:559, calculado con
     _enAdmins sobre la hoja Administradores) y el front tiraba esa respuesta a la
     basura: le preguntaba a ADMIN_EMAILS, la lista quemada en la línea 8. Por eso
     agregar a alguien escribía la fila en la hoja y no le habilitaba NADA en su
     celular: su app seguía consultando el código.
     ADMIN_EMAILS queda SOLO como respaldo: primer arranque y sin señal.
     Sin red no se puede consultar la hoja, y dejar sin Panel al admin por estar
     offline sería peor que el bug. El servidor valida igual en cada acción
     (_enAdmins), así que esto decide únicamente qué se MUESTRA, nunca qué se
     puede hacer: editar esto en el teléfono no otorga ningún permiso real. */
  esAdmin() {
    const email = (this.usuario && this.usuario.email || '').toLowerCase().trim();
    if (!email) return false;
    if (this.usuario && typeof this.usuario.esAdminSrv === 'boolean') return this.usuario.esAdminSrv;
    return ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email);
  },

  actualizarUIUsuario() {
    if (!this.usuario) return;
    const inicial = (this.usuario.nombreCompleto || this.usuario.nombre || this.usuario.email).charAt(0).toUpperCase();

    // Avatar header
    const avatar = document.getElementById('userAvatar');
    if (this.esAdmin()) avatar.classList.add('admin');
    else avatar.classList.remove('admin');

    if (this.usuario.foto) {
      avatar.innerHTML = `<img src="${app._esc(this.usuario.foto)}" alt="">`;
    } else {
      avatar.innerHTML = `<span>${app._esc(inicial)}</span>`;
    }

    // Menú desplegable
    const avatarGrande = document.getElementById('avatarGrande');
    if (this.usuario.foto) {
      avatarGrande.innerHTML = `<img src="${app._esc(this.usuario.foto)}" alt="">`;
    } else {
      avatarGrande.innerHTML = `<span>${app._esc(inicial)}</span>`;
    }
    document.getElementById('menuNombreUsuario').textContent = this.usuario.nombreCompleto || this.usuario.nombre;
    document.getElementById('menuGradoUsuario').textContent =
      (this.usuario.grado || 'Bombero') + ' · ' + NOMBRE_ESTACION;
    document.getElementById('menuCorreoUsuario').textContent = this.usuario.email;
    document.getElementById('menuBadgeAdmin').style.display = this.esAdmin() ? 'inline-block' : 'none';
  },

  toggleUserMenu() {
    const m = document.getElementById('userMenu');
    if (m.classList.contains('visible')) { this.cerrarUserMenu(); return; }
    // v1.39: al abrir, cancelar un cierre en curso y limpiar la clase de salida.
    if (m._tCerrar) { clearTimeout(m._tCerrar); m._tCerrar = null; }
    m.classList.remove('cerrando');
    m.classList.add('visible');
  },

  cerrarUserMenu() {
    const m = document.getElementById('userMenu');
    if (!m || !m.classList.contains('visible')) return;
    this._animarCierre(m, () => m.classList.remove('visible'));   // v1.39: cierre animado
  },

  // ==================== TEMA DE DISEÑO (v5.88) ====================
  // Dos diseños: 'original' (clásico) y 'apple' (Minimalista). La
  // elección vive en localStorage del dispositivo (NO se sube al servidor)
  // y también se aplica en el <head> antes de pintar la página (anti-flash).
  // La estética cambia SOLO por CSS ([data-theme] + variables) — ninguna
  // pantalla, flujo ni dato se toca. Riesgo funcional: cero.
  _temaGuardado() {
    try {
      return localStorage.getItem('app_tema') === 'apple' ? 'apple' : 'original';
    } catch (e) { return 'original'; }
  },

  aplicarTema(tema, silencioso = false) {
    const t = (tema === 'apple') ? 'apple' : 'original';
    try { localStorage.setItem('app_tema', t); } catch (e) {}
    document.documentElement.setAttribute('data-theme', t);
    // Color de la barra de estado del teléfono acorde al tema activo
    const metaTema = document.getElementById('metaThemeColor');
    if (metaTema) metaTema.setAttribute('content', t === 'apple' ? '#f5f5f7' : '#7a1010');
    this._sincronizarUITema();
    if (!silencioso) {
      this.toast(t === 'apple' ? '🍎 Diseño Minimalista activado' : '🚒 Diseño Original activado', 'exito');
    }
  },

  // Marca el botón activo en AMBOS selectores (menú de usuario y Configuración)
  _sincronizarUITema() {
    const t = this._temaGuardado();
    document.querySelectorAll('[data-tema-opcion]').forEach(btn => {
      btn.classList.toggle('activo', btn.getAttribute('data-tema-opcion') === t);
    });
  },

  // v5.89: barra de navegación inferior. Se OCULTA en login/registro y en
  // pantallas de formulario/detalle (esas ya tienen sus propios botones
  // flotantes abajo y la barra estorbaría). Se MARCA el ítem de la sección
  // activa. Si la barra no existe (HTML viejo), no hace nada — nunca rompe.
  _actualizarBottomNav(pantallaId) {
    const barra = document.getElementById('bottomNav');
    if (!barra) return;
    const OCULTA_EN = ['pantallaLogin', 'pantallaRegistroComplemento', 'pantallaForm', 'pantallaDetalle'];
    barra.classList.toggle('oculta', OCULTA_EN.indexOf(pantallaId) !== -1);
    const SECCION = {
      pantallaHome: 'home', pantallaActividades: 'actividad',
      pantallaListaActividades: 'registros', pantallaDetalleActividad: 'registros',
      pantallaConfig: 'config'
    };
    const activa = SECCION[pantallaId] || '';
    barra.querySelectorAll('[data-nav]').forEach(btn => {
      btn.classList.toggle('activo', btn.getAttribute('data-nav') === activa);
    });
  },

  async cerrarSesion() {
    // Cerrar el menú primero para que la confirmación se vea bien
    this.cerrarUserMenu();
    // v5.64: window.confirm() falla en silencio en el APK (WebView Android) —
    // se usa el modal propio (this.confirmar), igual que en el resto de la app.
    const ok = await this.confirmar('¿Cerrar sesión?', 'Los reportes ya enviados al servidor seguirán disponibles cuando vuelva a iniciar sesión. Los borradores locales no enviados se mantendrán en este dispositivo.');
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
    // v5.88: reflejar el tema activo en el selector de Configuración
    this._sincronizarUITema();
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
      // v1.46: mismo filtro que el backend (_prefijoSeguro) — solo letras/dígitos, máx 6.
      this.config.prefijo = document.getElementById('cfg_prefijo').value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'RE';
    }

    await DB.guardarConfig('app', this.config);
    this.toast('Configuración guardada', 'exito');
  },

  // ==================== NAVEGACIÓN ====================
  irA(pantallaId, sinHistorial = false) {
    // v5.64 (BUG 3): pill "Abriendo.../Cerrando..." — atras() marca _yendoAtras
    // antes de llamar aquí, así distinguimos ir hacia adelante de volver.
    if (this._yendoAtras) { this._flashAccion('Cerrando...'); this._veloCierre(); this._yendoAtras = false; }
    else { this._flashAccion('Abriendo...'); }

    if (!sinHistorial && this.pantallaActual !== pantallaId) {
      // Solo guardamos en historial las pantallas principales
      if (['pantallaHome', 'pantallaForm', 'pantallaDetalle', 'pantallaConfig'].includes(this.pantallaActual)) {
        this.pilaPantallas.push(this.pantallaActual);
      }
    }

    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    /* El reflow que faltaba. El remove y el add ocurren en la MISMA tarea
       síncrona, así que si el destino es la pantalla que YA estaba activa,
       appFadeIn no se vuelve a reproducir. */
    const _pantallaDestino = document.getElementById(pantallaId);
    void _pantallaDestino.offsetWidth;
    _pantallaDestino.classList.add('activa');
    this.pantallaActual = pantallaId;
    window.scrollTo(0, 0);
    // v5.89: actualizar la barra inferior SIEMPRE (incluido el early-return
    // del login, que es justo donde debe quedar oculta).
    this._actualizarBottomNav(pantallaId);

    const header = document.getElementById('header');
    const btnVolver = document.getElementById('btnVolver');

    if (pantallaId === 'pantallaLogin' || pantallaId === 'pantallaRegistroComplemento') {
      header.style.display = 'none';
      return;
    }
    header.style.display = 'flex';

    // Llenar configuración con datos del usuario actual
    if (pantallaId === 'pantallaListaActividades') { this.cargarListaActividades(); }
    if (pantallaId === 'pantallaOperatividad') { this.cargarOperatividad(); }
    if (pantallaId === 'pantallaMapa') { this.cargarPantallaMapa(); }
    if (pantallaId === 'pantallaConfig' && this.usuario) {
      document.getElementById('cfg_perfil_nombre').value = this.usuario.nombreCompleto || this.usuario.nombre || '';
      document.getElementById('cfg_perfil_grado').value = this.usuario.grado || '';
      document.getElementById('cfg_perfil_cedula').value = this.usuario.cedula || '';
      document.getElementById('cfg_perfil_correo').value = this.usuario.email || '';
      document.getElementById('cfg_perfil_telefono').value = this.usuario.telefono || '';
      // Mostrar zona admin solo si es administrador
      document.getElementById('zonaAdmin').style.display = this.esAdmin() ? 'block' : 'none';
    }

    if (pantallaId === 'pantallaAcercaDe') { this._pintarAcercaDe(); }

    if (pantallaId === 'pantallaHome') {
      btnVolver.style.display = 'none';
      document.getElementById('headerTitulo').textContent = this._rotuloApp();
      this.actualizarHome();
      // Primer arranque: ofrecer el recorrido UNA vez (revisa el flag adentro).
      this._ofrecerTour();
    } else {
      btnVolver.style.display = 'inline-block';
      btnVolver.onclick = () => this.atras();
      const titulos = {
        pantallaForm: 'Informe de Incidente',
        pantallaDetalle: 'Detalle del Informe',
        pantallaConfig: 'Configuración',
        pantallaActividades: '🎯 Nueva Actividad',
        pantallaListaActividades: '📋 Actividades',
        pantallaDetalleActividad: '🎯 Detalle Actividad',
        pantallaOperatividad: '📊 Operatividad',
        pantallaMapa: '🗺️ Mapa de Incidentes',
        pantallaAcercaDe: 'ℹ️ Acerca de'
      };
      document.getElementById('headerTitulo').textContent = titulos[pantallaId] || this._rotuloApp();
    }
  },

  /* ═══════════════ ACERCA DE + TUTORIAL ═══════════════
     El video lo grabará Jeferson; hasta que exista, `URL_TUTORIAL_VIDEO` está vacía y el
     botón lo dice en vez de abrir una página rota. Cuando lo tenga, se pone acá y listo. */
  _pintarAcercaDe() {
    const v = document.getElementById('acercaVersion');
    if (v) v.textContent = (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '');
    // El logo: el escudo del cuerpo si lo subió, si no la cruz de Malta.
    const cont = document.getElementById('acercaLogo');
    if (cont) {
      const esc = (this._inst().escudoUrl || '') ||
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect x=%224%22 y=%224%22 width=%2292%22 height=%2292%22 rx=%2222%22 fill=%22%237a1010%22/%3E%3Cpath d=%22M50,50L56.9,44.94L96,28.84L82.2,50L96,71.16L56.9,55.06ZM50,50L44.94,43.1L28.84,4L50,17.8L71.16,4L55.06,43.1ZM50,50L43.1,55.06L4,71.16L17.8,50L4,28.84L43.1,44.94ZM50,50L55.06,56.9L71.16,96L50,82.2L28.84,96L44.94,56.9Z%22 fill=%22%23f7f3ea%22/%3E%3C/svg%3E';
      cont.innerHTML = '<img src="' + esc + '" alt="" style="width:76px;height:76px;border-radius:16px;object-fit:contain;">';
    }
    const btn = document.getElementById('btnVideoTutorial');
    if (btn) {
      const hay = typeof URL_TUTORIAL_VIDEO !== 'undefined' && URL_TUTORIAL_VIDEO;
      btn.textContent = hay ? '🎬 Ver tutorial en video' : '🎬 Video: próximamente';
      btn.style.opacity = hay ? '' : '0.6';
    }
    // v1.33: el tour de administrador solo se ofrece a quien lo es.
    const btnTA = document.getElementById('btnTourAdmin');
    if (btnTA) btnTA.style.display = this.esAdmin() ? 'block' : 'none';
  },

  abrirVideoTutorial() {
    const url = (typeof URL_TUTORIAL_VIDEO !== 'undefined') ? URL_TUTORIAL_VIDEO : '';
    if (!url) { this.toast('El video estará disponible pronto.', 'info'); return; }
    try { window.open(url, '_blank', 'noopener'); } catch (e) { location.href = url; }
  },

  /* Ofrece el recorrido UNA sola vez, tras el primer Inicio. Guarda el flag apenas
     lo ofrece (no cuando lo termina): así, si lo omite, no vuelve a molestar. */
  /* ═══════════════ LOGO / ESCUDO ═══════════════ */
  _CRUZ_CREMA: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M50,50L56.9,44.94L96,28.84L82.2,50L96,71.16L56.9,55.06ZM50,50L44.94,43.1L28.84,4L50,17.8L71.16,4L55.06,43.1ZM50,50L43.1,55.06L4,71.16L17.8,50L4,28.84L43.1,44.94ZM50,50L55.06,56.9L71.16,96L50,82.2L28.84,96L44.94,56.9Z%22 fill=%22%23f7f3ea%22/%3E%3C/svg%3E',   // para el header rojo
  _CRUZ_ROJA:  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M50,50L56.9,44.94L96,28.84L82.2,50L96,71.16L56.9,55.06ZM50,50L44.94,43.1L28.84,4L50,17.8L71.16,4L55.06,43.1ZM50,50L43.1,55.06L4,71.16L17.8,50L4,28.84L43.1,44.94ZM50,50L55.06,56.9L71.16,96L50,82.2L28.84,96L44.94,56.9Z%22 fill=%22%237a1010%22/%3E%3C/svg%3E',    // para el login/fondo claro

  /* Pinta el logo en el header y en el login. Si el cuerpo subió su escudo, ese;
     si no, la cruz de Malta (crema en el header, roja en el login). Reutilizable
     para refrescar al instante cuando el admin cambia el escudo. */
  _pintarLogos() {
    const escudo = (this._inst().escudoUrl || '');
    [['logoHeader', this._CRUZ_CREMA], ['logoLogin', this._CRUZ_ROJA]].forEach((par) => {
      const el = document.getElementById(par[0]);
      if (!el) return;
      el.src = escudo || par[1];
      el.style.display = '';
    });
  },

  _pintarEscudoPanel() {
    const escudo = (this._inst().escudoUrl || '');
    const prev = document.getElementById('escudoPreview');
    if (prev) prev.src = escudo || this._CRUZ_ROJA;
    const btn = document.getElementById('btnQuitarEscudo');
    if (btn) btn.style.display = escudo ? 'block' : 'none';
  },

  /* Toma el archivo, lo REDUCE en el navegador a máx 180px y lo manda como PNG
     (conserva transparencia). Reducir acá evita mandar 5MB al servidor y mantiene
     la imagen chica para que quepa en una celda de la hoja (~50KB). */
  _procesarEscudo(input) {
    const file = input.files && input.files[0];
    input.value = '';   // permite volver a elegir el mismo archivo
    if (!file) return;
    if (String(file.type).indexOf('image/') !== 0) { this.toast('Elija una imagen (PNG o JPG).', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 180;
        let w = img.width, h = img.height;
        if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        else if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        let dataUrl;
        try { dataUrl = c.toDataURL('image/png'); } catch (err) { this.toast('No se pudo procesar la imagen.', 'error'); return; }
        // Si el PNG sale muy grande (foto con muchos colores), se recomprime en JPEG.
        if (dataUrl.length > 46000) { try { dataUrl = c.toDataURL('image/jpeg', 0.85); } catch (e2) {} }
        if (dataUrl.length > 46000) { this.toast('La imagen es muy compleja. Use uno más simple o recórtelo.', 'error'); return; }
        this._subirEscudo(dataUrl);
      };
      img.onerror = () => this.toast('No se pudo leer la imagen.', 'error');
      img.src = e.target.result;
    };
    reader.onerror = () => this.toast('No se pudo leer el archivo.', 'error');
    reader.readAsDataURL(file);
  },

  async _subirEscudo(dataUrl) {
    const pw = await this._obtenerPwdAdmin('🔐 Contraseña de administrador');
    if (!pw) return;
    this.toast('Guardando el escudo...', 'info');
    try {
      const r = await fetch(_exigirBackend(), {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'guardarEscudo', escudo: dataUrl, adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '' })
      });
      const d = await r.json();
      if (!d.ok) { this.toast(d.error || 'No se pudo guardar.', 'error'); return; }
      this._aplicarEscudo(d.escudoUrl || '');
      this.toast('✅ Escudo actualizado.', 'exito');
    } catch (e) { this.toast('Sin conexión: no se pudo guardar el escudo.', 'error'); }
  },

  async quitarEscudo() {
    const ok = await this.confirmar('Quitar escudo', '¿Volver a la cruz de bombero por defecto?');
    if (!ok) return;
    this._subirEscudo('');   // vacío = quitar
  },

  /* Guarda el escudo en la copia cacheada de la institución y refresca la UI al
     instante — header, login, Acerca de y el preview del Panel — sin recargar. */
  _aplicarEscudo(escudoUrl) {
    let inst = {};
    try { inst = JSON.parse(localStorage.getItem('inst_cuerpo') || '{}') || {}; } catch (e) {}
    inst.escudoUrl = escudoUrl;
    try { localStorage.setItem('inst_cuerpo', JSON.stringify(inst)); } catch (e) {}
    this._pintarLogos();
    this._pintarEscudoPanel();
    if (this.pantallaActual === 'pantallaAcercaDe') this._pintarAcercaDe();
  },
  _ofrecerTour() {
    // v1.33: el propio tour navega por irA('pantallaHome') (arranca ahí y el
    // guion de admin vuelve ahí al cerrar) — sin este guard, ese mismo irA()
    // podía disparar la oferta de "¿quiere un recorrido?" ENCIMA del tour que
    // se está viendo o que se acaba de terminar.
    if (this._tourActivo) return;
    const esAdm = this.esAdmin();
    // v1.33: dos tours separados con su propia bandera — quien entró como
    // bombero y luego se volvió admin recibe la oferta del tour de admin una
    // sola vez, sin repetirle el básico que ya vio.
    const clave = esAdm ? 'app_tour_visto_admin' : 'app_tour_visto_operativo';
    try { if (localStorage.getItem(clave)) return; } catch (e) { return; }
    try { localStorage.setItem(clave, '1'); } catch (e) {}
    // Un respiro para que el Inicio termine de pintarse antes del modal.
    setTimeout(() => { try { this._preguntarTour(esAdm ? 'admin' : 'no_admin'); } catch (e) {} }, 700);
  },

  _preguntarTour(rol) {
    const esAdm = rol === 'admin';
    const m = document.createElement('div');
    m.className = 'modal-js';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(26,21,18,.55);z-index:9998;display:flex;align-items:center;justify-content:center;padding:20px;';
    m.innerHTML = '<div style="background:#fff;border-radius:var(--radio-lg);padding:24px;max-width:340px;width:100%;text-align:center;box-shadow:var(--sombra-fuerte);border-top:4px solid var(--oro);">'
      + '<div style="font-size:38px;">' + (esAdm ? '🛡️' : '🚒') + '</div>'
      + '<div style="font-family:var(--disp);font-size:17px;font-weight:600;text-transform:uppercase;letter-spacing:.02em;color:var(--rojo);margin:8px 0 4px;">¡Bienvenido' + (esAdm ? ', administrador' : '') + '!</div>'
      + '<div style="font-size:13px;color:#555;line-height:1.5;margin-bottom:18px;">¿Quiere un recorrido interactivo por la app' + (esAdm ? ', enfocado en lo que solo usted administra' : '') + '? Se mueve por las pantallas reales y lo puede saltar cuando quiera.</div>'
      + '<button id="_tourVer" style="width:100%;background:var(--rojo);color:#fff;border:none;border-radius:var(--radio);padding:13px;font-weight:700;cursor:pointer;font-size:15px;margin-bottom:8px;font-family:var(--disp);text-transform:uppercase;letter-spacing:.02em;">▶️ Ver recorrido</button>'
      + '<button id="_tourNo" style="width:100%;background:#f5f5f5;color:#555;border:none;border-radius:var(--radio);padding:11px;font-weight:700;cursor:pointer;font-size:13px;">Omitir</button>'
      + '<div style="font-size:11px;color:#999;margin-top:12px;">Siempre puede verlo de nuevo en <b>ℹ️ Acerca de</b>.</div>'
      + '</div>';
    document.body.appendChild(m);
    const cerrar = () => { try { app._cerrarModalJS(m); } catch (e) {} };
    m.querySelector('#_tourNo').onclick = cerrar;
    m.querySelector('#_tourVer').onclick = () => { cerrar(); this.mostrarTour(rol); };
  },

  /* Guion del tour para unidades SIN permisos admin (v1.34: más contenido —
     Jeferson lo sintió corto para alguien que lo ve por primera vez). Todo
     dentro de Inicio + Configuración (ambas sin efectos reales): no navega a
     pantallaForm/pantallaDetalle porque abrirlas de verdad exige efectos
     reales (nuevoReporte() pide GPS, pantallaDetalle necesita un informe
     real) que el tour no debe disparar (Regla 1). */
  _TOUR_NO_ADMIN: [
    { id: 'nuevo-incidente', pantalla: 'pantallaHome', selector: '[data-tour="cta-nuevo-incidente"]', icono: '🚨', titulo: 'Nuevo incidente', texto: 'Registra un incidente oficial: clasificación, ubicación por GPS automático, recursos desplegados, víctimas y firmas en 13 secciones con barra de avance. Sin señal igual queda guardado y se envía solo cuando vuelva a tener señal.' },
    { id: 'contadores', pantalla: 'pantallaHome', selector: '[data-tour="stats-home"]', icono: '🔢', titulo: 'Sus contadores', texto: 'Total es todo lo que usted ha registrado. Pendientes es lo que guardó sin señal — se envía solo, o lo puede forzar desde Configuración. Enviados ya quedó en el servidor.' },
    { id: 'informes', pantalla: 'pantallaHome', selector: '[data-tour="informes-recientes"]', icono: '🧾', titulo: 'Informes recientes', texto: 'Toque cualquiera para ver su detalle: ahí imprime el PDF oficial, ve el resumen listo para copiar al RUE, o lo edita durante las primeras 24 horas. Pasado ese plazo, solo el administrador corrige. Cada quien ve solo sus propios informes.' },
    { id: 'actividades', pantalla: 'pantallaHome', selector: '[data-tour="fila-registrar"]', icono: '🎯', titulo: 'Nueva actividad', texto: 'Acá registra lo que no es un incidente: capacitaciones, simulacros, inspecciones, jornadas comunitarias. Sume el personal que asistió, vehículos y hasta 3 fotos. "Mis actividades" guarda todo lo que ya registró.' },
    { id: 'config-perfil', pantalla: 'pantallaConfig', selector: '[data-tour="config-perfil"]', icono: '👤', titulo: 'Su perfil', texto: 'Por el avatar de arriba a la derecha llega aquí: corrija su nombre, grado, cédula y teléfono, elija el diseño Original o Minimalista de la app, y sincronice sus informes pendientes cuando quiera.' },
    { id: 'ayuda', pantalla: 'pantallaHome', selector: '[data-tour="ayuda-home"]', icono: '📖', titulo: 'Manual y ayuda', texto: 'Manual explica cada pantalla paso a paso, Cómo funciona cuenta dónde viven sus datos, y Bases legales reúne la norma nacional que respalda cada informe (RUE, grados, tipos de incidente).' },
    { id: 'cierre', pantalla: 'pantallaHome', selector: '[data-tour="lema-home"]', icono: '🎖️', titulo: 'Listo para operar', texto: 'Ahí abajo está el lema de su cuerpo. Operatividad, Mapa y Panel de administrador quedan solo para su administrador — ya conoce todo lo que usted necesita para trabajar.' }
  ],

  /* Guion del tour para administradores (v1.35: bastante más largo a
     propósito — Jeferson pidió más contexto acá porque es quien necesita
     entender TODO el sistema. v1.34 explicó el escudo/logo, invitar por
     separado de aprobar, e importar personal. v1.35 agrega dónde vive la
     base de datos (hoja de cálculo), y reescribe "Quién opera": dentro del
     Panel Admin ya no aplica el lenguaje de "guardia/turno" — a este panel
     solo entran administradores (abrirPanelAdmin() ya lo exige), así que lo
     que importa es CUÁL administrador está firmando las acciones, no un
     turno de guardia genérico. La firma en sí (PIN) no cambia — es el mismo
     mecanismo que usa cualquier unidad para firmar de guardia en el resto de
     la app; acá solo se explica distinto porque el público de este paso ya
     son administradores.
     Entra al Panel Admin navegando directo (irA), SIN pedir la contraseña ni
     firmar: eso es un candado real que el tour no debe destrabar por su
     cuenta. Las tarjetas se ven vacías hasta que se abre el Panel de verdad,
     igual que en una instalación nueva — no rompe nada, solo no trae datos. */
  _TOUR_ADMIN: [
    { id: 'bienvenida-admin', pantalla: 'pantallaHome', selector: '[data-tour="fila-consultar"]', icono: '🛡️', titulo: 'Bienvenido, administrador', texto: 'Ya conoce Nuevo Incidente y Actividades igual que cualquier unidad. Este recorrido es distinto: todo lo que solo ve un administrador, empezando por esta fila y siguiendo por el Panel de Administrador.' },
    { id: 'datos', pantalla: 'pantallaPanelAdmin', selector: '[data-tour="panel-titulo"]', icono: '🗄️', titulo: 'Dónde viven sus datos', texto: 'Todo lo que se registra en la app se guarda en un Google Sheets — una hoja de cálculo — que vive en el Google Drive de SU cuerpo, no en un servidor de terceros. Usted es dueño del archivo: puede abrirlo, descargarlo o quitarle el permiso a la app cuando quiera.' },
    { id: 'escudo', pantalla: 'pantallaPanelAdmin', selector: '[data-tour="panel-escudo"]', icono: '🎖️', titulo: 'Escudo del cuerpo', texto: 'Suba el escudo o logo de su institución: reemplaza la cruz de Malta en el encabezado, la pantalla de inicio, Acerca de y el PDF de cada informe. Si no sube ninguno, se usa la cruz por defecto.' },
    { id: 'relevo', pantalla: 'pantallaPanelAdmin', selector: '[data-tour="panel-relevo"]', icono: '🪪', titulo: 'Quién firma como administrador', texto: 'Acá ve qué administrador está firmando las acciones que se hacen desde este panel. Si cambia quien administra en este dispositivo, toque "Cambiar (relevo)" para que quede firmando el administrador correcto — no el anterior.' },
    { id: 'llaves', pantalla: 'pantallaPanelAdmin', selector: '[data-tour="panel-pins"]', icono: '🔑', titulo: 'PIN de las unidades', texto: 'Cada unidad necesita un PIN de 4 dígitos para firmar lo que hace de guardia. Se guardan cifrados — ni usted los ve, solo los reemplaza. Si es el administrador principal, más abajo también decide quién más entra a este panel.' },
    { id: 'unidades-vinculadas', pantalla: 'pantallaPanelAdmin', selector: '[data-tour="panel-unidades"]', icono: '👥', titulo: 'Quién usa la app', texto: 'Solo si usted es el administrador principal: acá ve todo correo vinculado a su cuerpo, cuándo entró por última vez, y puede bloquearle el acceso a quien haga falta — sin borrar sus datos, y siempre reversible.' },
    { id: 'invitar', pantalla: 'pantallaPanelAdmin', selector: '[data-tour="panel-invitar"]', icono: '🔗', titulo: 'Invitar unidades', texto: 'Comparta el link o el código QR: quien lo abra y entre con Google queda enlazado a este cuerpo, sin configurar nada. Si un link se filtra, genere uno nuevo — invalida los anteriores.' },
    { id: 'solicitudes', pantalla: 'pantallaPanelAdmin', selector: '[data-tour="panel-solicitudes"]', icono: '📥', titulo: 'Aprobar el ingreso', texto: 'Quien entra por el link o el QR NO entra solo: queda AQUÍ esperando su aprobación. Revise quién es antes de aceptar — aceptar da acceso a la app, pero no lo agrega a Personal: eso se hace aparte.' },
    { id: 'flota', pantalla: 'pantallaPanelAdmin', selector: '[data-tour="panel-vehiculos"]', icono: '🚒', titulo: 'Vehículos del cuerpo', texto: 'Registre cada vehículo con el indicativo que usan en la radio — Móvil 1, M-3, como le digan — y su clase, que es lo que entiende el RUE. Sin esto, los formularios no tienen qué ofrecer.' },
    { id: 'importar', pantalla: 'pantallaPanelAdmin', selector: '[data-tour="panel-importar"]', icono: '📋', titulo: 'Cargar su nómina', texto: 'Pegue su lista completa desde el Excel que ya tiene, con Ctrl+V. Reconoce las columnas por el título, no por el orden, y solo agrega a quien todavía no esté: no borra ni pisa nada.' },
    { id: 'operatividad', pantalla: 'pantallaOperatividad', selector: '[data-tour="operatividad-titulo"]', icono: '📊', titulo: 'El ranking', texto: 'El puntaje de cada unidad sale de una sola fórmula: incidentes × 2 + horas de actividades. Vea el ranking general o busque a una unidad puntual. En una instalación nueva se llena solo con la primera actividad.' },
    { id: 'mapa', pantalla: 'pantallaMapa', selector: '[data-tour="mapa-titulo"]', icono: '🗺️', titulo: 'Mapa de incidentes', texto: 'Cada incidente con coordenadas aparece como un pin con el emoji de su tipo. La leyenda filtra por tipo, y también puede filtrar por año y por mes para revisar un período puntual.' },
    { id: 'zona-admin', pantalla: 'pantallaConfig', selector: '#zonaAdmin', icono: '⭐', titulo: 'Zona Administrador', texto: 'Defina el prefijo del consecutivo (por defecto "RE"), cierre el mes para reorganizar los consecutivos por la fecha real de la llamada, y use "Renumerar" solo si quedaron desordenados por excepción.' },
    { id: 'cierre-admin', pantalla: 'pantallaHome', selector: '[data-tour="lema-home"]', icono: '🎖️', titulo: 'Listo para administrar', texto: 'Ya conoce el escudo, el relevo, las llaves, cómo sumar y aprobar unidades, la flota, el ranking, el mapa y el cierre de mes. Puede volver a ver este recorrido cuando quiera desde Acerca de.' }
  ],

  /* ═══ Motor del tour "Bitácora de Guardia" (v1.33) ═══
     La app navega de verdad con irA(); un anillo dorado (#tourAnillo) señala
     el elemento real y un panel inferior (#tourPanel) narra cada paso, sin
     oscurecer el resto de la pantalla. #tourCatcher absorbe los toques sobre
     la app real mientras el tour está activo, para que ninguna acción real
     se dispare por accidente (Regla 1). */
  mostrarTour(rol) {
    if (this._tourActivo) return;
    const esAdminRol = rol === 'admin' || (rol == null && this.esAdmin());
    if (esAdminRol && !this.esAdmin()) { this.toast('Solo administradores pueden ver este recorrido', 'error'); return; }
    // Marca el flag también cuando se abre a mano desde Acerca de (no solo
    // cuando lo ofrece _ofrecerTour): si no, al volver a Inicio al cerrarlo
    // _ofrecerTour() lo volvería a ofrecer como si fuera la primera vez.
    try { localStorage.setItem(esAdminRol ? 'app_tour_visto_admin' : 'app_tour_visto_operativo', '1'); } catch (e) {}
    this._tourActivo = true;
    this._tourTransicionando = false;
    this._tourOrigen = this.pantallaActual;
    this._tourPasos = esAdminRol ? this._TOUR_ADMIN : this._TOUR_NO_ADMIN;
    this._construirCapasTour();
    this._pasoTour(0);
  },

  _construirCapasTour() {
    if (!document.getElementById('tourCatcher')) {
      const catcher = document.createElement('div');
      catcher.id = 'tourCatcher';
      catcher.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
      catcher.addEventListener('wheel', e => e.preventDefault(), { passive: false });
      document.body.appendChild(catcher);
    }
    if (!document.getElementById('tourAnillo')) {
      const anillo = document.createElement('div');
      anillo.id = 'tourAnillo';
      anillo.style.opacity = '0';
      document.body.appendChild(anillo);
    }
    if (!document.getElementById('tourPanel')) {
      document.body.appendChild(document.createElement('div')).id = 'tourPanel';
    }
  },

  async _pasoTour(i) {
    if (!this._tourActivo) return;
    // v1.34: mientras se arma un paso (navegar + esperar el scroll) el botón
    // VIEJO de "Siguiente" sigue en pantalla y sigue respondiendo — un toque
    // impaciente ahí disparaba OTRO _pasoTour() encimado al que ya estaba en
    // curso, con dos animaciones de scroll compitiendo por el mismo anillo.
    // Mismo espíritu que _conBloqueo en el resto de la app: un paso a la vez.
    if (this._tourTransicionando) return;
    this._tourTransicionando = true;
    const pasos = this._tourPasos;
    if (!pasos || i < 0 || i >= pasos.length) { this._tourTransicionando = false; return; }
    this._tourIndice = i;
    const paso = pasos[i];
    const anillo = document.getElementById('tourAnillo');
    if (anillo) anillo.style.opacity = '0';
    try {
      if (paso.pantalla && this.pantallaActual !== paso.pantalla) {
        this.irA(paso.pantalla, true);
        await new Promise(r => setTimeout(r, 380));
      }
      if (!this._tourActivo) return; // se pudo cerrar mientras esperábamos
      await this._posicionarAnillo(paso.selector);
      if (!this._tourActivo) return;
      this._pintarPanelTour(paso, i, pasos.length);
    } catch (e) {
      // Red de seguridad: un fallo del tour nunca debe tapar la app real.
      this._cerrarTour();
    } finally {
      this._tourTransicionando = false;
    }
  },

  async _posicionarAnillo(selector) {
    const anillo = document.getElementById('tourAnillo');
    if (!anillo) return;
    if (!selector) { anillo.style.opacity = '0'; return; }
    let el = null;
    for (let intento = 0; intento < 10; intento++) {
      el = document.querySelector(selector);
      if (el && el.offsetParent !== null) break;
      await new Promise(r => requestAnimationFrame(r));
    }
    // Elemento no encontrado (p. ej. un atributo data-tour se borró en otra
    // sesión): el panel se sigue viendo, solo sin anillo. Nunca se cuelga.
    if (!el || el.offsetParent === null) { anillo.style.opacity = '0'; return; }
    const panel = document.getElementById('tourPanel');
    try { document.documentElement.style.scrollPaddingBottom = (panel ? panel.offsetHeight + 20 : 140) + 'px'; } catch (e) {}
    // v1.34: salto instantáneo ('auto'), NO 'smooth'. Se probó 'smooth' con
    // varias formas de esperar a que terminara (setTimeout fijo, contar
    // cuadros de animación seguidos, un reloj de tiempo real) y en pruebas
    // reales siguió midiendo la posición VIEJA a mitad de camino — el anillo
    // quedaba sobre el elemento equivocado, siempre de forma reproducible.
    // Un scroll animado no se puede esperar de forma confiable con
    // setTimeout/rAF porque su duración real varía según el navegador y el
    // dispositivo. El salto es menos vistoso, pero SIEMPRE cae en el lugar
    // correcto — y en un celular de gama baja (el público real de esta app)
    // es preferible a una animación que a veces falla.
    try { el.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) {}
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (!this._tourActivo) return;
    const r2 = el.getBoundingClientRect();
    const PAD = 7;
    anillo.style.top = (r2.top - PAD) + 'px';
    anillo.style.left = (r2.left - PAD) + 'px';
    anillo.style.width = (r2.width + PAD * 2) + 'px';
    anillo.style.height = (r2.height + PAD * 2) + 'px';
    anillo.style.opacity = '1';
  },

  _pintarPanelTour(paso, i, total) {
    const panel = document.getElementById('tourPanel');
    if (!panel) return;
    const ultimo = i === total - 1;
    panel.innerHTML = '<div class="tour-franja"></div>'
      + '<div class="tour-cuerpo">'
      + '<div class="tour-sello"><span class="icono">' + paso.icono + '</span><span class="paso">Paso ' + (i + 1) + ' de ' + total + '</span></div>'
      + '<div class="tour-titulo">' + this._esc(paso.titulo) + '</div>'
      + '<div class="tour-texto">' + this._esc(paso.texto) + '</div>'
      + '<div class="tour-progreso-track"><div class="tour-progreso-fill" style="width:' + Math.round(((i + 1) / total) * 100) + '%;"></div></div>'
      + '<div class="tour-acciones">'
      + (i > 0 ? '<button class="tour-btn tour-btn-atras" id="_tAtras">← Atrás</button>' : '')
      + '<button class="tour-btn tour-btn-siguiente" id="_tSiguiente">' + (ultimo ? '¡Listo! ✔' : 'Siguiente →') + '</button>'
      + '</div>'
      + '<div class="tour-fila-cierre">'
      + '<button class="tour-saltar" id="_tSaltar">Saltar recorrido</button>'
      + '<button class="tour-cerrar" id="_tCerrar" aria-label="Cerrar recorrido">✕</button>'
      + '</div>'
      + '</div>';
    const bAtras = document.getElementById('_tAtras');
    if (bAtras) bAtras.onclick = () => this._pasoTour(i - 1);
    document.getElementById('_tSiguiente').onclick = () => { if (ultimo) this._cerrarTour(); else this._pasoTour(i + 1); };
    document.getElementById('_tCerrar').onclick = () => this._cerrarTour();
    document.getElementById('_tSaltar').onclick = async () => {
      if (i === 0) { this._cerrarTour(); return; }
      // El catcher (z-index 9490) queda por encima del modal de confirmar
      // (.modal-fondo, z-index 200): sin bajarle pointer-events, se comería
      // el toque en "Sí/No" y el modal se vería pero no respondería a nada.
      const catcher = document.getElementById('tourCatcher');
      if (catcher) catcher.style.pointerEvents = 'none';
      const ok = await this.confirmar('Salir del recorrido', '¿Seguro? Puede volver a verlo cuando quiera desde ℹ️ Acerca de.');
      if (catcher) catcher.style.pointerEvents = 'auto';
      if (ok) this._cerrarTour();
    };
  },

  _cerrarTour() {
    if (!this._tourActivo) return;
    this._tourActivo = false;
    try { document.documentElement.style.scrollPaddingBottom = ''; } catch (e) {}
    ['tourPanel', 'tourAnillo', 'tourCatcher'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    const origen = this._tourOrigen || 'pantallaHome';
    this._tourOrigen = null;
    this._tourPasos = null;
    if (this.pantallaActual !== origen) this.irA(origen, true);
  },

  /* v1.38 — RED DE SEGURIDAD AL SALIR (pérdida de datos).
     Antes SOLO el formulario de incidente avisaba al salir. La Actividad —que se
     llena con personal, vehículos, fotos y novedades en memoria— descartaba todo
     en silencio con un toque en "Volver" o el botón físico Atrás. No se guarda
     hasta pulsar "Registrar Actividad". */
  _hayCambiosSinGuardar() {
    if (this.pantallaActual === 'pantallaForm') {
      return { titulo: 'Salir del reporte',
        mensaje: '¿Desea salir? Los cambios sin guardar se perderán. Use "Borrador" para guardar el progreso.' };
    }
    if (this.pantallaActual === 'pantallaActividades' && this._actividadTieneDatos()) {
      return { titulo: 'Salir sin guardar',
        mensaje: '¿Salir de la Actividad? Se perderá lo que registraste. Usa "Registrar Actividad" primero.' };
    }
    return null;
  },

  // Actividad "con datos" = contenido real sin guardar. Se calcula al salir (el
  // formulario arranca vacío y se limpia al guardar), sin flag por cada cambio.
  _actividadTieneDatos() {
    if ((this._actPersonal || []).length || (this._actRecursos || []).length) return true;
    const f = this._actFotos || {};
    if (f.inicio || f.medio || f.fin) return true;
    const desc = document.getElementById('actDescripcion');
    const nov = document.getElementById('actNovedades');
    return !!((desc && desc.value.trim()) || (nov && nov.value.trim()));
  },

  async _confirmarSalidaSiSucio() {
    const g = this._hayCambiosSinGuardar();
    if (!g) return true;
    return await this.confirmar(g.titulo, g.mensaje);
  },

  /* El botón "← Volver" de Actividad llama a esto (antes iba directo a
     irA('pantallaHome'), saltándose el aviso). El "←" del header y el botón físico
     Atrás ya pasan por atras(), que tiene el mismo guard. */
  async volverDesde(destino) {
    if (!(await this._confirmarSalidaSiSucio())) return;
    this._yendoAtras = true;
    this.irA(destino || 'pantallaHome', true);
  },

  async atras() {
    // v1.38: red de seguridad unificada (formulario + actividad).
    if (!(await this._confirmarSalidaSiSucio())) return;

    if (this.pilaPantallas.length > 0) {
      const anterior = this.pilaPantallas.pop();
      this._yendoAtras = true;
      this.irA(anterior, true);
    } else {
      this._yendoAtras = true;
      this.irA('pantallaHome', true);
    }
  },

  configurarBotonAtrasMovil() {
    // Manejar el botón Atrás del navegador y del celular
    history.pushState({ pantalla: 'inicio' }, '');
    window.addEventListener('popstate', (e) => {
      // v1.33: el botón Atrás del celular cierra el tour antes que cualquier
      // otra cosa (no tiene sentido navegar atrás de verdad con el tour
      // encima tapando la app).
      if (this._tourActivo) {
        this._cerrarTour();
        history.pushState({ pantalla: this.pantallaActual }, '');
        return;
      }
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
      // v5.86: si el Mapa de Emergencias está en pantalla completa, el botón
      // Atrás del celular la cierra primero (no debe sacar al admin de la
      // pantalla del mapa de un solo toque).
      const mapaWrap = document.getElementById('mapaWrap');
      if (mapaWrap && mapaWrap.classList.contains('mapa-fullscreen')) {
        this._toggleMapaFullscreen(false);
        history.pushState({ pantalla: this.pantallaActual }, '');
        return;
      }

      // Si está en login, dejar que el navegador haga su acción
      if (this.pantallaActual === 'pantallaLogin' || this.pantallaActual === 'pantallaRegistroComplemento') {
        return;
      }

      // Si está en home, preguntar antes de cerrar.
      // confirm() NATIVO no funciona en el APK/WebView Android (devuelve false
      // en silencio) → usamos el modal propio de la app.
      if (this.pantallaActual === 'pantallaHome') {
        this.confirmar('¿Cerrar la app?', 'Se cerrará la aplicación. Los reportes ya enviados quedan guardados en el servidor.')
          .then(ok => {
            if (ok) { history.back(); }                                 // salir
            else { history.pushState({ pantalla: 'pantallaHome' }, ''); } // quedarse
          });
        return;
      }

      // En cualquier otra pantalla, ir atrás
      this.atras();
      history.pushState({ pantalla: this.pantallaActual }, '');
    });
  },

  // ==================== HOME ====================
  async actualizarHome() {
    try { this._mostrarBienvenidaCuerpo(); } catch (e) {} // v1.26: solo aparece si acabás de unirte a un cuerpo
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
    // v1.42: los totales SUBEN desde 0 (count-up) en vez de aparecer secos.
    this._countUp(document.getElementById('statTotal'), reportes.length);
    this._countUp(document.getElementById('statPendientes'), reportes.filter(r => r.estado === 'pendiente').length);
    this._countUp(document.getElementById('statEnviados'), reportes.filter(r => r.estado === 'enviado').length);

    const lista = document.getElementById('listaReportes');
    if (reportes.length === 0) {
      lista.innerHTML = `
        <div class="vacio-estado">
          <div class="icono">📋</div>
          <div>No hay informes aún</div>
          <div style="font-size: 12px; margin-top: 4px;">Toque "Nuevo incidente" para empezar</div>
        </div>`;
      return;
    }
    lista.innerHTML = reportes.slice(0, 20).map(r => {
      const tipos = (r.clasificacion || []).slice(0, 2).join(', ') || 'Sin clasificar';
      const fecha = new Date(r.fechaCreacion).toLocaleString('es-CO', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });
      // v1.46 (I5): consecutivo y clasificación llegan del servidor (listarMisReportes) —
      // el consecutivo lo arma el backend con un prefijo que MANDA EL CLIENTE. Nada
      // que venga de otra persona va crudo a innerHTML.
      return `
        <div class="reporte-item ${this._esc(r.estado)}" data-id="${app._esc(r.id)}" onclick="app.verDetalle(this.dataset.id)">
          <div class="info">
            <div class="consec">${this._esc(r.consecutivo || 'Sin asignar')}</div>
            <div class="desc">${this._esc(tipos)}</div>
            <div class="fecha">${fecha}</div>
          </div>
          <span class="badge ${this._esc(r.estado)}">${this.etiquetaEstado(r.estado)}</span>
        </div>`;
    }).join('');
  },

  etiquetaEstado(estado) {
    return { borrador: 'Borrador', pendiente: 'Pendiente', enviado: 'Enviado' }[estado] || this._esc(estado);
  },

  // ═══ v5.63 (BUG 9): renovación automática del pase de sesión ═══
  // El pase de 30 días solo se pedía UNA vez al hacer login con Google. Si esa
  // petición fallaba (mala señal) o el pase vencía, el admin quedaba con el
  // token de Google de 1h → "cierra y vuelve a iniciar sesión" constante.
  // Ahora, al abrir la app: se renueva el pase usando el pase vigente (el
  // backend acepta pase válido) o el token de Google si aún sirve.
  async _renovarPaseSesion() {
    try {
      if (!navigator.onLine || !this.usuario || !this.usuario.email) return;
      const body = { accion: 'iniciarSesion' };
      if (this._pase) body.pase = this._pase;
      if (this._googleIdToken && this._googleTokenExp && Date.now() < this._googleTokenExp) {
        body.idToken = this._googleIdToken;
      }
      if (!body.pase && !body.idToken) return; // nada con qué renovar
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body)
      });
      const data = await resp.json();
      if (data && data.ok && data.pase) {
        this._pase = data.pase;
        this.usuario.pase = data.pase;
        // v6.05: se refresca el privilegio desde la hoja en CADA arranque con
        // señal. Si cambió (te agregaron o te quitaron), la interfaz se redibuja
        // sola; si no, el menú seguiría mostrando lo de antes indefinidamente.
        // Se refresca también la exigencia de PIN por si el cuerpo la cambió.
        if (typeof data.firmaObligatoria === 'boolean') this._firmaObligatoria = data.firmaObligatoria;
        if (typeof data.esAdmin === 'boolean') {
          const antesEraAdmin = this.usuario.esAdminSrv;
          this.usuario.esAdminSrv = data.esAdmin;
          if (antesEraAdmin !== data.esAdmin) {
            try {
              this.actualizarUIUsuario();
              // Si Ajustes está abierto en ese momento, la zona admin también.
              const _za = document.getElementById('zonaAdmin');
              if (_za) _za.style.display = this.esAdmin() ? 'block' : 'none';
            } catch (e) { /* la UI se corrige sola al navegar */ }
          }
        }
        await DB.guardarConfig('sesion', this.usuario);
      }
    } catch (e) { /* silencioso: sin conexión no pasa nada */ }
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
    document.getElementById('f_municipio').value = this._municipioPorDefecto();

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
    /* La flota se trae ANTES de que se pueda agregar un recurso: agregarRecurso()
       es síncrona y pinta el <select> desde la caché. Sin esta precarga, el
       primer vehículo que se agregara en la sesión saldría con la lista vacía.
       No se espera (sin await) para no retrasar la apertura del formulario en una
       emergencia; si la red tarda, el campo cae a texto libre, que sigue sirviendo. */
    this._cargarFlota();
    this.irA('pantallaForm');
  },

  limpiarFormulario() {
    document.querySelectorAll('#pantallaForm input:not([type=file]), #pantallaForm textarea').forEach(el => {
      if (el.type === 'checkbox') el.checked = false;
      else if (el.type === 'number') el.value = el.defaultValue || '';
      else el.value = '';
    });
    document.getElementById('f_municipio').value = this._municipioPorDefecto();
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
    this.recalcularPersonal();
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
      const box = document.getElementById('gpsPreview');   // v5.92: ocultar vista previa manual
      if (box) { box.style.display = 'none'; box.innerHTML = ''; }
    } else {
      const coords = document.getElementById('gpsCoords');
      coords.textContent = 'Modo manual — escriba las coordenadas abajo';
      if (this.reporteActual?.gps) {
        document.getElementById('f_lat_manual').value = this.reporteActual.gps.lat || '';
        document.getElementById('f_lng_manual').value = this.reporteActual.gps.lng || '';
      }
      this._previewCoordsManual();   // v5.92: muestra en vivo lo que ya hay cargado
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

  // v5.92: Convierte UN token de coordenada escrito a mano en un número decimal (o NaN).
  // Causa raíz del bug del mapa: en Colombia el separador decimal es la COMA, y
  // parseFloat("3,8650") devuelve 3 (corta en la coma). Como 3 es una latitud válida
  // dentro del país, pasaba el chequeo de rango y se guardaba MAL en silencio: el pin
  // caía en (3, -67) en vez de (3.8650, -67.9239) → "desordenado en el mapa".
  // Ahora tolera: coma o punto decimal, separador de miles, letras de hemisferio
  // (N/S/E/W/O), grados-minutos-segundos (3°51'54"N) y espacios/símbolos sobrantes.
  _numDesdeCoord(txt) {
    if (txt === null || txt === undefined) return NaN;
    let s = String(txt).trim();
    if (!s) return NaN;

    // Signo: '-' al inicio, o letra de hemisferio Sur/Oeste (S / W / O de "Oeste").
    const neg = /^-/.test(s) || /[SWOswo]/.test(s);
    s = s.replace(/[NSEWOnsewo]/g, ' ');   // fuera letras de hemisferio

    // ¿Grados-minutos-segundos? Tiene símbolos ° ' " o 2-3 grupos numéricos separados.
    const tieneSimbolos = /[°'"]/.test(s);
    const grupos = s.replace(/[°'"]/g, ' ').trim().split(/\s+/).filter(t => /\d/.test(t));
    if (tieneSimbolos || grupos.length >= 2) {
      const p = grupos.map(x => Math.abs(parseFloat(x.replace(',', '.'))));
      if (!p.length || p.some(isNaN)) return NaN;
      const dec = (p[0] || 0) + (p[1] || 0) / 60 + (p[2] || 0) / 3600;
      return neg ? -dec : dec;
    }

    // Decimal simple. Normaliza coma / punto (deja solo dígitos, punto y coma).
    s = s.replace(/[^\d.,]/g, '');
    if (s.includes('.') && s.includes(',')) {
      // El ÚLTIMO separador es el decimal; el otro son miles → se elimina.
      if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
      else s = s.replace(/,/g, '');
    } else if (s.includes(',')) {
      s = s.replace(',', '.');             // coma decimal (Colombia)
    }
    const n = parseFloat(s);
    if (isNaN(n)) return NaN;
    return neg ? -Math.abs(n) : Math.abs(n);
  },

  // v5.92: Si la unidad pegó AMBAS coordenadas juntas en un solo campo
  // (ej. "3.8650, -67.9239" copiado de Google Maps) y el otro campo quedó vacío,
  // intenta separarlas. Solo devuelve [lat, lng] si logra DOS coordenadas EN RANGO;
  // si no, devuelve null y el flujo cae al parseo campo por campo.
  _dividirParDeCoords(txt) {
    const s = String(txt || '').trim();
    if (!s) return null;
    const intentos = [];
    if (s.includes(';')) intentos.push(s.split(';'));           // separadas por ';'
    if (/,\s+/.test(s)) intentos.push(s.split(/,\s+/));         // coma+espacio (no parte la coma decimal)
    const mNeg = s.match(/^(.+?)[,\s]+(-.+)$/);                 // la longitud arranca con '-' (Colombia)
    if (mNeg) intentos.push([mNeg[1], mNeg[2]]);
    if (/\s+/.test(s)) intentos.push(s.split(/\s+/));           // separadas por espacio(s)
    for (const par of intentos) {
      if (!par || par.length !== 2) continue;
      const a = this._numDesdeCoord(par[0]);
      const b = this._numDesdeCoord(par[1]);
      if (!isNaN(a) && !isNaN(b) && a >= -90 && a <= 90 && b >= -180 && b <= 180) return [a, b];
    }
    return null;
  },

  // v5.92: Lee los dos campos manuales tolerando formatos y el caso "ambas en un campo".
  _leerCoordsManual() {
    const latTxt = (document.getElementById('f_lat_manual').value || '').trim();
    const lngTxt = (document.getElementById('f_lng_manual').value || '').trim();
    let lat = NaN, lng = NaN;
    if (latTxt && !lngTxt) {
      const par = this._dividirParDeCoords(latTxt);
      if (par) [lat, lng] = par;
    } else if (lngTxt && !latTxt) {
      const par = this._dividirParDeCoords(lngTxt);
      if (par) [lat, lng] = par;
    }
    if (isNaN(lat) || isNaN(lng)) {
      lat = this._numDesdeCoord(latTxt);
      lng = this._numDesdeCoord(lngTxt);
    }
    return {
      lat, lng,
      latOk: !isNaN(lat) && lat >= -90 && lat <= 90,
      lngOk: !isNaN(lng) && lng >= -180 && lng <= 180,
      hayTexto: !!(latTxt || lngTxt)
    };
  },

  // v5.92: Vista previa EN VIVO de las coordenadas manuales (se llama en cada `oninput`).
  // Muestra exactamente cómo se guardará el pin ANTES de enviar, así la unidad detecta
  // al instante si escribió mal. Sin llamadas de red ni mapa: funciona sin señal (rural
  // Colombia) y no mete texto libre a innerHTML (solo números ya parseados y GMS derivado).
  _previewCoordsManual() {
    const box = document.getElementById('gpsPreview');
    if (!box) return;
    const c = this._leerCoordsManual();
    if (!c.hayTexto) { box.style.display = 'none'; box.innerHTML = ''; box.className = 'gps-preview'; return; }
    box.style.display = 'block';
    if (c.latOk && c.lngOk) {
      const gms = `${this.decimalAGMS(c.lat, true)} ${this.decimalAGMS(c.lng, false)}`;
      box.className = 'gps-preview ok';
      box.innerHTML = '📍 <b>Así se guardará el pin:</b><br>' +
        `🌐 <span class="val">${c.lat.toFixed(6)}, ${c.lng.toFixed(6)}</span><br>` +
        `📐 <span class="val">${gms}</span>`;
    } else {
      box.className = 'gps-preview err';
      let msg;
      if (!isNaN(c.lat) && !isNaN(c.lng)) {
        msg = 'Coordenadas fuera de rango (latitud −90 a 90, longitud −180 a 180). ¿Falta el punto o la coma decimal?';
      } else {
        msg = 'Aún no se entienden. Escriba con coma o punto decimal (ej: 3,8650 y -67,9239).';
      }
      box.innerHTML = `⚠️ ${msg}`;
    }
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
        headers: { 'User-Agent': 'Reportes-Bomberos/4.1 (gilrangeljeancarlosjeferson@gmail.com)' }
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

      if (!municipioInput.value || municipioInput.value === this._municipioPorDefecto()) {
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
          ${app._opcionesFlota(datos && datos.recurso)}
          <option value="Personal"${(datos && datos.recurso === 'Personal') ? ' selected' : ''}>Personal (sin vehículo)</option>
        </select>
        <input type="text" data-campo="recurso_otro" placeholder="Especifique" style="display:none; margin-top: 6px;">
      </div>
      <div class="campo">
        <label>Responsable / Maquinista</label>
        <div class="nombre-con-ci">
          <input type="text" data-campo="responsable" list="rosterBomberos" placeholder="Nombre del bombero a cargo (escriba inicial)" oninput="app.recalcularPersonal()">
          <button type="button" class="btn-ci" title="Marcar como Comandante de Incidente (quien dirigió en el lugar)" onclick="app.marcarComandante(this)">⭐</button>
        </div>
      </div>
      <div class="campo personal-bloque">
        <label>Otras unidades en este vehículo (tripulantes)</label>
        <div class="personal-lista" data-personal></div>
        <button type="button" class="agregar-personal" onclick="app.agregarBombero(this)">+ Agregar bombero</button>
      </div>
    `;
    cont.appendChild(div);

    if (datos) {
      const sel = div.querySelector('[data-campo="recurso"]');
      /* La flota ya se pintó arriba marcando el valor guardado, así que acá solo
         queda el caso "este vehículo no está en la flota": un reporte viejo que
         nombra una máquina dada de baja, o un apoyo de otro cuerpo. Eso NO se
         pierde: cae al campo de texto libre con su nombre original. */
      const enFlota = app._flotaDisponible().some(v => v.indicativo === datos.recurso)
                      || datos.recurso === 'Personal';
      if (enFlota) {
        sel.value = datos.recurso;
      } else if (datos.recurso) {
        sel.value = 'Otro';
        div.querySelector('[data-campo="recurso_otro"]').value = datos.recurso;
        div.querySelector('[data-campo="recurso_otro"]').style.display = 'block';
      }
      this.cambioTipoRecurso(sel);
      // v1.47 (PLAN-20260915-01): cantidad y código ya no se piden. Los de reportes VIEJOS se conservan
      // en el dataset de la fila para no perderlos al re-guardar (leerRecursos los lee de ahí).
      div.dataset.cantidad = datos.cantidad != null ? String(datos.cantidad) : '';
      div.dataset.codigo = datos.codigo || '';
      div.querySelector('[data-campo="responsable"]').value = datos.responsable || '';
      if (datos.personal && Array.isArray(datos.personal)) {
        datos.personal.forEach(nombre => this.agregarBomberoConNombre(div, nombre));
      }
    }
  },

  cambioTipoRecurso(select) {
    const fila = select.closest('.fila');
    const otroInput = fila.querySelector('[data-campo="recurso_otro"]');
    /* El marcador __OTRO__ lo pone _opcionesFlota. Antes se comparaba con 'Otro'
       a secas, que era una opción de la lista fija; ahora la lista sale de la
       flota del cuerpo y ese texto ya no existe. */
    const esOtro = select.value === '__OTRO__' || select.value === 'Otro';
    otroInput.style.display = esOtro ? 'block' : 'none';
    if (esOtro) { try { otroInput.focus(); } catch (e) {} }
    // La lista de tripulantes ahora está siempre visible en cada vehículo.
  },

  agregarBombero(btn) {
    this.agregarBomberoConNombre(btn.closest('.fila'), '');
  },

  agregarBomberoConNombre(filaRecurso, nombre) {
    const lista = filaRecurso.querySelector('[data-personal]');
    const item = document.createElement('div');
    item.className = 'item-personal';
    item.innerHTML = `
      <input type="text" list="rosterBomberos" placeholder="Nombre del tripulante (escriba inicial)" value="${app._esc(String(nombre || ''))}" oninput="app.recalcularPersonal()">
      <button type="button" class="btn-ci" title="Marcar como Comandante de Incidente (quien dirigió en el lugar)" onclick="app.marcarComandante(this)">⭐</button>
      <button type="button" class="quitar-personal" onclick="this.parentElement.remove(); app.recalcularPersonal();">×</button>
    `;
    lista.appendChild(item);
    this.recalcularPersonal();
  },

  // ============ PERSONAL: roster, autocompletar, auto-suma ============
  // v5.98: lista de nombres VIGENTE para autocompletar y para validar.
  // Orden de preferencia: lo que se leyó de la hoja (this._rosterVivo) →
  // la semilla del código. Nunca devuelve vacío, así que si falla la red o
  // la caché, la app se comporta como antes y no queda peor.
  _rosterVigente() {
    if (Array.isArray(this._rosterVivo) && this._rosterVivo.length) return this._rosterVivo;
    return (typeof ROSTER_BOMBEROS !== 'undefined') ? ROSTER_BOMBEROS : [];
  },

  // v5.98: la hoja Personal manda. Se llama al restaurar sesión y tras
  // iniciar sesión. Primero pinta lo cacheado (instantáneo y funciona SIN
  // señal), luego refresca desde el backend en segundo plano.
  // hay cuerpos que se quedan sin cobertura por días: por eso nunca se bloquea ni se
  // borra la caché ante un fallo de red.
  async _cargarRosterDesdeHoja() {
    // 1) Caché primero — sirve offline y evita parpadeo.
    try {
      const cache = await DB.obtenerConfig('roster_personal');
      if (Array.isArray(cache) && cache.length) {
        this._rosterVivo = cache;
        this.poblarRosterBomberos();
      }
    } catch (e) { /* sin caché: seguimos con la semilla */ }

    // 2) Refresco desde la hoja (solo si hay internet).
    if (!navigator.onLine) return;
    try {
      // El interceptor de fetch agrega idToken y pase automáticamente.
      const r = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarTodoPersonal' })
      });
      const d = await r.json();
      if (!d || !d.ok || !Array.isArray(d.personal)) return;
      const nombres = d.personal
        .map(p => String((p && p.nombre) || '').trim())
        .filter(n => n !== '');
      // Si la hoja viniera vacía, NO se pisa lo que ya funciona.
      if (!nombres.length) return;
      this._rosterVivo = nombres;
      await DB.guardarConfig('roster_personal', nombres);
      this.poblarRosterBomberos();
    } catch (e) {
      /* silencioso: sin señal se sigue usando la caché o la semilla */
    }
  },

  poblarRosterBomberos() {
    const dl = document.getElementById('rosterBomberos');
    if (!dl) return;
    const lista = this._rosterVigente();
    dl.innerHTML = lista
      .map(n => `<option value="${String(n).replace(/"/g, '&quot;')}"></option>`).join('');
  },

  // v5.95: se eliminó una definición duplicada (débil, sin quitar tildes) de
  // _normNombre que había aquí — la vigente (fuerte) vive junto a _cedKey.

  // v5.63 (BUG decimales): redondea a 1 decimal — evita "28.099999999999994h"
  _r1(n) {
    return Math.round((Number(n) || 0) * 10) / 10;
  },

  // v5.63 (BUG duplicados): normalización FUERTE de nombres — mayúsculas,
  // sin tildes y Ñ→N. Así "JOSÉ NÚÑEZ" == "JOSE NUNEZ" y "MUÑOZ" == "MUNOZ".
  _normFuerte(s) {
    return (s || '').toString().trim().toUpperCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ');
  },

  // v5.63 (anti-fallas): confirmación async con modal propio (APK-safe)
  _confirmarAsync(mensajeHTML, txtOk, txtCancel) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.className = 'modal-js';   // sin esto ninguna regla CSS lo alcanza
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:22px;max-width:340px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
        + '<div style="font-size:14px;color:#333;margin-bottom:16px;line-height:1.5;">'+mensajeHTML+'</div>'
        + '<div style="display:flex;gap:10px;">'
        + '<button id="_caCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:13px;">'+(txtCancel||'Cancelar')+'</button>'
        + '<button id="_caOk" style="flex:1;padding:12px;background:#1e8449;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:13px;">'+(txtOk||'Continuar')+'</button>'
        + '</div></div>';
      document.body.appendChild(modal);
      const fin = (v) => { try { app._cerrarModalJS(modal); } catch(e){} resolve(v); };
      modal.querySelector('#_caCancel').onclick = () => fin(false);
      modal.querySelector('#_caOk').onclick = () => fin(true);
    });
  },

  // v5.63 (BUG anti-tontos): revisa los nombres del personal del reporte contra
  // la base de bomberos. Si hay nombres desconocidos (typo, tilde, apodo),
  // avisa ANTES de enviar → menos duplicados en Operatividad.
  _nombresDesconocidosEnForm() {
    // v5.98: valida contra la lista VIGENTE (hoja → caché → semilla). Antes
    // usaba la lista congelada del código: alertaba "nombre desconocido" con
    // personal real recién agregado y dejaba pasar en silencio a los retirados.
    const conocidos = new Set(this._rosterVigente().map(n => this._normFuerte(n)));
    const desconocidos = [];
    const revisar = (n) => {
      const norm = this._normFuerte(n);
      if (norm && !conocidos.has(norm) && desconocidos.indexOf(n.trim()) === -1) desconocidos.push(n.trim());
    };
    document.querySelectorAll('#tablaRecursos .fila').forEach(fila => {
      const resp = fila.querySelector('[data-campo="responsable"]');
      if (resp && resp.value.trim()) revisar(resp.value);
      fila.querySelectorAll('[data-personal] input').forEach(i => { if (i.value.trim()) revisar(i.value); });
    });
    return desconocidos;
  },

  // ═══ v5.63 (BUG doble click): bloqueo universal de botones ═══
  // Envuelve cualquier acción async: deshabilita el botón, muestra spinner
  // "Cargando..." y lo restaura al terminar (éxito o error). Si el usuario
  // vuelve a tocar mientras corre, se ignora → NO más registros duplicados.
  async _conBloqueo(btn, textoCargando, fn) {
    if (btn && btn.dataset && btn.dataset.ocupado === '1') return; // ya corriendo
    let htmlOrig = '';
    if (btn) {
      btn.dataset.ocupado = '1';
      htmlOrig = btn.innerHTML;
      btn.disabled = true;
      btn.style.opacity = '0.65';
      btn.innerHTML = '<span class="ld-despacho"><i></i><i></i><i></i></span> ' + (textoCargando || 'Cargando...');
    }
    try {
      await fn();
    } finally {
      if (btn) {
        btn.dataset.ocupado = '';
        btn.disabled = false;
        btn.style.opacity = '';
        btn.innerHTML = htmlOrig;
      }
    }
  },

  // Cuenta personas distintas desde el FORMULARIO (comandante + responsables + tripulantes)
  resumenPersonalDeForm() {
    const nombres = [];
    const ic = this._nombreComandanteMarcado();
    if (ic) nombres.push(ic);
    document.querySelectorAll('#tablaRecursos .fila').forEach(fila => {
      const resp = fila.querySelector('[data-campo="responsable"]');
      if (resp && resp.value.trim()) nombres.push(resp.value);
      fila.querySelectorAll('[data-personal] input').forEach(i => {
        if (i.value.trim()) nombres.push(i.value);
      });
    });
    const vistos = new Set();
    nombres.forEach(n => vistos.add(this._normNombre(n)));
    return { total: vistos.size, comandante: ic.trim() };
  },

  // Cuenta personas distintas desde un REPORTE guardado (para el PDF)
  resumenPersonalDeReporte(r) {
    const nombres = [];
    if (r.comandanteIncidente && String(r.comandanteIncidente).trim()) nombres.push(r.comandanteIncidente);
    (r.recursos || []).forEach(rec => {
      if (rec.responsable && String(rec.responsable).trim()) nombres.push(rec.responsable);
      (rec.personal || []).forEach(n => { if (n && String(n).trim()) nombres.push(n); });
    });
    const vistos = new Set();
    nombres.forEach(n => vistos.add(this._normNombre(n)));
    return { total: vistos.size, comandante: (r.comandanteIncidente || '').toString().trim() };
  },

  recalcularPersonal() {
    const { total, comandante } = this.resumenPersonalDeForm();
    const elTotal = document.getElementById('totalPersonalAuto');
    if (elTotal) elTotal.textContent = total;
    const elCmd = document.getElementById('comandanteIncidenteAuto');
    if (elCmd) elCmd.textContent = comandante || '— (sin asignar) · marque con ⭐';
  },

  // Marca/desmarca a una persona como Comandante de Incidente (solo uno)
  marcarComandante(btn) {
    const yaActivo = btn.classList.contains('activo');
    document.querySelectorAll('#tablaRecursos .btn-ci.activo').forEach(b => b.classList.remove('activo'));
    if (!yaActivo) btn.classList.add('activo');
    this.recalcularPersonal();
  },

  // Nombre de la persona marcada con la estrella (Comandante de Incidente)
  _nombreComandanteMarcado() {
    const btn = document.querySelector('#tablaRecursos .btn-ci.activo');
    if (!btn) return '';
    const inp = btn.parentElement.querySelector('input');
    return inp ? (inp.value || '').trim() : '';
  },

  // Al editar: marca la estrella de la persona cuyo nombre coincide con el CI guardado
  _marcarComandantePorNombre(nombre) {
    if (!nombre) return;
    const norm = this._normNombre(nombre);
    document.querySelectorAll('#tablaRecursos .btn-ci').forEach(b => {
      const inp = b.parentElement.querySelector('input');
      if (inp && this._normNombre(inp.value) === norm) b.classList.add('activo');
    });
  },

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
    // En modo edición admin, reporteActual puede ser null.
    // Usar el reporte que se está editando como base, o crear uno nuevo.
    const r = this._modoEdicionAdmin
      ? (this._reporteAdminEditando || this.reporteActual || {})
      : (this.reporteActual || {});
    r.fechaModificacion = new Date().toISOString();
    r.estacion = NOMBRE_ESTACION;
    r.fechaLlamada = document.getElementById('f_fecha_llamada').value;
    r.fechaSalida = document.getElementById('f_fecha_salida').value;
    r.fechaLlegada = document.getElementById('f_fecha_llegada').value;
    r.fechaCierre = document.getElementById('f_fecha_cierre').value;
    r.reportaNombre = document.getElementById('f_reporta_nombre').value;
    r.reportaTel = document.getElementById('f_reporta_tel').value;
    r.reportaRelacion = document.getElementById('f_reporta_relacion').value;
    r.turno = document.getElementById('f_turno').value;

    r.clasificacion = Array.from(document.querySelectorAll('[data-grupo="clasificacion"]:checked')).map(c => c.value);
    r.clasificacionOtra = document.getElementById('f_clasif_otra').value;

    if (this.modoUbicacion === 'manual') {
      // v5.92: parser robusto — tolera coma decimal (Colombia), GMS, letras de
      // hemisferio y ambas coordenadas pegadas en un solo campo. Antes se usaba
      // parseFloat crudo: "3,8650" → 3 (corta en la coma) se guardaba mal en
      // silencio y el pin caía en (3, -67). La validación de RANGO de v5.85 se
      // conserva dentro de _leerCoordsManual().
      const c = this._leerCoordsManual();
      if (c.latOk && c.lngOk) {
        r.gps = { lat: c.lat, lng: c.lng, accuracy: 0, altitude: null, speedKmh: null, heading: '' };
        r.gpsGMS = `${this.decimalAGMS(c.lat, true)} ${this.decimalAGMS(c.lng, false)}`;
        r.gpsManual = true;
        // Refleja lo que se interpretó, para que la unidad LO VEA antes de enviar.
        document.getElementById('f_lat_manual').value = c.lat.toFixed(6);
        document.getElementById('f_lng_manual').value = c.lng.toFixed(6);
        this._previewCoordsManual();   // v5.92: sincroniza la vista previa con lo guardado
      } else if (c.hayTexto) {
        this.toast('⚠️ Coordenadas inválidas. Use punto o coma decimal (ej: 3,8650 y -67,9239). Latitud entre −90 y 90, longitud entre −180 y 180.', 'error');
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

    // Comandante de incidente + observaciones de mando + total automatico
    r.comandanteIncidente = this._nombreComandanteMarcado();
    r.observacionesMando = (document.getElementById('f_observaciones_mando') || {}).value || '';
    r.totalPersonal = this.resumenPersonalDeForm().total;
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
      const responsable = fila.querySelector('[data-campo="responsable"]').value;
      return {
        recurso,
        // cantidad derivada: vehículo/otro = 1; Personal = nombres (responsable + tripulantes). Un reporte viejo
        // conserva la suya (dataset). Así la columna "Cantidad" de la hoja sigue teniendo sentido sin digitarla.
        cantidad: fila.dataset.cantidad || (recurso === 'Personal' ? String(personal.length + (responsable.trim() ? 1 : 0)) : '1'),
        codigo: fila.dataset.codigo || '',
        responsable,
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
    document.getElementById('f_fecha_salida').value = this._isoADatetimeLocal(r.fechaSalida);
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
    document.getElementById('f_municipio').value = r.municipio || this._municipioPorDefecto();
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
            <img src="${app._esc(this._imgDrive(f))}" alt="">
            <button class="quitar" onclick="event.stopPropagation(); app.quitarFoto(${i})">×</button>
          `;
          slotEl.classList.add('con-foto');
        }
      }
    });

    document.getElementById('tablaRecursos').innerHTML = '';
    (r.recursos || []).forEach(rec => this.agregarRecurso(rec));
    {
      this._marcarComandantePorNombre(r.comandanteIncidente);
      const _om = document.getElementById('f_observaciones_mando');
      if (_om) _om.value = r.observacionesMando || '';
      this.recalcularPersonal();
    }

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

  /* v1.38 — AUTOGUARDADO del reporte en curso (pérdida de datos).
     El WebView de gama baja se muere solo (llamada entrante, poca RAM) y un reporte
     largo dictado por voz se perdía entero si no tocaban "Borrador" a mano. Se guarda
     SILENCIOSO en el MISMO id del reporte en curso (leerFormulario reusa
     this.reporteActual, así que NO acumula borradores basura), reusando el pipeline
     durable de borrador (IndexedDB). El borrador queda visible en Inicio y se reabre
     desde ahí; al enviar con éxito se transforma en 'enviado'/'pendiente'. NO corre en
     edición de admin (eso edita un reporte ya existente del servidor). */
  _autoguardarBorrador() {
    if (this.pantallaActual !== 'pantallaForm' || !this.reporteActual || this._modoEdicionAdmin) return;
    try {
      const r = this.leerFormulario();
      r.estado = 'borrador';
      DB.guardarReporte(r);   // fire-and-forget: un autoguardado no debe bloquear el llenado
    } catch (e) { /* si el autoguardado falla, no molestar — el usuario sigue escribiendo */ }
  },

  _programarAutoguardado() {
    clearTimeout(this._tAutoguardar);
    this._tAutoguardar = setTimeout(() => this._autoguardarBorrador(), 2500);
  },

  async enviarReporte(btn) {
    // v5.63 (BUG doble click): si ya está enviando, ignorar toques extra
    if (this._enviandoReporte) return;
    const r = this.leerFormulario();
    if (!r.narrativa || !r.direccion || !r.comandanteNombre || !r.fechaLlamada) {
      // v1.42: se MARCA y SACUDE cada campo que falta y la app te LLEVA al primero.
      const faltantes = [
        ['f_fecha_llamada', !r.fechaLlamada, 'la fecha de la llamada'],
        ['f_direccion', !r.direccion, 'la dirección'],
        ['f_narrativa', !r.narrativa, 'la narrativa inicial'],
        ['f_comandante_nombre', !r.comandanteNombre, 'el comandante en el lugar']
      ].filter(x => x[1]);
      faltantes.forEach(x => this._marcarCampoFalta(x[0]));
      const primero = document.getElementById(faltantes[0][0]);
      if (primero) {
        try { primero.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
        setTimeout(() => { try { primero.focus(); } catch (e) {} }, 300);
      }
      this.toast('Falta ' + faltantes[0][2] + (faltantes.length > 1 ? ' (y ' + (faltantes.length - 1) + ' más marcados en rojo)' : ''), 'error');
      return;
    }
    // v5.63 (BUG anti-tontos): nombres que no están en la base → confirmar
    try {
      const desconocidos = this._nombresDesconocidosEnForm();
      if (desconocidos.length) {
        const seguir = await this._confirmarAsync(
          '⚠️ <b>Estos nombres NO están en la base de bomberos:</b><br><br>'
          + desconocidos.map(n => '• ' + n).join('<br>')
          + '<br><br>Revisa que estén bien escritos (usa el autocompletado). Nombres mal escritos duplican datos en Operatividad.',
          'Enviar así', 'Corregir');
        if (!seguir) return;
      }
    } catch(eV) { /* validación nunca debe romper el envío */ }
    this._enviandoReporte = true;
    if (btn) { btn.disabled = true; btn.style.opacity='0.65'; btn.innerHTML='<span class="ld-sirena"></span> Enviando...'; }
    try {
      await this._enviarReporteInterno(r);
    } finally {
      this._enviandoReporte = false;
      if (btn) { btn.disabled = false; btn.style.opacity=''; btn.innerHTML='📤 Enviar'; }
    }
  },

  async _enviarReporteInterno(r) {
    r.estado = 'pendiente';

    // === EDICIÓN vs CREACIÓN ===
    // Si esta sesión del formulario es una edición de un reporte que ya está
    // en el servidor, preservamos el consecutivo y marcamos _actualizar:true
    // para que el backend actualice la fila + regenere hojas auxiliares
    // (Recursos, Personal, Victimas, Organizaciones, Personal_por_Incidente).
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
    // v5.84: candado por reporte — si este id ya tiene un envío EN CURSO
    // (toques repetidos, o botón + sincronización automática a la vez), no
    // se dispara otra petición paralela del MISMO reporte.
    this._syncEnCurso = this._syncEnCurso || new Set();
    if (this._syncEnCurso.has(reporte.id)) return false;
    this._syncEnCurso.add(reporte.id);
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

      // v5.74: Apps Script SIEMPRE responde HTTP 200, incluso en errores
      // ({ok:false}, p. ej. "Demasiadas peticiones" o "No autorizado"). Antes se
      // marcaba "enviado" sin mirar data.ok y un reporte rechazado se perdía en
      // silencio. Ahora solo se marca enviado con confirmación real del servidor;
      // si no, queda "pendiente" y sincronizarPendientes lo reintenta al volver
      // la señal (el backend ignora duplicados por id → no se duplica nada).
      let consecutivoServidor = '';
      try {
        const data = await resp.json();
        if (!data || data.ok !== true) {
          console.warn('Servidor rechazó el reporte:', data && data.error);
          this.toast('El servidor no aceptó el reporte: ' + ((data && data.error) || 'error desconocido') + '. Queda pendiente y se reintentará.', 'error');
          return false;
        }
        if (data.consecutivo) consecutivoServidor = data.consecutivo;
        // v5.96: si Drive rechazó alguna foto (muy pesada, permisos de carpeta),
        // antes fallaba EN SILENCIO y el reporte quedaba sin esa foto para
        // siempre. Ahora se avisa a la unidad en el momento del envío.
        try {
          if (Array.isArray(data.urlsFotos) && (reporte.fotos || []).length) {
            const enviadas = Math.min((reporte.fotos || []).length, 6);
            const subidas = data.urlsFotos.filter(u => u).length;
            if (subidas < enviadas) this.toast('⚠️ ' + (enviadas - subidas) + ' foto(s) no se pudieron guardar en Drive (el resto del reporte quedó bien). Avísale al administrador.', 'error');
          }
        } catch (eW) {}
      } catch (e) {
        // Respuesta ilegible = SIN confirmación → queda pendiente (reintento
        // seguro: el backend detecta el id repetido y no duplica).
        console.warn('No se pudo leer respuesta del servidor:', e);
        return false;
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
    } finally {
      this._syncEnCurso.delete(reporte.id);
    }
  },

  // Solo admin: renumerar reportes en el servidor
  async renumerarReportes(btn) {
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

    await this._conBloqueo(btn, 'Renumerando...', async () => {
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
    });
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
        <h3 style="color: var(--rojo); margin-bottom: 12px;">📅 Cierre de mes y renumeración</h3>
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
        <button id="btn_aplicar_cierre" class="btn btn-completo" onclick="app.aplicarCierreMes()" style="display: none; margin-top: 8px; background: var(--rojo); color: #fff;">
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
        { const _d=document.createElement("div"); _d.style.cssText="background:#fee;padding:12px;border-radius:8px;color:#c00;"; _d.textContent="❌ "+(data.error||"Error"); cont.innerHTML=""; cont.appendChild(_d); }
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
              <td style="padding:6px;font-size:12px;color:#999;text-decoration:line-through;">${app._esc(p.consecutivoAnterior)}</td>
              <td style="padding:6px;font-size:12px;color:#15803d;font-weight:700;">→ ${app._esc(p.consecutivoNuevo)}</td>
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
      { const _d=document.createElement("div"); _d.style.cssText="background:#fee;padding:12px;border-radius:8px;color:#c00;"; _d.textContent="❌ Error de red: "+(err.message||""); cont.innerHTML=""; cont.appendChild(_d); }
    }
  },

  async aplicarCierreMes() {
    if (this._aplicandoCierreMes) return; // v5.64 (BUG 2): anti doble-click
    if (!this._cierreMesPendiente) {
      this.toast('Primero debes previsualizar', 'error');
      return;
    }
    const info = this._cierreMesPendiente;

    // Cerrar el modal de cierre ANTES de confirmar (si no, el confirm queda tapado detrás z-index:9999)
    this.cerrarModalCierreMes();
    const ok = await this.confirmar(
      '⚠️ ¿Confirmar cierre de mes?',
      `Se renumerarán ${info.cambiosRealizarian} reportes de ${info.nombreMes} ${info.anio}. Esta acción NO se puede deshacer. ¿Continuar?`
    );
    if (!ok) { this._cierreMesPendiente = null; return; }
    this._aplicandoCierreMes = true;
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
    } finally {
      this._aplicandoCierreMes = false;
    }

    this._cierreMesPendiente = null;
  },

  // ========== PANEL ADMIN CON CONTRASEÑA ==========
  // Lista TODOS los reportes (no solo del usuario actual) para que el admin pueda editar
  async abrirPanelAdmin() {
    if (!this.esAdmin()) {
      this.toast('Solo el administrador', 'error');
      return;
    }
    // Pedir contraseña — el backend valida, no el frontend
    // v5.63: modal propio (window.prompt está bloqueado en el APK)
    const pw = await this._obtenerPwdAdmin('🔐 Contraseña de administrador', 'panelAdmin');
    if (!pw) return;
    this._adminAutorizado = true;
    this.irA('pantallaPanelAdmin');
    // v5.94: si venías de "Ver reporte completo" (p. ej. desde el Mapa de
    // Emergencias), la vista de detalle quedaba abierta y al reentrar al Panel
    // se veía ese reporte (a veces vacío) en lugar de la lista. Reseteamos.
    this._resetVistaPanelAdmin();
    await this.cargarReportesAdmin();
    // v6.00: bandeja de altas pendientes. Sin await a propósito: es información
    // secundaria y no debe demorar la apertura del Panel ni romperla si falla.
    this.cargarPersonalPendiente();
    // v1.27: solicitudes de ingreso por link/QR (mismo criterio: secundario, sin await).
    this.cargarSolicitudes();
    /* Flota: sin esto el bloque de vehículos salía vacío hasta que alguien
       tocara "Actualizar", y un cuerpo con su flota ya cargada creería que se
       le perdió. Sin await por el mismo motivo que la bandeja. */
    this._cargarFlota(true).then(() => this._renderFlotaAdmin()).catch(() => {});
    // v6.02: mostrar quién quedó firmado (la firma se pidió en _obtenerPwdAdmin).
    const _et = document.getElementById('operActualTxt');
    if (_et) _et.textContent = this._operadorSesion || 'sin firmar';
    // v6.03: la gestión de administradores solo se muestra al administrador
    // principal. El backend valida igual — esto evita ofrecer botones que fallan.
    const _aw = document.getElementById('adminsWrap');
    if (_aw) _aw.style.display = this.esSuperAdmin() ? 'block' : 'none';
    // v1.35: unidades vinculadas — mismo criterio que Administradores.
    const _uw = document.getElementById('unidadesWrap');
    if (_uw) _uw.style.display = this.esSuperAdmin() ? 'block' : 'none';
    // v6.05: las cajas se llenan SOLAS al abrir el Panel. Hasta v6.04 solo se
    // hacían visibles y quedaban vacías: un título, un texto que hablaba de una
    // lista, y ninguna lista. Por eso se veía "de adorno" (lo reportó Jeferson).
    // Sin await a propósito: son datos secundarios y no deben demorar la apertura
    // del Panel ni romperla si el servidor tarda o falla.
    if (_aw && _aw.style.display === 'block') this.cargarAdministradores();
    if (_uw && _uw.style.display === 'block') this.cargarUnidadesVinculadas();
    // v6.07: el buscador arranca limpio en cada apertura. Sin esto, si habías
    // filtrado antes de salir, al volver la lista aparecía recortada y parecía
    // que faltaba personal.
    this._pinsFiltro = '';
    this.cargarEstadoPins();
    this._pintarEscudoPanel();
  },

  // v5.94: deja el Panel Admin en su estado inicial (lista visible, detalle y
  // edición ocultos). Seguro de llamar aunque algún nodo no exista.
  _resetVistaPanelAdmin() {
    const viendo = document.getElementById('panelAdminViendo');
    const editando = document.getElementById('panelAdminEditando');
    const wrap = document.getElementById('listaReportesAdminWrap');
    if (viendo) viendo.style.display = 'none';
    if (editando) editando.style.display = 'none';
    if (wrap) { wrap.style.display = 'block'; this._animarEntrada(wrap); }
    this._reporteAdminViendo = null;
  },

  /* ═══════ v6.03: SUPERADMIN — gestión de administradores ═══════
     El backend valida con _esSuperAdmin (identidad verificada + contraseña); esto
     de acá solo decide si se muestran los botones, para no ofrecer lo que va a
     fallar. Nadie gana permisos por editar el HTML: el servidor manda. */
  /* T1 — ANTES comparaba contra el correo de Jeferson quemado acá. En el producto
     el superadmin es el FUNDADOR de CADA instalación, no el creador de la app.
     Lo dice el servidor en iniciarSesion; el front solo lo refleja para pintar
     botones. El servidor vuelve a verificar en cada acción: nadie gana permisos
     editando el HTML. */
  esSuperAdmin() {
    return !!(this.usuario && this.usuario.esSuperAdmin);
  },

  /* ═══════════ T1b — IDENTIDAD DEL CUERPO EN LA INTERFAZ ═══════════
     ANTES: el nombre y la sigla de UNA estación
     estaban escritos a mano en ~40 sitios del HTML. Otro cuerpo abría
     la app y leía el nombre de otro cuerpo por todos lados: se sentía prestada, no propia.

     EL PROBLEMA DE ORDEN: la pantalla de login muestra el nombre ANTES de que el
     usuario entre, así que el servidor todavía no puede decirlo. Se resuelve
     cacheando la institución tras el primer login: quien vuelve ve su nombre al
     instante, y una instalación nueva muestra un texto neutro hasta configurarse.

     Se llama con datos (tras login, y los guarda) o sin datos (al arrancar, y los
     lee del caché).

     ⚠️ Usa `textContent`, NUNCA `innerHTML`: el nombre del cuerpo es texto libre
     que escribe el admin. Con innerHTML sería una vía de inyección (invariante I5). */
  /* T1b — municipio por defecto del formulario de emergencia.
     ANTES estaba escrito el municipio a mano en DOS sitios del código, así que aunque
     el HTML quedara limpio, el JavaScript lo volvía a poner en cada formulario
     nuevo. Otro cuerpo habría reportado todos sus incidentes en el municipio equivocado: no es
     cosmético, es dato equivocado en el reporte oficial y en el RUE.
     Vacío si no hay institución: mejor que el bombero lo escriba a que salga mal. */
  /* T1b — MEMBRETE DEL PDF OFICIAL.
     ANTES traía el NIT, la personería jurídica, el teléfono y la dirección de
     de una estación escritos a mano en los dos generadores de PDF. Otro cuerpo habría
     emitido sus actas oficiales con la identidad legal de una institución ajena.
     Eso no es un problema de marca: es un documento que no corresponde a quien lo
     firma, y en una diligencia oficial eso se cae.
     Devuelve solo los datos que la institución tenga cargados, separados por " | ";
     lo que falte simplemente no aparece. */
  /* Rótulo corto de la app: "CBVPC Reportes", o solo "Reportes" si el cuerpo
     todavía no tiene sigla. Se usa en el encabezado de cada pantalla. */
  /* ═══════════ ASISTENTE DE PRIMER ARRANQUE ═══════════
     Manda los 5 campos al backend, que crea la hoja EN EL DRIVE DEL USUARIO y lo
     deja de administrador fundador. Solo ocurre una vez por instalación. */
  /* Trae los catálogos del backend (departamentos, eventos RUE, rangos, cargos,
     RH) UNA vez y llena los `<select>` que los usan. Así una norma que cambie
     llega a todos los cuerpos sin tocar el front — el principio de Jeferson:
     "solo me preocupo por actualizaciones de normativa". */
  /* ═══════════ VISTA RUE ═══════════
     Muestra los datos del reporte en el ORDEN EXACTO del formulario del RUE, con
     un botón de copiar por campo. Quien llena el RUE baja por esta pantalla en
     paralelo a la otra, sin buscar en papeles ni saltar de un lado a otro.

     ⚠️ NO automatiza el RUE. Se llena a mano, registro por registro (Oracle APEX,
     verificado en la plataforma real el 30/07). Lo que se elimina es la búsqueda
     y el error de transcripción, no el tecleo. Prometer más sería mentirle al
     comandante, y eso se paga con el primer cliente. */
  /* ═══════════ IMPORTAR PERSONAL DESDE EXCEL ═══════════
     Reconoce las columnas por su TÍTULO, no por posición: cada cuerpo tiene su
     Excel con las columnas en otro orden y con otros nombres ("CC", "Documento",
     "Cédula"...). Exigir un orden fijo sería devolverle el trabajo al comandante. */
  _COLUMNAS_IMPORT: {
    nombre:   ['nombre', 'nombres', 'nombre completo', 'apellidos y nombres', 'nombres y apellidos', 'unidad', 'bombero'],
    apellido: ['apellido', 'apellidos'],
    cedula:   ['cedula', 'cc', 'documento', 'identificacion', 'nit', 'numero de cedula', 'documento de identidad'],
    rango:    ['rango', 'grado', 'jerarquia'],
    telefono: ['telefono', 'celular', 'movil', 'tel'],
    email:    ['email', 'mail', 'correo', 'correo electronico'],
    cargo:    ['cargo', 'funcion'],
    rh:       ['rh', 'sangre', 'tipo de sangre', 'grupo sanguineo', 'hemoclasificacion']
  },

  /* Normaliza un título de columna: sin tildes, minúsculas, sin puntuación.
     Así "CÉDULA", "cedula" y "C.C." caen en la misma llave. */
  _normTitulo(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  },

  /* Casa un título YA normalizado contra los alias de un campo. Alias de UNA
     palabra: casa si aparece como token; de VARIAS: como subcadena. Antes se exigía
     igualdad EXACTA del título completo, y por eso "Cédula (CC)" no casaba con
     "cedula" y la cédula se perdía. */
  _tituloCoincide(tituloNorm, alias) {
    const tokens = tituloNorm.split(' ').filter(Boolean);
    return alias.some((a) => a.indexOf(' ') !== -1
      ? tituloNorm.indexOf(a) !== -1
      : tokens.indexOf(a) !== -1);
  },

  _parsearPegado(texto) {
    const lineas = String(texto || '').split(/\r?\n/).filter((l) => l.trim());
    if (lineas.length < 2) return { error: 'Pegue al menos la fila de títulos y una persona.' };

    // Excel copia separando por TAB. El punto y coma o la coma son respaldo.
    const sep = lineas[0].indexOf('\t') !== -1 ? '\t' : (lineas[0].indexOf(';') !== -1 ? ';' : ',');
    const celdas = (l) => l.split(sep).map((c) => c.trim().replace(/^"|"$/g, ''));

    const titulos = celdas(lineas[0]).map((t) => this._normTitulo(t));
    const mapa = {};
    Object.keys(this._COLUMNAS_IMPORT).forEach((campo) => {
      const alias = this._COLUMNAS_IMPORT[campo];
      const i = titulos.findIndex((t) => t && this._tituloCoincide(t, alias));
      if (i !== -1) mapa[campo] = i;
    });

    // Si el roster trae "Apellidos" pero no "Nombres", esa columna ES el nombre.
    if (mapa.nombre === undefined && mapa.apellido !== undefined) { mapa.nombre = mapa.apellido; delete mapa.apellido; }

    if (mapa.nombre === undefined) {
      return { error: 'No se encontró una columna de nombres. Títulos detectados: ' +
                      (titulos.filter(Boolean).join(', ') || '(ninguno)') };
    }

    const filas = [];
    for (let i = 1; i < lineas.length; i++) {
      const c = celdas(lineas[i]);
      const p = {};
      Object.keys(mapa).forEach((campo) => { p[campo] = (c[mapa[campo]] || '').trim(); });
      // "Nombres" + "Apellidos" en columnas DISTINTAS → se unen en el nombre completo.
      if (p.apellido !== undefined) {
        if (mapa.apellido !== mapa.nombre) p.nombre = (p.nombre + ' ' + p.apellido).trim().replace(/\s+/g, ' ');
        delete p.apellido;
      }
      if (p.nombre) filas.push(p);
    }
    return { filas: filas, columnas: Object.keys(mapa) };
  },

  previsualizarImportacion() {
    const cont = document.getElementById('impResumen');
    const btn = document.getElementById('btnImportarConfirmar');
    const r = this._parsearPegado(document.getElementById('impPegar').value);
    this._filasImport = null;
    btn.style.display = 'none';

    if (r.error) {
      cont.innerHTML = '<div style="background:#fee2e2;color:#991b1b;padding:10px;border-radius:6px;font-size:13px;">'
                     + this._esc(r.error) + '</div>';
      return;
    }

    this._filasImport = r.filas;
    const sinCedula = r.filas.filter((p) => !String(p.cedula || '').replace(/\D/g, '')).length;

    let h = '<div style="background:#e8f5e9;padding:10px;border-radius:6px;font-size:13px;">'
          + '<b>' + r.filas.length + ' personas</b> detectadas.<br>'
          + 'Columnas reconocidas: <b>' + this._esc(r.columnas.join(', ')) + '</b></div>';

    if (sinCedula) {
      h += '<div style="background:#fff3e0;padding:10px;border-radius:6px;font-size:12px;margin-top:8px;">'
         + '⚠️ <b>' + sinCedula + '</b> sin cédula. Entran igual, pero se identifican solo por el nombre: '
         + 'si dos personas se llaman parecido, el sistema no las puede distinguir.</div>';
    }

    // Muestra las primeras 5 para que confirme que las columnas quedaron bien.
    h += '<div style="margin-top:10px;font-size:12px;"><b>Primeras filas:</b><table style="width:100%;border-collapse:collapse;margin-top:4px;">';
    r.filas.slice(0, 5).forEach((p) => {
      h += '<tr><td style="border-bottom:1px solid #eee;padding:3px;">' + this._esc(p.nombre) + '</td>'
         + '<td style="border-bottom:1px solid #eee;padding:3px;color:#666;">' + this._esc(p.cedula || '—') + '</td>'
         + '<td style="border-bottom:1px solid #eee;padding:3px;color:#666;">' + this._esc(p.rango || 'BOMBERO') + '</td></tr>';
    });
    h += '</table></div>';
    h += '<p style="font-size:11px;color:#666;margin-top:8px;">No se borra ni se pisa nada: '
       + 'solo se agrega quien todavía no esté en el sistema.</p>';

    cont.innerHTML = h;
    btn.style.display = '';
  },

  async confirmarImportacion(btn) {
    if (!this._filasImport || !this._filasImport.length) return;
    await this._conBloqueo(btn, 'Importando...', async () => {
      try {
        const r = await fetch(_exigirBackend(), {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'importarPersonal', filas: this._filasImport })
        });
        const d = await r.json();
        if (!d || !d.ok) return this.toast((d && d.error) || 'No se pudo importar', 'error');

        let msg = d.agregados + ' agregadas';
        if (d.duplicados.length) msg += ', ' + d.duplicados.length + ' ya estaban';
        if (d.rechazados.length) msg += ', ' + d.rechazados.length + ' rechazadas';
        this.toast(msg, 'exito');
        this.cerrarModalImportar();
        this._cargarRosterDesdeHoja().catch(() => {});
      } catch (e) {
        this.toast('Sin conexión: ' + e.message, 'error');
      }
    });
  },

  abrirModalImportar() {
    document.getElementById('impPegar').value = '';
    document.getElementById('impResumen').innerHTML = '';
    document.getElementById('btnImportarConfirmar').style.display = 'none';
    document.getElementById('modalImportar').classList.add('visible');
  },

  cerrarModalImportar() {
    document.getElementById('modalImportar').classList.remove('visible');
  },

  async verVistaRUE(btn) {
    /* Mismas fuentes que usa el botón "Editar" de al lado: `reporteActual` en la
       vista normal, `_reporteAdminViendo` en el panel de administrador. */
    const r = this._reporteAdminViendo || this.reporteActual;
    if (!r || !r.id) return this.toast('Abra primero un reporte', 'error');

    await this._conBloqueo(btn, 'Preparando...', async () => {
      try {
        const resp = await fetch(_exigirBackend(), {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'vistaRUE', id: r.id })
        });
        const d = await resp.json();
        if (!d || !d.ok) return this.toast((d && d.error) || 'No se pudo preparar la vista', 'error');
        this._pintarVistaRUE(d);
        document.getElementById('modalRUE').classList.add('visible');
      } catch (e) {
        this.toast('Sin conexión: ' + e.message, 'error');
      }
    });
  },

  _pintarVistaRUE(d) {
    const esc = (v) => this._esc(v == null ? '' : String(v));
    let h = '';

    if (d.faltantes && d.faltantes.length) {
      h += '<div style="background:#fee2e2;color:#991b1b;padding:10px;border-radius:6px;margin-bottom:12px;font-size:13px;">'
         + '<b>⚠️ Faltan datos que el RUE exige:</b><ul style="margin:6px 0 0 18px;">'
         + d.faltantes.map((f) => '<li>' + esc(f) + '</li>').join('') + '</ul></div>';
    }

    h += '<div style="background:#fff3e0;border-left:4px solid #e65100;padding:8px 10px;'
       + 'border-radius:4px;font-size:12px;margin-bottom:14px;">' + esc(d.advertencia) + '</div>';

    const bloque = (titulo, campos) => {
      let s = '<div style="font-weight:700;margin:14px 0 6px;">' + esc(titulo) + '</div>';
      campos.forEach((c) => {
        const alerta = c.aproximado
          ? '<div style="color:#92400e;font-size:11px;margin-top:3px;">⚠️ ' + esc(c.nota || 'Verifique este dato.') + '</div>'
          : (c.nota ? '<div style="color:#666;font-size:11px;margin-top:3px;">' + esc(c.nota) + '</div>' : '');
        s += '<div style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid #eee;">'
           + '<div style="flex:0 0 40%;font-size:12px;color:#444;">' + esc(c.campo)
           + (c.obligatorio ? ' <span style="color:#c00;">*</span>' : '') + '</div>'
           + '<div style="flex:1;font-size:13px;"><b>' + (c.valor ? esc(c.valor) : '<span style="color:#999;">(vacío)</span>') + '</b>' + alerta + '</div>'
           /* data-* en vez de meter el valor dentro del onclick: así un texto con
              comillas o caracteres raros no rompe el HTML (invariante I10). */
           + '<button class="btn btn-secundario" style="padding:3px 8px;font-size:11px;" '
           + 'data-copiar="' + esc(c.valor) + '" onclick="app._copiarCampoRUE(this)">Copiar</button>'
           + '</div>';
      });
      return s;
    };

    h += bloque('1 · Nueva Emergencia', d.emergencia);
    h += bloque('2 · Nuevo Detalle Emergencia', d.detalle);
    // v1.36 (deuda portada de la app de referencia): recursos desplegados con su clase del
    // RUE (el backend ya la manda; faltaba pintarla). Solo si el reporte trae
    // vehículos con match en la flota.
    if (d.recursos && d.recursos.length) h += bloque('3 · Recursos desplegados (clase para el RUE)', d.recursos);
    document.getElementById('modalRUECuerpo').innerHTML = h;
  },

  _copiarCampoRUE(btn) {
    const txt = btn.getAttribute('data-copiar') || '';
    const listo = () => { const o = btn.textContent; btn.textContent = '✓ Copiado'; setTimeout(() => { btn.textContent = o; }, 1200); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(listo).catch(() => this.toast('No se pudo copiar', 'error'));
    } else {
      // Respaldo para WebView antiguo del APK, donde clipboard puede no existir.
      const ta = document.createElement('textarea');
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); listo(); } catch (e) { this.toast('No se pudo copiar', 'error'); }
      document.body.removeChild(ta);
    }
  },

  cerrarModalRUE() {
    document.getElementById('modalRUE').classList.remove('visible');
  },

  /* ═══════════ FLOTA DEL CUERPO ═══════════
     Antes los tres formularios que preguntan "qué vehículo" traían una lista fija
     con los vehículos de UNA estación. A cualquier otro cuerpo le quedaba mal:
     elegía entre máquinas que no tiene y no encontraba las suyas.
     Ahora la lista sale de la hoja `Vehiculos`, que cada cuerpo llena con SU
     indicativo ("Móvil 1", "M-3", como le digan en la radio) y la clase que
     entiende el RUE. Se cachea por sesión: se consulta al abrir el primer
     formulario, no en cada tecla. */
  async _cargarFlota(forzar) {
    if (this._flota && !forzar) return this._flota;
    try {
      const r = await fetch(_exigirBackend(), {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarVehiculos' })
      });
      const d = await r.json();
      if (d && d.ok && Array.isArray(d.vehiculos)) {
        this._flota = d.vehiculos;
        this._flotaError = false;
      } else {
        /* v1.37 (deuda portada de la app de referencia): el servidor respondió
           pero sin la lista — NO es lo mismo que "de verdad no hay vehículos".
           Antes esto se confundía con la flota vacía y "🚒 Vehículos del
           cuerpo" decía "Todavía no hay vehículos" aunque sí los hubiera. */
        this._flotaError = true;
        this._flota = this._flota || [];
      }
    } catch (e) {
      /* Sin señal NO se bloquea el registro de una emergencia: se devuelve vacío
         y el campo cae a texto libre. Hay cuerpos con zonas sin cobertura por
         días; una lista que no carga no puede impedir anotar lo que pasó. */
      this._flotaError = true;   // pero sí se distingue de "de verdad no hay" (ver arriba)
      this._flota = this._flota || [];
    }
    return this._flota;
  },

  /* Vehículos que se pueden elegir HOY: los de baja o fuera de servicio no se
     ofrecen (no tiene sentido despachar una máquina varada), pero SIGUEN en la
     hoja para que los reportes viejos que los nombran se entiendan. */
  /* v1.47 (PLAN-20260915-01): el PDF saca CLASE y PLACA del catálogo (hoja Vehiculos) por indicativo —
     dato maestro, no se vuelve a digitar en cada reporte. Cruce exacto y, si no, por prefijo
     ("Móvil 3 — máquina extintora" → "Móvil 3"; NO confunde Móvil 1 con Móvil 10 porque exige espacio
     tras el indicativo). Sin flota cargada (sin señal) devuelve null: el PDF nunca se bloquea. */
  _vehiculoDeRecurso(nombre) {
    const n = String(nombre || '').trim().toUpperCase();
    if (!n) return null;
    const flota = this._flota || [];
    const exacto = flota.find(v => String(v.indicativo || '').trim().toUpperCase() === n);
    if (exacto) return exacto;
    return flota.find(v => { const ind = String(v.indicativo || '').trim().toUpperCase(); return ind && n.indexOf(ind + ' ') === 0; }) || null;
  },

  _flotaDisponible() {
    return (this._flota || []).filter(v => v.estado !== 'DE BAJA' && v.estado !== 'FUERA DE SERVICIO');
  },

  /* Pinta un <select> con la flota. Si el cuerpo todavía no registró vehículos,
     NO deja el campo inservible: avisa dónde registrarlos y el llamador cae a
     texto libre. "Sin configurar" es un estado de primera clase, no un error. */
  _opcionesFlota(valorActual) {
    const lista = this._flotaDisponible();
    let html = '<option value="">Vehículo...</option>';
    lista.forEach(v => {
      const etiqueta = v.indicativo + (v.clase ? ' — ' + v.clase.toLowerCase() : '');
      const sel = (valorActual && valorActual === v.indicativo) ? ' selected' : '';
      html += '<option value="' + app._esc(v.indicativo) + '"' + sel + '>' + app._esc(etiqueta) + '</option>';
    });
    // Un vehículo de un reporte viejo que ya no está en la flota no se pierde.
    if (valorActual && !lista.some(v => v.indicativo === valorActual)) {
      html += '<option value="' + app._esc(valorActual) + '" selected>' + app._esc(valorActual) + ' (ya no está en la flota)</option>';
    }
    html += '<option value="__OTRO__">Otro (escribir)...</option>';
    return html;
  },

  _flotaVacia() { return !(this._flota && this._flota.length); },

  /* Modal para elegir UNA opción de una lista. No existía: había modales para
     pedir texto, contraseña y confirmar, pero no para elegir. I4: nada de
     prompt() nativo, que en el APK falla en silencio.
     Devuelve el valor elegido, o null si se cancela — igual que _pedirTexto, para
     que los llamadores usen el mismo `if (x === null) return;`. */
  _pedirOpcion(titulo, ayuda, opciones, valorActual) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.className = 'modal-js';
      const ops = (opciones || []).map(o =>
        '<option value="' + app._esc(o) + '"' + (o === valorActual ? ' selected' : '') + '>' + app._esc(o) + '</option>'
      ).join('');
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:340px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
        + '<div style="font-size:15px;font-weight:700;color:#333;margin-bottom:6px;text-align:center;">' + app._esc(titulo || '') + '</div>'
        + (ayuda ? '<div style="font-size:12px;color:#666;margin-bottom:12px;text-align:center;">' + app._esc(ayuda) + '</div>' : '')
        + '<select id="_opcSel" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:15px;margin-bottom:14px;">' + ops + '</select>'
        + '<div style="display:flex;gap:10px;">'
        + '<button id="_opcCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Cancelar</button>'
        + '<button id="_opcOk" style="flex:1;padding:12px;background:#1e8449;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Continuar</button>'
        + '</div></div>';
      document.body.appendChild(modal);
      const sel = modal.querySelector('#_opcSel');
      const fin = (v) => { try { app._cerrarModalJS(modal); } catch(e){} resolve(v); };
      modal.querySelector('#_opcCancel').onclick = () => fin(null);
      modal.querySelector('#_opcOk').onclick = () => fin(sel.value || '');
    });
  },

  /* ── Regla de sanciones (Panel de Admin) ── */


  /* La regla se explica en palabras, no con los nombres internos de los modos.
     Un comandante tiene que poder leer esto y reconocer (o no) la regla de sus
     estatutos; "PROGRESIVA, base 2, tope 32" no le dice nada. */

  /* ── Administración de la flota (Panel de Admin) ── */

  async cargarFlotaAdmin(btn) {
    await this._conBloqueo(btn, 'Cargando...', async () => {
      await this._cargarFlota(true);       // true = ignorar caché, el admin quiere ver lo actual
      this._renderFlotaAdmin();
    });
  },

  _renderFlotaAdmin() {
    const cont = document.getElementById('listaFlota');
    if (!cont) return;
    const lista = this._flota || [];
    if (!lista.length) {
      // v1.37: distingue "no se pudo cargar" de "de verdad no hay vehículos"
      // (ver _cargarFlota) — antes las dos se veían igual.
      cont.innerHTML = this._flotaError
        ? '<div style="color:#c00;font-size:12px;text-align:center;padding:10px;">⚠️ No se pudo cargar la flota. Revise su conexión y toque "🔄 Actualizar".</div>'
        : '<div style="color:#166534;font-size:12px;text-align:center;padding:10px;opacity:.8;">'
          + 'Todavía no hay vehículos. Agregue el primero para que aparezca al reportar.</div>';
      return;
    }
    // I5: todo texto libre pasa por _esc. I10: data-* en vez de meter el
    // indicativo dentro de la cadena del onclick (un apóstrofo lo rompería).
    cont.innerHTML = lista.map(v => {
      const fuera = v.estado === 'DE BAJA' || v.estado === 'FUERA DE SERVICIO';
      return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;background:#fff;border-radius:8px;margin-bottom:6px;'
        + (fuera ? 'opacity:.55;' : '') + '">'
        + '<div style="min-width:0;">'
        +   '<strong style="font-size:14px;">' + app._esc(v.indicativo) + '</strong>'
        +   (fuera ? ' <span style="font-size:10px;background:#fee2e2;color:#991b1b;padding:1px 5px;border-radius:4px;">' + app._esc(v.estado) + '</span>' : '')
        +   '<div style="font-size:11px;color:#666;">' + app._esc(v.clase || 'sin clase')
        +     (v.capacidad ? ' · ' + app._esc(v.capacidad) : '')
        +     (v.placa ? ' · ' + app._esc(v.placa) : '') + '</div>'
        + '</div>'
        + '<div style="display:flex;gap:4px;flex-shrink:0;">'
        +   '<button data-v="' + app._esc(v.indicativo) + '" onclick="app.agregarVehiculo(this.dataset.v)" title="Editar" style="background:none;border:none;font-size:16px;cursor:pointer;">&#9998;</button>'
        +   '<button data-v="' + app._esc(v.indicativo) + '" onclick="app.quitarVehiculo(this.dataset.v)" title="Eliminar" style="background:none;border:none;color:#c00;font-size:16px;cursor:pointer;">&#x2715;</button>'
        + '</div></div>';
    }).join('');
  },

  /* Alta y edición usan el mismo flujo: si llega un indicativo, se precargan sus
     datos. El backend decide por el indicativo si actualiza o agrega, así que no
     hace falta un "modo" aparte. */
  async agregarVehiculo(indicativoExistente) {
    const cat = await this._cargarCatalogos().catch(() => null);
    const clases = (cat && cat.clasesVehiculo) ? cat.clasesVehiculo.map(c => c.nombre) : ['OTRO'];
    const previo = (this._flota || []).find(v => v.indicativo === indicativoExistente) || {};

    const indicativo = await this._pedirTexto(
      '<div style="text-align:left;font-weight:400;font-size:13px;">Indicativo del vehículo<div style="font-size:11px;color:#666;margin-top:3px;">Como lo nombran en la radio: Móvil 1, M-3, Tanque 2…</div></div>',
      { placeholder: 'Móvil 1', maxlength: 40, boton: 'Siguiente', valor: previo.indicativo || '' });
    if (!indicativo || !indicativo.trim()) return;

    const clase = await this._pedirOpcion('Clase del vehículo',
      'Es lo que entiende el RUE. Si ninguna encaja, elija OTRO.', clases, previo.clase || '');
    if (clase === null) return;

    const capacidad = await this._pedirTexto(
      '<div style="text-align:left;font-weight:400;font-size:13px;">Capacidad (opcional)<div style="font-size:11px;color:#666;margin-top:3px;">Ej: 1.000 galones, 500 GPM. Sirve para el inventario de capacidades que pide la DNBC.</div></div>',
      { placeholder: 'Opcional', maxlength: 60, boton: 'Guardar', valor: previo.capacidad || '' });
    if (capacidad === null) return;

    const pw = await this._obtenerPwdAdmin('🔐 Contraseña de administrador');
    if (!pw) return;
    try {
      const r = await fetch(_exigirBackend(), {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'guardarVehiculo', indicativo: indicativo.trim(),
          clase: clase, capacidad: capacidad, placa: previo.placa || '',
          estado: previo.estado || 'DISPONIBLE',
          adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '' })
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || 'No se pudo guardar');
      this.toast('🚒 ' + d.mensaje, 'exito');
      await this._cargarFlota(true);
      this._renderFlotaAdmin();
    } catch (e) { this.toast('Error: ' + e.message, 'error'); }
  },

  quitarVehiculo(indicativo) {
    /* _confirmarAccion recibe un CALLBACK, no devuelve promesa. Se respeta su
       firma en vez de envolverla: es la que usa el resto del proyecto.
       Se avisa lo que NO hace: borrar un vehículo no reescribe los reportes
       viejos que lo nombran. Para una máquina dada de baja conviene más cambiarle
       el estado que borrarla, y eso hay que decirlo ANTES, no después. */
    this._confirmarAccion(
      '¿Eliminar ' + app._esc(indicativo) + '?<div style="font-weight:400;font-size:12px;color:#666;margin-top:8px;">Dejará de aparecer al reportar. Los reportes anteriores que lo nombran NO cambian.</div>',
      async () => {
        const pw = await this._obtenerPwdAdmin('🔐 Contraseña de administrador');
        if (!pw) return;
        try {
          const r = await fetch(_exigirBackend(), {
            method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ accion: 'eliminarVehiculo', indicativo: indicativo,
              adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '' })
          });
          const d = await r.json();
          if (!d.ok) throw new Error(d.error || 'No se pudo eliminar');
          this.toast(d.mensaje, 'exito');
          await this._cargarFlota(true);
          this._renderFlotaAdmin();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
      });
  },

  /* Llena un <select> ya existente en el HTML con la flota. Si el cuerpo todavía
     no registró vehículos, deja una opción que lo DICE en vez de un desplegable
     vacío que parece roto — y el campo de al lado sigue aceptando texto libre,
     así que nadie queda bloqueado por no haber configurado la flota. */
  poblarSelectFlota(idSelect, valorActual) {
    const sel = document.getElementById(idSelect);
    if (!sel) return;
    if (this._flotaVacia()) {
      sel.innerHTML = '<option value="">Sin vehículos registrados — agrégalos en el Panel</option>';
      return;
    }
    sel.innerHTML = this._opcionesFlota(valorActual);
  },

  async _cargarCatalogos() {
    if (this._catalogos) return this._catalogos;   // ya se trajeron esta sesión
    const r = await fetch(_exigirBackend(), {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ accion: 'obtenerCatalogos' })
    });
    const d = await r.json();
    if (!d || !d.ok) throw new Error('No se pudieron cargar los catálogos.');
    this._catalogos = d;

    const sel = document.getElementById('inst_departamento');
    if (sel && d.departamentos) {
      d.departamentos.forEach((dep) => {
        const o = document.createElement('option');
        o.value = dep; o.textContent = dep;   // textContent: nunca innerHTML con datos externos
        sel.appendChild(o);
      });
    }
    return d;
  },

  /* ═══ PERMISO SOBRE EL DRIVE DEL COMANDANTE ═══

     Devuelve un token de ACCESO (no el de identidad) con permiso para crear archivos.

     POR QUÉ HACE FALTA. El backend corre como quien publicó la app, así que todo lo que
     crea nace en el Drive de ESA cuenta. Se intentó arreglarlo transfiriendo la
     propiedad después, y Google lo rechazó con un 403 explícito:
     «Consent is required to transfer ownership of a file to another user» — la
     propiedad no se puede empujar, el destinatario tiene que aceptarla, y eso obliga a
     salir de la app a leer un correo.

     Con este token la hoja NACE siendo del comandante. No hay traspaso que rechazar.

     El permiso pedido es `drive.file`: la app solo alcanza los archivos que ella misma
     crea. Es el más angosto que sirve, y es literalmente lo que la pantalla promete.

     Se pide en el momento de instalar y no al iniciar sesión, a propósito: así el
     comandante ve la ventana de permisos cuando ya entiende para qué es —está creando
     la base de datos de su cuerpo— y no como un obstáculo antes de haber visto nada. */
  _pedirPermisoDrive() {
    return new Promise((resolve) => {
      try {
        if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
          return resolve({ ok: false, motivo: 'La librería de Google no cargó. Revise su conexión.' });
        }
        const cliente = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.file',
          callback: (resp) => {
            if (resp && resp.access_token) resolve({ ok: true, token: resp.access_token });
            else resolve({ ok: false, motivo: 'No se recibió el permiso.' });
          },
          error_callback: (e) => {
            /* El comandante puede cerrar la ventana. No es un error del sistema: es una
               decisión suya, y el mensaje tiene que decirle qué pasa si no lo da. */
            const t = (e && e.type) || '';
            resolve({ ok: false, motivo: t === 'popup_closed'
              ? 'Cerró la ventana de permisos.'
              : 'No se pudo pedir el permiso (' + t + ').' });
          }
        });
        cliente.requestAccessToken();
      } catch (e) { resolve({ ok: false, motivo: e.message }); }
    });
  },

  async instalarCuerpo(btn) {
    const err = document.getElementById('instError');
    const mostrarError = (m) => { err.textContent = m; err.style.display = 'block'; };
    err.style.display = 'none';

    const datos = {
      accion: 'configurarInstitucion',
      nombre: document.getElementById('inst_nombre').value.trim(),
      departamento: document.getElementById('inst_departamento').value.trim(),
      municipio: document.getElementById('inst_municipio').value.trim(),
      tipo: document.getElementById('inst_tipo').value,
      sigla: document.getElementById('inst_sigla').value.trim(),
      // Opcional: si queda vacío, los PDF simplemente no llevan lema — mejor eso
      // que llevar el de otra estación.
      lema: (document.getElementById('inst_lema') || {}).value ? document.getElementById('inst_lema').value.trim() : '',
      // Se manda la contraseña de administrador que el comandante acaba de definir.
      // El backend la escribe UNA sola vez, en la instalación inicial (ver configurarInstitucion).
      adminPassword: (document.getElementById('inst_pwd') || {}).value || ''
    };

    // Se valida acá para dar respuesta inmediata, pero el backend vuelve a validar:
    // el front nunca es la autoridad.
    if (datos.nombre.length < 5)   return mostrarError('Escriba el nombre completo del cuerpo de bomberos.');
    if (!datos.departamento)       return mostrarError('Falta el departamento.');
    if (!datos.municipio)          return mostrarError('Falta el municipio.');

    /* Contraseña de administrador. Se valida acá para dar respuesta inmediata; el
       backend la vuelve a exigir, que es donde manda. Se comprueba ANTES de tocar el
       servidor: hacer que el comandante espere una llamada de red para que le digan
       que escribió mal la confirmación es maltratarlo en el peor momento —
       el primer arranque. */
    const _p1 = (document.getElementById('inst_pwd') || {}).value || '';
    const _p2 = (document.getElementById('inst_pwd2') || {}).value || '';
    if (_p1.length < 6)  return mostrarError('La contraseña de administrador debe tener al menos 6 caracteres.');
    if (_p1 !== _p2)     return mostrarError('Las dos contraseñas no coinciden. Escríbalas de nuevo.');

    /* ═══ EL PERMISO SE PIDE ACÁ, ANTES DE TOCAR EL SERVIDOR ═══
       Si se pidiera después, una negativa dejaría el cuerpo a medio crear en el
       servidor y la hoja en el Drive equivocado. Primero el permiso; si no lo da,
       no se creó nada y puede volver a intentar. */
    const permiso = await this._pedirPermisoDrive();
    if (!permiso.ok) {
      return mostrarError(permiso.motivo + ' Sin ese permiso la base de datos de su cuerpo ' +
        'no puede crearse en SU Google Drive. Toque otra vez para reintentar.');
    }
    datos.driveToken = permiso.token;

    // I4: nada de confirm() nativo. El bloqueo anti-doble-click es obligatorio —
    // dos toques acá intentarían crear dos bases de datos.
    await this._conBloqueo(btn, 'Creando la base de datos...', async () => {
      try {
        const r = await fetch(_exigirBackend(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(datos)
        });
        const d = await r.json();
        if (!d || !d.ok) return mostrarError((d && d.error) || 'No se pudo crear la base de datos.');

        this._pintarInstitucion({
          nombre: datos.nombre, sigla: datos.sigla || '', municipio: datos.municipio,
          departamento: datos.departamento, tipo: datos.tipo
        });
        if (this.usuario) { this.usuario.esSuperAdmin = !!d.fundador; this.usuario.esAdminSrv = true; }

        this.toast('Base de datos creada. Ya puede empezar.', 'exito');
        this.actualizarUIUsuario();
        this.irA('pantallaHome');
        await this.actualizarHome();
      } catch (e) {
        mostrarError('No se pudo conectar con el servidor: ' + e.message);
      }
    });
  },

  _rotuloApp() {
    const s = this._inst().sigla;
    return (s ? s + ' ' : '') + 'Reportes';
  },

  /* Institución cacheada. Devuelve SIEMPRE un objeto, nunca null, para que los
     membretes puedan hacer `app._inst().nit` sin reventar en instalación nueva. */
  _inst() {
    try { return JSON.parse(localStorage.getItem('inst_cuerpo') || 'null') || {}; }
    catch (e) { return {}; }
  },

  _membrete() {
    const i = this._inst();
    if (!i.nit && !i.telefono && !i.direccion) return '';
    const partes = [];
    if (i.nit)       partes.push('NIT: ' + i.nit);
    if (i.telefono)  partes.push('Tel. ' + i.telefono);
    if (i.direccion) partes.push(i.direccion);
    return this._esc(partes.join('  |  '));
  },

  _municipioPorDefecto() {
    try {
      const i = JSON.parse(localStorage.getItem('inst_cuerpo') || 'null');
      return (i && i.municipio) ? String(i.municipio) : '';
    } catch (e) { return ''; }
  },

  _pintarInstitucion(inst) {
    if (inst && inst.nombre) {
      try { localStorage.setItem('inst_cuerpo', JSON.stringify(inst)); } catch (e) {}
    } else {
      try { inst = JSON.parse(localStorage.getItem('inst_cuerpo') || 'null'); } catch (e) { inst = null; }
    }
    if (!inst) return;

    const nombre = String(inst.nombre || '');
    const sigla  = String(inst.sigla || '');
    const rotulo = (sigla ? sigla + ' ' : '') + 'Reportes';

    // Textos marcados con data-inst="clave"
    document.querySelectorAll('[data-inst]').forEach((el) => {
      const k = el.getAttribute('data-inst');
      const v = (k === 'app') ? rotulo : String(inst[k] || '');
      if (v) el.textContent = v;
    });

    // Valores por defecto de formulario (ej. municipio del reporte).
    // Solo si el campo está vacío: nunca pisar lo que el bombero escribió.
    document.querySelectorAll('[data-inst-valor]').forEach((el) => {
      const k = el.getAttribute('data-inst-valor');
      if (!el.value && inst[k]) el.value = String(inst[k]);
    });

    const ponTexto = (id, txt) => { const e = document.getElementById(id); if (e) e.textContent = txt; };
    ponTexto('headerTitulo', rotulo);
    ponTexto('headerSubtitulo', nombre);
    ponTexto('loginTitulo', rotulo);
    ponTexto('loginCuerpo', nombre);

    document.title = nombre ? (rotulo + ' — ' + nombre) : rotulo;

    NOMBRE_ESTACION = sigla || nombre;
    if (inst.telefono) TELEFONO_ESTACION = String(inst.telefono);
  },

  // v6.07: `btn` opcional, mismo criterio que cargarEstadoPins — el botón
  // 🔄 Actualizar tiene que dar señal de que se tocó.
  async cargarAdministradores(btn) {
    const cont = document.getElementById('listaAdmins');
    if (!cont) return;
    if (btn) return this._conBloqueo(btn, 'Actualizando...', () => this.cargarAdministradores());
    cont.innerHTML = this._skeleton(3, 'linea');
    try {
      const resp = await fetch(URL_BACKEND, { method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({ accion:'listarAdministradores', adminEmail:this.usuario.email, adminPassword:this._adminPwdSession||'' }) });
      const d = await resp.json();
      if (!d.ok) { cont.innerHTML = '<div style="font-size:12px;color:#c00;padding:8px;">'+app._esc(d.error||'Error')+'</div>'; return; }
      if (d.usandoRespaldo) {
        // La hoja está vacía: la app corre con la lista del código. Hay que decirlo
        // o parecería que no hay administradores.
        cont.innerHTML = '<div style="font-size:11px;color:#92400e;background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;padding:8px;line-height:1.5;">'
          + 'Todavía no hay lista propia: la app está usando la lista de respaldo del código ('
          + (d.respaldo||[]).length + ' correos). En cuanto agregues el primer administrador, '
          + 'los de respaldo se copian solos y desde ahí gestionas todo desde acá.</div>';
        return;
      }
      cont.innerHTML = (d.administradores||[]).map(a => {
        const em = app._esc(a.email||'');
        const activo = a.estado !== 'INACTIVO';
        return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid #fecaca;'+(activo?'':'opacity:0.5;')+'">'
          + '<div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:#1f2937;word-break:break-all;">'+em
          + (a.esSuper ? ' <span style="font-size:9px;color:#991b1b;font-weight:700;">(TÚ — no se puede quitar)</span>' : '')
          + (activo ? '' : ' <span style="font-size:9px;color:#666;">(inactivo)</span>') + '</div>'
          + (a.nombre||a.cargo ? '<div style="font-size:10px;color:#94a3b8;">'+app._esc([a.nombre,a.cargo].filter(Boolean).join(' · '))+'</div>' : '')
          + '</div>'
          + (a.esSuper || !activo ? '' : '<button data-em="'+em+'" onclick="app.quitarAdmin(this, this.dataset.em)" style="padding:6px 10px;background:#991b1b;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:11px;">Quitar</button>')
          + '</div>';
      }).join('');
    } catch (e) {
      cont.innerHTML = '<div style="font-size:12px;color:#c00;padding:8px;">Error de red: '+app._esc(e.message||'')+'</div>';
    }
  },

  async agregarAdmin() {
    const em = await this._pedirTexto('📧 Correo del nuevo administrador<div style="font-size:11px;font-weight:400;color:#666;margin-top:6px;">Tiene que ser la cuenta de Google con la que va a entrar a la app.</div>',
      { tipo:'email', inputmode:'email', placeholder:'nombre@gmail.com', boton:'Agregar' });
    if (!em || !em.trim() || em.indexOf('@') < 1) { if (em !== null) this.toast('Correo inválido', 'error'); return; }
    try {
      const resp = await fetch(URL_BACKEND, { method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({ accion:'agregarAdministrador', email: em.trim(),
          adminEmail:this.usuario.email, adminPassword:this._adminPwdSession||'' }) });
      const d = await resp.json();
      if (!d.ok) { this.toast('Error: ' + (d.error||'?'), 'error'); return; }
      this.toast('🛡️ ' + (d.mensaje||'Administrador agregado'), 'exito');
      await this.cargarAdministradores();
    } catch (e) {
      this.toast('No llegó la confirmación. Revisando cómo quedó...', 'info');
      await this.cargarAdministradores();
    }
  },

  async quitarAdmin(btn, email) {
    const ok = await this.confirmar('Quitar administrador',
      `¿Quitarle el acceso de administrador a "${email}"? Va a poder seguir usando la app como bombero, pero no entrar al Panel.`);
    if (!ok) return;
    await this._conBloqueo(btn, 'Quitando...', async () => {
      try {
        const resp = await fetch(URL_BACKEND, { method:'POST',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify({ accion:'quitarAdministrador', email: email,
            adminEmail:this.usuario.email, adminPassword:this._adminPwdSession||'' }) });
        const d = await resp.json();
        if (!d.ok) { this.toast('Error: ' + (d.error||'?'), 'error'); return; }
        this.toast('🛡️ ' + (d.mensaje||'Quitado'), 'info');
        await this.cargarAdministradores();
      } catch (e) {
        this.toast('No llegó la confirmación. Revisando cómo quedó...', 'info');
        await this.cargarAdministradores();
      }
    });
  },

  /* ═══ v1.35: UNIDADES VINCULADAS — quién usa la app, y bloquear/desbloquear ═══
     Mismo patrón que Administradores (arriba): _conBloqueo anti-doble-click,
     app.confirmar() en vez de confirm() nativo (I4), data-* en vez de IDs
     escapados en el onclick (I10), _esc() en todo lo que viene del servidor (I5). */
  async cargarUnidadesVinculadas(btn) {
    const cont = document.getElementById('listaUnidadesVinculadas');
    if (!cont) return;
    if (btn) return this._conBloqueo(btn, 'Actualizando...', () => this.cargarUnidadesVinculadas());
    cont.innerHTML = this._skeleton(3, 'linea');
    try {
      const resp = await fetch(URL_BACKEND, { method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({ accion:'listarUnidadesVinculadas', adminEmail:this.usuario.email, adminPassword:this._adminPwdSession||'' }) });
      const d = await resp.json();
      if (!d.ok) { cont.innerHTML = '<div style="font-size:12px;color:#c00;padding:8px;">'+app._esc(d.error||'Error')+'</div>'; return; }
      if (!d.unidades || !d.unidades.length) {
        cont.innerHTML = '<div style="font-size:11px;color:#999;padding:8px;">Todavía no hay nadie vinculado a este cuerpo.</div>';
        return;
      }
      const miCorreo = String((this.usuario&&this.usuario.email)||'').toLowerCase().trim();
      cont.innerHTML = d.unidades.map(u => {
        const correoCrudo = String(u.correo||'').toLowerCase().trim();
        const correo = app._esc(u.correo||'');
        const nombre = app._esc(u.nombre||'');
        const visto = u.ultimoAcceso ? app._esc(new Date(u.ultimoAcceso).toLocaleString('es-CO', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})) : 'nunca entró';
        const bloqueada = !!u.bloqueado;
        let botones = '';
        if (u.esSuper) {
          botones = '<span style="font-size:9px;color:#991b1b;font-weight:700;">(TÚ — no se puede bloquear)</span>';
        } else if (correoCrudo === miCorreo) {
          botones = '<span style="font-size:9px;color:#666;">(no puede bloquearse a sí mismo)</span>';
        } else if (bloqueada) {
          botones = '<button data-co="'+correo+'" onclick="app.desbloquearUnidadApp(this, this.dataset.co)" style="padding:6px 10px;background:#166534;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:11px;">Desbloquear</button>';
        } else {
          botones = '<button data-co="'+correo+'" onclick="app.bloquearUnidadApp(this, this.dataset.co)" style="padding:6px 10px;background:#991b1b;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:11px;">Bloquear</button>';
        }
        return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid #fecaca;'+(bloqueada?'opacity:0.6;':'')+'">'
          + '<div style="flex:1;min-width:0;">'
          + '<div style="font-size:12px;font-weight:600;color:#1f2937;word-break:break-all;">'+(nombre||correo)
          + (u.esAdmin && !u.esSuper ? ' <span style="font-size:9px;color:#991b1b;font-weight:700;">(admin)</span>' : '')
          + (bloqueada ? ' <span style="font-size:9px;color:#991b1b;font-weight:700;">(bloqueada)</span>' : '') + '</div>'
          + (nombre ? '<div style="font-size:10px;color:#94a3b8;word-break:break-all;">'+correo+'</div>' : '')
          + '<div style="font-size:10px;color:#94a3b8;">Última vez: '+visto+'</div>'
          + '</div>' + botones + '</div>';
      }).join('');
    } catch (e) {
      cont.innerHTML = '<div style="font-size:12px;color:#c00;padding:8px;">Error de red: '+app._esc(e.message||'')+'</div>';
    }
  },

  async bloquearUnidadApp(btn, correo) {
    const ok = await this.confirmar('Bloquear acceso',
      `¿Bloquear el acceso a la app de "${correo}"? No podrá volver a entrar hasta que lo desbloquee. No borra sus datos ni lo saca de Personal.`);
    if (!ok) return;
    await this._conBloqueo(btn, 'Bloqueando...', async () => {
      try {
        const resp = await fetch(URL_BACKEND, { method:'POST',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify({ accion:'bloquearUnidad', correo: correo,
            adminEmail:this.usuario.email, adminPassword:this._adminPwdSession||'' }) });
        const d = await resp.json();
        if (!d.ok) { this.toast('Error: ' + (d.error||'?'), 'error'); return; }
        this.toast('🚫 ' + (d.mensaje||'Bloqueado'), 'info');
        await this.cargarUnidadesVinculadas();
      } catch (e) {
        this.toast('No llegó la confirmación. Revisando cómo quedó...', 'info');
        await this.cargarUnidadesVinculadas();
      }
    });
  },

  async desbloquearUnidadApp(btn, correo) {
    await this._conBloqueo(btn, 'Restaurando...', async () => {
      try {
        const resp = await fetch(URL_BACKEND, { method:'POST',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify({ accion:'desbloquearUnidad', correo: correo,
            adminEmail:this.usuario.email, adminPassword:this._adminPwdSession||'' }) });
        const d = await resp.json();
        if (!d.ok) { this.toast('Error: ' + (d.error||'?'), 'error'); return; }
        this.toast('✅ ' + (d.mensaje||'Restaurado'), 'exito');
        await this.cargarUnidadesVinculadas();
      } catch (e) {
        this.toast('No llegó la confirmación. Revisando cómo quedó...', 'info');
        await this.cargarUnidadesVinculadas();
      }
    });
  },

  /* Operador administrativo: alguien con acceso de admin que NO es unidad
     bomberil (la Secretaría General, por ejemplo). Va a una hoja aparte para que
     no aparezca en el llamado a lista de los domingos, ni en Operatividad, ni en
     el autocompletado de reportes: no es una unidad y no debe sumar horas. */
  async agregarOperadorAdministrativo() {
    const nombre = await this._pedirTexto('👤 Nombre completo<div style="font-size:11px;font-weight:400;color:#666;margin-top:6px;">Personal administrativo que NO es bombero pero necesita firmar lo que hace (Secretaría, Tesorería…).</div>',
      { placeholder:'Nombres y apellidos', boton:'Siguiente' });
    if (!nombre || !nombre.trim()) return;
    const ced = await this._pedirTexto('🪪 Cédula de ' + app._esc(nombre.trim()),
      { inputmode:'numeric', placeholder:'Solo números', boton:'Siguiente' });
    if (!ced || !ced.trim()) return;
    const cargo = await this._pedirTexto('💼 Cargo<div style="font-size:11px;font-weight:400;color:#666;margin-top:6px;">Para qué está autorizada esta persona. Se ve en el registro de auditoría.</div>',
      { placeholder:'Ej. SECRETARIA GENERAL', boton:'Agregar' });
    if (cargo === null) return;
    try {
      const resp = await fetch(URL_BACKEND, { method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({ accion:'agregarOperadorAdmin', nombre: nombre.trim(), cedula: ced.trim(),
          cargo: (cargo||'').trim(), adminEmail:this.usuario.email, adminPassword:this._adminPwdSession||'' }) });
      const d = await resp.json();
      if (!d.ok) { this.toast('Error: ' + (d.error||'?'), 'error'); return; }
      this.toast('✅ ' + (d.mensaje||'Agregado'), 'exito');
      await this.cargarEstadoPins();
    } catch (e) {
      this.toast('No llegó la confirmación. Revisando cómo quedó...', 'info');
      await this.cargarEstadoPins();
    }
  },

  /* ═══════ v6.02: GESTIÓN DE PIN DE LAS UNIDADES ═══════
     Solo muestra QUIÉN tiene PIN y quién no. El backend nunca devuelve un PIN ni
     su hash, así que desde acá no hay forma de averiguar el de nadie: se puede
     reemplazar, no leer. Los que NO tienen PIN salen primero, porque son los que
     todavía no pueden firmar. */
  // v6.07: `btn` es opcional. Cuando viene (lo manda el botón 🔄 Actualizar) se
  // usa _conBloqueo para que el botón muestre el spinner: hasta v6.06 tocarlo no
  // producía NINGUNA señal visible, porque desde v6.05 la lista ya venía cargada
  // al abrir el Panel. Se sentía muerto (lo reportó Jeferson).
  async cargarEstadoPins(btn) {
    const cont = document.getElementById('listaEstadoPins');
    if (!cont) return;
    const traer = async () => {
      cont.innerHTML = this._skeleton(4, 'linea');
      try {
        const resp = await fetch(URL_BACKEND, { method:'POST',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify({ accion:'listarEstadoPins', adminEmail:this.usuario.email, adminPassword:this._adminPwdSession||'' }) });
        const d = await resp.json();
        if (!d.ok) { this._pinsData = null; cont.innerHTML = '<div style="font-size:12px;color:#c00;padding:8px;">'+app._esc(d.error||'Error')+'</div>'; return; }
        if (!d.personal || !d.personal.length) { this._pinsData = null; cont.innerHTML = '<div style="font-size:12px;color:#999;padding:8px;">Sin personal activo.</div>'; return; }
        // Se guarda en memoria para poder filtrar SIN volver a pedirle al servidor:
        // con enlaces lentos cada consulta de más se paga en segundos de espera.
        this._pinsData = d;
        this._pintarEstadoPins();
      } catch (e) {
        this._pinsData = null;
        cont.innerHTML = '<div style="font-size:12px;color:#c00;padding:8px;">Error de red: '+app._esc(e.message||'')+'</div>';
      }
    };
    if (btn) await this._conBloqueo(btn, 'Actualizando...', traer);
    else await traer();
  },

  // v6.07: filtro del buscador de PINes. No toca la red, solo repinta.
  _filtrarPins(valor) {
    this._pinsFiltro = valor || '';
    this._pintarEstadoPins();
  },

  /* v6.07: pinta la lista de PINes desde this._pinsData.
     Separado de la descarga por tres motivos que reportó Jeferson:
     - El roster son ~36 unidades: sin tope de altura la caja medía ~1.400px y
       empujaba "Agregar operador administrativo" y toda la sección de
       Administradores tan abajo que parecían no existir. Ahora la lista tiene
       su propio scroll y el resto del Panel queda siempre a la vista.
     - Sin buscador había que barrer 36 filas a ojo para encontrar a alguien.
     - Las unidades SIN PIN van primero: son las únicas que exigen acción. */
  _pintarEstadoPins() {
    const cont = document.getElementById('listaEstadoPins');
    const d = this._pinsData;
    if (!cont || !d) return;
    const q = String(this._pinsFiltro || '').trim();
    const qNom = this._normNombre(q);
    const qCed = this._cedKey(q);
    const todas = (d.personal || []).slice().sort((a, b) => {
      if (!!a.tienePin !== !!b.tienePin) return a.tienePin ? 1 : -1;   // sin PIN primero
      return this._normNombre(a.nombre||'').localeCompare(this._normNombre(b.nombre||''));
    });
    const lista = !q ? todas : todas.filter(p =>
      this._normNombre(p.nombre||'').indexOf(qNom) !== -1 ||
      (qCed !== '' && this._cedKey(p.cedula||'').indexOf(qCed) !== -1));

    const filas = lista.map(p => {
      const ced = app._esc(p.cedula||'');
      const nom = app._esc(p.nombre||'(sin nombre)');
      const badge = p.tienePin
        ? '<span style="font-size:10px;color:#065f46;font-weight:700;">✅ con PIN' + (p.desde ? ' · ' + app._esc(p.desde) : '') + '</span>'
        : '<span style="font-size:10px;color:#b45309;font-weight:700;">⚠️ sin PIN</span>';
      return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid #e2e8f0;">'
        + '<div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:#1f2937;">'+nom+'</div>'
        // Contraste subido de #94a3b8 a #475569: la línea de la cédula era
        // casi ilegible bajo el sol.
        + '<div style="font-size:10px;color:#475569;">CC '+ced+' · '+badge+'</div></div>'
        + '<button data-c="'+ced+'" data-n="'+nom+'" onclick="app.asignarPinUnidad(this, this.dataset.c, this.dataset.n)" '
        + 'style="padding:6px 10px;background:'+(p.tienePin?'#64748b':'#b45309')+';color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:11px;white-space:nowrap;">'
        + (p.tienePin ? 'Cambiar' : 'Asignar') + '</button>'
        + '</div>';
    }).join('');

    const sinPin = todas.filter(p => !p.tienePin).length;
    cont.innerHTML =
        '<div style="font-size:11px;color:#475569;margin-bottom:8px;font-weight:600;">'
      + d.conPin + ' de ' + d.total + ' unidades ya tienen PIN'
      + (sinPin ? ' · <span style="color:#b45309;">faltan ' + sinPin + '</span>' : ' · <span style="color:#065f46;">todas al día</span>')
      + '</div>'
      + '<input type="text" id="_pinBuscar" oninput="app._filtrarPins(this.value)" '
      + 'placeholder="🔍 Buscar por nombre o cédula..." '
      + 'style="width:100%;box-sizing:border-box;padding:7px 10px;margin-bottom:8px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;">'
      // Tope de altura: la lista hace su propio scroll en vez de estirar la caja.
      + '<div style="max-height:290px;overflow-y:auto;-webkit-overflow-scrolling:touch;">'
      + (filas || '<div style="font-size:12px;color:#999;padding:10px 2px;">Nadie coincide con esa búsqueda.</div>')
      + '</div>';

    // Se repone el texto y el cursor: innerHTML destruyó el input que se estaba usando.
    const inp = document.getElementById('_pinBuscar');
    if (inp && q) { inp.value = q; inp.focus(); inp.setSelectionRange(q.length, q.length); }
  },

  async asignarPinUnidad(btn, cedula, nombre) {
    // El PIN va como texto normal, NO oculto: sos vos solo en tu pantalla y se lo
    // tenés que dictar a esa unidad. Con puntitos es fácil equivocarse y dictar mal.
    const pin = await this._pedirTexto('🔑 PIN de 4 dígitos para ' + app._esc(nombre) + '<div style="font-size:11px;font-weight:400;color:#666;margin-top:6px;">Anótalo: se lo tienes que decir a esa unidad. Si cancelas, no se cambia nada.</div>',
      { inputmode:'numeric', maxlength:4, centrado:true, placeholder:'0000', boton:'Guardar PIN' });
    if (pin === null) return;
    const p = String(pin || '').trim();
    if (!/^\d{4}$/.test(p)) { this.toast('El PIN son exactamente 4 dígitos', 'error'); return; }
    await this._conBloqueo(btn, 'Guardando...', async () => {
      try {
        const resp = await fetch(URL_BACKEND, { method:'POST',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify({ accion:'asignarPinOperador', cedula: cedula, pin: p,
            adminEmail:this.usuario.email, adminPassword:this._adminPwdSession||'' }) });
        const d = await resp.json();
        if (!d.ok) { this.toast('Error: ' + (d.error||'?'), 'error'); return; }
        this.toast('🔑 PIN asignado a ' + nombre + '. Dáselo a esa unidad.', 'exito');
        await this.cargarEstadoPins();
      } catch (e) {
        this.toast('No llegó la confirmación. Revisando cómo quedó...', 'info');
        await this.cargarEstadoPins();
      }
    });
  },

  /* ═══════ v6.00: BANDEJA DE ALTAS PENDIENTES AL ROSTER ═══════
     Cuando una actividad la registra alguien que NO es administrador, el
     personal nuevo que aparece ahí no puede entrar solo a la base (escribir en
     Personal es acción de admin desde v5.69, y así debe seguir). Hasta
     v5.93 esa alta simplemente se perdía en silencio: la persona quedaba
     "desconocida" para el autocompletado y para el aviso anti-typos, sin que
     nadie se enterara. Ahora el backend la deja en una bandeja y vos decidís.
     Esta sección es secundaria: si falla la red, se oculta y no rompe el Panel. */
  async cargarPersonalPendiente() {
    const wrap = document.getElementById('pendientesRosterWrap');
    const cont = document.getElementById('listaPendientesRoster');
    const titulo = document.getElementById('pendientesRosterTitulo');
    if (!wrap || !cont) return;
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'listarPersonalPendiente',
          adminEmail: this.usuario.email,
          adminPassword: this._adminPwdSession || ''
        })
      });
      const data = JSON.parse(await resp.text());
      const lista = (data && data.ok && Array.isArray(data.pendientes)) ? data.pendientes : [];
      if (!lista.length) { wrap.style.display = 'none'; cont.innerHTML = ''; return; }
      if (titulo) titulo.textContent = lista.length === 1
        ? '1 persona esperando alta'
        : lista.length + ' personas esperando alta';
      // I5: todo texto libre pasa por _esc. I10: los datos van en data-*, nunca
      // interpolados dentro del string del onclick (una cédula o un nombre con
      // comilla rompería el handler).
      cont.innerHTML = lista.map(p => {
        const nom = app._esc(p.nombre || '(sin nombre)');
        const ced = app._esc(p.cedula || '');
        const quien = p.registradoPor ? `<div style="font-size:10px;color:#92400e;margin-top:2px;">Lo registró: ${app._esc(p.registradoPor)}${p.fecha ? ' · ' + app._esc(p.fecha) : ''}</div>` : '';
        /* v6.01: enlace a la actividad donde apareció. Descartar NO borra la
           participación (queda en Personal_Actividad y por eso la persona sigue
           saliendo en Operatividad, marcada como "no cruza con la base"). Si el
           nombre estaba mal escrito o la persona no debía estar, hay que ir a la
           actividad y corregirla: este botón te lleva directo. */
        const verAct = p.idActividad ? `<button data-act="${app._esc(p.idActividad)}" onclick="app.verDetalleActividad(this.dataset.act)" style="width:100%;margin-top:6px;padding:7px;background:#fff;color:#92400e;border:1px solid #f59e0b;border-radius:6px;font-weight:600;cursor:pointer;font-size:12px;">📋 Ver la actividad donde apareció</button>` : '';
        return `
          <div style="background:#fff;border:1px solid #fcd34d;border-radius:8px;padding:10px;margin-bottom:8px;">
            <div style="font-weight:700;font-size:14px;color:#1f2937;">${nom}</div>
            <div style="font-size:12px;color:#555;">CC ${ced}${p.rango ? ' · ' + app._esc(p.rango) : ''}</div>
            ${quien}
            <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
              <button data-ced="${ced}" data-nom="${nom}"
                      onclick="app.aprobarPendienteRoster(this, this.dataset.ced, this.dataset.nom)"
                      style="flex:1;min-width:110px;padding:9px;background:#065f46;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px;">✅ Aprobar</button>
              <button data-ced="${ced}" data-nom="${nom}"
                      onclick="app.descartarPendienteRoster(this, this.dataset.ced, this.dataset.nom)"
                      style="flex:1;min-width:110px;padding:9px;background:#991b1b;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px;">🗑️ Descartar</button>
            </div>
            ${verAct}
          </div>`;
      }).join('');
      wrap.style.display = 'block';
      this._animarEntradaLista(cont);   // v1.41: las altas pendientes entran escalonadas
    } catch (e) {
      wrap.style.display = 'none';
    }
  },

  async aprobarPendienteRoster(btn, cedula, nombre) {
    await this._conBloqueo(btn, 'Aprobando...', async () => {
      try {
        const resp = await fetch(URL_BACKEND, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            accion: 'aprobarPersonalPendiente',
            adminEmail: this.usuario.email,
            adminPassword: this._adminPwdSession || '',
            cedula: cedula
          })
        });
        const data = JSON.parse(await resp.text());
        if (!data.ok) { this.toast('Error: ' + (data.error || '?'), 'error'); return; }
        this.toast('✅ ' + (data.mensaje || nombre + ' quedó en el roster'), 'exito');
        await this.cargarPersonalPendiente();
      } catch (e) {
        /* v6.01: la orden PUDO haber llegado igual. Con una red intermitente pasa:
           el backend ejecuta y la respuesta se corta en el camino, así que el
           teléfono muestra "Failed to fetch" sobre algo que sí funcionó. Antes
           eso te empujaba a apretar de nuevo. Ahora se recarga la bandeja y ves
           el estado REAL en vez de un error que miente. */
        this.toast('No llegó la confirmación. Revisando cómo quedó...', 'info');
        await this.cargarPersonalPendiente();
      }
    });
  },

  async descartarPendienteRoster(btn, cedula, nombre) {
    // I4: modal propio, nunca confirm() nativo (falla en silencio en el APK).
    const ok = await this.confirmar('Descartar del roster',
      `¿Descartar a "${nombre}"? No entrará a la base de personal. Si vuelve a salir en otra actividad, se anotará de nuevo.`);
    if (!ok) return;
    await this._conBloqueo(btn, 'Descartando...', async () => {
      try {
        const resp = await fetch(URL_BACKEND, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            accion: 'descartarPersonalPendiente',
            adminEmail: this.usuario.email,
            adminPassword: this._adminPwdSession || '',
            cedula: cedula
          })
        });
        const data = JSON.parse(await resp.text());
        if (!data.ok) { this.toast('Error: ' + (data.error || '?'), 'error'); return; }
        this.toast('🗑️ ' + (data.mensaje || nombre + ' descartado'), 'info');
        await this.cargarPersonalPendiente();
      } catch (e) {
        // v6.01: mismo caso que en aprobar — recargar en vez de mostrar un error
        // sobre una orden que el backend probablemente ya ejecutó.
        this.toast('No llegó la confirmación. Revisando cómo quedó...', 'info');
        await this.cargarPersonalPendiente();
      }
    });
  },

  async cargarReportesAdmin() {
    const cont = document.getElementById('listaReportesAdmin');
    if (!cont) return;
    cont.innerHTML = this._skeleton(4);
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'listarTodosReportes',
          adminEmail: this.usuario.email,
          adminPassword: this._adminPwdSession || '',
          pase: this._pase || ''             // v5.94: identidad firmada (ver obtenerReporteCompleto)
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
        cont.innerHTML = '<div style="padding:20px;color:#c00;">Error: ' + app._esc(data.error || 'desconocido') + '<br><br><small>Si dice "No autorizado", verifica que el backend tenga la versión nueva.</small></div>';
        return;
      }
      this._reportesAdmin = data.reportes || [];
      if (this._reportesAdmin.length === 0) {
        cont.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">El servidor respondió correctamente, pero no hay reportes registrados aún.</div>';
        return;
      }
      this.renderizarListaAdmin();
      this._animarEntradaLista(cont);   // v1.41: las tarjetas entran escalonadas al cargar (no al filtrar)
    } catch (e) {
      { const _d=document.createElement("div"); _d.style.cssText="padding:20px;color:#c00;"; _d.textContent="Error de red: "+(e.message||"")+". Verifica tu conexión."; cont.innerHTML=""; cont.appendChild(_d); }
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
      <div class="reporte-card" style="margin-bottom:10px;padding:12px;border-left:4px solid var(--rojo);background:#fff;border-radius:6px;">
        <div style="font-weight:bold;color:var(--rojo);font-size:15px;">${app._esc(r.consecutivo || '(sin consecutivo)')}</div>
        <div style="font-size:13px;color:#333;margin-top:2px;">${app._esc(r.direccion || 'Sin dirección')}</div>
        <div style="font-size:11px;color:#888;margin-top:4px;">
          ${r.operadorEmail || ''} · ${(r.clasificacion || []).join(', ') || 'Sin clasificar'}
        </div>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
          <button data-id="${app._esc(r.id)}" onclick="app.verReporteAdmin(this.dataset.id)"
                  style="flex:1;min-width:80px;padding:8px 6px;background:#065f46;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:12px;">
            👁️ Ver
          </button>
          <button data-id="${app._esc(r.id)}" onclick="app.editarReporteAdmin(this.dataset.id)"
                  style="flex:1;min-width:80px;padding:8px 6px;background:var(--rojo);color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:12px;">
            ✏️ Editar
          </button>
          <button data-id="${app._esc(r.id)}" onclick="app.imprimirReporteAdmin(this.dataset.id)"
                  style="flex:1;min-width:80px;padding:8px 6px;background:#1e40af;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:12px;">
            🖨️ Imprimir
          </button>
          <button data-id="${app._esc(r.id)}" data-consec="${app._esc(r.consecutivo || '')}" onclick="app.eliminarReporteAdmin(this.dataset.id, this.dataset.consec)"
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
    const ok = await this.confirmar(
      '⚠️ Eliminar reporte',
      `Consecutivo: ${consecutivo || '(sin consecutivo)'}. Se borrará la fila del Google Sheets y la subcarpeta de fotos/firmas en Drive. Esta acción NO se puede deshacer. ¿Continuar?`
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
          adminPassword: this._adminPwdSession || '',
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
    this._animarEntrada(document.getElementById('panelAdminViendo'));
    const cont = document.getElementById('panelAdminViendoContenido');
    cont.innerHTML = app._cargador('Cargando el reporte completo…');

    // Descargar reporte completo. v5.94: si la descarga falla (auth intermitente
    // o red caída) NO mostramos el stub pobre del mapa como si fuera
    // el reporte real — eso era el "reporte vacío" que confundía. Mostramos un
    // aviso claro con botón de reintento, sin dejar el detalle a medias.
    const rCompleto = await this._descargarReporteCompletoAdmin(idReporte);
    if (!rCompleto) {
      const _cid = String(idReporte).replace(/"/g, '&quot;');
      cont.innerHTML = '<div style="padding:24px;text-align:center;color:#c00;">'
        + '<div style="font-size:40px;">⚠️</div>'
        + '<div style="margin-top:8px;font-weight:700;">No se pudo cargar el reporte completo</div>'
        + '<div style="font-size:13px;color:#666;margin-top:6px;">Puede ser la conexión o que la sesión de administrador expiró. Intenta de nuevo.</div>'
        + '<button data-id="' + _cid + '" onclick="app.verReporteAdmin(this.dataset.id)" style="margin-top:14px;padding:10px 18px;background:#6e2fa0;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">🔄 Reintentar</button>'
        + '</div>';
      this._reporteAdminViendo = null;
      return;
    }
    const r = rCompleto;
    this._reporteAdminViendo = r;

    // Conectar el botón "Imprimir" del panel a este reporte
    const btnImpr = document.getElementById('btnImprimirDesdeVista');
    if (btnImpr) {
      btnImpr.onclick = () => this._imprimirReporteEnVentanaNueva(r);
    }

    // Renderizar contenido
    cont.innerHTML = this._renderDetalleReporteAdmin(r);

    // Cargar chips del personal que participó (asíncrono, no bloquea render)
    this._cargarBomberosBonifAdmin(r.id);
  },

  cerrarVistaAdmin() {
    document.getElementById('panelAdminViendo').style.display = 'none';
    document.getElementById('listaReportesAdminWrap').style.display = 'block';
    this._animarEntrada(document.getElementById('listaReportesAdminWrap'));
    this._reporteAdminViendo = null;
  },

  // Renderiza el HTML de detalle de un reporte (read-only) — incluye todas
  // las secciones del formulario más fotos clickeables (se abren a tamaño real).
  _renderDetalleReporteAdmin(r) {
    const fmt = (v) => (v === null || v === undefined || v === '') ? '<span style="color:#999;">—</span>' : app._esc(v);
    const fecha = (v) => {
      if (!v) return '—';
      try { return new Date(v).toLocaleString('es-CO'); } catch (e) { return String(v); }
    };
    const lista = (arr) => (arr && arr.length) ? arr.map(x => app._esc(x)).join(', ') : '—';

    const fotos = (r.fotos || []).map(u => this._imgDrive(u));
    const fotosHTML = fotos.length === 0
      ? '<div style="color:#999;font-style:italic;padding:8px;">Sin fotografías</div>'
      : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;">${
          fotos.map((url, i) => `
            <a href="${app._esc(url)}" target="_blank" style="display:block;border:1px solid #ccc;border-radius:6px;overflow:hidden;text-decoration:none;">
              <img src="${app._esc(url)}" alt="Foto ${i+1}"
                   style="width:100%;height:120px;object-fit:cover;background:#f0f0f0;display:block;"
                   onerror="this.style.display='none';this.parentNode.innerHTML+='<div style=&quot;padding:8px;color:#c00;font-size:11px;&quot;>No se pudo cargar la foto ${i+1}</div>';">
              <div style="padding:4px;font-size:11px;text-align:center;background:#f8f8f8;color:#333;">📷 Foto ${i+1}</div>
            </a>
          `).join('')
        }</div>`;

    const firmas = r.firmas || {};
    // Si el servidor devolvió URLs de Drive (firmaAfectadoURL / firmaComandanteURL), las usamos
    // cuando no hay base64 local (caso normal en admin: ve el reporte de otro bombero).
    const _srcFirmaAf  = firmas.afectado  || r.firmaAfectadoURL  || '';
    const _srcFirmaCmd = firmas.comandante || r.firmaComandanteURL || '';
    const renderFirma = (url, etiqueta) => {
      if (!url) return `<div style="color:#999;font-style:italic;">${etiqueta}: —</div>`;
      // v5.49: URL de Drive → convertir a imagen directa (thumbnail) y embeber.
      // Si falla, deja enlace de respaldo a Drive.
      const src = this._imgDrive(url);
      const esDrive = url.startsWith('http') && !url.startsWith('data:');
      return `<div style="border:1px solid #ccc;border-radius:6px;padding:6px;background:#fafafa;">
        <div style="font-size:11px;color:#666;margin-bottom:4px;">${etiqueta}</div>
        <a href="${app._esc(url)}" target="_blank">
          <img src="${app._esc(src)}" alt="${app._esc(etiqueta)}"
               style="max-width:100%;max-height:80px;background:white;border:1px solid #eee;"
               onerror="this.style.display='none';this.parentNode.innerHTML='${esDrive ? '✍️ Ver firma en Drive' : '—'}';">
        </a>
      </div>`;
    };

    const card = (titulo, contenidoHTML) => `
      <div style="background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:12px;margin-bottom:10px;">
        <h4 style="color:var(--rojo);margin:0 0 8px 0;font-size:14px;">${titulo}</h4>
        <div style="font-size:13px;color:#222;line-height:1.5;">${contenidoHTML}</div>
      </div>
    `;

    const fila = (label, valor) => `<div><strong>${label}:</strong> ${fmt(valor)}</div>`;

    return `
      <h3 style="color:var(--rojo);margin:0 0 12px 0;">📄 ${app._esc(r.consecutivo || '(sin consecutivo)')}</h3>
      <div style="font-size:12px;color:#666;margin-bottom:12px;">
        ID: <code>${app._esc(r.id)}</code> · Estación: ${fmt(r.estacion)}
      </div>

      ${card('🕐 Fechas y reportante', `
        ${fila('Creación', fecha(r.fechaCreacion))}
        ${fila('Llamada', fecha(r.fechaLlamada))}
        ${fila('Salida de la estación', fecha(r.fechaSalida))}
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
          ${renderFirma(_srcFirmaAf, 'Firma del afectado')}
          ${renderFirma(_srcFirmaCmd, 'Firma del comandante')}
        </div>
      `)}

      ${card('🧑‍🚒 Personal que participó en el incidente', `
        <div style="font-size:12px;color:#555;background:#f0f7ff;padding:8px;border-radius:4px;margin-bottom:10px;border:1px solid #b0cfe0;">
          Lista del personal registrado en la hoja <em>Personal_por_Incidente</em>
          para este reporte. Para agregar o quitar bomberos usa <strong>✏️ Editar</strong>.
        </div>
        <div id="adminBonifChips_${r.id}" style="min-height:36px;display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:#f8f8f8;border:1px solid #e5e5e5;border-radius:6px;">
          <span style="color:#888;font-style:italic;font-size:12px;">Cargando...</span>
        </div>
      `)}
    `;
  },

  // Carga la lista del personal registrado para un informe
  // y la pinta como chips dentro del contenedor adminBonifChips_<id>.
  async _cargarBomberosBonifAdmin(idReporte) {
    const cont = document.getElementById('adminBonifChips_' + idReporte);
    if (!cont) return;
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'listarPersonalIncidente',
          adminEmail: this.usuario.email,
          adminPassword: this._adminPwdSession || '',
          pase: this._pase || '',            // v5.94: identidad firmada (ver obtenerReporteCompleto)
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
        { const _sp=document.createElement("span"); _sp.style.cssText="color:#c00;font-size:12px;"; _sp.textContent=data.error||"Error"; cont.innerHTML=""; cont.appendChild(_sp); }
        return;
      }
      const bomberos = data.bomberos || [];
      if (bomberos.length === 0) {
        cont.innerHTML = '<span style="color:#888;font-style:italic;font-size:12px;">Sin bomberos registrados aún.</span>';
        return;
      }
      // Si NO existe el input de agregar, estamos en modo "Ver" → chips sin botón ×
      const esVistaReadOnly = !document.getElementById('adminBonifInput_' + idReporte);
      // Render chips
      cont.innerHTML = bomberos.map(nombre => {
        // v5.95 (I5+I10): _esc completo (antes solo comillas) y datos por data-*, no en el string del onclick.
        const btnQuitar = esVistaReadOnly ? '' : `
            <button data-id="${app._esc(idReporte)}" data-nombre="${app._esc(nombre)}"
                    onclick="app.quitarBomberoBonifAdmin(this, this.dataset.id, this.dataset.nombre)"
                    title="Quitar"
                    style="background:rgba(255,255,255,0.25);color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:14px;line-height:1;padding:0;display:inline-flex;align-items:center;justify-content:center;">×</button>`;
        return `
          <span style="display:inline-flex;align-items:center;gap:6px;background:#065f46;color:#fff;padding:5px ${esVistaReadOnly ? '10px' : '8px'} 5px 10px;border-radius:14px;font-size:12px;font-weight:600;">
            ${app._esc(nombre)}${btnQuitar}
          </span>
        `;
      }).join('') +
      `<span style="width:100%;font-size:11px;color:#666;margin-top:4px;">Total: ${bomberos.length} bombero(s)</span>`;
    } catch (e) {
      { const _sp=document.createElement("span"); _sp.style.cssText="color:#c00;font-size:12px;"; _sp.textContent="Error de red: "+(e.message||""); cont.innerHTML=""; cont.appendChild(_sp); }
    }
  },

  // Agrega UN bombero a la participación del informe
  async agregarPersonalIncidenteAdmin(btn, idReporte) {
    const inp = document.getElementById('adminBonifInput_' + idReporte);
    if (!inp) return;
    const nombre = (inp.value || '').trim();
    if (!nombre) { this.toast('Escribe un nombre', 'error'); return; }
    await this._conBloqueo(btn, 'Agregando...', async () => {
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'agregarPersonalIncidente',
          adminEmail: this.usuario.email,
          adminPassword: this._adminPwdSession || '',
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
    });
  },

  // Quita UN bombero específico de la participación del informe
  async quitarBomberoBonifAdmin(btn, idReporte, nombre) {
    const ok = await this.confirmar('Quitar bombero', `¿Quitar a "${nombre}" de la participación en este incidente?`);
    if (!ok) return;
    await this._conBloqueo(btn, 'Quitando...', async () => {
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'quitarPersonalIncidente',
          adminEmail: this.usuario.email,
          adminPassword: this._adminPwdSession || '',
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
    });
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

    // v5.67: Forzar modo manual para que el admin siempre pueda editar
    // coordenadas desde la sección 3, y leerFormulario() las capture.
    this.modoUbicacion = 'manual';
    this.actualizarUIGPS();

    // Cambiar UI a modo edición admin
    this._aplicarUIEdicionAdmin(true, r);

    this._cargarFlota();   // el editor también pinta el <select> de vehículos
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
        barra.style.cssText = 'position:sticky;bottom:0;left:0;right:0;background:var(--rojo);color:#fff;padding:10px 12px;display:flex;gap:8px;flex-wrap:wrap;z-index:50;box-shadow:0 -2px 8px rgba(0,0,0,0.25);';
        barra.innerHTML = `
          <div style="flex:1 1 100%;font-size:13px;font-weight:700;margin-bottom:4px;">
            🛡️ Editando como administrador — ${ app._esc((r && r.consecutivo) || '') }
          </div>
          <div style="flex:1 1 100%;margin-bottom:6px;font-size:11px;opacity:0.85;">
            📍 Para corregir coordenadas GPS, edítalas en la sección <strong>3 — Ubicación del Incidente</strong> arriba.
          </div>
          <button onclick="app.cancelarEdicionAdminCompleta()"
                  style="flex:1;min-width:120px;padding:10px;background:#444;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;">
            ← Cancelar
          </button>
          <button onclick="app.guardarEdicionAdminCompleta(this)"
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

  async cancelarEdicionAdminCompleta() {
    const ok = await this.confirmar('Cancelar edición', '¿Cancelar la edición? Los cambios no guardados se perderán.');
    if (!ok) return;
    this._modoEdicionAdmin = false;
    this._reporteAdminEditando = null;
    this._aplicarUIEdicionAdmin(false);
    // Volver al panel admin
    this.irA('pantallaPanelAdmin');
  },

  // Lee el formulario completo y envía editarReporte al backend con TODOS los campos
  // (incluye recursos, víctimas, organizaciones para regenerar hojas auxiliares)
  async guardarEdicionAdminCompleta(btn) {
    await this._conBloqueo(btn, 'Guardando...', async () => {
    // Toast en línea 1 para confirmar que el botón llega aquí
    this.toast('⏳ Preparando datos...', 'info');
    if (!this._modoEdicionAdmin) { this.toast('❌ No está en modo edición admin', 'error'); return; }
    const idOrig = this._reporteAdminOriginalId;
    if (!idOrig) { this.toast('❌ Falta ID del reporte', 'error'); return; }

    let r;
    try {
      r = this.leerFormulario();
    } catch (formErr) {
      this.toast('❌ Error al leer formulario: ' + formErr.message, 'error');
      console.error('leerFormulario error:', formErr);
      return;
    }

    // Aviso: las fotos NO se actualizan desde el editor admin
    // (las fotos del Sheet/Drive se mantienen intactas; este editor edita
    // solo campos de texto, datos numéricos y listas de recursos/víctimas).
    const fotosOriginal = (this._reporteAdminEditando.fotos || []).filter(Boolean);
    const fotosActual = (r.fotos || []).filter(Boolean);
    const fotosCambiadas =
      fotosOriginal.length !== fotosActual.length ||
      fotosActual.some((f, i) => f !== fotosOriginal[i]);
    if (fotosCambiadas) {
      const ok = await this.confirmar('⚠️ Cambios en las fotos detectados',
        'El editor admin NO sube fotos nuevas al servidor. Las fotos que ya tenía el reporte en Drive se mantienen igual. Si necesitas cambiar fotos, pídele al bombero original que abra el reporte desde su dispositivo (dentro de 24h) o elimínalo y créalo de nuevo. ¿Continuar y guardar el resto de cambios?'
      );
      if (!ok) return;
    }

    // Si cambió el consecutivo, hacer cambio aparte
    const consecForm = (document.getElementById('admin_consecutivo')?.value || r.consecutivo || '').trim();

    // Construir payload de cambios (todos los campos del reporte)
    const cambios = {
      fechaLlamada: r.fechaLlamada || '',
      fechaSalida: r.fechaSalida || '',
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

    // v5.67: GPS se lee de la sección 3 del formulario (r.gps), no de un campo separado.
    // leerFormulario() ya leyó f_lat_manual / f_lng_manual porque modoUbicacion='manual'.
    if (r.gps && !isNaN(r.gps.lat) && !isNaN(r.gps.lng)) {
      cambios.gpsCoordenadas = r.gps.lat + ', ' + r.gps.lng;
    }

    this.toast('⏳ Guardando cambios...', 'info');
    try {
      // 1) Campos planos + recursos/victimas/organizaciones
      let respText = '';
      try {
        const resp = await fetch(URL_BACKEND, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            accion: 'editarReporte',
            adminEmail: this.usuario.email,
            adminPassword: this._adminPwdSession || '',
            idReporte: idOrig,
            cambios: cambios,
            recursos: r.recursos || [],
            victimas: r.victimas || [],
            organizaciones: r.organizaciones || []
          })
        });
        respText = await resp.text();
      } catch (fetchErr) {
        this.toast('❌ Error de red: ' + fetchErr.message, 'error');
        return;
      }
      let data;
      try { data = JSON.parse(respText); }
      catch (parseErr) {
        this.toast('❌ Respuesta inesperada del servidor. Revise la consola.', 'error');
        console.error('Respuesta cruda:', respText);
        return;
      }
      if (!data.ok) {
        this.toast('❌ Error: ' + (data.error || 'sin detalle'), 'error');
        return;
      }

      // 2) Si cambió consecutivo
      const consecOrig = this._reporteAdminOriginalConsec || '';
      if (consecForm && consecForm !== consecOrig) {
        try {
          const respC = await fetch(URL_BACKEND, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              accion: 'cambiarConsecutivo',
              adminEmail: this.usuario.email,
              adminPassword: this._adminPwdSession || '',
              idReporte: idOrig,
              nuevoConsecutivo: consecForm
            })
          });
          const dataC = await respC.json();
          if (!dataC.ok) this.toast('Datos guardados, pero el consecutivo no cambió: ' + (dataC.error || '?'), 'error');
        } catch (e) { /* no bloquear por esto */ }
      }

      this.toast('✅ Reporte actualizado correctamente', 'exito');
      this._modoEdicionAdmin = false;
      this._reporteAdminEditando = null;
      this._aplicarUIEdicionAdmin(false);
      this.irA('pantallaPanelAdmin');
      try { await this.cargarReportesAdmin(); } catch (e) { /* lista se actualiza en próxima carga */ }
    } catch (e) {
      this.toast('❌ Error inesperado: ' + e.message, 'error');
    }
    });
  },

  cancelarEdicionAdmin() {
    document.getElementById('panelAdminEditando').style.display = 'none';
    document.getElementById('listaReportesAdminWrap').style.display = 'block';
    this._animarEntrada(document.getElementById('listaReportesAdminWrap'));
    this._reporteAdminEditando = null;
  },

  async guardarEdicionAdmin(btn) {
    const r = this._reporteAdminEditando;
    if (!r) return;
    await this._conBloqueo(btn, 'Guardando...', async () => {
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
            adminPassword: this._adminPwdSession || '',
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
          adminPassword: this._adminPwdSession || '',
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
    });
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
          adminPassword: this._adminPwdSession || '',
          pase: this._pase || '',            // v5.94: identidad firmada — sin esto el backend rechaza cuando EXIGIR_TOKEN está estricto o el candado anti-fuerza-bruta está activo
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
  // ── v5.49 FIX IMPRESIÓN ──────────────────────────────────────────────────
  // Las fotos/firmas guardadas en el servidor son URLs de PÁGINA de Drive
  // (drive.google.com/file/d/ID/view). Eso no se puede pintar en <img>.
  // Esta función las convierte a URL de imagen directa. Las fotos locales
  // (base64 data:) pasan sin tocar. Repara también reportes viejos.
  _imgDrive(url) {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('data:')) return url;            // base64 local: intacta
    let id = '';
    let m = url.match(/drive\.google\.com\/file\/d\/([\w-]{10,})/);
    if (m) id = m[1];
    if (!id) { m = url.match(/[?&]id=([\w-]{10,})/); if (m) id = m[1]; }
    if (!id) return url;                                 // otra URL: intacta
    return 'https://drive.google.com/thumbnail?id=' + id + '&sz=w1600';
  },

  // El logo que va en los PDF: el escudo que subió el cuerpo (Panel Admin);
  // si no subió ninguno, la cruz de bombero por defecto. LOGO_BIG solo existe
  // en la estación de origen (vive en su logos.js); acá nace indefinido, por eso
  // el escudo manda y la cruz roja es el respaldo. Es una data-URL: se embebe
  // directo en <img> y en la marca de agua sin llamar a la red.
  _logoImpresion() {
    return (this._inst().escudoUrl || '')
        || ((typeof LOGO_BIG !== 'undefined') ? LOGO_BIG : '')
        || this._CRUZ_ROJA;
  },

  // Espera a que TODAS las imágenes de la ventana de impresión carguen
  // (máximo 10 s, pensado para enlaces lentos) antes de imprimir.
  _imprimirCuandoCarguenImagenes(ventana, maxMs) {
    const imgs = Array.from(ventana.document.images || []);
    const esperas = imgs.map(img => new Promise(res => {
      if (img.complete) return res();
      img.onload = () => res();
      img.onerror = () => res(); // no colgar si una foto falla
    }));
    const tope = new Promise(res => setTimeout(res, maxMs || 10000));
    Promise.race([Promise.all(esperas), tope]).then(() => {
      setTimeout(() => { try { ventana.focus(); ventana.print(); } catch (e) { console.warn(e); } }, 300);
    });
  },

  async _imprimirReporteEnVentanaNueva(r) {
    try {
      const html = this.generarHTMLImpresion(r);
      // Seguridad: cortamos el enlace ventana.opener → esta pestaña de impresión
      // (que solo escribe HTML propio, ya escapado con _esc) no puede tocar la app
      // viva aunque algún dato lograra ejecutarse. OJO: NO usar 'noopener' en el 3er
      // argumento de window.open — en Chrome/Chrome-móvil eso hace que devuelva null
      // y la pestaña sale EN BLANCO. Nulamos opener a mano: misma protección, con handle.
      const ventana = window.open('', '_blank', 'width=900,height=1200');
      if (!ventana) {
        this.toast('El navegador bloqueó la ventana emergente. Permita pop-ups e intente de nuevo.', 'error');
        return;
      }
      try { ventana.opener = null; } catch (e) {}
      ventana.document.open();
      ventana.document.write(html);
      ventana.document.close();
      // v5.49: esperar a que carguen fotos/firmas (antes imprimía a los 800ms y salían en blanco)
      this._imprimirCuandoCarguenImagenes(ventana, 10000);
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

  async reintentarEnvio(btn) {
    if (!this.reporteActual) return;
    if (!navigator.onLine) { this.toast('Sin conexión', 'error'); return; }
    // v5.84: bloqueo anti doble-toque + spinner "Enviando..." — antes el botón
    // no daba señal de vida y cada toque extra disparaba OTRO envío paralelo
    // del mismo reporte (origen de los duplicados).
    await this._conBloqueo(btn, 'Enviando...', async () => {
      const ok = await this.sincronizarReporte(this.reporteActual);
      this.toast(ok ? '✅ Reporte enviado' : 'No se pudo enviar. Sigue pendiente y se reintentará al volver la señal.', ok ? 'exito' : 'error');
      if (ok) this.verDetalle(this.reporteActual.id);
    });
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
      `<img src="${app._esc(f)}" style="width:100%; max-width:200px; border-radius: 8px; margin: 4px;">`
    ).join('');

    const recursosHTML = (r.recursos || []).map(rec => {
      const personalStr = (rec.personal && rec.personal.length)
        ? `<br><small>👥 ${app._esc(rec.personal.join(', '))}</small>` : '';
      const cantStr = rec.cantidad && String(rec.cantidad) !== '1' ? ` (x${app._esc(rec.cantidad)})` : '';
      return `<li><strong>${app._esc(rec.recurso)}</strong>${cantStr} ${rec.codigo ? '— ' + app._esc(rec.codigo) : ''} ${rec.responsable ? '— ' + app._esc(rec.responsable) : ''}${personalStr}</li>`;
    }).join('');

    cont.innerHTML = `
      <div class="config-card">
        <h3>${this._esc(r.consecutivo || 'Sin consecutivo')}</h3>
        <p style="font-size: 12px; color: var(--gris-texto); margin-bottom: 12px;">
          <span class="badge ${this._esc(r.estado)}">${this.etiquetaEstado(r.estado)}</span>
          ${fecha}
        </p>
        <p><strong>Tipo:</strong> ${app._esc(tipos)}</p>
        <p><strong>Dirección:</strong> ${app._esc(r.direccion || '—')}</p>
        <p><strong>Barrio:</strong> ${app._esc(r.barrio || '—')}</p>
        ${r.gps ? `<p><strong>GPS:</strong> ${r.gps.lat.toFixed(6)}, ${r.gps.lng.toFixed(6)} ${r.gpsManual ? '(manual)' : ''}</p>` : ''}
        <p><strong>Narrativa:</strong> ${app._esc(r.narrativa || '—')}</p>
        ${r.operador ? `<p style="font-size:12px; color: var(--gris-texto); margin-top:8px;"><strong>Reporte realizado por:</strong> ${app._esc(r.operador)} ${r.operadorGrado ? '(' + app._esc(r.operadorGrado) + ')' : ''}</p>` : ''}
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
        <p>${app._esc(r.comandanteNombre || '—')} ${r.comandanteGrado ? `(${app._esc(r.comandanteGrado)})` : ''}</p>
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
    // Los borradores siempre son editables (la restricción aplica solo a reportes enviados)
    if (r.estado === 'borrador') return { permitido: true, razon: 'borrador' };
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
    // Marcar que esta sesión del formulario es una EDICIÓN de un reporte
    // que ya está en el servidor, para que al pulsar "Enviar" el cliente
    // mande _actualizar:true (en lugar de pedir nuevo consecutivo).
    this._esEdicionReporteExistente = true;
    this._idReporteEditandoBombero = this.reporteActual.id;
    this._consecutivoOriginalBombero = this.reporteActual.consecutivo || '';

    this.cargarEnFormulario(this.reporteActual);
    this.fotosTemp = [...(this.reporteActual.fotos || []), null, null, null, null, null, null].slice(0, 6);
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

    // opener nulo, NO 'noopener' — ver nota en _imprimirReporteEnVentanaNueva.
    const ventana = window.open('', '_blank', 'width=900,height=1200');
    if (!ventana) {
      this.toast('Bloqueador de ventanas activo. Permita ventanas emergentes.', 'error');
      return;
    }
    try { ventana.opener = null; } catch (e) {}
    ventana.document.write(html);
    ventana.document.close();
    // v5.49: esperar a que carguen fotos/firmas antes de imprimir (antes: 500ms fijos)
    this._imprimirCuandoCarguenImagenes(ventana, 10000);
  },

  generarHTMLImpresion(r) {
    const fecha = (s) => s ? new Date(s).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : '';
    const sn = (v) => v ? app._esc(v) : '_____________';
    const checkbox = (chk) => chk ? '☒' : '☐';
    const isClasif = (t) => (r.clasificacion || []).includes(t);
    const isCausa = (c) => (r.causas || []).includes(c);

    // v5.86 (BUG seguridad — I5): estos campos son texto libre del formulario
    // (recurso/responsable/víctima…) y este HTML se inyecta con
    // ventana.document.write() en una pestaña del MISMO origen que la app
    // (window.open sin noopener) — sin _esc(), un nombre con <script> o
    // <img onerror=...> se ejecutaba con acceso a window.opener (la app viva).
    const recursosFilas = (r.recursos || []).map(rec => {
      const veh = app._vehiculoDeRecurso(rec.recurso);
      return `
      <tr>
        <td>${app._esc(rec.recurso || '')}</td>
        <td>${app._esc((veh && veh.clase) || '')}</td>
        <td style="text-align:center;">${app._esc((veh && veh.placa) || rec.codigo || '')}</td>
        <td>${app._esc(rec.responsable || '')}${rec.personal && rec.personal.length ? '<br><small>' + app._esc(rec.personal.join(', ')) + '</small>' : ''}</td>
      </tr>`;
    }).join('');

    const _resPdf = this.resumenPersonalDeReporte(r);
    const _totalPersPdf = (typeof r.totalPersonal === 'number') ? r.totalPersonal : _resPdf.total;
    const _comandantePdf = r.comandanteIncidente || _resPdf.comandante || '';

    const victimasFilas = (r.victimas || []).map(v => `
      <tr>
        <td>${app._esc(v.nombre || '')} ${v.edad ? '/ ' + app._esc(v.edad) : ''}</td>
        <td>${app._esc(v.tipo || '')}</td>
        <td>${app._esc(v.lesiones || '')}</td>
        <td>${app._esc(v.atencion || '')}</td>
        <td>${app._esc(v.traslado || '')}</td>
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

    const fotos = (r.fotos || []).map(u => this._imgDrive(u));
    const tieneFotos = fotos.length > 0;

    // Genera una hoja de anexo con 3 fotos (indiceInicio..indiceInicio+2)
    const construirHojaFotos = (indiceInicio, etiquetaHoja, totalHojas) => {
      const slotsFotos = [];
      for (let i = indiceInicio; i < indiceInicio + 3; i++) {
        if (fotos[i]) {
          slotsFotos.push(`
            <div class="foto-grande">
              <img src="${app._esc(fotos[i])}" alt="Foto ${i+1}">
              <div class="foto-pie">Fotografía ${i+1}</div>
            </div>
          `);
        }
        // slot vacío: no se agrega cuadro si no hay foto
      }
      return `
        <div class="pagina pagina-fotos">
          <div class="header-mini">
            <img src="${app._logoImpresion()}" alt="">
            <div>
              <strong>CUERPO DE BOMBEROS VOLUNTARIOS</strong><br>
              <span style="font-size: 9pt;">Anexo fotográfico — Reporte ${app._esc(r.consecutivo || '')} — Hoja ${etiquetaHoja}/${totalHojas}</span>
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
<title>${app._esc(r.consecutivo || '')}</title>
<style>
  :root { --logo-watermark: url("${app._logoImpresion()}"); }
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
    background: #fff;
    width: 100%;
    height: 82mm;
    display: flex; flex-direction: column;
    overflow: hidden;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .foto-grande img {
    width: 100%;
    height: calc(82mm - 6mm);
    object-fit: contain;        /* foto completa, sin recortar */
    object-position: center;
    background: #fff;
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
    <img class="logo-h" src="${app._logoImpresion()}" alt="">
    <div class="info">
      <h2>CUERPO DE BOMBEROS VOLUNTARIOS</h2>
      <div>${app._esc((app._inst().municipio||"")+(app._inst().departamento?" - "+app._inst().departamento:""))}</div>
      <div>${app._esc(app._inst().personeria||"")}</div>
      <div>${app._membrete()}</div>
    </div>
    <div class="invisible"></div>
  </div>

  <div class="titulo">REPORTE OFICIAL DE EMERGENCIAS</div>
  <div class="lema">${app._esc(app._inst().lema || '')}</div>

  <div class="seccion">
    <div class="seccion-titulo">1. DATOS GENERALES DEL INCIDENTE</div>
    <table class="tabla-datos">
      <tr>
        <td class="label">N° DE REPORTE / RADICADO:</td><td>${sn(r.consecutivo)}</td>
        <td class="label">ESTACIÓN QUE ATIENDE:</td><td>${sn(r.estacion || NOMBRE_ESTACION)}</td>
      </tr>
      <tr>
        <td class="label">FECHA Y HORA DE LLAMADA:</td><td>${sn(fecha(r.fechaLlamada))}</td>
        <td class="label">FECHA/HORA DE SALIDA:</td><td>${sn(fecha(r.fechaSalida))}</td>
      </tr>
      <tr>
        <td class="label">FECHA/HORA DE LLEGADA:</td><td>${sn(fecha(r.fechaLlegada))}</td>
        <td class="label">FECHA/HORA DE CIERRE:</td><td>${sn(fecha(r.fechaCierre))}</td>
      </tr>
      <tr>
        <td class="label">TURNO / GUARDIA:</td><td>${sn(r.turno)}</td>
        <td class="label"></td><td></td>
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
    ${r.clasificacionOtra ? `<div style="font-size:8pt; padding: 2px;"><strong>Otra:</strong> ${app._esc(r.clasificacionOtra)}</div>` : ''}
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
        <td class="label" style="width:28%;">RECURSO</td>
        <td class="label" style="width:24%;">CLASE (catálogo)</td>
        <td class="label" style="width:14%;">PLACA</td>
        <td class="label" style="width:34%;">RESPONSABLE / TRIPULACIÓN</td>
      </tr>
      ${recursosFilas || filaVacia + filaVacia + filaVacia}
    </table>
    <table class="tabla-datos" style="margin-top:4px;">
      <tr>
        <td class="label" style="width:35%;">COMANDANTE DE INCIDENTE:</td>
        <td>${_comandantePdf ? app._esc(_comandantePdf) : '_____________'}</td>
        <td class="label" style="width:22%;">TOTAL DE PERSONAL:</td>
        <td style="text-align:center; font-weight:bold;">${_totalPersPdf}</td>
      </tr>
      <tr>
        <td class="label">OBSERVACIONES DE MANDO:</td>
        <td colspan="3">${sn(r.observacionesMando)}</td>
      </tr>
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
        <td>${r.firmas?.afectado ? `<img src="${app._esc(this._imgDrive(r.firmas.afectado))}" class="firma-img">` : '&nbsp;'}</td>
      </tr>
    </table>
    <div class="aviso">⚠ Aviso Ley 1581 de 2012 (Habeas Data): Los datos personales recolectados serán tratados exclusivamente para la gestión y estadística de emergencias del ${app._esc(app._inst().nombre || 'cuerpo de bomberos')}, conforme a la Ley 1575 de 2012. El titular puede conocer, actualizar y rectificar sus datos ante ${app._esc(app._inst().nombre || 'el cuerpo de bomberos')}.</div>
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
          ${r.firmas?.comandante ? `<img src="${app._esc(this._imgDrive(r.firmas.comandante))}" class="firma-img" style="max-height: 55px;">` : '&nbsp;'}
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
    ${app._esc(app._inst().nombre || "")}${app._membrete() ? " | " + app._membrete() : ""}
    <span class="credito">— App desarrollada por ${CREDITO_AUTOR.nombre} —</span>
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
    a.download = `respaldo_${(app._inst().sigla || 'bomberos').toLowerCase().replace(/[^a-z0-9]+/g,'_')}_${new Date().toISOString().slice(0,10)}.json`;
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

  // v5.64 (BUG 3): pill breve arriba de la pantalla con el verbo de la acción
  // (Abriendo/Cerrando...). No bloquea nada — es solo la señal visual de que
  // el botón respondió al toque. No pisa el toast (que es para éxito/error).
  // ── Escape HTML (anti-XSS) ─────────────────────────────────────────────────
  // Texto libre (tema, lugar, novedades, narrativa, descripción, observación…)
  // se inyecta con innerHTML en muchas vistas. Sin escapar, un texto con < > & "
  // rompe el HTML o podría ejecutar código. Este helper lo neutraliza.
  _esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  /* 14/08/2026 — _normNombre y _cedKey SE MUDARON ACÁ, junto a _esc.

     Vivían dentro del bloque de "Asistencia de domingos", que es exclusivo de
     de la estación de origen y salió del producto. Pero las usan poblarRosterBomberos y el buscador
     de personal: borrar el bloque con ellas adentro rompía el autocompletado de
     personal en toda la app.

     Son el par del backend (_normFuerteBackend / _cedKey) y definen cómo se decide
     que dos registros son LA MISMA PERSONA. Es el invariante que más ha reincidido
     en este proyecto — comparar cédulas en crudo. Viven en zona de utilidades para
     que ningún borrado futuro se las lleve. */

  // Normaliza un nombre igual que el backend (_normFuerteBackend): mayúsculas,
  // espacios colapsados y sin tildes/Ñ → para comparar personas de forma fiable.
  _normNombre(s) {
    return String(s || '').trim().toUpperCase().replace(/\s+/g, ' ')
      .replace(/[ÁÀÄÂ]/g, 'A').replace(/[ÉÈËÊ]/g, 'E').replace(/[ÍÌÏÎ]/g, 'I')
      .replace(/[ÓÒÖÔ]/g, 'O').replace(/[ÚÙÜÛ]/g, 'U').replace(/Ñ/g, 'N');
  },

  // Equivalente front de _cedKey del backend: cédula a SOLO dígitos, para que
  // "1.234.567", "1 234 567" y "1234567" crucen como la misma persona.
  _cedKey(x) {
    return String(x == null ? '' : x).replace(/\D/g, '');
  },

  // ── Decodificar el payload de un JWT de Google (APK-safe) ──────────────────
  // atob() solo entiende base64 estándar y devuelve bytes Latin1. Los JWT usan
  // base64url (- _) y los nombres traen tildes/Ñ (UTF-8). Sin esto, un nombre
  // como "MUÑOZ" salía con símbolos raros y, si el token traía - o _, el login
  // fallaba entero. Aquí convertimos base64url→base64 y decodificamos UTF-8.
  _decodificarJWT(token) {
    try {
      const parte = String(token).split('.')[1] || '';
      let b64 = parte.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const bin = atob(b64);
      let json;
      if (typeof TextDecoder !== 'undefined') {
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        json = new TextDecoder('utf-8').decode(bytes);
      } else {
        json = decodeURIComponent(bin.split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      }
      return JSON.parse(json);
    } catch (e) {
      // Último recurso: método anterior (no romper el login si algo raro pasa)
      return JSON.parse(atob(String(token).split('.')[1]));
    }
  },

  /* v6.05: silueta animada de carga, pintada DESDE EL JS.
     Bug reportado por Jeferson ("las animaciones de carga no funcionan en el
     panel de admin"). Hasta v6.04 las siluetas existían SOLO como HTML estático
     en index.html y para 3 listas; el propio JS las borraba al escribir
     "Cargando...", así que la animación se veía una sola vez —en el primer
     pintado— y nunca más. En el Panel de Administrador no existía en absoluto.
     Las clases .skeleton-* ya respetan "reducir movimiento" por CSS. */
  _skeleton(n, tipo) {
    const clase = (tipo === 'linea') ? 'skeleton-linea' : 'skeleton-tarjeta';
    const cuantas = Math.max(1, n || 3);
    let html = '<div aria-busy="true" aria-label="Cargando">';
    for (let i = 0; i < cuantas; i++) html += '<div class="' + clase + '"></div>';
    return html + '</div>';
  },

  /* v6.08: velo de cierre — la "animación de cerrando" que nunca existió.
     Se dispara SOLO al volver atrás (desde irA, junto a la píldora).

     El `void el.offsetWidth` NO es adorno: fuerza un reflow para reiniciar
     la animación CSS. Sin eso, dos "volver" seguidos no la re-disparan —
     el navegador ve que la clase ya estaba y no reproduce nada. Ese es
     justo el "a veces no funciona" que costaría diagnosticar después.

     Es puramente visual: si el elemento no existe, se sale sin romper nada
     (misma defensa que _flashAccion). */
  _veloCierre() {
    const el = document.getElementById('veloCierre');
    if (!el) return;
    clearTimeout(this._veloTimer);
    el.classList.remove('activo');
    void el.offsetWidth;
    el.classList.add('activo');
    this._veloTimer = setTimeout(() => el.classList.remove('activo'), 320);
  },

  /* Anima la entrada de CUALQUIER contenedor, sin depender de .pantalla. Es lo
     que faltaba para que el Panel de Admin animara: sus sub-vistas se conmutan
     con style.display dentro de una pantalla que YA está activa, así que
     appFadeIn (atada a .pantalla.activa) no se re-disparaba jamás.
     El void offsetWidth NO es adorno: fuerza el reflow que reinicia la
     animación. Mismo patrón que _veloCierre acá arriba. */
  _animarEntrada(el) {
    if (!el) return;
    el.classList.remove('entra');
    void el.offsetWidth;
    el.classList.add('entra');
  },

  _flashAccion(texto) {
    const el = document.getElementById('navFeedback');
    if (!el) return;
    clearTimeout(this._navFeedbackTimer);
    el.textContent = texto;
    el.classList.add('visible');
    // v6.07: era 500ms, pero 150 se van en el fade de entrada y 150 en el de
    // salida → quedaban ~200ms a opacidad plena. Jeferson reportó no verla nunca.
    // 900ms deja ~600ms legibles, que sigue siendo un parpadeo pero se percibe.
    this._navFeedbackTimer = setTimeout(() => el.classList.remove('visible'), 900);
  },

  confirmar(titulo, mensaje) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensaje').textContent = mensaje;
    const _mc = document.getElementById('modalConfirmar');
    // v1.39: si venía cerrándose (fade en curso), cancelarlo para que no se oculte
    // encima del modal nuevo que estamos abriendo.
    if (_mc._tCerrar) { clearTimeout(_mc._tCerrar); _mc._tCerrar = null; }
    _mc.classList.remove('cerrando');
    _mc.classList.add('visible');
    const btnConfirmar = document.getElementById('modalConfirmarBtn');
    return new Promise(resolve => {
      // Función única que resuelve y cierra (sin doble llamada)
      this._modalResolve = (valor) => {
        const el = document.getElementById('modalConfirmar');
        this._animarCierre(el, () => el.classList.remove('visible'));   // v1.39: cierre animado
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
      const el = document.getElementById('modalConfirmar');
      this._animarCierre(el, () => el.classList.remove('visible'));
    }
  },

  /* v1.39: cierre ANIMADO de un modal reutilizable. Agrega .cerrando (fade +
     pop-out por CSS) y recién a los 160ms hace el cierre real (quitar .visible o
     removeChild). El timer se guarda en el propio elemento: si el modal se REABRE
     antes de terminar el fade, quien reabre lo cancela para no cerrarse encima del
     contenido nuevo. Respeta reduced-motion. La lógica NO espera este tiempo: quien
     llama resuelve/sigue de una; esto solo demora sacar el nodo del DOM. */
  _animarCierre(el, hacer) {
    if (!el) { if (hacer) hacer(); return; }
    if (el._tCerrar) return;   // ya está cerrando
    el.classList.add('cerrando');
    el._tCerrar = setTimeout(() => {
      el._tCerrar = null;
      el.classList.remove('cerrando');
      if (hacer) hacer();
    }, 160);
  },

  /* v1.40: cierre ANIMADO de los modales creados por JS (los que hacen removeChild).
     Cada uno es un elemento NUEVO (createElement); el único riesgo es que el MISMO
     tipo de modal se reabra dentro de los 160ms del fade y el getElementById encuentre
     el que se está yendo por su id fijo. Por eso se le QUITAN los id al instante: queda
     inerte, mientras el CSS lo desvanece y se lo saca del DOM. La lógica que sigue
     (resolve/callback) NO espera: corre ya. */
  _cerrarModalJS(modal) {
    if (!modal || modal._cerrando) return;
    modal._cerrando = true;
    try {
      modal.removeAttribute('id');
      modal.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    } catch (e) {}
    modal.classList.add('cerrando');
    setTimeout(() => { try { if (modal.parentNode) modal.parentNode.removeChild(modal); } catch (e) {} }, 160);
  },

  /* v1.41: stagger de una lista UNA sola vez (al cargarse), no en cada tecla de un
     filtro. Se llama DESPUÉS de pintar el innerHTML: agrega .stagger (los hijos entran
     escalonados por CSS) y quita la clase a los 700ms, así un re-render por filtro
     posterior NO vuelve a escalonar. Sirve para las listas del Panel Admin y de
     Operatividad, que se pintan por display/innerHTML dentro de una pantalla ya activa
     (por eso el fade no se re-dispara y quedaban sin movimiento). */
  _animarEntradaLista(cont) {
    if (!cont) return;
    cont.classList.add('stagger');
    clearTimeout(cont._tStagger);
    cont._tStagger = setTimeout(() => cont.classList.remove('stagger'), 700);
  },

  /* v1.42: un número que SUBE desde 0 hasta su valor (count-up), con un pop al llegar.
     Respeta reducir movimiento (pone el valor directo). */
  _countUp(el, to) {
    if (!el) return;
    to = Number(to) || 0;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = to; return; }
    const dur = 650;
    let ini = null;
    const paso = (ts) => {
      if (ini === null) ini = ts;
      const p = Math.min((ts - ini) / dur, 1);
      el.textContent = Math.round(to * (0.5 - Math.cos(p * Math.PI) / 2));
      if (p < 1) requestAnimationFrame(paso);
      else { el.textContent = to; this._pop(el); }
    };
    requestAnimationFrame(paso);
  },

  /* v1.42: pop breve de un elemento (para resaltar un número que cambió). */
  _pop(el) {
    if (!el) return;
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  },

  /* v1.42: marca un campo obligatorio vacío (rojo + sacudida) y limpia la marca en
     cuanto el usuario empieza a escribir en él. */
  _marcarCampoFalta(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('campo-error'); void el.offsetWidth; el.classList.add('campo-error');
    const limpiar = () => { el.classList.remove('campo-error'); el.removeEventListener('input', limpiar); };
    el.addEventListener('input', limpiar);
  },

  /* v1.44: loader "con carácter" para el centro de una pantalla/sección que carga.
     Reparte SOLO entre sirena / despacho / sincronizando (rota en cada llamada si no
     se fija el tipo), así distintos puntos de carga muestran loaders distintos. Los
     skeletons (shimmer) siguen siendo el 4º tipo donde ya se usan. */
  _cargador(texto, tipo) {
    const tipos = ['sirena', 'despacho', 'sincro'];
    if (!tipo) { this._ldSeq = (this._ldSeq || 0) + 1; tipo = tipos[this._ldSeq % 3]; }
    const graf = tipo === 'sirena' ? '<div class="ld-sirena-g"></div>'
      : tipo === 'despacho' ? '<div class="ld-despacho-g"><i></i><i></i><i></i></div>'
      : '<div class="ld-sincro-g"></div>';
    return '<div class="ld-caja">' + graf + '<div>' + app._esc(texto || 'Cargando…') + '</div></div>';
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
,
  // ═══════════════════════════════════════════════════════════════════════════
  // MÓDULO ACTIVIDADES
  // ═══════════════════════════════════════════════════════════════════════════

  async iniciarNuevaActividad() {
    this._actPersonal = [];
    this._actRecursos = [];
    this._actAtenciones = [];
    this._actIdCliente = null; // v1.45: nueva actividad = nuevo recibo de idempotencia
    this._actFotos = { inicio: null, medio: null, fin: null, f4: null, f5: null, f6: null };
    this.irA('pantallaActividades');
    // Acá SÍ se espera la flota: una actividad se registra con calma, no en una
    // emergencia, así que vale la pena que el desplegable salga completo.
    await this._cargarFlota();
    this.poblarSelectFlota('actRecursoTipo');
    // reset form fields
    setTimeout(() => {
      ['actTipo','actDescripcion','actFecha','actLugar','actHoraInicio','actHoraFin','actNovedades',
       'actRecursoTipo','actRecursoCodigo','actRecursoResponsable'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value='';
      });
      const rv = document.querySelector('input[name="actModalidad"][value="Voluntaria"]'); if (rv) rv.checked = true;
      this._renderPersonalActividad();
      this._renderRecursosActividad();   // antes nadie pintaba #actRecursosLista
      this._renderAtenciones();
      ['prevFotoInicio','prevFotoMedio','prevFotoFin','prevFotoF4','prevFotoF5','prevFotoF6'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerHTML = '<span style="font-size:20px;">📷</span>';
      });
    }, 50);
  },

  _actFotos: { inicio: null, medio: null, fin: null, f4: null, f5: null, f6: null },
  _actPersonal: [],
  _actRecursos: [],
  _actAtenciones: [],

  async cargarFotoActividad(tipo, input) {
    const file = input.files[0];
    if (!file) return;
    // v5.59 FIX: comprimir igual que los reportes (antes mandaba la foto CRUDA
    // de 3-12 MB → con internet lento el envío fallaba y la foto nunca se
    // guardaba en Drive → columna vacía → "foto fantasma"). Ahora ~200 KB.
    const prev = document.getElementById('prevFoto' + tipo.charAt(0).toUpperCase() + tipo.slice(1));
    if (prev) prev.innerHTML = '<span style="font-size:11px;color:#999;">Comprimiendo...</span>';
    try {
      const dataUrl = await this.comprimirImagen(file, 1280, 0.7);
      this._actFotos[tipo] = dataUrl;
      if (prev) prev.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;">`;
    } catch (e) {
      if (prev) prev.innerHTML = '<span style="font-size:11px;color:#c00;">Error</span>';
      this.toast('No se pudo procesar la foto', 'error');
    }
  },

  // ═══ v1.45: ATENCIONES MÚLTIPLES dentro de una actividad ═══
  // Cada atención lleva datos básicos + hasta 3 fotos propias (aparte de las 6 de la
  // actividad). Viven en this._actAtenciones y viajan como JSON al backend. Los inputs de
  // texto actualizan el modelo EN EL SITIO (sin re-render) para no perder el foco al escribir.
  _actAtencionTipos: ['Primeros auxilios','Traslado a centro médico','Valoración','Otro'],

  agregarAtencion() {
    if (!Array.isArray(this._actAtenciones)) this._actAtenciones = [];
    if (this._actAtenciones.length >= 20) { this.toast('Máximo 20 atenciones por actividad', 'error'); return; }
    this._actAtenciones.push({ tipo: '', paciente: '', documento: '', hora: '', descripcion: '', fotos: [] });
    this._renderAtenciones();
  },

  quitarAtencion(i) {
    if (!this._actAtenciones) return;
    this._actAtenciones.splice(i, 1);
    this._renderAtenciones();
  },

  _setAtencionCampo(i, campo, valor) {
    if (this._actAtenciones && this._actAtenciones[i]) this._actAtenciones[i][campo] = valor;
  },

  async cargarFotoAtencion(i, input) {
    const file = input.files[0];
    if (!file) return;
    const at = this._actAtenciones && this._actAtenciones[i];
    if (!at) return;
    if (!Array.isArray(at.fotos)) at.fotos = [];
    if (at.fotos.length >= 3) { this.toast('Máximo 3 fotos por atención', 'error'); input.value = ''; return; }
    try {
      const dataUrl = await this.comprimirImagen(file, 1280, 0.7);
      at.fotos.push(dataUrl);
      this._renderAtenciones();
    } catch (e) { this.toast('No se pudo procesar la foto', 'error'); }
    input.value = '';
  },

  quitarFotoAtencion(i, j) {
    const at = this._actAtenciones && this._actAtenciones[i];
    if (!at || !Array.isArray(at.fotos)) return;
    at.fotos.splice(j, 1);
    this._renderAtenciones();
  },

  _atencionesParaEnviar() {
    return (this._actAtenciones || []).filter(a => a && (a.tipo || a.paciente || a.documento || a.hora || a.descripcion || (a.fotos && a.fotos.length)));
  },

  _renderAtenciones() {
    const cont = document.getElementById('actAtencionesLista');
    if (!cont) return;
    const ats = this._actAtenciones || [];
    if (!ats.length) { cont.innerHTML = ''; return; }
    cont.innerHTML = ats.map((a, i) => {
      const ops = this._actAtencionTipos.map(t => `<option${a.tipo===t?' selected':''}>${app._esc(t)}</option>`).join('');
      const fotos = (a.fotos || []).map((f, j) =>
        `<div style="position:relative;width:60px;height:60px;">
           <img src="${f}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">
           <button type="button" onclick="app.quitarFotoAtencion(${i},${j})" style="position:absolute;top:-6px;right:-6px;background:#c41e3a;color:#fff;border:none;border-radius:50%;width:20px;height:20px;line-height:1;cursor:pointer;font-size:12px;">×</button>
         </div>`).join('');
      const btnFoto = (a.fotos || []).length < 3
        ? `<label style="width:60px;height:60px;background:#f5f5f5;border:2px dashed #ddd;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
             <span style="font-size:18px;">📷</span>
             <input type="file" accept="image/*" style="display:none" onchange="app.cargarFotoAtencion(${i},this)">
           </label>` : '';
      return `<div style="border:1px solid #eee;border-radius:10px;padding:12px;margin-bottom:10px;background:#fafafa;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <b style="font-size:13px;color:#1a5276;">🩹 Atención ${i+1}</b>
          <button type="button" onclick="app.quitarAtencion(${i})" style="background:#fdecea;color:#c0392b;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;font-weight:700;">Quitar</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
          <select onchange="app._setAtencionCampo(${i},'tipo',this.value)" style="padding:8px;border:1px solid #ddd;border-radius:6px;font-size:14px;"><option value="">Tipo de atención...</option>${ops}</select>
          <input type="time" value="${app._esc(a.hora||'')}" onchange="app._setAtencionCampo(${i},'hora',this.value)" style="padding:8px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
          <input type="text" value="${app._esc(a.paciente||'')}" placeholder="Nombre del paciente" oninput="app._setAtencionCampo(${i},'paciente',this.value)" style="padding:8px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
          <input type="text" value="${app._esc(a.documento||'')}" placeholder="Documento (opcional)" oninput="app._setAtencionCampo(${i},'documento',this.value)" style="padding:8px;border:1px solid #ddd;border-radius:6px;font-size:14px;">
        </div>
        <textarea rows="2" placeholder="Descripción de la atención" oninput="app._setAtencionCampo(${i},'descripcion',this.value)" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;resize:none;margin-bottom:8px;">${app._esc(a.descripcion||'')}</textarea>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">${fotos}${btnFoto}</div>
      </div>`;
    }).join('');
  },

  _buscarTimer: null,
  buscarPersonalActividad(q) {
    clearTimeout(this._buscarTimer);
    const sug = document.getElementById('actSugerencias');
    if (!q || q.trim().length < 1) { sug.style.display = 'none'; return; }
    sug.innerHTML = '<div style="padding:10px;color:#999;font-size:13px;">Buscando...</div>';
    sug.style.display = 'block';
    this._buscarTimer = setTimeout(() => this._ejecutarBusqueda(q.trim()), 400);
  },

  async _ejecutarBusqueda(q) {
    const sug = document.getElementById('actSugerencias');
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'buscarPersonal', q })
      });
      const data = await resp.json();
      if (!data.ok || !data.resultados.length) {
        sug.innerHTML = '<div style="padding:10px;color:#999;font-size:13px;">Sin resultados — usa el botón de persona nueva</div>';
        return;
      }
      // v5.63 (BUG duplicados): red de seguridad — si el backend devuelve la
      // misma persona 2 veces (con y sin cédula, tilde/Ñ), mostrar solo una:
      // gana la que tiene cédula.
      const _vistosNorm = {};
      data.resultados.forEach(per => {
        const k = this._normFuerte(per.nombre);
        if (!_vistosNorm[k] || (per.cedula && !_vistosNorm[k].cedula)) _vistosNorm[k] = per;
      });
      data.resultados = Object.values(_vistosNorm);
      // v5.95 (I10): el objeto ya no viaja como JSON dentro del onclick (una
      // comilla/carácter raro en el nombre rompía el handler) — se guarda en
      // _busqPersonalRes y el div solo lleva el índice en data-i.
      this._busqPersonalRes = data.resultados;
      sug.innerHTML = data.resultados.map((per, i) => {
        return `<div data-i="${i}" onclick="app.seleccionarPersonalActividad(app._busqPersonalRes[this.dataset.i])"
          style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:14px;">
          <strong>${app._esc(per.nombre)}</strong><br>
          <span style="color:#666;font-size:12px;">CC: ${app._esc(per.cedula)} | ${app._esc(per.rango)}</span>
        </div>`;
      }).join('');
      sug.style.display = 'block';
    } catch(e) {
      sug.innerHTML = '<div style="padding:10px;color:#c00;font-size:13px;">Error de conexión</div>';
    }
  },

  seleccionarPersonalActividad(p) {
    document.getElementById('actSugerencias').style.display = 'none';
    document.getElementById('actBuscarPersonal').value = '';
    // Comparar por cédula si existe, sino por nombre
    const yaExiste = p.cedula
      ? this._actPersonal.find(x => x.cedula && x.cedula === p.cedula)
      : this._actPersonal.find(x => x.nombre.toUpperCase() === (p.nombre||'').toUpperCase());
    if (yaExiste) { this.toast(p.nombre + ' ya está en la lista', 'error'); return; }
    this._actPersonal.push(p);
    this._renderPersonalActividad();
    this.toast('✅ ' + p.nombre + ' agregado', 'exito');
  },

  agregarPersonalNuevoActividad() {
    const nombre = (document.getElementById('actNuevoNombre').value||'').toUpperCase().trim();
    const cedula = (document.getElementById('actNuevoCedula').value||'').trim();
    const tel = document.getElementById('actNuevoTel').value||'';
    const rango = document.getElementById('actNuevoRango').value||'BOMBERO';
    if (!nombre || !cedula) { this.toast('Nombre y cédula son obligatorios', 'error'); return; }
    if (this._actPersonal.find(x => x.cedula === cedula)) { this.toast('Ya está en la lista', 'error'); return; }
    this._actPersonal.push({ nombre, cedula, rango, telefono: tel, email: '', esNuevo: true });
    this._renderPersonalActividad();
    document.getElementById('actNuevoNombre').value = '';
    document.getElementById('actNuevoCedula').value = '';
    document.getElementById('actNuevoTel').value = '';
    document.getElementById('actFormNuevo').style.display = 'none';
    this.toast('✅ ' + nombre + ' agregado', 'exito');
  },

  _renderPersonalActividad() {
    const cont = document.getElementById('actPersonalLista');
    if (!this._actPersonal.length) { cont.innerHTML = '<div style="color:#999;font-size:13px;text-align:center;padding:10px;">Sin personal aún</div>'; return; }
    cont.innerHTML=this._actPersonal.map((p,i)=>{
      const enc=!!p.esEncargado;
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:'+(enc?'#fff8e1':'#f8f8f8')+';border-radius:8px;margin-bottom:6px;">'
        +'<div><strong style="font-size:14px;">'+app._esc(p.nombre||'(sin nombre)')+'</strong>'+(p.esNuevo?' (NUEVO)':'')+(enc?' (ENCARGADO)':'')
        +'<div style="font-size:12px;color:#666;">CC: '+app._esc(p.cedula||'-')+' | '+app._esc(p.rango||'')+'</div></div>'
        +'<div style="display:flex;gap:4px;">'
        +'<button data-i="'+i+'" onclick="app._toggleEncargado(+this.dataset.i)" title="Encargado" style="background:none;border:none;font-size:20px;cursor:pointer;opacity:'+(enc?'1':'0.25')+';">&#11088;</button>'
        +'<button data-i="'+i+'" onclick="app._quitarPersonalActividad(+this.dataset.i)" style="background:none;border:none;color:#c00;font-size:18px;cursor:pointer;">&#x2715;</button>'
        +'</div></div>';
    }).join('');
  },

  _toggleEncargado(idx) {
    this._actPersonal.forEach((p,i)=>p.esEncargado=(i===idx?!p.esEncargado:false));
    this._renderPersonalActividad();
  },

  _quitarPersonalActividad(idx) {
    this._actPersonal.splice(idx, 1);
    this._renderPersonalActividad();
  },

  /* ═══════ RECURSOS / VEHÍCULOS DE UNA ACTIVIDAD ═══════
     Lo reportó Jeferson ("pongo Germán y no me aparece el autocompletado").
     Al buscar la causa apareció algo más grande: la sección entera era
     DECORADO. El HTML estaba completo (#actRecursoTipo, #actRecursoCodigo,
     #actRecursoResponsable, #actRecursoSug, #actRecursosLista) pero NINGUNO
     de esos cinco elementos se leía nunca desde app.js, y `_actRecursos` se
     declaraba, se reseteaba y se enviaba al backend sin recibir jamás un
     push. Encima el botón "➕ Agregar vehículo" llamaba a `agregarRecurso()`,
     que pertenece al formulario de EMERGENCIA y escribe en #tablaRecursos:
     la fila se agregaba a otra pantalla, invisible desde acá.
     Consecuencia real: TODO vehículo y maquinista anotado en una actividad se
     descartó en silencio. El backend siempre estuvo listo (crearActividad ya
     escribía en Recursos_Actividad y obtenerActividad ya los leía de vuelta);
     el único lado roto era este. */
  agregarRecursoActividad() {
    const elTipo = document.getElementById('actRecursoTipo');
    const elCod  = document.getElementById('actRecursoCodigo');
    const elResp = document.getElementById('actRecursoResponsable');
    let tipo = (elTipo && elTipo.value || '').trim();
    if (!tipo) { this.toast('Elige el vehículo', 'error'); return; }
    /* __OTRO__ es el marcador interno de _opcionesFlota, no un nombre. Sin esto
       se guardaría la cadena "__OTRO__" como si fuera una máquina. Cuando lo
       eligen, el nombre real va en el campo de código. */
    if (tipo === '__OTRO__') {
      const libre = (elCod && elCod.value || '').trim();
      if (!libre) { this.toast('Escribe cuál vehículo en el campo de al lado', 'error'); return; }
      tipo = libre;
    }
    const codigo = (elCod && elCod.value || '').trim();
    const responsable = (elResp && elResp.value || '').toUpperCase().trim();
    // La cédula sale del autocompletado (data-ced). Si el nombre se escribió a
    // mano queda vacía, igual que antes: es un dato mejor cuando está, nunca un
    // requisito (un maquinista de apoyo puede no estar en la base).
    const responsableCedula = (elResp && elResp.dataset && elResp.dataset.ced || '').trim();
    // Mismo vehículo dos veces en la misma actividad no aporta y ensucia el
    // conteo. Se compara por tipo+código: la misma máquina puede ir con otra
    // placa/código sólo si de verdad es otra unidad.
    const yaEsta = this._actRecursos.some(r =>
      String(r.tipo||'').toUpperCase() === tipo.toUpperCase() &&
      String(r.codigo||'').toUpperCase() === codigo.toUpperCase());
    if (yaEsta) { this.toast('Ese vehículo ya está en la lista', 'error'); return; }
    this._actRecursos.push({ tipo, codigo, responsable, responsableCedula });
    if (elTipo) elTipo.value = '';
    if (elCod)  elCod.value = '';
    if (elResp) { elResp.value = ''; elResp.dataset.ced = ''; }
    const sug = document.getElementById('actRecursoSug');
    if (sug) sug.style.display = 'none';
    this._renderRecursosActividad();
    this.toast('🚒 ' + tipo + ' agregado', 'exito');
  },

  _renderRecursosActividad() {
    const cont = document.getElementById('actRecursosLista');
    if (!cont) return;
    if (!this._actRecursos.length) { cont.innerHTML = '<div style="color:#999;font-size:13px;text-align:center;padding:10px;">Sin vehículos aún</div>'; return; }
    // I5: todo a innerHTML pasa por _esc. I10: data-* en vez de meter el índice
    // dentro de una cadena con comillas.
    cont.innerHTML = this._actRecursos.map((r,i) =>
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#f8f8f8;border-radius:8px;margin-bottom:6px;">'
      +'<div><strong style="font-size:14px;">'+app._esc(r.tipo||'(sin tipo)')+'</strong>'+(r.codigo?' <span style="color:#666;font-size:12px;">('+app._esc(r.codigo)+')</span>':'')
      +'<div style="font-size:12px;color:#666;">'+(r.responsable ? '👤 '+app._esc(r.responsable)+(r.responsableCedula?' · CC: '+app._esc(r.responsableCedula):'') : '<span style="color:#b98;">sin maquinista</span>')+'</div></div>'
      +'<button data-i="'+i+'" onclick="app._quitarRecursoActividad(+this.dataset.i)" style="background:none;border:none;color:#c00;font-size:18px;cursor:pointer;">&#x2715;</button>'
      +'</div>'
    ).join('');
  },

  _quitarRecursoActividad(idx) {
    this._actRecursos.splice(idx, 1);
    this._renderRecursosActividad();
  },

  async guardarActividad(btn) {
    // v5.63 (BUG doble click): bloqueo total mientras se envía
    if (this._guardandoActividad) return;
    const tipo = document.getElementById('actTipo').value;
    const desc = document.getElementById('actDescripcion').value.trim();
    const fecha = document.getElementById('actFecha').value;
    const hi = document.getElementById('actHoraInicio').value;
    if (!tipo || !desc || !fecha || !hi) { this.toast('Tipo, descripción, fecha y hora inicio son obligatorios', 'error'); return; }
    if (!this._actPersonal.length) { this.toast('Agrega al menos una persona', 'error'); return; }
    this._guardandoActividad = true;
    let htmlBtn = '';
    if (btn) { htmlBtn = btn.innerHTML; btn.disabled = true; btn.style.opacity='0.65'; btn.innerHTML='<span class="ld-despacho"><i></i><i></i><i></i></span> Guardando actividad...'; }
    this.toast('⏳ Guardando actividad...', 'info');
    // v5.63: idCliente estable por intento — el backend lo usa para ignorar
    // envíos repetidos del mismo formulario (anti-duplicado de red).
    if (!this._actIdCliente) this._actIdCliente = this.uuid();
    try {
      const payload = {
        accion: 'crearActividad',
        idCliente: this._actIdCliente,
        tipo, descripcion: desc, fecha,
        horaInicio: hi,
        horaFin: document.getElementById('actHoraFin').value,
        lugar: document.getElementById('actLugar').value,
        novedades: document.getElementById('actNovedades').value,
        personal: this._actPersonal,
        recursos: this._actRecursos,
        registradoPor: this.usuario.nombre,
        emailRegistrador: this.usuario.email,
        comandante: (this._actPersonal.find(p=>p.esEncargado)||{}).nombre || this.usuario.nombre,
        modalidad: (document.querySelector('input[name="actModalidad"]:checked')||{}).value || 'Voluntaria',
        atenciones: this._atencionesParaEnviar(),
        fotoInicio: this._actFotos.inicio,
        fotoMedio: this._actFotos.medio,
        fotoFin: this._actFotos.fin,
        foto4: this._actFotos.f4,
        foto5: this._actFotos.f5,
        foto6: this._actFotos.f6
      };
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error || 'Error al guardar');
      // DIAGNÓSTICO: solo avisar si ALGUNA foto falló (ya no molesta si todo va bien)
      if (data._diagFotos) {
        const df = data._diagFotos;
        console.log('DIAG FOTOS:', df);
        const claves = ['inicio','medio','fin','f4','f5','f6'];
        const fallo = claves.some(k => df.recibidas[k] && !df.subidas[k]);
        if (fallo) {
          const linea = (k) => 'Foto ' + k + ': recibida=' + (df.recibidas[k]?'SÍ':'NO')
            + ' | Drive=' + (df.subidas[k]?'SÍ ✅':'NO ❌')
            + ((df.errores && df.errores[k]) ? (' (' + df.errores[k] + ')') : '');
          // alert() nativo NO se ve en el APK/WebView → modal propio de la app.
          this.confirmar('⚠️ Foto no guardada',
            'Una foto no se subió al servidor.  ·  ' + claves.filter(k => df.recibidas[k]).map(linea).join('  ·  '));
        }
      }
      this.toast('✅ Actividad registrada', 'exito');
      this._actIdCliente = null; // ← próximo registro tendrá su propio id
      // Reset form
      this._actPersonal = [];
      this._actRecursos = [];   // faltaba: los vehículos quedaban pegados al
                                // formulario y se repetían en la actividad siguiente
      this._actAtenciones = [];
      this._actFotos = { inicio: null, medio: null, fin: null, f4: null, f5: null, f6: null };
      ['actTipo','actDescripcion','actFecha','actLugar','actHoraInicio','actHoraFin','actNovedades',
       'actRecursoTipo','actRecursoCodigo','actRecursoResponsable'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = '';
      });
      const rv2 = document.querySelector('input[name="actModalidad"][value="Voluntaria"]'); if (rv2) rv2.checked = true;
      ['prevFotoInicio','prevFotoMedio','prevFotoFin','prevFotoF4','prevFotoF5','prevFotoF6'].forEach(id => {
        const el = document.getElementById(id); if(el) el.innerHTML = '<span style="font-size:20px;">📷</span>';
      });
      this._renderPersonalActividad();
      this._renderRecursosActividad();
      this._renderAtenciones();
      setTimeout(() => this.irA('pantallaListaActividades'), 1000);
    } catch(e) { this.toast('Error: ' + e.message, 'error'); }
    finally {
      this._guardandoActividad = false;
      if (btn) { btn.disabled = false; btn.style.opacity=''; btn.innerHTML = htmlBtn; }
    }
  },

  async cargarListaActividades() {
    const cont = document.getElementById('listaActividadesContenido');
    if (!cont) return;
    cont.innerHTML = this._skeleton(3);
    const esAdm = this.esAdmin();
    let htmlAct = '';

    // 1) Actividades
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarActividades', emailFiltro: esAdm ? null : (this.usuario ? this.usuario.email : '') })
      });
      const data = await resp.json();
      if (data.ok && data.actividades && data.actividades.length) {
        this._listaActividades = data.actividades;
        htmlAct = data.actividades.map((a) =>
          '<div class="ops-log-item ops-log-activity" style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;border-left:4px solid #1a5276;">'
          +'<div style="display:flex;justify-content:space-between;align-items:flex-start;">'
          +'<div style="flex:1;cursor:pointer;" data-actid="'+a.id+'" onclick="app.verDetalleActividad(this.dataset.actid)">'
          +'<div style="font-weight:700;color:#1a5276;">'+app._esc(a.tipo)+' - '+app._esc(String(a.descripcion||'').substring(0,50))+'</div>'
          +'<div style="font-size:13px;color:#666;margin-top:4px;">'+(String(a.fecha||'').substring(0,10))+' | '+a.duracion+'h | 👥 '+a.numUnidades+'</div>'
          +'<div style="font-size:12px;color:#999;margin-top:2px;">Por: '+a.registradoPor+'</div>'
          +'</div>'
          +(esAdm?'<button data-actid="'+a.id+'" data-acttipo="'+encodeURIComponent(a.tipo)+'" onclick="event.stopPropagation();app.eliminarActividad(this.dataset.actid,decodeURIComponent(this.dataset.acttipo));" style="background:none;border:none;color:#c00;font-size:22px;cursor:pointer;padding:4px 8px;" title="Eliminar">&#128465;</button>'+'<button data-actid="'+a.id+'" onclick="event.stopPropagation();app.editarActividad(this.dataset.actid);" style="background:none;border:none;color:#1a5276;font-size:20px;cursor:pointer;padding:4px 8px;" title="Editar">&#9998;</button>':'')
          +'</div></div>'
        ).join('');
      } else {
        htmlAct = '<div style="text-align:center;padding:20px;color:#999;">No hay actividades registradas</div>';
      }
    } catch(e) { htmlAct = '<div style="color:#c00;padding:14px;">Error cargando actividades</div>'; }

    /* 14/08/2026: acá iba un segundo bloque que listaba la ASISTENCIA DE DOMINGOS.
       La formación dominical y el régimen de sanciones por inasistencia son de
       de la estación de origen, no del gremio: un cuerpo que no los usa no tiene por qué encontrar
       esa sección en su app. Salió con el módulo completo. */

    cont.innerHTML =
      '<div class="ops-section-label" style="font-size:13px;font-weight:700;color:#1a5276;margin:4px 0 8px;letter-spacing:.5px;">📋 Actividades</div>' + htmlAct;
  },

  async verDetalleActividad(id) {
    this._actividadActual = id;
    this.irA('pantallaDetalleActividad');
    const cont = document.getElementById('detalleActividadContenido');
    cont.innerHTML = app._cargador('Cargando…');
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'obtenerActividad', id })
      });
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error);
      const a = data.actividad;
      this._detalleActividadData = a;
      cont.innerHTML = `
        <div class="ops-dossier-card" style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;">
          <div class="ops-dossier-title" style="font-size:18px;font-weight:700;color:#1a5276;margin-bottom:8px;">${app._esc(a.tipo)}
            ${a.modalidad === 'Paga'
              ? '<span style="font-size:11px;font-weight:700;background:#fef3c7;color:#92600a;border-radius:10px;padding:2px 8px;margin-left:6px;vertical-align:middle;">💵 PAGA</span>'
              : '<span style="font-size:11px;font-weight:700;background:#e7f3e7;color:#1e6b2f;border-radius:10px;padding:2px 8px;margin-left:6px;vertical-align:middle;">🙋 VOLUNTARIA</span>'}
          </div>
          <div style="color:#333;margin-bottom:6px;">${app._esc(a.descripcion)}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:13px;color:#555;">
            <div>📅 ${app._esc(a.fecha)}</div><div>📍 ${app._esc(a.lugar||'-')}</div>
            <div>🕐 ${a.horaInicio||'-'} → ${a.horaFin||'-'}</div><div>⏱️ ${a.duracion}h</div>
          </div>
          ${a.novedades ? `<div style="margin-top:8px;padding:8px;background:#f5f5f5;border-radius:6px;font-size:13px;">${app._esc(a.novedades)}</div>` : ''}
        </div>
        <div class="ops-dossier-card" style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="font-weight:700;margin-bottom:8px;">👥 Personal (${a.personal.length})</div>
          ${a.personal.map(p => `<div style="padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">
            <strong>${app._esc(p.nombre)}</strong> — ${app._esc(p.rango)}<div style="font-size:12px;color:#666;">CC: ${app._esc(p.cedula)}</div>
          </div>`).join('')}
        </div>
        ${(a.fotoInicio||a.fotoMedio||a.fotoFin||a.fotoF4||a.fotoF5||a.fotoF6) ? `
        <div class="ops-dossier-card" style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="font-weight:700;margin-bottom:8px;">📸 Fotos</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
            ${[a.fotoInicio,a.fotoMedio,a.fotoFin,a.fotoF4,a.fotoF5,a.fotoF6].map((f,idx) => f ? `<div><div style="font-size:11px;color:#666;text-align:center;">Foto ${idx+1}</div><img src="${app._esc(this._imgDrive(f))}" style="width:100%;border-radius:6px;"></div>` : '').join('')}
          </div>
        </div>` : ''}
        ${this._atencionesDetalleHTML(a.atenciones)}`;
    } catch(e) { cont.innerHTML = `<div style="color:#c00;padding:20px;">Error: ${e.message}</div>`; }
  },

  // v1.45: tarjetas de atenciones para el detalle en pantalla (fotos como URL de Drive).
  _atencionesDetalleHTML(ats) {
    if (!Array.isArray(ats) || !ats.length) return '';
    const cards = ats.map((a, i) => {
      const fotos = (a.fotos || []).map(f => `<img src="${app._esc(this._imgDrive(f))}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;">`).join('');
      const meta = [a.paciente ? '👤 ' + app._esc(a.paciente) : '', a.documento ? 'CC ' + app._esc(a.documento) : '', a.hora ? '🕐 ' + app._esc(a.hora) : ''].filter(Boolean).join(' · ');
      return `<div style="border:1px solid #eee;border-radius:8px;padding:10px;margin-bottom:8px;background:#fafafa;">
        <div style="font-weight:700;color:#1a5276;font-size:13px;">🩹 Atención ${i+1}${a.tipo ? ' — ' + app._esc(a.tipo) : ''}</div>
        ${meta ? `<div style="font-size:12px;color:#555;margin-top:2px;">${meta}</div>` : ''}
        ${a.descripcion ? `<div style="font-size:13px;color:#333;margin-top:4px;">${app._esc(a.descripcion)}</div>` : ''}
        ${fotos ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">${fotos}</div>` : ''}
      </div>`;
    }).join('');
    return `<div class="ops-dossier-card" style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;">
      <div style="font-weight:700;margin-bottom:8px;">🩹 Atenciones (${ats.length})</div>${cards}</div>`;
  },

  // v1.45: atenciones para el PDF oficial.
  _atencionesPDFHTML(ats) {
    if (!Array.isArray(ats) || !ats.length) return '';
    const bloques = ats.map((a, i) => {
      const fotos = (a.fotos || []).map(f => `<img src="${app._esc(this._imgDrive(f))}" style="width:120px;height:120px;object-fit:cover;margin:2px;border:1px solid #ccc;">`).join('');
      const meta = [a.paciente ? 'Paciente: ' + app._esc(a.paciente) : '', a.documento ? 'Doc: ' + app._esc(a.documento) : '', a.hora ? 'Hora: ' + app._esc(a.hora) : ''].filter(Boolean).join(' | ');
      return `<div style="margin-bottom:8px;border:1px solid #ddd;border-radius:4px;padding:8px;">
        <p style="margin:0;font-weight:700;">Atención ${i+1}${a.tipo ? ' — ' + app._esc(a.tipo) : ''}</p>
        ${meta ? `<p style="margin:2px 0;font-size:10pt;">${meta}</p>` : ''}
        ${a.descripcion ? `<p style="margin:2px 0;font-size:10pt;">${app._esc(a.descripcion)}</p>` : ''}
        ${fotos ? `<div>${fotos}</div>` : ''}
      </div>`;
    }).join('');
    return `<h2 class="sec">Atenciones durante la actividad (${ats.length})</h2>${bloques}`;
  },

  imprimirActividad() {
    const a = this._detalleActividadData;
    if (!a) return;
    // opener nulo, NO 'noopener' — ver nota en _imprimirReporteEnVentanaNueva.
    const w = window.open('', '_blank', 'width=900,height=1200');
    if (!w) { this.toast('El navegador bloqueó la ventana. Permita pop-ups e intente de nuevo.', 'error'); return; }
    try { w.opener = null; } catch (e) {}
    const logo = app._logoImpresion();
    const tel = (typeof TELEFONO_ESTACION !== 'undefined') ? TELEFONO_ESTACION : '';
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Actividad ${a.id}</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:12pt;margin:15mm;color:#000;}
        .header{display:flex;align-items:center;gap:14px;border-bottom:3px solid #7A1010;padding-bottom:10px;}
        .header img{width:80px;height:80px;object-fit:contain;}
        .header .info{flex:1;text-align:center;}
        .header h2{margin:0;font-size:14pt;}
        .header .info div{font-size:9pt;}
        .titulo{text-align:center;font-size:15pt;font-weight:700;color:#7A1010;margin:10px 0 2px;}
        .lema{text-align:center;font-style:italic;font-size:10pt;margin-bottom:12px;}
        h2.sec{color:#7A1010;font-size:13pt;border-bottom:1px solid #ccc;margin-top:18px;}
        table{width:100%;border-collapse:collapse;margin:8px 0;}
        th,td{border:1px solid #000;padding:6px 8px;font-size:10pt;}
        th{background:#7A1010;color:#fff;}
        .fotos{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:10px 0;}
        .fotos img{width:100%;max-height:80mm;object-fit:contain;border:1px solid #ccc;}
        .pie{margin-top:24px;border-top:1px solid #ccc;padding-top:8px;font-size:8pt;color:#666;text-align:center;}
        @media print{body{margin:10mm;}}
      </style></head><body>
      <div class="header">
        <img src="${logo}" alt="">
        <div class="info">
          <h2>CUERPO DE BOMBEROS VOLUNTARIOS</h2>
          <div>${app._esc((app._inst().municipio||"")+(app._inst().departamento?" - "+app._inst().departamento:""))}</div>
          <div>${app._esc(app._inst().personeria||"")}</div>
          <div>${app._membrete()}</div>
        </div>
        <div style="width:80px;"></div>
      </div>
      <div class="titulo">REGISTRO OFICIAL DE ACTIVIDAD</div>
      <div class="lema">${app._esc(app._inst().lema || '')}</div>

      <h2 class="sec">${app._esc(a.tipo)} <span style="font-size:10pt;font-weight:700;">· ${a.modalidad === 'Paga' ? 'PAGA (contratada)' : 'VOLUNTARIA'}</span></h2>
      <p><strong>Descripción:</strong> ${app._esc(a.descripcion)}</p>
      <table><tr><th>Fecha</th><th>Lugar</th><th>Hora inicio</th><th>Hora fin</th><th>Duración</th></tr>
      <tr><td>${app._esc(String(a.fecha||'').substring(0,10))}</td><td>${app._esc(a.lugar||'-')}</td><td>${app._esc(a.horaInicio||'-')}</td><td>${app._esc(a.horaFin||'-')}</td><td>${app._esc(a.duracion)}h</td></tr></table>
      ${a.novedades ? `<p><strong>Novedades:</strong> ${app._esc(a.novedades)}</p>` : ''}

      <h2 class="sec">Personal asistente (${a.personal.length})</h2>
      <table><tr><th>#</th><th>Nombre</th><th>Cédula</th><th>Rango</th><th>Horas</th></tr>
      ${a.personal.map((p,i) => `<tr><td>${i+1}</td><td>${app._esc(p.nombre)}</td><td>${app._esc(p.cedula)}</td><td>${app._esc(p.rango)}</td><td>${app._esc(p.horas)}h</td></tr>`).join('')}
      </table>

      ${(a.fotoInicio||a.fotoMedio||a.fotoFin||a.fotoF4||a.fotoF5||a.fotoF6) ? `<h2 class="sec">Registro fotográfico</h2><div class="fotos">
        ${[a.fotoInicio,a.fotoMedio,a.fotoFin,a.fotoF4,a.fotoF5,a.fotoF6].map((f,idx) => f ? `<div><p style="text-align:center;font-weight:700;font-size:9pt;">Foto ${idx+1}</p><img src="${app._esc(this._imgDrive(f))}"></div>` : '').join('')}
      </div>` : ''}

      ${this._atencionesPDFHTML(a.atenciones)}

      <div class="pie">
        Registrado por: ${a.registradoPor||'-'}<br>
        Documento bajo Ley 1575 de 2012 (Ley General de Bomberos de Colombia) | Ley 1581 de 2012 (Habeas Data)<br>
        ${app._esc(app._inst().nombre || "")}
      </div>
      </body></html>`);
    w.document.close();
    this._imprimirCuandoCarguenImagenes(w, 10000);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MÓDULO ASISTENCIA
  // ═══════════════════════════════════════════════════════════════════════════

  // _normNombre y _cedKey se movieron junto a _esc el 14/08/2026, para que la
  // eliminación de este bloque no se las llevara.

  // ═══════════════════════════════════════════════════════════════════════════
  // MÓDULO OPERATIVIDAD
  // ═══════════════════════════════════════════════════════════════════════════

  async cargarOperatividad() {
    const cont = document.getElementById('operatividadContenido');
    if (!cont) return;
    if (!this.esAdmin()) {
      cont.innerHTML = '<div style="text-align:center;padding:40px;"><div style="font-size:40px;">🔒</div><div style="color:#999;margin-top:10px;">Solo administradores pueden ver la operatividad</div></div>';
      return;
    }
    cont.innerHTML = this._skeleton(1) + this._skeleton(4, 'linea');
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarOperatividad', mes: this._operMes, anio: this._operAnio })
      });
      const data = await resp.json();
      if (!data.ok) {
        cont.innerHTML = '<div style="color:#c00;padding:20px;">Error: ' + app._esc(data.error||'desconocido') + '</div>'; return;
      }
      // Si no hay datos, _operData queda vacío y _renderOperatividad
      // muestra los filtros + métricas en 0 (sin loop)
      this._operData = data.operatividad || [];
      this._operStats = data.stats || null;
      this._renderOperatividad();
      this._animarEntradaLista(document.getElementById('operatividadContenido'));   // v1.41: entra escalonado
    } catch(e) { cont.innerHTML = `<div style="color:#c00;padding:20px;">Error: ${e.message}</div>`; }
  }

,
  _operData: [],
  _operVista: 'general', // 'general' | 'unidad'
  _operMes: '',
  _operAnio: '',

  _renderOperatividad() {
    const cont = document.getElementById('operatividadContenido');
    if (!cont || !this._operData) return;
    const ahora = new Date();
    const anioActual = String(ahora.getFullYear());
    // NO resetear _operMes — '' significa "Todo el año"
    if (!this._operAnio) this._operAnio = anioActual;
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const filtros = '<div class="ops-filterbar" style="background:#fff;border-radius:12px;padding:12px;margin-bottom:10px;">'
      + '<div style="display:flex;gap:8px;margin-bottom:10px;">'
      + '<button onclick="app._operVista=\'general\';app.cargarOperatividad()" style="flex:1;padding:8px;border:none;border-radius:8px;font-weight:700;cursor:pointer;background:'+(this._operVista!=='unidad'?'#6e2fa0':'#f0f0f0')+';color:'+(this._operVista!=='unidad'?'#fff':'#333')+';">📊 General</button>'
      + '<button onclick="app._operVista=\'unidad\';app.cargarOperatividad()" style="flex:1;padding:8px;border:none;border-radius:8px;font-weight:700;cursor:pointer;background:'+(this._operVista==='unidad'?'#6e2fa0':'#f0f0f0')+';color:'+(this._operVista==='unidad'?'#fff':'#333')+';">👤 Por Unidad</button>'
      + '</div>'
      + '<div style="display:flex;gap:8px;">'
      + '<select onchange="app._operMes=this.value;app.cargarOperatividad()" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:6px;font-size:13px;">'
      + '<option value=""'+(!this._operMes?' selected':'')+'>📅 Todo el año</option>'
      + meses.map((m,i)=>{ const v=String(i+1).padStart(2,'0'); return '<option value="'+v+'"'+(this._operMes===v?' selected':'')+'>'+m+'</option>'; }).join('')
      + '</select>'
      + '<select onchange="app._operAnio=this.value;app.cargarOperatividad()" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:6px;font-size:13px;">'
      + [anioActual, String(parseInt(anioActual)-1)].map(a=>'<option value="'+a+'"'+(this._operAnio===a?' selected':'')+'>'+a+'</option>').join('')
      + '</select>'
      + '</div></div>';

    if (!this._operData.length) {
      const mesesN = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const mesNom0 = this._operMes ? mesesN[parseInt(this._operMes)-1] : 'Todo el año';
      const card0 = (n,lbl,col) => '<div class="ops-metric" style="background:#fff;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:28px;font-weight:700;color:'+col+';">'+n+'</div><div style="font-size:12px;color:#666;">'+lbl+'</div></div>';
      cont.innerHTML = filtros
        + '<div class="ops-period" style="background:#6e2fa0;color:#fff;border-radius:12px;padding:16px;margin-bottom:10px;">'
        + '<div style="font-size:13px;opacity:.8;">Período</div>'
        + '<div style="font-size:18px;font-weight:700;">'+mesNom0+' '+this._operAnio+'</div>'
        + '<div style="font-size:12px;opacity:.7;margin-top:2px;">' + app._esc(app._inst().nombre || '') + '</div></div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">'
        + card0(0,'Unidades con registros','#1a5276') + card0(0,'Emergencias únicas','#c0392b')
        + card0('0h','Horas en actividades','#1e8449')
        + '</div>'
        + '<div style="text-align:center;padding:20px;color:#999;background:#fff;border-radius:12px;">Sin registros en este período</div>';
      return;
    }
    cont.innerHTML = filtros + '<div id="operContenidoFiltrado"></div>';
    if (this._operVista === 'unidad') this._renderPorUnidad();
    else this._renderGeneral();
  },

  _filtrarPorMes(lista, campoFecha) {
    const prefijo = this._operMes ? (this._operAnio + '-' + this._operMes) : '';
    return lista.filter(item => String(item[campoFecha]||'').startsWith(prefijo));
  },

  _renderGeneral() {
    const cont = document.getElementById('operContenidoFiltrado');
    if (!cont) return;
    const d = this._operData;
    const totalPersonas = d.length;
    const totalEmerg = d.reduce((s,p) => s + (p.emergencias||0), 0);
    const totalHoras = d.reduce((s,p) => s + (p.horasActividades||0), 0);
    const top = [...d].sort((a,b) => {
      const pa = a.emergencias*2 + a.horasActividades;
      const pb = b.emergencias*2 + b.horasActividades;
      return pb - pa;
    });
    const mesNombre = this._operMes ? ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][parseInt(this._operMes)-1] : 'Todo el año';

    const topEmerg = [...d].sort((a,b)=>b.emergencias-a.emergencias).filter(p=>p.emergencias>0);
    const topActiv = [...d].sort((a,b)=>b.horasActividades-a.horasActividades).filter(p=>p.horasActividades>0);
    const medallas = ['🥇','🥈','🥉'];
    const rankRow = (p,i,val,lbl) => '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f0f0f0;">'
      + '<div><span style="font-size:15px;">'+(medallas[i]||('<span style="font-size:11px;color:#999;">#'+(i+1)+'</span>'))+'</span>'
      + '<strong style="margin-left:6px;font-size:13px;">'+app._esc(p.nombre||'')+'</strong></div>'
      + '<span style="font-weight:700;color:#6e2fa0;">'+val+' '+lbl+'</span></div>';
    const rankList = (lista, getId, getVal, lbl, color) => {
      if(!lista.length) return '<div style="color:#999;font-size:13px;text-align:center;padding:8px;">Sin datos en este período</div>';
      const top3 = lista.slice(0,3).map((p,i)=>rankRow(p,i,getVal(p),lbl)).join('');
      const resto = lista.slice(3);
      if(!resto.length) return top3;
      const masId = getId+'_mas';
      return top3
        + '<div id="'+masId+'" style="display:none;">'+resto.map((p,i)=>rankRow(p,i+3,getVal(p),lbl)).join('')+'</div>'
        + '<button data-id="'+masId+'" onclick="var e=document.getElementById(this.dataset.id);var v=e.style.display!==\'none\';e.style.display=v?\'none\':\'block\';this.textContent=v?\'▼ Ver más ('+resto.length+')\':\'▲ Ver menos\';" '
        + 'style="width:100%;padding:6px;margin-top:4px;background:#f5f5f5;border:none;border-radius:6px;cursor:pointer;font-size:12px;color:'+color+';">▼ Ver más ('+resto.length+')</button>';
    };

    cont.innerHTML = `
      <div class="ops-period" style="background:#6e2fa0;color:#fff;border-radius:12px;padding:16px;margin-bottom:10px;">
        <div style="font-size:13px;opacity:.8;">Período</div>
        <div style="font-size:18px;font-weight:700;">${mesNombre} ${this._operAnio}</div>
        <div style="font-size:12px;opacity:.7;margin-top:2px;">${app._esc(app._inst().nombre || '')}</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div class="ops-metric" style="background:#fff;border-radius:10px;padding:14px;text-align:center;">
          <div class="op-cifra" style="font-size:28px;font-weight:700;color:#1a5276;">${totalPersonas}</div>
          <div style="font-size:12px;color:#666;">Unidades con registros</div>
          ${this._operStats && this._operStats.unidadesBase !== undefined ? '<div style="font-size:11px;color:#999;margin-top:2px;">Base activa: '+this._operStats.unidadesBase+'</div>' : ''}
        </div>
        <div class="ops-metric" style="background:#fff;border-radius:10px;padding:14px;text-align:center;">
          <div class="op-cifra" style="font-size:28px;font-weight:700;color:#c0392b;">${this._operStats ? this._operStats.totalEmergenciasUnicas : totalEmerg}</div>
          <div style="font-size:12px;color:#666;">Emergencias únicas</div>
        </div>
        <div class="ops-metric" style="background:#fff;border-radius:10px;padding:14px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#1e8449;">${this._r1((this._operStats && this._operStats.totalHorasActividades !== undefined) ? this._operStats.totalHorasActividades : totalHoras)}h</div>
          <div style="font-size:12px;color:#666;">Horas en actividades</div>
        </div>
      </div>
      ${this._operStats && this._operStats.sinCruce > 0 ? '<div style="background:#fff8e1;border-radius:10px;padding:12px;margin-bottom:10px;border-left:4px solid #f9a825;"><div style="font-weight:700;color:#8d6e00;font-size:13px;">⚠️ '+this._operStats.sinCruce+' registro(s) no cruzan con la base de personal</div><div style="font-size:12px;color:#8d6e00;margin-top:2px;">Son nombres o cédulas escritos distinto en los registros (por eso hay más tarjetas que unidades reales). Búscalos en "Por Unidad": están marcados en ámbar — corrige la escritura en la hoja para que se fusionen.</div></div>' : ''}

      <div class="ops-rank ops-rank-emergency" style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;">
        <div style="font-weight:700;color:#c0392b;margin-bottom:8px;">🚨 Ranking Emergencias</div>
        ${rankList(topEmerg,'rk_emerg',p=>p.emergencias,'emerg.','#c0392b')}
      </div>
      <div class="ops-rank ops-rank-activity" style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;">
        <div style="font-weight:700;color:#1e8449;margin-bottom:8px;">🎯 Ranking Actividades</div>
        ${rankList(topActiv,'rk_activ',p=>this._r1(p.horasActividades)+'h','activ.','#1e8449')}
      </div>
      <button onclick="app._imprimirReporteGeneral()" style="background:#6e2fa0;color:#fff;border:none;border-radius:12px;padding:14px;cursor:pointer;width:100%;font-weight:700;margin-bottom:8px;">🖨️ Imprimir Informe General</button>`;
    // v1.43: las cifras de las tarjetas SUBEN desde 0.
    cont.querySelectorAll('.op-cifra').forEach(el => this._countUp(el, el.textContent));
  },

  _renderPorUnidad() {
    const cont = document.getElementById('operContenidoFiltrado');
    if (!cont) return;
    // v5.87 (trampa §4.3): una fila sin nombre tronaba localeCompare y
    // rompía TODO el render de "Por Unidad" — String(...||'') lo blinda.
    const d = [...this._operData].sort((a,b) => String(a.nombre||'').localeCompare(String(b.nombre||'')));
    const mesNombre = this._operMes ? ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][parseInt(this._operMes)-1] : 'Todo el año';

    cont.innerHTML = `
      <div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:10px;">
        <input type="text" placeholder="Buscar bombero..." oninput="app._filtrarUnidades(this.value)"
          style="width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box;">
      </div>
      <div id="listaUnidades">
        ${d.map(p => this._cardUnidad(p, mesNombre)).join('')}
      </div>
      <button onclick="app._imprimirReportePorUnidad()" style="background:#6e2fa0;color:#fff;border:none;border-radius:12px;padding:14px;cursor:pointer;width:100%;font-weight:700;margin-top:8px;margin-bottom:4px;">🖨️ Imprimir Informe por Unidad</button>
      <button onclick="app._operVista='general';app.cargarOperatividad()" style="background:#f0f0f0;color:#333;border:none;border-radius:12px;padding:12px;cursor:pointer;width:100%;font-weight:700;margin-bottom:8px;">← Ver Resumen General</button>`;
  },

  _filtrarUnidades(q) {
    const lista = document.getElementById('listaUnidades');
    if (!lista) return;
    const mesNombre = this._operMes ? ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][parseInt(this._operMes)-1] : 'Todo el año';
    const filtrado = this._operData.filter(p => String(p.nombre||'').toUpperCase().includes(String(q||'').toUpperCase()));
    lista.innerHTML = filtrado.map(p => this._cardUnidad(p, mesNombre)).join('');
  },

  _cardUnidad(p, mesNombre) {
    const pts = this._r1(p.emergencias*2 + p.horasActividades);
    const nom = String(p.nombre||'');
    const uid = 'u_'+nom.replace(/[^a-zA-Z]/g,'').substring(0,12);
    return '<div class="ops-unit" style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;border-left:4px solid #6e2fa0;">'
      +'<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">'
      +'<div><div style="font-weight:700;font-size:15px;">'+app._esc(nom||'(sin nombre)')+'</div>'
      +'<div style="font-size:12px;color:#666;">CC: '+app._esc(p.cedula||'-')+'</div>'
      +(p.enBase===false?'<div style="font-size:11px;background:#fff8e1;color:#8d6e00;border:1px solid #f9a825;border-radius:6px;padding:2px 6px;margin-top:3px;display:inline-block;">⚠️ No cruza con la base (revisar escritura)</div>':'')
      +'</div>'
      +'<div style="text-align:right;"><div style="font-weight:700;color:#6e2fa0;font-size:16px;">'+pts+' pts</div>'
      +'</div></div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">'
      +'<div class="ops-unit-metric" style="background:#fff5f5;border-radius:8px;padding:8px;text-align:center;cursor:pointer;" data-tipo="emerg" data-uid="'+uid+'" data-nom="'+encodeURIComponent(nom)+'" data-ced="'+encodeURIComponent(String(p.cedula||''))+'" onclick="app._expandirDetalle(this.dataset.tipo,this.dataset.uid,decodeURIComponent(this.dataset.nom),decodeURIComponent(this.dataset.ced))">'
      +'<div style="font-size:18px;font-weight:700;color:#c0392b;">'+p.emergencias+'</div>'
      +'<div style="font-size:10px;color:#c0392b;text-decoration:underline;">Ver emerg.</div></div>'
      +'<div class="ops-unit-metric" style="background:#f0f8f4;border-radius:8px;padding:8px;text-align:center;cursor:pointer;" data-tipo="activ" data-uid="'+uid+'" data-nom="'+encodeURIComponent(nom)+'" data-ced="'+encodeURIComponent(String(p.cedula||''))+'" onclick="app._expandirDetalle(this.dataset.tipo,this.dataset.uid,decodeURIComponent(this.dataset.nom),decodeURIComponent(this.dataset.ced))">'
      +'<div style="font-size:18px;font-weight:700;color:#1e8449;">'+this._r1(p.horasActividades)+'h</div>'
      +'<div style="font-size:10px;color:#1e8449;text-decoration:underline;">Ver activ.</div></div>'
      +'</div>'
      +'<div id="'+uid+'_det" style="display:none;margin-bottom:8px;"></div>'
      +'</div>';
  },

  async _expandirDetalle(tipo, uid, nombre, cedula) {
    const cont = document.getElementById(uid+'_det');
    if (!cont) return;
    if (cont.style.display!=='none' && cont.dataset.tipo===tipo) { cont.style.display='none'; return; }
    cont.style.display='block'; cont.dataset.tipo=tipo;
    cont.innerHTML = app._cargador('Cargando…');
    const accion = tipo==='emerg'?'obtenerEmergenciasPersona':'obtenerActividadesPersona';
    try {
      const resp=await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:JSON.stringify({accion,nombre,cedula:cedula||'',mes:this._operMes,anio:this._operAnio})});
      const data=await resp.json();
      if(!data.ok){cont.innerHTML='<div style="font-size:12px;color:#c00;padding:4px;">Error: '+app._esc(data.error)+'</div>';return;}
      const borderColor = tipo==='emerg'?'#c0392b':tipo==='activ'?'#1e8449':'#e67e22';
      let html='<div style="background:#fafafa;border-radius:8px;padding:8px;border-top:2px solid '+borderColor+'">';
      if(tipo==='emerg'){
        const lista=data.emergencias||[];
        if(!lista.length){html+='<div style="font-size:12px;color:#999;text-align:center;padding:4px;">Sin emergencias en este período</div>';}
        else lista.forEach(e=>{html+='<div style="padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:12px;"><strong style="color:#c0392b;">'+app._esc(e.consecutivo)+'</strong><span style="float:right;font-size:11px;color:#666;">'+app._esc(e.fecha)+'</span><div style="color:#555;">'+app._esc(e.tipo)+'</div></div>';});
      }else if(tipo==='activ'){
        const lista=data.actividades||[];
        if(!lista.length){html+='<div style="font-size:12px;color:#999;text-align:center;padding:4px;">Sin actividades en este período</div>';}
        else lista.forEach(a=>{html+='<div style="padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:12px;"><strong style="color:#1e8449;">'+app._esc(a.tipo||'Actividad')+'</strong><span style="float:right;font-weight:700;color:#1e8449;">'+app._esc(a.horas)+'h</span><div style="color:#555;">'+app._esc(String(a.descripcion||'').substring(0,50))+'</div><div style="font-size:11px;color:#999;">📅 '+app._esc(a.fecha)+'</div></div>';});
      }else{
        const lista=data.domingos||[];
        if(!lista.length){html+='<div style="font-size:12px;color:#999;text-align:center;padding:4px;">Sin domingos en este período</div>';}
        else lista.forEach(d=>{html+='<div style="padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:12px;"><strong style="color:#e67e22;">📅 '+app._esc(d.fecha)+'</strong>'+(d.tipo?'<span style="float:right;font-size:11px;color:#666;">'+app._esc(d.tipo)+'</span>':'')+(d.tema?'<div style="color:#555;">'+app._esc(d.tema)+'</div>':'')+(d.lugar?'<div style="font-size:11px;color:#999;">📍 '+app._esc(d.lugar)+'</div>':'')+'</div>';});
      }
      html+='</div>'; cont.innerHTML=html;
    }catch(e){cont.innerHTML='<div style="font-size:12px;color:#c00;padding:4px;">Error de red</div>';}
  },


  // v5.63 (anti-fallas APK): window.prompt() NO funciona en el APK Android.
  // Modal propio para pedir la contraseña admin. Devuelve Promise<string|null>.
  _pedirPwdAdmin(mensaje) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.className = 'modal-js';   // sin esto ninguna regla CSS lo alcanza
      modal.innerHTML = '<div id="_pwdAdmCaja" style="background:#fff;border-radius:16px;padding:24px;max-width:320px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
        + '<div style="font-size:15px;font-weight:700;color:#333;margin-bottom:12px;text-align:center;">'+(mensaje||'🔐 Contraseña de administrador')+'</div>'
        + '<input id="_pwdAdmInput" type="password" autocomplete="current-password" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;margin-bottom:8px;" placeholder="Contraseña">'
        // acá se escribe el motivo exacto del rechazo. Nace oculto y su texto se
        // pone con textContent, nunca con innerHTML (I5).
        + '<div id="_pwdAdmErr" style="display:none;color:#c0392b;font-size:13px;font-weight:600;text-align:center;margin-bottom:10px;"></div>'
        + '<div style="display:flex;gap:10px;">'
        + '<button id="_pwdAdmCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Cancelar</button>'
        + '<button id="_pwdAdmOk" style="flex:1;padding:12px;background:var(--rojo);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Entrar</button>'
        + '</div></div>';
      document.body.appendChild(modal);
      const inp = modal.querySelector('#_pwdAdmInput');
      setTimeout(() => { try { inp.focus(); } catch(e){} }, 50);
      const fin = (val) => { try { app._cerrarModalJS(modal); } catch(e){} resolve(val); };
      modal.querySelector('#_pwdAdmCancel').onclick = () => fin(null);

      /* ═══ LA CONTRASEÑA SE COMPRUEBA ACÁ, NO DESPUÉS ═══
         Lo reportó Jeferson: ponía una contraseña equivocada, no salía ningún
         aviso, la app seguía de largo hasta el PIN y recién al final tiraba un
         "No autorizado" seco. La causa: nadie validaba la contraseña en el
         momento; se guardaba y el error aparecía mucho más tarde, en la acción
         real y sin decir cuál de las tres cosas falló (contraseña, identidad o
         pase). Ahora se pregunta al servidor antes de dejar pasar, y si está
         mal el modal SE QUEDA ABIERTO para reintentar sin perder el camino. */
      const caja  = modal.querySelector('#_pwdAdmCaja');
      const err   = modal.querySelector('#_pwdAdmErr');
      const btnOk = modal.querySelector('#_pwdAdmOk');
      let ocupado = false;
      const mostrarError = (txt) => {
        err.textContent = txt;                 // textContent, no innerHTML (I5)
        err.style.display = 'block';
        inp.style.borderColor = '#c0392b';
        caja.classList.remove('sacudir');
        void caja.offsetWidth;                 // reflow: sin esto, dos errores
        caja.classList.add('sacudir');    // seguidos no re-disparan la animación
        try { inp.focus(); inp.select(); } catch(e) {}
      };
      const intentar = async () => {
        if (ocupado) return;                   // anti doble toque dentro del modal
        const val = inp.value || '';
        if (!val.trim()) { mostrarError('Escribe la contraseña.'); return; }
        ocupado = true;
        const htmlPrev = btnOk.innerHTML;
        btnOk.disabled = true; btnOk.style.opacity = '0.65';
        btnOk.innerHTML = '<span class="ld-sincro"></span> Verificando...';
        err.style.display = 'none';
        try {
          const r = await fetch(URL_BACKEND, { method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ accion: 'verificarPwdAdmin',
              adminEmail: (this.usuario && this.usuario.email) || '', adminPassword: val }) });
          const d = await r.json();
          if (d && d.ok) { fin(val); return; }
          /* ANTI-BLOQUEO, mismo criterio que _pinSoportado (v6.03): si el backend
             desplegado es anterior a esta versión no conoce `verificarPwdAdmin`,
             y si acá se rechazara, NADIE podría entrar al Panel nunca. En ese
             caso se deja pasar y que valide la acción real, como hasta v6.08. */
          if (/no reconocid/i.test(String((d && d.error) || ''))) { fin(val); return; }
          mostrarError(String((d && d.error) || 'Contraseña incorrecta.'));
        } catch (e) {
          // Sin señal no se puede comprobar — y tampoco serviría de nada seguir,
          // porque la acción de admin también viaja al servidor.
          mostrarError('Sin conexión: no se pudo comprobar la contraseña.');
        } finally {
          ocupado = false;
          btnOk.disabled = false; btnOk.style.opacity = '';
          btnOk.innerHTML = htmlPrev;
        }
      };
      btnOk.onclick = intentar;
      inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') intentar(); });
      inp.addEventListener('input', () => { inp.style.borderColor = '#ddd'; err.style.display = 'none'; });
    });
  },

  /* v6.04: modal para pedir UN dato de texto. Lo reportó Jeferson: hasta v6.03 se
     reusaba _pedirPwdAdmin para pedir nombres, cédulas y correos, así que al
     agregar un operador salía un campo de CONTRASEÑA (con puntitos, sin poder leer
     lo escrito) y un botón que decía "Entrar". Un modal de contraseña no sirve
     para pedir un nombre; ahora cada cosa usa el suyo.
     opts: { tipo, placeholder, boton, maxlength, inputmode, centrado, valor } */
  _pedirTexto(titulo, opts) {
    const o = opts || {};
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.className = 'modal-js';   // sin esto ninguna regla CSS lo alcanza
      const attrs = (o.maxlength ? ' maxlength="' + o.maxlength + '"' : '')
                  + (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '');
      // El título va como HTML a propósito (los llamadores le pasan un <div> con
      // la explicación), pero SIEMPRE es un literal del código, nunca texto de
      // usuario. El valor y el placeholder sí pasan por _esc (I5).
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:340px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
        + '<div style="font-size:15px;font-weight:700;color:#333;margin-bottom:12px;text-align:center;">' + (titulo || '') + '</div>'
        + '<input id="_txtInput" type="' + (o.tipo || 'text') + '" autocomplete="off"' + attrs
        +   ' value="' + app._esc(o.valor || '') + '"'
        +   ' style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;margin-bottom:14px;'
        +   (o.centrado ? 'text-align:center;letter-spacing:6px;font-size:22px;' : '') + '"'
        +   ' placeholder="' + app._esc(o.placeholder || '') + '">'
        + '<div style="display:flex;gap:10px;">'
        + '<button id="_txtCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Cancelar</button>'
        + '<button id="_txtOk" style="flex:1;padding:12px;background:#1e8449;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">' + app._esc(o.boton || 'Guardar') + '</button>'
        + '</div></div>';
      document.body.appendChild(modal);
      const inp = modal.querySelector('#_txtInput');
      setTimeout(() => { try { inp.focus(); } catch(e){} }, 50);
      const fin = (v) => { try { app._cerrarModalJS(modal); } catch(e){} resolve(v); };
      modal.querySelector('#_txtCancel').onclick = () => fin(null);
      modal.querySelector('#_txtOk').onclick = () => fin(inp.value || '');
      inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') fin(inp.value || ''); });
    });
  },

  // v5.63: obtiene la contraseña admin de la sesión o la pide con modal (APK-safe)
  async _obtenerPwdAdmin(mensaje, contexto) {
    /* v6.03: LA FIRMA ES OBLIGATORIA. Sin PIN no se ejerce como admin.
       Se controla desde acá porque es el único portón por el que pasan TODAS las
       acciones de administrador. Devolver null bloquea el flujo entero sin tener
       que tocar las ~15 pantallas que llaman a esta función: todas ya hacen
       `if (!pwd) return;`.
       Reportar emergencias NO pasa por acá, así que eso sigue funcionando sin PIN. */
    if (this._adminPwdSession) return (await this._exigirFirma(contexto)) ? this._adminPwdSession : null;
    try { const s = sessionStorage.getItem('adm_pwd'); if (s) { this._adminPwdSession = s; return (await this._exigirFirma(contexto)) ? s : null; } } catch(e) {}
    const pwd = await this._pedirPwdAdmin(mensaje);
    if (!pwd || !pwd.trim()) return null;
    this._adminPwdSession = pwd.trim();
    try { sessionStorage.setItem('adm_pwd', this._adminPwdSession); } catch(e) {}
    return (await this._exigirFirma(contexto)) ? this._adminPwdSession : null;
  },

  /* OLVIDAR LA CONTRASEÑA — las DOS copias.
     El bug que dejaba trancada la app: la contraseña vive en dos lados (memoria
     y sessionStorage) y al fallar solo se limpiaba la de memoria. En la
     siguiente vuelta se leía otra vez desde sessionStorage y NUNCA se volvía a
     preguntar: bucle infinito de "No autorizado" del que solo se salía cerrando
     la app. */
  _olvidarPwdAdmin() {
    this._adminPwdSession = null;
    try { sessionStorage.removeItem('adm_pwd'); } catch(e) {}
  },

  // Devuelve true solo si hay una firma verificada en esta sesión.
  async _exigirFirma(contexto) {
    /* ═══ EL FUNDADOR NO PUEDE QUEDAR AFUERA DE SU PROPIA INSTALACIÓN ═══

       Lo reportó Jeferson el 15/08/2026 probando la instalación de un cuerpo nuevo:
       acababa de instalar, entró como fundador, y el Panel Admin le pidió un PIN.
       Pero los PINes los asigna el administrador DESDE el Panel Admin. Círculo cerrado:
       la instalación quedaba inutilizable el mismo minuto de nacer.

       Es el mismo callejón que tenía ADMIN_PASSWORD, y por el mismo motivo: se diseñó
       pensando en una estación que YA venía funcionando, donde los PINes existían desde
       antes. En una instalación nueva no existe ninguno.

       El PIN resuelve un problema concreto: el celular de la guardia tiene UNA sesión de
       Google compartida por varias personas, así que la cuenta no dice quién operó. Al
       fundador eso no le aplica: entró con SU cuenta, verificada por Google. Pedirle un
       PIN además no agrega trazabilidad — solo lo deja afuera. */
    if (this.esSuperAdmin()) return true;

    /* ═══ FIRMA APAGADA = LA IDENTIDAD DE GOOGLE BASTA ═══
       En el producto cada admin entra con su propia cuenta, así que ya se sabe quién es.
       El PIN solo suma cuando VARIAS personas comparten un teléfono; ese cuerpo lo
       enciende (FIRMA_OPERADOR='SI' en el backend). Mientras esté apagado —el caso normal—
       no se pide nada: pedirlo dejaba al segundo admin fuera igual que al fundador. */
    if (!this._firmaObligatoria) return true;

    const oper = await this._obtenerOperador(contexto);
    if (oper) {
      // Avisar una vez si se pasó sin firmar por backend antiguo, para que no
      // parezca que la firma está funcionando cuando en realidad no se aplicó.
      if (this._pinSoportado === false && !this._avisoPinBackend) {
        this._avisoPinBackend = true;
        this.toast('El servidor todavía no tiene la versión con PIN: se entró sin firmar. Actualiza el backend.', 'info');
      }
      return true;
    }
    this.toast('Sin PIN no puedes hacer acciones de administrador. Pídele tu PIN al administrador principal.', 'error');
    return false;
  },

  /* ═══════ v6.01: FIRMA DE QUIÉN ESTÁ OPERANDO ═══════
     El celular de la guardia tiene la sesión de admin y la guardia ROTA. La
     contraseña también es una sola para todos. O sea que ni el correo ni la
     contraseña dicen quién hizo qué. Esto pide el nombre UNA VEZ por sesión y el
     interceptor de fetch lo manda en cada llamada; el backend lo escribe en el
     log de auditoría.

     ES UNA FIRMA, NO UNA AUTENTICACIÓN: se puede poner otro nombre. Sirve para
     (a) dejar constancia explícita, (b) el freno de tener que escribir un nombre
     propio antes de tocar sanciones, y (c) cruzar contra el registro de guardia
     del domingo, que la app ya guarda. NO bloquea: si se cancela, la acción sigue
     y el log queda marcado como "operador NO declarado", que en sí es una señal. */
  /* ═══════ LA FIRMA CADUCA ═══════
     Lo planteó Jeferson con el caso exacto: *"yo puedo estar de comandante de
     guardia, tengo el celular, inicié sesión con usuario y PIN, lo dejé en la
     mesa, y otra persona entró e hizo cambios a mi nombre."* Con la firma
     pegada, el log culpa al que firmó, no al que operó — o sea que la auditoría
     miente, que es peor que no tenerla.

     DOS CANDADOS:
     1. **Al cerrar la app.** La firma pasó a vivir SOLO EN MEMORIA. Antes se
        guardaba `{nombre, cédula, PIN}` en sessionStorage EN TEXTO PLANO y
        sobrevivía a recargas. El criterio correcto ya estaba escrito unas líneas
        más abajo para la llave de comandancia ("si se guardara, quedaría viva en
        el celular de la guardia después de una recarga") — solo que nunca se le
        había aplicado al PIN, que es justamente lo que identifica a la persona.
        De paso, el PIN deja de estar escrito en el teléfono.
     2. **30 minutos sin usarla.** Se refresca sola con cada llamada al servidor
        (ver el interceptor), así que a nadie trabajando se le vence en la mano;
        vence cuando el celular quedó solo, que es el caso que preocupa.

     Límite honesto: el reloj lo pone el teléfono y se puede cambiar a mano. Esto
     es un control de orden interno —que el log diga la verdad—, no una barrera
     contra alguien decidido. Ese ya es otro problema y no se resuelve acá. */
  _FIRMA_MS: 30 * 60 * 1000,

  _firmaVencida() {
    if (!this._operadorSesion) return false;
    if (!this._firmaTs) return false;
    return (Date.now() - this._firmaTs) > this._FIRMA_MS;
  },

  _tocarFirma() { if (this._operadorSesion) this._firmaTs = Date.now(); },

  _borrarFirma() {
    this._operadorSesion = null; this._operadorCedula = null;
    this._operadorPin = null; this._operadorLlave = null; this._firmaTs = 0;
    try { sessionStorage.removeItem('app_oper'); } catch(e) {}
  },

  async _obtenerOperador(contexto) {
    if (this._firmaVencida()) {
      this._borrarFirma();
      this.toast('🔒 Pasaron 30 minutos sin actividad: vuelve a firmar con tu PIN.', 'info');
    }
    if (this._operadorSesion) { this._tocarFirma(); return this._operadorSesion; }
    // Ya NO se lee de sessionStorage. Se limpia lo que hubiera quedado de una
    // versión anterior, para que un PIN viejo guardado en texto plano no siga
    // dando firma después de actualizar.
    try { sessionStorage.removeItem('app_oper'); } catch(e) {}
    /* v6.03 ANTI-BLOQUEO — comprobar que el backend sepa de PINes ANTES de exigirlos.
       Si el backend desplegado es anterior a v5.96 no conoce la acción
       `verificarOperador`, así que nadie podría firmar nunca... y como la firma es
       obligatoria, NADIE podría entrar al Panel — ni para asignar el primer PIN.
       Ese candado sin llave es peor que la falta de firma, así que en ese caso se
       deja pasar sin firmar y se avisa. Se comprueba una sola vez por sesión.
       Sin red NO se degrada: ahí el problema es la red, y el modal ya lo dice. */
    if (this._pinSoportado === undefined) {
      try {
        const r0 = await fetch(URL_BACKEND, { method:'POST',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify({ accion:'verificarOperador' }) });
        const d0 = await r0.json();
        this._pinSoportado = !/no reconocid/i.test(String((d0 && d0.error) || ''));
      } catch (e) { this._pinSoportado = true; }
    }
    if (this._pinSoportado === false) {
      this._operadorSesion = '(sin verificar — backend sin PIN)';
      return this._operadorSesion;
    }
    const r = await this._pedirOperador(contexto);
    if (!r) return null;   // v6.03: ahora SÍ bloquea (ver _exigirFirma)
    this._operadorSesion = r.nombre; this._operadorCedula = r.cedula; this._operadorPin = r.pin;
    /* v6.03: la llave de comandancia vive SOLO en memoria, nunca en sessionStorage.
       Es la contraseña del administrador principal: si se guardara, quedaría viva
       en el celular de la guardia después de una recarga. Con esto, quien la usó
       tiene que volver a ponerla si la app se reinicia. */
    this._operadorLlave = r.llave || '';
    /* La firma tampoco se guarda ya. Antes acá iba un setItem que dejaba el PIN
       escrito en texto plano en el teléfono de la guardia y hacía que la firma
       sobreviviera a cerrar la app. Mismo criterio que la llave de comandancia
       de la línea de arriba: memoria y nada más. */
    this._firmaTs = Date.now();
    return r.nombre;
  },

  /* v6.02: el relevo de guardia firma de nuevo sin tener que cerrar la app.
     Si no existiera esto, el turno entrante quedaría operando bajo la firma del
     turno saliente — justo lo que el PIN vino a evitar. */
  async cambiarOperador() {
    this._borrarFirma();   // una sola función limpia las 5 cosas
    const nom = await this._obtenerOperador('panelAdmin');
    if (nom) this.toast('🪪 Ahora opera: ' + nom, 'exito');
    const et = document.getElementById('operActualTxt');
    if (et) et.textContent = nom || 'sin firmar';
  },

  // Autocompletado del modal de firma. Guarda la cédula en el dataset del input:
  // el PIN se valida contra la CÉDULA, no contra el nombre escrito.
  _buscarOperadorSug(q) {
    const sug = document.getElementById('_operSug');
    if (!sug) return;
    if (!q || q.trim().length < 1) { sug.style.display = 'none'; return; }
    clearTimeout(this._t_operSug);
    this._t_operSug = setTimeout(async () => {
      try {
        const resp = await fetch(URL_BACKEND, { method:'POST',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          // v6.06: `incluirAdministrativos` trae también a la Secretaría y demás
          // operadores administrativos, que viven en otra hoja y no salían acá.
          // Solo lo pide ESTE modal: en el autocompletado de reportes y
          // actividades no deben aparecer (no son unidades bomberiles).
          body: JSON.stringify({ accion:'buscarPersonal', q: q.trim(), incluirAdministrativos: true }) });
        const data = await resp.json();
        if (!data.ok || !data.resultados.length) {
          // v6.06: antes se ocultaba la lista y quedaba una pantalla muda: la
          // persona escribía su nombre, no pasaba nada, y no había forma de saber
          // si estaba mal escrito, si no tenía PIN o si la app estaba rota.
          sug.innerHTML = '<div style="padding:10px 12px;font-size:12px;color:#92400e;line-height:1.45;">'
            + 'No encuentro ese nombre. Escríbelo como está registrado, o pídele al '
            + 'administrador principal que te dé de alta y te asigne un PIN.</div>';
          sug.style.display = 'block';
          return;
        }
        sug.innerHTML = data.resultados.map(per =>
          '<div data-n="'+app._esc(per.nombre||'')+'" data-c="'+app._esc(per.cedula||'')+'" '
          + 'onclick="var i=document.getElementById(\'_operInput\');i.value=this.dataset.n;i.dataset.ced=this.dataset.c;'
          + 'document.getElementById(\'_operSug\').style.display=\'none\';document.getElementById(\'_operPin\').focus();" '
          + 'style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:14px;">'+app._esc(per.nombre||'')
          + '<span style="color:#999;font-size:11px;margin-left:6px;">CC:'+app._esc(per.cedula||'-')+'</span></div>'
        ).join('');
        sug.style.display = 'block';
      } catch(e) { sug.style.display = 'none'; }
    }, 350);
  },

  _pedirOperador(contexto) {
    /* v1.37 (deuda portada de la app de referencia): al Panel Admin NO entra la
       guardia, entran administradores — preguntar "quién está de guardia" ahí
       confundía a Jeferson (guardias no llegan a este modal desde ese flujo).
       En sanciones/asistencia/etc. sí opera la guardia, así que ahí el texto
       original sigue aplicando sin cambios. */
    const esPanel = contexto === 'panelAdmin';
    const titulo = esPanel ? '🪪 ¿Qué administrador entra?' : '🪪 ¿Quién está de guardia?';
    const cuerpo = esPanel
      ? 'Este teléfono puede compartirse entre varios administradores. Su nombre queda registrado junto a lo que haga en el Panel. Por eso hace falta <b>su PIN</b> — así nadie firma en su nombre.'
      : 'Cuando varias personas comparten el mismo teléfono, la cuenta de Google no alcanza para saber quién hizo qué. Su nombre queda registrado junto a cada informe, actividad o edición que haga. Por eso el <b>PIN</b>: para que nadie pueda firmar en su nombre.';
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.className = 'modal-js';   // sin esto ninguna regla CSS lo alcanza
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:22px;max-width:340px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
        + '<div style="font-size:15px;font-weight:700;color:#333;margin-bottom:6px;text-align:center;">' + titulo + '</div>'
        + '<div style="font-size:11px;color:#666;margin-bottom:12px;text-align:center;line-height:1.45;">' + cuerpo + '</div>'
        + '<div style="position:relative;">'
        + '<input id="_operInput" type="text" autocomplete="off" oninput="app._buscarOperadorSug(this.value)" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;" placeholder="Escribe tu nombre y tócalo">'
        + '<div id="_operSug" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:8px;z-index:100;box-shadow:0 4px 8px rgba(0,0,0,.15);max-height:150px;overflow-y:auto;"></div>'
        + '</div>'
        + '<input id="_operPin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:20px;margin-top:10px;text-align:center;letter-spacing:8px;" placeholder="PIN">'
        + '<div id="_operErr" style="display:none;color:#c00;font-size:12px;margin-top:8px;text-align:center;font-weight:600;"></div>'
        + '<div style="display:flex;gap:10px;margin-top:14px;">'
        + '<button id="_operSkip" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:13px;">Cancelar</button>'
        + '<button id="_operOk" style="flex:1;padding:12px;background:#1e8449;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Firmar</button>'
        + '</div>'
        + '<div style="font-size:10px;color:#999;margin-top:12px;text-align:center;line-height:1.5;">Sin PIN no puedes hacer acciones de administrador.<br>¿No tienes PIN o lo olvidaste? Pídeselo al administrador principal.</div>'
        + '<div style="text-align:center;margin-top:10px;"><span id="_operLlave" style="font-size:11px;color:#92400e;text-decoration:underline;cursor:pointer;">🎖️ Usar llave de comandancia</span></div>'
        + '</div>';
      document.body.appendChild(modal);
      const inp = modal.querySelector('#_operInput');
      const pin = modal.querySelector('#_operPin');
      const err = modal.querySelector('#_operErr');
      const btn = modal.querySelector('#_operOk');
      setTimeout(() => { try { inp.focus(); } catch(e){} }, 50);
      const fin = (val) => { try { app._cerrarModalJS(modal); } catch(e){} resolve(val); };
      /* v1.40: el error ahora SACUDE la caja (como el modal de contraseña) además de
         mostrar el texto — antes un PIN malo no daba ninguna señal de movimiento. */
      const mostrarErr = (t) => {
        err.textContent = t; err.style.display = 'block';
        const caja = modal.querySelector('div');
        if (caja) { caja.classList.remove('sacudir'); void caja.offsetWidth; caja.classList.add('sacudir'); }
      };
      const intentar = async () => {
        const ced = inp.dataset.ced || '';
        const p = (pin.value || '').trim();
        if (!ced) { mostrarErr('Toca tu nombre en la lista que aparece al escribir.'); return; }
        if (!/^\d{4}$/.test(p)) { mostrarErr('El PIN son 4 dígitos.'); return; }
        // v1.40: spinner girando en "Verificando..." (igual que _pedirPwdAdmin).
        btn.disabled = true; btn.style.opacity = '0.65'; btn.innerHTML = '<span class="ld-sincro"></span> Verificando...';
        try {
          // Se valida ANTES de aceptar la firma, para avisar en el momento y no
          // dejar que la guardia opere creyendo que quedó firmada cuando no.
          const resp = await fetch(URL_BACKEND, { method:'POST',
            headers:{'Content-Type':'text/plain;charset=utf-8'},
            body: JSON.stringify({ accion:'verificarOperador', cedula: ced, pin: p }) });
          const d = await resp.json();
          if (!d.ok) { mostrarErr(d.error || 'PIN incorrecto.'); btn.disabled = false; btn.style.opacity=''; btn.textContent='Firmar'; return; }
          fin({ nombre: d.nombre, cedula: ced, pin: p });
        } catch (e) {
          mostrarErr('Sin conexión para verificar el PIN. Intenta de nuevo.');
          btn.disabled = false; btn.style.opacity=''; btn.textContent='Firmar';
        }
      };
      modal.querySelector('#_operSkip').onclick = () => fin(null);
      btn.onclick = intentar;
      pin.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') intentar(); });
      /* v6.03 LLAVE DE COMANDANCIA — salida de emergencia para cuando una unidad
         de guardia todavía no tiene PIN y el administrador principal no está.
         Solo él tiene esta contraseña. Queda registrada como EXCEPCIÓN en el log,
         así que si se empieza a usar seguido se ve. */
      modal.querySelector('#_operLlave').onclick = async () => {
        const llave = await this._pedirTexto('🎖️ Llave de comandancia<div style="font-size:11px;font-weight:400;color:#666;margin-top:6px;">Solo para cuando no tienes PIN asignado y el administrador principal no está disponible. Queda registrado como excepción.</div>',
          { tipo:'password', placeholder:'Llave de comandancia', boton:'Desbloquear' });
        if (!llave || !llave.trim()) return;
        mostrarErr('');
        err.style.display = 'none';
        try {
          const resp = await fetch(URL_BACKEND, { method:'POST',
            headers:{'Content-Type':'text/plain;charset=utf-8'},
            body: JSON.stringify({ accion:'verificarOperador', llaveComandancia: llave.trim() }) });
          const d = await resp.json();
          if (!d.ok) { mostrarErr(d.error || 'Llave incorrecta.'); return; }
          fin({ nombre: d.nombre, cedula: '', pin: '', llave: llave.trim() });
        } catch (e) { mostrarErr('Sin conexión para verificar la llave.'); }
      };
    });
  },

  _confirmarAccion(mensaje, onConfirmar) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.className = 'modal-js';   // sin esto ninguna regla CSS lo alcanza
    modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:320px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
      + '<div style="font-size:15px;font-weight:700;color:#333;margin-bottom:16px;text-align:center;">'+mensaje+'</div>'
      + '<div style="display:flex;gap:10px;">'
      + '<button id="_modCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Cancelar</button>'
      + '<button id="_modConfirm" style="flex:1;padding:12px;background:#c0392b;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Eliminar</button>'
      + '</div></div>';
    document.body.appendChild(modal);
    document.getElementById('_modCancel').onclick = () => app._cerrarModalJS(modal);
    document.getElementById('_modConfirm').onclick = () => { app._cerrarModalJS(modal); onConfirmar(); };
  },

  async eliminarActividad(id, tipo) {
    this._confirmarAccion('\u00BFEliminar actividad "'+tipo+'"?', async () => {
      if (!this._eliminandoIds) this._eliminandoIds = new Set();
      if (this._eliminandoIds.has(id)) return; // v5.64 (BUG 2): anti doble-click
      this._eliminandoIds.add(id);
      try {
        const _pwd = await this._obtenerPwdAdmin('🔐 Contraseña de administrador');
        if (!_pwd) return;
        this.toast('Eliminando...','info');
        const r=await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
          body:JSON.stringify({accion:'eliminarActividad',id,adminEmail:this.usuario.email,adminPassword:this._adminPwdSession})});
        const d=await r.json();
        if(!d.ok)throw new Error(d.error);
        this.toast('\u2705 Actividad eliminada','exito');
        setTimeout(()=>this.cargarListaActividades(),800);
      }catch(e){this.toast('Error: '+e.message,'error');}
      finally { this._eliminandoIds.delete(id); }
    });
  },


  _imprimirReporteGeneral() {
    const d = this._operData;
    const mesNombre = this._operMes ? ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][parseInt(this._operMes)-1] : 'Todo el año';
    const top = [...d].sort((a,b)=>(b.emergencias*2+b.horasActividades)-(a.emergencias*2+a.horasActividades));
    // opener nulo, NO 'noopener' — ver nota en _imprimirReporteEnVentanaNueva.
    const w = window.open('', '_blank', 'width=900,height=1200');
    if (!w) { this.toast('El navegador bloqueó la ventana. Permita pop-ups e intente de nuevo.', 'error'); return; }
    try { w.opener = null; } catch (e) {}
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Informe General Operatividad — ${mesNombre} ${this._operAnio}</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:11pt;margin:15mm;}
        h1{color:#6e2fa0;font-size:15pt;margin-bottom:4px;}
        h2{color:#333;font-size:12pt;border-bottom:2px solid #6e2fa0;padding-bottom:4px;margin-top:16px;}
        .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:12px 0;}
        .stat{border:1px solid #ddd;border-radius:8px;padding:10px;text-align:center;}
        .stat .num{font-size:20pt;font-weight:700;color:#6e2fa0;}
        .stat .lbl{font-size:9pt;color:#666;}
        table{width:100%;border-collapse:collapse;margin:8px 0;font-size:10pt;}
        th{background:#6e2fa0;color:#fff;padding:7px 8px;text-align:left;}
        td{padding:6px 8px;border-bottom:1px solid #eee;}
        tr:nth-child(even){background:#f9f9f9;}
        .alerta{background:#ffebee;color:#c00;padding:2px 6px;border-radius:4px;font-size:9pt;}
        footer{margin-top:20px;font-size:9pt;color:#999;text-align:center;}
        @media print{body{margin:8mm;}}
      </style></head><body>
      <h1>📊 Informe de Operatividad Institucional</h1>
      <p style="color:#666;margin:0 0 12px;">Período: <strong>${mesNombre} ${this._operAnio}</strong> | ${app._esc(app._inst().nombre || '')}</p>
      <div class="stats">
        <div class="stat"><div class="num">${d.length}</div><div class="lbl">Unidades con registros</div></div>
        <div class="stat"><div class="num">${this._operStats ? this._operStats.totalEmergenciasUnicas : d.reduce((s,p)=>s+p.emergencias,0)}</div><div class="lbl">Emergencias únicas</div></div>
        <div class="stat"><div class="num">${this._r1(this._operStats && this._operStats.totalHorasActividades !== undefined ? this._operStats.totalHorasActividades : d.reduce((s,p)=>s+p.horasActividades,0))}h</div><div class="lbl">Horas en actividades</div></div>
      </div>
      <h2>🏆 Ranking General</h2>
      <table><tr><th>#</th><th>Nombre</th><th>Incidentes</th><th>Horas Act.</th><th>Puntos</th></tr>
      ${top.map((p,i)=>{
        const pts=this._r1(p.emergencias*2+p.horasActividades);
        return `<tr><td>${i+1}</td><td><strong>${app._esc(p.nombre)}</strong></td><td style="text-align:center;">${p.emergencias}</td><td style="text-align:center;">${this._r1(p.horasActividades)}h</td><td style="text-align:center;font-weight:700;color:#6e2fa0;">${pts}</td></tr>`;
      }).join('')}
      </table>
      <footer>${app._esc(app._rotuloApp())} | Generado: ${new Date().toLocaleDateString('es-CO')}</footer>
      </body></html>`);
    w.document.close();
    setTimeout(()=>w.print(),800);
  },

  _imprimirReportePorUnidad() {
    const d = [...this._operData].sort((a,b)=>String(a.nombre||'').localeCompare(String(b.nombre||'')));
    const mesNombre = this._operMes ? ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][parseInt(this._operMes)-1] : 'Todo el año';
    // opener nulo, NO 'noopener' — ver nota en _imprimirReporteEnVentanaNueva.
    const w = window.open('', '_blank', 'width=900,height=1200');
    if (!w) { this.toast('El navegador bloqueó la ventana. Permita pop-ups e intente de nuevo.', 'error'); return; }
    try { w.opener = null; } catch (e) {}
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Informe por Unidad — ${mesNombre} ${this._operAnio}</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:11pt;margin:15mm;}
        h1{color:#6e2fa0;font-size:14pt;}
        .ficha{border:1px solid #ddd;border-radius:8px;padding:14px;margin-bottom:14px;page-break-inside:avoid;}
        .ficha-header{display:flex;justify-content:space-between;border-bottom:2px solid #6e2fa0;padding-bottom:8px;margin-bottom:10px;}
        .nombre{font-size:13pt;font-weight:700;}
        .pts{font-size:18pt;font-weight:700;color:#6e2fa0;}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0;}
        .item{border:1px solid #eee;border-radius:6px;padding:8px;text-align:center;}
        .item .num{font-size:16pt;font-weight:700;}
        .item .lbl{font-size:9pt;color:#666;}
        .alerta{background:#ffebee;color:#c00;padding:3px 8px;border-radius:4px;font-size:10pt;font-weight:700;}
        footer{margin-top:20px;font-size:9pt;color:#999;text-align:center;}
        @media print{body{margin:8mm;}.ficha{page-break-inside:avoid;}}
      </style></head><body>
      <h1>👤 Informe de Operatividad por Unidad</h1>
      <p style="color:#666;">Período: <strong>${mesNombre} ${this._operAnio}</strong> | ${app._esc(app._inst().nombre || '')}</p>
      ${d.map(p=>{
        const pts=this._r1(p.emergencias*2+p.horasActividades);
        return `<div class="ficha">
          <div class="ficha-header">
            <div><div class="nombre">${app._esc(p.nombre)}</div><div style="font-size:10pt;color:#666;">CC: ${app._esc(p.cedula||'-')} ${p.rango?'| '+app._esc(p.rango):''}</div></div>
            <div style="text-align:right;"><div class="pts">${pts} pts</div></div>
          </div>
          <div class="grid">
            <div class="item"><div class="num" style="color:#c0392b;">${p.emergencias}</div><div class="lbl">Emergencias</div></div>
            <div class="item"><div class="num" style="color:#1e8449;">${this._r1(p.horasActividades)}h</div><div class="lbl">En actividades</div></div>
          </div>
        </div>`;
      }).join('')}
      <footer>${app._esc(app._rotuloApp())} | Generado: ${new Date().toLocaleDateString('es-CO')}</footer>
      </body></html>`);
    w.document.close();
    setTimeout(()=>w.print(),800);
  },


  // ═══ v5.64 (BUG 4): pantalla "Mapa de Emergencias" (Leaflet + OSM, admin) ═══
  // Gratis, sin API key. Solo pinta reportes que SÍ tienen GPS guardado.
  abrirMapa() {
    if (!this.esAdmin()) { this.toast('Solo administradores pueden ver el mapa', 'error'); return; }
    this.irA('pantallaMapa');
  },

  _leafletMapa: null,

  // v5.65 (feature: banderas por color según tipo de emergencia).
  // v5.82: cada tipo lleva EMOJI dentro del pin (mucho más identificable que
  // el color solo) + paleta de colores con más contraste entre sí.
  // Un reporte puede tener varias clasificaciones marcadas — se usa la
  // PRIMERA que coincida en este orden de prioridad para pintar el pin.
  // v5.94: se suman los tipos nuevos con pin propio (incendio de interfaz,
  // búsqueda y rescate, traslado, abejas/avispas 🐝, árbol caído). El orden ES
  // la prioridad de color del pin cuando un reporte tiene varias casillas
  // marcadas — gana la primera que coincida.
  _MAPA_COLORES: [
    { tipo: 'Incendio estructural',              color: '#e65100', emoji: '🔥', etiqueta: 'Incendio' },
    { tipo: 'Incendio forestal',                 color: '#e65100', emoji: '🔥', etiqueta: 'Incendio' },
    { tipo: 'Incendio de interfaz',              color: '#bf360c', emoji: '🔥', etiqueta: 'Incendio de interfaz' },
    { tipo: 'Incendio en red eléctrica',         color: '#f57f17', emoji: '⚡', etiqueta: 'Red eléctrica' },
    { tipo: 'Incendio vehicular',                color: '#e65100', emoji: '🔥', etiqueta: 'Incendio' },
    { tipo: 'Búsqueda y rescate',                color: '#4527a0', emoji: '🔦', etiqueta: 'Búsqueda y rescate' },
    { tipo: 'Rescate vehicular',                 color: '#1565c0', emoji: '🚗', etiqueta: 'Rescate vehicular' },
    { tipo: 'Rescate en altura',                 color: '#6a1b9a', emoji: '🧗', etiqueta: 'Rescate en altura' },
    { tipo: 'Rescate acuático',                  color: '#00838f', emoji: '🌊', etiqueta: 'Rescate acuático' },
    { tipo: 'Primeros auxilios',                 color: '#c62828', emoji: '🚑', etiqueta: 'Primeros auxilios' },
    { tipo: 'Traslado',                          color: '#ad1457', emoji: '🚑', etiqueta: 'Traslado' },
    { tipo: 'Materiales peligrosos (MATPEL)',    color: '#f9a825', emoji: '☣️', etiqueta: 'MATPEL' },
    { tipo: 'Atención de abejas / avispas',      color: '#ff8f00', emoji: '🐝', etiqueta: 'Abejas / avispas' },
    { tipo: 'Atención de árbol caído',           color: '#33691e', emoji: '🌳', etiqueta: 'Árbol caído' },
    { tipo: 'Inundación / desastre natural',     color: '#2e7d32', emoji: '⛈️', etiqueta: 'Inundación / desastre natural' },
    { tipo: 'Colapso estructural',               color: '#37474f', emoji: '🏚️', etiqueta: 'Colapso estructural' },
    { tipo: 'Rescate animal',                    color: '#5d4037', emoji: '🐾', etiqueta: 'Rescate animal' },
    { tipo: 'Otra',                              color: '#757575', emoji: '❓', etiqueta: 'Otra' }
  ],

  _REGLA_SIN_CLASIFICAR: { color: '#757575', emoji: '❓', etiqueta: 'Sin clasificar' },

  // v5.82: devuelve la REGLA completa (color + emoji + etiqueta), no solo el color.
  _reglaPorClasificacion(clasificacionArr) {
    const arr = clasificacionArr || [];
    for (const regla of this._MAPA_COLORES) { if (arr.includes(regla.tipo)) return regla; }
    return this._REGLA_SIN_CLASIFICAR;
  },

  // v5.82: pin más grande, con sombra y el emoji del tipo adentro.
  _iconoMapa(regla) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">'
      + '<path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 25 15 25s15-13.8 15-25C30 6.7 23.3 0 15 0z" fill="'+regla.color+'" stroke="#fff" stroke-width="2"/>'
      + '<circle cx="15" cy="15" r="10" fill="#fff"/>'
      + '</svg>';
    const html = '<div class="pin-cae" style="position:relative;width:30px;height:40px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35));">' + svg
      + '<span style="position:absolute;top:5px;left:0;width:30px;text-align:center;font-size:13px;line-height:20px;">' + regla.emoji + '</span></div>';
    return L.divIcon({ html: html, className: '', iconSize: [30,40], iconAnchor: [15,40], popupAnchor: [0,-36] });
  },

  async cargarPantallaMapa() {
    const estado = document.getElementById('mapaEstado');
    const cont = document.getElementById('leafletMapaContenedor');
    if (!estado || !cont) return;
    // v5.86: si el admin salió del mapa estando en pantalla completa, que no
    // quede "pegado" para la próxima vez que entre a esta pantalla.
    this._toggleMapaFullscreen(false);
    if (!this.esAdmin()) {
      estado.style.display = 'block'; estado.textContent = '🔒 Solo administradores'; cont.style.display = 'none';
      return;
    }
    if (typeof L === 'undefined') {
      estado.style.display = 'block';
      // v5.87: antes era texto muerto — la señal va y viene, así
      // que el error ahora trae botón de reintento (recarga solo esta pantalla).
      estado.innerHTML = '⚠️ No se pudo cargar el mapa (revisa tu conexión a internet).'
        + '<br><button onclick="app.cargarPantallaMapa()" style="margin-top:10px;padding:10px 18px;background:#1a7a5e;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">🔄 Reintentar</button>';
      cont.style.display = 'none';
      return;
    }
    estado.style.display = 'block'; estado.textContent = 'Cargando reportes...'; cont.style.display = 'none';
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarReportesParaMapa', adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '', pase: this._pase || '' })
      });
      const data = await resp.json();
      if (!data.ok) { estado.textContent = 'Error: ' + (data.error||'desconocido'); return; }
      const reportes = data.reportes || [];
      if (!reportes.length) {
        estado.textContent = '📭 Sin emergencias con coordenadas GPS registradas todavía.';
        return;
      }
      estado.style.display = 'none';
      cont.style.display = 'block';

      // Cachear localmente para que "Ver reporte completo" funcione aunque el
      // admin no haya visitado antes la lista de reportes en esta sesión.
      if (!this._reportesAdmin) this._reportesAdmin = [];
      reportes.forEach(r => { if (!this._reportesAdmin.some(x => x.id === r.id)) this._reportesAdmin.push(r); });

      const estCoord = this._estacionCoord();   // v1.22: estación configurada ([lat,lng]) o null
      // v5.82: filtros por año/mes (poblados con las fechas reales) + contador
      const filtros = document.getElementById('mapaFiltros');
      if (filtros) {
        const anios = new Set();
        reportes.forEach(r => { const a = String(r.fecha||'').substring(0,4); if (/^\d{4}$/.test(a)) anios.add(a); });
        const MESES = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        const estiloSel = 'padding:6px 8px;border:1px solid #ddd;border-radius:8px;font-size:12px;background:#fff;';
        const estiloTog = 'padding:6px 10px;border:1px solid #b9c6d0;border-radius:8px;background:#eef0f2;color:#1a5276;font-size:12px;font-weight:700;cursor:pointer;';
        const estiloChip = 'padding:5px 9px;border:1px solid #cfd6dc;border-radius:12px;background:#fff;font-size:11px;cursor:pointer;';
        // v1.21: barra compacta; lo demás vive en menús que se despliegan (⚙️/🏷️) para no
        // saturar la pantalla — antes eran ~6 botones + 16 chips siempre a la vista.
        filtros.innerHTML =
          '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">'
          + '<span id="mapaContador" style="font-size:12px;color:#555;font-weight:700;margin-right:2px;"></span>'
          + '<button id="mapaBtnHerr" onclick="app._mapaTogglePanel(\'herr\')" style="'+estiloTog+'">⚙️ Herramientas ▾</button>'
          + '<button id="mapaBtnTipos" onclick="app._mapaTogglePanel(\'tipos\')" style="'+estiloTog+'">🏷️ Tipos ▾</button>'
          + '</div>'
          + '<div id="mapaPanelHerr" style="display:none;margin-top:6px;background:#f7f9fa;border:1px solid #e6eaed;border-radius:10px;padding:9px;">'
          +   '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:#7a8891;font-weight:700;margin-bottom:5px;">📅 Fechas</div>'
          +   '<div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-bottom:10px;">'
          +     '<select id="mapaFiltroAnio" onchange="app._mapaSelectFecha()" style="'+estiloSel+'">'
          +       '<option value="">Todos los años</option>'
          +       Array.from(anios).sort().reverse().map(a => '<option value="'+a+'">'+a+'</option>').join('')
          +     '</select>'
          +     '<select id="mapaFiltroMes" onchange="app._mapaSelectFecha()" style="'+estiloSel+'">'
          +       '<option value="">Todos los meses</option>'
          +       MESES.map((mn,i) => i ? '<option value="'+String(i).padStart(2,'0')+'">'+mn+'</option>' : '').join('')
          +     '</select>'
          +     '<button onclick="app._mapaFechaRapida(\'30d\')" style="'+estiloChip+'">Últimos 30 días</button>'
          +     '<button onclick="app._mapaFechaRapida(\'mes\')" style="'+estiloChip+'">Este mes</button>'
          +     '<button onclick="app._mapaFechaRapida(\'anio\')" style="'+estiloChip+'">Este año</button>'
          +     '<button onclick="app._mapaFechaRapida(\'todo\')" style="'+estiloChip+'">Todo</button>'
          +   '</div>'
          +   '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:#7a8891;font-weight:700;margin-bottom:5px;">🧭 Acciones</div>'
          +   '<div style="display:flex;gap:5px;flex-wrap:wrap;">'
          +     '<button onclick="app._centrarMapaTodos()" style="padding:6px 10px;border:none;border-radius:8px;background:#1a7a5e;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">🎯 Ver todas</button>'
          +     '<button onclick="app._mapaMiUbicacion()" style="padding:6px 10px;border:none;border-radius:8px;background:#1565c0;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">📍 Mi ubicación</button>'
          +     '<button id="mapaBtnFullscreen" onclick="app._toggleMapaFullscreen()" style="padding:6px 10px;border:none;border-radius:8px;background:#1a5276;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">⛶ Pantalla completa</button>'
          +   '</div>'
          +   '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:#7a8891;font-weight:700;margin:9px 0 5px;">🚒 Estación</div>'
          +   '<div style="display:flex;gap:5px;flex-wrap:wrap;">'
          +     (estCoord
                  ? '<button onclick="app._mapaFijarEstacion()" style="'+estiloChip+'">🚒 Cambiar</button><button onclick="app._mapaQuitarEstacion()" style="'+estiloChip+'">Quitar</button>'
                  : '<button onclick="app._mapaFijarEstacion()" style="'+estiloChip+'">🚒 Fijar estación (mi ubicación)</button>')
          +   '</div>'
          +   '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:#7a8891;font-weight:700;margin:9px 0 5px;">✨ Vistas</div>'
          +   '<div style="display:flex;gap:5px;flex-wrap:wrap;">'
          +     '<button id="mapaBtnCalor" onclick="app._mapaToggleCalor()" style="'+estiloChip+'">🔥 Mapa de calor</button>'
          +   '</div>'
          + '</div>';
      }

      if (this._leafletMapa) { this._leafletMapa.remove(); this._leafletMapa = null; this._mapaCapaPines = null; }
      this._leafletMapa = L.map(cont).setView([reportes[0].lat, reportes[0].lng], 12);
      // v1.19: dos capas base con selector arriba a la derecha. El satélite (Esri)
      // ayuda en zona rural/ríos donde el callejero (OSM) no marca calles.
      const capaCalles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap'
      });
      const capaSatelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        // Esri no tiene imagen más allá del z17 en zonas remotas (z18+ devuelve un tile
        // gris "no data available"). maxNativeZoom hace que Leaflet ESTIRE la imagen del
        // z17 al acercar más (borrosa pero visible) en vez del cartel.
        maxZoom: 19, maxNativeZoom: 17, attribution: 'Imágenes © Esri'
      });
      capaCalles.addTo(this._leafletMapa);
      L.control.layers({ '🗺️ Calles': capaCalles, '🛰️ Satélite': capaSatelite }, null, { position: 'topright', collapsed: false }).addTo(this._leafletMapa);

      // v1.24: los pines viven en un GRUPO DE CLUSTER — se agrupan cuando se amontonan
      // (círculo con el número) y se abren al acercar. Si la librería no cargó, cae al
      // mapa directo (misma interfaz addLayer/hasLayer/removeLayer). La estación y el
      // calor NO se agrupan: van directo sobre el mapa.
      this._mapaCapaPines = (typeof L.markerClusterGroup === 'function')
        ? L.markerClusterGroup({ maxClusterRadius: 45, showCoverageOnHover: false, spiderfyOnMaxZoom: true })
        : this._leafletMapa;
      if (this._mapaCapaPines !== this._leafletMapa) this._leafletMapa.addLayer(this._mapaCapaPines);

      // v5.82: cada marcador queda registrado con su etiqueta y fecha para
      // poder filtrar sin volver a pedir nada al servidor.
      this._mapaMarkers = [];
      this._mapaEtiquetasOff = new Set();
      this._mapaDesde = null;   // v1.21: corte para "últimos 30 días" (null = sin corte)
      this._mapaHeat = null;    // v1.23: capa de mapa de calor (null = apagada)
      reportes.forEach(r => {
        const regla = this._reglaPorClasificacion(r.clasificacion);
        const clas = (r.clasificacion || []).join(', ') || 'Sin clasificar';
        const f = String(r.fecha || '');
        // v5.82 (I5/I10): dirección, clasificación y consecutivo pasan por
        // _esc() y el id del reporte viaja en data-id (antes iba concatenado
        // dentro del onclick y sin escapar).
        const popupHtml = '<div style="font-size:13px;min-width:190px;">'
          + '<div style="font-weight:700;color:'+regla.color+';">'+regla.emoji+' ' + app._esc(String(r.consecutivo || r.id)) + '</div>'
          + '<div style="margin-top:4px;"><b>Fecha:</b> ' + app._esc(f.substring(0,10) || '-') + '</div>'
          + '<div><b>Dirección:</b> ' + app._esc(r.direccion || '-') + '</div>'
          + (estCoord && r.lat && r.lng ? '<div><b>🚒 A la estación:</b> ~' + this._distanciaKm(estCoord[0], estCoord[1], r.lat, r.lng).toFixed(1) + ' km</div>' : '')
          + '<div><b>Clasificación:</b> ' + app._esc(clas) + '</div>'
          + '<button data-id="' + String(r.id||'').replace(/"/g,'&quot;') + '" onclick="app._verReporteDesdeMapa(this.dataset.id)" style="margin-top:8px;background:#6e2fa0;color:#fff;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:12px;width:100%;">Ver reporte completo</button>'
          + '</div>';
        const marker = L.marker([r.lat, r.lng], { icon: this._iconoMapa(regla) }).bindPopup(popupHtml);
        // v1.24: NO se agrega al mapa acá; _aplicarFiltroMapa lo mete en la capa de pines
        // (cluster) según el filtro. Antes se agregaba directo y luego se filtraba.
        this._mapaMarkers.push({ marker: marker, etiqueta: regla.etiqueta, anio: f.substring(0,4), mes: f.substring(5,7), fecha: f.substring(0,10) });
      });
      // v1.22: marcador fijo de la estación (si está configurada).
      if (this._mapaMarcadorEstacion) { try { this._leafletMapa.removeLayer(this._mapaMarcadorEstacion); } catch (e) {} this._mapaMarcadorEstacion = null; }
      if (estCoord) {
        this._mapaMarcadorEstacion = L.marker(estCoord, { icon: L.divIcon({ html: '<div style="font-size:26px;line-height:26px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.45));">🚒</div>', className: '', iconSize: [26, 26], iconAnchor: [13, 13] }) })
          .bindPopup('🚒 Estación de bomberos').addTo(this._leafletMapa);
      }
      this._pintarLeyendaMapa();
      const _ley = document.getElementById('mapaLeyenda'); if (_ley) _ley.style.display = 'none';  // v1.21: cerrada por defecto
      this._aplicarFiltroMapa(true);
    } catch(e) {
      estado.style.display = 'block'; cont.style.display = 'none';
      // v5.87: error con reintento (red intermitente) — e.message
      // pasa por _esc porque va a innerHTML.
      estado.innerHTML = 'Error: ' + app._esc(e.message)
        + '<br><button onclick="app.cargarPantallaMapa()" style="margin-top:10px;padding:10px 18px;background:#1a7a5e;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">🔄 Reintentar</button>';
    }
  },

  // v5.82: leyenda interactiva — cada chip muestra el conteo y al tocarlo
  // oculta/muestra los pines de ese tipo (tachado = oculto).
  _pintarLeyendaMapa() {
    const leyenda = document.getElementById('mapaLeyenda');
    if (!leyenda || !this._mapaMarkers) return;
    const conteo = {};
    this._mapaMarkers.forEach(m => { conteo[m.etiqueta] = (conteo[m.etiqueta] || 0) + 1; });
    const vistas = new Set(); const reglas = [];
    // v5.96: la leyenda muestra TODAS las clasificaciones con su emoji, aunque
    // vayan en (0) — antes solo salían los tipos con al menos un reporte.
    this._MAPA_COLORES.forEach(r => { if (!vistas.has(r.etiqueta)) { vistas.add(r.etiqueta); reglas.push(r); } });
    if (conteo[this._REGLA_SIN_CLASIFICAR.etiqueta]) reglas.push(this._REGLA_SIN_CLASIFICAR);
    // v1.19: botonera de acciones rápidas. Antes, para ver un SOLO tipo había que
    // apagar todos los demás uno por uno. Ahora "Todos"/"Ninguno" y "solo" por chip.
    const botonera = '<div style="display:flex;gap:6px;margin-bottom:6px;">'
      + '<button onclick="app._mapaMostrarTodos()" style="flex:1;padding:5px 8px;border:1px solid #1a7a5e;background:#1a7a5e;color:#fff;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">✓ Todos</button>'
      + '<button onclick="app._mapaOcultarTodos()" style="flex:1;padding:5px 8px;border:1px solid #bbb;background:#fff;color:#555;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">✕ Ninguno</button>'
      + '</div>';
    leyenda.innerHTML = botonera
      + '<div style="font-size:11px;color:#666;margin:2px 0 4px;">👆 Toca un tipo para ocultar/mostrar · toca <b>solo</b> para ver únicamente ese:</div>'
      + reglas.map(r => {
        const off = this._mapaEtiquetasOff.has(r.etiqueta);
        const e = r.etiqueta.replace(/"/g,'&quot;');
        return '<span data-e="' + e + '" onclick="app._toggleFiltroMapa(this.dataset.e)" '
          + 'style="display:inline-flex;align-items:center;gap:4px;background:' + (off ? '#f0f0f0' : '#fff') + ';border-radius:12px;padding:3px 9px;margin:2px;font-size:11px;border:1.5px solid ' + (off ? '#ddd' : r.color) + ';cursor:pointer;' + (off ? 'opacity:.5;' : '') + '">'
          + '<span style="width:10px;height:10px;border-radius:50%;background:' + r.color + ';display:inline-block;' + (off ? 'opacity:.4;' : '') + '"></span>'
          + '<span' + (off ? ' style="text-decoration:line-through;"' : '') + '>' + r.emoji + ' ' + r.etiqueta + ' (' + (conteo[r.etiqueta] || 0) + ')</span>'
          + '<span data-e="' + e + '" onclick="event.stopPropagation();app._mapaSoloEtiqueta(this.dataset.e)" title="Ver solo este tipo" style="margin-left:2px;padding:1px 6px;border-radius:8px;background:rgba(0,0,0,.08);font-size:9px;font-weight:700;color:#333;">solo</span>'
          + '</span>';
      }).join('');
  },

  _toggleFiltroMapa(etiqueta) {
    if (!this._mapaEtiquetasOff) this._mapaEtiquetasOff = new Set();
    if (this._mapaEtiquetasOff.has(etiqueta)) this._mapaEtiquetasOff.delete(etiqueta);
    else this._mapaEtiquetasOff.add(etiqueta);
    this._pintarLeyendaMapa();
    this._aplicarFiltroMapa();
  },

  // v1.19: todas las etiquetas posibles de la leyenda (para "Ninguno" y "solo").
  _mapaTodasEtiquetas() {
    const set = new Set();
    this._MAPA_COLORES.forEach(r => set.add(r.etiqueta));
    if (this._mapaMarkers && this._mapaMarkers.some(m => m.etiqueta === this._REGLA_SIN_CLASIFICAR.etiqueta)) {
      set.add(this._REGLA_SIN_CLASIFICAR.etiqueta);
    }
    return set;
  },
  _mapaMostrarTodos() {
    this._mapaEtiquetasOff = new Set();
    this._pintarLeyendaMapa(); this._aplicarFiltroMapa();
  },
  _mapaOcultarTodos() {
    this._mapaEtiquetasOff = this._mapaTodasEtiquetas();
    this._pintarLeyendaMapa(); this._aplicarFiltroMapa();
  },
  _mapaSoloEtiqueta(etiqueta) {
    const off = this._mapaTodasEtiquetas(); off.delete(etiqueta);
    this._mapaEtiquetasOff = off;
    this._pintarLeyendaMapa(); this._aplicarFiltroMapa();
  },

  // v1.19: centra el mapa en la ubicación GPS del dispositivo (útil en terreno).
  _mapaMiUbicacion() {
    if (!this._leafletMapa) return;
    if (!navigator.geolocation) { this.toast('Tu dispositivo no permite ubicación', 'error'); return; }
    this.toast('📍 Buscando tu ubicación…', 'info');
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      const prec = Math.round(pos.coords.accuracy || 0);   // radio de precisión en metros
      // Limpiar la marca y el círculo anteriores (si tocó el botón otra vez).
      if (this._mapaMarcadorYo)  { try { this._leafletMapa.removeLayer(this._mapaMarcadorYo);  } catch (e) {} }
      if (this._mapaPrecisionYo) { try { this._leafletMapa.removeLayer(this._mapaPrecisionYo); } catch (e) {} }
      // Círculo de precisión REAL: en PC sin GPS sale grande (WiFi/IP); con el GPS del
      // teléfono sale chico. Deja claro qué tan aproximada es la ubicación.
      if (prec > 0) {
        this._mapaPrecisionYo = L.circle([lat, lng], { radius: prec, color: '#1565c0', weight: 1, fillColor: '#42a5f5', fillOpacity: 0.15 }).addTo(this._leafletMapa);
      }
      this._mapaMarcadorYo = L.circleMarker([lat, lng], { radius: 7, color: '#1565c0', fillColor: '#42a5f5', fillOpacity: 0.9, weight: 3 })
        .addTo(this._leafletMapa).bindPopup('📍 Estás aquí' + (prec ? '<br><small>Precisión: ±' + prec + ' m</small>' : ''));
      // Encuadrar para que se vea todo el círculo; maxZoom evita acercarse de más.
      if (this._mapaPrecisionYo) this._leafletMapa.fitBounds(this._mapaPrecisionYo.getBounds(), { padding: [40, 40], maxZoom: 16 });
      else this._leafletMapa.setView([lat, lng], 15);
      if (prec > 150) this.toast('📍 Ubicación aproximada (±' + prec + ' m). En el celular con GPS es más precisa.', 'info');
    }, () => { this.toast('No se pudo obtener tu ubicación (revisa el permiso)', 'error'); },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
  },

  // v1.21: menús desplegables del mapa (para no saturar la pantalla con botones).
  _mapaTogglePanel(cual) {
    const cfg = { herr:  ['mapaPanelHerr', 'mapaBtnHerr',  '⚙️ Herramientas'],
                  tipos: ['mapaLeyenda',   'mapaBtnTipos', '🏷️ Tipos'] }[cual];
    if (!cfg) return;
    const panel = document.getElementById(cfg[0]);
    if (!panel) return;
    const abrir = (panel.style.display === 'none' || !panel.style.display);
    panel.style.display = abrir ? 'block' : 'none';
    const boton = document.getElementById(cfg[1]);
    if (boton) boton.innerHTML = cfg[2] + ' ' + (abrir ? '▲' : '▾');
    // El layout de arriba cambió; Leaflet necesita remedir o queda en blanco.
    setTimeout(() => { if (this._leafletMapa) this._leafletMapa.invalidateSize(); }, 60);
  },

  // v1.21: filtros rápidos de fecha. Usan un CORTE inferior (_mapaDesde); como no hay
  // reportes futuros, "desde X" equivale al periodo pedido. '30d' es un rango rodante
  // que los desplegables año/mes no pueden hacer.
  _mapaFechaRapida(tipo) {
    const selA = document.getElementById('mapaFiltroAnio');
    const selM = document.getElementById('mapaFiltroMes');
    if (selA) selA.value = '';
    if (selM) selM.value = '';
    const hoy = new Date();
    const dosd = (n) => String(n).padStart(2, '0');
    if (tipo === '30d') { const d = new Date(hoy.getTime() - 30 * 864e5); this._mapaDesde = d.getFullYear() + '-' + dosd(d.getMonth() + 1) + '-' + dosd(d.getDate()); }
    else if (tipo === 'mes')  { this._mapaDesde = hoy.getFullYear() + '-' + dosd(hoy.getMonth() + 1) + '-01'; }
    else if (tipo === 'anio') { this._mapaDesde = hoy.getFullYear() + '-01-01'; }
    else { this._mapaDesde = null; }   // 'todo'
    this._aplicarFiltroMapa();
  },

  // v1.21: elegir año/mes a mano anula el rango rodante de "últimos 30 días".
  _mapaSelectFecha() { this._mapaDesde = null; this._aplicarFiltroMapa(); },

  // v1.23: mapa de calor (leaflet.heat, incrustado en index.html). Pinta dónde se
  // concentran los incidentes; respeta el filtro (solo cuentan los visibles).
  _mapaToggleCalor() {
    if (typeof L === 'undefined' || typeof L.heatLayer !== 'function') { this.toast('El mapa de calor no cargó', 'error'); return; }
    const btn = document.getElementById('mapaBtnCalor');
    if (this._mapaHeat) {
      try { this._leafletMapa.removeLayer(this._mapaHeat); } catch (e) {}
      this._mapaHeat = null;
      if (btn) { btn.style.background = '#fff'; btn.style.color = '#333'; }
    } else {
      this._mapaConstruirCalor();
      if (btn) { btn.style.background = '#c62828'; btn.style.color = '#fff'; }
    }
  },
  _mapaConstruirCalor() {
    if (!this._leafletMapa || typeof L.heatLayer !== 'function') return;
    const pts = [];
    this._mapaMarkers.forEach(m => { if (this._mapaMarcadorPasa(m)) { const ll = m.marker.getLatLng(); pts.push([ll.lat, ll.lng, 0.6]); } });
    if (this._mapaHeat) { try { this._leafletMapa.removeLayer(this._mapaHeat); } catch (e) {} }
    this._mapaHeat = L.heatLayer(pts, { radius: 25, blur: 18, maxZoom: 17 }).addTo(this._leafletMapa);
  },

  // v1.22: estación de bomberos en el mapa. Se fija con el GPS (parado EN la estación)
  // y se guarda en el dispositivo (localStorage). Con eso el mapa muestra un 🚒 y, en
  // cada reporte, a cuántos km está de la estación. Cada cuerpo guarda la suya.
  _EST_KEY: 'mapa_estacion_coord',
  _estacionCoord() {
    try {
      const v = JSON.parse(localStorage.getItem(this._EST_KEY) || 'null');
      return (Array.isArray(v) && v.length === 2 && isFinite(v[0]) && isFinite(v[1])) ? v : null;
    } catch (e) { return null; }
  },
  // Distancia en km entre dos coordenadas (fórmula de Haversine).
  _distanciaKm(lat1, lng1, lat2, lng2) {
    const R = 6371, g = Math.PI / 180;
    const dLat = (lat2 - lat1) * g, dLng = (lng2 - lng1) * g;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * g) * Math.cos(lat2 * g) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },
  _mapaFijarEstacion() {
    if (!navigator.geolocation) { this.toast('Tu dispositivo no permite ubicación', 'error'); return; }
    this.toast('🚒 Parado EN la estación, tomando ubicación…', 'info');
    navigator.geolocation.getCurrentPosition((pos) => {
      try { localStorage.setItem(this._EST_KEY, JSON.stringify([pos.coords.latitude, pos.coords.longitude])); } catch (e) {}
      this.toast('🚒 Estación fijada. Verás la distancia en cada reporte.', 'exito');
      this.cargarPantallaMapa();   // recarga para pintar el 🚒 y las distancias
    }, () => { this.toast('No se pudo tomar la ubicación (revisa el permiso)', 'error'); },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  },
  async _mapaQuitarEstacion() {
    if (!await this.confirmar('¿Quitar la ubicación de la estación del mapa?')) return;
    try { localStorage.removeItem(this._EST_KEY); } catch (e) {}
    this.toast('Estación quitada del mapa', 'info');
    this.cargarPantallaMapa();
  },

  // v5.82: aplica leyenda + año + mes sobre los marcadores ya creados.
  // ajustarVista=true solo en la carga inicial (no le mueve el zoom al admin
  // cada vez que cambia un filtro).
  // v1.23: ¿este marcador pasa los filtros actuales? (tipo + año/mes + rango rodante).
  // Extraído para que el mapa de calor use EXACTAMENTE el mismo criterio que los pines.
  _mapaMarcadorPasa(m) {
    const selA = document.getElementById('mapaFiltroAnio');
    const selM = document.getElementById('mapaFiltroMes');
    const anio = selA ? selA.value : '';
    const mes = selM ? selM.value : '';
    return !this._mapaEtiquetasOff.has(m.etiqueta)
      && (!anio || m.anio === anio)
      && (!mes || m.mes === mes)
      && (!this._mapaDesde || (m.fecha && m.fecha >= this._mapaDesde));
  },

  _aplicarFiltroMapa(ajustarVista) {
    if (!this._leafletMapa || !this._mapaMarkers) return;
    const bounds = []; let visibles = 0;
    const capa = this._mapaCapaPines || this._leafletMapa;   // v1.24: cluster (o mapa si no cargó)
    this._mapaMarkers.forEach(m => {
      if (this._mapaMarcadorPasa(m)) {
        if (!capa.hasLayer(m.marker)) capa.addLayer(m.marker);
        const ll = m.marker.getLatLng(); bounds.push([ll.lat, ll.lng]); visibles++;
      } else if (capa.hasLayer(m.marker)) {
        capa.removeLayer(m.marker);
      }
    });
    this._mapaBoundsVisibles = bounds;
    const contador = document.getElementById('mapaContador');
    if (contador) contador.textContent = '📍 ' + visibles + ' de ' + this._mapaMarkers.length;
    if (ajustarVista === true && bounds.length > 1) this._leafletMapa.fitBounds(bounds, { padding: [30, 30] });
    if (this._mapaHeat) this._mapaConstruirCalor();   // v1.23: el calor sigue el filtro
  },

  // v5.82: reencuadra el mapa para ver todos los pines visibles.
  _centrarMapaTodos() {
    if (!this._leafletMapa) return;
    const b = this._mapaBoundsVisibles || [];
    if (b.length > 1) this._leafletMapa.fitBounds(b, { padding: [30, 30] });
    else if (b.length === 1) this._leafletMapa.setView(b[0], 15);
    else this.toast('No hay emergencias visibles con los filtros actuales', 'info');
  },

  // v5.86 (feature: mapa en pantalla completa). forzar=true/false fija el
  // estado; sin argumento, alterna. Se usa desde el botón ⛶, el botón ✕
  // flotante y el botón Atrás del celular (configurarBotonAtrasMovil).
  _toggleMapaFullscreen(forzar) {
    const wrap = document.getElementById('mapaWrap');
    if (!wrap) return;
    const activar = (typeof forzar === 'boolean') ? forzar : !wrap.classList.contains('mapa-fullscreen');
    wrap.classList.toggle('mapa-fullscreen', activar);
    const btn = document.getElementById('mapaBtnFullscreen');
    if (btn) btn.textContent = activar ? '↙️ Salir de pantalla completa' : '⛶ Pantalla completa';
    // Leaflet mide su contenedor al crearse; si el tamaño cambia después por
    // CSS (como aquí) hay que avisarle o el mapa queda con recuadros en
    // blanco / mal encuadrado. 320ms = duración holgada del cambio de layout.
    setTimeout(() => { if (this._leafletMapa) this._leafletMapa.invalidateSize(); }, 320);
  },

  // Abre el reporte completo (read-only) desde un pin del mapa, reutilizando
  // el visor del Panel Admin. Pide la contraseña admin si aún no está en
  // sesión (misma protección que el resto del Panel Admin).
  async _verReporteDesdeMapa(id) {
    const pw = await this._obtenerPwdAdmin('🔐 Contraseña de administrador para ver el reporte');
    if (!pw) return;
    this.irA('pantallaPanelAdmin');
    setTimeout(() => this.verReporteAdmin(id), 50);
  },

  // ── Autocomplete encargado/guardia en asistencia ─────────────────────────
  _buscarAsistCampo(inputId, sugId, q) {
    const sug = document.getElementById(sugId);
    /* v6.09: al elegir una sugerencia se guarda también la CÉDULA en el dataset del
       input (data-ced). Quien no la necesite simplemente la ignora —los dos usos que
       ya existían (asistEncargado, asistComandanteGuardia) no cambian en nada—, pero
       el maquinista de una actividad SÍ la necesita: la hoja Recursos_Actividad tiene
       columna Cedula_Responsable y hasta ahora siempre se guardaba vacía, así que ese
       responsable no cruzaba por cédula con nadie (roza I9 y la regla de _cedKey).
       Se limpia en CADA tecleo: si se elige "GERMÁN" y después se corrige el texto a
       mano, la cédula vieja no puede quedar pegada a otro nombre. */
    const _inpAC = document.getElementById(inputId);
    if (_inpAC) _inpAC.dataset.ced = '';
    if (!q || q.trim().length < 1) { if(sug) sug.style.display='none'; return; }
    clearTimeout(this['_t_'+sugId]);
    this['_t_'+sugId] = setTimeout(async () => {
      try {
        const resp = await fetch(URL_BACKEND, { method:'POST',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify({ accion:'buscarPersonal', q:q.trim() }) });
        const data = await resp.json();
        if (!data.ok || !data.resultados.length) { sug.style.display='none'; return; }
        sug.innerHTML = data.resultados.map(per =>
          '<div data-n="'+app._esc(per.nombre||'')+'" data-c="'+app._esc(per.cedula||'')+'" data-inp="'+inputId+'" data-sug="'+sugId+'" '
          +'onclick="document.getElementById(this.dataset.inp).value=this.dataset.n;'
          +'document.getElementById(this.dataset.inp).dataset.ced=this.dataset.c;'
          +'document.getElementById(this.dataset.sug).style.display=\'none\';" '
          +'style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:14px;">'+app._esc(per.nombre||'')
          +'<span style="color:#999;font-size:11px;margin-left:6px;">CC:'+app._esc(per.cedula||'-')+'</span></div>'
        ).join('');
        sug.style.display = 'block';
      } catch(e) { if(sug) sug.style.display='none'; }
    }, 350);
  },

  // ── Editar actividad (admin) ──────────────────────────────────────────────
  // ══ EDITAR ACTIVIDAD COMPLETA (admin): texto + personal + fotos + recursos ══
  async editarActividad(id) {
    this.toast('Cargando actividad...','info');
    await this._cargarFlota();   // el modal pinta el <select> de vehículos al armarse
    try {
      const resp = await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:JSON.stringify({accion:'obtenerActividad',id})});
      const data = await resp.json();
      if (!data.ok) throw new Error(data.error||'Error al cargar');
      const a = data.actividad;
      // Estado de edición (separado del flujo de "crear" para no romperlo)
      this._eaId = id;
      this._eaPersonal = (a.personal||[]).map(p => ({ nombre:p.nombre, cedula:p.cedula||'', rango:p.rango||'BOMBERO', telefono:p.telefono||'', esEncargado:!!p.esEncargado }));
      this._eaRecursos = (a.recursos||[]).map(r => ({ tipo:r.tipo||'', codigo:r.codigo||'', responsable:r.responsable||'', responsableCedula:r.responsableCedula||'' }));
      this._eaFotosNuevas = { inicio:null, medio:null, fin:null, f4:null, f5:null, f6:null };  // null = no cambiada
      this._eaFotosActuales = { inicio:a.fotoInicio||'', medio:a.fotoMedio||'', fin:a.fotoFin||'', f4:a.fotoF4||'', f5:a.fotoF5||'', f6:a.fotoF6||'' };
      const tipos = ['Acompañamiento','Capacitación','Entrenamiento','Simulacro','Inspección','Jornada comunitaria','Pernotar','Bomberitos Junior','Arreglos / Reparaciones (institución)','Mantenimiento','Otra'];
      const esc = (s) => app._esc(s);
      const fotoSlot = (k, lbl, src) =>
        '<div style="text-align:center;">'
        + '<div style="font-size:10px;color:#666;">'+lbl+'</div>'
        + '<div id="_eaFotoPrev'+k+'" style="width:90px;height:90px;border-radius:8px;border:1px solid #ddd;background:#f5f5f5 center/cover no-repeat;display:flex;align-items:center;justify-content:center;overflow:hidden;">'
        + (src ? '<img src="'+src+'" style="width:100%;height:100%;object-fit:cover;">' : '<span style="font-size:22px;">📷</span>')
        + '</div>'
        + '<label style="display:block;margin-top:4px;font-size:11px;color:#1a5276;cursor:pointer;text-decoration:underline;">Cambiar'
        +   '<input type="file" accept="image/*" style="display:none;" onchange="app._eaCargarFoto(\''+k+'\',this)"></label>'
        + '</div>';

      const modal = document.createElement('div');
      modal.id = '_editActModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;overflow-y:auto;padding:16px;';
      modal.className = 'modal-js';   // sin esto ninguna regla CSS lo alcanza
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:20px;max-width:440px;margin:auto;">'
        +'<div style="font-weight:700;font-size:16px;color:#1a5276;margin-bottom:14px;">✏️ Editar Actividad</div>'
        +'<label style="font-size:12px;font-weight:700;">Tipo</label>'
        +'<select id="_eaT" style="width:100%;padding:9px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:10px;box-sizing:border-box;">'+tipos.map(t=>'<option value="'+t+'"'+(a.tipo===t?' selected':'')+'>'+t+'</option>').join('')+'</select>'
        +'<label style="font-size:12px;font-weight:700;">Descripción</label>'
        +'<input type="text" id="_eaD" value="'+esc(a.descripcion)+'" style="width:100%;padding:9px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:10px;box-sizing:border-box;">'
        +'<label style="font-size:12px;font-weight:700;">Fecha</label>'
        +'<input type="date" id="_eaF" value="'+String(a.fecha||"").substring(0,10)+'" style="width:100%;padding:9px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:10px;box-sizing:border-box;">'
        +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">'
        +'<div><label style="font-size:12px;font-weight:700;">Hora inicio</label><input type="time" id="_eaHI" value="'+(a.horaInicio||"")+'" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box;"></div>'
        +'<div><label style="font-size:12px;font-weight:700;">Hora fin</label><input type="time" id="_eaHF" value="'+(a.horaFin||"")+'" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box;"></div>'
        +'</div>'
        +'<label style="font-size:12px;font-weight:700;">Lugar</label>'
        +'<input type="text" id="_eaL" value="'+esc(a.lugar)+'" style="width:100%;padding:9px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:10px;box-sizing:border-box;">'
        +'<label style="font-size:12px;font-weight:700;">Modalidad</label>'
        +'<select id="_eaMod" style="width:100%;padding:9px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:10px;box-sizing:border-box;">'
        +  '<option value="Voluntaria"'+(a.modalidad!=='Paga'?' selected':'')+'>🙋 Voluntaria</option>'
        +  '<option value="Paga"'+(a.modalidad==='Paga'?' selected':'')+'>💵 Paga (contratada)</option>'
        +'</select>'
        +'<label style="font-size:12px;font-weight:700;">Novedades</label>'
        +'<textarea id="_eaN" rows="2" style="width:100%;padding:9px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:14px;box-sizing:border-box;">'+esc(a.novedades||"")+'</textarea>'
        // ── PERSONAL ──
        +'<div style="border-top:1px solid #eee;padding-top:10px;margin-bottom:6px;font-weight:700;font-size:13px;color:#1a5276;">👥 Personal asistente</div>'
        +'<div id="_eaPersonalLista" style="margin-bottom:6px;"></div>'
        +'<div style="position:relative;margin-bottom:14px;">'
        +'<input type="text" id="_eaBuscarPersonal" placeholder="Escribir nombre para agregar..." autocomplete="off" oninput="app._eaBuscarPersonal(this.value)" style="width:100%;padding:9px;border:1px solid #1e8449;border-radius:8px;font-size:14px;box-sizing:border-box;">'
        +'<div id="_eaSugerencias" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:8px;z-index:100;box-shadow:0 4px 12px rgba(0,0,0,.15);max-height:180px;overflow-y:auto;"></div>'
        +'</div>'
        // ── FOTOS ──
        +'<div style="border-top:1px solid #eee;padding-top:10px;margin-bottom:6px;font-weight:700;font-size:13px;color:#1a5276;">📸 Fotos (hasta 6)</div>'
        +'<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;justify-content:center;">'
        + fotoSlot('inicio','Foto 1',a.fotoInicio||'')
        + fotoSlot('medio','Foto 2',a.fotoMedio||'')
        + fotoSlot('fin','Foto 3',a.fotoFin||'')
        + fotoSlot('f4','Foto 4',a.fotoF4||'')
        + fotoSlot('f5','Foto 5',a.fotoF5||'')
        + fotoSlot('f6','Foto 6',a.fotoF6||'')
        +'</div>'
        // ── RECURSOS ──
        +'<div style="border-top:1px solid #eee;padding-top:10px;margin-bottom:6px;font-weight:700;font-size:13px;color:#1a5276;">🚒 Recursos / Vehículos</div>'
        +'<div id="_eaRecursosLista" style="margin-bottom:6px;"></div>'
        +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">'
        /* Editar daba un formulario PEOR que crear: acá el vehículo era texto
           libre, así que "Móvil 1", "movil 1" y "MÓVIL 1" quedaban como tres
           máquinas distintas en la hoja. Ahora sale de la flota, igual que al crear. */
        +'<select id="_eaRecTipo" style="padding:8px;border:1px solid #ddd;border-radius:8px;font-size:13px;box-sizing:border-box;">'
        +  app._opcionesFlota('')
        +'</select>'
        +'<input type="text" id="_eaRecCodigo" placeholder="Código/Placa" style="padding:8px;border:1px solid #ddd;border-radius:8px;font-size:13px;box-sizing:border-box;">'
        +'</div>'
        +'<input type="text" id="_eaRecResp" placeholder="Maquinista / Responsable" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;font-size:13px;box-sizing:border-box;margin-bottom:6px;">'
        +'<button onclick="app._eaAgregarRecurso()" style="width:100%;padding:9px;background:#eef5fb;color:#1a5276;border:1px dashed #1a5276;border-radius:8px;font-weight:700;cursor:pointer;margin-bottom:14px;">+ Agregar vehículo</button>'
        // ── BOTONES ──
        +'<div style="display:flex;gap:10px;">'
        +'<button id="_eaCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;">Cancelar</button>'
        +'<button id="_eaGuard" style="flex:1;padding:12px;background:#1a5276;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">💾 Guardar</button>'
        +'</div></div>';
      document.body.appendChild(modal);
      this._eaRenderPersonal();
      this._eaRenderRecursos();

      modal.querySelector('#_eaCancel').onclick = () => { app._cerrarModalJS(modal); this._eaLimpiar(); };
      modal.querySelector('#_eaGuard').onclick = async () => {
        await this._conBloqueo(modal.querySelector('#_eaGuard'), 'Guardando...', async () => {
        const _pwdEA = await this._obtenerPwdAdmin('🔐 Contraseña admin');
        if (!_pwdEA) return;
        this.toast('⏳ Guardando cambios...','info');
        try {
          const payload = { accion:'actualizarActividad', id,
            tipo:document.getElementById('_eaT').value,
            descripcion:document.getElementById('_eaD').value,
            fecha:document.getElementById('_eaF').value,
            horaInicio:document.getElementById('_eaHI').value,
            horaFin:document.getElementById('_eaHF').value,
            lugar:document.getElementById('_eaL').value,
            novedades:document.getElementById('_eaN').value,
            modalidad:document.getElementById('_eaMod').value,
            personal:this._eaPersonal,
            recursos:this._eaRecursos,
            adminEmail:this.usuario.email, adminPassword:this._adminPwdSession };
          // solo enviar las fotos que cambiaron
          if (this._eaFotosNuevas.inicio) payload.fotoInicioNueva = this._eaFotosNuevas.inicio;
          if (this._eaFotosNuevas.medio)  payload.fotoMedioNueva  = this._eaFotosNuevas.medio;
          if (this._eaFotosNuevas.fin)    payload.fotoFinNueva    = this._eaFotosNuevas.fin;
          if (this._eaFotosNuevas.f4)     payload.fotoF4Nueva     = this._eaFotosNuevas.f4;
          if (this._eaFotosNuevas.f5)     payload.fotoF5Nueva     = this._eaFotosNuevas.f5;
          if (this._eaFotosNuevas.f6)     payload.fotoF6Nueva     = this._eaFotosNuevas.f6;
          const r=await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
          const d=await r.json();
          if(!d.ok)throw new Error(d.error);
          app._cerrarModalJS(modal);
          this._eaLimpiar();
          this.toast('✅ Actividad actualizada','exito');
          setTimeout(()=>this.cargarListaActividades(),800);
        }catch(e){this.toast('Error: '+e.message,'error');}
        });
      };
    }catch(e){this.toast('Error: '+e.message,'error');}
  },

  _eaLimpiar() {
    this._eaId=null; this._eaPersonal=null; this._eaRecursos=null;
    this._eaFotosNuevas=null; this._eaFotosActuales=null;
  },

  async _eaCargarFoto(tipo, input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const prev = document.getElementById('_eaFotoPrev'+tipo);
    if (prev) prev.innerHTML = '<span style="font-size:11px;color:#999;">...</span>';
    try {
      const dataUrl = await this.comprimirImagen(file, 1280, 0.7);
      this._eaFotosNuevas[tipo] = dataUrl;
      if (prev) prev.innerHTML = '<img src="'+dataUrl+'" style="width:100%;height:100%;object-fit:cover;">';
    } catch(e) {
      if (prev) prev.innerHTML = '<span style="font-size:11px;color:#c00;">Error</span>';
    }
  },

  _eaRenderPersonal() {
    const cont = document.getElementById('_eaPersonalLista');
    if (!cont) return;
    if (!this._eaPersonal.length) { cont.innerHTML = '<div style="color:#999;font-size:12px;text-align:center;padding:6px;">Sin personal</div>'; return; }
    cont.innerHTML = this._eaPersonal.map((p,i) => {
      const enc = !!p.esEncargado;
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:'+(enc?'#fff8e1':'#f8f8f8')+';border-radius:8px;margin-bottom:4px;">'
        +'<div><strong style="font-size:13px;">'+app._esc(p.nombre)+'</strong>'+(enc?' (ENCARGADO)':'')+'<div style="font-size:11px;color:#666;">CC: '+app._esc(p.cedula||'-')+' | '+app._esc(p.rango)+'</div></div>'
        +'<div style="display:flex;gap:4px;">'
        +'<button data-i="'+i+'" onclick="app._eaToggleEncargado(+this.dataset.i)" title="Encargado" style="background:none;border:none;font-size:18px;cursor:pointer;opacity:'+(enc?'1':'0.25')+';">&#11088;</button>'
        +'<button data-i="'+i+'" onclick="app._eaQuitarPersonal(+this.dataset.i)" style="background:none;border:none;color:#c00;font-size:16px;cursor:pointer;">&#x2715;</button>'
        +'</div></div>';
    }).join('');
  },

  _eaToggleEncargado(i) {
    this._eaPersonal.forEach((p,k)=>p.esEncargado=(k===i?!p.esEncargado:false));
    this._eaRenderPersonal();
  },

  _eaQuitarPersonal(i) { this._eaPersonal.splice(i,1); this._eaRenderPersonal(); },

  _eaBuscarPersonal(q) {
    clearTimeout(this._eaBuscarTimer);
    const sug = document.getElementById('_eaSugerencias');
    if (!sug) return;
    if (!q || q.trim().length < 1) { sug.style.display='none'; return; }
    sug.innerHTML = '<div style="padding:8px 12px;color:#999;font-size:13px;">Buscando...</div>'; sug.style.display='block';
    this._eaBuscarTimer = setTimeout(async () => {
      try {
        const resp = await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({accion:'buscarPersonal',q:q.trim()})});
        const data = await resp.json();
        if (!data.ok || !data.resultados.length) { sug.innerHTML='<div style="padding:8px 12px;color:#999;font-size:12px;">Sin resultados</div>'; return; }
        sug.innerHTML = data.resultados.map(per =>
          '<div onclick=\'app._eaAddPersonal('+JSON.stringify(per).replace(/'/g,"&#39;")+')\' style="padding:9px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:13px;"><strong>'+app._esc(per.nombre||'')+'</strong> <span style="color:#666;font-size:12px;">CC: '+app._esc(per.cedula||'-')+'</span></div>'
        ).join('');
        sug.style.display='block';
      } catch(e) { sug.style.display='none'; }
    }, 400);
  },

  _eaAddPersonal(p) {
    document.getElementById('_eaSugerencias').style.display='none';
    document.getElementById('_eaBuscarPersonal').value='';
    const ya = p.cedula ? this._eaPersonal.find(x=>x.cedula===p.cedula) : this._eaPersonal.find(x=>x.nombre.toUpperCase()===(p.nombre||'').toUpperCase());
    if (ya) { this.toast(p.nombre+' ya está','error'); return; }
    this._eaPersonal.push({ nombre:p.nombre, cedula:p.cedula||'', rango:p.rango||'BOMBERO', telefono:p.telefono||'', esEncargado:false });
    this._eaRenderPersonal();
  },

  _eaRenderRecursos() {
    const cont = document.getElementById('_eaRecursosLista');
    if (!cont) return;
    if (!this._eaRecursos.length) { cont.innerHTML = '<div style="color:#999;font-size:12px;text-align:center;padding:6px;">Sin vehículos</div>'; return; }
    cont.innerHTML = this._eaRecursos.map((r,i) =>
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:#f8f8f8;border-radius:8px;margin-bottom:4px;">'
      +'<div style="font-size:13px;"><strong>'+app._esc(r.tipo||'-')+'</strong>'+(r.codigo?' ('+app._esc(r.codigo)+')':'')+(r.responsable?'<div style="font-size:11px;color:#666;">'+app._esc(r.responsable)+'</div>':'')+'</div>'
      +'<button data-i="'+i+'" onclick="app._eaQuitarRecurso(+this.dataset.i)" style="background:none;border:none;color:#c00;font-size:16px;cursor:pointer;">&#x2715;</button>'
      +'</div>'
    ).join('');
  },

  _eaAgregarRecurso() {
    let tipo = (document.getElementById('_eaRecTipo').value||'').trim();
    const codigo = (document.getElementById('_eaRecCodigo').value||'').trim();
    const resp = (document.getElementById('_eaRecResp').value||'').trim();
    if (!tipo) { this.toast('Elige el vehículo','error'); return; }
    // Mismo marcador interno que en el formulario de creación (ver
    // agregarRecursoActividad): __OTRO__ no es un nombre de máquina.
    if (tipo === '__OTRO__') {
      if (!codigo) { this.toast('Escribe cuál vehículo en Código/Placa','error'); return; }
      tipo = codigo;
    }
    this._eaRecursos.push({ tipo, codigo, responsable:resp, responsableCedula:'' });
    document.getElementById('_eaRecTipo').value='';
    document.getElementById('_eaRecCodigo').value='';
    document.getElementById('_eaRecResp').value='';
    this._eaRenderRecursos();
  },

  _eaQuitarRecurso(i) { this._eaRecursos.splice(i,1); this._eaRenderRecursos(); },


  /* ═══════ v6.00: AGREGAR PERSONAS A UN DOMINGO YA GUARDADO ═══════
     Antes, el modal de ✏️ solo mostraba a los que ya estaban guardados, así que
     para sumar a alguien había que ELIMINAR el domingo y recrearlo entero (34
     estados reescritos a mano, con el riesgo de perderlo todo si algo fallaba a
     mitad). El backend nunca fue el problema: registrarAsistencia con
     replaceAll:true reescribe el domingo con TODOS los registros que reciba,
     incluidos los que no estaban. Lo único que faltaba era poder añadirlos acá. */

  // Cédula normalizada a solo dígitos — equivalente en el front de _cedKey del
  // backend. "1.234.567.890" y "1234567890" son la misma persona.
  _cedDigitos(x) { return String(x == null ? '' : x).replace(/\D/g, ''); },

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

/* v1.42: RIPPLE global — una onda en el punto del toque sobre CUALQUIER botón.
   Delegado en captura. No toca la lógica: solo agrega/quita un <span> decorativo. */
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest && e.target.closest('button');
  if (!b || b.disabled) return;
  try {
    const r = b.getBoundingClientRect();
    const s = document.createElement('span');
    s.className = 'ripple';
    const size = Math.max(r.width, r.height);
    s.style.width = s.style.height = size + 'px';
    s.style.left = (e.clientX - r.left - size / 2) + 'px';
    s.style.top = (e.clientY - r.top - size / 2) + 'px';
    b.appendChild(s);
    setTimeout(() => { try { s.remove(); } catch (er) {} }, 560);
  } catch (er) {}
}, true);

document.addEventListener('input', (e) => {
  if (e.target.closest('#pantallaForm')) { app.actualizarProgreso(); app._programarAutoguardado(); }
});
document.addEventListener('change', (e) => {
  if (e.target.closest('#pantallaForm')) { app.actualizarProgreso(); app._programarAutoguardado(); }
});

/* v1.38: red de seguridad extra del autoguardado — vaciar YA cuando la app pasa a
   segundo plano o se está por cerrar (el WebView de gama baja mata la app sin avisar).
   Mejor un guardado de más que perder un reporte a medio dictar. */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') app._autoguardarBorrador();
});
window.addEventListener('pagehide', () => app._autoguardarBorrador());
