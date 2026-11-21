import { originLabel, statusLabel, typeMeta } from '../hooks/diarioFormat';

// Etiquetas de una actividad: tipo, origen y estado

export function TypeTag({ type }) {
  const meta = typeMeta(type);
  return <span className="m09-tag" style={{ borderColor: meta.color }}>{meta.label}</span>;
}

export function OriginTag({ origin }) {
  return <span className={`m09-tag origen-${origin}`}>{originLabel(origin)}</span>;
}

export function StatusTag({ status }) {
  return <span className={`m09-tag estado-${status}`}>{statusLabel(status)}</span>;
}
