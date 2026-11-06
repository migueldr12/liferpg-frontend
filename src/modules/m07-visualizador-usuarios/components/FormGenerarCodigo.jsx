import React, {useState} from 'react';

// lo mismo, quien sabe si le cambio el diseño, pero ps ahorita así
export const FormNuevoCodigo = ({ onGenerar, onCanjear }) => {
  const [dias, setDias] = useState(7);
  const [usos, setUsos] = useState(3);
  const [codigoInput, setCodigoInput] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <section className="m07-panel">
        <h2>Nuevo código</h2>
        <div className="m07-codigo-display">
          <span>CYA-1001</span>
          <button className="m07-btn-secundario">Copiar</button>
        </div>

        <div>
          <span className="m07-label">Expira en</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            {[1, 7, 30].map((d) => (
              <button
                key={d}
                className="m07-btn-secundario"
                style={{ flex: 1, borderColor: dias === d ? 'var(--verde)' : undefined }}
                onClick={() => setDias(d)}
              >
                {d} días
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="m07-label">Usos máximos</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <button className="m07-btn-secundario" onClick={() => setUsos(Math.max(1, usos - 1))}>-</button>
            <strong>{usos}</strong>
            <button className="m07-btn-secundario" onClick={() => setUsos(usos + 1)}>+</button>
          </div>
        </div>

        <button className="m07-btn-primario" onClick={() => onGenerar(dias, usos)}>
          Generar código
        </button>
      </section>

      <section className="m07-panel">
        <h2>Canjear código de un amigo</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="CYA-XXXX"
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
          />
          <button className="m07-btn-secundario" onClick={() => onCanjear(codigoInput)}>
            Canjear
          </button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--texto-suave)' }}>
          Prueba con CYA-1001. Se valida vigencia y usos.
        </p>
      </section>
    </div>
  );
};