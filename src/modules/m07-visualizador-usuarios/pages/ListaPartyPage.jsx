import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AmigoCard } from '../components/AmigoCard';
import '../components/visualizador.css';

//luego cambio los avatares
export default function ListaPartyPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('nivel');

  const amigosMock = [
    { id: '1', nombre: 'Clara Aguilar', alias: '@cy.agui', nivel: 11, racha: 34, estado: 'en línea', avatar: '🐱', stats: { cultura: 76, fisico: 90, enfoque: 30 } },
    { id: '2', nombre: 'Majo Ramirez', alias: '@majo.r', nivel: 11, racha: 31, estado: 'en línea', avatar: '🐲', stats: { cultura: 22, fisico: 40, enfoque: 70 } },
    { id: '3', nombre: 'Miguel Duran', alias: '@miguel.d', nivel: 18, racha: 12, estado: 'hace 2h', avatar: '🦊', stats: { cultura: 64, fisico: 82, enfoque: 41 } },
  ];

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
        <span><strong>6 / 30</strong> amigos</span>
      </div>

      <div className="m07-grid-party">
        {amigosMock.map((amigo) => (
          <AmigoCard
            key={amigo.id}
            {...amigo}
            onVerPerfil={() => navigate('/lite/amigos/perfil')}
          />
        ))}
      </div>
    </div>
  );
}
