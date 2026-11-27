import React, { useState } from 'react';
import LiteLayout from '../../components/lite/LiteShell';
import { useProgressResource } from '../../hooks/useProgressResource';

export default function ProgresoDiasRojosPage() {
  const [umbral, setUmbral] = useState(50);
  const { data, loading, error } = useProgressResource(`dias-baja-actividad?umbral=${umbral}`);
  return <LiteLayout><section className="panel progress-page">
    <h2>Tu actividad por día</h2><p>Consulta los días en los que completaste menos hábitos. Cada día es una nueva oportunidad.</p>
    <label>Mostrar días con menos de <select value={umbral} onChange={(event) => setUmbral(Number(event.target.value))}>
      {[25, 50, 75].map((value) => <option key={value} value={value}>{value} %</option>)}
    </select> de hábitos cumplidos</label>
    {loading && <p role="status">Cargando días de baja actividad…</p>}
    {error && <p role="alert">{error}</p>}
    {data && <><p>Del {data.desde} al {data.hasta}: {data.total} días por debajo de {data.umbral} %.</p>
      {data.dias.length === 0 ? <p>No hay días de baja actividad en este periodo.</p> :
        <ul className="progress-list">{data.dias.map((day) => <li key={day.fecha}><span><strong>{day.fecha}</strong><small>{day.habitosCumplidos} de {day.habitosDebidos} hábitos cumplidos</small></span><b>{day.tasaCumplimiento} %</b></li>)}</ul>}
    </>}
  </section></LiteLayout>;
}
