import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { ModuleScreen } from "../../shared/components/ModuleScreen";
import CofrePage from "../../modules/m08-botin/pages/CofrePage";
import SolicitudesPage from "../../modules/m08-botin/pages/SolicitudesPage";
import HistorialPage from "../../modules/m08-botin/pages/HistorialPage";
import CurvaXpPage from "../../modules/m14-economia-global/pages/CurvaXpPage";
import CatalogoPage from "../../modules/m14-economia-global/pages/CatalogoPage";
import PushPage from "../../modules/m14-economia-global/pages/PushPage";
import ActividadesPage from "../../modules/m09-diario-aventura/pages/ActividadesPage";
import DetalleActividadPage from "../../modules/m09-diario-aventura/pages/DetalleActividadPage";
import GraficasPage from "../../modules/m09-diario-aventura/pages/GraficasPage";
import { HostMonitorPage } from "../../modules/m13-sincronizacion-red/pages/HostMonitorPage";
import { ClientsPage } from "../../modules/m13-sincronizacion-red/pages/ClientsPage";
import { RestConsolePage } from "../../modules/m13-sincronizacion-red/pages/RestConsolePage";
import { DatabaseMonitorPage } from "../../modules/m15-gestion-bd/pages/DatabaseMonitorPage";
import { BackupsPage } from "../../modules/m15-gestion-bd/pages/BackupsPage";
import { PurgePage } from "../../modules/m15-gestion-bd/pages/PurgePage";
import { adminModules, liteModules } from "./modules";

const implementedScreens = {
  m08: {
    cofre: <CofrePage />,
    solicitudes: <SolicitudesPage />,
    historial: <HistorialPage />,
  },
  m09: {
    "": <ActividadesPage />,
    detalle: <Navigate to="/lite/diario/a-5" replace />,
    graficas: <GraficasPage />,
  },
  m14: {
    curva: <CurvaXpPage />,
    catalogo: <CatalogoPage />,
    push: <PushPage />,
  },
  m13: {
    "": <HostMonitorPage />,
    clientes: <ClientsPage />,
    consola: <RestConsolePage />,
  },
  m15: {
    "": <DatabaseMonitorPage />,
    respaldos: <BackupsPage />,
    purga: <PurgePage />,
  },
};

function moduleRoutes(modules, prefix) {
  return modules.map((module) => {
    const homeScreen = module.screens.find((screen) => screen.path === "");
    return (
      <Route key={module.id} path={module.path}>
        <Route
          index
          element={
            homeScreen ? (
              (implementedScreens[module.id]?.[""] ?? (
                <ModuleScreen
                  module={module}
                  screen={homeScreen}
                  prefix={prefix}
                />
              ))
            ) : (
              <Navigate to={module.screens[0].path} replace />
            )
          }
        />
        {module.screens
          .filter((screen) => screen.path)
          .map((screen) => (
            <Route
              key={screen.path}
              path={screen.path}
              element={
                implementedScreens[module.id]?.[screen.path] ?? (
                  <ModuleScreen
                    module={module}
                    screen={screen}
                    prefix={prefix}
                  />
                )
              }
            />
          ))}
        {module.id === "m09" && (
          <Route path=":activityId" element={<DetalleActividadPage />} />
        )}
        <Route
          path="*"
          element={<Navigate to={`${prefix}/${module.path}`} replace />}
        />
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
        {moduleRoutes(liteModules, "/lite")}
      </Route>
      <Route path="/admin" element={<AppLayout variant="admin" />}>
        <Route index element={<Navigate to="host" replace />} />
        {moduleRoutes(adminModules, "/admin")}
      </Route>
      <Route path="*" element={<Navigate to="/lite/amigos" replace />} />
    </Routes>
  );
}
