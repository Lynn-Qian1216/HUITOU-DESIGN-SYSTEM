import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

export function Dialog({ open = true, title, description, footer, width = 480, onClose, children, style, ...rest }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-overlay)', padding: 'var(--space-8)' }} onClick={onClose}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} {...rest} style={{
        width, maxWidth: '100%', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-panel)', boxShadow: 'var(--shadow-overlay)', overflow: 'hidden', ...style,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)', padding: 'var(--space-8) var(--space-8) 0' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)' }}>{title}</h2>
            {description ? <p style={{ margin: '6px 0 0', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>{description}</p> : null}
          </div>
          {onClose ? <IconButton icon="x" label="关闭" size="sm" onClick={onClose} /> : null}
        </div>
        {children ? <div style={{ padding: 'var(--space-7) var(--space-8)' }}>{children}</div> : <div style={{ height: 'var(--space-7)' }} />}
        {footer ? <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)', padding: 'var(--space-6) var(--space-8)', borderTop: '1px solid var(--border-subtle)', background: 'var(--neutral-25)' }}>{footer}</div> : null}
      </div>
    </div>
  );
}
