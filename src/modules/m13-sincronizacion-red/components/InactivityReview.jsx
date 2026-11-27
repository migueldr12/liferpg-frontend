import React, { useState } from 'react';
import { http } from '../../../api/httpClient';
import { ActionButton, Surface } from '../../../shared/components/AdminUI';

export function InactivityReview() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function run(dryRun) {
    setBusy(true); setError('');
    try {
      const response = await http('/notificaciones/inactividad/ejecutar', { method: 'POST', body: { dryRun } });
      if (dryRun) { setPreview(response); setResult(null); }
      else { setResult(response); setPreview(null); }
    } catch (cause) { setError(cause.message); } finally { setBusy(false); }
  }

  return <Surface title="Revisión de inactividad">
    <p>Calcula los avisos pendientes y, al ejecutar la revisión, intenta enviar notificaciones push a los dispositivos configurados.</p>
    {error && <p role="alert">{error}</p>}
    {preview && <p role="status">Vista previa: {preview.evaluated} usuarios evaluados; {preview.wouldCreate.length} avisos nuevos. Los datos se recalculan al ejecutar.</p>}
    {result && <p role="status">Revisión completada: {result.created.length} avisos nuevos, {result.resolved} cerrados y {result.notifications.ownDevicesNotified + result.notifications.friendDevicesNotified} notificaciones enviadas a dispositivos.</p>}
    <ActionButton variant="secondary" disabled={busy} onClick={() => run(true)}>Vista previa</ActionButton>{' '}
    <ActionButton disabled={busy || !preview} onClick={() => run(false)}>{busy ? 'Procesando…' : 'Ejecutar revisión'}</ActionButton>
  </Surface>;
}
