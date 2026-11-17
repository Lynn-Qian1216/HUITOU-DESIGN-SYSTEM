import React from 'react';

export function SegmentedControl({ options = [], value, onChange, size = 'md', style, ...rest }) {
  const h = size === 'sm' ? 'var(--control-h-sm)' : 'var(--control-h-md)';
  return (
    <div role="tablist" {...rest} style={{
      display: 'inline-flex', gap: 2, padding: 2, height: `calc(${h} + 4px)`,
      background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)', ...style,
    }}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        const on = opt.value === value;
        return (
          <button key={opt.value} type="button" role="tab" aria-selected={on} onClick={() => onChange && onChange(opt.value)}
            style={{
              padding: '0 var(--space-5)', height: '100%', border: 0, borderRadius: 'var(--radius-sm)',
              background: on ? 'var(--surface-card)' : 'transparent',
              boxShadow: on ? 'var(--shadow-xs)' : 'none',
              color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
              font: 'inherit', fontSize: size === 'sm' ? 'var(--fs-12)' : 'var(--fs-13)', fontWeight: 'var(--fw-medium)',
              cursor: 'pointer', transition: 'var(--transition-control)', whiteSpace: 'nowrap',
            }}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
