import React from 'react';
import { ICON_PATHS, TONES, resolveIcon } from '../assets/registry';
import { PixelMascot } from './PixelMascot';

/** Icono de línea del registro (mismos paths que el mockup). */
export function LineIcon({ name, size = 20, strokeWidth = 2, className = '' }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/**
 * Dibujo de un objeto, sticker, categoría o área a partir de `catalogItem.icon` (clave del
 * registro). Con `tile` lo pone en el recuadro de color del mockup.
 * Si la clave no existe (datos viejos con emoji), muestra el texto tal cual.
 */
export function CatalogIcon({ icon, size = 20, tile = false, tileSize = 38, color, className = '' }) {
  const entry = resolveIcon(icon);
  if (!entry) return <span className={className} aria-hidden="true">{icon}</span>;

  if (entry.key.startsWith('sticker.')) {
    return <PixelMascot className={className} color={color} mood={entry.mood} acc={entry.acc} size={size} label={entry.name} />;
  }
  const glyph = <LineIcon name={entry.icon} size={size} strokeWidth={tile ? 2.4 : 2} />;
  if (!tile) return <span className={className} aria-hidden="true">{glyph}</span>;
  const tone = TONES[entry.tone] ?? TONES.bd;
  return (
    <span
      className={`catalog-tile ${className}`}
      aria-hidden="true"
      style={{ width: tileSize, height: tileSize, borderRadius: tileSize > 36 ? 12 : 9, background: tone.css, color: entry.tone === 'bd' ? 'var(--text)' : '#12172B' }}
    >
      {glyph}
    </span>
  );
}

export default CatalogIcon;
