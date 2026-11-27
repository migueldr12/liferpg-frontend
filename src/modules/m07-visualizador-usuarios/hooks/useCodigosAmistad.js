import { useState, useEffect, useCallback } from 'react';
import { getMisCodigos, generarCodigo, revocarCodigo, canjearCodigo } from '../api/codigos.api';

export function useCodigosAmistad() {
  const [codigos, setCodigos] = useState([]);
  const [codigoActual, setCodigoActual] = useState('DRG-7K4Q');
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMisCodigos();
      const lista = data.codigos || [];
      setCodigos(lista);
      const vigente = lista.find((c) => c.estado === 'Vigente');
      if (vigente) setCodigoActual(vigente.codigo);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const generar = async (dias, usos) => {
    const nuevo = await generarCodigo({ expirationDays: dias, maxUses: usos });
    setCodigoActual(nuevo.codigo);
    await cargar();
    return nuevo;
  };

  const revocar = async (id) => {
    await revocarCodigo(id);
    await cargar();
  };

  const canjear = async (codigo) => {
    return canjearCodigo(codigo);
  };

  return {
    codigos,
    codigoActual,
    loading,
    generar,
    revocar,
    canjear,
  };
}