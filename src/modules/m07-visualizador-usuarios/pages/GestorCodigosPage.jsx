import React, { useState } from 'react';
import { FormNuevoCodigo } from '../components/FormGenerarCodigo';
import { TablaCodigos } from '../components/TablaCodigos';
import { useCodigosAmistad } from '../hooks/useCodigosAmistad';
import '../components/visualizador.css';

export default function GestorCodigosPage() {
  const { codigos, codigoActual, generar, revocar, canjear } = useCodigosAmistad();
  const [feedback, setFeedback] = useState('');

  const handleGenerar = async (dias, usos) => {
    try {
      await generar(dias, usos);
      setFeedback('Código generado.');
    } catch (err) {
      setFeedback(err.message);
    }
  };

  const handleCanjear = async (codigo) => {
    if (!codigo.trim()) {
      setFeedback('Escribe un código para canjear.');
      return;
    }
    try {
      await canjear(codigo);
      setFeedback('¡Portal abierto! Nuevo aventurero vinculado a tu party.');
    } catch (err) {
      setFeedback(err.message);
    }
  };

  const handleRevocar = async (id) => {
    try {
      await revocar(id);
      setFeedback('Código revocado.');
    } catch (err) {
      setFeedback(err.message);
    }
  };

  return (
    <div className="m07">
      <div className="m07-grid-codigos">
        <FormNuevoCodigo
          codigo={codigoActual}
          feedback={feedback}
          onCopiar={async () => {
            try {
              await navigator.clipboard.writeText(codigoActual);
              setFeedback('Copiado');
            } catch {
              setFeedback(`Código para copiar: ${codigoActual}`);
            }
          }}
          onGenerar={handleGenerar}
          onCanjear={handleCanjear}
        />
        <TablaCodigos codigos={codigos} onRevocar={handleRevocar} />
      </div>
    </div>
  );
}