import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { MentionChip } from '../core/MentionChip.jsx';

/* 排队待发的提问。上一条还在生成时继续输入，新的一条落到这里，
   生成结束后按顺序自动发出。放在输入框正上方 —— 队列是「我刚说的话去哪了」的答案，
   离输入的地方越近越好。每条都能改、能删、能插到最前，否则排队就变成了失控。 */
export function PromptQueue({ items = [], onEdit, onRemove, onClear, onPromote, visible = 3, note }) {
  const [open, setOpen] = React.useState(false);
  if (!items.length) return null;
  const shown = open ? items : items.slice(0, visible);
  const rest = items.length - shown.length;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-sunken, var(--neutral-50))', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
        padding: 'var(--space-3) var(--space-5)', minHeight: 30,
      }}>
        <Icon name="list-ordered" size={13} style={{ color: 'var(--text-tertiary)' }} />
        <span style={{ fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>
          队列中 {items.length} 条
        </span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {note || '当前回答结束后依次发送'}
        </span>
        <div style={{ flex: 1 }} />
        {onClear ? <QueueAction icon="trash-2" label="清空队列" onClick={onClear} /> : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {shown.map((it, i) => (
          <QueueRow key={it.id != null ? it.id : i} index={i + 1} item={it}
            onEdit={onEdit} onRemove={onRemove} onPromote={i > 0 ? onPromote : null} />
        ))}
      </div>
      {rest > 0 || open ? (
        <button type="button" onClick={() => setOpen(!open)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)',
            border: 0, borderTop: '1px solid var(--border-subtle)', background: 'transparent',
            padding: 'var(--space-3)', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)',
            font: 'inherit', fontFamily: 'inherit', cursor: 'pointer',
          }}>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={13} />
          {open ? '收起' : '还有 ' + rest + ' 条'}
        </button>
      ) : null}
    </div>
  );
}

function QueueRow({ index, item, onEdit, onRemove, onPromote }) {
  const [hover, setHover] = React.useState(false);
  const refs = item.mentions || [];
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)',
        padding: 'var(--space-4) var(--space-5)',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: hover ? 'var(--surface-hover)' : 'transparent',
        transition: 'var(--transition-control)',
      }}>
      <span style={{
        flex: 'none', width: 18, height: 18, marginTop: 1, borderRadius: 'var(--radius-pill)',
        display: 'grid', placeItems: 'center',
        background: 'var(--neutral-200)', color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)', fontSize: 10, fontVariantNumeric: 'tabular-nums',
      }}>{index}</span>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{
          fontSize: 'var(--fs-13)', color: 'var(--text-primary)', lineHeight: 'var(--lh-snug)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{item.body}</div>
        {refs.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {refs.slice(0, 3).map((m, i) => <MentionChip key={i} kind={m.kind} label={m.label} size="sm" />)}
            {refs.length > 3 ? <span style={{ alignSelf: 'center', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>+{refs.length - 3}</span> : null}
          </div>
        ) : null}
      </div>
      {/* 删除常驻：排错了要能立刻撤掉，不该藏在 hover 后面。调整方向用文字按钮，与「删除」区分权重 */}
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {onPromote ? <QueueAction icon="chevrons-up" label="插到最前" onClick={() => onPromote(item)} dim={!hover} /> : null}
        {onEdit ? <QueueTextAction label="调整方向" onClick={() => onEdit(item)} /> : null}
        {onRemove ? <QueueAction icon="trash-2" label="删除" onClick={() => onRemove(item)} danger /> : null}
      </div>
    </div>
  );
}

function QueueTextAction({ label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 var(--space-4)',
        borderWidth: 1, borderStyle: 'solid',
        borderTopColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        borderRightColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        borderBottomColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        borderLeftColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        borderRadius: 'var(--radius-md)', cursor: 'pointer', whiteSpace: 'nowrap',
        backgroundColor: hover ? 'var(--surface-hover)' : 'var(--surface-card)',
        color: hover ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontFamily: 'inherit', fontSize: 'var(--fs-12)',
        transition: 'var(--transition-control)',
      }}>{label}</button>
  );
}

function QueueAction({ icon, label, onClick, danger, dim }) {
  const [hover, setHover] = React.useState(false);
  const idle = danger ? 'var(--text-secondary)' : 'var(--text-tertiary)';
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-grid', placeItems: 'center', width: 22, height: 22,
        border: 0, borderRadius: 'var(--radius-xs)', cursor: 'pointer',
        opacity: dim && !hover ? 0 : 1,
        backgroundColor: hover ? (danger ? 'var(--status-danger-bg)' : 'var(--surface-active)') : 'transparent',
        color: hover ? (danger ? 'var(--status-danger-fg)' : 'var(--text-primary)') : idle,
        transition: 'var(--transition-control)',
      }}>
      <Icon name={icon} size={13} />
    </button>
  );
}
