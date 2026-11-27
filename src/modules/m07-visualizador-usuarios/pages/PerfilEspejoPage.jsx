import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../../shared/components/Icon';
import { CompanionSheet } from '../components/CompanionSheet';
import { usePerfilEspejo } from '../hooks/usePerfilEspejo';
import '../components/visualizador.css';

const number = new Intl.NumberFormat('es-MX');

export default function PerfilEspejoPage() {
  const { friendId } = useParams();
  const own = !friendId;
  const { perfil, loading, error, retry } = usePerfilEspejo(friendId);

  if (loading) return <div className="m07"><p className="m07-empty" role="status">{own ? 'Cargando tu ficha…' : 'Cargando la ficha del amigo…'}</p></div>;
  if (error || !perfil) return <section className="m07 m07-profile-state">
    <div className="m07-panel"><p role="alert">{error?.status === 404 ? 'No encontramos este perfil.' : 'No se pudo cargar la ficha.'}</p>
      <div className="companion-profile__links"><button className="folio-action" type="button" onClick={retry}>Reintentar</button>{!own && <Link to="/lite/amigos">Volver a Amigos</Link>}</div>
    </div>
  </section>;

  const name = perfil.nombre || 'Jugador';
  const pet = perfil.mascota;
  const stats = [
    ['Experiencia', perfil.xp != null ? `${number.format(perfil.xp)} XP` : null],
    ['XP para el próximo nivel', perfil.nextLevelXp != null ? `${number.format(perfil.nextLevelXp)} XP` : null],
    ['Mejor racha', perfil.racha?.mejor != null ? `${number.format(perfil.racha.mejor)} ${perfil.racha.mejor === 1 ? 'día' : 'días'}` : null],
  ].filter(([, value]) => value != null);

  return <div className="m07 companion-profile">
    <CompanionSheet expanded name={name} alias={perfil.alias} level={perfil.nivel} streak={perfil.racha?.actual} points={perfil.estadisticas}
      caption={own ? 'Tu ficha de aventura' : 'Solo lectura'}
      mascot={pet ? { pet: pet.especie, color: pet.color, name: pet.nombre, title: pet.titulo, equipped: pet.equipped ?? perfil.ropaEquipada } : null}>
      {perfil.amigosDesde && <p className="companion-profile__since"><Icon name="calendar" size={16} /> En tu party desde {perfil.amigosDesde}.</p>}
      {perfil.incompleto && <div className="companion-profile__since" role="status">Parte de tu ficha no está disponible. <button className="folio-action" type="button" onClick={retry}>Volver a cargar</button></div>}
      <footer className="companion-profile__links">
        {own ? <><Link className="folio-action" to="/lite/diario"><Icon name="book" size={18} /> Ver mi diario</Link><Link className="folio-action" to="/lite/progreso/racha"><Icon name="flame" size={18} /> Ver mi racha</Link></>
          : <><Link className="folio-action" to="/lite/amigos"><Icon name="friends" size={18} /> Volver a Amigos</Link><Link className="folio-action" to="/lite/botin/cofre"><Icon name="gift" size={18} /> Ir a regalos</Link><Link className="folio-action" to="/lite/animo/stickers"><Icon name="heart" size={18} /> Ir a stickers</Link></>}
      </footer>
    </CompanionSheet>
    {(stats.length > 0 || perfil.ropaEquipada) && <section className="m07-panel companion-profile__record" aria-label="Trayectoria y equipamiento">
      <h2><Icon name="flag" size={20} /> Trayectoria</h2>
      {stats.length > 0 && <dl>{stats.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      {perfil.ropaEquipada && <div className="companion-profile__wardrobe"><h3>Accesorios equipados</h3>
        {perfil.ropaEquipada.length ? <ul>{perfil.ropaEquipada.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p>Sin accesorios equipados.</p>}</div>}
    </section>}
  </div>;
}
