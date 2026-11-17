import React from 'react';

export function Divider({ orientation = 'horizontal', label, spacing = 'var(--space-6)', style, ...rest }) {
  if (orientation === 'vertical') {
    return <span {...rest} aria-hidden style={{ display: 'inline-block', width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)', margin: `0 ${spacing}`, ...style }} />;
  }
  if (label) {
    return (
      <div {...rest} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', margin: `${spacing} 0`, ...style }}>
        <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        <span style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
      </div>
    );
  }
  return <hr {...rest} style={{ border: 0, height: 1, background: 'var(--border-subtle)', margin: `${spacing} 0`, ...style }} />;
}
