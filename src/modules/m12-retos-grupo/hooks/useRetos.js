import { useEffect, useMemo, useState } from 'react';
import { createChallenge, getChallenges, getFriends, getInvitations, respondInvitation } from '../api/retosApi';

// Hook de 12.1 Tablero de retos grupales (RF037).

export const AREAS = [
  { key: 'cultura', label: 'Cultura', icon: '📖', color: 'var(--cultura)' },
  { key: 'fisico', label: 'Físico', icon: '🏋️', color: 'var(--fisico)' },
  { key: 'enfoque', label: 'Enfoque', icon: '🎯', color: 'var(--enfoque)' },
];
export const areaMeta = (key) => AREAS.find((a) => a.key === key) ?? AREAS[0];

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const daysLeft = (deadline) => {
  const [y, m, d] = deadline.split('-').map(Number);
  const end = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((end - today) / 86_400_000);
};

const closeText = (deadline) => {
  const left = daysLeft(deadline);
  if (left <= 0) return 'cierra hoy';
  if (left <= 14) return `cierra en ${left} días`;
  const [, m, d] = deadline.split('-').map(Number);
  return `cierra el ${d} ${MONTHS[m - 1]}`;
};

// Agrega a cada reto lo que la vista necesita ya calculado
const toView = (c) => {
  const total = c.participants.reduce((sum, p) => sum + p.amount, 0);
  return {
    ...c,
    total,
    percent: Math.min(100, Math.round((total / c.goal) * 100)),
    missing: Math.max(0, c.goal - total),
    closeText: closeText(c.deadline),
    max: Math.max(...c.participants.map((p) => p.amount), 1),
  };
};

const emptyForm = { title: '', type: 'enfoque', goal: 20, unit: 'sesiones', deadline: '', invited: [] };

export function useRetos() {
  const [challenges, setChallenges] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null); // null = formulario cerrado

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    Promise.all([getChallenges(), getInvitations(), getFriends()])
      .then(([list, invs, fr]) => {
        setChallenges(list);
        setInvitations(invs);
        setFriends(fr);
        setSelectedId(list[0]?.id ?? null);
      })
      .catch(() => setError('No se pudieron cargar los retos.'))
      .finally(() => setLoading(false));
  }, []);

  const views = useMemo(() => challenges.map(toView), [challenges]);
  const selected = views.find((c) => c.id === selectedId) ?? null;

  const respond = async (invitation, accept) => {
    setError(null);
    setNotice(null);
    try {
      const joined = await respondInvitation(invitation.id, accept);
      setInvitations((list) => list.filter((i) => i.id !== invitation.id));
      if (joined) {
        setChallenges((list) => [...list, joined]);
        setSelectedId(joined.id);
        setNotice(`Te uniste a "${joined.title}".`);
      } else {
        setNotice('Invitación rechazada.');
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const toggleInvited = (friendId) =>
    setForm((f) => ({
      ...f,
      invited: f.invited.includes(friendId) ? f.invited.filter((id) => id !== friendId) : [...f.invited, friendId],
    }));

  const saveForm = async () => {
    setError(null);
    setNotice(null);
    try {
      const created = await createChallenge({ ...form, goal: Number(form.goal) });
      setChallenges((list) => [...list, created]);
      setSelectedId(created.id);
      setForm(null);
      setNotice(`Reto creado. Se envió la invitación a ${form.invited.length} amigo(s).`);
    } catch (e) {
      setError(e.message);
    }
  };

  return {
    challenges: views,
    selected,
    setSelectedId,
    invitations,
    respond,
    friends,
    form,
    setForm,
    openForm: () => setForm({ ...emptyForm }),
    closeForm: () => setForm(null),
    toggleInvited,
    saveForm,
    loading,
    error,
    notice,
  };
}
