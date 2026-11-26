import { useEffect, useState } from 'react';
import { getFriends, getMyChest, sendGift } from '../api/botinApi';

// Hook de 8.1 Cofre del botín (RF027) y envío de regalos (RF025).

// Por qué un objeto no se puede regalar, o cuántos quedan (RDF089)
export const giftNote = (item) => {
  if (item.equipped) return 'Equipado · no se puede regalar';
  if (item.exclusive) return 'Exclusivo · no se puede regalar';
  if (item.qty === 0) return 'Agotado';
  if (item.qty < 0) return 'Ilimitado';
  return `Te quedan ${item.qty} · tras enviar: ${item.qty - 1}`;
};

const firstGiftable = (chest) => chest.find((i) => i.giftable)?.id ?? null;

export function useCofre() {
  const [chest, setChest] = useState([]);
  const [friends, setFriends] = useState([]);
  const [itemId, setItemId] = useState(null);
  const [friendId, setFriendId] = useState(null);
  const [message, setMessage] = useState('¡Para que no pierdas la racha! Tú puedes.');

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    Promise.all([getMyChest(), getFriends()])
      .then(([items, fr]) => {
        setChest(items);
        setFriends(fr);
        setItemId(firstGiftable(items));
        setFriendId(fr[0]?.id ?? null);
      })
      .catch(() => setError('No se pudo cargar tu cofre.'))
      .finally(() => setLoading(false));
  }, []);

  const selected = chest.find((i) => i.id === itemId) ?? null;
  const friend = friends.find((f) => f.id === friendId) ?? null;

  const pickItem = (item) => {
    if (!item.giftable || sending) return;
    setItemId(item.id);
    setNotice(null);
  };

  const pickFriend = (id) => {
    if (sending) return;
    setFriendId(id);
    setNotice(null);
  };

  // RDF082: enviar el objeto elegido al amigo elegido
  const send = async () => {
    if (!selected?.giftable || !friend || sending) return;
    const sentItemId = selected.id;
    const sentFriendId = friend.id;
    setSending(true);
    setError(null);
    setNotice(null);
    try {
      const res = await sendGift({ friendId: sentFriendId, itemId: sentItemId, message });
      setChest(res.chest);
      // El backend dice si el aviso push salió ("enviada"); los datos simulados no traen el campo
      const push = !res.notification || res.notification === 'enviada' ? ' Le llegará una notificación push.' : ' Ya está en su inventario.';
      setNotice(`Enviaste ${res.item} a ${res.to}.${push}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  return {
    chest,
    friends,
    selected,
    pickItem,
    friend,
    pickFriend,
    message,
    setMessage,
    canSend: !!selected?.giftable && !!friend && !sending,
    sending,
    send,
    loading,
    error,
    notice,
  };
}
