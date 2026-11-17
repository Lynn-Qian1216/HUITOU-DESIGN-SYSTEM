import React from 'react';
import { createPortal } from 'react-dom';
import { Avatar } from '../core/Avatar.jsx';
import { Icon } from '../core/Icon.jsx';
import { Dialog } from '../overlay/Dialog.jsx';
import { Button } from '../core/Button.jsx';
import { Input } from '../forms/Input.jsx';
import { FormField } from '../forms/FormField.jsx';

const DEFAULT_ITEMS = [
  { id: 'profile', label: '用户设置', icon: 'user-round' },
  { id: 'team', label: '团队与成员', icon: 'users-round' },
  { id: 'billing', label: '账单与用量', icon: 'receipt-text' },
  { divider: true },
  { id: 'prefs', label: '偏好设置', icon: 'settings' },
  { id: 'help', label: '帮助与反馈', icon: 'life-buoy' },
  { divider: true },
  { id: 'logout', label: '退出登录', icon: 'log-out', tone: 'danger' },
];

/* 侧栏底部的身份区：整行可点，弹出上拉面板。
   「我是谁」和「我在哪个团队」是同一个问题的两半，所以团队名压在用户名下面，
   切换器就在同一个面板里 —— 分成两处会让人以为它们互不相干。 */
