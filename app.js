/* ============================================================
   APP DE REPORTE DE EMERGENCIAS - BOMBEROS INÍRIDA v4
   Login con Google, Sistema de administrador, Auto-completado GPS
   ============================================================ */

// ==================== CONFIGURACIÓN HARDCODED ====================
const GOOGLE_CLIENT_ID = '1091938050057-ccvp04hm6mg5m1aao1j3lv2cqn474vs5.apps.googleusercontent.com';
const ADMIN_EMAILS = [
  'gilrangeljeancarlosjeferson@gmail.com',
  'bomberosinirida@gmail.com',
  'reporteemergenciascbvi@gmail.com',
  'tesoreria.bomberosinirida@gmail.com'
];
const ADMIN_EMAIL = ADMIN_EMAILS[0]; // compatibilidad
const ADMIN_PASSWORD = ''; // La contraseña NO está en el código — el admin la escribe al entrar al panel.
const TELEFONO_ESTACION = '314 531 1605';
const NOMBRE_ESTACION = 'CBVI';
const URL_BACKEND = 'https://script.google.com/macros/s/AKfycbzVI3oEk78vHY2kQ15oz-U1jpkR0-L56cxEwby8tMi2mVJi5A5D74XMi25WKdod6wn2QA/exec';

// ===== VERSIONADO DE LA APP =====
// Subir este número cada vez que se despliegue una versión nueva.
// Cuando un dispositivo detecta versión distinta a la guardada,
// muestra el banner verde por 10 min con la lista de cambios.
const APP_VERSION = '5.99';
const APP_VERSION_NOTAS = [
  'v5.99: 🗺️ El mapa ahora carga desde la propia app y no desde un servidor de terceros. Es más seguro y arranca más rápido; el mapa ya no depende de que ese servidor externo esté disponible.',
  'v5.99: 🔒 Refuerzo de seguridad: se quitó el permiso que la app le daba a ese servidor externo para ejecutar código.',
  'v5.98: 👥 La lista de nombres que sale al escribir (en reportes, actividades y asistencia) ahora se toma DIRECTO de la hoja del personal. Antes venía de una lista fija dentro de la app: por eso seguían apareciendo compañeros que ya no están y NO aparecían los que se agregaron después. Ahora se actualiza sola.',
  'v5.98: ✅ El aviso de "nombre desconocido" al enviar un reporte ya no se equivoca: dejó de alertar con personal que sí está en la hoja, y dejó de dejar pasar en silencio a quien ya no está.',
  'v5.98: 📴 Sigue funcionando sin señal: la lista queda guardada en el teléfono y se usa igual cuando no hay internet.',
  'v5.97: 🛡️ Ajustes internos de seguridad y de configuración del sitio. No cambia nada de lo que ves, ni cómo inicias sesión, ni cómo se usa la app.',
  'v5.96: 🗺️ La leyenda del Mapa de Emergencias ahora muestra TODAS las clasificaciones con su emoji, aunque vayan en cero — antes solo salían los tipos que ya tenían reportes.',
  'v5.96: 🏷️ Corregido: los reportes con VARIAS clasificaciones marcadas salían como "Sin clasificar" en el mapa (solo cruzaba bien cuando era una sola). Ahora se leen todas y el pin toma su color/emoji correcto. Al editar un reporte, las casillas de clasificación ya aparecen marcadas como corresponde.',
  'v5.96: 📊 En Operatividad, las cédulas escritas con puntos o espacios ya no crean tarjetas duplicadas de la misma persona. La tarjeta grande ahora dice "Unidades con registros" y muestra aparte cuántas unidades tiene la base activa; los registros con el nombre escrito distinto salen marcados en ámbar para poder corregirlos.',
  'v5.96: 📸 Corregido: algunos reportes viejos no mostraban sus fotos (el enlace quedó guardado en un formato antiguo). Ahora se leen también esos formatos. Y si al ENVIAR un reporte alguna foto no se puede subir, la app lo avisa de inmediato en vez de callar.',
  'v5.95: 📊 Corregido en Operatividad: al tocar "Ver emerg. / Ver activ. / Ver dom." de una unidad, el detalle ahora muestra TODO lo que suma el total, aunque el nombre esté escrito distinto en registros viejos (ahora se cruza también por cédula). Antes el total podía decir 6.3h y el detalle mostrar menos.',
  'v5.95: ✏️ Al EDITAR la asistencia de un domingo, los campos 👤 Encargado y 🛡️ Guardia ahora AUTOCOMPLETAN buscando en el personal (escribe las iniciales y toca el nombre), igual que al registrar.',
  'v5.95: 🧾 Al agregar personal a la asistencia ya no se cuela una persona repetida por tener la cédula escrita con puntos o espacios (ej: 1.234.567 y 1234567 ya se reconocen como la misma).',
  'v5.95: 🏅 En las bonificaciones, los nombres con tilde o Ñ ya no se duplican ("JOSÉ" y "JOSE" son la misma persona) y el botón de quitar elimina bien ambas formas.',
  'v5.95: 🛡️ Refuerzos internos de seguridad y estabilidad en varias pantallas y en el servidor.',
  'v5.94: 🏷️ Nuevos tipos de emergencia en la Clasificación: Incendio de interfaz, Búsqueda y rescate, Traslado, Atención de árbol caído y Atención de abejas / avispas. Si marcas "Búsqueda y rescate", escribe en "Otra" la modalidad exacta (extraviado, acuática, colapso, etc.). En el Mapa de Emergencias cada uno tiene su propio pin (las abejas van con 🐝).',
  'v5.94: ⚠️ Ahora cada unidad ve en su Inicio ÚNICAMENTE su propia sanción pendiente (antes solo el admin veía la lista). Toca el aviso para ver de qué domingos viene tu deuda. Nadie ve la de los demás.',
  'v5.94: 🗺️ Corregido: al abrir "Ver reporte completo" desde el Mapa a veces salía el reporte vacío o pedía la contraseña sin cargar. Ahora la sesión se valida mejor, y si la descarga falla se muestra un aviso con botón de reintentar en vez de un reporte en blanco. Al reentrar al Panel ya no queda abierto el reporte anterior.',
  'v5.93: 🧾 Corregido (sanciones): al descontar horas cumplidas, ahora el pago SIEMPRE se cruza con la deuda aunque la cédula esté escrita distinto (con puntos, espacios o como número) en la asistencia y en el registro. Antes, en esos casos, salía "✅ registrado" pero la deuda no bajaba. Ya no hay que corregir la cédula a mano.',
  'v5.92: 👁️ NUEVO: al escribir las coordenadas a mano aparece una VISTA PREVIA EN VIVO debajo de los campos que muestra cómo quedará el pin (en decimal y en grados) o te avisa si algo está mal — así lo confirmas antes de enviar el reporte, sin depender de tener señal.',
  'v5.92: 📍 Corregido: al escribir las coordenadas A MANO ahora se aceptan con COMA o con punto decimal (ej: 3,8650 o 3.8650). Antes, si se escribía con coma, la app las guardaba mal y el pin caía en el lugar equivocado del Mapa de Emergencias. También reconoce si pegas las dos coordenadas juntas en un solo campo y el formato de grados (3°51\'54"N). Al guardar, muestra cómo quedaron interpretadas para que las revises.',
  'v5.91: ⚠️ CAMBIO IMPORTANTE EN LAS SANCIONES. Por cada domingo que pase sin que cumplas tus horas, la deuda se DUPLICA (2h → 4h → 8h → 16h...), con un tope de 32 horas. Asistir NO detiene la duplicación y presentar excusa TAMPOCO: la excusa justifica que no viniste, no que dejaste de cumplir lo que ya debías. Lo único que la detiene es cumplir las horas antes del próximo domingo.',
  'v5.91: 🤝 Ajuste por única vez: como antes el sistema no aplicaba bien esta regla, a quienes les habría subido de golpe se les dejó la deuda en el valor que ya venían viendo duplicado una sola vez, y no en el total que les correspondía. De aquí en adelante la regla corre normal para todos.',
  'v5.91: 📋 Las alertas quedan igual: 3 domingos seguidos = llamado de atención verbal · 4 = llamado escrito con copia a la hoja de vida · 5 = deserción, con retiro de las actividades bomberiles y a consideración del Capitán el reingreso.',
  'v5.91: ✉️ El correo de sanción ahora explica cómo crece la deuda y hasta qué tope, además de los domingos que faltaste.',
  'v5.90: 🧭 Se QUITÓ la barra de navegación inferior que se agregó en la v5.89. Devolvía accesos que ya estaban en el Inicio y quitaba espacio de pantalla. Todo se navega igual que antes desde el Inicio.',
  'v5.90: 🎨 Diseño renovado del tema 🚒 Original: encabezado con más profundidad y filo dorado, tarjetas con relieve suave, botones con volumen, campos que se iluminan en rojo al escribir y esquinas más redondeadas. El tema 🍎 Minimalista quedó exactamente igual.',
  'v5.90: ✅ Al descontar horas de sanción en "Ver Deudores" ahora se abre un cuadro que pide LA ACTIVIDAD QUE REALIZÓ la unidad (aseo, mantenimiento, apoyo, etc.). Queda como constancia permanente junto con las horas.',
  'v5.90: ✉️ Los correos de sanción que le llegan a cada unidad ahora DICEN EXACTAMENTE qué domingos faltó (fecha y tema de cada uno), no solo el total de horas. Si una fecha está mal, ya se puede reclamar con el dato en la mano.',
  'v5.90: 📱 El ícono al abrir la app ya no sale dentro de un cuadro blanco: el escudo se ve recortado sobre el fondo rojo institucional.',
  'v5.89: 🧭 NUEVO: barra de navegación inferior con acceso directo a 🏠 Inicio, 🎯 Nueva Actividad, 🚨 Nuevo Reporte (botón central), 📋 Registros y ⚙️ Ajustes. Ya no hay que devolverse al Inicio para cambiar de sección.',
  'v5.89: ✨ Animaciones suaves al cambiar de pantalla y al tocar botones (estilo app profesional). Si tu teléfono tiene activada la opción "reducir movimiento" (accesibilidad), la app la respeta y no anima.',
  'v5.89: ⏳ Mientras cargan los Registros, la Operatividad o los Deudores ahora se ve una "silueta" animada en vez del texto "Cargando..." — se nota que la app está trabajando.',
  'v5.89: 💻 Mejorado en pantallas grandes (PC y tabletas): la barra inferior se centra y no se estira a todo lo ancho.',
  'v5.88: 🎨 NUEVO: ahora puedes elegir el DISEÑO de la app — 🚒 Original o 🍎 Minimalista (estilo limpio tipo Apple). Está en el menú de tu avatar (arriba a la derecha) y en Configuración → Diseño de la app. Tu elección se guarda solo en este dispositivo.',
  'v5.88: ✨ Diseño Minimalista: fondo claro, tarjetas con bordes redondeados, sombras suaves, encabezado translúcido y transiciones suaves. TODO funciona exactamente igual — solo cambia el aspecto.',
  'v5.87: ✅ Los avisos de éxito (actividad guardada, asistencia registrada, foto cargada...) ahora salen en VERDE como corresponde — antes salían en negro neutro.',
  'v5.87: 🗺️ Si el Mapa de Emergencias falla por falta de señal, ahora aparece un botón 🔄 Reintentar en vez de quedarse pegado en el error.',
  'v5.87: 🛡️ Blindaje interno: la pantalla de Operatividad "Por Unidad" ya no puede romperse completa si llega un registro sin nombre, y se reforzó el escape de texto en más listas (sanciones, deudores, personal).',
  'v5.86: 🔳 El Mapa de Emergencias ahora se puede ampliar a pantalla completa (botón ⛶) para ver mejor los pines, con botón ✕ para regresar al tamaño normal.',
  'v5.86: 🛡️ Refuerzos internos de seguridad: se reforzó el escape de texto libre (nombres, víctimas, recursos) en varias vistas y en el PDF del reporte.',
  'v5.85: 🗺️ Corregido: una coordenada GPS mal escrita (sin punto decimal) podía "romper" el Mapa de Emergencias y dejar TODOS los pines fuera de la vista. Ahora se valida el rango y se avisa si el dato es inválido.',
  'v5.84: 📤 Corregido (importante): reenviar un reporte "Pendiente" ya NO lo duplica en la base — el servidor ahora reconoce los reintentos aunque lleguen varios toques seguidos.',
  'v5.84: ⏳ El botón "Enviar" del reporte pendiente ahora muestra "Enviando..." y se bloquea mientras trabaja — se acabó tocar varias veces "porque no pasaba nada".',
  'v5.84: ➕ Los botones "+ Agregar recurso / víctima / organización" del formulario ahora se ven claros y grandes (antes quedaban casi invisibles).',
  'v5.83: 🛡️ Refuerzos internos de seguridad en el servidor.',
  'v5.82: 🗺️ Mapa de Emergencias renovado: cada pin lleva el EMOJI de su tipo (🔥 incendio, 🚑 primeros auxilios, 🚗 rescate vehicular...) con colores más fáciles de distinguir.',
  'v5.82: 🗺️ La leyenda ahora FILTRA: toca un tipo para ocultar/mostrar sus pines. Nuevos filtros por año y mes, contador de emergencias visibles y botón 🎯 para reencuadrar el mapa.',
  'v5.82: 🗺️ Corregido: la fecha en los pines del mapa se veía en formato técnico feo — ahora sale como día normal (2026-07-13).',
  'v5.82: 📨 El resumen general de sancionados ahora llega también a un tercer correo administrativo autorizado.',
  'v5.81: ⏳ Al abrir una asistencia de domingo (desde Mis Actividades o el historial) ahora aparece DE INMEDIATO la ventana "Abriendo asistencia..." con animación — antes parecía que el toque no hacía nada.',
  'v5.81: 🎖️ El llamado a lista ahora va por rangos: OFICIALES (Capitán, Teniente, Subteniente) → SUBOFICIALES (Sargento, Cabo) → BOMBEROS → ASPIRANTES. Dentro de cada rango se respeta el orden de las filas de la hoja Personal_CBVI (1, 2, 3...): ordena la hoja y la app llama a lista en ese orden.',
  'v5.81: 📝 Al marcar a alguien "C/excusa" se abre al instante el cuadro para escribir la observación (motivo de la excusa) — ya no toca guardar y luego editar el domingo. La observación queda visible bajo el nombre y se corrige tocándola.',
  'v5.81: ➕ Nuevos rangos disponibles al registrar bombero: Subteniente y Cabo.',
  'v5.76: 📨 NUEVO: alerta de sanciones por correo. Cada viernes 9:30 AM la estación recibe el resumen de unidades que deben horas y cada deudor su recordatorio personal. El admin también puede enviarla al instante desde Configuración → Zona Administrador.',
  'v5.76: 🛡️ El servidor ahora deja registro permanente de seguridad (intentos no autorizados y acciones administrativas) y avisa por correo a la estación si detecta actividad sospechosa.',
  'v5.75: 👥 Nueva cuenta de administración habilitada (Tesorería CBVI) para apoyar la gestión de la estación.',
  'v5.74: 📨 Corregido (importante): si el servidor rechazaba un reporte (mala señal, mantenimiento…), la app lo marcaba como "Enviado" igual y el reporte se perdía en silencio. Ahora queda "Pendiente" y se reenvía solo al volver la señal — sin duplicarse.',
  'v5.74: 🔐 Blindaje del servidor: enviar, actualizar o eliminar reportes y consultar la base de personal ahora exige sesión válida. Si un día te pide volver a iniciar sesión, es normal — tu reporte no se pierde.',
  'v5.74: 🧹 Corregido: al entrar con OTRA cuenta de Google en el mismo teléfono ya no se mezclan las sesiones (antes podía quedar activa la identidad anterior).',
  'v5.74: 🖥️ Los mensajes de error del servidor ahora se muestran de forma segura en pantalla.',
  'v5.73: 🪪 Ahora, si dos bomberos quedaron con la misma cédula, la app te avisa con claridad (te dice con quién choca) en vez de un confuso “ya está”. Corrige la cédula repetida en la base y listo.',
  'v5.72: 🧩 Corregido en Asistencia: al agregar un bombero que ya estaba, la app te lleva a su fila y la resalta (se acabó el “ya está pero no lo veo”). Búsqueda de duplicados más precisa (por cédula o nombre).',
  'v5.71: 🛡️ Blindaje profesional: descontar horas de sanción ahora es a prueba de fallos de red. Si se cae el internet justo al guardar y reintentas, ya NUNCA se descuenta dos veces.',
  'v5.70: 🔧 Corregido: al marcar horas de sanción cumplidas en "Ver Deudores" ya no sale "No autorizado". Ahora pide la contraseña de administrador si hace falta, y se evita cualquier doble descuento por doble toque.',
  'v5.69: 🔐 Seguridad del servidor reforzada: ahora solo tú puedes editar tu propio perfil, y agregar personal a la base es exclusivo del administrador. Registrar actividades exige sesión válida.',
  'v5.69: 🎫 Tu sesión ahora dura más sin pedirte iniciar sesión tan seguido. Si una vez te pide volver a entrar, es normal por esta mejora.',
  'v5.68: 🔐 Seguridad reforzada: los textos que se escriben (temas, lugares, novedades, narrativa, dirección) ahora se muestran de forma segura en toda la app.',
  'v5.68: 🔤 Corregido el inicio de sesión con Google para nombres con tildes o Ñ (antes podía fallar o mostrarse con símbolos raros).',
  'v5.68: 📱 Avisos que no se veían en el APK (cerrar la app, aviso de foto no guardada) ahora usan las ventanas propias de la app.',
  'v5.68: ⚡ Mejora de estabilidad sin conexión.',
  'v5.67: 📍 Corregido: las coordenadas GPS ahora se editan SOLO desde la sección 3 (Ubicación) al usar ✏️ Editar — ya se guardan correctamente y se reflejan en el Mapa.',
  'v5.67: 👁️ La vista "Ver" de bonificaciones ahora es solo lectura — para agregar o quitar bomberos usa ✏️ Editar.',
  'v5.66: 📸 Fotos del domingo AHORA editables (Inicio/Intermedio/Final) — antes no aparecían al editar. También Tipo de reunión, Tema, Lugar y Observación por persona.',
  'v5.66: 📍 Admin puede corregir las coordenadas GPS de un reporte si quedaron mal capturadas (aparece al editar en el Panel Admin).',
  'v5.66: 🎨 Mapa de Emergencias: cada pin tiene el color según el tipo de emergencia (incendio, primeros auxilios, rescate...) + leyenda con la tabla de colores.',
  'v5.65: 🗺️ Arreglado: el Mapa de Emergencias no cargaba (la política de seguridad del sitio bloqueaba la librería del mapa). Ya carga con internet normal.',
  'v5.65: 🆕 Aviso de "nueva versión" corregido: ya no tapa el botón de cerrar (antes crecía con TODO el historial; ahora solo muestra lo nuevo de esta versión, y tiene scroll si hace falta).',
  'v5.65: ⏳ Mensaje breve "Abriendo.../Cerrando..." al navegar entre pantallas, además de "Cargando.../Guardando..." que ya existían.',
  'v5.65: 🔄 Si ves pantallas viejas en la PC (ej. deudores dentro de Asistencia), es caché del navegador — Ctrl+Shift+R para forzar la versión nueva.',
  'v5.64: ⚠️ NUEVA pantalla "Ver Deudores": toca un nombre y mira EXACTAMENTE qué domingos (fecha + tema) generaron la deuda.',
  'v5.64: 🗺️ NUEVO "Mapa de Emergencias" (solo admin): ubica en un mapa cada emergencia con GPS registrado.',
  'v5.64: 🚫 Doble click corregido en TODAS las acciones (antes solo 3): eliminar, editar, sanciones, cierre de mes, bonificaciones, etc.',
  'v5.64: 📊 Corregido: los totales de Emergencias y Horas en Operatividad ya no se inflaban al multiplicarse por el número de asistentes.',
  'v5.64: 📅 Ahora se muestran por separado "Domingos realizados" y "Asistencias totales" (antes se mezclaban).',
  'v5.64: 🔐 3 ventanas de confirmación que fallaban en silencio en el APK (cerrar sesión, cancelar edición, quitar bombero de bonificación) ahora usan el modal seguro de la app.',
  'v5.63: 🚫 Doble click corregido — los botones se bloquean y muestran "Cargando..." mientras envían (no más registros duplicados).',
  'v5.63: 📊 Se acabaron los números feos tipo "28.09999h" — todo redondeado a 1 decimal.',
  'v5.63: 👥 Autocompletado sin nombres duplicados (tildes y Ñ ya no crean personas dobles).',
  'v5.63: ⚠️ NUEVO recordatorio de sanciones en la pantalla de inicio (solo admins): quién debe horas y su nivel de alerta.',
  'v5.63: 📐 Nueva regla de sanciones: la deuda se duplica si no se cumple (2h→4h→8h→16h→32h). Alertas por faltas consecutivas: 3=verbal, 4=escrito, 5=DESERCIÓN.',
  'v5.63: ✅ Las horas de sanción cumplidas ya quedan registradas para siempre (no se pierden al registrar más domingos).',
  'v5.63: 🎯 Nuevos tipos de actividad: Bomberitos Junior y Arreglos/Reparaciones (institución).',
  'v5.63: 🔐 La sesión de admin se renueva sola al abrir la app — adiós al "cierra y vuelve a iniciar sesión".',
  'v5.63: 🛡️ Aviso al enviar emergencias con nombres que no están en la base (evita duplicados en Operatividad).',
  'v5.63: 📖 Manual y "Cómo funciona" actualizados.',
  'v5.59: ARREGLADO: las fotos de las actividades ahora SÍ se guardan y se ven (se comprimen antes de subir). Detalle del domingo con sanciones.',
  'v5.56: "Mis Actividades" ahora muestra TAMBIÉN la asistencia de domingos (presentes, con/sin excusa). El admin ya no se desloguea seguido. Ranking sin duplicados.',
  'v5.49: Horas en actividades cuenta actividades únicas. Sesión expira cada 8h. Dirección GPS arreglada.',
  'v5.48: Seguridad reforzada — tu identidad se verifica con Google. Si te lo pide, vuelve a iniciar sesión.',
  'v5.25: Botón guardar admin: CORREGIDO — leerFormulario usaba reporteActual (null) en vez del reporte admin.',
  'v5.24: Botón guardar admin: toast en línea 1 + captura de errores en leerFormulario.',
  'v5.23: Editor admin: firma comandante visible + guardar con diagnóstico de error en pantalla.',
  'v5.22: Los borradores ya no tienen restricción de 24 horas — solo aplica a reportes enviados.',
  'v5.21: Cierre de mes corregido — el botón Aplicar ahora funciona correctamente.',
  'El Comandante de Incidente ahora se marca con la estrella ⭐ al lado del bombero en la lista (ya no se escribe aparte). Es quien dirigió en el lugar; distinto del comandante que FIRMA (ítem 13).',
  'NUEVO: en "Recursos Desplegados" cada vehículo lleva su Responsable/Maquinista y la lista de tripulantes que fueron en ese vehículo, todo con AUTOCOMPLETAR (escriba la inicial y elija el nombre de la base de bomberos).',
  'NUEVO: casilla de Comandante de Incidente (arriba de la sección) y Observaciones de mando (transferencia / continúa otro día).',
  'NUEVO: el Total de personal se suma SOLO (nombres distintos). Una misma persona cuenta 1 aunque vaya varios días.',
  'Arreglo: la app ya no se queda pegada por caché viejo; con internet siempre carga la última versión.',
  'Login con red de seguridad: si Google no carga, aparece aviso + botón Reintentar.'
];

