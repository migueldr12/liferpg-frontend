import { Link, NavLink, useLocation } from 'react-router-dom';
import { Users, Gift, BookOpen, Bell, Flame, Flag } from 'lucide-react';
import './lite.css';

export function PixelAvatar({ src, alt = '', size = 40, tone = '#7b2cbf' }) {
  return (
    <span className="pixel-avatar" style={{ width: size, height: size, '--tone': tone }}>
      {src ? <img src={src} alt={alt} /> : <span className="pixel-avatar__ph" aria-hidden="true" />}
    </span>
  );
}

/** Tabs con `to` (navegan) o con `value` (controladas). `badge` opcional. */
export function SegmentedTabs({ items, value, onChange, ariaLabel, size }) {
  const cls = `seg${size === 'sm' ? ' seg--sm' : ''}`;
  const content = (i) => (<>{i.label}{i.badge != null && <span className="badge">{i.badge}</span>}</>);

  if (items.some((i) => i.to)) {
    return (
      <nav className={cls} aria-label={ariaLabel}>
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} end className={({ isActive }) => `seg__item${isActive ? ' is-active' : ''}`}>{content(i)}</NavLink>
        ))}
      </nav>
    );
  }
  return (
    <div className={cls} role="tablist" aria-label={ariaLabel}>
      {items.map((i) => (
        <button key={i.value} type="button" role="tab" aria-selected={value === i.value}
          className={`seg__item${value === i.value ? ' is-active' : ''}`} onClick={() => onChange?.(i.value)}>
          {content(i)}
        </button>
      ))}
    </div>
  );
}

const NAV = [
  { label: 'Amigos', to: '/lite/amigos', match: '/lite/amigos', icon: Users },
  { label: 'Botín', to: '/lite/botin', match: '/lite/botin', icon: Gift },
  { label: 'Diario', to: '/lite/diario', match: '/lite/diario', icon: BookOpen },
  { label: 'Ánimo', to: '/lite/animo/stickers', match: '/lite/animo', icon: Bell, badgeKey: 'animo' },
  { label: 'Progreso', to: '/lite/progreso', match: '/lite/progreso', icon: Flame },
  { label: 'Retos', to: '/lite/retos', match: '/lite/retos', icon: Flag },
];

function BottomNav({ badges = {} }) {
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {NAV.map(({ label, to, match, icon: Icon, badgeKey }) => {
        const active = pathname.startsWith(match);
        const count = badgeKey ? badges[badgeKey] : 0;
        return (
          <Link key={to} to={to} className={`bottom-nav__item${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
            <Icon size={20} aria-hidden="true" />
            {label}
            {count > 0 && <span className="badge bottom-nav__badge">{count}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

/** Cabecera (jugador + título + tabs) · contenido · nav inferior. */
export default function LiteLayout({ user, title, subtitle, tabs, navBadges, children }) {
  return (
    <div className="lite">
      <header className="lite-header">
        <div className="lite-header__main">
          <div className="player-badge">
            <PixelAvatar src={user.avatar} size={40} tone={user.tone} />
            <div>
              <span className="player-badge__name">{user.name}</span>
              <span className="player-badge__level">LV {user.level}</span>
            </div>
          </div>
          <div>
            <h1 className="lite-title">{title}</h1>
            {subtitle && <p className="lite-subtitle">{subtitle}</p>}
          </div>
        </div>
        {tabs && <SegmentedTabs items={tabs} ariaLabel="Secciones" />}
      </header>
      <main>{children}</main>
      <BottomNav badges={navBadges} />
    </div>
  );
}
