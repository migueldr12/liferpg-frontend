// Contenido estático de la landing (M16). No consulta el backend: la página explica el
// producto antes de iniciar sesión. Si algún día se administra desde el servidor, este
// archivo se sustituye por funciones que llamen a `http()` con la misma forma de datos.

export const NAV_LINKS = [
  { href: '#que-es', label: 'Qué es' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#tutorial', label: 'Tutorial' },
  { href: '#preguntas', label: 'Preguntas' },
];

// Los tres tipos de puntos, con los mismos colores que la app móvil (--area-*).
export const POINT_TYPES = [
  {
    key: 'cultura',
    label: 'Cultura',
    icon: 'book',
    example: 'Leer 20 páginas, practicar un idioma, ver un documental.',
  },
  {
    key: 'fisico',
    label: 'Físico',
    icon: 'dumbbell',
    example: 'Salir a correr, estirarte al despertar, tomar agua.',
  },
  {
    key: 'enfoque',
    label: 'Enfoque',
    icon: 'target',
    example: 'Sesiones de estudio con temporizador, cerrar pendientes.',
  },
];

// El ciclo de juego, en el orden real en que lo vive el jugador.
export const GAME_LOOP = [
  {
    icon: 'edit',
    title: 'Crea tus hábitos y misiones',
    text: 'En el celular defines hábitos diarios (quests) y misiones únicas. Cada uno suma a Cultura, Físico o Enfoque.',
  },
  {
    icon: 'check',
    title: 'Haz check-in al cumplir',
    text: 'Marcas lo que hiciste o usas el modo enfoque con temporizador. El servidor te da experiencia y monedas.',
  },
  {
    icon: 'heart',
    title: 'Tu mascota reacciona',
    text: 'Su vitalidad sube cuando cumples y baja si te ausentas. Su ánimo refleja cómo vas en la semana.',
  },
  {
    icon: 'gift',
    title: 'Gasta, viste y comparte',
    text: 'Con tus monedas compras ropa en la tienda, armas looks en el vestidor y regalas objetos a tu party.',
  },
  {
    icon: 'clock',
    title: 'El día cierra a las 23:59',
    text: 'Lo que quedó sin hacer pasa a pendientes y tu racha se actualiza. Mañana empieza una nueva partida.',
  },
];

// Recorrido de la app móvil: donde se juega el día a día.
export const MOBILE_STEPS = [
  {
    icon: 'shield',
    title: 'Entra y elige tu animal',
    text: 'Inicia sesión con Google o correo, completa tu perfil y escoge tu mascota: dragón, gato, perro, hámster o león. Solo se elige una vez.',
    pet: 'dragon',
  },
  {
    icon: 'heart',
    title: 'La Casa es tu HUD',
    text: 'Al abrir la app ves a tu mascota, su vitalidad, tu nivel y tus monedas. Desde ahí llegas a todo lo demás.',
    pet: 'gato',
  },
  {
    icon: 'check',
    title: 'Hábitos y misiones',
    text: 'Crea hábitos con días y horario, haz check-in y cuida tu racha. Las misiones únicas tienen tablero, modo enfoque e historial.',
    pet: 'perro',
  },
  {
    icon: 'coins',
    title: 'Tienda, vestidor y logros',
    text: 'Canjea monedas por ropa y recompensas propias, guarda tus looks favoritos y desbloquea logros en tu vitrina.',
    pet: 'hamster',
  },
  {
    icon: 'spark',
    title: 'Registra tu ánimo',
    text: 'Anota cómo te sientes cada día. La app te muestra la gráfica del mes y un diario para releer tus notas.',
    pet: 'leon',
  },
];

// Recorrido de la PWA: el perfil lite para ver el progreso propio y el de tu party.
// `shot` apunta a capturas reales en public/landing (se regeneran con `pnpm landing:shots`).
export const WEB_STEPS = [
  {
    icon: 'friends',
    title: 'Amigos',
    path: '/lite/amigos',
    text: 'Tu party en una lista: nivel, mascota y racha de cada amigo. Comparte tu código de amistad para sumar gente.',
    shot: '/landing/amigos.png',
  },
  {
    icon: 'gift',
    title: 'Botín',
    path: '/lite/botin/cofre',
    text: 'Abre tu cofre, regala objetos que llegan a la app móvil de tu amigo y atiende las solicitudes que te mandan.',
    shot: '/landing/botin.png',
  },
  {
    icon: 'book',
    title: 'Diario',
    path: '/lite/diario/graficas',
    text: 'Todas tus misiones, hábitos y sesiones de enfoque juntos, con gráficas para ver tus patrones por semana o mes.',
    shot: '/landing/diario.png',
  },
  {
    icon: 'bell',
    title: 'Ánimo',
    path: '/lite/animo/stickers',
    text: 'Te avisa quién de tu party lleva días sin moverse. Un sticker basta para darle un empujón.',
    shot: '/landing/animo.png',
  },
  {
    icon: 'flame',
    title: 'Progreso',
    path: '/lite/progreso/racha',
    text: 'Revisa lo que quedó pendiente, tus días flojos y el estado de tu racha: activa, en riesgo o rota.',
    shot: '/landing/progreso.png',
  },
  {
    icon: 'flag',
    title: 'Retos',
    path: '/lite/retos',
    text: 'Metas compartidas que se llenan con el esfuerzo de todos y métricas para comparar cómo vas frente al grupo.',
    shot: '/landing/retos.png',
  },
];

export const ADMIN_TOOLS = [
  { icon: 'server', title: 'Host', text: 'Estado del servidor, dispositivos conectados y consola de peticiones.' },
  { icon: 'coins', title: 'Economía', text: 'Curva de experiencia, catálogo de objetos y avisos push.' },
  { icon: 'database', title: 'Datos', text: 'Monitor de la base, respaldos de perfiles y purga de registros.' },
];

export const FAQ = [
  {
    q: '¿Necesito las dos apps?',
    a: 'Para jugar, la app móvil es la principal: ahí haces check-in, cuidas a tu mascota y compras en la tienda. La PWA es el complemento para ver tu progreso con calma en pantalla grande y convivir con tu party.',
  },
  {
    q: '¿Qué pasa si un día no cumplo?',
    a: 'Nada se borra. Al cierre de las 23:59 lo pendiente se guarda para que lo retomes, tu mascota pierde algo de vitalidad y tu racha puede quedar en riesgo. Con un check-in al día siguiente vuelves a sumar.',
  },
  {
    q: '¿Mis amigos ven todo lo que hago?',
    a: 'Ven tu nivel, tu mascota, tu racha y tu avance por tipo de punto. Tus notas del diario y tu registro de ánimo son tuyos.',
  },
  {
    q: '¿Cómo instalo la PWA?',
    a: 'Ábrela en el navegador de tu computadora o celular y usa la opción "Instalar app" o "Agregar a pantalla de inicio". Se abre como una app más, sin pasar por una tienda.',
  },
  {
    q: '¿Funciona en la red local de la escuela?',
    a: 'Sí. El servidor puede correr en la nube o en una computadora de la red local. En la app móvil cambias la dirección en Ajustes, sección Servidor.',
  },
];
