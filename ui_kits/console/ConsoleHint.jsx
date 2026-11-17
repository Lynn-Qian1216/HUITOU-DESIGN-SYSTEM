(() => {
const { Icon } = window.HUITOUAIDesignSystem_52606d;

/* 说明文字的收纳位：页面上的解释性副文一旦常驻，第二次来时就只是噪音 ——
   收进一个问号里，需要时悬停。字形与尺寸跟表单里的 hint 一致，
   所以两处的「这里有解释」是同一个信号。

   气泡走 position: fixed 并自己量位置：卡片带 overflow: hidden、内容区带 overflow: auto，
   absolute 的气泡贴着容器边缘时一定会被裁掉半句话 —— 半句解释比不给解释更糟。
   量完再夹回视口内：左右各留 8px，上方放不下就翻到下方。 */
function InfoHint({ label, size = 13, width = 260, style }) {
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
      let left = r.left + r.width / 2 - w / 2;
      left = Math.min(Math.max(8, left), Math.max(8, vw - w - 8));
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
    <span ref={anchor} style={{ display: 'inline-flex', verticalAlign: 'middle', flex: 'none', ...style }}
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

/* 卡片标题 + 问号。Card 的 title 收下任意节点，所以说明不必是 Card 的一个 prop。 */
function CardTitle({ children, info }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {children}<InfoHint label={info} />
    </span>
  );
}

Object.assign(window, { InfoHint, CardTitle });
})();
