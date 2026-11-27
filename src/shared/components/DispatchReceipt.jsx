import React from 'react';
import { Icon } from './Icon';
import './dispatch-receipt.css';

export function DispatchReceipt({ title, children, art, action, tone = 'gift' }) {
  return <div className={`dispatch-receipt dispatch-receipt--${tone}`} role="status" aria-atomic="true">
    <span className="dispatch-receipt__stamp" aria-hidden="true">{art ?? <Icon name="check" size={24} />}</span>
    <div className="dispatch-receipt__copy"><strong>{title}</strong>{children && <p>{children}</p>}{action}</div>
  </div>;
}
