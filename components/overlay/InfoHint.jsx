import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* 说明文字的收纳位。页面上的解释性副文一旦常驻，读者第二次来时它就只是噪音了 ——
   收进一个问号里，需要时悬停，不需要时页面是干净的。
   与 FormField 的 hint 同一枚字形、同一档尺寸，所以两处的「这里有解释」是同一个信号。

   气泡用 position: fixed 自己量位置，不走 Tooltip：卡片带 overflow: hidden、
   列表与内容区带 overflow: auto，absolute 的气泡贴着容器边缘会被裁掉半句话。
   量完夹回视口内：左右各留 8px，上方放不下就翻到下方。 */
export function InfoHint({ label, size = 13, width = 260, style, ...rest }) {
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
      let left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), Math.max(8, vw - w - 8));
      let top = r.top - 6 - h;
      if (top < 8) top = Math.min(r.bottom + 6, vh - h - 8);
      setBox({ left, top });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open, label, width]);

  if (!label) return null;
  return (
    <span ref={anchor} {...rest} style={{ display: 'inline-flex', verticalAlign: 'middle', flex: 'none', ...style }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      <span tabIndex={0} role="note" aria-label={typeof label === 'string' ? label : undefined}
        style={{ display: 'inline-flex', color: 'var(--text-tertiary)', cursor: 'help', lineHeight: 0 }}>
        <Icon name="circle-help" size={size} />
      </span>
      {open ? (
        <span ref={bubble} role="tooltip" style={{
          position: 'fixed', zIndex: 120, left: box ? box.left : 0, top: box ? box.top : 0,
          opacity: box ? 1 : 0, padding: '6px 9px', background: 'var(--surface-inverse)',
          color: 'var(--text-inverse)', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-regular)',
          lineHeight: 'var(--lh-normal)', textAlign: 'left', letterSpacing: 'var(--ls-normal)',
          borderRadius: 'var(--radius-xs)', width: 'max-content', maxWidth: width,
          whiteSpace: 'normal', pointerEvents: 'none',
        }}>{label}</span>
      ) : null}
    </span>
  );
}
