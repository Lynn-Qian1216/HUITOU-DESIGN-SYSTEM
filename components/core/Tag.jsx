import React from 'react';
import { Icon } from './Icon.jsx';

export function Tag({ onRemove, children, style, ...rest }) {
  return (
    <span {...rest} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)',
      height: 24, padding: '0 var(--space-3) 0 var(--space-4)',
      background: 'var(--surface-sunken)', color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)',
      fontSize: 'var(--fs-12)', ...style,
    }}>
      {children}
      {onRemove ? (
        <button type="button" aria-label="移除" onClick={onRemove} style={{ display: 'inline-flex', padding: 2, margin: 0, border: 0, background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', borderRadius: 3 }}>
          <Icon name="x" size={12} />
        </button>
      ) : null}
    </span>
  );
}
