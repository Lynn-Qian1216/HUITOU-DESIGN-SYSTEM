import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Spinner({ size = 16, label, style, ...rest }) {
  return (
    <span {...rest} role="status" aria-label={label || '加载中'} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--text-secondary)', ...style }}>
      <Icon name="loader-circle" size={size} style={{ animation: 'huitou-spin 700ms linear infinite' }} />
      {label ? <span style={{ fontSize: 'var(--fs-13)' }}>{label}</span> : null}
    </span>
  );
}
