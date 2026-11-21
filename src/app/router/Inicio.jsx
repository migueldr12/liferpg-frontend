import { Link } from 'react-router-dom';
import { routesIndex } from './routesIndex';

// Página temporal de inicio: lista las pantallas disponibles para probarlas
// mientras no existe el inicio de sesión (M00).
export default function Inicio() {
  return (
    <main className="page">
      <h1 className="titulo-pixel">Life-RPG · PWA</h1>
      <p className="texto-suave">Pantallas disponibles por módulo</p>
      {routesIndex.length === 0 ? (
        <p className="texto-suave">Todavía no hay módulos conectados.</p>
      ) : (
        <ul className="lista-rutas">
          {routesIndex.map((r) => (
            <li key={r.path}>
              <Link to={r.path}>{r.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
