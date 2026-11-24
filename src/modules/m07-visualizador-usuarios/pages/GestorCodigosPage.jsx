import React, { useState } from 'react';
import { FormNuevoCodigo } from '../components/FormGenerarCodigo';
import { TablaCodigos } from '../components/TablaCodigos';
import '../components/visualizador.css';

export default function GestorCodigosPage() {
  const [codigoActual, setCodigoActual] = useState('DRG-7K4Q');
  const [feedback, setFeedback] = useState('');
  const [codigos, setCodigos] = useState([
    { id: '1', codigo: 'DRG-7K4Q', estado: 'Vigente', usosActuales: 1, usosMaximos: 3, vigenciaText: 'expira en 6 días' },
    { id: '2', codigo: 'DRG-2M9P', estado: 'Vigente', usosActuales: 0, usosMaximos: 1, vigenciaText: 'expira en 20 h' },
    { id: '3', codigo: 'DRG-X81L', estado: 'Expirado', usosActuales: 3, usosMaximos: 3, vigenciaText: 'expiró el 2 oct' },
    { id: '4', codigo: 'DRG-5TQA', estado: 'Revocado', usosActuales: 1, usosMaximos: 5, vigenciaText: 'revocado 28 sep' },
  ]);

  const handleGenerar = (dias, usos) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const codigo = `DRG-${Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`;
    setCodigoActual(codigo);
    setCodigos((prev) => [{ id: `${Date.now()}`, codigo, estado: 'Vigente', usosActuales: 0, usosMaximos: usos, vigenciaText: `expira en ${dias === 1 ? '24 h' : `${dias} días`}` }, ...prev].slice(0, 6));
    setFeedback('Código generado.');
  };

  const handleCanjear = (codigo) => {
    setFeedback(codigo.trim().toUpperCase() === 'ANA-93XZ'
      ? '¡Portal abierto! Ana ya está en tu party.'
      : codigo.trim() ? 'Código expirado, revocado o sin usos disponibles.' : 'Escribe un código para canjear.');
  };

  const handleRevocar = (id) => {
    setCodigos((prev) =>
       prev.map((c) => (c.id === id ? { ...c, estado: 'Revocado', vigenciaText: 'revocado hoy' } : c))
    );
  };

  return (
    <div className="m07">

      <div className="m07-grid-codigos">
        <FormNuevoCodigo codigo={codigoActual} feedback={feedback}
          onCopiar={async () => {
            try {
              await navigator.clipboard.writeText(codigoActual);
              setFeedback('Copiado');
            } catch {
              setFeedback(`Código para copiar: ${codigoActual}`);
            }
          }} onGenerar={handleGenerar} onCanjear={handleCanjear} />
        <TablaCodigos codigos={codigos} onRevocar={handleRevocar} />
      </div>
    </div>
  );
}
