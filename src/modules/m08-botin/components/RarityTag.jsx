import { rarityMeta } from '../hooks/botinFormat';

// Etiqueta con la rareza de un objeto (Común, Raro, Épico, Legendario, Carta)
export default function RarityTag({ rarity }) {
  const meta = rarityMeta(rarity);
  return (
    <span className="m08-rareza" style={{ borderColor: meta.color }}>
      {meta.label}
    </span>
  );
}
