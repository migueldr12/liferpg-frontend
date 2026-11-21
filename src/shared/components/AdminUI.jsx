import React from 'react';
import { Icon } from './Icon';
import { adminApiEnabled } from '../../api/adminClient';

export function DemoNotice({ error, loading, onRetry }) {
  return (
    <div className={`admin-notice ${error ? 'admin-notice--error' : ''}`} role={error ? 'alert' : 'status'}>
      <Icon name={error ? 'shield' : 'spark'} size={17} />
      <span>{error || (adminApiEnabled ? loading ? 'Conectando con la API…' : 'Datos obtenidos del servidor' : 'Vista de demostración · el backend administrativo aún no dispone de endpoints')}</span>
      {error && onRetry && <button type="button" onClick={onRetry}>Reintentar</button>}
    </div>
  );
}

export function Surface({ title, subtitle, action, children, className = '' }) {
  return <section className={`admin-surface ${className}`}>
    {(title || action) && <header className="admin-surface__header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</header>}
    {children}
  </section>;
}

export function StatCard({ label, value, detail, tone }) {
  return <div className={`admin-stat ${tone ? `admin-stat--${tone}` : ''}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

export function Segmented({ label, options, value, onChange }) {
  return <div className="admin-segments" role="group" aria-label={label}>{options.map((option) => {
    const item = typeof option === 'string' ? { value: option, label: option } : option;
    return <button type="button" key={item.value} className={value === item.value ? 'is-active' : ''} aria-pressed={value === item.value} onClick={() => onChange(item.value)}>{item.label}</button>;
  })}</div>;
}

export function ActionButton({ children, variant = 'primary', ...props }) {
  return <button type="button" className={`admin-button admin-button--${variant}`} {...props}>{children}</button>;
}

export function StateBadge({ children, tone = 'neutral' }) {
  return <span className={`state-badge state-badge--${tone}`}>{children}</span>;
}

export function Meter({ value, tone = 'green' }) {
  return <span className={`admin-meter admin-meter--${tone}`} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></span>;
}
