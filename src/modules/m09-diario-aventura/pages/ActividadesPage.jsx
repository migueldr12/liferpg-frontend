import { useEffect, useRef } from 'react';
import { CatalogIcon } from '../../../shared/components/CatalogIcon';
import { Icon } from '../../../shared/components/Icon';
import { Link } from 'react-router-dom';
import FilterGroup from '../components/FilterGroup';
import { OriginTag, StatusTag, TypeTag } from '../components/Tags';
import { ORIGINS, STATUSES, TYPES, pointsText, typeMeta } from '../hooks/diarioFormat';
import { RANGES, useActividades } from '../hooks/useActividades';
import '../components/diario.css';
import '../components/registro.css';

const ALL = { key: null, label: 'Todo' };

// 9.1 Listado de actividades (RF028)
export default function ActividadesPage() {
  const vm = useActividades();
  const n = vm.total;
  const scroller = useRef(null);
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = 0; }, [vm.filters]);

  return (
    <div className="m09">

      {vm.error && <p className="m09-error" role="alert">{vm.error}</p>}

      {/* Filtros por tipo, origen, estado y fecha (RDF092) */}
      <div className="m09-filtros">
        <FilterGroup label="Tipo" options={[ALL, ...TYPES]} value={vm.filters.type} onChange={(v) => vm.setFilter('type', v)} />
        <FilterGroup label="Origen" options={[ALL, ...ORIGINS]} value={vm.filters.origin} onChange={(v) => vm.setFilter('origin', v)} />
        <FilterGroup label="Estado" options={[ALL, ...STATUSES]} value={vm.filters.status} onChange={(v) => vm.setFilter('status', v)} />
        <FilterGroup label="Fecha" options={RANGES}
          value={vm.filters.range} onChange={(v) => vm.setFilter('range', v)} />
      </div>

      <section className="adventure-ledger" aria-labelledby="ledger-title">
        <header className="adventure-ledger__header">
          <h2 id="ledger-title"><Icon name="book" size={23} /> Registro de actividades</h2>
          <span role="status">{vm.loading ? 'Cargando actividades…' : vm.error ? '' : `${n} ${n === 1 ? 'actividad' : 'actividades'}`}</span>
        </header>
        <div className="adventure-ledger__scroll" ref={scroller} tabIndex={0} role="region" aria-labelledby="ledger-title" aria-busy={vm.loading}>
          <table aria-label="Actividades del diario">
            <thead><tr><th scope="col">Actividad</th><th scope="col">Fecha</th><th scope="col">Tipo</th><th scope="col">Origen</th><th scope="col">Estado</th><th scope="col">Puntos</th></tr></thead>
            <tbody>
              {!vm.loading && !vm.error && vm.rows.map((a, index) => (
                <tr key={a.id} className={index && a.day !== vm.rows[index - 1].day ? 'adventure-ledger__new-day' : undefined}>
                  <th scope="row"><Link to={`/lite/diario/${a.id}`} aria-label={`Ver detalle de ${a.title}`}>
                    <span className="m09-icono" style={{ background: typeMeta(a.type).color }} aria-hidden="true"><CatalogIcon icon={typeMeta(a.type).icon} size={16} /></span>
                    <span>{a.title}</span><Icon className="adventure-ledger__chevron" name="chevron" size={16} />
                  </Link></th>
                  <td><strong>{a.day}</strong><small>{a.time}</small></td>
                  <td><TypeTag type={a.type} /></td><td><OriginTag origin={a.origin} /></td><td><StatusTag status={a.status} /></td>
                  <td className="adventure-ledger__points">{pointsText(a)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!vm.loading && !vm.error && n === 0 && <div className="m09-vacio"><p>Ninguna actividad coincide con los filtros.</p><button type="button" className="m09-btn-secundario" onClick={vm.clearFilters}>Quitar filtros</button></div>}
        {!vm.loading && !vm.error && n > 0 && <p className="adventure-ledger__hint">Desplázate dentro del registro para ver más.<span> Desliza hacia los lados para consultar todas las columnas.</span></p>}
      </section>
    </div>
  );
}
