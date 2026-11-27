import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ModuleScreen } from '../../shared/components/ModuleScreen';
import ProgresoPendientesPage from '../../modules/m11-resumen-progreso/pages/lite/ProgresoPendientesPage';
import ProgresoDiasRojosPage from '../../modules/m11-resumen-progreso/pages/lite/ProgresoDiasRojosPage';
import ProgresoRachaPage from '../../modules/m11-resumen-progreso/pages/lite/ProgresoRachaPage';
import AnimoStickersPage from '../../modules/m10-notificaciones/pages/AnimoStickersPage';
import AnimoHistorialPage from '../../modules/m10-notificaciones/pages/AnimoHistorialPage';
import AnimoAvisosPage from '../../modules/m10-notificaciones/pages/AnimoAvisosPage';
import ListaPartyPage from '../../modules/m07-visualizador-usuarios/pages/ListaPartyPage';
import PerfilEspejoPage from '../../modules/m07-visualizador-usuarios/pages/PerfilEspejoPage';
import GestorCodigosPage from '../../modules/m07-visualizador-usuarios/pages/GestorCodigosPage';
import CofrePage from '../../modules/m08-botin/pages/CofrePage';
import SolicitudesPage from '../../modules/m08-botin/pages/SolicitudesPage';
import HistorialPage from '../../modules/m08-botin/pages/HistorialPage';
import ActividadesPage from '../../modules/m09-diario-aventura/pages/ActividadesPage';
import DetalleActividadPage, { UltimaActividad } from '../../modules/m09-diario-aventura/pages/DetalleActividadPage';
import GraficasPage from '../../modules/m09-diario-aventura/pages/GraficasPage';
import RetosPage from '../../modules/m12-retos-grupo/pages/RetosPage';
import MetricasPage from '../../modules/m12-retos-grupo/pages/MetricasPage';
import PorAreaPage from '../../modules/m12-retos-grupo/pages/PorAreaPage';
import { HostMonitorPage } from '../../modules/m13-sincronizacion-red/pages/HostMonitorPage';
import { ClientsPage } from '../../modules/m13-sincronizacion-red/pages/ClientsPage';
import { RestConsolePage } from '../../modules/m13-sincronizacion-red/pages/RestConsolePage';
import CurvaXpPage from '../../modules/m14-economia-global/pages/CurvaXpPage';
import CatalogoPage from '../../modules/m14-economia-global/pages/CatalogoPage';
import PushPage from '../../modules/m14-economia-global/pages/PushPage';
import { DatabaseMonitorPage } from '../../modules/m15-gestion-bd/pages/DatabaseMonitorPage';
import { BackupsPage } from '../../modules/m15-gestion-bd/pages/BackupsPage';
import { PurgePage } from '../../modules/m15-gestion-bd/pages/PurgePage';
import LandingPage from '../../modules/m16-landing/pages/LandingPage';
import { adminModules, liteModules } from './modules';
import { AccessGate, RequireSession, homeFor } from '../../modules/m00-usuarios-autenticacion/hooks/useSessionRoutes';
import { useSession } from '../../modules/m00-usuarios-autenticacion/hooks/SessionProvider';
import LoginPage from '../../modules/m00-usuarios-autenticacion/pages/LoginPage';
import CrearCuentaPage from '../../modules/m00-usuarios-autenticacion/pages/CrearCuentaPage';
import RecuperarPage from '../../modules/m00-usuarios-autenticacion/pages/RecuperarPage';
import BienvenidaPage from '../../modules/m00-usuarios-autenticacion/pages/BienvenidaPage';
import SesionErrorPage from '../../modules/m00-usuarios-autenticacion/pages/SesionErrorPage';

const implementedScreens = {
  m07: { '': <ListaPartyPage />, perfil: <PerfilEspejoPage />, codigos: <GestorCodigosPage /> },
  m08: { cofre: <CofrePage />, solicitudes: <SolicitudesPage />, historial: <HistorialPage /> },
  m09: { '': <ActividadesPage />, detalle: <UltimaActividad />, graficas: <GraficasPage /> },
  m10: { '': <AnimoAvisosPage />, avisos: <AnimoAvisosPage />, stickers: <AnimoStickersPage />, historial: <AnimoHistorialPage /> },
  m11: { '': <ProgresoPendientesPage />, inactividad: <ProgresoDiasRojosPage />, racha: <ProgresoRachaPage /> },
  m12: { '': <RetosPage />, metricas: <MetricasPage />, 'por-area': <PorAreaPage /> },
  m13: { '': <HostMonitorPage />, clientes: <ClientsPage />, consola: <RestConsolePage /> },
  m14: { curva: <CurvaXpPage />, catalogo: <CatalogoPage />, push: <PushPage /> },
  m15: { '': <DatabaseMonitorPage />, respaldos: <BackupsPage />, purga: <PurgePage /> },
};

function moduleRoutes(modules, prefix) {
  return modules.map((module) => {
    const homeScreen = module.screens.find((screen) => screen.path === '');
    return (
      <Route key={module.id} path={module.path}>
        <Route index element={homeScreen
          ? implementedScreens[module.id]?.[''] ?? <ModuleScreen module={module} screen={homeScreen} prefix={prefix} />
          : <Navigate to={module.screens[0].path} replace />} />
        {module.screens.filter((screen) => screen.path).map((screen) => (
          <Route key={screen.path} path={screen.path} element={implementedScreens[module.id]?.[screen.path] ?? <ModuleScreen module={module} screen={screen} prefix={prefix} />} />
        ))}
        {module.id === 'm09' && <Route path=":activityId" element={<DetalleActividadPage />} />}
        {module.id === 'm07' && <Route path="perfil/:friendId" element={<PerfilEspejoPage />} />}
        <Route path="*" element={<Navigate to={`${prefix}/${module.path}`} replace />} />
      </Route>
    );
  });
}

// "/" lleva al inicio que le toca (los administradores a /admin; las guardas resuelven el resto)
function RootRedirect() {
  const session = useSession();
  return <Navigate to={session.status === 'ready' ? homeFor(session) : '/lite/amigos'} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/inicio" element={<LandingPage />} />
      <Route path="/acceso" element={<AccessGate />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="crear-cuenta" element={<CrearCuentaPage />} />
        <Route path="recuperar" element={<RecuperarPage />} />
        <Route path="bienvenida" element={<BienvenidaPage />} />
        <Route path="error" element={<SesionErrorPage />} />
      </Route>
      <Route element={<RequireSession area="lite" />}>
        <Route path="/lite" element={<AppLayout variant="lite" />}>
          <Route index element={<Navigate to="amigos" replace />} />
          {moduleRoutes(liteModules, '/lite')}
        </Route>
      </Route>
      <Route element={<RequireSession area="admin" />}>
        <Route path="/admin" element={<AppLayout variant="admin" />}>
          <Route index element={<Navigate to="host" replace />} />
          {moduleRoutes(adminModules, '/admin')}
        </Route>
      </Route>
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
