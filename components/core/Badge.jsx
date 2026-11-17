import React from 'react';
import { Icon } from './Icon.jsx';

export function Badge({ tone = 'neutral', dot, icon, subtle = true, children, style, ...rest }) {
  const solid = { background: `var(--status-${tone}-fg)`, color: 'var(--text-inverse)', borderColor: 'transparent' };
  const soft = { background: `var(--status-${tone}-bg)`, color: `var(--status-${tone}-fg)`, borderColor: `var(--status-${tone}-border)` };
  return (
    <span {...rest} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)',
      height: 22, padding: '0 var(--space-4)', borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', lineHeight: 1,
      borderWidth: 1, borderStyle: 'solid', whiteSpace: 'nowrap',
      ...(subtle ? soft : solid), ...style,
    }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} /> : null}
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
    </span>
  );
}