export function SidebarAccount({
  name, email, phone, items = DEFAULT_ITEMS, onSelect, bordered = true,
  teams, teamId, onTeamChange, onCreateTeam,
}) {
  const [open, setOpen] = React.useState(false);
  const [naming, setNaming] = React.useState(null);
  const [picker, setPicker] = React.useState(false);
  const trigger = React.useRef(null);
  const menuId = React.useId();
  const [anchor, setAnchor] = React.useState(null);
  /* 菜单挂到 body，避开侧栏宽度动画的 overflow:hidden。
     从触发行计算视口坐标，同时继承控制台的设计变量。 */
  React.useLayoutEffect(() => {
    if (!open || !trigger.current) return;
    const measure = () => {
      const rect = trigger.current.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      const width = Math.min(260, Math.max(0, viewportWidth - 24));
      const computed = getComputedStyle(trigger.current);
      const variables = {};
      for (let i = 0; i < computed.length; i++) {
        const key = computed[i];
        if (key.startsWith('--')) variables[key] = computed.getPropertyValue(key);
      }
      setAnchor({
        left: Math.max(12, Math.min(rect.left, viewportWidth - width - 12)),
        bottom: Math.max(12, viewportHeight - rect.top + 8),
        width, maxHeight: Math.max(0, rect.top - 20), variables,
      });
    };
    const onKey = (event) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.querySelector('button')?.focus(); }
    };
    measure();
    window.addEventListener('resize', measure);
    document.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('resize', measure); document.removeEventListener('keydown', onKey); };
  }, [open]);
  const list = teams || [];
  const team = list.find((t) => t.id === teamId) || list[0];

  return (
    <div style={{ position: 'relative', borderTop: bordered ? '1px solid var(--border-subtle)' : 0, padding: 'var(--space-5)' }}>
      <div ref={trigger}>
        <AccountTrigger name={name} email={email} team={team} open={open} menuId={menuId} onClick={() => setOpen((v) => !v)} />
      </div>

      {open && anchor ? createPortal(
        <div style={anchor.variables}>
          <div onClick={() => { setOpen(false); setNaming(null); }} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
          <div id={menuId} role="dialog" aria-label="账户菜单" data-sidebar-account-menu style={{
            position: 'fixed', left: anchor.left, bottom: anchor.bottom, width: anchor.width, zIndex: 31,
            display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
            maxHeight: anchor.maxHeight, overflow: 'auto',
            background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
              <Avatar name={name} size="md" />
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 'var(--fs-14)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                {email || phone ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email || phone}</span> : null}
              </span>
            </div>

            {list.length ? (
              <div style={{ padding: 'var(--space-3)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
                <button type="button" onClick={() => { setOpen(false); setPicker(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%', padding: '6px var(--space-4)', border: 0, borderRadius: 'var(--radius-md)', background: 'transparent', font: 'inherit', fontSize: 'var(--fs-13)', textAlign: 'left', cursor: 'pointer' }}>
                  <Icon name="users-round" size={14} style={{ flex: 'none', color: 'var(--text-tertiary)' }} />
                  <span style={{ flex: 1, minWidth: 0 }}>切换团队</span>
                  <span style={{ maxWidth: 110, fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(team || {}).name}</span>
                  <Icon name="chevron-right" size={13} style={{ flex: 'none', color: 'var(--text-tertiary)' }} />
                </button>
              </div>
            ) : null}

            <div style={{ padding: 'var(--space-3)' }}>
              {items.map((it, i) => it.divider ? (
                <div key={'d' + i} style={{ height: 1, background: 'var(--border-subtle)', margin: 'var(--space-3) 0' }} />
              ) : (
                <MenuRow key={it.id} item={it} onClick={() => { setOpen(false); onSelect && onSelect(it.id); }} />
              ))}
            </div>
          </div>
        </div>, document.body
      ) : null}

      {/* 两个弹窗都走 Dialog：蒙版、层级、圆角、阴影、关闭按钮与页脚槽都在它身上，
          自己搭一套会和 app 里其他弹窗长得不一样，层级也压不住真 Dialog */}
      <Dialog open={picker} width={420} title="切换团队"
        description="团队决定你能看到哪些广告账户。切换后账户列表与广告计划都会跟着变。"
        onClose={() => setPicker(false)}
        footer={<Button variant="ghost" iconLeft="plus" onClick={() => { setPicker(false); setNaming(''); }}>创建团队</Button>}>
        <div style={{ display: 'flex', flexDirection: 'column', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {list.map((t, i) => (
            <button key={t.id} type="button" onClick={() => { onTeamChange && onTeamChange(t.id); setPicker(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%', padding: 'var(--space-5)', borderWidth: 0, borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: t.id === (team || {}).id ? 'var(--surface-selected)' : 'transparent', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 'var(--fs-14)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{(t.accounts || []).length} 个广告账户</span>
              </span>
              {t.id === (team || {}).id ? <Icon name="check" size={15} style={{ flex: 'none' }} /> : null}
            </button>
          ))}
        </div>
      </Dialog>

      <Dialog open={naming != null && !picker} width={420} title="创建团队" onClose={() => setNaming(null)}
        footer={<>
          <Button onClick={() => setNaming(null)}>取消</Button>
          <Button variant="primary" disabled={!naming || !naming.trim()}
            onClick={() => { if (naming.trim() && onCreateTeam) onCreateTeam(naming.trim()); setNaming(null); }}>创建</Button>
        </>}>
        <FormField label="团队名称" hint="创建后你是该团队的拥有者，可再邀请成员、分配广告账户。">
          <Input autoFocus value={naming || ''} placeholder="例如：王小卤 · 电商投放" onChange={(e) => setNaming(e.target.value)} />
        </FormField>
      </Dialog>
    </div>
  );
}

function MenuRow({ item, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%', padding: '6px var(--space-4)',
        border: 0, borderRadius: 'var(--radius-md)', font: 'inherit', fontSize: 'var(--fs-13)', textAlign: 'left', cursor: 'pointer',
        background: hover ? 'var(--surface-hover)' : 'transparent',
        color: item.tone === 'danger' ? 'var(--status-danger-fg)' : 'var(--text-primary)',
      }}>
      {item.icon ? <Icon name={item.icon} size={14} style={{ flex: 'none', color: item.tone === 'danger' ? 'currentColor' : 'var(--text-tertiary)' }} /> : null}
      <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
    </button>
  );
}

function AccountTrigger({ name, email, team, open, onClick, menuId }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick} aria-expanded={open} aria-controls={open ? menuId : undefined} aria-haspopup="dialog"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%', minWidth: 0,
        padding: 'var(--space-3) var(--space-4)', border: 0, borderRadius: 'var(--radius-md)',
        cursor: 'pointer', boxSizing: 'border-box', font: 'inherit', textAlign: 'left',
        background: open || hover ? 'var(--surface-hover)' : 'transparent',
        transition: 'var(--transition-control)',
      }}>
      <Avatar name={name} size="md" />
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 'var(--fs-14)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team ? team.name : email}</span>
      </span>
      <Icon name="chevrons-up-down" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
    </button>
  );
}
