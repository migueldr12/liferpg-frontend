// Avatar de un integrante de la party: su mascota sobre su color.
export default function Avatar({ person, size = 36 }) {
  return (
    <span
      className={`m12-avatar m12-avatar--${person.id ?? 'dragon'}`}
      style={{ '--pet-color': person.color, width: size, height: size }}
    >
      <img src={`/icons/${person.pet || 'dragon'}.png`} alt="" />
    </span>
  );
}
