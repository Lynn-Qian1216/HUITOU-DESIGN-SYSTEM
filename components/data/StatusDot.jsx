import React from 'react';

export function StatusDot({ tone = 'neutral', label, pulse, style, ...rest }) {
  return (
    <span {...rest} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--fs-13)', color: 'var(--text-primary)', ...style }}>
      <span style={{
        width: 8, height: 8, flex: 'none', borderRadius: 'var(--radius-pill)',
        background: `var(--status-${tone}-fg)`,
        animation: pulse ? 'huitou-pulse 1.6s var(--ease-standard) infinite' : undefined,
      }} />
      {label}
    </span>
  );
}
