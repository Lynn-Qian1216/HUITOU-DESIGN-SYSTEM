import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Tooltip } from '../overlay/Tooltip.jsx';

export function FormField({ label, hint, error, required, htmlFor, children, style, ...rest }) {
  return (
    <div {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', ...style }}>
      {label || hint ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <label htmlFor={htmlFor} style={{ fontSize: 'var(--type-label-size)', fontWeight: 'var(--type-label-weight)', color: 'var(--text-primary)' }}>
            {label}{required ? <span style={{ color: 'var(--status-danger-fg)', marginLeft: 3 }}>*</span> : null}
          </label>
          {/* Explanatory copy hides behind the label rather than sitting under the control:
              a form of ten fields otherwise reads as twenty lines of grey text. */}
          {hint ? (
            <Tooltip label={hint}>
              <span tabIndex={0} role="note" aria-label={hint} style={{ display: 'inline-flex', color: 'var(--text-tertiary)', cursor: 'help', lineHeight: 0 }}>
                <Icon name="circle-help" size={13} />
              </span>
            </Tooltip>
          ) : null}
        </span>
      ) : null}
      {children}
      {error ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--status-danger-fg)' }}>{error}</span> : null}
    </div>
  );
}
