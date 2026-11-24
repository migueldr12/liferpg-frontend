export const hostDemo = {
  status: 'En línea', version: 'v1.4.2', environment: 'Producción', platform: 'Azure App Service', uptime: '6 d 10 h 42 m', deployment: 'Nube', address: 'https://api.life-rpg.app', region: 'Central US', httpsPort: 443, realtimePort: 5002,
  latency: [39, 42, 40, 55, 43, 41, 50, 46, 41, 62, 40, 43, 41, 48, 46, 39, 42, 52, 46, 43, 44, 120, 41, 44, 42, 45, 40, 44, 43, 39],
};

export const lanHostDemo = {
  status: 'En línea', version: 'v1.4.2', environment: 'Desarrollo', platform: 'Docker · Ubuntu 24.04', uptime: '3 h 18 m', deployment: 'LAN', address: 'https://192.168.1.42', region: 'Red local · oficina', httpsPort: 7043, realtimePort: 5002,
  latency: [7, 6, 8, 9, 7, 7, 10, 8, 6, 7, 9, 8, 7, 6, 8, 9, 7, 8, 6, 7, 10, 8, 7, 6, 8, 7, 9, 6, 7, 8],
};

export const clientsDemo = [
  { id: 'a91f…e2', user: 'valeria', device: 'Pixel 7 · Android 15', ip: '201.141.22.8', client: 'App', lastSeen: 'hace 2 s' },
  { id: '3c0d…7b', user: 'valeria', device: 'Chrome 129 · Windows', ip: '201.141.22.8', client: 'PWA', lastSeen: 'hace 14 s' },
  { id: '77ab…01', user: 'ana.t', device: 'iPhone 13 · iOS 18', ip: '189.203.4.77', client: 'App', lastSeen: 'hace 5 s' },
  { id: 'e4c2…9f', user: 'diego.r', device: 'Galaxy A54 · Android 14', ip: '187.190.12.3', client: 'App', lastSeen: 'hace 31 s' },
  { id: '5d19…c4', user: 'lu.gomez', device: 'Safari 18 · macOS', ip: '201.103.88.20', client: 'PWA', lastSeen: 'hace 1 min' },
  { id: 'b08e…53', user: 'bruno.p', device: 'Moto G84 · Android 14', ip: '45.33.112.9', client: 'App', lastSeen: 'hace 3 s', anomalous: true },
  { id: 'f2aa…6e', user: 'sofia.ruiz', device: 'Firefox 131 · Linux', ip: '201.141.90.5', client: 'PWA', lastSeen: 'hace 2 min' },
  { id: '0c7d…a8', user: 'mateo', device: 'Redmi 12 · Android 13', ip: '189.216.7.144', client: 'App', lastSeen: 'hace 6 min' },
];

export const logsDemo = [
  { id: 1, time: '14:32:06', method: 'GET', code: 404, endpoint: '/api/perfil/espejo/202', ms: 10, user: 'diego.r' },
  { id: 2, time: '14:32:05', method: 'POST', code: 201, endpoint: '/api/auth/refresh', ms: 77, user: 'lu.gomez' },
  { id: 3, time: '14:32:04', method: 'GET', code: 200, endpoint: '/api/habitos/hoy', ms: 42, user: 'diego.r' },
  { id: 4, time: '14:32:03', method: 'PUT', code: 200, endpoint: '/api/misiones/632', ms: 44, user: 'diego.r' },
  { id: 5, time: '14:32:02', method: 'POST', code: 201, endpoint: '/api/botin/regalos', ms: 12, user: 'mateo' },
  { id: 6, time: '14:32:01', method: 'PUT', code: 200, endpoint: '/api/misiones/564', ms: 98, user: 'diego.r' },
  { id: 7, time: '14:32:00', method: 'POST', code: 201, endpoint: '/api/auth/refresh', ms: 26, user: 'mateo' },
  { id: 8, time: '14:31:58', method: 'PUT', code: 200, endpoint: '/api/perfil/mascota', ms: 34, user: 'mateo' },
  { id: 9, time: '14:31:56', method: 'PUT', code: 200, endpoint: '/api/misiones/458', ms: 41, user: 'lu.gomez' },
  { id: 10, time: '14:31:54', method: 'POST', code: 500, endpoint: '/api/habitos/431/checkin', ms: 636, user: 'valeria' },
  { id: 11, time: '14:31:52', method: 'POST', code: 201, endpoint: '/api/stickers/enviar', ms: 90, user: 'mateo' },
  { id: 12, time: '14:31:50', method: 'PATCH', code: 200, endpoint: '/api/catalogo/articulos/18', ms: 53, user: 'admin.gm' },
  { id: 13, time: '14:31:48', method: 'DELETE', code: 204, endpoint: '/api/amigos/91', ms: 31, user: 'ana.t' },
  { id: 14, time: '14:31:46', method: 'GET', code: 200, endpoint: '/api/retos/grupo', ms: 48, user: 'bruno.p' },
  { id: 15, time: '14:31:44', method: 'POST', code: 400, endpoint: '/api/botin/regalos', ms: 23, user: 'sofia.ruiz' },
  { id: 16, time: '14:31:42', method: 'GET', code: 200, endpoint: '/api/diario/actividades', ms: 37, user: 'valeria' },
  { id: 17, time: '14:31:40', method: 'PATCH', code: 200, endpoint: '/api/perfil/preferencias', ms: 28, user: 'mateo' },
  { id: 18, time: '14:31:38', method: 'POST', code: 201, endpoint: '/api/habitos/88/checkin', ms: 62, user: 'ana.t' },
  { id: 19, time: '14:31:36', method: 'GET', code: 503, endpoint: '/api/sincronizacion/estado', ms: 804, user: 'bruno.p' },
  { id: 20, time: '14:31:34', method: 'DELETE', code: 204, endpoint: '/api/notificaciones/771', ms: 19, user: 'lu.gomez' },
  { id: 21, time: '14:31:32', method: 'GET', code: 200, endpoint: '/api/inventario', ms: 35, user: 'diego.r' },
  { id: 22, time: '14:31:30', method: 'PUT', code: 422, endpoint: '/api/misiones/700', ms: 46, user: 'valeria' },
  { id: 23, time: '14:31:28', method: 'POST', code: 201, endpoint: '/api/retos/12/aporte', ms: 71, user: 'mateo' },
  { id: 24, time: '14:31:26', method: 'GET', code: 200, endpoint: '/api/amigos', ms: 29, user: 'sofia.ruiz' },
];
