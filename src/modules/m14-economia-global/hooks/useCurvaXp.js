import { useEffect, useMemo, useState } from 'react';
import { getActiveEconomy, publishEconomy } from '../api/economiaApi';

// Hook de 14.1 Curva de experiencia (RF043).
// Maneja el borrador de la fórmula y lo compara con la versión activa.

export const MAX_LEVEL = 50;
export const MILESTONES = [5, 10, 20, 30, 40, 50];

// XP(n) = base × n^exponente — solo para la vista previa; el servidor es el que la aplica
export const xpForLevel = (base, exponent, level) => Math.round(base * level ** exponent);

const curve = (base, exponent) =>
  Array.from({ length: MAX_LEVEL }, (_, i) => xpForLevel(base, exponent, i + 1));

export function useCurvaXp() {
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    getActiveEconomy()
      .then((economy) => {
        setActive(economy);
        setDraft({ ...economy, difficultyPoints: { ...economy.difficultyPoints }, rewardPrice: { ...economy.rewardPrice } });
      })
      .catch(() => setError('No se pudo cargar la economía activa.'))
      .finally(() => setLoading(false));
  }, []);

  const update = (field, value) => {
    setNotice(null);
    setDraft((d) => ({ ...d, [field]: value }));
  };
  const updatePoints = (key, value) => {
    setNotice(null);
    setDraft((d) => ({ ...d, difficultyPoints: { ...d.difficultyPoints, [key]: value } }));
  };
  const updatePrice = (key, value) => {
    setNotice(null);
    setDraft((d) => ({ ...d, rewardPrice: { ...d.rewardPrice, [key]: value } }));
  };

  // Series de la gráfica: borrador vs versión activa
  const draftCurve = useMemo(() => (draft ? curve(draft.base, draft.exponent) : []), [draft]);
  const activeCurve = useMemo(() => (active ? curve(active.base, active.exponent) : []), [active]);

  // Tarjetas de niveles clave con el % de cambio contra la versión activa
  const milestones = useMemo(
    () =>
      MILESTONES.map((level) => {
        const xp = draftCurve[level - 1] ?? 0;
        const before = activeCurve[level - 1] ?? 0;
        const change = before ? Math.round(((xp - before) / before) * 100) : 0;
        return { level, xp, change };
      }),
    [draftCurve, activeCurve],
  );

  const hasChanges = useMemo(() => JSON.stringify(draft) !== JSON.stringify(active), [draft, active]);

  const publish = async () => {
    setSaving(true);
    setError(null);
    try {
      const published = await publishEconomy(draft);
      setActive(published);
      setDraft({ ...published, difficultyPoints: { ...published.difficultyPoints }, rewardPrice: { ...published.rewardPrice } });
      setNotice(`Publicada la versión v${published.version}. Aplica solo a partir de ahora.`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    active,
    draft,
    nextVersion: active ? active.version + 1 : null,
    draftCurve,
    activeCurve,
    milestones,
    hasChanges,
    update,
    updatePoints,
    updatePrice,
    publish,
    loading,
    saving,
    error,
    notice,
  };
}
