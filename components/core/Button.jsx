import React from 'react';
import { Icon } from './Icon.jsx';

const HEIGHTS = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PADS = { sm: '0 10px', md: '0 14px', lg: '0 18px' };
const FONTS = { sm: 'var(--fs-13)', md: 'var(--fs-14)', lg: 'var(--fs-14)' };

const VARIANTS = {
  primary: { background: 'var(--action-primary-bg)', color: 'var(--action-primary-fg)', borderColor: 'var(--action-primary-bg)' },
  secondary: { background: 'var(--action-secondary-bg)', color: 'var(--action-secondary-fg)', borderColor: 'var(--border-default)' },
  ghost: { background: 'transparent', color: 'var(--text-primary)', borderColor: 'transparent' },
  danger: { background: 'var(--action-danger-bg)', color: 'var(--text-inverse)', borderColor: 'var(--action-danger-bg)' },
  link: { background: 'transparent', color: 'var(--text-link)', borderColor: 'transparent', padding: 0, height: 'auto' },
};
const HOVERS = {
  primary: 'var(--action-primary-bg-hover)', secondary: 'var(--action-secondary-bg-hover)',
  ghost: 'var(--action-ghost-bg-hover)', danger: 'var(--action-danger-bg-hover)', link: 'transparent',
};

export function Button({ variant = 'secondary', size = 'md', iconLeft, iconRight, loading, disabled, fullWidth, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [keyFocus, setKeyFocus] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.secondary;
  const off = disabled || loading;
  return (
    <button
      type="button" disabled={off}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={(e) => { try { setKeyFocus(e.currentTarget.matches(':focus-visible')); } catch { setKeyFocus(false); } }}
      onBlur={() => setKeyFocus(false)}
      {...rest}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)',
        height: HEIGHTS[size], padding: PADS[size], fontSize: FONTS[size],
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-normal)',
        borderWidth: '1px', borderStyle: 'solid',
        borderRadius: 'var(--radius-control)', cursor: off ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)', width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap', outline: 'none',
        boxShadow: keyFocus && !off ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--border-strong)' : undefined, ...v,
        ...(hover && !off ? { background: HOVERS[variant], borderColor: variant === 'secondary' ? 'var(--border-default)' : variant === 'link' || variant === 'ghost' ? 'transparent' : HOVERS[variant], textDecoration: variant === 'link' ? 'underline' : undefined } : null),
        ...(off ? { background: variant === 'primary' || variant === 'danger' ? 'var(--neutral-300)' : 'var(--surface-disabled)', color: 'var(--text-disabled)', borderColor: 'transparent' } : null),
        ...style,
      }}
    >
      {loading ? <Icon name="loader-circle" size={14} style={{ animation: 'huitou-spin 700ms linear infinite' }} /> : iconLeft ? <Icon name={iconLeft} size={size === 'sm' ? 14 : 16} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={size === 'sm' ? 14 : 16} /> : null}
    </button>
  );
}
