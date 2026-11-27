import React, { useState } from 'react';
import { http } from '../../../api/httpClient';
import LiteLayout from '../components/LiteShell';
import { useNotificationsResource } from '../hooks/useNotificationsResource';
import { CatalogIcon } from '../../../shared/components/CatalogIcon';
import { DispatchReceipt } from '../../../shared/components/DispatchReceipt';
import { Link } from 'react-router-dom';

export default function AnimoStickersPage() {
  const catalog = useNotificationsResource('/notificaciones/stickers/catalogo');
  const party = useNotificationsResource('/visualizador-usuarios/party');
  const [sticker, setSticker] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null);
  const [busy, setBusy] = useState(false);
  const toggle = (id) => setRecipients((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  async function send() {
    const selected = catalog.data?.flatMap((group) => group.stickers).find((item) => item.id === sticker);
    if (!selected || !recipients.length || busy) return;
    const names = party.data.amigos.filter((friend) => recipients.includes(friend.id)).map((friend) => friend.nombre);
    setBusy(true); setError(''); setSent(null);
    try {
      await http('/notificaciones/stickers', { method: 'POST', body: { catalogItemId: sticker, recipientIds: recipients } });
      setSent({ sticker: selected, names }); setRecipients([]);
    } catch (cause) { setError(cause.message); } finally { setBusy(false); }
  }
  return <LiteLayout><section className="panel sticker-composer">
    <h2>Enviar ánimo</h2>
    <p className="sticker-composer__intro">Elige un sticker y compártelo con tus amigos.</p>
    {(catalog.loading || party.loading) && <p role="status">Cargando stickers y amigos…</p>}
    {(catalog.error || party.error || error) && <p role="alert">{catalog.error || party.error || error}</p>}
    {catalog.data && <fieldset className="sticker-composer__field" disabled={busy}><legend>1. Elige un sticker</legend>
      {catalog.data.map((group) => <div key={group.category.id} className="sticker-group"><h3>{group.category.name}</h3><div className="sticker-grid">{group.stickers.map((item) => <button key={item.id} type="button" aria-pressed={sticker === item.id} className={`sticker-choice${sticker === item.id ? ' is-selected' : ''}`} onClick={() => { setSticker(item.id); setSent(null); }}><span aria-hidden="true"><CatalogIcon icon={item.icon} size={56} /></span><span>{item.name}</span></button>)}</div></div>)}
      {!catalog.data.length && <p>No hay stickers disponibles.</p>}</fieldset>}
    {party.data && <fieldset className="sticker-composer__field" disabled={busy}><legend>2. Elige a quién enviar</legend>{party.data.amigos.length ? <div className="sticker-recipients">{party.data.amigos.map((friend) => <label key={friend.id}>
      <input type="checkbox" checked={recipients.includes(friend.id)} onChange={() => { toggle(friend.id); setSent(null); }} /> <span>{friend.nombre}</span>
    </label>)}</div> : <p>No tienes amigos disponibles. <Link to="/lite/amigos/codigos">Añadir amigos</Link></p>}</fieldset>}
    {!sent && <p className="sticker-composer__hint">{!sticker ? 'Elige un sticker para continuar.' : !recipients.length ? 'Elige al menos un amigo para enviarlo.' : `Se enviará a ${recipients.length} ${recipients.length === 1 ? 'amigo' : 'amigos'}.`}</p>}
    <button className="btn" type="button" disabled={!sticker || !recipients.length || busy} onClick={send}>{busy ? 'Enviando…' : 'Enviar sticker'}</button>
    {sent && <DispatchReceipt tone="sticker" title="Ánimo enviado" art={<CatalogIcon icon={sent.sticker.icon} size={35} />} action={<Link to="/lite/animo/historial">Ver historial de ánimo</Link>}>
      Enviaste <b>«{sent.sticker.name}»</b> a <b>{new Intl.ListFormat('es', { type: 'conjunction' }).format(sent.names)}</b>.
    </DispatchReceipt>}
  </section></LiteLayout>;
}
