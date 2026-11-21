export const hostDemo = {
  status: 'En línea', version: 'v1.4.2', environment: 'Producción', platform: 'Azure App Service', uptime: '6 d 10 h 42 m', deployment: 'Nube', address: '—', httpsPort: 443, realtimePort: 5002,
  latency: [39, 42, 40, 55, 43, 41, 50, 46, 41, 62, 40, 43, 41, 48, 46, 39, 42, 52, 46, 43, 44, 120, 41, 44, 42, 45, 40, 44, 43, 39],
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
];
