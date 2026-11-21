// La navegación compartida vive aquí; cada equipo implementa sus pantallas en src/modules.
export const liteModules = [
  {
    id: "m07",
    label: "Amigos",
    icon: "friends",
    path: "amigos",
    description: "Tu equipo, sus perfiles y los códigos de amistad.",
    screens: [
      {
        label: "Amigos",
        path: "",
        title: "Tu party",
        subtitle: "Amigos que ven tu progreso y tú el suyo",
      },
      {
        label: "Perfil espejo",
        path: "perfil",
        subtitle: "El progreso de tus amigos, de un vistazo",
      },
      {
        label: "Códigos",
        path: "codigos",
        title: "Códigos de amistad",
        subtitle: "Conecta con otros aventureros",
      },
    ],
  },
  {
    id: "m08",
    label: "Botín",
    icon: "gift",
    path: "botin",
    description: "Comparte objetos y sigue los regalos de tu equipo.",
    screens: [
      {
        label: "Cofre",
        path: "cofre",
        title: "Cofre del botín",
        subtitle:
          "Objetos que puedes regalar · llegan a la app móvil de tu amigo",
      },
      {
        label: "Solicitudes",
        path: "solicitudes",
        title: "Solicitudes de regalo",
        subtitle: "Tus amigos te piden ayuda · tú decides qué sale de tu cofre",
      },
      {
        label: "Historial",
        path: "historial",
        title: "Historial de botín",
        subtitle: "Qué regalaste, a quién y cuándo",
      },
    ],
  },
  {
    id: "m09",
    label: "Diario",
    icon: "book",
    path: "diario",
    description: "Misiones, hábitos y sesiones en un solo lugar.",
    screens: [
      {
        label: "Actividades",
        path: "",
        title: "Diario de aventura",
        subtitle: "Misiones, hábitos y sesiones de enfoque en un solo lugar",
      },
      {
        label: "Detalle",
        path: "detalle",
        subtitle: "Notas de seguimiento de la actividad",
      },
      {
        label: "Gráficas",
        path: "graficas",
        title: "Tus patrones",
        subtitle: "Actividades cumplidas · cambia el rango para comparar",
      },
    ],
  },
  {
    id: "m10",
    label: "Ánimo",
    icon: "bell",
    path: "animo",
    description: "Avisos, stickers y mensajes de acompañamiento.",
    screens: [
      {
        label: "Avisos",
        path: "",
        title: "Ánimo",
        subtitle: "Quién de tu party lleva días sin moverse · un sticker basta",
      },
      {
        label: "Stickers",
        path: "stickers",
        title: "Stickers de ánimo",
        subtitle: "Elige uno y mándalo a uno o varios amigos",
      },
      {
        label: "Historial",
        path: "historial",
        title: "Historial de ánimo",
        subtitle: "El apoyo que diste y el que te llegó",
      },
    ],
  },
  {
    id: "m11",
    label: "Progreso",
    icon: "flame",
    path: "progreso",
    description: "Pendientes, días de poca actividad y rachas.",
    screens: [
      {
        label: "Pendientes",
        path: "",
        title: "Lo que quedó pendiente",
        subtitle: "Generado por el cierre diario de las 23:59",
      },
      {
        label: "Días flojos",
        path: "inactividad",
        subtitle: "Porcentaje de hábitos cumplidos por día",
      },
      {
        label: "Racha",
        path: "racha",
        title: "Tu racha",
        subtitle: "Días seguidos con al menos un check-in",
      },
    ],
  },
  {
    id: "m12",
    label: "Retos",
    icon: "flag",
    path: "retos",
    description: "Metas compartidas y métricas de tu grupo.",
    screens: [
      {
        label: "Retos",
        path: "",
        title: "Retos de grupo",
        subtitle: "Metas que se llenan con el esfuerzo de toda la party",
      },
      {
        label: "Métricas",
        path: "metricas",
        title: "¿Cómo vas frente al grupo?",
        subtitle: "Cumplimiento promedio por tipo de misión",
      },
      {
        label: "Por área",
        path: "por-area",
        title: "Quién destaca esta semana",
        subtitle: "Ordena a tu party por el avance semanal en un área",
      },
    ],
  },
];

export const adminModules = [
  {
    id: "m13",
    label: "Host",
    icon: "server",
    path: "host",
    description: "Estado de la API, dispositivos y peticiones.",
    screens: [
      {
        label: "Monitor",
        path: "",
        title: "Monitor del host",
        subtitle: "¿El backend está vivo? Estado, dirección y puertos",
      },
      {
        label: "Clientes",
        path: "clientes",
        title: "Clientes conectados",
        subtitle: "Dispositivos que consumen la API ahora mismo",
      },
      {
        label: "Consola REST",
        path: "consola",
        subtitle:
          "Cada petición registrada por el middleware, sin datos sensibles",
      },
    ],
  },
  {
    id: "m14",
    label: "Economía",
    icon: "coins",
    path: "economia",
    description: "Curva de experiencia, catálogo y avisos push.",
    screens: [
      {
        label: "Curva XP",
        path: "curva",
        title: "Economía del juego",
        subtitle:
          "Ni muy fácil ni frustrante · los cambios no son retroactivos",
      },
      {
        label: "Catálogo",
        path: "catalogo",
        subtitle: "Alimenta la tienda, el cofre y los stickers",
      },
      {
        label: "Push",
        path: "push",
        title: "Notificaciones push",
        subtitle: "Avisos y campañas de motivación a la app móvil",
      },
    ],
  },
  {
    id: "m15",
    label: "Datos",
    icon: "database",
    path: "datos",
    description: "Diagnóstico, respaldos y limpieza de registros.",
    screens: [
      {
        label: "Monitor SQL",
        path: "",
        title: "Base de datos",
        subtitle: "Diagnóstico sin salir del panel",
      },
      {
        label: "Respaldos",
        path: "respaldos",
        subtitle: "Genera copias manuales de uno o todos los perfiles",
      },
      {
        label: "Purga",
        path: "purga",
        title: "Purgador de logs",
        subtitle: "Libera espacio · siempre con vista previa y confirmación",
      },
    ],
  },
];
