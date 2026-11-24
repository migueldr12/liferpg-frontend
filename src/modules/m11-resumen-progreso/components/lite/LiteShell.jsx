import React from 'react';
import './lite.css';

export function PixelAvatar({ src = '/icons/dragon.png', alt = '', size = 40, tone = '#7b2cbf', variant = 0 }) {
  return <span className={`pixel-avatar pixel-avatar--v${variant % 3}`} style={{ width: size, height: size, '--tone': tone }}>
    <img src={src} alt={alt} />
  </span>;
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
