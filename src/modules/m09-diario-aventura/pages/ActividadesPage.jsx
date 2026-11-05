import { Link } from 'react-router-dom';
import DiarioHeader from '../components/DiarioHeader';
import FilterGroup from '../components/FilterGroup';
import { OriginTag, StatusTag, TypeTag } from '../components/Tags';
import { ORIGINS, STATUSES, TYPES, pointsText, typeMeta } from '../hooks/diarioFormat';
import { RANGES, useActividades } from '../hooks/useActividades';
import '../components/diario.css';

const ALL = { key: null, label: 'Todo' };

// 9.1 Listado de actividades (RF028)
export default function ActividadesPage() {
  const vm = useActividades();
  const n = vm.rows.length;

  return (
    <main className="page m09">
      <DiarioHeader title="Diario de aventura" subtitle="Misiones, hábitos y sesiones de enfoque en un solo lugar" />

      {vm.error && <p className="m09-error" role="alert">{vm.error}</p>}

      {/* Filtros por tipo, origen, estado y fecha (RDF092) */}
      <div className="m09-filtros">
        <FilterGroup label="Tipo" options={[ALL, ...TYPES]} value={vm.filters.type} onChange={(v) => vm.setFilter('type', v)} />
        <FilterGroup label="Origen" options={[ALL, ...ORIGINS]} value={vm.filters.origin} onChange={(v) => vm.setFilter('origin', v)} />
        <FilterGroup label="Estado" options={[ALL, ...STATUSES]} value={vm.filters.status} onChange={(v) => vm.setFilter('status', v)} />
        <FilterGroup label={`Fecha · ${n} ${n === 1 ? 'resultado' : 'resultados'}`} options={RANGES}
          value={vm.filters.range} onChange={(v) => vm.setFilter('range', v)} />
      </div>

      {/* Actividades (RDF091) */}
      <div className="m09-tabla" aria-busy={vm.loading}>
        <div className="m09-tabla-fila encabezado" aria-hidden="true">
          <span>Fecha</span>
          <span />
          <span>Actividad</span>
          <span>Tipo</span>
          <span>Origen</span>
          <span>Estado</span>
          <span className="m09-derecha">Puntos</span>
        </div>
        {vm.rows.map((a) => (
          <Link key={a.id} to={`/lite/diario/${a.id}`} className="m09-tabla-fila"
            aria-label={`Ver detalle de ${a.title}`}>
            <span className="m09-fecha">
              <span className="titulo-pixel">{a.day}</span>
              <small className="texto-suave">{a.time}</small>
            </span>
            <span className="m09-icono" style={{ background: typeMeta(a.type).color }} aria-hidden="true">{typeMeta(a.type).icon}</span>
            <strong className="m09-titulo">{a.title}</strong>
            <span><TypeTag type={a.type} /></span>
            <span><OriginTag origin={a.origin} /></span>
            <span><StatusTag status={a.status} /></span>
            <span className="m09-puntos titulo-pixel" style={{ color: a.points ? typeMeta(a.type).color : 'var(--texto-suave)' }}>
              {pointsText(a)}
            </span>
          </Link>
        ))}
        {!vm.loading && n === 0 && (
          <div className="m09-vacio">
            <p>Ninguna actividad coincide con los filtros</p>
            <button type="button" className="m09-btn-secundario" onClick={vm.clearFilters}>Quitar filtros</button>
          </div>
        )}
      </div>
    </main>
  );
}
