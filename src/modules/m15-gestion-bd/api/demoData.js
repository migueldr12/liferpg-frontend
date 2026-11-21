export const databaseDemo = {
  connected: true, latencyMs: 12, engine: 'PostgreSQL 16.2', host: 'Azure Flexible Server', sizeGb: 1.84, capacityGb: 32, pool: '12/100',
  tables: [
    { name: 'LogsPeticiones', count: 1312044 }, { name: 'Actividades', count: 84311 }, { name: 'Auditoria', count: 41270 }, { name: 'CheckinsHabitos', count: 39870 }, { name: 'Misiones', count: 6402 }, { name: 'RegalosBotin', count: 2905 }, { name: 'Usuarios', count: 1248 },
  ],
  migrations: [
    { name: '20260814_InicialIdentidad', date: '14 ago' }, { name: '20260902_HabitosYRachas', date: '2 sep' }, { name: '20260919_BotinRegalos', date: '19 sep' }, { name: '20261003_DiarioActividades', date: '3 oct' }, { name: '20261012_RetosGrupales', pending: true }, { name: '20261015_IndicesLogs', pending: true },
  ],
};

export const backupsDemo = [
  { id: '1', profile: 'Todos (1 241 perfiles)', date: 'jue 1 · 03:00', owner: 'admin.gm', format: 'JSON', size: '398 MB' },
  { id: '2', profile: '@cami', date: '28 sep · 18:44', owner: 'sofia.ruiz', format: 'CSV', size: '0.8 MB' },
  { id: '3', profile: '@valeria', date: '21 sep · 09:10', owner: 'admin.gm', format: 'JSON', size: '1.1 MB' },
  { id: '4', profile: 'Todos (1 230 perfiles)', date: '14 sep · 03:00', owner: 'admin.gm', format: 'JSON', size: '387 MB' },
  { id: '5', profile: '@mateo', date: '9 sep · 12:22', owner: 'dev5', format: 'CSV', size: '0.6 MB' },
  { id: '6', profile: '@diego.r', date: '2 sep · 16:05', owner: 'dev5', format: 'JSON', size: '0.9 MB' },
];

export const purgeDemo = {
  categories: [
    { id: 'requests', label: 'Logs de peticiones', detail: 'Consola REST · M13', count: 846000 },
    { id: 'audit', label: 'Auditoría', detail: 'Cambios de catálogo, sesiones y purgas', count: 24800 },
    { id: 'notifications', label: 'Historial de notificaciones', detail: 'Push y stickers entregados', count: 61200 },
  ],
  history: [
    { owner: 'admin.gm', date: 'jue 1 oct · 02:00', detail: 'Logs de peticiones · antes del 2 jul', count: 402118 },
    { owner: 'dev5', date: '15 sep · 19:40', detail: 'Auditoría · antes del 17 jun', count: 18220 },
    { owner: 'admin.gm', date: '1 sep · 02:00', detail: 'Logs y notificaciones · antes del 3 jun', count: 655902 },
  ],
};
