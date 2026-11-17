(() => {
/* 列表页三件套、行悬停工厂、日期控件与筛选条均已收进设计系统。
   这里只把它们挂到 window，保持 UI Kit 内既有引用不变。 */
const { TableFrame, StickyFooter, ListShell, TableRowHover, TableScrollContext, TableFreezeStyles, DateField, DateRangeField, TimeRangeField, FilterBar, Icon } = window.HUITOUAIDesignSystem_52606d;

/* 「问 AI」：内容页里任何一个可提问的对象，悬停即露出这个按钮，点一下就把它作为
   引用送进对话框。@ 面板还留着，但常见路径不该是「先记住名字，再回对话框搜一遍」。
   会话区和内容页是 AppShell 下的两棵子树，中间没有共同状态，所以走一次窗口事件 ——
   比把 setMentions 串过十个屏幕组件干净。 */
/* 冻结列的滚动上下文来自设计系统的 TableFrame。旧版 bundle 里没有它时退化成「两侧都没遮挡」，
   列仍然冻结，只是不投影 —— 不至于整张表崩掉。 */
const ScrollCtx = TableScrollContext || React.createContext({ overflowLeft: false, overflowRight: false });
const Freeze = TableFreezeStyles || ((e) => ({
  head: (left) => ({ position: 'sticky', left, zIndex: 4, background: 'var(--neutral-25)' }),
  cell: (left) => ({ position: 'sticky', left, zIndex: 2, background: 'inherit' }),
  headEnd: { position: 'sticky', right: 0, zIndex: 4, background: 'var(--neutral-25)' },
  cellEnd: { position: 'sticky', right: 0, zIndex: 2, background: 'inherit' },
  headEdge: {}, cellEdge: {},
}));

/* 函数式 children 的转接：把 render prop 放进 TableFrame 内部再消费上下文 ——
   写表的组件本身在 Provider 外面，直接 useContext 拿不到遮挡状态。 */
function FreezeChild({ render }) { return render(Freeze(React.useContext(ScrollCtx))); }
function TableFrameShim({ children, ...rest }) {
  return React.createElement(TableFrame, rest,
    typeof children === 'function' ? React.createElement(FreezeChild, { render: children }) : children);
}

const ASK_EVENT = 'huitou:ask';
function askAI(m) { window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: m })); }

function AskButton({ kind, label, hint, inline }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" className="huitou-ask" title={'就「' + label + '」提问'}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); askAI({ kind: kind, label: label, hint: hint }); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', flex: 'none', height: 24,
        padding: '0 var(--space-4)', borderRadius: 999, cursor: 'pointer', outline: 'none',
        borderWidth: 1, borderStyle: 'solid', borderColor: hover ? 'var(--status-ai-fg)' : 'var(--status-ai-border)',
        background: 'var(--status-ai-bg)', color: 'var(--status-ai-fg)',
        font: 'inherit', fontSize: 'var(--fs-12)', whiteSpace: 'nowrap',
        verticalAlign: inline ? 'middle' : undefined,
        transition: 'var(--transition-control)',
      }}>
      <Icon name="sparkles" size={12} />问 AI
    </button>
  );
}

/* 落点聚焦：跨脚本共享一个「当前要看哪一条」的信号。
   用事件而不是 context —— 各屏是独立的 babel 脚本，拿不到同一个 Provider。 */
const FOCUS_EVENT = 'huitou:focus';
let focusNow = null;
let focusTimer = null;
function setFocus(id) {
  focusNow = id ? { id, n: Date.now() } : null;
  clearTimeout(focusTimer);
  window.dispatchEvent(new CustomEvent(FOCUS_EVENT, { detail: focusNow }));
}
/* 命中方在渲染时调用一次，从这一刻开始计时 */
function focusSeen(id) {
  if (!focusNow || focusNow.id !== id) return;
  clearTimeout(focusTimer);
  focusTimer = setTimeout(() => { if (focusNow && focusNow.id === id) setFocus(null); }, 4200);
}
/* 组件里：const lit = useFocus('settle-dispute')，或传数组匹配多个别名 */
function useFocus(id) {
  const key = Array.isArray(id) ? id.join('|') : String(id || '');
  const hit = React.useCallback((cur) => {
    if (!cur || !cur.id) return false;
    return key.split('|').indexOf(cur.id) >= 0;
  }, [key]);
  const [on, setOn] = React.useState(() => hit(focusNow));
  React.useEffect(() => {
    const h = (e) => setOn(hit(e.detail));
    window.addEventListener(FOCUS_EVENT, h);
    setOn(hit(focusNow));
    return () => window.removeEventListener(FOCUS_EVENT, h);
  }, [key]);
  React.useEffect(() => { if (on && focusNow) focusSeen(focusNow.id); }, [on]);
  return on;
}
/* 高亮环：两秒半后自行消退，不留常驻底色 —— 那会被误读成选中态。
   card 变体画在元素之外（卡片自带不透明白底，inset 会被盖住）；row 变体给表格行用。 */
/* 高亮走 class：动画自带时间线，不会「写上→还没绘出→被清掉」 */
const focusClass = (on, variant) => (on ? 'huitou-focus-' + (variant || 'row') : '');
const focusRing = (on, variant) => {
  if (!on) return null;
  if (variant === 'card') return {
    outline: '2px solid var(--status-warning-fg)',
    outlineOffset: 3,
    borderRadius: 'var(--radius-md)',
  };
  return {
    background: 'var(--status-warning-bg)',
    boxShadow: 'inset 0 0 0 2px var(--status-warning-border)',
    borderRadius: 'var(--radius-md)',
  };
};

Object.assign(window, { useFocus, setFocus, focusSeen, focusRing, focusClass,
  TableFrame: TableFrameShim, StickyFooter, ListShell, rowHoverProps: TableRowHover, TableScrollContext: ScrollCtx, TableFreezeStyles: Freeze,
  DateField, DateRangeField, TimeRangeField, FilterBar,
  AskButton, askAI, ASK_EVENT,
});
})();
