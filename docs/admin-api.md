# Contratos previstos para M13 y M15

El backend actual es únicamente una estructura Express, sin endpoints ni autenticación
implementados. Estas rutas son el contrato **propuesto por el frontend**, no endpoints ya
disponibles. La UI arranca con `VITE_ADMIN_API_ENABLED=false` y muestra muestras claramente
identificadas; no simula haber creado respaldos, revocado sesiones ni purgado datos.

Para conectar, proteger todas estas rutas con sesión y rol de administrador en el backend,
configurar CORS/credenciales según despliegue y activar `VITE_ADMIN_API_ENABLED=true`.
`VITE_API_URL` debe terminar en `/api/v1`. En caso de error, el frontend muestra el fallo
en vez de reemplazarlo silenciosamente por datos de ejemplo.

| Método | Ruta bajo `/api/v1/admin` | Respuesta/entrada |
| --- | --- | --- |
| GET | `/host/monitor` | `{status, version, environment, platform, uptime, deployment, address, httpsPort, realtimePort, latency: number[]}` |
| GET | `/host/clients` | `[{id, user, device, ip, client, lastSeen, anomalous?}]` |
| DELETE | `/host/clients/:id` | 204; revoca la sesión seleccionada |
| GET | `/host/logs` | `[{id, time, method, code, endpoint, ms, user}]` sin datos sensibles |
| GET | `/data/status` | `{connected, latencyMs, engine, host, sizeGb, capacityGb, pool, tables: [{name, count}], migrations: [{name, date?, pending?}]}` |
| POST | `/data/migrations` | Aplica migraciones pendientes y responde 200/204 |
| GET | `/data/backups` | `[{id, profile, date, owner, format, size}]` |
| POST | `/data/backups` | `{scope: 'all'|'profile', profile: string|null, sections: string[], format: 'json'|'csv'}` |
| GET | `/data/backups/:id/download` | Archivo descargable |
| GET | `/data/purge` | `{categories: [{id, label, detail, count}], history: [{owner, date, detail, count}]}` |
| POST | `/data/purge/preview` | `{days: 30|90|180, categories: string[]}` → `{count: number}` calculado en servidor |
| POST | `/data/purge` | `{days, categories, confirmation: 'PURGAR'}`; comprobar permisos, vista previa y registrar auditoría |

La consola usa consultas cada 5 segundos mientras esté activa; el monitor permite 5, 10
o 30 segundos, y las sesiones y el monitor SQL consultan cada 5 y 10 segundos. Si se
implementa SignalR, puede reemplazarse la consulta periódica sin cambiar las pantallas.
