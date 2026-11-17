import React from 'react';
import { Icon } from '../core/Icon.jsx';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };

export function Input({ size = 'md', iconLeft, suffix, invalid, disabled, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
      height: H[size], padding: '0 var(--space-5)',
      background: disabled ? 'var(--surface-disabled)' : 'var(--surface-card)',
      border: `1px solid var(--border-${invalid ? 'default' : 'default'})`,
      borderColor: invalid ? 'var(--status-danger-fg)' : focus ? 'var(--border-strong)' : 'var(--border-default)',
      borderRadius: 'var(--radius-field)', transition: 'var(--transition-control)',
      ...style,
    }}>
      {iconLeft ? <Icon name={iconLeft} size={14} style={{ color: 'var(--text-tertiary)' }} /> : null}
      <input
        disabled={disabled} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} {...rest}
        style={{
          flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent',
          font: 'inherit', fontSize: size === 'sm' ? 'var(--fs-13)' : 'var(--fs-14)',
          color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
        }}
      />
      {suffix ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{suffix}</span> : null}
    </div>
  );
}
