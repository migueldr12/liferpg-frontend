import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmigoCard } from '../components/AmigoCard';
import '../components/visualizador.css';

const AMIGOS = [
  { id: 'diego.r', nombre: 'Diego Ramírez', alias: '@diego.r', nivel: 12, racha: 12, estado: 'hace 2 h', actividad: 2, pet: 'dragon', stats: { cultura: 64, fisico: 82, enfoque: 41 } },
  { id: 'ana.t', nombre: 'Ana Torres', alias: '@ana.t', nivel: 17, racha: 21, estado: 'en línea', actividad: 0, pet: 'gato', stats: { cultura: 88, fisico: 45, enfoque: 73 } },
  { id: 'mateo', nombre: 'Mateo Silva', alias: '@mateo', nivel: 9, racha: 3, estado: 'ayer', actividad: 4, pet: 'hamster', stats: { cultura: 30, fisico: 62, enfoque: 25 } },
  { id: 'lu.gomez', nombre: 'Lucía Gómez', alias: '@lu.gomez', nivel: 21, racha: 34, estado: 'en línea', actividad: 1, pet: 'leon', stats: { cultura: 76, fisico: 70, enfoque: 90 } },
  { id: 'cami', nombre: 'Camila Ortiz', alias: '@cami', nivel: 6, racha: 0, estado: 'hace 4 días', actividad: 5, pet: 'perro', stats: { cultura: 22, fisico: 10, enfoque: 18 } },
  { id: 'bruno.p', nombre: 'Bruno Paz', alias: '@bruno.p', nivel: 15, racha: 8, estado: 'hace 5 h', actividad: 3, pet: 'leon', stats: { cultura: 50, fisico: 77, enfoque: 60 } },
];

export default function ListaPartyPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('nivel');
  const [removed, setRemoved] = useState([]);
  const [confirming, setConfirming] = useState(null);
  const query = search.trim().toLocaleLowerCase('es');
  const amigos = AMIGOS
    .filter((amigo) => !removed.includes(amigo.id))
    .filter((amigo) => `${amigo.nombre} ${amigo.alias}`.toLocaleLowerCase('es').includes(query))
    .sort((a, b) => sortBy === 'actividad' ? a.actividad - b.actividad : b[sortBy] - a[sortBy]);

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
        <span><strong>{amigos.length} / 30</strong> amigos</span>
      </div>

      <div className="m07-grid-party">
        {amigos.map((amigo) => (
          <AmigoCard
            key={amigo.id}
            {...amigo}
            confirming={confirming === amigo.id}
            onVerPerfil={() => navigate('/lite/amigos/perfil')}
            onAskRemove={() => setConfirming(amigo.id)}
            onCancelRemove={() => setConfirming(null)}
            onRemove={() => {
              setRemoved((ids) => [...ids, amigo.id]);
              setConfirming(null);
            }}
          />
        ))}
      </div>
      {amigos.length === 0 && <p className="m07-empty">No hay amigos que coincidan con la búsqueda.</p>}
    </div>
  );
}
