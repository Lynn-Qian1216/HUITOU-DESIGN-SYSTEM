import React from 'react';

export function Switch({ checked, label, description, disabled, onChange, style, ...rest }) {
  return (
    <label {...rest} style={{ display: 'inline-flex', gap: 'var(--space-5)', alignItems: description ? 'flex-start' : 'center', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      <button
        type="button" role="switch" aria-checked={!!checked} disabled={disabled}
        onClick={() => onChange && onChange(!checked)}
        style={{
          flex: 'none', width: 34, height: 20, padding: 2, marginTop: description ? 1 : 0, border: 0,
          borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
          background: disabled ? 'var(--neutral-200)' : checked ? 'var(--neutral-900)' : 'var(--neutral-300)',
          transition: 'background-color var(--duration-fast) var(--ease-standard)',
        }}
      >
        <span style={{
          display: 'block', width: 16, height: 16, borderRadius: 999, background: 'var(--neutral-0)',
          transform: `translateX(${checked ? 14 : 0}px)`, boxShadow: 'var(--shadow-xs)',
          transition: 'transform var(--duration-fast) var(--ease-standard)',
        }} />
      </button>
      {(label || description) ? (
        <span>
          <span style={{ fontSize: 'var(--fs-14)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)' }}>{label}</span>
          {description ? <span style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginTop: 2 }}>{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