// === ROSTER DE BOMBEROS (autocompletar) ===
// v5.98: ESTA LISTA YA NO MANDA. Es solo la SEMILLA para una instalación nueva
// que todavía no se ha conectado nunca (celular recién instalado y sin señal).
// La lista de verdad se lee de la hoja Personal_CBVI al iniciar sesión y queda
// cacheada en IndexedDB: ver `_cargarRosterDesdeHoja()` y `_rosterVigente()`.
// Cadena de respaldo: hoja → caché → esta semilla.
//
// Antes de v5.98 esta lista era la ÚNICA fuente y estaba congelada: mostraba 10
// personas que ya no estaban en la hoja y escondía 6 que sí (entre ellas JONNY
// SUMAY SUÁREZ). Peor: el autocompletado escribía nombres con una grafía
// distinta a la de la hoja, y esos registros después no cruzaban en Operatividad.
// NO hace falta editarla a mano nunca más; se actualiza sola desde la hoja.
const ROSTER_BOMBEROS = [
  "ARIEL FERNANDO CARDENAS TEJEIRO","BAUDILIO GALINDO MARÍN","CRISTIAN ANDRES VIDAL TRUJILLO",
  "DAVID FELIPE MUÑOZ ACOSTA","DELIO PINZON ALDANA","EIKER ALEJANDRO PEÑA RIVAS",
  "ELIODORO LOPEZ MARTINEZ","ELIPSYS ALEXANDRA RONDON MORILLO","ELKIN AUGUSTO RODRIGUEZ GONZALEZ",
  "FREDY ANDREY SIERRA BORRERO","GERMAN ALONSO ROJAS GARZON","GUILLERMO DIAZ SABOGAL",
  "HAROLD HENDER BARRETO SAENZ","HECTOR DE JESUS GARCIA CUARTAS","HELIODORO LOPEZ VALENCIA",
  "HERBHERT ARTEMIO DIAZ AGAPITO","JEFERSON JEANCARLOS RANGEL GIL","JHON JAIRO LÓPEZ SANTANA",
  "JONNY SUMAY SUÁREZ","JOSE LUIS FERNANDEZ RODRIGUEZ","JOSE ROSENDO PALMA NARVAEZ",
  "LEIDY KATHERINE ZAPATA RINCON","MERY JOSEFINA MORILLO MARIÑO","MIGUEL ANGEL CONTRERAS PACHECOS",
  "MONICA LUZ MERY DIAZ AGAPITO","OSCAR ESTIBEN MARTINEZ LOPEZ","RUTH FÁTIMA CHAGAS BARRETO",
  "VERONICA ALEJANDRA CAMICO GARRIDO","WILDER JOSE GAITAN DIAZ","WILFREDO MIGUEL NUÑEZ TORRES",
  "WILLIAM MARTINEZ PATIÑO","YADHIRA NAYERLY DIAZ AGAPITO","YORDAN SANTIAGO TOVAR MARTÍNEZ",
  "YORDI ALONSO MARTINEZ SAMPAYO"
];

