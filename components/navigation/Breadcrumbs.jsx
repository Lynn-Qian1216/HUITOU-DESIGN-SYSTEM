import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Breadcrumbs({ items = [], style, ...rest }) {
  return (
    <nav aria-label="面包屑导航" {...rest} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--fs-13)', ...style }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <Icon name="chevron-right" size={13} style={{ color: 'var(--text-tertiary)' }} /> : null}
          {i === items.length - 1
            ? <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--fw-medium)' }}>{it.label}</span>
            : <a href={it.href || '#'} onClick={it.onClick} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{it.label}</a>}
        </React.Fragment>
      ))}
    </nav>
  );
}
