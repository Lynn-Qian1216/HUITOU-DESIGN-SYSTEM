import React from 'react';
import { Icon } from '../core/Icon.jsx';

const ICONS = { info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'circle-alert', neutral: 'info', ai: 'sparkles' };

export function Toast({ tone = 'neutral', title, description, action, onDismiss, style, ...rest }) {
  return (
    <div role="status" {...rest} style={{
      display: 'flex', gap: 'var(--space-5)', width: 360, padding: 'var(--space-5) var(--space-6)',
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', ...style,
    }}>
      <Icon name={ICONS[tone]} size={16} style={{ color: `var(--status-${tone}-fg)`, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{title}</div>
        {description ? <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginTop: 2 }}>{description}</div> : null}
        {action ? <div style={{ marginTop: 'var(--space-4)' }}>{action}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" aria-label="关闭" onClick={onDismiss} style={{ border: 0, background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0, height: 16 }}>
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </div>
  );
}
