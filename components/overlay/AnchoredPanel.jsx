import React from 'react';

/* 挂在触发器下方的浮层。用 position: fixed 而不是 absolute —— 列表页的卡片和滚动容器
   都带 overflow: hidden，absolute 的面板会被裁在卡片里，这是下拉「被遮挡」的唯一原因。
   量完位置再显示：越过右边缘就往回收，下方放不下就翻到上方，都留 8px 余量。
   外点与 Esc 关闭也收在这里 —— 面板已不在触发器的 DOM 子树内，各组件自己判断 contains 会失效。 */
export function AnchoredPanel({ anchor, align = 'left', gap = 4, matchWidth, onClose, children, style }) {
  const ref = React.useRef(null);
  const [box, setBox] = React.useState(null);

  React.useLayoutEffect(() => {
    const a = anchor && anchor.current; const el = ref.current;
    if (!a || !el) return;
    const place = () => {
      const r = a.getBoundingClientRect();
      const w = el.offsetWidth; const h = el.offsetHeight;
      const vw = document.documentElement.clientWidth; const vh = document.documentElement.clientHeight;
      let left = align === 'right' ? r.right - w : r.left;
      left = Math.min(Math.max(8, left), Math.max(8, vw - w - 8));
      let top = r.bottom + gap;
      if (top + h > vh - 8) top = Math.max(8, r.top - gap - h);
      setBox({ left, top, minWidth: matchWidth ? r.width : undefined });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [anchor, align, gap, matchWidth]);

  React.useEffect(() => {
    if (!onClose) return;
    const away = (e) => {
      const a = anchor && anchor.current;
      if (ref.current && !ref.current.contains(e.target) && !(a && a.contains(e.target))) onClose();
    };
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [anchor, onClose]);

  return (
    <div ref={ref} style={Object.assign({
      position: 'fixed', zIndex: 120,
      left: box ? box.left : 0, top: box ? box.top : 0, minWidth: box ? box.minWidth : undefined,
      /* 量位置前先透明遮一帧，不要用 visibility: hidden —— 隐藏子树里的 focus() 会被浏览器直接丢掉，
         面板里的搜索框就永远聚焦不上。opacity 不影响可聚焦性。 */
      opacity: box ? 1 : 0, pointerEvents: box ? 'auto' : 'none',
      background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
    }, style)}>{children}</div>
  );
}
