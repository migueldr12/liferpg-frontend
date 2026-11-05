import { useEffect, useState } from 'react';
import { getFriendChest, getFriends, getRequests, requestGift, respondRequest } from '../api/botinApi';
import { formatAgo } from './botinFormat';

// Hook de 8.2 Solicitudes de regalo (RF025): bandeja de lo que te piden y pedidos propios.

export const REQUEST_STATUS = {
  pendiente: 'Pendiente',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
};

// Si se puede aceptar una solicitud según lo que hay en tu cofre (RDF089)
const blockReason = (owned) => {
  if (!owned) return 'No tienes ese objeto';
  if (owned.exclusive) return 'Es exclusivo, no se puede regalar';
  if (owned.equipped) return 'Lo tienes equipado';
  if (owned.qty === 0) return 'Ya no te quedan';
  return null;
};

export function useSolicitudes() {
  const [inbox, setInbox] = useState([]);
  const [mine, setMine] = useState([]);
  const [chest, setChest] = useState([]);
  const [friends, setFriends] = useState([]);

  const [askFriendId, setAskFriendId] = useState(null);
  const [friendChest, setFriendChest] = useState([]);
  const [askItemId, setAskItemId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    Promise.all([getRequests(), getFriends()])
      .then(([data, fr]) => {
        setInbox(data.inbox);
        setMine(data.mine);
        setChest(data.chest);
        setFriends(fr);
        setAskFriendId(fr[0]?.id ?? null);
      })
      .catch(() => setError('No se pudieron cargar las solicitudes.'))
      .finally(() => setLoading(false));
  }, []);

  // RDF083: al cambiar de amigo se carga su cofre
  useEffect(() => {
    if (!askFriendId) return;
    getFriendChest(askFriendId)
      .then((items) => {
        setFriendChest(items);
        setAskItemId(items[0]?.id ?? null);
      })
      .catch(() => setError('No se pudo cargar el cofre de tu amigo.'));
  }, [askFriendId]);

  // RDF084: bandeja con el estado de cada solicitud
  const requests = inbox.map((r) => {
    const owned = chest.find((c) => c.id === r.itemId);
    const reason = blockReason(owned);
    return {
      ...r,
      when: formatAgo(r.at),
      blocked: !!reason,
      note: reason ?? (owned.qty < 0 ? 'Ilimitado' : `Te quedan ${owned.qty}`),
    };
  });

  // RDF085: aceptar envía el regalo; rechazar solo cierra la solicitud
  const respond = async (request, accept) => {
    setError(null);
    setNotice(null);
    try {
      const res = await respondRequest(request.id, accept);
      setInbox((list) => list.map((r) => (r.id === request.id ? res.request : r)));
      setChest(res.chest);
      setNotice(accept
        ? `Le enviaste ${request.item.name} a ${request.person.name}.`
        : `Rechazaste la solicitud de ${request.person.name}.`);
    } catch (e) {
      setError(e.message);
    }
  };

  const askFriend = friends.find((f) => f.id === askFriendId) ?? null;
  const askItem = friendChest.find((i) => i.id === askItemId) ?? null;
  const alreadyAsked = mine.some((r) => r.to === askFriendId && r.itemId === askItemId && r.status === 'pendiente');

  const ask = async () => {
    if (!askFriend || !askItem || alreadyAsked) return;
    setError(null);
    setNotice(null);
    try {
      const created = await requestGift({ friendId: askFriendId, itemId: askItemId });
      setMine((list) => [created, ...list]);
      setNotice(`Le pediste ${askItem.name} a ${askFriend.name}.`);
    } catch (e) {
      setError(e.message);
    }
  };

  return {
    requests,
    pendingCount: inbox.filter((r) => r.status === 'pendiente').length,
    respond,
    friends,
    askFriend,
    setAskFriendId,
    friendChest,
    askItem,
    setAskItemId,
    alreadyAsked,
    ask,
    mine: mine.slice(0, 4),
    loading,
    error,
    notice,
  };
}
