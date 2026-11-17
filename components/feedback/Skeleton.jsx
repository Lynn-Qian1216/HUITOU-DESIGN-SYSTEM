import React from 'react';

export function Skeleton({ width = '100%', height = 12, radius = 'var(--radius-xs)', lines = 1, style, ...rest }) {
  const bar = (w, key) => (
    <span key={key} style={{ display: 'block', width: w, height, borderRadius: radius, background: 'var(--neutral-100)', animation: 'huitou-pulse 1.4s var(--ease-standard) infinite' }} />
  );
  if (lines > 1) {
    return <span {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', ...style }}>
      {Array.from({ length: lines }, (_, i) => bar(i === lines - 1 ? '62%' : width, i))}
    </span>;
  }
  return <span {...rest} style={style}>{bar(width, 0)}</span>;
}
