import React, { useEffect, useState } from 'react';
import { adminApiEnabled, adminRequest, useAdminResource } from '../../../api/adminClient';
import { ActionButton, DemoNotice, Segmented, StateBadge, Surface } from '../../../shared/components/AdminUI';
import { backupsDemo } from '../api/demoData';

const profiles = ['@valeria', '@ana.t', '@diego.r', '@lu.gomez', '@bruno.p', '@mateo'];
const sections = ['Datos', 'Hábitos', 'Misiones', 'Inventario'];

export function BackupsPage() {
  const { data, error, loading, refresh } = useAdminResource('data/backups', backupsDemo);
  const [scope, setScope] = useState('Un perfil');
  const [profile, setProfile] = useState(profiles[0]);
  const [included, setIncluded] = useState(sections);
  const [format, setFormat] = useState('JSON');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [message, setMessage] = useState('');
  const [demoBackups, setDemoBackups] = useState(backupsDemo);
  const [progress, setProgress] = useState(0);
  const backups = adminApiEnabled ? (Array.isArray(data) ? data : []) : demoBackups;

  useEffect(() => {
    if (adminApiEnabled && Array.isArray(data)) setDemoBackups(data);
  }, [data]);

  function toggleSection(section) {
    setIncluded((previous) => previous.includes(section) ? previous.filter((value) => value !== section) : [...previous, section]);
  }

  async function createBackup() {
    setBusy(true);
    setActionError('');
    setMessage('');
    try {
      if (adminApiEnabled) {
        await adminRequest('data/backups', { method: 'POST', body: JSON.stringify({ scope: scope === 'Todos' ? 'all' : 'profile', profile: scope === 'Todos' ? null : profile, sections: included, format: format.toLowerCase() }) });
        await refresh();
      } else {
        setProgress(8);
        for (const value of [24, 47, 73, 100]) {
          await new Promise((resolve) => window.setTimeout(resolve, 220));
          setProgress(value);
        }
        const created = { id: `demo-${Date.now()}`, profile: scope === 'Todos' ? 'Todos (1 248 perfiles)' : profile, date: 'ahora', owner: 'admin.gm', format, size: scope === 'Todos' ? '401 MB' : format === 'JSON' ? '1.0 MB' : '0.7 MB' };
        setDemoBackups((rows) => [created, ...rows]);
      }
      setMessage('Respaldo generado correctamente. Ya está disponible para descargar.');
    } catch (cause) {
      setActionError(cause.message);
    } finally {
      setBusy(false);
      window.setTimeout(() => setProgress(0), 700);
    }
  }

  async function downloadBackup(id) {
    setActionError('');
    try {
      if (!adminApiEnabled) {
        const backup = demoBackups.find((item) => item.id === id);
        const content = backup?.format === 'CSV' ? 'perfil,fecha,responsable\n' + `${backup.profile},${backup.date},${backup.owner}\n` : JSON.stringify({ backup, sections: included }, null, 2);
        const blobUrl = URL.createObjectURL(new Blob([content], { type: backup?.format === 'CSV' ? 'text/csv' : 'application/json' }));
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = `respaldo-${id}.${backup?.format === 'CSV' ? 'csv' : 'json'}`;
        anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        return;
      }
      const url = `${(import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')}/admin/data/backups/${encodeURIComponent(id)}/download`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error(`No se pudo descargar el respaldo (${response.status}).`);
      const blobUrl = URL.createObjectURL(await response.blob());
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = `respaldo-${id}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (cause) {
      setActionError(cause.message);
    }
  }

  return <>
    <DemoNotice error={error || actionError} loading={loading} onRetry={refresh} />
    {message && <p className="admin-success" role="status">{message}</p>}
    <div className="admin-columns admin-columns--backup">
      <Surface title="Generar respaldo" className="backup-form">
        <label className="admin-label">ALCANCE</label><Segmented label="Alcance del respaldo" options={['Un perfil', 'Todos']} value={scope} onChange={setScope} />
        {scope === 'Un perfil' && <><p className="admin-label">PERFIL</p><div className="admin-chips admin-chips--select">{profiles.map((item) => <button type="button" key={item} className={profile === item ? 'is-selected' : ''} aria-pressed={profile === item} onClick={() => setProfile(item)}>{item}</button>)}</div></>}
        <p className="admin-label">CONTENIDO</p><div className="backup-sections">{sections.map((section) => <label key={section}><input type="checkbox" checked={included.includes(section)} onChange={() => toggleSection(section)} /> {section}</label>)}</div>
        <p className="admin-label">FORMATO</p><Segmented label="Formato de respaldo" options={['JSON', 'CSV']} value={format} onChange={setFormat} />
         {busy && <div className="backup-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /> <b>{progress} %</b></div>}
         <ActionButton disabled={!included.length || busy} onClick={createBackup}>{busy ? 'Generando respaldo…' : `Generar respaldo ${format}`}</ActionButton>
      </Surface>
      <Surface title="Historial de respaldos"><div className="admin-table-wrap"><table className="admin-table admin-table--cards"><thead><tr><th>PERFIL</th><th>FECHA</th><th>RESPONSABLE</th><th>TIPO</th><th>TAMAÑO</th><th><span className="sr-only">Descarga</span></th></tr></thead><tbody>{backups.map((backup) => <tr key={backup.id}><td data-label="PERFIL"><strong>{backup.profile}</strong></td><td data-label="FECHA">{backup.date}</td><td data-label="RESPONSABLE">{backup.owner}</td><td data-label="TIPO"><StateBadge tone={backup.format === 'JSON' ? 'purple' : 'cyan'}>{backup.format}</StateBadge></td><td data-label="TAMAÑO">{backup.size}</td><td data-label="ACCIÓN"><ActionButton variant="secondary" onClick={() => downloadBackup(backup.id)}>Descargar</ActionButton></td></tr>)}{!backups.length && <tr><td colSpan={6} className="admin-table__empty">No hay respaldos registrados.</td></tr>}</tbody></table></div></Surface>
    </div>
  </>;
}
