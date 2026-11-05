import { Routes, Route } from 'react-router-dom';
import Inicio from './Inicio';
import CurvaXpPage from '../../modules/m14-economia-global/pages/CurvaXpPage';
import CatalogoPage from '../../modules/m14-economia-global/pages/CatalogoPage';
import PushPage from '../../modules/m14-economia-global/pages/PushPage';
import RetosPage from '../../modules/m12-retos-grupo/pages/RetosPage';
import MetricasPage from '../../modules/m12-retos-grupo/pages/MetricasPage';
import PorAreaPage from '../../modules/m12-retos-grupo/pages/PorAreaPage';

// Rutas de toda la PWA. Cada módulo agrega aquí sus rutas desde su propia rama.
// Convención: /lite/... para el Perfil lite y /admin/... para el panel de administrador.
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />

      {/* M12 · Retos y métricas de grupo (PWA Perfil lite) */}
      <Route path="/lite/retos" element={<RetosPage />} />
      <Route path="/lite/retos/metricas" element={<MetricasPage />} />
      <Route path="/lite/retos/por-area" element={<PorAreaPage />} />

      {/* M14 · Balanceo de economía global (PWA Admin) */}
      <Route path="/admin/economia/curva" element={<CurvaXpPage />} />
      <Route path="/admin/economia/catalogo" element={<CatalogoPage />} />
      <Route path="/admin/economia/push" element={<PushPage />} />
    </Routes>
  );
}
