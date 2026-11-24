import React, { useMemo } from 'react';
import { renderDragon } from '../pixel/dragon';
import { getAsset } from '../assets/registry';

/**
 * Mascota "Mochi" dibujada en línea, idéntica al mockup.
 *
 * Props:
 * - color: hex del cuerpo (PlayerProfile.mascotColor). Sin él hereda `--pu` del tema (Morado dragón).
 * - mood: happy | focus | joy | weak (se deriva del estado; no se guarda).
 * - acc: accesorios ("beret glasses") o arreglo.
 * - equipped: claves de objetos equipados según el backend (p. ej. ['item.boina-pintor']);
 *   se traducen a accesorios y escena con el registro.
 * - scene: none | forest | gold-frame (se sobrescribe si un objeto BACKGROUND está equipado).
 * - width/height: tamaño CSS. `size` fija ambos.
 */
const NONE = [];

export function PixelMascot({ color, mood = 'happy', acc = '', equipped = NONE, scene = 'none', size, width, height, label, className = '', style }) {
  const drawing = useMemo(() => {
    const accs = (Array.isArray(acc) ? acc : String(acc).split(/\s+/)).filter(Boolean);
    let finalScene = scene;
    for (const key of equipped) {
      const item = getAsset(key);
      if (item?.acc) accs.push(item.acc);
      if (item?.scene) finalScene = item.scene;
    }
    return renderDragon({ mood, acc: accs, scene: finalScene });
  }, [mood, acc, equipped, scene]);

  return (
    <svg
      className={className}
      viewBox={drawing.viewBox}
      preserveAspectRatio={drawing.preserveAspectRatio}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label ?? drawing.label}
      style={{ display: 'block', width: width ?? size ?? '100%', height: height ?? size ?? '100%', ...(color ? { '--pu': color } : null), ...style }}
    >
      {drawing.rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} style={{ fill: r.fill }} />)}
    </svg>
  );
}

export default PixelMascot;
