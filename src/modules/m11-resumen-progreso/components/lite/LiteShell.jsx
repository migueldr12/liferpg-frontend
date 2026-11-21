import React from 'react';
import './lite.css';

export function PixelAvatar({ src, alt = '', size = 40, tone = '#7b2cbf' }) {
  return <span className="pixel-avatar" style={{ width: size, height: size, '--tone': tone }}>
    {src ? <img src={src} alt={alt} /> : <span className="pixel-avatar__ph" aria-hidden="true" />}
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
