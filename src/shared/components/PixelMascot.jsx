import React, { useMemo } from 'react';
import { getAsset } from '../assets/registry';
import {
  ACC_TO_ASSET, DEFAULT_BACKGROUND, ITEM_ASSETS, LAYER_ORDER, SCENE_TO_ASSET,
  normalizeSpecies, petColorValue, petImageSrc, resolveAssetName, speciesLabel,
} from '../assets/mobilePets';
import './mascot.css';

/**
 * Mascota de Life-RPG con los mismos PNG de la app móvil (especie + prendas + fondo).
 * Mantiene la API que ya usaban todas las pantallas de la PWA.
 *
 * Props:
 * - pet | species: gato | perro | dragon | hamster | leon (PlayerProfile.mascota.especie). Por omisión, dragon.
 * - color: clave móvil ("morado") o hex; se dibuja como aura detrás de la mascota.
 * - mood: happy | focus | joy | weak. `weak` la apaga (como "Enfermo" en el móvil); `happy`/`joy` brincan.
 * - acc: accesorios del mockup ("beret glasses") o arreglo; se traducen a prendas móviles.
 * - equipped: prendas equipadas según el backend (claves `item.*`, nombres de asset o nombres visibles).
 * - scene: none | forest | gold-frame | home; se sobrescribe si hay un fondo equipado.
 * - width/height: tamaño CSS. `size` fija ambos.
 */
const NONE = [];

export function PixelMascot({ pet, species, color, mood = 'happy', acc = '', equipped = NONE, scene = 'none', size, width, height, label, className = '', style }) {
  const kind = normalizeSpecies(species ?? pet);
  const aura = petColorValue(color);

  const { layers, background, frame } = useMemo(() => {
    const names = [];
    const accs = Array.isArray(acc) ? acc : String(acc).split(/\s+/);
    for (const a of accs) if (ACC_TO_ASSET[a]) names.push(ACC_TO_ASSET[a]);
    let bg = scene === 'home' ? DEFAULT_BACKGROUND : SCENE_TO_ASSET[scene] ?? null;
    let gold = scene === 'gold-frame';
    for (const entry of equipped) {
      const fromRegistry = typeof entry === 'string' ? getAsset(entry) : null;
      if (fromRegistry?.scene === 'gold-frame') { gold = true; continue; }
      if (fromRegistry?.scene && SCENE_TO_ASSET[fromRegistry.scene]) { bg = SCENE_TO_ASSET[fromRegistry.scene]; continue; }
      const name = resolveAssetName(entry) ?? (fromRegistry?.acc ? ACC_TO_ASSET[fromRegistry.acc] : null);
      if (!name) continue;
      if (ITEM_ASSETS[name].category === 'Fondo') bg = name;
      else names.push(name);
    }
    const unique = [...new Set(names)].map((n) => ({ name: n, ...ITEM_ASSETS[n] }));
    unique.sort((a, b) => LAYER_ORDER[a.category] - LAYER_ORDER[b.category]);
    return { layers: unique, background: bg ? ITEM_ASSETS[bg] : null, frame: gold };
  }, [acc, equipped, scene]);

  const pic = petImageSrc(kind);
  const text = label ?? `Mascota ${speciesLabel(kind).toLowerCase()}`;
  const moodClass = mood === 'weak' ? 'pet--weak' : mood === 'happy' || mood === 'joy' ? 'pet--bounce' : '';

  return (
    <span
      className={`pet ${moodClass} ${frame ? 'pet--frame' : ''} ${className}`.trim()}
      role="img"
      aria-label={text}
      style={{ width: width ?? size ?? '100%', height: height ?? size ?? '100%', ...style }}
    >
      {background && <img className="pet__bg" src={background.url} alt="" draggable="false" />}
      <span className="pet__box">
        {aura && <span className="pet__aura" style={{ background: `radial-gradient(circle, ${aura}66 0%, ${aura}00 70%)` }} />}
        <span className="pet__body">
          <img className="pet__img" src={pic.src} srcSet={pic.srcSet} alt="" draggable="false" />
          {layers.map((l) => (
            <img
              key={l.name}
              className="pet__layer"
              src={l.url}
              alt=""
              draggable="false"
              style={{ left: `${(1 - l.width) * 50}%`, top: `${l.top * 100}%`, width: `${l.width * 100}%`, aspectRatio: String(l.aspect) }}
            />
          ))}
        </span>
      </span>
    </span>
  );
}

export default PixelMascot;
