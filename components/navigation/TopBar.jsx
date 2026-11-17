import React from 'react';

export function TopBar({ left, title, actions, sticky = true, style, ...rest }) {
  return (
    <header {...rest} style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-6)',
      height: 'var(--layout-topbar-h)', flex: 'none', padding: '0 var(--gutter-page)',
      background: 'rgba(255,255,255,.92)', backdropFilter: 'var(--blur-scrim)',
      borderBottom: '1px solid var(--border-subtle)',
      position: sticky ? 'sticky' : undefined, top: sticky ? 0 : undefined, zIndex: 20, ...style,
    }}>
      {left}
      {title ? <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{title}</div> : null}
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>{actions}</div>
    </header>
  );
}
