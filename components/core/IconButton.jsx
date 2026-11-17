import React from 'react';
import { Icon } from './Icon.jsx';

const SIZES = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };

export function IconButton({ icon, label, variant = 'ghost', size = 'md', active, disabled, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [keyFocus, setKeyFocus] = React.useState(false);
  const bg = disabled ? 'transparent' : active ? 'var(--surface-active)' : hover ? 'var(--surface-hover)' : variant === 'secondary' ? 'var(--surface-card)' : 'transparent';
  return (
    <button
      type="button" aria-label={label} title={label} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={(e) => { try { setKeyFocus(e.currentTarget.matches(':focus-visible')); } catch { setKeyFocus(false); } }}
      onBlur={() => setKeyFocus(false)}
      {...rest}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: SIZES[size], height: SIZES[size], padding: 0, background: bg,
        color: disabled ? 'var(--text-disabled)' : active ? 'var(--text-primary)' : 'var(--text-secondary)',
        borderWidth: '1px', borderStyle: 'solid',
        borderColor: variant === 'secondary' ? 'var(--border-default)' : 'transparent',
        borderRadius: 'var(--radius-control)', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)', outline: 'none',
        boxShadow: keyFocus && !disabled ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--border-strong)' : undefined, ...style,
      }}
    >
      <Icon name={icon} size={size === 'sm' ? 14 : 16} />
    </button>
  );
}
