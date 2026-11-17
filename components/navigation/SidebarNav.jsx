import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function SidebarNav({ sections = [], activeId, onSelect, collapsed, footer, header, style, ...rest }) {
  return (
    <nav {...rest} style={{
      display: 'flex', flexDirection: 'column',
      width: collapsed ? 'var(--layout-sidebar-collapsed-w)' : 'var(--layout-sidebar-w)',
      flex: 'none', height: '100%', background: 'var(--surface-card)',
      borderRight: '1px solid var(--border-subtle)', transition: 'width var(--duration-normal) var(--ease-standard)',
      overflow: 'hidden', ...style,
    }}>
      {header ? <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-4)' }}>{header}</div> : null}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--space-4)' }}>
        {sections.map((s, si) => (
          <div key={si} style={{ marginBottom: 'var(--space-6)' }}>
            {s.label && !collapsed ? (
              <div style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)', padding: '0 var(--space-4) var(--space-4)' }}>{s.label}</div>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {s.items.map((it) => {
                const on = it.id === activeId;
                return (
                  <button key={it.id} type="button" title={collapsed ? it.label : undefined} onClick={() => onSelect && onSelect(it.id)}
                    style={{
                      position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-5)',
                      height: 32, padding: collapsed ? '0 var(--space-4)' : '0 var(--space-4)', border: 0,
                      background: on ? 'var(--surface-selected)' : 'transparent',
                      color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)',
                      borderRadius: 'var(--radius-sm)', font: 'inherit', fontSize: 'var(--fs-13)',
                      cursor: 'pointer', textAlign: 'left', transition: 'var(--transition-control)', width: '100%',
                    }}>
                    <Icon name={it.icon} size={16} />
                    {!collapsed ? <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span> : null}
                    {!collapsed && it.badge ? <span style={{ fontSize: 'var(--fs-11)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{it.badge}</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {footer ? <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>{footer}</div> : null}
    </nav>
  );
}
