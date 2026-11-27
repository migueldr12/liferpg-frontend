import React from 'react';
import { Icon } from '../../../shared/components/Icon';
import { CompanionSheet } from './CompanionSheet';

export function AmigoCard({ id, nombre, alias, nivel, racha, estado, mascot, stats, onVerPerfil, confirming, onAskRemove, onCancelRemove, onRemove }) {
  return (
    <CompanionSheet className="m07-card-amigo" name={nombre} alias={alias} level={nivel} streak={racha} mascot={mascot} points={stats}>
      {confirming ? (
        <div className="companion-sheet__confirm">
          <p role="alert">¿Terminar la amistad con {nombre}? Ya no podrán ver el progreso del otro.</p>
          <button type="button" className="m07-btn-secundario" onClick={onCancelRemove} autoFocus>Cancelar</button>
          <button type="button" className="m07-btn-peligro" onClick={onRemove}>Eliminar amistad</button>
        </div>
      ) : (
        <footer className="companion-sheet__footer">
          <button type="button" className="companion-sheet__open" onClick={() => onVerPerfil(id)}>Ver perfil <Icon name="chevron" size={16} /></button>
          {estado && <small>{estado}</small>}
          <button type="button" className="companion-sheet__remove" aria-label={`Terminar amistad con ${nombre}`} title="Terminar amistad" onClick={onAskRemove}><Icon name="trash" size={17} /></button>
        </footer>
      )}
    </CompanionSheet>
  );
}
