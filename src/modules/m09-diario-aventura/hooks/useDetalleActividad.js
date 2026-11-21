import { useEffect, useState } from 'react';
import { addNote, deleteNote, getActivity, updateNote } from '../api/diarioApi';
import { formatDay, formatStamp, formatTime, originLabel, typeMeta } from './diarioFormat';

// Hook de 9.2 Estado de actividad (RF029): detalle, recorrido y notas de seguimiento.

// La última actividad abierta, para que la pestaña "Detalle" regrese a ella
let lastViewedId = 'a-5';
export const getLastViewedId = () => lastViewedId;

const VALIDATIONS = {
  bloqueo: { label: 'Bloqueo', banner: 'Verificada con modo concentración', icon: '🔒', tone: 'enfoque' },
  smartwatch: { label: 'Smartwatch', banner: 'Validada con smartwatch · Health Connect', icon: '⌚', tone: 'fisico' },
  manual: { label: 'Manual', banner: 'Validada manualmente: no hay dispositivo', icon: '✅', tone: 'cultura' },
};

// El cuarto dato depende del origen: las misiones no tienen dificultad (RDF037),
// los hábitos sí (RDF027) y las sesiones siempre son con bloqueo.
const fourthField = (a) => {
  if (a.origin === 'mision') return { label: 'Validación', value: a.status === 'fallida' ? '—' : VALIDATIONS[a.validation].label };
  if (a.origin === 'habito') return { label: 'Dificultad', value: a.difficulty };
  return { label: 'Bloqueo', value: 'Sí' };
};

// Aviso del pie del panel según el resultado
const bannerOf = (a) => {
  if (a.status === 'fallida') {
    return a.origin === 'habito'
      ? { text: 'No se cumplió: se aplicó la penalización del hábito', icon: '✖', tone: 'mal' }
      : { text: 'Sin puntos: la misión terminó como fallida', icon: '✖', tone: 'mal' };
  }
  if (a.status === 'pendiente') return { text: 'Aún puedes hacer check-in hoy', icon: '⏳', tone: 'pendiente' };
  if (a.origin === 'mision') return VALIDATIONS[a.validation] && { text: VALIDATIONS[a.validation].banner, icon: VALIDATIONS[a.validation].icon, tone: VALIDATIONS[a.validation].tone };
  if (a.origin === 'habito') return { text: 'Registrado con check-in diario', icon: '✅', tone: 'bien' };
  return { text: 'Sesión de enfoque con el celular bloqueado', icon: '🔒', tone: 'enfoque' };
};

const STATUS_TEXT = { hecha: 'completada', pendiente: 'pendiente', fallida: 'fallida' };

export function useDetalleActividad(id) {
  const [activity, setActivity] = useState(null);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(null); // { id, text } de la nota en edición
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // RDF093: detalle de la actividad elegida en el listado
  useEffect(() => {
    lastViewedId = id;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setEditing(null);
    setDraft('');
    getActivity(id)
      .then(setActivity)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const setNotes = (fn) => setActivity((a) => ({ ...a, notes: fn(a.notes) }));

  // RDF094: agregar una nota con fecha
  const add = async () => {
    setError(null);
    try {
      const note = await addNote(id, draft);
      setNotes((list) => [note, ...list]);
      setDraft('');
    } catch (e) {
      setError(e.message);
    }
  };

  // RDF095: editar o eliminar una nota
  const save = async () => {
    setError(null);
    try {
      const note = await updateNote(id, editing.id, editing.text);
      setNotes((list) => list.map((n) => (n.id === note.id ? note : n)));
      setEditing(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (noteId) => {
    setError(null);
    await deleteNote(id, noteId);
    setNotes((list) => list.filter((n) => n.id !== noteId));
    if (editing?.id === noteId) setEditing(null);
  };

  const a = activity;
  const view = a && {
    ...a,
    meta: typeMeta(a.type),
    subtitle: `${originLabel(a.origin)} de ${typeMeta(a.type).label.toLowerCase()} · ${STATUS_TEXT[a.status]} ${formatDay(a.at).toLowerCase()}${a.status === 'pendiente' ? '' : ` ${formatTime(a.at)}`}`,
    fourth: fourthField(a),
    banner: bannerOf(a),
    timeline: a.timeline.map((t) => ({ ...t, when: t.at ? formatStamp(t.at) : '' })),
    notes: a.notes.map((n) => ({ ...n, when: formatStamp(n.at) + (n.edited ? ' · editada' : '') })),
  };

  return {
    activity: view,
    draft,
    setDraft,
    add,
    editing,
    startEdit: (note) => setEditing({ id: note.id, text: note.text }),
    setEditText: (text) => setEditing((e) => ({ ...e, text })),
    cancelEdit: () => setEditing(null),
    save,
    remove,
    loading,
    error,
    notFound,
  };
}
