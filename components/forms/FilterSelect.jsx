import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { AnchoredPanel } from '../overlay/AnchoredPanel.jsx';

/* 带计数的筛选下拉：每项右侧给出命中行数。
   命中 0 的项不隐藏、只置灰不可选 —— 选项列表随数据跳动会让人怀疑自己看错了。
   计数应由调用方从明细 reduce 推导，不要写常量。 */

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };

export function FilterSelect({ options = [], value, onChange, size = 'md', width, disabled, style }) {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const trigger = React.useRef(null);

  const items = options.map((o) => (typeof o === 'string' ? { label: o } : o));
  const fs = size === 'sm' ? 'var(--fs-13)' : 'var(--fs-14)';

  return (
    <div style={Object.assign({ width: width || 'auto', flex: 'none' }, style)}>
      <button ref={trigger} type="button" disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-4)', width: '100%', height: H[size],
          padding: '0 var(--space-5)', font: 'inherit', fontSize: fs, textAlign: 'left',
          background: disabled ? 'var(--surface-disabled)' : hover || open ? 'var(--surface-hover)' : 'var(--surface-card)',
          borderWidth: 1, borderStyle: 'solid',
          borderColor: open ? 'var(--border-strong)' : 'var(--border-default)',
          borderRadius: 'var(--radius-field)',
          color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
          cursor: disabled ? 'not-allowed' : 'pointer', transition: 'var(--transition-control)',
        }}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <Icon name="chevron-down" size={14} style={{ color: 'var(--text-tertiary)' }} />
      </button>

      {open ? (
        <AnchoredPanel anchor={trigger} matchWidth onClose={() => setOpen(false)}
          style={{ padding: 'var(--space-2)', maxHeight: 280, overflowY: 'auto' }}>
          {items.map((o) => {
            const empty = o.count === 0;
            const on = o.label === value;
            return (
              <button key={o.label} type="button" disabled={empty}
                onClick={() => { if (!empty) { setOpen(false); if (onChange) onChange(o.label); } }}
                onMouseEnter={(e) => { if (!empty) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = on ? 'var(--surface-selected)' : 'transparent'; }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%', height: 30,
                  padding: '0 var(--space-5)', border: 0, borderRadius: 'var(--radius-xs)',
                  font: 'inherit', fontSize: 'var(--fs-13)', textAlign: 'left',
                  background: on ? 'var(--surface-selected)' : 'transparent',
                  color: empty ? 'var(--text-disabled)' : 'var(--text-primary)',
                  fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)',
                  cursor: empty ? 'not-allowed' : 'pointer', transition: 'var(--transition-control)',
                }}>
                <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap' }}>{o.label}</span>
                {typeof o.count === 'number' ? (
                  <span style={{ fontSize: 'var(--fs-12)', color: empty ? 'var(--text-disabled)' : 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{o.count}</span>
                ) : null}
              </button>
            );
          })}
        </AnchoredPanel>
      ) : null}
    </div>
  );
}
