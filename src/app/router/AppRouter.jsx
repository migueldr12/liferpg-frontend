import { Routes, Route } from 'react-router-dom';
import Inicio from './Inicio';

// Rutas de toda la PWA. Cada módulo agrega aquí sus rutas desde su propia rama.
// Convención: /lite/... para el Perfil lite y /admin/... para el panel de administrador.
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
    </Routes>
  );
}
