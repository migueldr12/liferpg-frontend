import React, { useState } from 'react';
import LiteHeader from '@/shared/components/LiteHeader';
import { FormNuevoCodigo } from '../components/FormNuevoCodigo';
import { TablaCodigos } from '../components/TablaCodigos';
import '../components/m07.css';

export default function GestorCodigosPage() {
  const [codigos, setCodigos] = useState([
    { id: '1', codigo: 'CYA-7K4Q', estado: 'Vigente', usosAcStuales: 0, usosMaximos: 3, vigenciaText: 'expira en 6 días' },
    { id: '2', codigo: 'CYA-8M9P', estado: 'Vigente', usosActuales: 0, usosMaximos: 1, vigenciaText: 'expira en 20 h' },
    { id: '3', codigo: 'CYA-X81L', estado: 'Expirada', usosActuales: 2, usosMaximos: 3, vigenciaText: 'invalido el 2 Oct' },
    { id: '4', codigo: 'CYA-9TQA', estado: 'Revocada', usosActuales: 1, usosMaximos: 5, vigenciaText: 'revocado 28 sep' },
  ]);

  const handleGenerar = (dias, usos) => {
    console.log('Generar código:', { dias, usos });
  };

  const handleCanjear = (codigo) => {
    console.log('Canjear código:', codigo);
  };

  const handleRevocar = (id) => {
    setCodigos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: 'Revocada' } : c))
    );
  };

  return (
    <main className="page m07">
      <LiteHeader title="Códigos de amistad" subtitle="Invita sin compartir correo ni tu teléfono" />

      <div className="m07-grid-codigos">
        <FormNuevoCodigo onGenerar={handleGenerar} onCanjear={handleCanjear} />
        <TablaCodigos codigos={codigos} onRevocar={handleRevocar} />
      </div>
    </main>
  );
}