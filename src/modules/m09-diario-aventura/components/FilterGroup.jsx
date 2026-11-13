// Grupo de filtro con título y opciones tipo pestaña. `null` significa "Todo".
export default function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="m09-filtro">
      <span className="m09-label">{label}</span>
      <div className="m09-tabs chicas" role="group" aria-label={label}>
        {options.map((o) => (
          <button key={o.label} type="button" aria-pressed={value === o.key}
            className={value === o.key ? 'm09-tab activo' : 'm09-tab'} onClick={() => onChange(o.key)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
