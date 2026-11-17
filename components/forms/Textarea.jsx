import React from 'react';

/* 自增高文本域：从 rows 行起步，随换行长高，到 maxRows 打住并出滚动条。
   不用 resize 手柄代替 —— 拖拽是额外一步，而人只是想把已经写下的字看全。
   高度按 scrollHeight 量：先归零再读，否则删字时量到的还是上一次的高度。 */
export function Textarea({ rows = 4, maxRows = 10, autoGrow = true, invalid, disabled, style, onChange, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const ref = React.useRef(null);

  const fit = React.useCallback(() => {
    const el = ref.current;
    if (!el || !autoGrow) return;
    const cs = getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || 20;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const min = line * rows + pad;
    const max = line * maxRows + pad;
    el.style.height = 'auto';
    /* 空值时直接取起步高度：占位文字换行也会撑大 scrollHeight，量它会让空框比有字时还高 */
    const measured = el.value ? el.scrollHeight + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) : min;
    const next = Math.min(Math.max(measured, min), max);
    el.style.height = next + 'px';
    el.style.overflowY = next >= max ? 'auto' : 'hidden';
  }, [rows, maxRows, autoGrow]);

  React.useLayoutEffect(fit, [fit, rest.value, rest.defaultValue]);

  return (
    <textarea
      ref={ref} rows={rows} disabled={disabled}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      onChange={(e) => { fit(); if (onChange) onChange(e); }}
      {...rest}
      style={{
        width: '100%', padding: 'var(--space-5)', font: 'inherit', fontSize: 'var(--fs-14)',
        lineHeight: 'var(--lh-normal)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
        background: disabled ? 'var(--surface-disabled)' : 'var(--surface-card)',
        border: '1px solid', borderColor: invalid ? 'var(--status-danger-fg)' : focus ? 'var(--border-strong)' : 'var(--border-default)',
        borderRadius: 'var(--radius-field)', outline: 'none',
        resize: autoGrow ? 'none' : 'vertical', boxSizing: 'border-box',
        transition: 'var(--transition-control)', ...style,
      }}
    />
  );
}
