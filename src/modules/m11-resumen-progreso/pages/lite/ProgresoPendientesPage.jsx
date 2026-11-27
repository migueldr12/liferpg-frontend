import React, { useState } from 'react';
import LiteLayout from '../../components/lite/LiteShell';
import { useProgressResource } from '../../hooks/useProgressResource';
import { CatalogIcon } from '../../../../shared/components/CatalogIcon';

const areas = { CULTURE: 'Cultura', PHYSICAL: 'Físico', FOCUS: 'Enfoque' };
const icons = { CULTURE: 'area.cultura', PHYSICAL: 'area.fisico', FOCUS: 'area.enfoque' };

export default function ProgresoPendientesPage() {
  const [fecha, setFecha] = useState('');
  const { data, loading, error } = useProgressResource(`pendientes${fecha ? `?fecha=${fecha}` : ''}`);
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  return <LiteLayout>
    <section className="panel progress-page">
      <div className="progress-page__header"><div><h2>Actividades pendientes</h2><p>Revisa lo que quedó pendiente para cada día.</p></div><label>Elegir fecha <input type="date" value={fecha || localToday} max={localToday} onChange={(event) => setFecha(event.target.value)} /></label></div>
      {loading && <p role="status">Cargando pendientes…</p>}
      {error && <p role="alert">{error}</p>}
      {data && <>
        <div className="progress-summary"><strong>{data.habitosCumplidos} / {data.habitosDebidos}</strong><span>hábitos cumplidos<br /><small>{data.cerrado ? 'Día cerrado' : 'Día en curso'}</small></span></div>
        {data.totalPendientes === 0 ? <p className="progress-empty">No hay pendientes para esta fecha.</p> :
          <ul className="progress-list">{[...data.habitos, ...data.misiones].map((item) => <li key={`${item.tipo}-${item.id}`}>
            <span className="progress-list__icon"><CatalogIcon icon={icons[item.area]} size={20} /></span><span><strong>{item.nombre}</strong><small>{item.tipo === 'HABITO' ? 'Hábito' : 'Misión'} · {areas[item.area] ?? item.area}</small></span>
          </li>)}</ul>}
      </>}
    </section>
  </LiteLayout>;
}
