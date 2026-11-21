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

export function usePush() {
  const [audience, setAudience] = useState(0);
  const [history, setHistory] = useState([]);

  const [targetKind, setTargetKind] = useState('todos');
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

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
    message.trim().length > 0 &&
    (targetKind === 'todos' || username.trim().length > 0);

  const send = async () => {
    setSending(true);
    setError(null);
    setNotice(null);
    try {
      const target = targetKind === 'todos' ? { kind: 'todos' } : { kind: 'usuario', username };
      const sent = await sendPush({ title, message, target });
      setHistory((list) => [sent, ...list]);
      setTitle('');
      setMessage('');
      setNotice(`Aviso enviado a ${sent.recipients.toLocaleString('es-MX')} destinatario(s).`);
    } catch (e) {
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
    statusText: p.status === 'fallido' ? `Fallido ${p.deliveredPct} %` : `Entregado ${p.deliveredPct} %`,
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
