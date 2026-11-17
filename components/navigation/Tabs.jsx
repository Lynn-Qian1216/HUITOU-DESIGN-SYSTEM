import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Tabs({ items = [], value, onChange, style, ...rest }) {
  return (
    <div role="tablist" {...rest} style={{ display: 'flex', gap: 'var(--space-7)', borderBottom: '1px solid var(--border-subtle)', ...style }}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button key={it.id} type="button" role="tab" aria-selected={on} onClick={() => onChange && onChange(it.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 0 10px',
              border: 0, borderBottom: `2px solid ${on ? 'var(--neutral-900)' : 'transparent'}`,
              marginBottom: -1, background: 'transparent', font: 'inherit', fontSize: 'var(--fs-14)',
              fontWeight: 'var(--fw-medium)', color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'var(--transition-control)', whiteSpace: 'nowrap',
            }}>
            {it.icon ? <Icon name={it.icon} size={14} /> : null}
            {it.label}
            {it.count != null ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{it.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
