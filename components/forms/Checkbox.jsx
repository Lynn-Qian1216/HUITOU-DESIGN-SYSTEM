import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Checkbox({ checked, indeterminate, label, description, disabled, onChange, style, ...rest }) {
  const on = checked || indeterminate;
  return (
    <label {...rest} style={{ display: 'inline-flex', gap: 'var(--space-4)', alignItems: description ? 'flex-start' : 'center', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={onChange} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        width: 16, height: 16, marginTop: description ? 2 : 0, borderRadius: 'var(--radius-xs)',
        border: `1px solid ${on ? (disabled ? 'var(--neutral-500)' : 'var(--neutral-900)') : 'var(--border-strong)'}`,
        /* 锁定但已勾选时保留深色填充 —— 否则白勾落在近白底上，看起来像未勾选 */
        background: on ? (disabled ? 'var(--neutral-500)' : 'var(--neutral-900)') : disabled ? 'var(--surface-disabled)' : 'var(--surface-card)',
        color: 'var(--text-inverse)', transition: 'var(--transition-control)',
      }}>
        {indeterminate ? <span style={{ width: 8, height: 1.5, background: 'currentColor' }} /> : checked ? <Icon name="check" size={12} /> : null}
      </span>
      <span>
        <span style={{ fontSize: 'var(--fs-14)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)' }}>{label}</span>
        {description ? <span style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginTop: 2 }}>{description}</span> : null}
      </span>
    </label>
  );
}
