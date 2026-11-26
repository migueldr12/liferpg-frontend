import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmigoCard } from '../components/AmigoCard';
import { useParty } from '../hooks/useParty';
import '../components/visualizador.css';

export default function ListaPartyPage() {
  const navigate = useNavigate();
  const { amigos, total, limite, search, setSearch, sortBy, setSortBy, loading, error, eliminarAmigo } = useParty();
  const [confirming, setConfirming] = useState(null);

  return (
    <div className="m07">
      <div className="m07-controls-bar">
        <input
          type="text"
          className="m07-search-input"
          placeholder="Buscar por alias o nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="m07-sort-group">
          <span className="m07-label">ORDENAR:</span>
          <div className="m07-tabs" role="group" aria-label="Ordenar amigos">
            {['Nivel', 'Racha', 'Actividad'].map((item) => (
              <button
                key={item}
                type="button"
                className={`m07-tab${sortBy === item.toLowerCase() ? ' activo' : ''}`}
                aria-pressed={sortBy === item.toLowerCase()}
                onClick={() => setSortBy(item.toLowerCase())}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <span><strong>{total} / {limite}</strong> amigos</span>
      </div>

      {error && <p className="m07-empty">{error}</p>}
      {loading && <p className="m07-empty">Cargando party...</p>}

      {!loading && !error && (
        <div className="m07-grid-party">
          {amigos.map((amigo) => (
            <AmigoCard
              key={amigo.id}
              {...amigo}
              confirming={confirming === amigo.id}
              onVerPerfil={() => navigate(`/lite/amigos/perfil/${amigo.id}`)}
              onAskRemove={() => setConfirming(amigo.id)}
              onCancelRemove={() => setConfirming(null)}
              onRemove={async () => {
                await eliminarAmigo(amigo.id);
                setConfirming(null);
              }}
            />
          ))}
        </div>
      )}

      {!loading && !error && amigos.length === 0 && (
        <p className="m07-empty">No hay amigos que coincidan con la búsqueda.</p>
      )}
    </div>
  );
}