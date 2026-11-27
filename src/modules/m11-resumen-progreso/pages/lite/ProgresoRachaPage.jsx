import React from 'react';
import LiteLayout from '../../components/lite/LiteShell';
import { useProgressResource } from '../../hooks/useProgressResource';
import { PixelMascot } from '../../../../shared/components/PixelMascot';

export default function ProgresoRachaPage() {
  const { data, loading, error } = useProgressResource('consistencia');
  return <LiteLayout><section className="panel progress-page">
    {loading && <p role="status">Cargando tu racha…</p>}
    {error && <p role="alert">{error}</p>}
    {data && <>
      <div className="streak-card"><PixelMascot pet="dragon" mood="happy" width={100} height={100} label="" /><div><span>Tu racha actual</span><h2>{data.rachaActual} {data.rachaActual === 1 ? 'día' : 'días'}</h2><p>{data.rachaActual ? data.mensaje : 'Puedes comenzar una nueva racha hoy.'}</p></div></div>
      <div className="progress-details"><p><strong>{data.mejorRacha} días</strong><span>Mejor racha</span></p><p><strong>{data.ultimoCheckIn ?? 'Sin registros'}</strong><span>Último registro</span></p></div>
      <p>La racha cuenta los días consecutivos con al menos un registro de actividad.</p>
    </>}
  </section></LiteLayout>;
}
