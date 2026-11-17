import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
import { Select } from '../forms/Select.jsx';

export function Pagination({ page = 1, pageCount = 1, total, pageSize, pageSizeOptions = [10, 20, 50, 100], onChange, onPageSizeChange, style, ...rest }) {
  return (
    <div {...rest} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', ...style }}>
      {total != null ? <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>共 {total.toLocaleString()} 行</span> : null}
      <div style={{ flex: 1 }} />
      {pageSize != null ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', whiteSpace: 'nowrap' }}>
          每页
          <Select size="sm" value={String(pageSize)}
            options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
            onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))} />
          条
        </span>
      ) : null}
      <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>第 {page} / {pageCount} 页</span>
      <div style={{ display: 'flex', gap: 2 }}>
        <IconButton icon="chevron-left" label="上一页" variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange && onChange(page - 1)} />
        <IconButton icon="chevron-right" label="下一页" variant="secondary" size="sm" disabled={page >= pageCount} onClick={() => onChange && onChange(page + 1)} />
      </div>
    </div>
  );
}
