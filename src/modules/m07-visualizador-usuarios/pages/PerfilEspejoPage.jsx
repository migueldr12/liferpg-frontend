import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../components/visualizador.css';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { usePerfilEspejo } from '../hooks/usePerfilEspejo';

export default function PerfilEspejoPage() {
  const { friendId } = useParams();
  const { perfil, loading, error } = usePerfilEspejo(friendId);

  if (loading) {
    return <div className="m07"><p className="m07-empty">Cargando perfil espejo...</p></div>;
  }

  if (error) {
    return <div className="m07"><p className="m07-empty">{error}</p></div>;
  }

  if (!perfil) {
    return (
      <div className="m07">
        <p className="m07-empty">Aún no tienes amigos vinculados en tu party. Canjea un código para empezar.</p>
      </div>
    );
  }

  const petKey = (perfil.mascota?.especie || 'dragon').toLowerCase();
  const maxStat = Math.max(
    100,
    perfil.estadisticas?.cultura || 0,
    perfil.estadisticas?.fisico || 0,
    perfil.estadisticas?.enfoque || 0
  );
  const primerNombre = (perfil.nombre || 'Este jugador').split(' ')[0];

  return (
    <div className="m07">
      <div className="m07-grid-espejo">
        <div className="m07-panel">
          <span className="m07-badge-solo-lectura"> Solo lectura</span>
          <div className="m07-escena-tamagotchi">
            <PixelMascot
              pet={petKey}
              color={perfil.mascota?.color}
              equipped={perfil.mascota?.equipped || perfil.ropaEquipada || []}
              scene="forest"
              label={`${perfil.mascota?.nombre || 'Mascota'} de ${perfil.nombre}`}
            />
          </div>
          <div>
            <h2>{perfil.nombre} <span className="m07-level">LV {perfil.nivel}</span></h2>
            <p className="texto-suave">
              {perfil.alias} · {perfil.mascota?.nombre} ({petKey}) · amigos desde {perfil.amigosDesde}
            </p>
            <div style={{ marginTop: '10px' }}>
              <span>Hacia LV {perfil.siguienteNivel}: {perfil.xp} / {perfil.nextLevelXp} XP</span>
              <div className="m07-barra-track" style={{ height: '8px', marginTop: '4px' }}>
                <div className="m07-barra-fill cultura" style={{ width: `${perfil.xpPorcentaje}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <section className="m07-panel">
            <h2>ESTADÍSTICAS · PUNTOS ACUMULADOS</h2>
            <div className="m07-barra-stat">
              <span className="m07-barra-label">Cultura</span>
              <div className="m07-barra-track">
                <div className="m07-barra-fill cultura" style={{ width: `${Math.round(((perfil.estadisticas?.cultura || 0) / maxStat) * 100)}%` }} />
              </div>
              <span>{perfil.estadisticas?.cultura ?? 0}</span>
            </div>
            <div className="m07-barra-stat">
              <span className="m07-barra-label">Físico</span>
              <div className="m07-barra-track">
                <div className="m07-barra-fill fisico" style={{ width: `${Math.round(((perfil.estadisticas?.fisico || 0) / maxStat) * 100)}%` }} />
              </div>
              <span>{perfil.estadisticas?.fisico ?? 0}</span>
            </div>
            <div className="m07-barra-stat">
              <span className="m07-barra-label">Enfoque</span>
              <div className="m07-barra-track">
                <div className="m07-barra-fill enfoque" style={{ width: `${Math.round(((perfil.estadisticas?.enfoque || 0) / maxStat) * 100)}%` }} />
              </div>
              <span>{perfil.estadisticas?.enfoque ?? 0}</span>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="m07-panel">
              <span className="m07-label"> {perfil.racha?.actual ?? 0} días</span>
              <span style={{ fontSize: '12px' }}>Racha actual · mejor: {perfil.racha?.mejor ?? 0}</span>
            </div>
            <div className="m07-panel">
              <span className="m07-label">ROPA EQUIPADA</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(perfil.ropaEquipada?.length ? perfil.ropaEquipada : ['Sin accesorios']).map((item) => (
                  <span key={item} className="m07-btn-secundario" style={{ fontSize: '11px' }}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="m07-privado-box">
            <strong>Datos privados ocultos:</strong> Solo {primerNombre} puede ver sus notas de rendimiento, energía diaria y correo.
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link className="m07-btn-primario m07-cta-link" style={{ flex: 1 }} to="/lite/botin/cofre">Enviar regalo</Link>
            <Link className="m07-btn-secundario m07-cta-link" style={{ flex: 1 }} to="/lite/animo/stickers">Mandar ánimo</Link>
          </div>
        </div>
      </div>
    </div>
  );
}