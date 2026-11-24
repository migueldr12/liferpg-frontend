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
  const [actionError, setActionError] = useState('');
  const [message, setMessage] = useState('');
  const [, setDemoRevision] = useState(0);
  const requestSequence = useRef(0);
  const categories = data?.categories ?? [];
  const history = data?.history ?? [];
  const exampleCount = adminApiEnabled ? 0 : getDemoPurgeCount(days, selected);

  function resetPreview() { requestSequence.current += 1; setBusy(false); setPreview(null); setConfirmation(''); setMessage(''); }
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
    if (!window.confirm(`Esta acción eliminará ${numberFormat.format(preview.count)} registros. ¿Continuar?`)) return;
    setBusy(true);
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
      setBusy(false);
    }
  }

  return <>
    <DemoNotice error={error || actionError} loading={loading} onRetry={refresh} />
    {message && <p className="admin-success" role="status">{message}</p>}
    <div className="admin-columns admin-columns--purge">
      <Surface title="Eliminar registros anteriores a" action={<Segmented label="Antigüedad" options={[30, 90, 180].map((value) => ({ value, label: `${value} días` }))} value={days} onChange={updateDays} />}>
        <p className="admin-hint">Selecciona qué registros incluir. El servidor calculará la fecha de corte y el total antes de permitir la purga.</p>
        <div className="purge-categories">{categories.map((category) => { const count = category.counts?.[days] ?? category.count ?? 0; return <label key={category.id} className={selected.includes(category.id) ? 'is-selected' : ''}><input type="checkbox" checked={selected.includes(category.id)} onChange={() => updateSelection(selected.includes(category.id) ? selected.filter((id) => id !== category.id) : [...selected, category.id])} /><span><strong>{category.label}</strong><small>{category.detail} · más de {days} días</small></span><b>{numberFormat.format(count)}</b></label>; })}</div>
        <div className="purge-confirm"><div><strong>{numberFormat.format(preview?.count ?? exampleCount)}</strong><small>{preview ? 'Vista previa confirmada para estos criterios' : `Estimación exacta del demo · corte de ${days} días`}</small></div><div className="purge-confirm__actions"><ActionButton variant="secondary" disabled={!selected.length || busy} onClick={getPreview}>{busy ? 'Calculando…' : 'Vista previa'}</ActionButton><input className="admin-input" aria-label="Escribe PURGAR para confirmar" placeholder="ESCRIBE PURGAR" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={!preview} /><ActionButton variant="danger" disabled={!preview || confirmation !== 'PURGAR' || busy} onClick={purge}>Purgar</ActionButton></div></div>
      </Surface>
      <Surface title="Auditoría de purgas" subtitle="Quién, cuándo y cuántos registros"><div className="purge-history">{history.map((entry, index) => <div key={`${entry.owner}-${index}`}><strong>{entry.owner}</strong><time>{entry.date}</time><small>{entry.detail}</small><StateBadge tone="red">−{numberFormat.format(entry.count)}</StateBadge></div>)}{!history.length && <p className="admin-hint">No hay purgas registradas.</p>}</div></Surface>
    </div>
  </>;
}
