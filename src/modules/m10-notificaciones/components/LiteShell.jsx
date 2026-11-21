import React from 'react';
import { NavLink } from 'react-router-dom';
import './lite.css';

export function PixelAvatar({ src, alt = '', size = 40, tone = '#7b2cbf' }) {
  return (
    <span className="pixel-avatar" style={{ width: size, height: size, '--tone': tone }}>
      {src ? <img src={src} alt={alt} /> : <span className="pixel-avatar__ph" aria-hidden="true" />}
    </span>
  );
}

/** Tabs controladas para los filtros internos; las rutas las muestra AppLayout. */
export function SegmentedTabs({ items, value, onChange, ariaLabel, size }) {
  const cls = `seg${size === 'sm' ? ' seg--sm' : ''}`;
  const content = (item) => <>{item.label}{item.badge != null && <span className="badge">{item.badge}</span>}</>;

  if (items.some((item) => item.to)) {
    return <nav className={cls} aria-label={ariaLabel}>
      {items.map((item) => <NavLink key={item.to} to={item.to} end className={({ isActive }) => `seg__item${isActive ? ' is-active' : ''}`}>{content(item)}</NavLink>)}
    </nav>;
  }
  return <div className={cls} role="tablist" aria-label={ariaLabel}>
    {items.map((item) => <button key={item.value} type="button" role="tab" aria-selected={value === item.value}
      className={`seg__item${value === item.value ? ' is-active' : ''}`} onClick={() => onChange?.(item.value)}>{content(item)}</button>)}
  </div>;
}

export default function LiteLayout({ children }) {
  return <div className="lite">{children}</div>;
}
