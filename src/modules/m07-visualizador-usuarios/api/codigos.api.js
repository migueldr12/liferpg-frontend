import { usaApi } from '../../../config/env';
import { http } from '../../../api/httpClient';

const real = usaApi('visualizador');

let mockCodigos = [
  { id: '1', codigo: 'DRG-7K4Q', estado: 'Vigente', usosActuales: 1, usosMaximos: 3, vigenciaText: 'expira en 6 días' },
  { id: '2', codigo: 'DRG-2M9P', estado: 'Vigente', usosActuales: 0, usosMaximos: 1, vigenciaText: 'expira en 20 h' },
  { id: '3', codigo: 'DRG-X81L', estado: 'Expirado', usosActuales: 3, usosMaximos: 3, vigenciaText: 'expiró el 2 oct' },
  { id: '4', codigo: 'DRG-5TQA', estado: 'Revocado', usosActuales: 1, usosMaximos: 5, vigenciaText: 'revocado 28 sep' },
];

function mapCodigoToRow(item) {
  return {
    id: item.id,
    codigo: item.codigo,
    estado: item.estado,
    usosActuales: item.usos ?? item.usosActuales ?? 0,
    usosMaximos: item.usosMaximos ?? 1,
    vigenciaText: item.vigencia ?? item.vigenciaText ?? '',
  };
}

export async function getMisCodigos() {
  if (real) {
    const data = await http('/visualizador-usuarios/codigos');
    return {
      vigentes: data.vigentes ?? 0,
      codigos: (data.codigos || []).map(mapCodigoToRow),
    };
  }
  return {
    vigentes: mockCodigos.filter((c) => c.estado === 'Vigente').length,
    codigos: [...mockCodigos],
  };
}

export async function generarCodigo({ expirationDays, maxUses }) {
  if (real) {
    const created = await http('/visualizador-usuarios/codigos', {
      method: 'POST',
      body: { expirationDays, maxUses },
    });
    return mapCodigoToRow(created);
  }

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const codigo = `DRG-${Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`;
  const nuevo = {
    id: `${Date.now()}`,
    codigo,
    estado: 'Vigente',
    usosActuales: 0,
    usosMaximos: maxUses,
    vigenciaText: `expira en ${expirationDays === 1 ? '24 h' : `${expirationDays} días`}`,
  };
  mockCodigos = [nuevo, ...mockCodigos];
  return nuevo;
}

export async function revocarCodigo(codeId) {
  if (real) {
    const revoked = await http(`/visualizador-usuarios/codigos/${codeId}/revocar`, {
      method: 'PATCH',
    });
    return mapCodigoToRow(revoked);
  }

  mockCodigos = mockCodigos.map((c) =>
    c.id === codeId ? { ...c, estado: 'Revocado', vigenciaText: 'revocado hoy' } : c
  );
  return mockCodigos.find((c) => c.id === codeId);
}

export async function canjearCodigo(code) {
  if (real) {
    return http('/visualizador-usuarios/codigos/canjear', {
      method: 'POST',
      body: { code },
    });
  }

  if (code.trim().toUpperCase() === 'ANA-93XZ') {
    return { linked: true };
  }
  throw new Error('Código expirado, revocado o sin usos disponibles.');
}