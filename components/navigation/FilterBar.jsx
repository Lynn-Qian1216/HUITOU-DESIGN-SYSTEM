import React from 'react';

/* 列表页筛选条：左侧一排筛选控件，trailing 的内容被推到右缘。
   自己写 flex + margin-left:auto 的地方太多，收成一个容器，顺便统一 gap 与内嵌留白。
   inset 用于卡片内嵌（补上 --gutter-card 的左右留白），独立使用时不加。 */
export function FilterBar({ children, trailing, inset, style }) {
  return (
    <div style={Object.assign({
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', minWidth: 0,
      padding: inset ? 'var(--space-6) var(--gutter-card)' : 0,
    }, style)}>
      {children}
      {trailing == null ? null : <><span style={{ flex: 1 }} />{trailing}</>}
    </div>
  );
}
