import { useEffect, useState } from 'react';
import { getCompletionByPeriod, getDistributionByType } from '../api/diarioApi';
import { TYPES } from './diarioFormat';

// Hook de 9.3 Gráficas de actividades (RF030).

export const CHART_RANGES = [
  { key: 'semana', label: 'Semana', title: 'Últimos 7 días', sub: 'Actividades cumplidas por día' },
  { key: 'mes', label: 'Mes', title: 'Últimos 30 días', sub: 'Actividades cumplidas por día' },
  { key: 'anio', label: 'Año', title: 'Este año', sub: 'Actividades cumplidas por mes' },
];

// Porcentajes enteros que siempre suman 100 (método del residuo mayor)
const percents = (values) => {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const raw = values.map((v) => (v / total) * 100);
  const out = raw.map(Math.floor);
  raw
    .map((v, i) => [v - Math.floor(v), i])
    .sort((x, y) => y[0] - x[0])
    .slice(0, 100 - out.reduce((a, b) => a + b, 0))
    .forEach(([, i]) => { out[i] += 1; });
  return out;
};

// Tope del eje: múltiplo de 2 (o de 10 en la vista anual)
const axisMax = (max, step) => Math.max(step, Math.ceil(max / step) * step);

export function useGraficas() {
  const [range, setRange] = useState('semana');
  const [bars, setBars] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // RDF098: las dos gráficas se actualizan al cambiar el rango
  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getCompletionByPeriod(range), getDistributionByType(range)])
      .then(([b, t]) => {
        setBars(b);
        setTotals(t);
      })
      .catch(() => setError('No se pudieron cargar las gráficas.'))
      .finally(() => setLoading(false));
  }, [range]);

  // RDF096: barras apiladas por día o por mes
  const sums = bars.map((b) => TYPES.reduce((s, t) => s + b[t.key], 0));
  const yMax = axisMax(Math.max(0, ...sums), range === 'anio' ? 10 : 2);
  const columns = bars.map((b, i) => ({
    label: b.label,
    total: sums[i],
    height: (sums[i] / yMax) * 100,
    parts: TYPES.map((t) => ({ ...t, value: b[t.key] })),
  }));

  // RDF097: distribución por tipo con su porcentaje
  const values = TYPES.map((t) => totals?.[t.key] ?? 0);
  const pcts = percents(values);
  const dist = TYPES.map((t, i) => ({ ...t, value: values[i], pct: pcts[i] }));
  const total = values.reduce((a, b) => a + b, 0);
  const sorted = [...dist].sort((x, y) => y.value - x.value);

  return {
    range,
    setRange,
    rangeMeta: CHART_RANGES.find((r) => r.key === range),
    columns,
    yMax,
    dist,
    total,
    best: sorted[0],
    worst: sorted[sorted.length - 1],
    loading,
    error,
  };
}
