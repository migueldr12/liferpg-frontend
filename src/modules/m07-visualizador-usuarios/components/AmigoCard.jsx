import React from 'react';
//luego le pongo icons de racha y de visualizar
export const AmigoCard = ({
  id,
  nombre,
  alias,
  nivel,
  racha,
  estado,
  avatar,
  stats,
  onVerPerfil,
}) => {
  return (
    <div className="m07-card-amigo">
      <div className="m07-card-head">
        <div className="m07-avatar-box">{avatar}</div>
        <div className="m07-card-info">
          <strong>{nombre}</strong> <span className="m07-pts sube">LV {nivel}</span>
          <p>{alias} · {estado}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span>🔥 {racha}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div className="m07-barra-stat">
          <span style={{ width: '30px' }}>CULTURA</span>
          <div className="m07-barra-track">
            <div className="m07-barra-fill cultura" style={{ width: `${Math.min(stats.cultura / 10, 100)}%` }} />
          </div>
          <span>{stats.cultura}</span>
        </div>
        <div className="m07-barra-stat">
          <span style={{ width: '30px' }}>FISICO</span>
          <div className="m07-barra-track">
            <div className="m07-barra-fill fisico" style={{ width: `${Math.min(stats.fisico / 10, 100)}%` }} />
          </div>
          <span>{stats.fisico}</span>
        </div>
        <div className="m07-barra-stat">
          <span style={{ width: '30px' }}>ENFOQUE</span>
          <div className="m07-barra-track">
            <div className="m07-barra-fill enfoque" style={{ width: `${Math.min(stats.enfoque / 10, 100)}%` }} />
          </div>
          <span>{stats.enfoque}</span>
        </div>
      </div>

      <div className="m07-card-actions">
        <button className="m07-btn-secundario" style={{ flex: 1 }} onClick={() => onVerPerfil(id)}>
          Ver perfil
        </button>
      </div>
    </div>
  );
};