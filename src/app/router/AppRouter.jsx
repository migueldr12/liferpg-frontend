import { Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './Inicio';
import CofrePage from '../../modules/m08-botin/pages/CofrePage';
import SolicitudesPage from '../../modules/m08-botin/pages/SolicitudesPage';
import HistorialPage from '../../modules/m08-botin/pages/HistorialPage';

// Rutas de toda la PWA. Cada módulo agrega aquí sus rutas desde su propia rama.
// Convención: /lite/... para el Perfil lite y /admin/... para el panel de administrador.
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />

      {/* M08 · Botín, regalos entre amigos (PWA Perfil lite) */}
      <Route path="/lite/botin" element={<Navigate to="/lite/botin/cofre" replace />} />
      <Route path="/lite/botin/cofre" element={<CofrePage />} />
      <Route path="/lite/botin/solicitudes" element={<SolicitudesPage />} />
      <Route path="/lite/botin/historial" element={<HistorialPage />} />
    </Routes>
  );
}