const CREDITO_AUTOR = {
  nombre: 'Bombero Jeferson Jeancarlos Rangel Gil',
  cuerpo: 'Cuerpo de Bomberos Voluntarios de Inírida',
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
    // v5.48 SEGURIDAD: inyecta el idToken de Google en toda petición al backend.
    this._instalarFetchToken();

    // v5.88: aplica el diseño elegido (original | apple) antes de pintar la UI.
    this.aplicarTema(this._temaGuardado(), true);

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
      // v5.98: refrescar el roster desde la hoja Personal_CBVI (caché primero,
      // red después). En segundo plano: no debe demorar el arranque de la app.
      this._cargarRosterDesdeHoja().catch(() => {});
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
      <button onclick="document.getElementById('bannerNuevaVersion').remove()"
              style="position:sticky;top:0;flex-shrink:0;background:rgba(255,255,255,0.25);color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;align-self:flex-start;">
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
    if (window.__cbviFetchPatched) return;
    window.__cbviFetchPatched = true;
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
          await DB.guardarConfig('sesion', this.usuario);
        }
      } catch (ePase) { console.warn('No se pudo obtener pase de 8h:', ePase); }

      this.toast(`Bienvenido, ${usuario.nombrePila || usuario.email}`, 'exito');

      // v5.98: tras un login NUEVO también se trae el roster de la hoja
      // (el arranque con sesión ya restaurada lo hace en su propia rama).
      this._cargarRosterDesdeHoja().catch(() => {});

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
    const email = (this.usuario && this.usuario.email || '').toLowerCase().trim();
    return !!email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email);
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

  // ==================== TEMA DE DISEÑO (v5.88) ====================
  // Dos diseños: 'original' (clásico CBVI) y 'apple' (Minimalista). La
  // elección vive en localStorage del dispositivo (NO se sube al servidor)
  // y también se aplica en el <head> antes de pintar la página (anti-flash).
  // La estética cambia SOLO por CSS ([data-theme] + variables) — ninguna
  // pantalla, flujo ni dato se toca. Riesgo funcional: cero.
  _temaGuardado() {
    try {
      return localStorage.getItem('cbvi_tema') === 'apple' ? 'apple' : 'original';
    } catch (e) { return 'original'; }
  },

  aplicarTema(tema, silencioso = false) {
    const t = (tema === 'apple') ? 'apple' : 'original';
    try { localStorage.setItem('cbvi_tema', t); } catch (e) {}
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
      this.config.prefijo = document.getElementById('cfg_prefijo').value.trim().toUpperCase() || 'RE';
    }

    await DB.guardarConfig('app', this.config);
    this.toast('Configuración guardada', 'exito');
  },

  // ==================== NAVEGACIÓN ====================
  irA(pantallaId, sinHistorial = false) {
    // v5.64 (BUG 3): pill "Abriendo.../Cerrando..." — atras() marca _yendoAtras
    // antes de llamar aquí, así distinguimos ir hacia adelante de volver.
    if (this._yendoAtras) { this._flashAccion('Cerrando...'); this._yendoAtras = false; }
    else { this._flashAccion('Abriendo...'); }

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
    if (pantallaId === 'pantallaAsistencia') { this.cargarPantallaAsistencia(); }
    if (pantallaId === 'pantallaOperatividad') { this.cargarOperatividad(); }
    if (pantallaId === 'pantallaDeudores') { this.cargarPantallaDeudores(); }
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
        pantallaConfig: 'Configuración',
        pantallaActividades: '🎯 Nueva Actividad',
        pantallaListaActividades: '📋 Actividades',
        pantallaDetalleActividad: '🎯 Detalle Actividad',
        pantallaAsistencia: '📅 Asistencia',
        pantallaOperatividad: '📊 Operatividad',
        pantallaDeudores: '⚠️ Ver Deudores',
        pantallaMapa: '🗺️ Mapa de Emergencias'
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
    // v5.63 (BUG 10): widget de sanciones para admins (no bloquea el Home)
    this._cargarWidgetSanciones().catch(() => {});
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
        <div class="reporte-item ${r.estado}" data-id="${app._esc(r.id)}" onclick="app.verDetalle(this.dataset.id)">
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

  // ═══ v5.63 (BUG 10): widget "Sanciones pendientes" en el Home (solo admin) ═══
  // Recuerda a los admins qué unidades deben horas SIN tener que entrar a
  // Asistencia. Falla en silencio si no hay conexión (no molesta al bombero).
  async _cargarWidgetSanciones() {
    const cont = document.getElementById('homeSanciones');
    if (!cont) return;
    if (!navigator.onLine) { cont.style.display = 'none'; return; }
    // v5.94: la unidad NO admin que tenga deuda ve ÚNICAMENTE su propia sanción
    // (no la de los demás). El admin sigue viendo el listado completo.
    if (!this.esAdmin()) { return this._cargarWidgetMiSancion(cont); }
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarSanciones', adminEmail: this.usuario ? this.usuario.email : '' })
      });
      const data = await resp.json();
      if (!data.ok) { cont.style.display = 'none'; return; }
      const sanc = (data.sanciones || []).filter(s => Number(s.horasPendientes) > 0);
      if (!sanc.length) { cont.style.display = 'none'; return; }
      sanc.sort((a,b) => Number(b.horasPendientes) - Number(a.horasPendientes));
      const badge = (s) => {
        if (s.tipoAlerta === 'DESERCION' || s.tipoAlerta === 'RETIRO')
          return '<span style="background:#c00;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:6px;">🚨 DESERCIÓN</span>';
        if (s.tipoAlerta === 'LLAMADO_ESCRITO')
          return '<span style="background:#e65100;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:6px;">📄 ESCRITO</span>';
        if (s.tipoAlerta === 'LLAMADO_VERBAL')
          return '<span style="background:#ff9800;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:6px;">🗣️ VERBAL</span>';
        return '';
      };
      const filas = sanc.slice(0, 5).map(s =>
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #ffe0e0;font-size:13px;">'
        + '<span style="font-weight:600;">' + app._esc(s.nombre) + badge(s) + '</span>'
        + '<span style="color:#c00;font-weight:700;white-space:nowrap;margin-left:8px;">' + s.horasPendientes + 'h</span>'
        + '</div>').join('');
      const resto = sanc.length > 5
        ? '<div style="font-size:11px;color:#c00;margin-top:4px;">+ ' + (sanc.length - 5) + ' más — toca para ver todas</div>' : '';
      cont.innerHTML =
        '<div onclick="app.abrirDeudores()" style="background:#fff5f5;border:1px solid #ffcdd2;border-left:4px solid #c00;border-radius:12px;padding:12px 14px;margin:12px 0;cursor:pointer;">'
        + '<div style="font-weight:700;color:#c00;font-size:14px;margin-bottom:6px;">⚠️ Sanciones pendientes (' + sanc.length + ')</div>'
        + filas + resto
        + '</div>';
      cont.style.display = 'block';
    } catch (e) { cont.style.display = 'none'; }
  },

  // ═══ v5.94: sanción propia para la unidad (NO admin) ═══
  // Muestra en el Inicio SOLO la deuda de quien está en sesión — nunca la de
  // los demás. La identidad se verifica en el backend con el pase firmado
  // (no con el email declarado), así que nadie puede pedir la de otro.
  async _cargarWidgetMiSancion(cont) {
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'miSancion', pase: this._pase || '', idToken: this._googleIdToken || '' })
      });
      const data = await resp.json();
      if (!data.ok || !data.sancion || Number(data.sancion.horasPendientes) <= 0) { cont.style.display = 'none'; return; }
      this._miSancionCache = data;
      const s = data.sancion;
      const badge =
        (s.tipoAlerta === 'DESERCION' || s.tipoAlerta === 'RETIRO') ? '<span style="background:#c00;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:6px;">🚨 DESERCIÓN</span>'
        : (s.tipoAlerta === 'LLAMADO_ESCRITO') ? '<span style="background:#e65100;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:6px;">📄 ESCRITO</span>'
        : (s.tipoAlerta === 'LLAMADO_VERBAL') ? '<span style="background:#ff9800;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:6px;">🗣️ VERBAL</span>'
        : '';
      cont.innerHTML =
        '<div onclick="app.abrirMiSancion()" style="background:#fff5f5;border:1px solid #ffcdd2;border-left:4px solid #c00;border-radius:12px;padding:12px 14px;margin:12px 0;cursor:pointer;">'
        + '<div style="font-weight:700;color:#c00;font-size:14px;margin-bottom:4px;">⚠️ Tienes ' + app._esc(String(s.horasPendientes)) + ' horas de sanción pendientes' + badge + '</div>'
        + '<div style="font-size:12px;color:#c00;">Toca para ver de qué domingos vienen →</div>'
        + '</div>';
      cont.style.display = 'block';
    } catch (e) { cont.style.display = 'none'; }
  },

  // v5.94: detalle en solo lectura de la deuda propia (modal, sin diálogos
  // nativos — I4). Usa lo ya traído por _cargarWidgetMiSancion.
  abrirMiSancion() {
    const data = this._miSancionCache;
    if (!data || !data.sancion) return;
    const s = data.sancion;
    const faltas = data.faltas || [];
    const filas = faltas.length
      ? faltas.map(f =>
          '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #ffe0e0;font-size:13px;">'
          + '<span style="font-weight:600;white-space:nowrap;">' + app._esc(f.fecha || '-') + '</span>'
          + '<span style="color:#555;text-align:right;">' + app._esc(f.tema || '(sin tema)') + '</span>'
          + '</div>').join('')
      : '<div style="color:#777;font-style:italic;padding:8px 0;">No hay domingos sin excusa registrados para ti.</div>';
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:20px;max-width:420px;width:100%;max-height:80vh;overflow:auto;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
      + '<div style="font-size:16px;font-weight:800;color:#c00;text-align:center;margin-bottom:4px;">⚠️ Mi sanción</div>'
      + '<div style="text-align:center;font-size:14px;color:#333;margin-bottom:12px;">Debes <b style="color:#c00;">' + app._esc(String(s.horasPendientes)) + ' horas</b></div>'
      + '<div style="font-size:12px;color:#666;margin-bottom:6px;">Domingos sin excusa que generaron tu deuda:</div>'
      + filas
      + '<div style="font-size:11px;color:#888;margin-top:12px;line-height:1.5;">La deuda se duplica cada domingo que pase sin cumplir tus horas (tope 32h). Cumplir las horas a tiempo es lo único que la detiene. Si ves un error, avisa al administrador.</div>'
      + '<button id="_miSancCerrar" style="margin-top:14px;width:100%;padding:12px;background:#c0392b;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Cerrar</button>'
      + '</div>';
    document.body.appendChild(modal);
    const cerrar = () => { if (modal.parentNode) document.body.removeChild(modal); };
    document.getElementById('_miSancCerrar').onclick = cerrar;
    modal.onclick = (ev) => { if (ev.target === modal) cerrar(); };
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
  // cerca de Inírida, pasaba el chequeo de rango y se guardaba MAL en silencio: el pin
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
    const mNeg = s.match(/^(.+?)[,\s]+(-.+)$/);                 // la longitud arranca con '-' (Inírida)
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
  // Inírida) y no mete texto libre a innerHTML (solo números ya parseados y GMS derivado).
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
    if (select.value === 'Otro') otroInput.style.display = 'block';
    else otroInput.style.display = 'none';
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

  // v5.98: la hoja Personal_CBVI manda. Se llama al restaurar sesión y tras
  // iniciar sesión. Primero pinta lo cacheado (instantáneo y funciona SIN
  // señal), luego refresca desde el backend en segundo plano.
  // Inírida se queda sin cobertura por días: por eso nunca se bloquea ni se
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
  // sin tildes y Ñ→N. Así "GERMÁN ROJAS" == "GERMAN ROJAS" y "MARIÑO" == "MARINO".
  _normFuerte(s) {
    return (s || '').toString().trim().toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  },

  // v5.63 (anti-fallas): confirmación async con modal propio (APK-safe)
  _confirmarAsync(mensajeHTML, txtOk, txtCancel) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:22px;max-width:340px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
        + '<div style="font-size:14px;color:#333;margin-bottom:16px;line-height:1.5;">'+mensajeHTML+'</div>'
        + '<div style="display:flex;gap:10px;">'
        + '<button id="_caCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:13px;">'+(txtCancel||'Cancelar')+'</button>'
        + '<button id="_caOk" style="flex:1;padding:12px;background:#1e8449;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:13px;">'+(txtOk||'Continuar')+'</button>'
        + '</div></div>';
      document.body.appendChild(modal);
      const fin = (v) => { try { document.body.removeChild(modal); } catch(e){} resolve(v); };
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
      btn.innerHTML = '<span class="spinner-cbvi"></span> ' + (textoCargando || 'Cargando...');
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
            <img src="${this._imgDrive(f)}" alt="">
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

  async enviarReporte(btn) {
    // v5.63 (BUG doble click): si ya está enviando, ignorar toques extra
    if (this._enviandoReporte) return;
    const r = this.leerFormulario();
    if (!r.narrativa || !r.direccion || !r.comandanteNombre || !r.fechaLlamada) {
      this.toast('Faltan: fecha llamada, narrativa, dirección y comandante', 'error');
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
    if (btn) { btn.disabled = true; btn.style.opacity='0.65'; btn.innerHTML='<span class="spinner-cbvi"></span> Enviando...'; }
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

  // ═══ v5.76: alerta de sanciones bajo demanda (botón en Configuración) ═══
  // El backend recalcula sanciones, manda el correo personal a cada deudor y
  // el resumen a la estación. El pase firmado viaja solo (interceptor de
  // fetch); el servidor tiene enfriamiento de 10 min contra doble envío y
  // _conBloqueo evita el doble toque local.
  async enviarAlertaSanciones(btn) {
    if (!this.esAdmin()) {
      this.toast('Solo el administrador', 'error');
      return;
    }
    if (!this.config.urlBackend) {
      this.toast('Configure URL del backend primero', 'error');
      return;
    }
    const ok = await this.confirmar(
      '📨 Enviar alerta de sanciones',
      'Se enviará AHORA un correo a cada unidad deudora (a su correo personal) y el resumen completo a la estación. ¿Continuar?'
    );
    if (!ok) return;

    await this._conBloqueo(btn, 'Enviando...', async () => {
      try {
        const resp = await fetch(this.config.urlBackend, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            accion: 'enviarAlertaSanciones',
            adminEmail: this.usuario.email
          })
        });
        const data = await resp.json();
        if (data && data.ok) {
          if (!data.deudores) {
            this.toast('✅ No hay unidades con horas pendientes — no se envió ningún correo', 'exito');
          } else {
            const faltantes = (data.sinCorreo && data.sinCorreo.length) ? ' · ' + data.sinCorreo.length + ' sin correo en la base' : '';
            this.toast('✅ Alerta enviada: ' + data.enviados + ' de ' + data.deudores + ' deudor(es) con correo' + faltantes, 'exito');
          }
        } else {
          this.toast('Error: ' + ((data && data.error) || 'desconocido'), 'error');
        }
      } catch (err) {
        console.error('Error enviando alerta de sanciones:', err);
        this.toast('Error de red al enviar la alerta', 'error');
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
    const pw = await this._obtenerPwdAdmin('🔐 Contraseña de administrador');
    if (!pw) return;
    this._adminAutorizado = true;
    this.irA('pantallaPanelAdmin');
    // v5.94: si venías de "Ver reporte completo" (p. ej. desde el Mapa de
    // Emergencias), la vista de detalle quedaba abierta y al reentrar al Panel
    // se veía ese reporte (a veces vacío) en lugar de la lista. Reseteamos.
    this._resetVistaPanelAdmin();
    await this.cargarReportesAdmin();
  },

  // v5.94: deja el Panel Admin en su estado inicial (lista visible, detalle y
  // edición ocultos). Seguro de llamar aunque algún nodo no exista.
  _resetVistaPanelAdmin() {
    const viendo = document.getElementById('panelAdminViendo');
    const editando = document.getElementById('panelAdminEditando');
    const wrap = document.getElementById('listaReportesAdminWrap');
    if (viendo) viendo.style.display = 'none';
    if (editando) editando.style.display = 'none';
    if (wrap) wrap.style.display = 'block';
    this._reporteAdminViendo = null;
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
        <div style="font-weight:bold;color:var(--rojo);font-size:15px;">${r.consecutivo || '(sin consecutivo)'}</div>
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
    const cont = document.getElementById('panelAdminViendoContenido');
    cont.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">Cargando reporte completo desde el servidor...</div>';

    // Descargar reporte completo. v5.94: si la descarga falla (auth intermitente
    // o red caída en Inírida) NO mostramos el stub pobre del mapa como si fuera
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
    const fmt = (v) => (v === null || v === undefined || v === '') ? '<span style="color:#999;">—</span>' : app._esc(v);
    const fecha = (v) => {
      if (!v) return '—';
      try { return new Date(v).toLocaleString('es-CO'); } catch (e) { return String(v); }
    };
    const lista = (arr) => (arr && arr.length) ? arr.join(', ') : '—';

    const fotos = (r.fotos || []).map(u => this._imgDrive(u));
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
        <a href="${url}" target="_blank">
          <img src="${src}" alt="${etiqueta}"
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
      <h3 style="color:var(--rojo);margin:0 0 12px 0;">📄 ${r.consecutivo || '(sin consecutivo)'}</h3>
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
          ${renderFirma(_srcFirmaAf, 'Firma del afectado')}
          ${renderFirma(_srcFirmaCmd, 'Firma del comandante')}
        </div>
      `)}

      ${card('💰 Bonificaciones — bomberos que participaron', `
        <div style="font-size:12px;color:#555;background:#f0f7ff;padding:8px;border-radius:4px;margin-bottom:10px;border:1px solid #b0cfe0;">
          Lista de bomberos registrados en la hoja <em>Bonificaciones</em>
          para este reporte. Para agregar o quitar bomberos usa <strong>✏️ Editar</strong>.
        </div>
        <div id="adminBonifChips_${r.id}" style="min-height:36px;display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:#f8f8f8;border:1px solid #e5e5e5;border-radius:6px;">
          <span style="color:#888;font-style:italic;font-size:12px;">Cargando...</span>
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

  // Agrega UN bombero a Bonificaciones del reporte
  async agregarBomberoBonifAdmin(btn, idReporte) {
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
          accion: 'agregarBomberoBonificacion',
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

  // Quita UN bombero específico de Bonificaciones del reporte
  async quitarBomberoBonifAdmin(btn, idReporte, nombre) {
    const ok = await this.confirmar('Quitar bombero', `¿Quitar a "${nombre}" de las bonificaciones de este reporte?`);
    if (!ok) return;
    await this._conBloqueo(btn, 'Quitando...', async () => {
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'quitarBomberoBonificacion',
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
            🛡️ Editando como administrador — ${ (r && r.consecutivo) || '' }
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

  // Espera a que TODAS las imágenes de la ventana de impresión carguen
  // (máximo 10 s, pensado para el internet de Inírida) antes de imprimir.
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
      // v5.86: noopener corta el enlace ventana.opener → esta pestaña de
      // impresión (que solo escribe HTML propio) ya no tiene forma de tocar
      // la app viva aunque algún dato inyectado lograra ejecutarse.
      const ventana = window.open('', '_blank', 'width=900,height=1200,noopener');
      if (!ventana) {
        this.toast('El navegador bloqueó la ventana emergente. Permita pop-ups e intente de nuevo.', 'error');
        return;
      }
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
      `<img src="${f}" style="width:100%; max-width:200px; border-radius: 8px; margin: 4px;">`
    ).join('');

    const recursosHTML = (r.recursos || []).map(rec => {
      const personalStr = (rec.personal && rec.personal.length)
        ? `<br><small>👥 ${app._esc(rec.personal.join(', '))}</small>` : '';
      return `<li><strong>${app._esc(rec.recurso)}</strong> (cant: ${rec.cantidad}) ${rec.codigo ? '— ' + app._esc(rec.codigo) : ''} ${rec.responsable ? '— ' + app._esc(rec.responsable) : ''}${personalStr}</li>`;
    }).join('');

    cont.innerHTML = `
      <div class="config-card">
        <h3>${r.consecutivo || 'Sin consecutivo'}</h3>
        <p style="font-size: 12px; color: var(--gris-texto); margin-bottom: 12px;">
          <span class="badge ${r.estado}">${this.etiquetaEstado(r.estado)}</span>
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

    // v5.86: noopener — ver nota en _imprimirReporteEnVentanaNueva.
    const ventana = window.open('', '_blank', 'noopener');
    if (!ventana) {
      this.toast('Bloqueador de ventanas activo. Permita ventanas emergentes.', 'error');
      return;
    }
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
    const recursosFilas = (r.recursos || []).map(rec => `
      <tr>
        <td>${app._esc(rec.recurso || '')}</td>
        <td style="text-align:center;">${app._esc(rec.cantidad || '')}</td>
        <td>${app._esc(rec.codigo || '')}</td>
        <td>${app._esc(rec.responsable || '')}${rec.personal && rec.personal.length ? '<br><small>' + app._esc(rec.personal.join(', ')) + '</small>' : ''}</td>
      </tr>
    `).join('');

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
              <img src="${fotos[i]}" alt="Foto ${i+1}">
              <div class="foto-pie">Fotografía ${i+1}</div>
            </div>
          `);
        }
        // slot vacío: no se agrega cuadro si no hay foto
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
        <td class="label" style="width:30%;">RECURSO</td>
        <td class="label" style="width:15%;">CANTIDAD</td>
        <td class="label" style="width:25%;">PLACA / CÓDIGO</td>
        <td class="label" style="width:30%;">RESPONSABLE</td>
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
        <td>${r.firmas?.afectado ? `<img src="${this._imgDrive(r.firmas.afectado)}" class="firma-img">` : '&nbsp;'}</td>
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
          ${r.firmas?.comandante ? `<img src="${this._imgDrive(r.firmas.comandante)}" class="firma-img" style="max-height: 55px;">` : '&nbsp;'}
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

  _flashAccion(texto) {
    const el = document.getElementById('navFeedback');
    if (!el) return;
    clearTimeout(this._navFeedbackTimer);
    el.textContent = texto;
    el.classList.add('visible');
    this._navFeedbackTimer = setTimeout(() => el.classList.remove('visible'), 500);
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
,
  // ═══════════════════════════════════════════════════════════════════════════
  // MÓDULO ACTIVIDADES
  // ═══════════════════════════════════════════════════════════════════════════

  iniciarNuevaActividad() {
    this._actPersonal = [];
    this._actRecursos = [];
    this._actFotos = { inicio: null, medio: null, fin: null };
    this.irA('pantallaActividades');
    // reset form fields
    setTimeout(() => {
      ['actTipo','actDescripcion','actFecha','actLugar','actHoraInicio','actHoraFin','actNovedades'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value='';
      });
      this._renderPersonalActividad();
      ['prevFotoInicio','prevFotoMedio','prevFotoFin'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerHTML = '<span style="font-size:20px;">📷</span>';
      });
    }, 50);
  },

  _actFotos: { inicio: null, medio: null, fin: null },
  _actPersonal: [],
  _actRecursos: [],

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
        body: JSON.stringify({ accion: 'buscarPersonalCBVI', q })
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
    if (btn) { htmlBtn = btn.innerHTML; btn.disabled = true; btn.style.opacity='0.65'; btn.innerHTML='<span class="spinner-cbvi"></span> Guardando actividad...'; }
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
        fotoInicio: this._actFotos.inicio,
        fotoMedio: this._actFotos.medio,
        fotoFin: this._actFotos.fin
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
        const fallo = ['inicio','medio','fin'].some(k => df.recibidas[k] && !df.subidas[k]);
        if (fallo) {
          const linea = (k) => 'Foto ' + k + ': recibida=' + (df.recibidas[k]?'SÍ':'NO')
            + ' | Drive=' + (df.subidas[k]?'SÍ ✅':'NO ❌')
            + ((df.errores && df.errores[k]) ? (' (' + df.errores[k] + ')') : '');
          // alert() nativo NO se ve en el APK/WebView → modal propio de la app.
          this.confirmar('⚠️ Foto no guardada',
            'Una foto no se subió al servidor.  ·  ' + linea('inicio') + '  ·  ' + linea('medio') + '  ·  ' + linea('fin'));
        }
      }
      this.toast('✅ Actividad registrada', 'exito');
      this._actIdCliente = null; // ← próximo registro tendrá su propio id
      // Reset form
      this._actPersonal = [];
      this._actFotos = { inicio: null, medio: null, fin: null };
      ['actTipo','actDescripcion','actFecha','actLugar','actHoraInicio','actHoraFin','actNovedades'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = '';
      });
      this._renderPersonalActividad();
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
    cont.innerHTML = '<div style="text-align:center;padding:30px;color:#999;">Cargando...</div>';
    const esAdm = this.esAdmin();
    let htmlAct = '', htmlDom = '';

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
          '<div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;border-left:4px solid #1a5276;">'
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

    // 2) Asistencia de domingos (con presentes / excusa / sin excusa)
    try {
      const rD = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarDomingos' })
      });
      const dD = await rD.json();
      if (dD.ok && dD.domingos && dD.domingos.length) {
        htmlDom = dD.domingos.map(d =>
          '<div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;border-left:4px solid #1e8449;cursor:pointer;" data-f="'+d.fecha+'" onclick="app.verAsistenciaDomingo(this.dataset.f)">'
          +'<div style="font-weight:700;color:#1e8449;">📅 '+d.fecha+(d.tipo?' — '+d.tipo:'')+'</div>'
          +(d.tema?'<div style="font-size:12px;color:#666;margin:2px 0;">'+app._esc(d.tema)+'</div>':'')
          +'<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">'
          +'<span style="background:#e8f5e9;color:#1e8449;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">✅ Presentes: '+(d.presentes||0)+'</span>'
          +'<span style="background:#fff8e1;color:#e65100;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">📝 Con excusa: '+(d.excusados||0)+'</span>'
          +'<span style="background:#ffebee;color:#c00;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">❌ Sin excusa: '+(d.sinExcusa||0)+'</span>'
          +'</div></div>'
        ).join('');
      } else {
        htmlDom = '<div style="text-align:center;padding:20px;color:#999;">No hay domingos registrados</div>';
      }
    } catch(e) { htmlDom = '<div style="color:#c00;padding:14px;">Error cargando domingos</div>'; }

    cont.innerHTML =
      '<div style="font-size:13px;font-weight:700;color:#1a5276;margin:4px 0 8px;letter-spacing:.5px;">📋 ACTIVIDADES</div>' + htmlAct
      + '<div style="font-size:13px;font-weight:700;color:#1e8449;margin:18px 0 8px;letter-spacing:.5px;">📅 ASISTENCIA DE DOMINGOS</div>' + htmlDom;
  },

  async verDetalleActividad(id) {
    this._actividadActual = id;
    this.irA('pantallaDetalleActividad');
    const cont = document.getElementById('detalleActividadContenido');
    cont.innerHTML = '<div style="text-align:center;padding:30px;color:#999;">Cargando...</div>';
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
        <div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="font-size:18px;font-weight:700;color:#1a5276;margin-bottom:8px;">${a.tipo}</div>
          <div style="color:#333;margin-bottom:6px;">${app._esc(a.descripcion)}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:13px;color:#555;">
            <div>📅 ${app._esc(a.fecha)}</div><div>📍 ${app._esc(a.lugar||'-')}</div>
            <div>🕐 ${a.horaInicio||'-'} → ${a.horaFin||'-'}</div><div>⏱️ ${a.duracion}h</div>
          </div>
          ${a.novedades ? `<div style="margin-top:8px;padding:8px;background:#f5f5f5;border-radius:6px;font-size:13px;">${app._esc(a.novedades)}</div>` : ''}
        </div>
        <div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="font-weight:700;margin-bottom:8px;">👥 Personal (${a.personal.length})</div>
          ${a.personal.map(p => `<div style="padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">
            <strong>${app._esc(p.nombre)}</strong> — ${app._esc(p.rango)}<div style="font-size:12px;color:#666;">CC: ${app._esc(p.cedula)}</div>
          </div>`).join('')}
        </div>
        ${(a.fotoInicio||a.fotoMedio||a.fotoFin) ? `
        <div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;">
          <div style="font-weight:700;margin-bottom:8px;">📸 Fotos</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
            ${a.fotoInicio ? `<div><div style="font-size:11px;color:#666;text-align:center;">Inicio</div><img src="${this._imgDrive(a.fotoInicio)}" style="width:100%;border-radius:6px;"></div>` : ''}
            ${a.fotoMedio ? `<div><div style="font-size:11px;color:#666;text-align:center;">Intermedio</div><img src="${this._imgDrive(a.fotoMedio)}" style="width:100%;border-radius:6px;"></div>` : ''}
            ${a.fotoFin ? `<div><div style="font-size:11px;color:#666;text-align:center;">Final</div><img src="${this._imgDrive(a.fotoFin)}" style="width:100%;border-radius:6px;"></div>` : ''}
          </div>
        </div>` : ''}`;
    } catch(e) { cont.innerHTML = `<div style="color:#c00;padding:20px;">Error: ${e.message}</div>`; }
  },

  imprimirActividad() {
    const a = this._detalleActividadData;
    if (!a) return;
    // v5.86: noopener — ver nota en _imprimirReporteEnVentanaNueva.
    const w = window.open('', '_blank', 'noopener');
    const logo = (typeof LOGO_BIG !== 'undefined') ? LOGO_BIG : '';
    const tel = (typeof TELEFONO_ESTACION !== 'undefined') ? TELEFONO_ESTACION : '314 531 1605';
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
          <div>INÍRIDA – GUAINÍA</div>
          <div>Personería Jurídica N° 3561 del 5 de Agosto de 1976</div>
          <div>NIT: 843000056-0 | Tel. ${tel} | Calle 15 N° 5-07 Zona Indígena</div>
        </div>
        <div style="width:80px;"></div>
      </div>
      <div class="titulo">REGISTRO OFICIAL DE ACTIVIDAD</div>
      <div class="lema">"ABNEGACIÓN Y DISCIPLINA"</div>

      <h2 class="sec">${a.tipo}</h2>
      <p><strong>Descripción:</strong> ${app._esc(a.descripcion)}</p>
      <table><tr><th>Fecha</th><th>Lugar</th><th>Hora inicio</th><th>Hora fin</th><th>Duración</th></tr>
      <tr><td>${app._esc(String(a.fecha||'').substring(0,10))}</td><td>${app._esc(a.lugar||'-')}</td><td>${app._esc(a.horaInicio||'-')}</td><td>${app._esc(a.horaFin||'-')}</td><td>${app._esc(a.duracion)}h</td></tr></table>
      ${a.novedades ? `<p><strong>Novedades:</strong> ${app._esc(a.novedades)}</p>` : ''}

      <h2 class="sec">Personal asistente (${a.personal.length})</h2>
      <table><tr><th>#</th><th>Nombre</th><th>Cédula</th><th>Rango</th><th>Horas</th></tr>
      ${a.personal.map((p,i) => `<tr><td>${i+1}</td><td>${app._esc(p.nombre)}</td><td>${app._esc(p.cedula)}</td><td>${app._esc(p.rango)}</td><td>${app._esc(p.horas)}h</td></tr>`).join('')}
      </table>

      ${(a.fotoInicio||a.fotoMedio||a.fotoFin) ? `<h2 class="sec">Registro fotográfico</h2><div class="fotos">
        ${a.fotoInicio ? `<div><p style="text-align:center;font-weight:700;font-size:9pt;">Inicio</p><img src="${this._imgDrive(a.fotoInicio)}"></div>` : ''}
        ${a.fotoMedio ? `<div><p style="text-align:center;font-weight:700;font-size:9pt;">Intermedio</p><img src="${this._imgDrive(a.fotoMedio)}"></div>` : ''}
        ${a.fotoFin ? `<div><p style="text-align:center;font-weight:700;font-size:9pt;">Final</p><img src="${this._imgDrive(a.fotoFin)}"></div>` : ''}
      </div>` : ''}

      <div class="pie">
        Registrado por: ${a.registradoPor||'-'}<br>
        Documento bajo Ley 1575 de 2012 (Ley General de Bomberos de Colombia) | Ley 1581 de 2012 (Habeas Data)<br>
        Cuerpo de Bomberos Voluntarios Inírida – Guainía | "ABNEGACIÓN Y DISCIPLINA"
      </div>
      </body></html>`);
    w.document.close();
    this._imprimirCuandoCarguenImagenes(w, 10000);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MÓDULO ASISTENCIA
  // ═══════════════════════════════════════════════════════════════════════════

  _asistRegistros: {},

  async cargarPantallaAsistencia() {
    const esAdmin = this.esAdmin();
    const adminPanel = document.getElementById('asistenciaAdminPanel');
    if (adminPanel) adminPanel.style.display = esAdmin ? 'block' : 'none';
    const sanPanel = document.getElementById('asistSancionesPanel');

    // Cargar historial de domingos
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarDomingos' })
      });
      const data = await resp.json();
      const hist = document.getElementById('asistHistorial');
      if (!data.ok || !data.domingos.length) {
        hist.innerHTML = '<div style="color:#999;text-align:center;padding:10px;">Sin registros aún</div>'; return;
      }
      hist.innerHTML = data.domingos.slice(0,10).map(d => {
        const f = typeof d === 'string' ? d : d.fecha;
        const tipo = typeof d === 'object' ? (d.tipo||'') : '';
        const tema = typeof d === 'object' ? (d.tema||'') : '';
        const esAdmH = this.esAdmin();
        return '<div style="padding:10px;border-bottom:1px solid #f0f0f0;">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">'
          + '<span data-f="'+f+'" onclick="app.verAsistenciaDomingo(this.dataset.f)" style="font-weight:600;cursor:pointer;flex:1;">📅 '+f+(tipo?' — '+app._esc(tipo):'')+'</span>'
          + (esAdmH
            ? '<button data-f="'+f+'" onclick="app.editarDomingo(this.dataset.f)" style="background:#1a5276;color:#fff;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px;">✏️</button>'
              + '<button data-f="'+f+'" onclick="app.eliminarDomingo(this.dataset.f)" style="background:#c00;color:#fff;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px;">🗑️</button>'
            : '')
          + '<span data-f="'+f+'" onclick="app.verAsistenciaDomingo(this.dataset.f)" style="color:#1a5276;font-size:13px;cursor:pointer;">Ver →</span>'
          + '</div>'
          + (tema ? '<div style="font-size:12px;color:#666;margin-top:2px;">'+app._esc(tema)+'</div>' : '')
          + '</div>';
      }).join('');
    } catch(e) {}

    // v5.64 (BUG 1): la lista editable de deudores se movió a su propia
    // pantalla (Ver Deudores). Aquí solo queda un aviso compacto con enlace.
    if (esAdmin) {
      try {
        const resp2 = await fetch(URL_BACKEND, {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'listarSanciones', adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '' })
        });
        const d2 = await resp2.json();
        if (d2.ok && d2.sanciones.length) {
          sanPanel.style.display = 'block';
          document.getElementById('asistSanciones').innerHTML =
            '<div onclick="app.abrirDeudores()" style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;">'
            + '<span>' + d2.sanciones.length + ' unidad(es) con horas de sanción pendientes</span>'
            + '<span style="color:#c00;font-weight:700;">Ver Deudores →</span></div>';
        } else {
          sanPanel.style.display = 'none';
        }
      } catch(e) {}
    }
  },

  async cargarListaAsistencia() {
    const fecha = document.getElementById('asistFecha').value;
    if (!fecha) return;
    const cont = document.getElementById('asistListaPersonal');
    cont.innerHTML = '<div style="text-align:center;padding:16px;color:#999;">Cargando personal...</div>';
    document.getElementById('btnGuardarAsistencia').style.display = 'block';
    const _nb=document.getElementById('btnMostrarNuevoBombero');if(_nb)_nb.style.display='block';
    this._asistRegistros = {};
    try {
      const [r1,r2]=await Promise.all([
        fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({accion:'listarTodoPersonal'})}),
        fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({accion:'listarAsistenciaDomingo',fecha})})
      ]);
      const [d1,d2]=await Promise.all([r1.json(),r2.json()]);
      // v5.81: se restaura también la observación previa (no solo el estado)
      const prev={}; if(d2.ok) d2.registros.forEach(r=>{prev[r.cedula||r.nombre]={estado:r.estado,observacion:String(r.observacion||'')};});
      // v5.81: se guarda rango + orden (fila en Personal_CBVI) para llamar a
      // lista por rangos y en el orden de la hoja (antes el objeto ordenaba
      // por cédula numérica y el orden quedaba "raro").
      if(d1.ok) d1.personal.forEach((p,ix)=>{
        const k=p.cedula||p.nombre; const pv=prev[k]||{};
        this._asistRegistros[k]={nombre:p.nombre,cedula:p.cedula,rango:p.rango||'BOMBERO',
          orden:(p.orden!==undefined&&p.orden!==null)?Number(p.orden):(ix+1),
          estado:pv.estado||'PRESENTE',observacion:pv.observacion||''};
      });
    }catch(e){cont.innerHTML='<div style="color:#c00;padding:10px;">Error: '+app._esc(e.message)+'</div>';return;}
    this._renderAsistencia(fecha);
  },

  // v5.81: categoría jerárquica para el llamado a lista.
  // 0=OFICIALES, 1=SUBOFICIALES, 2=BOMBEROS (y desconocidos), 3=ASPIRANTES.
  // SUBTENIENTE contiene "TENIENTE" → cae en Oficiales igual (correcto).
  _catRango(rango) {
    const r = this._normNombre(rango || '');
    if (r.indexOf('COMANDANTE') !== -1 || r.indexOf('CAPITAN') !== -1 || r.indexOf('TENIENTE') !== -1) return 0;
    if (r.indexOf('SARGENTO') !== -1 || r.indexOf('CABO') !== -1) return 1;
    if (r.indexOf('ASPIRANTE') !== -1) return 3;
    return 2;
  },

  _ROTULOS_CAT: ['🎖️ OFICIALES', '🪖 SUBOFICIALES', '🚒 BOMBEROS', '🎓 ASPIRANTES'],

  _renderAsistencia(fecha) {
    const cont = document.getElementById('asistListaPersonal');
    if (!cont) return;
    // v5.81: llamado a lista por rangos (Oficiales → Suboficiales → Bomberos →
    // Aspirantes) y, dentro de cada rango, por el orden de fila de la hoja
    // Personal_CBVI. Antes Object.values() ordenaba por cédula numérica.
    const lista = Object.values(this._asistRegistros).sort((a, b) => {
      const ca = this._catRango(a.rango), cb = this._catRango(b.rango);
      if (ca !== cb) return ca - cb;
      return (a.orden || 999999) - (b.orden || 999999);
    });
    const filaHTML = (p) => {
      const key = String(p.cedula || p.nombre || '').replace(/"/g, '&quot;');
      const conExcusa = p.estado === 'AUSENTE_EXCUSA';
      return '<div data-row="'+key+'" style="padding:8px;border-bottom:1px solid #f0f0f0;">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;">'
        + '<div style="flex:1;"><div style="font-size:14px;font-weight:600;">'+app._esc(p.nombre||'(sin nombre)')+'</div>'
        + '<div style="font-size:11px;color:#999;">CC: '+app._esc(p.cedula||'-')+'</div></div>'
        + '<select data-k="'+key+'" data-n="'+app._esc(p.nombre||'')+'" onchange="app._setAsistencia(this.dataset.k,this.dataset.n,this.value)" '
        + 'style="padding:5px 8px;border:1px solid #ddd;border-radius:6px;font-size:12px;background:'+(p.estado==='PRESENTE'?'#e8f5e9':p.estado==='AUSENTE_EXCUSA'?'#fff8e1':'#ffebee')+'">'
        + '<option value="PRESENTE" '+(p.estado==='PRESENTE'?'selected':'')+'>Presente</option>'
        + '<option value="AUSENTE_EXCUSA" '+(p.estado==='AUSENTE_EXCUSA'?'selected':'')+'>C/excusa</option>'
        + '<option value="AUSENTE_SIN_EXCUSA" '+(p.estado==='AUSENTE_SIN_EXCUSA'?'selected':'')+'>Sin excusa</option>'
        + '</select>'
        + '<button data-k="'+key+'" onclick="app._quitarAsistencia(this.dataset.k)" style="background:none;border:none;color:#c00;font-size:16px;cursor:pointer;padding:4px;margin-left:4px;">X</button>'
        + '</div>'
        // v5.81: observación de la excusa visible y editable con un toque
        + (conExcusa
          ? '<div data-k="'+key+'" onclick="app._editarObsExcusa(this.dataset.k)" style="margin-top:5px;background:#fff8e1;border:1px dashed #e6a23c;border-radius:6px;padding:5px 8px;font-size:12px;color:#8a5a00;cursor:pointer;">'
            + (p.observacion ? '📝 ' + app._esc(p.observacion) : '📝 <em>Toca aquí para escribir la observación de la excusa…</em>')
            + '</div>'
          : '')
        + '</div>';
    };
    let cuerpo = '';
    if (lista.length === 0) {
      cuerpo = '<div style="color:#999;font-size:13px;text-align:center;padding:10px;">Sin personal cargado aun</div>';
    } else {
      const conteo = [0,0,0,0];
      lista.forEach(p => { conteo[this._catRango(p.rango)]++; });
      let catPrev = -1;
      for (const p of lista) {
        const c = this._catRango(p.rango);
        if (c !== catPrev) {
          cuerpo += '<div style="margin:12px 0 4px;padding:6px 10px;background:#1e8449;color:#fff;border-radius:8px;font-size:12px;font-weight:700;letter-spacing:.5px;">'
            + this._ROTULOS_CAT[c] + ' (' + conteo[c] + ')</div>';
          catPrev = c;
        }
        cuerpo += filaHTML(p);
      }
    }
    cont.innerHTML = '<div style="font-size:12px;color:#555;margin-bottom:10px;">Registrando asistencia para el <strong>'+fecha+'</strong></div>'
      + cuerpo
      + '<div style="position:relative;margin-top:10px;">'
      + '<input type="text" id="asistBuscar" placeholder="Buscar y agregar bombero..." autocomplete="off" '
      + 'style="width:100%;padding:10px;border:1px solid #1e8449;border-radius:8px;font-size:14px;box-sizing:border-box;" '
      + 'oninput="app.buscarPersonalAsistencia(this.value)">'
      + '<div id="asistSugerencias" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:8px;z-index:100;box-shadow:0 4px 12px rgba(0,0,0,.15);max-height:180px;overflow-y:auto;"></div>'
      + '</div>';
  },

  _quitarAsistencia(key) {
    delete this._asistRegistros[key];
    const fecha = document.getElementById('asistFecha').value;
    this._renderAsistencia(fecha);
  },

  _buscarAsistTimer: null,
  buscarPersonalAsistencia(q) {
    clearTimeout(this._buscarAsistTimer);
    const sug = document.getElementById('asistSugerencias');
    if (!q || q.trim().length < 1) { sug.style.display = 'none'; return; }
    sug.innerHTML = '<div style="padding:8px 12px;color:#999;font-size:13px;">Buscando...</div>'; sug.style.display = 'block';
    this._buscarAsistTimer = setTimeout(async () => {
      try {
        const resp = await fetch(URL_BACKEND, {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'buscarPersonalCBVI', q: q.trim() })
        });
        const data = await resp.json();
        if (!data.ok || !data.resultados.length) { sug.style.display = 'none'; return; }
        sug.innerHTML = data.resultados.map(per =>
          `<div onclick='app.agregarAsistente(${JSON.stringify(per).replace(/'/g,"&#39;")})'
            style="padding:9px 12px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:13px;">
            <strong>${app._esc(per.nombre)}</strong> <span style="color:#666;font-size:12px;">CC: ${app._esc(per.cedula)}</span>
          </div>`
        ).join('');
        sug.style.display = 'block';
      } catch(e) { sug.style.display = 'none'; }
    }, 400);
  },

  agregarAsistente(p) {
    const _sug = document.getElementById('asistSugerencias'); if (_sug) _sug.style.display = 'none';
    const _bus = document.getElementById('asistBuscar'); if (_bus) _bus.value = '';
    const fecha = document.getElementById('asistFecha').value;
    const ced = String(p.cedula || '').trim();
    // v5.72/v5.73: dedup ROBUSTO por cédula O nombre normalizado + aviso claro si
    // la cédula ya pertenece a OTRA persona (cédula duplicada en la base).
    const exist = this._buscarAsistExistente(ced, p.nombre);
    if (exist) {
      this._renderAsistencia(fecha);
      this._avisarAsistExistente(exist, ced, p.nombre);
      this._flashAsistItem(exist.key);
      return;
    }
    const key = ced || p.nombre;
    // v5.81: conserva el rango (para el grupo correcto) y lo pone al final de
    // su categoría (orden alto = después de los que vienen de la hoja).
    this._asistRegistros[key] = { nombre: p.nombre, cedula: ced, rango: p.rango || 'BOMBERO', orden: this._sigOrdenAsist(), estado: 'PRESENTE' };
    this._renderAsistencia(fecha);
    this._flashAsistItem(key);
  },

  // v5.81: orden incremental para los agregados a mano — quedan al final de su
  // categoría de rango, después del personal que viene de la hoja.
  _sigOrdenAsist() {
    this._asistSeqAdd = (this._asistSeqAdd || 0) + 1;
    return 100000 + this._asistSeqAdd;
  },

  // Busca en la lista actual a alguien que coincida por cédula O por nombre
  // normalizado. Devuelve {key, entry} o null.
  _buscarAsistExistente(cedula, nombre) {
    const ced = this._cedKey(cedula); // v5.95: solo dígitos — "1.234.567" == "1234567"
    const nn = this._normNombre(nombre);
    for (const k in this._asistRegistros) {
      const e = this._asistRegistros[k];
      if ((ced && this._cedKey(e.cedula) === ced) || (nn && this._normNombre(e.nombre) === nn)) {
        return { key: k, entry: e };
      }
    }
    return null;
  },

  // Mensaje al usuario cuando la persona "ya está". Si la CÉDULA coincide pero el
  // NOMBRE es distinto → es una cédula duplicada (dos personas, misma cédula):
  // se avisa con claridad para que corrija el dato.
  _avisarAsistExistente(exist, cedula, nombre) {
    const ced = this._cedKey(cedula); // v5.95: solo dígitos, igual que _buscarAsistExistente
    const mismoNombre = this._normNombre(exist.entry.nombre) === this._normNombre(nombre);
    if (ced && !mismoNombre) {
      this.toast('⚠️ La cédula ' + ced + ' ya está en la lista como "' + exist.entry.nombre
        + '". Dos personas NO pueden tener la misma cédula: corrige el dato en la base.', 'error');
    } else {
      this.toast(nombre + ' ya está en la lista (resaltado)', 'info');
    }
  },

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

  // Lleva la vista a una fila de asistencia y la resalta un momento.
  _flashAsistItem(key) {
    requestAnimationFrame(() => {
      const cont = document.getElementById('asistListaPersonal');
      if (!cont) return;
      let sel;
      try { sel = '[data-row="' + (window.CSS && CSS.escape ? CSS.escape(String(key)) : String(key)) + '"]'; } catch (e) { return; }
      let row; try { row = cont.querySelector(sel); } catch (e) { row = null; }
      if (!row) return;
      try { row.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { try { row.scrollIntoView(); } catch (e2) {} }
      const bgPrev = row.style.background;
      row.style.transition = 'background 0.3s';
      row.style.background = '#fff3cd';
      setTimeout(() => { row.style.background = bgPrev || ''; }, 1600);
    });
  },

  // v5.54 FIX: faltaba esta función (el botón "Agregar y registrar" no hacía nada).
  // Registra el bombero en la base de datos del personal Y lo suma a la lista del domingo.
  async agregarNuevoBomberoAsistencia(btn) {
    const nombre = (document.getElementById('asistNuevoNombre').value || '').toUpperCase().trim();
    const cedula = (document.getElementById('asistNuevoCedula').value || '').trim();
    const tel    = (document.getElementById('asistNuevoTel').value || '').trim();
    const correo = (document.getElementById('asistNuevoCorreo').value || '').trim();
    const rango  = (document.getElementById('asistNuevoRango').value || 'BOMBERO');
    if (!nombre || !cedula) { this.toast('Nombre y cédula son obligatorios', 'error'); return; }
    const key = cedula || nombre;
    // v5.73: dedup robusto + aviso claro si la cédula ya es de otra persona.
    const _yaAsist = this._buscarAsistExistente(cedula, nombre);
    if (_yaAsist) {
      const fechaR = document.getElementById('asistFecha').value;
      this._renderAsistencia(fechaR);
      this._avisarAsistExistente(_yaAsist, cedula, nombre);
      this._flashAsistItem(_yaAsist.key);
      return;
    }

    await this._conBloqueo(btn, 'Registrando...', async () => {
    try {
      const r = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'agregarPersonalCBVI',
          nombre, cedula, telefono: tel, email: correo, rango,
          adminEmail: this.usuario?.email || ''
        })
      });
      const d = await r.json();
      if (!d.ok) { this.toast('Error: ' + (d.error || 'no se pudo registrar'), 'error'); return; }

      // Sumarlo a la lista del domingo actual (Presente)
      // v5.81: con rango y orden para que caiga en su grupo del llamado a lista
      this._asistRegistros[key] = { nombre, cedula, rango, orden: this._sigOrdenAsist(), estado: 'PRESENTE' };
      // Disponible en autocompletar de inmediato
      // v5.98: se agrega a la lista VIGENTE (la que viene de la hoja), no a la
      // semilla del código. En el próximo arranque llega ya desde Personal_CBVI.
      if (!this._rosterVigente().includes(nombre)) {
        if (!Array.isArray(this._rosterVivo)) this._rosterVivo = this._rosterVigente().slice();
        this._rosterVivo.push(nombre);
        this.poblarRosterBomberos();
      }
      // Limpiar y ocultar el formulario
      ['asistNuevoNombre','asistNuevoCedula','asistNuevoTel','asistNuevoCorreo'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
      const form = document.getElementById('asistFormNuevoBombero');
      if (form) form.style.display = 'none';

      const fecha = document.getElementById('asistFecha').value;
      this._renderAsistencia(fecha);
      this.toast('✅ ' + nombre + (d.yaExiste ? ' (ya existía)' : ' registrado'), 'exito');
    } catch (e) {
      this.toast('Sin conexión. Intenta de nuevo con internet.', 'error');
      console.error(e);
    }
    });
  },

  _setAsistencia(key, nombre, estado) {
    // v5.81: se conserva la entrada existente (rango, orden, observación) —
    // antes se reemplazaba el objeto entero y se perdían esos campos.
    const e = this._asistRegistros[key] || { nombre, cedula: key };
    e.estado = estado;
    this._asistRegistros[key] = e;
    // cambiar color del select
    const fecha = document.getElementById('asistFecha') ? document.getElementById('asistFecha').value : '';
    const cont = document.getElementById('asistListaPersonal');
    let sel = null;
    try { sel = cont ? cont.querySelector('select[data-k="' + (window.CSS && CSS.escape ? CSS.escape(String(key)) : String(key)) + '"]') : null; } catch (er) {}
    if (sel) sel.style.background = estado==='PRESENTE'?'#e8f5e9':estado==='AUSENTE_EXCUSA'?'#fff8e1':'#ffebee';
    // v5.81 (punto 4): al marcar C/excusa se pide la observación AL INSTANTE
    if (estado === 'AUSENTE_EXCUSA') {
      this._editarObsExcusa(key);
    } else if (e.observacion) {
      // Si se corrige el estado (ya no es excusa), la observación de la excusa
      // se limpia para no guardar un motivo que ya no aplica.
      e.observacion = '';
      this._renderAsistencia(fecha);
    }
  },

  // v5.81 (punto 4): cuadro propio (I4: nada de prompt() nativo) para escribir
  // o corregir la observación de una excusa ANTES de subir la asistencia.
  _editarObsExcusa(key) {
    const e = this._asistRegistros[key];
    if (!e) return;
    const viejo = document.getElementById('_obsExcModal');
    if (viejo) viejo.remove();
    const modal = document.createElement('div');
    modal.id = '_obsExcModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:20px;max-width:340px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
      + '<div style="font-size:15px;font-weight:700;color:#e65100;margin-bottom:4px;">📝 Excusa de ' + app._esc(e.nombre || '') + '</div>'
      + '<div style="font-size:12px;color:#777;margin-bottom:10px;">Escribe el motivo de la excusa (queda guardado con la asistencia).</div>'
      + '<textarea id="_obsExcTxt" rows="3" placeholder="Ej: incapacidad médica, viaje, trabajo..." style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:14px;box-sizing:border-box;resize:vertical;"></textarea>'
      + '<div style="display:flex;gap:10px;margin-top:12px;">'
      + '<button id="_obsExcOmitir" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Sin observación</button>'
      + '<button id="_obsExcGuardar" style="flex:1;padding:12px;background:#1e8449;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">💾 Guardar</button>'
      + '</div></div>';
    document.body.appendChild(modal);
    const txt = modal.querySelector('#_obsExcTxt');
    txt.value = e.observacion || '';
    setTimeout(() => { try { txt.focus(); } catch (er) {} }, 50);
    const cerrar = () => { try { document.body.removeChild(modal); } catch (er) {} };
    const fecha = document.getElementById('asistFecha') ? document.getElementById('asistFecha').value : '';
    modal.querySelector('#_obsExcOmitir').onclick = () => { cerrar(); this._renderAsistencia(fecha); this._flashAsistItem(key); };
    modal.querySelector('#_obsExcGuardar').onclick = () => {
      e.observacion = (txt.value || '').trim();
      cerrar();
      this._renderAsistencia(fecha);
      this._flashAsistItem(key);
    };
  },

  async guardarAsistencia(btn) {
    // v5.63 (BUG doble click): bloqueo mientras se guarda
    if (this._guardandoAsistencia) return;
    const fecha = document.getElementById('asistFecha').value;
    if (!fecha) { this.toast('Selecciona la fecha', 'error'); return; }
    const registros = Object.values(this._asistRegistros);
    if (!registros.length) { this.toast('Agrega personal primero', 'error'); return; }
    // Verificar sesión admin — pedir contraseña si no hay (modal APK-safe)
    const _pwdOk = await this._obtenerPwdAdmin('🔐 Contraseña admin para guardar asistencia');
    if (!_pwdOk) return;
    const tipoReunion = document.getElementById('asistTipoReunion') ? document.getElementById('asistTipoReunion').value : '';
    const tema = document.getElementById('asistTema') ? document.getElementById('asistTema').value : '';
    const lugarReunion = document.getElementById('asistLugar') ? document.getElementById('asistLugar').value : '';
    this._guardandoAsistencia = true;
    let _htmlBtnAsist = '';
    if (btn) { _htmlBtnAsist = btn.innerHTML; btn.disabled = true; btn.style.opacity='0.65'; btn.innerHTML='<span class="spinner-cbvi"></span> Guardando asistencia...'; }
    this.toast('⏳ Guardando asistencia...', 'info');
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'registrarAsistencia', fecha, registros, replaceAll: true,
          tipoReunion, tema, lugarReunion,
          encargado: document.getElementById('asistEncargado') ? document.getElementById('asistEncargado').value : '',
          comandanteGuardia: document.getElementById('asistComandanteGuardia') ? document.getElementById('asistComandanteGuardia').value : '',
          fotos: this._asistFotos || {},
          adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || ''
        })
      });
      const data = await resp.json();
      if (!data.ok) {
        if (data.error === 'No autorizado') {
          this._adminPwdSession = null; // limpiar para reintentar
          throw new Error('Contraseña incorrecta. Intenta de nuevo.');
        }
        throw new Error(data.error);
      }
      const ausentes = registros.filter(r => r.estado === 'AUSENTE_SIN_EXCUSA').length;
      this._asistFotos = { inicio:null, medio:null, fin:null };
      this.toast('✅ Asistencia guardada — ' + ausentes + ' ausentes sin excusa', 'exito');
      setTimeout(() => this.cargarPantallaAsistencia(), 1000);
    } catch(e) { this.toast('Error: ' + e.message, 'error'); }
    finally {
      this._guardandoAsistencia = false;
      if (btn) { btn.disabled = false; btn.style.opacity=''; btn.innerHTML = _htmlBtnAsist; }
    }
  },

  async verAsistenciaDomingo(fecha) {
    // v5.57: modal que funciona desde CUALQUIER pantalla (antes escribía en
    // #asistHistorial, que solo existe en la pantalla de Asistencia → fallaba
    // silenciosamente desde "Mis Actividades").
    // v5.81 (punto 1): el modal aparece AL INSTANTE con "Abriendo asistencia..."
    // y animación — antes el toque no mostraba nada mientras respondía el
    // servidor (en Inírida eso pueden ser varios segundos).
    const _prevM = document.getElementById('_domModal');
    if (_prevM) _prevM.remove();
    const m = document.createElement('div');
    m.id = '_domModal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;overflow-y:auto;padding:14px;';
    m.innerHTML =
      '<div style="background:#fff;border-radius:16px;padding:26px 18px;max-width:460px;margin:auto;text-align:center;">'
      + '<span style="display:inline-block;width:26px;height:26px;border:3px solid #cde7d8;border-top-color:#1e8449;border-radius:50%;animation:girocbvi .7s linear infinite;"></span>'
      + '<div style="margin-top:10px;font-weight:700;color:#1e8449;font-size:14px;">⏳ Abriendo asistencia del ' + app._esc(fecha) + '...</div>'
      + '<div style="font-size:12px;color:#999;margin-top:4px;">Espera un momento</div>'
      + '</div>';
    document.body.appendChild(m);
    m.onclick = (e) => { if (e.target === m) m.remove(); };
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarAsistenciaDomingo', fecha })
      });
      const data = await resp.json();
      if (!data.ok) { m.remove(); this.toast('No se pudo cargar el domingo', 'error'); return; }
      const regs = data.registros || [];
      const fotos = data.fotos || [];
      const pres = regs.filter(r => r.estado === 'PRESENTE');
      const exc  = regs.filter(r => r.estado === 'AUSENTE_EXCUSA');
      const sin  = regs.filter(r => r.estado === 'AUSENTE_SIN_EXCUSA');
      const _enc = regs[0] && regs[0].encargado || '';
      const _grd = regs[0] && regs[0].comandanteGuardia || '';
      const esAdm = this.esAdmin();

      const grupo = (titulo, arr, color, bg) =>
        '<div style="margin-top:10px;"><div style="font-weight:700;font-size:13px;color:'+color+';">'+titulo+' ('+arr.length+')</div>'
        + (arr.length ? arr.map(r => '<div style="display:flex;justify-content:space-between;padding:5px 8px;background:'+bg+';border-radius:6px;margin-top:4px;font-size:13px;"><span>'+app._esc(r.nombre)+'</span>'+(r.observacion?'<span style="color:#666;font-size:11px;">'+app._esc(r.observacion)+'</span>':'')+'</div>').join('')
                      : '<div style="color:#999;font-size:12px;padding:4px;">Ninguno</div>')
        + '</div>';

      const fotosHTML = fotos.length
        ? '<div style="margin-top:12px;"><div style="font-weight:700;font-size:13px;color:#1a5276;">📸 Fotos del domingo</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:6px;">'
          + fotos.map(f => '<img src="'+f+'" style="width:100%;border-radius:6px;border:1px solid #eee;">').join('') + '</div></div>'
        : '';

      // v5.58: notificación de sanciones de los inasistentes sin excusa
      const sanc = data.sanciones || [];
      const msgAlerta = (s) => {
        if (s.alerta === 'DESERCION' || s.alerta === 'RETIRO') return '🚨 ALERTA EXTREMA: DESERCIÓN — gestionar retiro de la institución';
        if (s.alerta === 'LLAMADO_ESCRITO') return '📄 Llamado de atención ESCRITO';
        if (s.alerta === 'LLAMADO_VERBAL')  return '🗣️ Llamado de atención VERBAL';
        return '';
      };
      const sancHTML = sanc.length
        ? '<div style="margin-top:14px;border-top:2px solid #ffcdd2;padding-top:10px;">'
          + '<div style="font-weight:700;font-size:13px;color:#c00;">⚠️ Estado de sanciones (inasistencias sin excusa)</div>'
          + sanc.map(s => {
              const al = msgAlerta(s);
              return '<div style="background:#fff5f5;border:1px solid #ffcdd2;border-radius:8px;padding:8px;margin-top:6px;font-size:13px;">'
                + '<strong>'+app._esc(s.nombre||'')+'</strong>'
                + '<div style="font-size:12px;color:#c00;margin-top:2px;">Debe <strong>'+s.horas+'h</strong> de sanción · '+s.inasist+' inasistencia(s)</div>'
                + (al ? '<div style="font-size:12px;font-weight:700;color:var(--rojo);margin-top:2px;">'+al+'</div>' : '')
                + '</div>';
            }).join('')
          + '</div>'
        : '';

      // v5.81: el modal ya está en pantalla (con la animación de carga) —
      // aquí solo se reemplaza su contenido por el detalle del domingo.
      m.innerHTML =
        '<div style="background:#fff;border-radius:16px;padding:18px;max-width:460px;margin:auto;">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">'
        +   '<div style="font-weight:700;font-size:16px;color:#1e8449;">📅 '+fecha+'</div>'
        +   '<button onclick="document.getElementById(\'_domModal\').remove()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#999;">×</button>'
        + '</div>'
        + (regs[0] && regs[0].tipoReunion ? '<div style="font-size:13px;color:#555;">'+app._esc(regs[0].tipoReunion)+(regs[0].tema?' — '+app._esc(regs[0].tema):'')+'</div>' : '')
        + (_enc ? '<div style="font-size:12px;color:#555;margin-top:4px;">Encargado: <strong>'+app._esc(_enc)+'</strong></div>' : '')
        + (_grd ? '<div style="font-size:12px;color:#555;">Guardia: <strong>'+app._esc(_grd)+'</strong></div>' : '')
        + '<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">'
        +   '<span style="background:#e8f5e9;color:#1e8449;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">✅ Presentes: '+pres.length+'</span>'
        +   '<span style="background:#fff8e1;color:#e65100;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">📝 Con excusa: '+exc.length+'</span>'
        +   '<span style="background:#ffebee;color:#c00;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;">❌ Sin excusa: '+sin.length+'</span>'
        + '</div>'
        + grupo('🔴 SIN EXCUSA (acumulan sanción)', sin, '#c00', '#ffebee')
        + grupo('🟡 CON EXCUSA', exc, '#e65100', '#fff8e1')
        + grupo('✅ PRESENTES', pres, '#1e8449', '#e8f5e9')
        + fotosHTML
        + sancHTML
        + (esAdm
            ? '<div style="display:flex;gap:8px;margin-top:14px;">'
              + '<button data-f="'+fecha+'" onclick="document.getElementById(\'_domModal\').remove();app.editarDomingo(this.dataset.f)" style="flex:1;background:#1a5276;color:#fff;border:none;border-radius:8px;padding:10px;font-weight:700;cursor:pointer;">✏️ Editar</button>'
              + '<button data-f="'+fecha+'" onclick="app.eliminarDomingo(this.dataset.f)" style="flex:1;background:#c00;color:#fff;border:none;border-radius:8px;padding:10px;font-weight:700;cursor:pointer;">🗑️ Eliminar</button>'
              + '</div>'
            : '')
        + '</div>';
    } catch(e) { m.remove(); this.toast('Error: ' + e.message, 'error'); }
  },

  // v5.90: modal propio (invariante I4 — nada de prompt() nativo, falla en el
  // APK) para registrar el cumplimiento de horas. Además de las horas pide la
  // ACTIVIDAD QUE REALIZÓ la unidad, que queda como constancia escrita en la
  // hoja Sanciones_Cumplidas. Devuelve Promise<{horas, actividad} | null>.
  _pedirCumplimientoSancion(nombre, horasPendientes) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
      const pend = Number(horasPendientes) || 0;
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:22px;max-width:360px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
        + '<div style="font-size:16px;font-weight:700;color:#333;margin-bottom:4px;">✅ Registrar horas cumplidas</div>'
        + '<div style="font-size:13px;color:#666;margin-bottom:16px;">' + this._esc(nombre || 'Unidad')
        + (pend > 0 ? ' — <strong style="color:#c00;">' + pend + 'h pendientes</strong>' : '') + '</div>'
        + '<label style="display:block;font-size:13px;font-weight:600;color:#444;margin-bottom:5px;">Horas a descontar</label>'
        + '<input id="_csHoras" type="number" min="1" ' + (pend > 0 ? 'max="' + pend + '"' : '')
        + ' inputmode="numeric" placeholder="Ej: 4" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #ddd;border-radius:8px;font-size:16px;margin-bottom:14px;">'
        + '<label style="display:block;font-size:13px;font-weight:600;color:#444;margin-bottom:5px;">Actividad que realizó <span style="color:#c00;">*</span></label>'
        + '<textarea id="_csAct" rows="3" maxlength="300" placeholder="Ej: Aseo y mantenimiento de la máquina 01, apoyo logístico en simulacro..." style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #ddd;border-radius:8px;font-size:15px;resize:vertical;margin-bottom:4px;"></textarea>'
        + '<div style="font-size:11px;color:#999;margin-bottom:14px;">Queda como constancia permanente de en qué cumplió la sanción.</div>'
        + '<div style="display:flex;gap:10px;">'
        + '<button id="_csCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Cancelar</button>'
        + '<button id="_csOk" style="flex:1;padding:12px;background:#1e8449;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Registrar</button>'
        + '</div></div>';
      document.body.appendChild(modal);
      const inpH = modal.querySelector('#_csHoras');
      const inpA = modal.querySelector('#_csAct');
      setTimeout(() => { try { inpH.focus(); } catch (e) {} }, 50);
      const fin = (val) => { try { document.body.removeChild(modal); } catch (e) {} resolve(val); };
      modal.querySelector('#_csCancel').onclick = () => fin(null);
      modal.querySelector('#_csOk').onclick = () => {
        const horas = Number(inpH.value);
        const actividad = (inpA.value || '').trim();
        if (!horas || horas <= 0) { this.toast('Ingresa las horas cumplidas', 'error'); inpH.focus(); return; }
        if (pend > 0 && horas > pend) { this.toast('No puede descontar más de ' + pend + 'h pendientes', 'error'); inpH.focus(); return; }
        if (!actividad) { this.toast('Escribe qué actividad realizó', 'error'); inpA.focus(); return; }
        fin({ horas: horas, actividad: actividad });
      };
    });
  },

  async cumplirSancion(btn, cedula, nombre, horasPendientes) {
    // v5.70 FIX + v5.71 IDEMPOTENCIA + v5.90 CONSTANCIA:
    //  (1) Descontar horas exige contraseña admin; se pide DENTRO de _conBloqueo
    //      (un doble-toque no abre dos modales ni descuenta dos veces).
    //  (2) idCliente = "recibo" único. Si la red falla tras descontar y reintentas
    //      el MISMO descuento, va el mismo recibo → el servidor NO resta de nuevo.
    //      Se genera recibo nuevo solo si cambian los datos o tras un éxito.
    //  (3) v5.90: se pide la actividad realizada ANTES de la contraseña (si el
    //      admin cancela el formulario, ni siquiera se le molesta con la clave).
    await this._conBloqueo(btn, 'Guardando...', async () => {
      const datos = await this._pedirCumplimientoSancion(nombre, horasPendientes);
      if (!datos) return; // canceló → no se hace nada
      const horas = datos.horas, actividad = datos.actividad;
      const _pwd = await this._obtenerPwdAdmin('🔐 Contraseña admin para descontar horas');
      if (!_pwd) return; // canceló → no se hace nada
      this._idCumplir = this._idCumplir || {};
      let reg = this._idCumplir[cedula];
      // El recibo se reusa SOLO si se reintenta exactamente lo mismo (horas Y
      // actividad). Si el admin corrige cualquiera de los dos, es otro registro.
      if (!reg || reg.horas !== horas || reg.actividad !== actividad) {
        reg = { id: 'cs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8), horas: horas, actividad: actividad };
        this._idCumplir[cedula] = reg;
      }
      try {
        const resp = await fetch(URL_BACKEND, {
          method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'cumplirSancion', cedula, horas, actividad,
            idCliente: reg.id, adminEmail: this.usuario.email, adminPassword: _pwd })
        });
        const data = await resp.json();
        if (!data.ok) throw new Error(data.error);
        delete this._idCumplir[cedula]; // éxito → el próximo descuento usa recibo nuevo
        this.toast('✅ ' + data.mensaje, 'exito');
        setTimeout(() => this.cargarPantallaDeudores(), 1000);
      } catch(e) { this.toast('Error: ' + e.message, 'error'); } // error → conserva el recibo para reintento seguro
    });
  },

  // ═══ v5.64 (BUG 1+2): pantalla dedicada "Ver Deudores" ═══
  // Antes vivía embebida (con edición) dentro de Asistencia. Ahora es su
  // propia pantalla con accordion: toca un nombre para ver EXACTAMENTE
  // qué domingos (fecha + tema) le generaron la deuda.
  abrirDeudores() {
    if (!this.esAdmin()) { this.toast('Solo administradores pueden ver esto', 'error'); return; }
    this.irA('pantallaDeudores');
  },

  async cargarPantallaDeudores() {
    const cont = document.getElementById('deudoresContenido');
    if (!cont) return;
    if (!this.esAdmin()) {
      cont.innerHTML = '<div style="text-align:center;padding:40px;"><div style="font-size:40px;">🔒</div><div style="color:#999;margin-top:10px;">Solo administradores pueden ver esto</div></div>';
      return;
    }
    cont.innerHTML = '<div style="text-align:center;padding:30px;color:#999;">Cargando...</div>';
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'listarSanciones', adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '' })
      });
      const data = await resp.json();
      if (!data.ok) { cont.innerHTML = '<div style="color:#c00;padding:20px;">Error: ' + app._esc(data.error||'desconocido') + '</div>'; return; }
      const sanc = (data.sanciones || []).filter(s => Number(s.horasPendientes) > 0);
      if (!sanc.length) {
        cont.innerHTML = '<div style="text-align:center;padding:30px;color:#1e8449;background:#fff;border-radius:12px;"><div style="font-size:40px;">✅</div><div style="margin-top:10px;font-weight:700;">Sin deudores pendientes</div></div>';
        return;
      }
      sanc.sort((a,b) => Number(b.horasPendientes) - Number(a.horasPendientes));
      // v5.91: la regla a la vista, para no tener que explicarla cada vez que
      // alguien pregunta por qué le subieron las horas si sí asistió.
      const reglaHTML = '<div style="background:#fff8e1;border:1px solid #ffe082;border-left:4px solid #f4c430;border-radius:10px;padding:11px 13px;margin-bottom:12px;font-size:12px;line-height:1.55;color:#5d4037;">'
        + '<strong>⚠️ Cómo crecen estas horas</strong><br>'
        + 'Cada domingo que pasa sin cumplirlas, la deuda se <strong>duplica</strong> (2h → 4h → 8h → 16h…), con tope de <strong>32h</strong>.<br>'
        + 'Asistir <strong>no</strong> detiene la duplicación, y la excusa <strong>tampoco</strong>: justifica no haber venido, no haber dejado de cumplir. Solo cumplir las horas la detiene.'
        + '</div>';
      const badge = (s) => {
        if (s.tipoAlerta === 'DESERCION' || s.tipoAlerta === 'RETIRO')
          return '<span style="background:#c00;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:6px;">🚨 DESERCIÓN</span>';
        if (s.tipoAlerta === 'LLAMADO_ESCRITO')
          return '<span style="background:#e65100;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:6px;">📄 ESCRITO</span>';
        if (s.tipoAlerta === 'LLAMADO_VERBAL')
          return '<span style="background:#ff9800;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;margin-left:6px;">🗣️ VERBAL</span>';
        return '';
      };
      cont.innerHTML = reglaHTML + sanc.map((s,i) => {
        const uid = 'deu_' + i;
        return '<div style="background:#fff;border-radius:12px;margin-bottom:10px;overflow:hidden;border-left:4px solid #c00;">'
          + '<div data-uid="'+uid+'" data-ced="'+app._esc(s.cedula||'')+'" data-nom="'+app._esc(s.nombre||'')+'" data-hp="'+app._esc(String(s.horasPendientes||''))+'" onclick="app._toggleDeudorAccordion(this.dataset.uid,this.dataset.ced,this.dataset.nom,this.dataset.hp)" style="padding:12px 14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;">'
          + '<div><strong>'+app._esc(s.nombre||'')+'</strong>'+badge(s)+'<div style="font-size:12px;color:#666;margin-top:2px;">CC: '+app._esc(s.cedula||'-')+'</div></div>'
          + '<div style="text-align:right;"><div style="color:#c00;font-weight:700;">'+s.horasPendientes+'h</div><div style="font-size:11px;color:#999;">▼ ver domingos</div></div>'
          + '</div>'
          + '<div id="'+uid+'_det" style="display:none;padding:0 14px 14px;border-top:1px solid #f5f5f5;"></div>'
          + '</div>';
      }).join('');
    } catch(e) { cont.innerHTML = '<div style="color:#c00;padding:20px;">Error: ' + e.message + '</div>'; }
  },

  // v5.90: recibe también nombre (nom) y horas pendientes (hp) para poder
  // mostrarlos en el modal de registro de cumplimiento sin volver a consultar.
  async _toggleDeudorAccordion(uid, cedula, nom, hp) {
    const det = document.getElementById(uid + '_det');
    if (!det) return;
    const abierto = det.style.display !== 'none';
    if (abierto) { det.style.display = 'none'; return; }
    det.style.display = 'block';
    if (det.dataset.cargado === '1') return;
    det.innerHTML = '<div style="padding:10px 0;color:#999;font-size:13px;">Cargando domingos...</div>';
    try {
      const resp = await fetch(URL_BACKEND, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion: 'obtenerFaltasDomingoPersona', cedula, adminEmail: this.usuario.email, adminPassword: this._adminPwdSession || '' })
      });
      const data = await resp.json();
      if (!data.ok) { det.innerHTML = '<div style="color:#c00;padding:10px 0;font-size:13px;">Error: '+app._esc(data.error)+'</div>'; return; }
      det.dataset.cargado = '1';
      const faltas = data.faltas || [];
      det.innerHTML = '<div style="padding-top:10px;">'
        + (faltas.length
          ? faltas.map(f => '<div style="padding:8px 0;border-bottom:1px solid #f5f5f5;font-size:13px;"><strong>📅 '+app._esc(f.fecha)+'</strong><div style="color:#666;margin-top:2px;">'+app._esc(f.tema)+'</div></div>').join('')
          : '<div style="padding:8px 0;color:#999;font-size:13px;">Sin domingos sin excusa registrados</div>')
        // v5.90: el input suelto de horas se reemplazó por un modal que además
        // pide la ACTIVIDAD REALIZADA. El botón pasa los datos por data-* en vez
        // de interpolar la cédula dentro del string del onclick (invariante I10:
        // una cédula con comilla o carácter raro rompía el handler entero).
        + '<div style="margin-top:12px;">'
        + '<button data-ced="'+app._esc(cedula||'')+'" data-nom="'+app._esc(nom||'')+'" data-hp="'+app._esc(String(hp||''))+'"'
        + ' onclick="app.cumplirSancion(this,this.dataset.ced,this.dataset.nom,this.dataset.hp)"'
        + ' style="background:#1e8449;color:#fff;border:none;border-radius:8px;padding:10px 14px;cursor:pointer;font-size:13px;font-weight:700;width:100%;">✅ Registrar horas cumplidas</button>'
        + '</div></div>';
    } catch(e) { det.innerHTML = '<div style="color:#c00;padding:10px 0;font-size:13px;">Error: '+app._esc(e.message)+'</div>'; }
  },

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
    cont.innerHTML = '<div style="text-align:center;padding:30px;color:#999;">Calculando ranking...</div>';
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
    const filtros = '<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:10px;">'
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
      const card0 = (n,lbl,col) => '<div style="background:#fff;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:28px;font-weight:700;color:'+col+';">'+n+'</div><div style="font-size:12px;color:#666;">'+lbl+'</div></div>';
      cont.innerHTML = filtros
        + '<div style="background:#6e2fa0;color:#fff;border-radius:12px;padding:16px;margin-bottom:10px;">'
        + '<div style="font-size:13px;opacity:.8;">Período</div>'
        + '<div style="font-size:18px;font-weight:700;">'+mesNom0+' '+this._operAnio+'</div>'
        + '<div style="font-size:12px;opacity:.7;margin-top:2px;">Cuerpo de Bomberos Voluntarios — Inírida</div></div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">'
        + card0(0,'Unidades con registros','#1a5276') + card0(0,'Emergencias únicas','#c0392b')
        + card0('0h','Horas en actividades','#1e8449') + card0(0,'Domingos realizados','#e67e22')
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
    const totalDomingos = (this._operStats && this._operStats.totalDomingos !== undefined) ? this._operStats.totalDomingos : d.reduce((s,p) => s + (p.domingosPresente||0), 0);
    const totalSancion = d.filter(p => p.horasSancion > 0).length;
    const top = [...d].sort((a,b) => {
      const pa = a.emergencias*2 + a.horasActividades + a.domingosPresente;
      const pb = b.emergencias*2 + b.horasActividades + b.domingosPresente;
      return pb - pa;
    });
    const mesNombre = this._operMes ? ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][parseInt(this._operMes)-1] : 'Todo el año';

    const topEmerg = [...d].sort((a,b)=>b.emergencias-a.emergencias).filter(p=>p.emergencias>0);
    const topActiv = [...d].sort((a,b)=>b.horasActividades-a.horasActividades).filter(p=>p.horasActividades>0);
    const topDomin = [...d].sort((a,b)=>b.domingosPresente-a.domingosPresente).filter(p=>p.domingosPresente>0);
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
      <div style="background:#6e2fa0;color:#fff;border-radius:12px;padding:16px;margin-bottom:10px;">
        <div style="font-size:13px;opacity:.8;">Período</div>
        <div style="font-size:18px;font-weight:700;">${mesNombre} ${this._operAnio}</div>
        <div style="font-size:12px;opacity:.7;margin-top:2px;">Cuerpo de Bomberos Voluntarios — Inírida</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div style="background:#fff;border-radius:10px;padding:14px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#1a5276;">${totalPersonas}</div>
          <div style="font-size:12px;color:#666;">Unidades con registros</div>
          ${this._operStats && this._operStats.unidadesBase !== undefined ? '<div style="font-size:11px;color:#999;margin-top:2px;">Base activa: '+this._operStats.unidadesBase+'</div>' : ''}
        </div>
        <div style="background:#fff;border-radius:10px;padding:14px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#c0392b;">${this._operStats ? this._operStats.totalEmergenciasUnicas : totalEmerg}</div>
          <div style="font-size:12px;color:#666;">Emergencias únicas</div>
        </div>
        <div style="background:#fff;border-radius:10px;padding:14px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#1e8449;">${this._r1((this._operStats && this._operStats.totalHorasActividades !== undefined) ? this._operStats.totalHorasActividades : totalHoras)}h</div>
          <div style="font-size:12px;color:#666;">Horas en actividades</div>
        </div>
        <div style="background:#fff;border-radius:10px;padding:14px;text-align:center;">
          <div style="font-size:28px;font-weight:700;color:#e67e22;">${totalDomingos}</div>
          <div style="font-size:12px;color:#666;">Domingos realizados</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:10px;">
        <div style="background:#fff;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:22px;font-weight:700;color:#8e44ad;">${this._operStats && this._operStats.asistenciasTotales !== undefined ? this._operStats.asistenciasTotales : d.reduce((s,p)=>s+(p.domingosPresente||0),0)}</div>
          <div style="font-size:12px;color:#666;">Asistencias totales (suma individual)</div>
        </div>
      </div>

      ${this._operStats && this._operStats.sinCruce > 0 ? '<div style="background:#fff8e1;border-radius:10px;padding:12px;margin-bottom:10px;border-left:4px solid #f9a825;"><div style="font-weight:700;color:#8d6e00;font-size:13px;">⚠️ '+this._operStats.sinCruce+' registro(s) no cruzan con la base de personal</div><div style="font-size:12px;color:#8d6e00;margin-top:2px;">Son nombres o cédulas escritos distinto en los registros (por eso hay más tarjetas que unidades reales). Búscalos en "Por Unidad": están marcados en ámbar — corrige la escritura en la hoja para que se fusionen.</div></div>' : ''}

      ${totalSancion > 0 ? '<div style="background:#ffebee;border-radius:10px;padding:12px;margin-bottom:10px;border-left:4px solid #c00;"><div style="font-weight:700;color:#c00;">⚠️ '+totalSancion+' unidad(es) con sanciones pendientes</div></div>' : ''}

      <div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;">
        <div style="font-weight:700;color:#c0392b;margin-bottom:8px;">🚨 Ranking Emergencias</div>
        ${rankList(topEmerg,'rk_emerg',p=>p.emergencias,'emerg.','#c0392b')}
      </div>
      <div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;">
        <div style="font-weight:700;color:#1e8449;margin-bottom:8px;">🎯 Ranking Actividades</div>
        ${rankList(topActiv,'rk_activ',p=>this._r1(p.horasActividades)+'h','activ.','#1e8449')}
      </div>
      <div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;">
        <div style="font-weight:700;color:#e67e22;margin-bottom:8px;">📅 Ranking Asistencia Domingos</div>
        ${rankList(topDomin,'rk_domin',p=>p.domingosPresente,'dom.','#e67e22')}
      </div>
      <button onclick="app._imprimirReporteGeneral()" style="background:#6e2fa0;color:#fff;border:none;border-radius:12px;padding:14px;cursor:pointer;width:100%;font-weight:700;margin-bottom:8px;">🖨️ Imprimir Informe General</button>`;
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
    const pts = this._r1(p.emergencias*2 + p.horasActividades + p.domingosPresente);
    const pctDom = p.domingosPresente + p.domingosAusente > 0
      ? Math.round(p.domingosPresente/(p.domingosPresente+p.domingosAusente)*100) : 0;
    const colorAlerta = (p.tipoAlerta==='RETIRO'||p.tipoAlerta==='DESERCION')?'#c00':p.tipoAlerta==='LLAMADO_ESCRITO'?'#e65100':p.tipoAlerta==='LLAMADO_VERBAL'?'#ff9800':null;
    const nom = String(p.nombre||'');
    const uid = 'u_'+nom.replace(/[^a-zA-Z]/g,'').substring(0,12);
    return '<div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:10px;border-left:4px solid #6e2fa0;">'
      +'<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">'
      +'<div><div style="font-weight:700;font-size:15px;">'+app._esc(nom||'(sin nombre)')+'</div>'
      +'<div style="font-size:12px;color:#666;">CC: '+app._esc(p.cedula||'-')+'</div>'
      +(p.enBase===false?'<div style="font-size:11px;background:#fff8e1;color:#8d6e00;border:1px solid #f9a825;border-radius:6px;padding:2px 6px;margin-top:3px;display:inline-block;">⚠️ No cruza con la base (revisar escritura)</div>':'')
      +'</div>'
      +'<div style="text-align:right;"><div style="font-weight:700;color:#6e2fa0;font-size:16px;">'+pts+' pts</div>'
      +(colorAlerta?'<div style="font-size:11px;background:'+colorAlerta+';color:#fff;padding:2px 6px;border-radius:4px;margin-top:2px;">'+(p.tipoAlerta||'').replace('_',' ')+'</div>':'')
      +'</div></div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;">'
      +'<div style="background:#fff5f5;border-radius:8px;padding:8px;text-align:center;cursor:pointer;" data-tipo="emerg" data-uid="'+uid+'" data-nom="'+encodeURIComponent(nom)+'" data-ced="'+encodeURIComponent(String(p.cedula||''))+'" onclick="app._expandirDetalle(this.dataset.tipo,this.dataset.uid,decodeURIComponent(this.dataset.nom),decodeURIComponent(this.dataset.ced))">'
      +'<div style="font-size:18px;font-weight:700;color:#c0392b;">'+p.emergencias+'</div>'
      +'<div style="font-size:10px;color:#c0392b;text-decoration:underline;">Ver emerg.</div></div>'
      +'<div style="background:#f0f8f4;border-radius:8px;padding:8px;text-align:center;cursor:pointer;" data-tipo="activ" data-uid="'+uid+'" data-nom="'+encodeURIComponent(nom)+'" data-ced="'+encodeURIComponent(String(p.cedula||''))+'" onclick="app._expandirDetalle(this.dataset.tipo,this.dataset.uid,decodeURIComponent(this.dataset.nom),decodeURIComponent(this.dataset.ced))">'
      +'<div style="font-size:18px;font-weight:700;color:#1e8449;">'+this._r1(p.horasActividades)+'h</div>'
      +'<div style="font-size:10px;color:#1e8449;text-decoration:underline;">Ver activ.</div></div>'
      +'<div style="background:#fef9f0;border-radius:8px;padding:8px;text-align:center;cursor:pointer;" data-tipo="domin" data-uid="'+uid+'" data-nom="'+encodeURIComponent(nom)+'" data-ced="'+encodeURIComponent(String(p.cedula||''))+'" onclick="app._expandirDetalle(this.dataset.tipo,this.dataset.uid,decodeURIComponent(this.dataset.nom),decodeURIComponent(this.dataset.ced))">'
      +'<div style="font-size:18px;font-weight:700;color:#e67e22;">'+p.domingosPresente+'</div>'
      +'<div style="font-size:10px;color:#e67e22;text-decoration:underline;">Ver dom.</div></div>'
      +'</div>'
      +'<div id="'+uid+'_det" style="display:none;margin-bottom:8px;"></div>'
      +'<div style="display:flex;justify-content:space-between;font-size:12px;color:#666;">'
      +'<span>Asistencia domingos: <strong>'+pctDom+'%</strong></span>'
      +(p.horasSancion>0?'<span style="color:#c00;font-weight:700;">⚠️ '+p.horasSancion+'h sanción</span>':'<span style="color:#1e8449;">✅ Sin sanciones</span>')
      +'</div></div>';
  },

  async _expandirDetalle(tipo, uid, nombre, cedula) {
    const cont = document.getElementById(uid+'_det');
    if (!cont) return;
    if (cont.style.display!=='none' && cont.dataset.tipo===tipo) { cont.style.display='none'; return; }
    cont.style.display='block'; cont.dataset.tipo=tipo;
    cont.innerHTML='<div style="font-size:12px;color:#999;padding:6px;">Cargando...</div>';
    const accion = tipo==='emerg'?'obtenerEmergenciasPersona':tipo==='activ'?'obtenerActividadesPersona':'obtenerDomingosPersona';
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
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:320px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
        + '<div style="font-size:15px;font-weight:700;color:#333;margin-bottom:12px;text-align:center;">'+(mensaje||'🔐 Contraseña de administrador')+'</div>'
        + '<input id="_pwdAdmInput" type="password" autocomplete="current-password" style="width:100%;box-sizing:border-box;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:16px;margin-bottom:14px;" placeholder="Contraseña">'
        + '<div style="display:flex;gap:10px;">'
        + '<button id="_pwdAdmCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Cancelar</button>'
        + '<button id="_pwdAdmOk" style="flex:1;padding:12px;background:var(--rojo);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Entrar</button>'
        + '</div></div>';
      document.body.appendChild(modal);
      const inp = modal.querySelector('#_pwdAdmInput');
      setTimeout(() => { try { inp.focus(); } catch(e){} }, 50);
      const fin = (val) => { try { document.body.removeChild(modal); } catch(e){} resolve(val); };
      modal.querySelector('#_pwdAdmCancel').onclick = () => fin(null);
      modal.querySelector('#_pwdAdmOk').onclick = () => fin(inp.value || '');
      inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') fin(inp.value || ''); });
    });
  },

  // v5.63: obtiene la contraseña admin de la sesión o la pide con modal (APK-safe)
  async _obtenerPwdAdmin(mensaje) {
    if (this._adminPwdSession) return this._adminPwdSession;
    try { const s = sessionStorage.getItem('cbvi_admin_pwd'); if (s) { this._adminPwdSession = s; return s; } } catch(e) {}
    const pwd = await this._pedirPwdAdmin(mensaje);
    if (!pwd || !pwd.trim()) return null;
    this._adminPwdSession = pwd.trim();
    try { sessionStorage.setItem('cbvi_admin_pwd', this._adminPwdSession); } catch(e) {}
    return this._adminPwdSession;
  },

  _confirmarAccion(mensaje, onConfirmar) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;max-width:320px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.3);">'
      + '<div style="font-size:15px;font-weight:700;color:#333;margin-bottom:16px;text-align:center;">'+mensaje+'</div>'
      + '<div style="display:flex;gap:10px;">'
      + '<button id="_modCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Cancelar</button>'
      + '<button id="_modConfirm" style="flex:1;padding:12px;background:#c0392b;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">Eliminar</button>'
      + '</div></div>';
    document.body.appendChild(modal);
    document.getElementById('_modCancel').onclick = () => document.body.removeChild(modal);
    document.getElementById('_modConfirm').onclick = () => { document.body.removeChild(modal); onConfirmar(); };
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

  async eliminarDomingo(fecha) {
    this._confirmarAccion('\u00BFEliminar asistencia del '+fecha+'?', async () => {
      if (!this._eliminandoFechas) this._eliminandoFechas = new Set();
      if (this._eliminandoFechas.has(fecha)) return; // v5.64 (BUG 2): anti doble-click
      this._eliminandoFechas.add(fecha);
      try {
        const _pwd = await this._obtenerPwdAdmin('🔐 Contraseña de administrador');
        if (!_pwd) return;
        this.toast('Eliminando...','info');
        const r=await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
          body:JSON.stringify({accion:'eliminarDomingo',fecha,adminEmail:this.usuario.email,adminPassword:this._adminPwdSession})});
        const d=await r.json();
        if(!d.ok)throw new Error(d.error);
        this.toast('\u2705 Domingo eliminado','exito');
        setTimeout(()=>this.cargarPantallaAsistencia(),800);
      }catch(e){this.toast('Error: '+e.message,'error');}
      finally { this._eliminandoFechas.delete(fecha); }
    });
  },

  _imprimirReporteGeneral() {
    const d = this._operData;
    const mesNombre = this._operMes ? ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][parseInt(this._operMes)-1] : 'Todo el año';
    const top = [...d].sort((a,b)=>(b.emergencias*2+b.horasActividades+b.domingosPresente)-(a.emergencias*2+a.horasActividades+a.domingosPresente));
    const w = window.open('','_blank','noopener');
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
      <p style="color:#666;margin:0 0 12px;">Período: <strong>${mesNombre} ${this._operAnio}</strong> | Cuerpo de Bomberos Voluntarios de Inírida</p>
      <div class="stats">
        <div class="stat"><div class="num">${d.length}</div><div class="lbl">Unidades con registros</div></div>
        <div class="stat"><div class="num">${this._operStats ? this._operStats.totalEmergenciasUnicas : d.reduce((s,p)=>s+p.emergencias,0)}</div><div class="lbl">Emergencias únicas</div></div>
        <div class="stat"><div class="num">${this._r1(this._operStats && this._operStats.totalHorasActividades !== undefined ? this._operStats.totalHorasActividades : d.reduce((s,p)=>s+p.horasActividades,0))}h</div><div class="lbl">Horas en actividades</div></div>
        <div class="stat"><div class="num">${this._operStats && this._operStats.totalDomingos !== undefined ? this._operStats.totalDomingos : '-'}</div><div class="lbl">Domingos realizados</div></div>
        <div class="stat"><div class="num">${this._operStats && this._operStats.asistenciasTotales !== undefined ? this._operStats.asistenciasTotales : d.reduce((s,p)=>s+p.domingosPresente,0)}</div><div class="lbl">Asistencias totales</div></div>
      </div>
      <h2>🏆 Ranking General</h2>
      <table><tr><th>#</th><th>Nombre</th><th>Emergencias</th><th>Horas Act.</th><th>Domingos</th><th>Puntos</th><th>Sanciones</th></tr>
      ${top.map((p,i)=>{
        const pts=this._r1(p.emergencias*2+p.horasActividades+p.domingosPresente);
        return `<tr><td>${i+1}</td><td><strong>${app._esc(p.nombre)}</strong></td><td style="text-align:center;">${p.emergencias}</td><td style="text-align:center;">${this._r1(p.horasActividades)}h</td><td style="text-align:center;">${p.domingosPresente}</td><td style="text-align:center;font-weight:700;color:#6e2fa0;">${pts}</td><td style="text-align:center;">${p.horasSancion>0?`<span class="alerta">${p.horasSancion}h</span>`:'-'}</td></tr>`;
      }).join('')}
      </table>
      <footer>CBVI — ABNEGACIÓN Y DISCIPLINA | Generado: ${new Date().toLocaleDateString('es-CO')}</footer>
      </body></html>`);
    w.document.close();
    setTimeout(()=>w.print(),800);
  },

  _imprimirReportePorUnidad() {
    const d = [...this._operData].sort((a,b)=>String(a.nombre||'').localeCompare(String(b.nombre||'')));
    const mesNombre = this._operMes ? ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][parseInt(this._operMes)-1] : 'Todo el año';
    const w = window.open('','_blank','noopener');
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
      <p style="color:#666;">Período: <strong>${mesNombre} ${this._operAnio}</strong> | CBVI — Inírida</p>
      ${d.map(p=>{
        const pts=this._r1(p.emergencias*2+p.horasActividades+p.domingosPresente);
        const pct=p.domingosPresente+p.domingosAusente>0?Math.round(p.domingosPresente/(p.domingosPresente+p.domingosAusente)*100):0;
        const colorAlerta=(p.tipoAlerta==='RETIRO'||p.tipoAlerta==='DESERCION')?'#c00':p.tipoAlerta==='LLAMADO_ESCRITO'?'#e65100':p.tipoAlerta==='LLAMADO_VERBAL'?'#e67e22':null;
        return `<div class="ficha">
          <div class="ficha-header">
            <div><div class="nombre">${app._esc(p.nombre)}</div><div style="font-size:10pt;color:#666;">CC: ${app._esc(p.cedula||'-')} ${p.rango?'| '+app._esc(p.rango):''}</div></div>
            <div style="text-align:right;"><div class="pts">${pts} pts</div>${colorAlerta?`<div class="alerta" style="background:${colorAlerta};color:#fff;">${(p.tipoAlerta||'').replace('_',' ')}</div>`:''}</div>
          </div>
          <div class="grid">
            <div class="item"><div class="num" style="color:#c0392b;">${p.emergencias}</div><div class="lbl">Emergencias</div></div>
            <div class="item"><div class="num" style="color:#1e8449;">${this._r1(p.horasActividades)}h</div><div class="lbl">En actividades</div></div>
            <div class="item"><div class="num" style="color:#e67e22;">${p.domingosPresente}</div><div class="lbl">Domingos pres.</div></div>
          </div>
          <div style="font-size:10pt;color:#555;">
            Asistencia domingos: <strong>${pct}%</strong> (${p.domingosPresente} de ${p.domingosPresente+p.domingosAusente}) |
            Ausencias sin excusa: <strong>${p.domingosAusente}</strong> |
            Sanciones: <strong style="color:${p.horasSancion>0?'#c00':'#1e8449'}">${p.horasSancion>0?p.horasSancion+'h pendientes':'Sin sanciones'}</strong>
          </div>
        </div>`;
      }).join('')}
      <footer>CBVI — ABNEGACIÓN Y DISCIPLINA | Generado: ${new Date().toLocaleDateString('es-CO')}</footer>
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
    const html = '<div style="position:relative;width:30px;height:40px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35));">' + svg
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
      // v5.87: antes era texto muerto — en Inírida la señal va y viene, así
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

      // v5.82: filtros por año/mes (poblados con las fechas reales) + contador
      const filtros = document.getElementById('mapaFiltros');
      if (filtros) {
        const anios = new Set();
        reportes.forEach(r => { const a = String(r.fecha||'').substring(0,4); if (/^\d{4}$/.test(a)) anios.add(a); });
        const MESES = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        const estiloSel = 'padding:6px 8px;border:1px solid #ddd;border-radius:8px;font-size:12px;background:#fff;';
        filtros.innerHTML =
          '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">'
          + '<select id="mapaFiltroAnio" onchange="app._aplicarFiltroMapa()" style="'+estiloSel+'">'
          +   '<option value="">📅 Todos los años</option>'
          +   Array.from(anios).sort().reverse().map(a => '<option value="'+a+'">'+a+'</option>').join('')
          + '</select>'
          + '<select id="mapaFiltroMes" onchange="app._aplicarFiltroMapa()" style="'+estiloSel+'">'
          +   '<option value="">Todos los meses</option>'
          +   MESES.map((mn,i) => i ? '<option value="'+String(i).padStart(2,'0')+'">'+mn+'</option>' : '').join('')
          + '</select>'
          + '<button onclick="app._centrarMapaTodos()" style="padding:6px 10px;border:none;border-radius:8px;background:#1a7a5e;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">🎯 Ver todas</button>'
          + '<button id="mapaBtnFullscreen" onclick="app._toggleMapaFullscreen()" style="padding:6px 10px;border:none;border-radius:8px;background:#1a5276;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">⛶ Pantalla completa</button>'
          + '<span id="mapaContador" style="font-size:12px;color:#555;font-weight:700;"></span>'
          + '</div>';
      }

      if (this._leafletMapa) { this._leafletMapa.remove(); this._leafletMapa = null; }
      this._leafletMapa = L.map(cont).setView([reportes[0].lat, reportes[0].lng], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap'
      }).addTo(this._leafletMapa);

      // v5.82: cada marcador queda registrado con su etiqueta y fecha para
      // poder filtrar sin volver a pedir nada al servidor.
      this._mapaMarkers = [];
      this._mapaEtiquetasOff = new Set();
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
          + '<div><b>Clasificación:</b> ' + app._esc(clas) + '</div>'
          + '<button data-id="' + String(r.id||'').replace(/"/g,'&quot;') + '" onclick="app._verReporteDesdeMapa(this.dataset.id)" style="margin-top:8px;background:#6e2fa0;color:#fff;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:12px;width:100%;">Ver reporte completo</button>'
          + '</div>';
        const marker = L.marker([r.lat, r.lng], { icon: this._iconoMapa(regla) }).bindPopup(popupHtml);
        marker.addTo(this._leafletMapa);
        this._mapaMarkers.push({ marker: marker, etiqueta: regla.etiqueta, anio: f.substring(0,4), mes: f.substring(5,7) });
      });
      this._pintarLeyendaMapa();
      this._aplicarFiltroMapa(true);
    } catch(e) {
      estado.style.display = 'block'; cont.style.display = 'none';
      // v5.87: error con reintento (red intermitente en Inírida) — e.message
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
    leyenda.innerHTML = '<div style="font-size:11px;color:#666;margin:2px 0 4px;">👆 Toca un tipo para ocultar/mostrar sus pines:</div>'
      + reglas.map(r => {
        const off = this._mapaEtiquetasOff.has(r.etiqueta);
        return '<span data-e="' + r.etiqueta.replace(/"/g,'&quot;') + '" onclick="app._toggleFiltroMapa(this.dataset.e)" '
          + 'style="display:inline-flex;align-items:center;gap:4px;background:' + (off ? '#f0f0f0' : '#fff') + ';border-radius:12px;padding:3px 9px;margin:2px;font-size:11px;border:1.5px solid ' + (off ? '#ddd' : r.color) + ';cursor:pointer;' + (off ? 'opacity:.5;text-decoration:line-through;' : '') + '">'
          + '<span style="width:10px;height:10px;border-radius:50%;background:' + r.color + ';display:inline-block;"></span>'
          + r.emoji + ' ' + r.etiqueta + ' (' + (conteo[r.etiqueta] || 0) + ')</span>';
      }).join('');
  },

  _toggleFiltroMapa(etiqueta) {
    if (!this._mapaEtiquetasOff) this._mapaEtiquetasOff = new Set();
    if (this._mapaEtiquetasOff.has(etiqueta)) this._mapaEtiquetasOff.delete(etiqueta);
    else this._mapaEtiquetasOff.add(etiqueta);
    this._pintarLeyendaMapa();
    this._aplicarFiltroMapa();
  },

  // v5.82: aplica leyenda + año + mes sobre los marcadores ya creados.
  // ajustarVista=true solo en la carga inicial (no le mueve el zoom al admin
  // cada vez que cambia un filtro).
  _aplicarFiltroMapa(ajustarVista) {
    if (!this._leafletMapa || !this._mapaMarkers) return;
    const selA = document.getElementById('mapaFiltroAnio');
    const selM = document.getElementById('mapaFiltroMes');
    const anio = selA ? selA.value : '';
    const mes = selM ? selM.value : '';
    const bounds = []; let visibles = 0;
    this._mapaMarkers.forEach(m => {
      const pasa = !this._mapaEtiquetasOff.has(m.etiqueta)
        && (!anio || m.anio === anio)
        && (!mes || m.mes === mes);
      if (pasa) {
        if (!this._leafletMapa.hasLayer(m.marker)) m.marker.addTo(this._leafletMapa);
        const ll = m.marker.getLatLng(); bounds.push([ll.lat, ll.lng]); visibles++;
      } else if (this._leafletMapa.hasLayer(m.marker)) {
        this._leafletMapa.removeLayer(m.marker);
      }
    });
    this._mapaBoundsVisibles = bounds;
    const contador = document.getElementById('mapaContador');
    if (contador) contador.textContent = '📍 ' + visibles + ' de ' + this._mapaMarkers.length;
    if (ajustarVista === true && bounds.length > 1) this._leafletMapa.fitBounds(bounds, { padding: [30, 30] });
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
    if (!q || q.trim().length < 1) { if(sug) sug.style.display='none'; return; }
    clearTimeout(this['_t_'+sugId]);
    this['_t_'+sugId] = setTimeout(async () => {
      try {
        const resp = await fetch(URL_BACKEND, { method:'POST',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify({ accion:'buscarPersonalCBVI', q:q.trim() }) });
        const data = await resp.json();
        if (!data.ok || !data.resultados.length) { sug.style.display='none'; return; }
        sug.innerHTML = data.resultados.map(per =>
          '<div data-n="'+app._esc(per.nombre||'')+'" data-inp="'+inputId+'" data-sug="'+sugId+'" '
          +'onclick="document.getElementById(this.dataset.inp).value=this.dataset.n;'
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
      this._eaFotosNuevas = { inicio:null, medio:null, fin:null };  // null = no cambiada
      this._eaFotosActuales = { inicio:a.fotoInicio||'', medio:a.fotoMedio||'', fin:a.fotoFin||'' };
      const tipos = ['Acompañamiento','Capacitación','Entrenamiento','Simulacro','Inspección','Jornada comunitaria','Bomberitos Junior','Arreglos / Reparaciones (institución)','Mantenimiento','Otra'];
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
        +'<label style="font-size:12px;font-weight:700;">Novedades</label>'
        +'<textarea id="_eaN" rows="2" style="width:100%;padding:9px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:14px;box-sizing:border-box;">'+(a.novedades||"")+'</textarea>'
        // ── PERSONAL ──
        +'<div style="border-top:1px solid #eee;padding-top:10px;margin-bottom:6px;font-weight:700;font-size:13px;color:#1a5276;">👥 Personal asistente</div>'
        +'<div id="_eaPersonalLista" style="margin-bottom:6px;"></div>'
        +'<div style="position:relative;margin-bottom:14px;">'
        +'<input type="text" id="_eaBuscarPersonal" placeholder="Escribir nombre para agregar..." autocomplete="off" oninput="app._eaBuscarPersonal(this.value)" style="width:100%;padding:9px;border:1px solid #1e8449;border-radius:8px;font-size:14px;box-sizing:border-box;">'
        +'<div id="_eaSugerencias" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:8px;z-index:100;box-shadow:0 4px 12px rgba(0,0,0,.15);max-height:180px;overflow-y:auto;"></div>'
        +'</div>'
        // ── FOTOS ──
        +'<div style="border-top:1px solid #eee;padding-top:10px;margin-bottom:6px;font-weight:700;font-size:13px;color:#1a5276;">📸 Fotos</div>'
        +'<div style="display:flex;gap:8px;margin-bottom:14px;justify-content:space-around;">'
        + fotoSlot('inicio','Inicio',a.fotoInicio||'')
        + fotoSlot('medio','Intermedio',a.fotoMedio||'')
        + fotoSlot('fin','Final',a.fotoFin||'')
        +'</div>'
        // ── RECURSOS ──
        +'<div style="border-top:1px solid #eee;padding-top:10px;margin-bottom:6px;font-weight:700;font-size:13px;color:#1a5276;">🚒 Recursos / Vehículos</div>'
        +'<div id="_eaRecursosLista" style="margin-bottom:6px;"></div>'
        +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">'
        +'<input type="text" id="_eaRecTipo" placeholder="Tipo de vehículo" style="padding:8px;border:1px solid #ddd;border-radius:8px;font-size:13px;box-sizing:border-box;">'
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

      modal.querySelector('#_eaCancel').onclick = () => { document.body.removeChild(modal); this._eaLimpiar(); };
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
            personal:this._eaPersonal,
            recursos:this._eaRecursos,
            adminEmail:this.usuario.email, adminPassword:this._adminPwdSession };
          // solo enviar las fotos que cambiaron
          if (this._eaFotosNuevas.inicio) payload.fotoInicioNueva = this._eaFotosNuevas.inicio;
          if (this._eaFotosNuevas.medio)  payload.fotoMedioNueva  = this._eaFotosNuevas.medio;
          if (this._eaFotosNuevas.fin)    payload.fotoFinNueva    = this._eaFotosNuevas.fin;
          const r=await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
          const d=await r.json();
          if(!d.ok)throw new Error(d.error);
          document.body.removeChild(modal);
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
        const resp = await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({accion:'buscarPersonalCBVI',q:q.trim()})});
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
    const tipo = (document.getElementById('_eaRecTipo').value||'').trim();
    const codigo = (document.getElementById('_eaRecCodigo').value||'').trim();
    const resp = (document.getElementById('_eaRecResp').value||'').trim();
    if (!tipo) { this.toast('Escribe el tipo de vehículo','error'); return; }
    this._eaRecursos.push({ tipo, codigo, responsable:resp, responsableCedula:'' });
    document.getElementById('_eaRecTipo').value='';
    document.getElementById('_eaRecCodigo').value='';
    document.getElementById('_eaRecResp').value='';
    this._eaRenderRecursos();
  },

  _eaQuitarRecurso(i) { this._eaRecursos.splice(i,1); this._eaRenderRecursos(); },

  // ── Editar domingo (admin) ────────────────────────────────────────────────
  async editarDomingo(fecha) {
    this.toast('Cargando...','info');
    try {
      const resp=await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:JSON.stringify({accion:'listarAsistenciaDomingo',fecha})});
      const data=await resp.json();
      if(!data.ok)throw new Error(data.error||'Error');
      const regs=data.registros; if(!regs.length){this.toast('Sin registros','error');return;}
      const enc=regs[0].encargado||''; const grd=regs[0].comandanteGuardia||'';
      const tipoActual=regs[0].tipoReunion||''; const temaActual=regs[0].tema||''; const lugarActual=regs[0].lugarReunion||'';
      const sts={'PRESENTE':'Presente','AUSENTE_EXCUSA':'C/excusa','AUSENTE_SIN_EXCUSA':'Sin excusa'};
      const tiposReunion=['Capacitación','Entrenamiento','Reunión ordinaria','Simulacro','Jornada comunitaria','Otra'];
      const esc=(s)=>app._esc(s);

      // v5.65 (BUG: fotos de domingo no editables): mismo patrón que Actividades
      this._ednFotosNuevas = { inicio:null, medio:null, fin:null };
      const fl = data.fotosLabeled || {};
      const fotoSlot = (k, lbl, src) =>
        '<div style="text-align:center;">'
        + '<div style="font-size:10px;color:#666;">'+lbl+'</div>'
        + '<div id="_ednFotoPrev'+k+'" style="width:80px;height:80px;border-radius:8px;border:1px solid #ddd;background:#f5f5f5 center/cover no-repeat;display:flex;align-items:center;justify-content:center;overflow:hidden;">'
        + (src ? '<img src="'+src+'" style="width:100%;height:100%;object-fit:cover;">' : '<span style="font-size:20px;">📷</span>')
        + '</div>'
        + '<label style="display:block;margin-top:4px;font-size:11px;color:#1e8449;cursor:pointer;text-decoration:underline;">Cambiar'
        +   '<input type="file" accept="image/*" style="display:none;" onchange="app._ednCargarFoto(\''+k+'\',this)"></label>'
        + '</div>';

      const modal=document.createElement('div');
      modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;overflow-y:auto;padding:16px;';
      const filas=regs.map((r,i)=>'<div style="padding:7px 0;border-bottom:1px solid #f0f0f0;">'
        +'<div style="display:flex;align-items:center;justify-content:space-between;">'
        +'<div style="flex:1;font-size:13px;font-weight:600;">'+app._esc(r.nombre||'')+'<div style="font-size:11px;color:#999;">CC: '+app._esc(r.cedula||'-')+'</div></div>'
        +'<select id="_edn_'+i+'" style="padding:5px;border:1px solid #ddd;border-radius:6px;font-size:12px;">'
        +Object.entries(sts).map(([v,l])=>'<option value="'+v+'"'+(r.estado===v?' selected':'')+'>'+l+'</option>').join('')
        +'</select></div>'
        +'<input type="text" id="_edno_'+i+'" value="'+esc(r.observacion)+'" placeholder="Observación (opcional)" style="width:100%;margin-top:5px;padding:6px 8px;border:1px solid #eee;border-radius:6px;font-size:12px;box-sizing:border-box;">'
        +'</div>').join('');
      modal.innerHTML='<div style="background:#fff;border-radius:16px;padding:20px;max-width:420px;margin:auto;">'
        +'<div style="font-weight:700;font-size:16px;color:#1e8449;margin-bottom:14px;">✏️ Domingo '+fecha+'</div>'
        +'<label style="font-size:12px;font-weight:700;">Tipo de reunión</label>'
        +'<select id="_ednTipo" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;font-size:13px;margin-bottom:10px;box-sizing:border-box;">'
        +'<option value="">Seleccionar...</option>'
        +tiposReunion.map(t=>'<option value="'+t+'"'+(tipoActual===t?' selected':'')+'>'+t+'</option>').join('')
        +'</select>'
        +'<label style="font-size:12px;font-weight:700;">Tema tratado</label>'
        +'<input type="text" id="_ednTema" value="'+esc(temaActual)+'" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;font-size:13px;margin-bottom:10px;box-sizing:border-box;">'
        +'<label style="font-size:12px;font-weight:700;">Lugar</label>'
        +'<input type="text" id="_ednLugar" value="'+esc(lugarActual)+'" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;font-size:13px;margin-bottom:10px;box-sizing:border-box;">'
        +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">'
        +'<div><label style="font-size:12px;font-weight:700;">👤 Encargado</label><div style="position:relative;">'
        +'<input type="text" id="_ednE" value="'+esc(enc)+'" autocomplete="off" oninput="app._buscarAsistCampo(\'_ednE\',\'_ednESug\',this.value)" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;font-size:13px;box-sizing:border-box;">'
        +'<div id="_ednESug" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:8px;z-index:100;box-shadow:0 4px 8px rgba(0,0,0,.1);max-height:150px;overflow-y:auto;"></div>'
        +'</div></div>'
        +'<div><label style="font-size:12px;font-weight:700;">🛡️ Guardia</label><div style="position:relative;">'
        +'<input type="text" id="_ednG" value="'+esc(grd)+'" autocomplete="off" oninput="app._buscarAsistCampo(\'_ednG\',\'_ednGSug\',this.value)" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;font-size:13px;box-sizing:border-box;">'
        +'<div id="_ednGSug" style="display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:8px;z-index:100;box-shadow:0 4px 8px rgba(0,0,0,.1);max-height:150px;overflow-y:auto;"></div>'
        +'</div></div>'
        +'</div>'
        +'<div style="border-top:1px solid #eee;padding-top:10px;margin-bottom:6px;font-weight:700;font-size:13px;color:#1e8449;">📸 Fotos de la reunión</div>'
        +'<div style="display:flex;gap:8px;margin-bottom:14px;justify-content:space-around;">'
        + fotoSlot('inicio','Inicio',fl.inicio||'')
        + fotoSlot('medio','Intermedio',fl.medio||'')
        + fotoSlot('fin','Final',fl.fin||'')
        +'</div>'
        +'<div style="font-size:12px;font-weight:700;margin-bottom:8px;color:#555;">Estado individual:</div>'
        +filas
        +'<div style="display:flex;gap:10px;margin-top:14px;">'
        +'<button id="_ednCancel" style="flex:1;padding:12px;background:#f5f5f5;color:#333;border:none;border-radius:8px;font-weight:700;cursor:pointer;">Cancelar</button>'
        +'<button id="_ednGuard" style="flex:1;padding:12px;background:#1e8449;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;">💾 Guardar</button>'
        +'</div></div>';
      document.body.appendChild(modal);
      modal.querySelector('#_ednCancel').onclick=()=>document.body.removeChild(modal);
      modal.querySelector('#_ednGuard').onclick=async()=>{
        await this._conBloqueo(modal.querySelector('#_ednGuard'), 'Guardando...', async () => {
        const _pwdDN = await this._obtenerPwdAdmin('🔐 Contraseña admin');
        if(!_pwdDN) return;
        const newRegs=regs.map((r,i)=>{
          const sel=document.getElementById('_edn_'+i);
          const obs=document.getElementById('_edno_'+i);
          return {...r,estado:sel?sel.value:r.estado,observacion:obs?obs.value:r.observacion};
        });
        const fotosPayload={};
        ['inicio','medio','fin'].forEach(k=>{ if(this._ednFotosNuevas[k]) fotosPayload[k]=this._ednFotosNuevas[k]; });
        try{
          const r2=await fetch(URL_BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
            body:JSON.stringify({accion:'registrarAsistencia',fecha,registros:newRegs,replaceAll:true,
              tipoReunion:document.getElementById('_ednTipo').value,
              tema:document.getElementById('_ednTema').value,
              lugarReunion:document.getElementById('_ednLugar').value,
              encargado:document.getElementById('_ednE').value,
              comandanteGuardia:document.getElementById('_ednG').value,
              fotos: fotosPayload,
              adminEmail:this.usuario.email,adminPassword:this._adminPwdSession})});
          const d2=await r2.json();
          if(!d2.ok)throw new Error(d2.error);
          document.body.removeChild(modal);
          this.toast('✅ Domingo actualizado','exito');
          setTimeout(()=>this.cargarPantallaAsistencia(),800);
        }catch(e){this.toast('Error: '+e.message,'error');}
        });
      };
    }catch(e){this.toast('Error: '+e.message,'error');}
  },

  async _ednCargarFoto(tipo, input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const prev = document.getElementById('_ednFotoPrev'+tipo);
    if (prev) prev.innerHTML = '<span style="font-size:11px;color:#999;">...</span>';
    try {
      const dataUrl = await this.comprimirImagen(file, 1280, 0.7);
      this._ednFotosNuevas[tipo] = dataUrl;
      if (prev) prev.innerHTML = '<img src="'+dataUrl+'" style="width:100%;height:100%;object-fit:cover;">';
    } catch(e) {
      if (prev) prev.innerHTML = '<span style="font-size:11px;color:#c00;">Error</span>';
    }
  },
  // ── Asistencia solo admin ─────────────────────────────────────────────────
  abrirAsistencia() {
    if (!this.esAdmin()) {
      this.toast('Solo los administradores pueden registrar asistencia','error');
      return;
    }
    this._asistFotos = { inicio:null, medio:null, fin:null };
    this.irA('pantallaAsistencia');
  },

  _asistFotos: { inicio:null, medio:null, fin:null },

  _fotoAsistencia(tipo, input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar a max 1200px para no exceder límites
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        this._asistFotos[tipo] = canvas.toDataURL('image/jpeg', 0.75);
        const okId = 'asistFoto' + (tipo==='inicio'?'Inicio':tipo==='medio'?'Medio':'Fin') + 'Ok';
        const ok = document.getElementById(okId);
        if (ok) ok.style.display = 'block';
        this.toast('Foto ' + tipo + ' cargada','exito');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
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
