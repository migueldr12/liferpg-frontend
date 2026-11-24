import React from 'react';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { demoMascot } from '../../../shared/assets/demoParty';
import { NavLink } from 'react-router-dom';
import './lite.css';

export function PixelAvatar({ size = 40, name, color, tone, mood, acc, scene = 'none', bg, label, className = '' }) {
  const base = name ? demoMascot(name) : null;
  return (
    <span className={`pixel-avatar ${className}`} style={{ width: size, height: size, background: bg }}>
      <PixelMascot
        color={color ?? base?.color ?? tone}
        mood={mood ?? base?.mood ?? 'happy'}
        acc={acc ?? base?.acc ?? ''}
        scene={scene}
        width={scene === 'none' ? '86%' : '100%'}
        height={scene === 'none' ? '82%' : '100%'}
        label={label}
      />
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
