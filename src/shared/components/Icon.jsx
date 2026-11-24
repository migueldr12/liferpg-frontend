import React from 'react';

const paths = {
  friends: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5v1" /></>,
  gift: <><rect x="3" y="9" width="18" height="12" rx="2" /><path d="M12 9v12M3 13h18M12 9c-5 0-6-2-5-4 2-3 5 1 5 4Zm0 0c5 0 6-2 5-4-2-3-5 1-5 4Z" /></>,
  book: <><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1m0-14c3-2 6-2 9-1v14c-3-1-6-1-9 1V6Z" /></>,
  dumbbell: <><path d="M3 9v6m3-8v10m3-5h6m0 0h3m0-5v10m3-8v6" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  refresh: <><path d="M20 11a8 8 0 1 0-2 6m2-6V5m0 6h-6" /></>,
  heart: <path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2L12 22l8.8-9.2a5.1 5.1 0 0 0 0-7.2Z" />,
  bell: <><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2Zm4 5h4" /></>,
  flame: <path d="M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 1 1 2 2 2 4 1-2 1-5 1-8Z" />,
  chart: <><path d="M4 20V12m5 8V5m5 15v-8m5 8V8" strokeWidth="3" strokeLinecap="round" /></>,
  flag: <><path d="M5 21V4m0 1c5-3 9 3 14 0v11c-5 3-9-3-14 0" /></>,
  server: <><rect x="3" y="3" width="18" height="7" rx="2" /><rect x="3" y="14" width="18" height="7" rx="2" /><path d="M7 7h.01M7 18h.01M11 7h7M11 18h7" /></>,
  economy: <><circle cx="12" cy="12" r="9" /><path d="M15 8H11a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9m3-10v2m0 8v2" /></>,
  coins: <><ellipse cx="9" cy="6" rx="6" ry="3" /><path d="M3 6v5c0 1.7 2.7 3 6 3m-6-3v4c0 1.7 2.7 3 6 3" /><ellipse cx="16" cy="15" rx="5" ry="3" /><path d="M11 15v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4" /></>,
  database: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></>,
  moon: <path d="M20.7 15.1A8.5 8.5 0 0 1 8.9 3.3 8.5 8.5 0 1 0 20.7 15.1Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  spark: <path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z" />,
  check: <path d="m5 12 5 5L20 7" />,
  checkcheck: <><path d="m2 12 4 4 6-6m-2 6 4 4 8-8" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  shield: <path d="m12 2 8 4v6c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-4Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4m8-4v4" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4Zm11-15 4 4" />,
  trash: <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
};

export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] ?? paths.spark}
    </svg>
  );
}
