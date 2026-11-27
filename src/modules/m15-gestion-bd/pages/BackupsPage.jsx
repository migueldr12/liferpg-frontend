import React, { useEffect, useState } from 'react';
import { http } from '../../../api/httpClient';
import { ActionButton, Surface } from '../../../shared/components/AdminUI';

const SECTIONS = [
  { id: 'profile', label: 'Perfil y vestidor' },
  { id: 'habits', label: 'Hábitos y registros' },
  { id: 'missions', label: 'Misiones y sesiones' },
  { id: 'inventory', label: 'Inventario' },
];

export function BackupsPage() {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sections, setSections] = useState(SECTIONS.map((section) => section.id));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    http('/admin/data/profiles').then((data) => { if (active) setProfiles(data); })
      .catch((cause) => { if (active) setError(cause.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const toggle = (id, set) => set((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  async function exportProfiles() {
    setBusy(true); setError('');
    try {
      const data = await http('/admin/data/exports', { method: 'POST', body: { userIds: selected, sections } });
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url; link.download = 'liferpg-perfiles.json'; document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (cause) { setError(cause.message); } finally { setBusy(false); }
  }
  return <div className="admin-columns admin-columns--backup">
    <Surface title="Exportar perfiles">
      {loading && <p role="status">Cargando perfiles…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !profiles.length && !error && <p>No hay perfiles disponibles.</p>}
      <fieldset><legend>Perfiles (hasta 20)</legend>{profiles.map((profile) => <label key={profile.id} style={{ display: 'block' }}>
        <input type="checkbox" checked={selected.includes(profile.id)} disabled={!selected.includes(profile.id) && selected.length >= 20} onChange={() => toggle(profile.id, setSelected)} /> {profile.displayName}{profile.profile?.alias ? ` · ${profile.profile.alias}` : ''}
      </label>)}</fieldset>
      <fieldset><legend>Contenido</legend>{SECTIONS.map((section) => <label key={section.id} style={{ display: 'block' }}>
        <input type="checkbox" checked={sections.includes(section.id)} onChange={() => toggle(section.id, setSections)} /> {section.label}
      </label>)}</fieldset>
      <ActionButton disabled={!selected.length || !sections.length || busy} onClick={exportProfiles}>{busy ? 'Exportando…' : 'Descargar JSON'}</ActionButton>
    </Surface>
    <Surface title="Respaldo restaurable"><p>La exportación de perfiles no es un respaldo de la base. El respaldo restaurable de MongoDB requiere configurar las herramientas y el almacenamiento del servidor.</p></Surface>
  </div>;
}
