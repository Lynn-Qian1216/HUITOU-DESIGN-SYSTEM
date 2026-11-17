import React from 'react';

export function ProgressBar({ value = 0, label, showValue, tone = 'default', size = 'md', style, ...rest }) {
  const pct = Math.max(0, Math.min(100, value));
  const fill = tone === 'default' ? 'var(--neutral-900)' : `var(--status-${tone}-fg)`;
  return (
    <div {...rest} style={{ ...style }}>
      {(label || showValue) ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
          <span>{label}</span>
          {showValue ? <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{pct.toFixed(0)}%</span> : null}
        </div>
      ) : null}
      <div role="progressbar" aria-valuenow={pct} style={{ height: size === 'sm' ? 4 : 6, background: 'var(--neutral-100)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: fill, borderRadius: 999, transition: 'width var(--duration-slow) var(--ease-standard)' }} />
      </div>
    </div>
  );
}
