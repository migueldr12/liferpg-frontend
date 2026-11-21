import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ModuleScreen } from '../../shared/components/ModuleScreen';
import ListaPartyPage from '../../modules/m07-visualizador-usuarios/pages/ListaPartyPage';
import PerfilEspejoPage from '../../modules/m07-visualizador-usuarios/pages/PerfilEspejoPage';
import GestorCodigosPage from '../../modules/m07-visualizador-usuarios/pages/GestorCodigosPage';
import { HostMonitorPage } from '../../modules/m13-sincronizacion-red/pages/HostMonitorPage';
import { ClientsPage } from '../../modules/m13-sincronizacion-red/pages/ClientsPage';
import { RestConsolePage } from '../../modules/m13-sincronizacion-red/pages/RestConsolePage';
import { DatabaseMonitorPage } from '../../modules/m15-gestion-bd/pages/DatabaseMonitorPage';
import { BackupsPage } from '../../modules/m15-gestion-bd/pages/BackupsPage';
import { PurgePage } from '../../modules/m15-gestion-bd/pages/PurgePage';
import { adminModules, liteModules } from './modules';

const implementedScreens = {
  m07: { '': <ListaPartyPage />, perfil: <PerfilEspejoPage />, codigos: <GestorCodigosPage /> },
  m13: { '': <HostMonitorPage />, clientes: <ClientsPage />, consola: <RestConsolePage /> },
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
        <Route path="*" element={<Navigate to={`${prefix}/${module.path}`} replace />} />
      </Route>
    );
  });
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/lite/amigos" replace />} />
      <Route path="/lite" element={<AppLayout variant="lite" />}>
        <Route index element={<Navigate to="amigos" replace />} />
        {moduleRoutes(liteModules, '/lite')}
      </Route>
      <Route path="/admin" element={<AppLayout variant="admin" />}>
        <Route index element={<Navigate to="host" replace />} />
        {moduleRoutes(adminModules, '/admin')}
      </Route>
      <Route path="*" element={<Navigate to="/lite/amigos" replace />} />
    </Routes>
  );
}
