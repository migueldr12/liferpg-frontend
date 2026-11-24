import React from 'react';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { demoMascot } from '../../../shared/assets/demoParty';
export const AmigoCard = ({
  id,
  nombre,
  alias,
  nivel,
  racha,
  estado,
  mascot,
  stats,
  onVerPerfil,
  confirming,
  onAskRemove,
  onCancelRemove,
  onRemove,
}) => {
  return (
    <div className="m07-card-amigo">
      <div className="m07-card-head">
        <div className="m07-avatar-box"><PixelMascot {...(mascot ?? demoMascot(nombre))} width={46} height={44} label={`Mascota de ${nombre}`} /></div>
        <div className="m07-card-info">
          <strong>{nombre}</strong> <span className="m07-pts sube">LV {nivel}</span>
          <p>{alias} · {estado}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="m07-streak" title="Racha">{racha} días</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div className="m07-barra-stat">
          <span className="m07-barra-label">CULTURA</span>
          <div className="m07-barra-track">
            <div className="m07-barra-fill cultura" style={{ width: `${Math.min(stats.cultura, 100)}%` }} />
          </div>
          <span>{stats.cultura}</span>
        </div>
        <div className="m07-barra-stat">
          <span className="m07-barra-label">FISICO</span>
          <div className="m07-barra-track">
            <div className="m07-barra-fill fisico" style={{ width: `${Math.min(stats.fisico, 100)}%` }} />
          </div>
          <span>{stats.fisico}</span>
        </div>
        <div className="m07-barra-stat">
          <span className="m07-barra-label">ENFOQUE</span>
          <div className="m07-barra-track">
            <div className="m07-barra-fill enfoque" style={{ width: `${Math.min(stats.enfoque, 100)}%` }} />
          </div>
          <span>{stats.enfoque}</span>
        </div>
      </div>

      {confirming ? (
        <div className="m07-remove-confirm" role="alert">
          <span>¿Terminar amistad? Dejarán de verse.</span>
          <button type="button" className="m07-btn-secundario" onClick={onCancelRemove}>No</button>
          <button type="button" className="m07-btn-peligro" onClick={onRemove}>Eliminar</button>
        </div>
      ) : (
        <div className="m07-card-actions">
          <button type="button" className="m07-btn-secundario" style={{ flex: 1 }} onClick={() => onVerPerfil(id)}>Ver perfil</button>
          <button type="button" className="m07-btn-peligro" aria-label={`Terminar amistad con ${nombre}`} onClick={onAskRemove}>Eliminar</button>
        </div>
      )}
    </div>
  );
};
