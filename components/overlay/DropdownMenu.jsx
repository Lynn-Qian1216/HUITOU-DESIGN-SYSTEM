import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { AnchoredPanel } from './AnchoredPanel.jsx';

/* 面板走 AnchoredPanel（fixed 定位）—— 表格行、列表卡片都带 overflow，absolute 的菜单会被裁掉。 */
/* 面板走 AnchoredPanel（fixed 定位）—— 表格行、列表卡片都带 overflow，absolute 的菜单会被裁掉。
   block：触发器占满宽度（侧栏底部账号行这类整行可点的情形）。 */
export function DropdownMenu({ items = [], align = 'left', trigger, onSelect, block, style, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const anchor = React.useRef(null);
  const full = block || (style && (style.width === '100%' || style.display === 'block'));
  return (
    <span {...rest} style={{ display: full ? 'block' : 'inline-flex', width: full ? '100%' : undefined, ...style }}>
      <span ref={anchor} onClick={() => setOpen((o) => !o)} style={{ display: full ? 'flex' : 'inline-flex', width: full ? '100%' : undefined }}>{trigger}</span>
      {open ? (
        <AnchoredPanel anchor={anchor} align={align} onClose={() => setOpen(false)}
          style={Object.assign({ padding: 'var(--space-2)', borderColor: 'var(--border-subtle)' }, full ? null : { minWidth: 190 })} matchWidth={full}>
          <div role="menu">
            {items.map((it, i) => it.divider ? (
              <span key={i} style={{ display: 'block', height: 1, background: 'var(--border-subtle)', margin: 'var(--space-2) 0' }} />
            ) : (
              <button key={i} type="button" role="menuitem" disabled={it.disabled}
                onClick={() => { setOpen(false); onSelect ? onSelect(it.id) : it.onClick && it.onClick(); }}
                onMouseEnter={(e) => { if (!it.disabled) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%', height: 30,
                  padding: '0 var(--space-5)', border: 0, background: 'transparent', borderRadius: 'var(--radius-xs)',
                  font: 'inherit', fontSize: 'var(--fs-13)', textAlign: 'left', cursor: it.disabled ? 'not-allowed' : 'pointer',
                  color: it.disabled ? 'var(--text-disabled)' : it.tone === 'danger' ? 'var(--status-danger-fg)' : 'var(--text-primary)',
                }}>
                {it.icon ? <Icon name={it.icon} size={14} style={{ color: 'var(--text-tertiary)' }} /> : null}
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.shortcut ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{it.shortcut}</span> : null}
              </button>
            ))}
          </div>
        </AnchoredPanel>
      ) : null}
    </span>
  );
}
