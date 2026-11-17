import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function EmptyState({ icon = 'inbox', title, description, action, compact, style, ...rest }) {
  return (
    <div {...rest} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      gap: 'var(--space-5)', padding: compact ? 'var(--space-9) var(--space-6)' : 'var(--space-12) var(--space-8)', ...style,
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', color: 'var(--text-tertiary)' }}>
        <Icon name={icon} size={20} />
      </span>
      <div>
        <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{title}</div>
        {description ? <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: 4, maxWidth: 340 }}>{description}</div> : null}
      </div>
      {action}
    </div>
  );
}
