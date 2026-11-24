import { useEffect, useState } from 'react';
import { getAudienceSize, getPushHistory, sendPush } from '../api/economiaApi';

// Hook de 14.3 Disparador push (RF045).

export const TITLE_MAX = 50;
export const MESSAGE_MAX = 160;

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const pad = (n) => String(n).padStart(2, '0');

const formatWhen = (iso) => {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// "en_cola": guardado en el servidor, sin enviar porque no tiene las llaves de Firebase
const statusText = (p) => {
  if (p.status === 'enviando') return 'Enviando…';
  if (p.status === 'en_cola') return 'En cola';
  return `${p.status === 'fallido' ? 'Fallido' : 'Entregado'} ${p.deliveredPct ?? 0} %`;
};

export function usePush() {
  const [audience, setAudience] = useState(0);
  const [history, setHistory] = useState([]);

  const [targetKind, setTargetKind] = useState('todos');
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('¡Semana de rachas!');
  const [message, setMessage] = useState('Esta semana cada check-in da +10 % de XP. Tu dragón te espera.');

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    Promise.all([getAudienceSize(), getPushHistory()])
      .then(([size, list]) => {
        setAudience(size);
        setHistory(list);
      })
      .catch(() => setError('No se pudo cargar el historial de envíos.'))
      .finally(() => setLoading(false));
  }, []);

  const recipientsText =
    targetKind === 'todos'
      ? `Enviar a ${audience.toLocaleString('es-MX')} usuarios`
      : `Enviar a @${username.replace(/^@/, '') || '…'}`;

  const canSend =
    !sending &&
    title.trim().length > 0 &&
    title.length <= TITLE_MAX &&
    message.trim().length > 0 &&
    message.length <= MESSAGE_MAX &&
    (targetKind === 'todos' || username.trim().length > 0);

  const send = async () => {
    const target = targetKind === 'todos' ? { kind: 'todos' } : { kind: 'usuario', username: username.replace(/^@/, '') };
    const pendingId = `sending-${Date.now()}`;
    const pending = { id: pendingId, title: title.trim(), message: message.trim(), target, recipients: targetKind === 'todos' ? audience : 1, sentAt: new Date().toISOString(), status: 'enviando' };
    setSending(true);
    setError(null);
    setNotice(null);
    setHistory((list) => [pending, ...list]);
    try {
      const sent = await sendPush({ title, message, target });
      setHistory((list) => list.map((item) => item.id === pendingId ? sent : item));
      setNotice(
        sent.status === 'en_cola'
          ? 'Aviso guardado en cola: el servidor aún no tiene configurado Firebase.'
          : `Aviso enviado a ${sent.recipients.toLocaleString('es-MX')} destinatario(s).`,
      );
    } catch (e) {
      setHistory((list) => list.filter((item) => item.id !== pendingId));
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  // Filas del historial ya formateadas para la vista
  const rows = history.map((p) => ({
    ...p,
    whenText: formatWhen(p.sentAt),
    targetText: p.target.kind === 'todos' ? `Todos · ${p.recipients.toLocaleString('es-MX')}` : `@${p.target.username}`,
    statusText: statusText(p),
  }));

  return {
    targetKind,
    setTargetKind,
    username,
    setUsername,
    title,
    setTitle,
    message,
    setMessage,
    recipientsText,
    canSend,
    send,
    rows,
    loading,
    sending,
    error,
    notice,
  };
}
