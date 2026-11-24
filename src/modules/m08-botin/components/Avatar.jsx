// Avatar de un integrante de la party: su mascota sobre su color.
export default function Avatar({ person, size = 36 }) {
  return (
    <span
      className="m08-avatar"
      style={{ background: person.color, width: size, height: size }}
      aria-hidden="true"
    >
      <img src={`/icons/${person.pet || 'dragon'}.png`} alt="" />
    </span>
  );
}
