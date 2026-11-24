import React from 'react';
import { PixelMascot } from '../../../../shared/components/PixelMascot';
import { demoMascot } from '../../../../shared/assets/demoParty';
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

export function SegmentedTabs({ items, value, onChange, ariaLabel, size }) {
  return <div className={`seg${size === 'sm' ? ' seg--sm' : ''}`} role="tablist" aria-label={ariaLabel}>
    {items.map((item) => <button key={item.value} type="button" role="tab" aria-selected={value === item.value}
      className={`seg__item${value === item.value ? ' is-active' : ''}`} onClick={() => onChange(item.value)}>{item.label}</button>)}
  </div>;
}

export default function LiteLayout({ children }) {
  return <div className="progreso-lite">{children}</div>;
}
