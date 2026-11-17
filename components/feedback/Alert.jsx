import React from 'react';
import { Icon } from '../core/Icon.jsx';

const ICONS = { info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'circle-alert', neutral: 'info', ai: 'sparkles' };

export function Alert({ tone = 'info', title, action, onDismiss, children, style, ...rest }) {
  return (
    <div role="status" {...rest} style={{
      display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-5) var(--space-6)',
      background: `var(--status-${tone}-bg)`, border: `1px solid var(--status-${tone}-border)`,
      borderRadius: 'var(--radius-md)', ...style,
    }}>
      <Icon name={ICONS[tone]} size={16} style={{ color: `var(--status-${tone}-fg)`, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>{title}</div> : null}
        {children ? <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: title ? 3 : 0 }}>{children}</div> : null}
        {action ? <div style={{ marginTop: 'var(--space-5)' }}>{action}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" aria-label="关闭" onClick={onDismiss} style={{ border: 0, background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0, height: 16 }}>
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </div>
  );
}
