import React, { useState } from 'react';
import { adminApiEnabled, adminRequest, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, Segmented, StateBadge, Surface } from '../../../shared/components/AdminUI';
import { purgeDemo } from '../api/demoData';

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
  const categories = data?.categories ?? [];
  const history = data?.history ?? [];
  const exampleCount = categories.filter((category) => selected.includes(category.id)).reduce((total, category) => total + category.count, 0);

  function updateSelection(next) { setSelected(next); setPreview(null); setConfirmation(''); setMessage(''); }
  function updateDays(next) { setDays(next); setPreview(null); setConfirmation(''); setMessage(''); }

  async function getPreview() {
    setBusy(true);
    setActionError('');
    try {
      setPreview(await adminRequest('data/purge/preview', { method: 'POST', body: JSON.stringify({ days, categories: selected }) }));
    } catch (cause) {
      setActionError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  async function purge() {
    if (!window.confirm(`Esta acción eliminará ${numberFormat.format(preview.count)} registros. ¿Continuar?`)) return;
    setBusy(true);
    setActionError('');
    try {
      await adminRequest('data/purge', { method: 'POST', body: JSON.stringify({ days, categories: selected, confirmation: 'PURGAR' }) });
      setMessage('Purga completada. Revisa el registro de auditoría.');
      setConfirmation('');
      setPreview(null);
      await refresh();
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
        <div className="purge-categories">{categories.map((category) => <label key={category.id} className={selected.includes(category.id) ? 'is-selected' : ''}><input type="checkbox" checked={selected.includes(category.id)} onChange={() => updateSelection(selected.includes(category.id) ? selected.filter((id) => id !== category.id) : [...selected, category.id])} /><span><strong>{category.label}</strong><small>{category.detail}</small></span><b>{numberFormat.format(category.count)}</b></label>)}</div>
        <div className="purge-confirm"><div><strong>{numberFormat.format(preview?.count ?? exampleCount)}</strong><small>{preview ? 'Registros calculados por la API' : 'Registros ilustrativos · sin vista previa del servidor'}</small></div><div className="purge-confirm__actions">{adminApiEnabled && <ActionButton variant="secondary" disabled={!selected.length || busy} onClick={getPreview}>{busy ? 'Calculando…' : 'Vista previa'}</ActionButton>}<input className="admin-input" aria-label="Escribe PURGAR para confirmar" placeholder="ESCRIBE PURGAR" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={!preview} /><ActionButton variant="danger" disabled={!adminApiEnabled || !preview || confirmation !== 'PURGAR' || busy} onClick={purge}>Purgar</ActionButton></div></div>
      </Surface>
      <Surface title="Auditoría de purgas" subtitle="Quién, cuándo y cuántos registros"><div className="purge-history">{history.map((entry, index) => <div key={`${entry.owner}-${index}`}><strong>{entry.owner}</strong><time>{entry.date}</time><small>{entry.detail}</small><StateBadge tone="red">−{numberFormat.format(entry.count)}</StateBadge></div>)}{!history.length && <p className="admin-hint">No hay purgas registradas.</p>}</div></Surface>
    </div>
  </>;
}
