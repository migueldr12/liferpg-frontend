import { Routes, Route } from 'react-router-dom';
import Inicio from './Inicio';
import CurvaXpPage from '../../modules/m14-economia-global/pages/CurvaXpPage';
import CatalogoPage from '../../modules/m14-economia-global/pages/CatalogoPage';
import PushPage from '../../modules/m14-economia-global/pages/PushPage';

// Rutas de toda la PWA. Cada módulo agrega aquí sus rutas desde su propia rama.
// Convención: /lite/... para el Perfil lite y /admin/... para el panel de administrador.
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />

      {/* M14 · Balanceo de economía global (PWA Admin) */}
      <Route path="/admin/economia/curva" element={<CurvaXpPage />} />
      <Route path="/admin/economia/catalogo" element={<CatalogoPage />} />
      <Route path="/admin/economia/push" element={<PushPage />} />
    </Routes>
  );
}
