import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';

export function DataTable({ columns = [], rows = [], selectable, selected = [], onToggleRow, dense, footer, style, ...rest }) {
  const pad = dense ? '8px var(--space-5)' : '12px var(--space-6)';
  return (
    <div {...rest} style={{ width: '100%', overflowX: 'auto', ...style }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
        <thead>
          <tr>
            {selectable ? <th style={{ width: 36, padding: pad, borderBottom: '1px solid var(--border-subtle)', background: 'var(--neutral-25)' }} /> : null}
            {columns.map((c) => (
              <th key={c.key} style={{
                padding: pad, textAlign: c.align || 'left', whiteSpace: 'nowrap',
                fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--neutral-25)',
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start' }}>
                  {c.header}
                  {c.sorted ? <Icon name={c.sorted === 'asc' ? 'arrow-up' : 'arrow-down'} size={12} /> : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => {
            const on = selected.includes(r.id);
            return (
              <tr key={r.id || ri} style={{ background: on ? 'var(--surface-selected)' : 'transparent' }}>
                {selectable ? (
                  <td style={{ padding: pad, borderBottom: '1px solid var(--border-subtle)' }}>
                    <Checkbox checked={on} onChange={() => onToggleRow && onToggleRow(r.id)} />
                  </td>
                ) : null}
                {columns.map((c) => (
                  <td key={c.key} style={{
                    padding: pad, textAlign: c.align || 'left',
                    borderBottom: '1px solid var(--border-subtle)',
                    fontFamily: c.mono ? 'var(--font-mono)' : 'inherit',
                    fontVariantNumeric: c.align === 'right' ? 'tabular-nums' : undefined,
                    color: c.muted ? 'var(--text-secondary)' : 'var(--text-primary)',
                    whiteSpace: c.wrap ? 'normal' : 'nowrap',
                  }}>
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {footer ? <div style={{ padding: 'var(--space-5) var(--space-6)', borderTop: '1px solid var(--border-subtle)' }}>{footer}</div> : null}
    </div>
  );
}
