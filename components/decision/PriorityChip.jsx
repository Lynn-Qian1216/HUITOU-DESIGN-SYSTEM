import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* AI 决策卡上的几枚定语标记。都做成独立组件是因为决策详情页、队列卡、历史列表
   要显示同一个级别／时效，散在三处手写迟早会各写各的颜色。 */

const PRIORITY = {
  高: { fg: 'var(--status-danger-fg)', bg: 'var(--status-danger-bg)', bd: 'var(--status-danger-border)' },
  中: { fg: 'var(--status-warning-fg)', bg: 'var(--status-warning-bg)', bd: 'var(--status-warning-border)' },
  低: { fg: 'var(--text-link)', bg: 'var(--blue-50)', bd: 'var(--blue-100)' },
};

/* 级别用一个字的方章，不用整词徽标 —— 一列卡片左上角要对齐，宽度必须固定。 */
export function PriorityChip({ level = '中', style }) {
  const p = PRIORITY[level] || PRIORITY.中;
  return (
    <span style={Object.assign({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, height: 22,
      padding: '0 5px', borderRadius: 'var(--radius-xs)', flex: 'none',
      background: p.bg, borderWidth: 1, borderStyle: 'solid', borderColor: p.bd,
      color: p.fg, fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)',
    }, style)}>{level}</span>
  );
}

/* 失效时间：只在决策还等着人处理时才挂出来。已经处理完的决策再提醒「今天 19:00 后失效」
   只会让人以为还要做点什么。 */
export function ExpiryChip({ label, style }) {
  return (
    <span style={Object.assign({
      display: 'inline-flex', alignItems: 'center', gap: 5, height: 26, padding: '0 var(--space-5)',
      borderRadius: 'var(--radius-pill)', background: 'var(--status-warning-bg)',
      borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--status-warning-border)',
      color: 'var(--status-warning-fg)', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap',
    }, style)}>
      <Icon name="clock" size={12} />{label}
    </span>
  );
}

/* 「标签：值」的只读小片，用在决策详情头部铺一排上下文（所属计划、策略来源…）。
   值会截断，标签不会 —— 截掉标签的话这一片就读不懂了。 */
export function MetaChip({ label, value, style }) {
  return (
    <span style={Object.assign({
      display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: '100%', minWidth: 0, height: 26, padding: '0 var(--space-5)',
      background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
      borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)',
    }, style)}>
      <span style={{ flex: 'none', whiteSpace: 'nowrap' }}>{label}：</span>
      <span style={{ minWidth: 0, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </span>
  );
}

/* 终态结论一句话。回滚走 danger 而不是中性 —— 「执行了又退回来」和「顺利完成」
   在账面上是两回事，不该长得一样。 */
export function ResultNote({ result = 'pending', text, style }) {
  const tone = result === 'success' ? 'success' : result === 'revert' ? 'danger' : 'neutral';
  return (
    <span style={Object.assign({
      display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--fs-12)', color: 'var(--status-' + tone + '-fg)',
    }, style)}>
      <Icon name={result === 'success' ? 'circle-check' : result === 'revert' ? 'undo-2' : 'clock'} size={13} />{text}
    </span>
  );
}
