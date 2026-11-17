import React from 'react';

export function StatDelta({ value, goodWhen = 'up', basis, style, ...rest }) {
  const up = value >= 0;
  const good = goodWhen === 'none' ? null : (up ? goodWhen === 'up' : goodWhen === 'down');
  const color = good === null ? 'var(--text-secondary)' : good ? 'var(--viz-positive)' : 'var(--viz-negative)';
  return (
    <span {...rest} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-2)', fontSize: 'var(--fs-12)', color, fontVariantNumeric: 'tabular-nums', ...style }}>
      <span>{up ? '↑' : '↓'}</span>
      <span>{Math.abs(value) < 10 ? Math.abs(value).toFixed(1) : Math.abs(value).toFixed(0)}%</span>
      {basis ? <span style={{ color: 'var(--text-tertiary)' }}>{basis}</span> : null}
    </span>
  );
}
