import React from 'react';
import { Link } from 'react-router-dom';
import '../components/visualizador.css';
import { PixelMascot } from '../../../shared/components/PixelMascot';
import { DEMO_PARTY } from '../../../shared/assets/demoParty';

export default function PerfilEspejoPage() {
  return (
    <div className="m07">

      <div className="m07-grid-espejo">
        <div className="m07-panel">
          <span className="m07-badge-solo-lectura"> Solo lectura</span>
          <div className="m07-escena-tamagotchi"><PixelMascot {...DEMO_PARTY.diego} scene="forest" label="Chispa, dragón de Diego, en el bosque" /></div>
          <div>
            <h2>Diego Ramírez <span className="m07-level">LV 12</span></h2>
            <p className="texto-suave">@diego.r · Chispa (dragón) · amigos desde ago 2026</p>
            <div style={{ marginTop: '10px' }}>
               <span>Hacia LV 13: 860 / 1400 XP</span>
              <div className="m07-barra-track" style={{ height: '8px', marginTop: '4px' }}>
                <div className="m07-barra-fill cultura" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <section className="m07-panel">
            <h2>ESTADÍSTICAS · PUNTOS ACUMULADOS</h2>
            <div className="m07-barra-stat">
              <span className="m07-barra-label">Cultura</span>
              <div className="m07-barra-track"><div className="m07-barra-fill cultura" style={{ width: '64%' }} /></div>
              <span>640</span>
            </div>
            <div className="m07-barra-stat">
              <span className="m07-barra-label">Físico</span>
              <div className="m07-barra-track"><div className="m07-barra-fill fisico" style={{ width: '82%' }} /></div>
              <span>820</span>
            </div>
            <div className="m07-barra-stat">
              <span className="m07-barra-label">Enfoque</span>
              <div className="m07-barra-track"><div className="m07-barra-fill enfoque" style={{ width: '41%' }} /></div>
              <span>410</span>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="m07-panel">
              <span className="m07-label"> 12 días</span>
              <span style={{ fontSize: '12px' }}>Racha actual · mejor: 21</span>
            </div>
            <div className="m07-panel">
              <span className="m07-label">ROPA EQUIPADA</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                 <span className="m07-btn-secundario" style={{ fontSize: '11px' }}>Lentes de lector</span>
                <span className="m07-btn-secundario" style={{ fontSize: '11px' }}>Bufanda roja</span>
              </div>
            </div>
          </div>

          <div className="m07-privado-box">
             <strong>Datos privados ocultos:</strong> Solo Miguel puede ver sus notas de rendimiento, energía diaria y correo.
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
