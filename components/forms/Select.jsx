import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { AnchoredPanel } from '../overlay/AnchoredPanel.jsx';

/* 自绘下拉，不用原生 <select> —— 原生列表在 Windows 上是系统外观，
   跟同一排的筛选控件对不上，也没法给选项加计数、图标这类东西。
   面板样式与 DropdownMenu / FilterSelect 一致：内缩 space-2、行高 30、radius-xs。
   onChange 仍按事件形状回调（{ target: { value } }），旧的 e.target.value 写法不用改。 */

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };

export function Select({ options = [], value, onChange, placeholder, size = 'md', width, disabled, style }) {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const trigger = React.useRef(null);

  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const current = items.find((o) => o.value === value);
  const shown = current ? current.label : placeholder || (items[0] ? items[0].label : '');
  const fs = size === 'sm' ? 'var(--fs-13)' : 'var(--fs-14)';

  return (
    <div style={Object.assign({ display: 'inline-flex', width: width || 'auto' }, style)}>
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
          color: disabled ? 'var(--text-disabled)' : current || !placeholder ? 'var(--text-primary)' : 'var(--text-tertiary)',
          cursor: disabled ? 'not-allowed' : 'pointer', transition: 'var(--transition-control)',
        }}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shown}</span>
        <Icon name="chevron-down" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
      </button>

      {open ? (
        <AnchoredPanel anchor={trigger} matchWidth onClose={() => setOpen(false)}
          style={{ padding: 'var(--space-2)', maxHeight: 280, overflowY: 'auto' }}>
          {items.map((o) => {
            const on = o.value === value;
            return (
              <button key={o.value} type="button" role="option" aria-selected={on} disabled={o.disabled}
                onClick={() => { if (o.disabled) return; setOpen(false); if (onChange) onChange({ target: { value: o.value } }); }}
                onMouseEnter={(e) => { if (!o.disabled) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = on ? 'var(--surface-selected)' : 'transparent'; }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%', height: 30,
                  padding: '0 var(--space-5)', border: 0, borderRadius: 'var(--radius-xs)',
                  font: 'inherit', fontSize: 'var(--fs-13)', textAlign: 'left',
                  background: on ? 'var(--surface-selected)' : 'transparent',
                  color: o.disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
                  fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)',
                  cursor: o.disabled ? 'not-allowed' : 'pointer', transition: 'var(--transition-control)',
                }}>
                <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap' }}>{o.label}</span>
              </button>
            );
          })}
        </AnchoredPanel>
      ) : null}
    </div>
  );
}
