import React from 'react';

export function Popover({ content, placement = 'bottom', width, children, style, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    bottom: { top: 'calc(100% + 6px)', left: 0 },
    top: { bottom: 'calc(100% + 6px)', left: 0 },
    right: { left: 'calc(100% + 6px)', top: 0 },
    left: { right: 'calc(100% + 6px)', top: 0 },
  }[placement];
  return (
    <span {...rest} style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open ? (
        <span style={{
          position: 'absolute', zIndex: 60, width, minWidth: 180, padding: 'var(--space-5) var(--space-6)',
          background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
          fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)', ...pos,
        }}>{content}</span>
      ) : null}
    </span>
  );
}
