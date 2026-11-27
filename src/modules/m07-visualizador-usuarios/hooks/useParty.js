import { useState, useEffect, useCallback } from 'react';
import { getParty, eliminarAmigo } from '../api/amigos.api';

export function useParty() {
  const [amigos, setAmigos] = useState([]);
  const [total, setTotal] = useState(0);
  const [limite, setLimite] = useState(30);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('nivel');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getParty({ q: search, sort: sortBy });
      setAmigos(res.amigos);
      setTotal(res.total);
      setLimite(res.limite);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy]);

  useEffect(() => {
    const timer = setTimeout(cargar, 200);
    return () => clearTimeout(timer);
  }, [cargar]);

  const handleRemove = async (friendId) => {
    await eliminarAmigo(friendId);
    setAmigos((prev) => prev.filter((a) => a.id !== friendId));
    setTotal((prev) => Math.max(0, prev - 1));
  };

  return {
    amigos,
    total,
    limite,
    search,
    setSearch,
    sortBy,
    setSortBy,
    loading,
    error,
    eliminarAmigo: handleRemove,
  };
}