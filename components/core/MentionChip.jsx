import React from 'react';
import { Icon } from './Icon.jsx';

/* 提问时引用的对象：智能体、广告、商品、素材、达人、账户。
   胶囊分成两段 —— 左边是类型，右边是名字。只写名字的话，「藤椒味」既可能是商品也可能是素材。
   智能体走紫（全系统只有它代表机器在替你做事），其余一律中性：一排胶囊里五种颜色等于没有颜色。 */

export const MENTION_KINDS = {
  agent: { label: '智能体', icon: 'bot', ai: true },
  campaign: { label: '广告', icon: 'megaphone' },
  product: { label: '商品', icon: 'package' },
  creative: { label: '素材', icon: 'clapperboard' },
  creator: { label: '达人', icon: 'user-round' },
  account: { label: '账户', icon: 'building-2' },
};

export function MentionChip({ kind = 'campaign', label, size = 'md', onRemove, onClick, style }) {
  const k = MENTION_KINDS[kind] || MENTION_KINDS.campaign;
  const h = size === 'sm' ? 24 : 28;
  const [hover, setHover] = React.useState(false);
  return (
    <span onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={Object.assign({
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', height: h, flex: 'none',
      padding: onRemove ? '0 var(--space-4) 0 var(--space-5)' : '0 var(--space-5)',
      borderWidth: 1, borderStyle: 'solid',
      borderTopColor: k.ai ? 'var(--status-ai-border)' : hover ? 'var(--border-default)' : 'var(--border-subtle)',
      borderRightColor: k.ai ? 'var(--status-ai-border)' : hover ? 'var(--border-default)' : 'var(--border-subtle)',
      borderBottomColor: k.ai ? 'var(--status-ai-border)' : hover ? 'var(--border-default)' : 'var(--border-subtle)',
      borderLeftColor: k.ai ? 'var(--status-ai-border)' : hover ? 'var(--border-default)' : 'var(--border-subtle)',
      backgroundColor: k.ai ? 'var(--status-ai-bg)' : hover ? 'var(--surface-hover)' : 'var(--surface-card)',
      borderRadius: 'var(--radius-md)', fontSize: size === 'sm' ? 'var(--fs-12)' : 'var(--fs-13)',
      whiteSpace: 'nowrap', maxWidth: 260, cursor: onClick ? 'pointer' : 'default',
      transition: 'var(--transition-control)',
    }, style)}>
      <span style={{ color: k.ai ? 'var(--status-ai-fg)' : 'var(--text-tertiary)', flex: 'none' }}>@</span>
      <span style={{ color: k.ai ? 'var(--status-ai-fg)' : 'var(--text-secondary)', flex: 'none' }}>{k.label}</span>
      <span style={{ width: 1, height: 12, background: 'var(--border-default)', flex: 'none' }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      {onRemove ? (
        <button type="button" aria-label={'移除 ' + label} onClick={(e) => { e.stopPropagation(); onRemove(); }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--surface-active)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          style={{ display: 'inline-flex', border: 0, backgroundColor: 'transparent', padding: 2, borderRadius: 'var(--radius-xs)', cursor: 'pointer', color: 'var(--text-tertiary)', flex: 'none', transition: 'var(--transition-control)' }}>
          <Icon name="x" size={12} />
        </button>
      ) : null}
    </span>
  );
}
