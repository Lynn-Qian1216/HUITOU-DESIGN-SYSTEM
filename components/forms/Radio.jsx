import React from 'react';

export function Radio({ checked, label, description, disabled, name, value, onChange, style, ...rest }) {
  return (
    <label {...rest} style={{ display: 'inline-flex', gap: 'var(--space-4)', alignItems: description ? 'flex-start' : 'center', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      <input type="radio" name={name} value={value} checked={!!checked} disabled={disabled} onChange={onChange} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        width: 16, height: 16, marginTop: description ? 2 : 0, borderRadius: 'var(--radius-pill)',
        border: `1px solid ${checked ? 'var(--neutral-900)' : 'var(--border-strong)'}`,
        background: disabled ? 'var(--surface-disabled)' : 'var(--surface-card)', transition: 'var(--transition-control)',
      }}>
        {checked ? <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--neutral-900)' }} /> : null}
      </span>
      <span>
        <span style={{ fontSize: 'var(--fs-14)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)' }}>{label}</span>
        {description ? <span style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginTop: 2 }}>{description}</span> : null}
      </span>
    </label>
  );
}
