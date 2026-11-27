import React, { useRef, useState } from 'react';
import { adminApiEnabled, adminRequest, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, Segmented, StateBadge, Surface } from '../../../shared/components/AdminUI';
import { applyDemoPurge, getDemoPurgeCount, purgeDemo } from '../api/demoData';

const numberFormat = new Intl.NumberFormat('es-MX');

export function PurgePage() {
  const { data, error, loading, refresh } = useAdminResource('data/purge', purgeDemo);
  const [days, setDays] = useState(90);
  const [selected, setSelected] = useState(['requests', 'audit']);
  const [confirmation, setConfirmation] = useState('');
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [purging, setPurging] = useState(false);
  const [actionError, setActionError] = useState('');
  const [message, setMessage] = useState('');
  const [, setDemoRevision] = useState(0);
  const requestSequence = useRef(0);
  const categories = data?.categories ?? [];
  const history = data?.history ?? [];
  const exampleCount = adminApiEnabled ? 0 : getDemoPurgeCount(days, selected);

  function resetPreview() { requestSequence.current += 1; setBusy(false); setPreview(null); setConfirmation(''); setMessage(''); setActionError(''); }
  function updateSelection(next) { setSelected(next); resetPreview(); }
  function updateDays(next) { setDays(next); resetPreview(); }

  async function getPreview() {
    setBusy(true);
    setActionError('');
    const requestId = ++requestSequence.current;
    try {
      const result = adminApiEnabled
        ? await adminRequest('data/purge/preview', { method: 'POST', body: JSON.stringify({ days, categories: selected }) })
        : await new Promise((resolve) => window.setTimeout(() => resolve({ count: getDemoPurgeCount(days, selected) }), 350));
      if (requestId === requestSequence.current) setPreview(result);
    } catch (cause) {
      if (requestId === requestSequence.current) setActionError(cause.message);
    } finally {
      if (requestId === requestSequence.current) setBusy(false);
    }
  }

  async function purge() {
    if (!preview || preview.count < 1 || confirmation !== 'PURGAR' || busy || purging) return;
    if (!window.confirm(`Esta acción eliminará ${numberFormat.format(preview.count)} registros. ¿Continuar?`)) return;
    setPurging(true);
    setActionError('');
    try {
      if (adminApiEnabled) await adminRequest('data/purge', { method: 'POST', body: JSON.stringify({ days, categories: selected, confirmation: 'PURGAR' }) });
      else { applyDemoPurge(days, selected); setDemoRevision((value) => value + 1); }
      setMessage('Purga completada. Revisa el registro de auditoría.');
      setConfirmation('');
      setPreview(null);
      if (adminApiEnabled) await refresh();
    } catch (cause) {
      setActionError(cause.message);
    } finally {
      setPurging(false);
    }
  }

  return <>
    <DemoNotice error={error} loading={loading} onRetry={adminApiEnabled ? refresh : undefined} />
    {actionError && <p className="admin-notice admin-notice--error" role="alert">{actionError}</p>}
    {message && <p className="admin-success" role="status">{message}</p>}
    <div className="admin-columns admin-columns--purge">
      <Surface title="Preparar la purga">
        <fieldset className="purge-criteria" disabled={purging}>
          <legend>Antigüedad de los registros</legend>
          <Segmented label="Antigüedad" options={[30, 90, 180].map((value) => ({ value, label: `${value} días` }))} value={days} onChange={updateDays} />
          <p className="admin-hint">Selecciona al menos un tipo de registro y calcula cuántos se eliminarían.</p>
          <div className="purge-categories">{categories.map((category) => { const count = category.counts?.[days] ?? category.count; return <label key={category.id} className={selected.includes(category.id) ? 'is-selected' : ''}><input type="checkbox" checked={selected.includes(category.id)} onChange={() => updateSelection(selected.includes(category.id) ? selected.filter((id) => id !== category.id) : [...selected, category.id])} /><span><strong>{category.label}</strong><small>{category.detail} · más de {days} días</small></span>{count != null && <b>{numberFormat.format(count)}</b>}</label>; })}</div>
        </fieldset>
        <div className="purge-confirm" aria-busy={busy || purging}>
          <div role="status">
            <strong>{preview ? `${numberFormat.format(preview.count)} registros` : 'Calcula el total'}</strong>
            <small>{preview ? preview.count ? 'Revisa el total. Para continuar, escribe PURGAR.' : 'No hay registros que coincidan con esos criterios.' : !selected.length ? 'Selecciona un tipo de registro.' : adminApiEnabled ? 'La vista previa no elimina registros.' : `Estimación de la demo: ${numberFormat.format(exampleCount)} registros.`}</small>
          </div>
          <div className="purge-confirm__actions"><ActionButton variant="secondary" disabled={!categories.length || !selected.length || busy || purging} onClick={getPreview}>{busy ? 'Calculando…' : 'Calcular vista previa'}</ActionButton>
            {preview?.count > 0 && <><label>Confirmación <input className="admin-input" autoComplete="off" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={purging} /></label><ActionButton variant="danger" disabled={confirmation !== 'PURGAR' || busy || purging} onClick={purge}>{purging ? 'Purgando…' : adminApiEnabled ? 'Purgar registros' : 'Simular purga'}</ActionButton></>}
          </div>
        </div>
      </Surface>
      <Surface title="Auditoría de purgas" subtitle="Quién, cuándo y cuántos registros"><div className="purge-history">{history.map((entry, index) => <div key={`${entry.owner}-${index}`}><strong>{entry.owner}</strong><time>{entry.date}</time><small>{entry.detail}</small><StateBadge tone="red">−{numberFormat.format(entry.count)}</StateBadge></div>)}{!history.length && <p className="admin-hint">No hay purgas registradas.</p>}</div></Surface>
    </div>
  </>;
}
