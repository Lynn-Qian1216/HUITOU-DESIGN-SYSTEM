import React from 'react';

/* 提示气泡走 position: fixed 并自己量位置 —— 卡片与滚动容器都带 overflow，
   absolute 的气泡贴着容器边缘会被裁掉，宽气泡尤其明显。
   量完夹回视口内：左右各留 8px，首选方向放不下就翻到对面。 */
export function Tooltip({ label, placement = 'top', width, children, style, ...rest }) {
  const anchor = React.useRef(null);
  const bubble = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [box, setBox] = React.useState(null);

  React.useLayoutEffect(() => {
    if (!open) { setBox(null); return; }
    const a = anchor.current, el = bubble.current;
    if (!a || !el) return;
    const place = () => {
      const r = a.getBoundingClientRect();
      const w = el.offsetWidth, h = el.offsetHeight;
      const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
      const clampX = (x) => Math.min(Math.max(8, x), Math.max(8, vw - w - 8));
      const clampY = (y) => Math.min(Math.max(8, y), Math.max(8, vh - h - 8));
      let left, top;
      if (placement === 'left' || placement === 'right') {
        top = clampY(r.top + r.height / 2 - h / 2);
        left = placement === 'left' ? r.left - 6 - w : r.right + 6;
        if (left < 8) left = r.right + 6;
        if (left + w > vw - 8) left = r.left - 6 - w;
        left = clampX(left);
      } else {
        left = clampX(r.left + r.width / 2 - w / 2);
        top = placement === 'bottom' ? r.bottom + 6 : r.top - 6 - h;
        if (top < 8) top = r.bottom + 6;
        if (top + h > vh - 8) top = r.top - 6 - h;
        top = clampY(top);
      }
      setBox({ left, top });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open, label, placement, width]);

  /* 一行的提示不折行；给了 width 的当作段落处理 —— 解释性文字读起来要有行距。 */
  const wrap = width
    ? { whiteSpace: 'normal', width: 'max-content', maxWidth: width, lineHeight: 'var(--lh-normal)', textAlign: 'left' }
    : { whiteSpace: 'nowrap' };

  return (
    <span ref={anchor} {...rest} style={{ display: 'inline-flex', ...style }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open ? (
        <span ref={bubble} role="tooltip" style={{
          position: 'fixed', zIndex: 120, left: box ? box.left : 0, top: box ? box.top : 0,
          opacity: box ? 1 : 0, padding: width ? '6px 9px' : '5px 8px', background: 'var(--surface-inverse)',
          color: 'var(--text-inverse)', fontSize: 'var(--fs-12)', borderRadius: 'var(--radius-xs)',
          pointerEvents: 'none', ...wrap,
        }}>{label}</span>
      ) : null}
    </span>
  );
}
