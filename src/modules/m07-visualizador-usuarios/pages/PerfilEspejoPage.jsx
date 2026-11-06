import React from 'react';
import LiteHeader from '@/shared/components/LiteHeader';
import '../components/m07.css';

//lo mismo, luego cambio icons
export default function PerfilEspejoPage() {
  return (
    <main className="page m07">
      <LiteHeader title="Miguel · perfil espejo" subtitle="Ves su progreso tal cual, no puedes modificar nada" />

      <div className="m07-grid-espejo">
        <div className="m07-panel">
          <span className="m07-badge-solo-lectura"> Solo lectura</span>
          <div className="m07-escena-tamagotchi">🐉</div>
          <div>
            <h2>Miguel Duran</h2>
            <p className="texto-suave">@miguel.d · Chispa (dragón) · amigos desde ago 2026</p>
            <div style={{ marginTop: '10px' }}>
              <span>Hacia LV 19: 860 / 1400 XP</span>
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
              <span style={{ width: '70px' }}>Cultura</span>
              <div className="m07-barra-track"><div className="m07-barra-fill cultura" style={{ width: '64%' }} /></div>
              <span>640</span>
            </div>
            <div className="m07-barra-stat">
              <span style={{ width: '70px' }}> Físico</span>
              <div className="m07-barra-track"><div className="m07-barra-fill fisico" style={{ width: '82%' }} /></div>
              <span>820</span>
            </div>
            <div className="m07-barra-stat">
              <span style={{ width: '70px' }}> Enfoque</span>
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
                <span className="m07-btn-secundario" style={{ fontSize: '11px' }}>Lentes de lectura</span>
                <span className="m07-btn-secundario" style={{ fontSize: '11px' }}>Bufanda roja</span>
              </div>
            </div>
          </div>

          <div className="m07-privado-box">
             <strong>Datos privados ocultos:</strong> Solo Miguel puede ver sus notas de rendimiento, energía diaria y correo.
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="m07-btn-primario" style={{ flex: 1 }}> Enviar regalo</button>
            <button className="m07-btn-secundario" style={{ flex: 1 }}> Mandar ánimo</button>
          </div>
        </div>
      </div>
    </main>
  );
}