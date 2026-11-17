import React from 'react';

/* 长列表页的三件套：宽表外框 + 吸底翻页条 + 列表外壳。
   为什么不用嵌套滚动容器：面板变窄时内层 flex 会被压成几十像素，列表整段不可见。
   所以统一走「外层单层纵向滚动 + sticky 吸底」。
   sticky 会被带 transform 的祖先或 overflow:hidden 的容器（如 Card）破坏，
   因此 StickyFooter 必须是滚动区的直系后代，宽表不要塞进 Card。 */

/* 表格与吸底条分处两棵子树，用一个轻量订阅把「当前宽表」告诉 StickyFooter，
   让横向滚动轨长在吸底条内部 —— 它占据自己的空间，既不压表格行也不压翻页文字。
   一屏一张宽表，单例足够。 */
const bus = {
  node: null,
  subs: new Set(),
  set(n) { this.node = n; this.subs.forEach((f) => f(n)); },
  on(f) { this.subs.add(f); f(this.node); return () => this.subs.delete(f); },
};

/* 双向同步：靠值比较自然终止回环，不用一次性标志
   （标志在目标值相同时无法复位，会永久吞掉滚动） */
const syncScroll = (a, b) => {
  if (!a || !b) return;
  if (Math.abs(b.scrollLeft - a.scrollLeft) > 1) b.scrollLeft = a.scrollLeft;
};

/* 冻结列要知道两侧是否还有被遮住的内容 —— 有才投影，没有就不投，
   这样阴影本身就是「这边还有列」的提示，而不是一条永远存在的装饰线。 */
export const TableScrollContext = React.createContext({ overflowLeft: false, overflowRight: false });

export function StickyFooter({ children, style }) {
  const [frame, setFrame] = React.useState(bus.node);
  React.useEffect(() => bus.on(setFrame), []);   // on() 会立即回调一次当前值

  /* 宿主滚动区的 paddingBottom 各处不同（面板 24、工作台 48），
     量取后取负作为 bottom，保证 footer 底边与滚动端口底边重合，下方不露内容。 */
  const root = React.useRef(null);
  const [pad, setPad] = React.useState(0);
  React.useEffect(() => {
    let el = root.current && root.current.parentElement;
    while (el) {
      const cs = getComputedStyle(el);
      if (/(auto|scroll)/.test(cs.overflowY)) { setPad(parseFloat(cs.paddingBottom) || 0); return; }
      el = el.parentElement;
    }
  }, []);

  return (
    <div ref={root} style={Object.assign({
      position: 'sticky', bottom: -pad, zIndex: 5,
      marginTop: 'var(--space-5)', paddingBottom: pad,
      background: 'var(--neutral-0)',
      borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
    }, style)}>
      <ScrollRail frame={frame} />
      <div style={{ paddingTop: 'var(--space-5)' }}>{children}</div>
    </div>
  );
}

/* 横向滚动轨：表格宽度溢出时才出现，拖它等于横向滚动表格 */
function ScrollRail({ frame }) {
  const proxy = React.useRef(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (!frame) { setWidth(0); return; }
    const measure = () => setWidth(frame.scrollWidth > frame.clientWidth + 1 ? frame.scrollWidth : 0);
    measure();
    const onFrame = () => syncScroll(frame, proxy.current);
    frame.addEventListener('scroll', onFrame);
    if (typeof ResizeObserver === 'undefined') return () => frame.removeEventListener('scroll', onFrame);
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    if (frame.firstElementChild) ro.observe(frame.firstElementChild);
    return () => { frame.removeEventListener('scroll', onFrame); ro.disconnect(); };
  }, [frame]);

  if (!width) return null;
  return (
    <div ref={proxy} className="huitou-scroll" onScroll={() => syncScroll(proxy.current, frame)}
      style={{ overflowX: 'auto', height: 12, background: 'transparent' }}>
      <div style={{ width: width, height: 1 }} />
    </div>
  );
}

/* 宽表外框：表格在内层横向滚动，原生滚动条隐藏 —— 可见的滚动轨长在吸底条里。
   冻结列的遮挡提示不画在单元格上（表格单元格的 box-shadow 会被相邻单元格的实色底盖住，
   在 border-collapse 下几乎看不出来），而是在外框上叠两条渐隐条：
   位置由冻结列的实际宽度量出来，只在该侧确有被遮住的列时出现。 */
export function TableFrame({ children, style }) {
  const frame = React.useRef(null);
  const [edges, setEdges] = React.useState({ overflowLeft: false, overflowRight: false });
  const [blocks, setBlocks] = React.useState({ left: 0, right: 0 });
  React.useEffect(() => {
    const node = frame.current;
    bus.set(node);
    return () => { if (bus.node === node) bus.set(null); };
  }, []);
  React.useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const measure = () => setEdges((prev) => {
      const next = {
        overflowLeft: node.scrollLeft > 1,
        overflowRight: node.scrollLeft + node.clientWidth < node.scrollWidth - 1,
      };
      return prev.overflowLeft === next.overflowLeft && prev.overflowRight === next.overflowRight ? prev : next;
    });
    measure();
    node.addEventListener('scroll', measure);
    if (typeof ResizeObserver === 'undefined') return () => node.removeEventListener('scroll', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    if (node.firstElementChild) ro.observe(node.firstElementChild);
    return () => { node.removeEventListener('scroll', measure); ro.disconnect(); };
  }, []);

  /* 冻结列的偏移由实际列宽算出来并写回 DOM：作者只标哪些列冻结，
     具体 left/right 交给这里 —— 手写的 left 值和渲染出的列宽差几像素，
     就会出现「阴影和分界线错位、相邻列被压住一点」的问题。
     每次提交后都重跑，因为 React 会用 props 里的 style 覆盖掉这里的写入。 */
  React.useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const apply = () => {
      const head = node.querySelector('thead tr');
      if (!head) return;
      const cells = Array.prototype.slice.call(head.children);
      const leftIdx = [], rightIdx = [];
      cells.forEach((c, i) => {
        const cs = getComputedStyle(c);
        if (cs.position !== 'sticky') return;
        if (cs.right !== 'auto' && parseFloat(cs.right) === 0) rightIdx.push(i);
        else leftIdx.push(i);
      });
      if (!leftIdx.length && !rightIdx.length) return;
      const leftOff = {}, rightOff = {};
      let accL = 0;
      leftIdx.forEach((i) => { leftOff[i] = accL; accL += cells[i].offsetWidth; });
      let accR = 0;
      rightIdx.slice().reverse().forEach((i) => { rightOff[i] = accR; accR += cells[i].offsetWidth; });
      node.querySelectorAll('tr').forEach((tr) => {
        if (tr.children.length !== cells.length) return;   // 跨列的分组行不参与
        Array.prototype.forEach.call(tr.children, (c, i) => {
          if (i in leftOff) c.style.left = leftOff[i] + 'px';
          if (i in rightOff) c.style.right = rightOff[i] + 'px';
        });
      });
      setBlocks((prev) => (prev.left === accL && prev.right === accR ? prev : { left: accL, right: accR }));
    };
    apply();
    const id = setTimeout(apply, 120);   // 字体落位后列宽会变
    if (typeof ResizeObserver === 'undefined') return () => clearTimeout(id);
    const ro = new ResizeObserver(apply);
    ro.observe(node);
    if (node.firstElementChild) ro.observe(node.firstElementChild);
    return () => { clearTimeout(id); ro.disconnect(); };
  });

  const veil = (side, offset) => ({
    position: 'absolute', top: 0, bottom: 0, [side]: offset, width: 12, pointerEvents: 'none', zIndex: 4,
    background: 'linear-gradient(to ' + (side === 'left' ? 'right' : 'left') + ', rgba(16,20,26,.07), rgba(16,20,26,0))',
  });
  const shell = Object.assign({
    position: 'relative', minWidth: 0,
    background: 'var(--surface-card)', borderRadius: 'var(--radius-card)',
    borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
    overflow: 'hidden',
  }, style);

  return (
    <div style={shell}>
      <div ref={frame} className="huitou-noscrollbar" style={{ minWidth: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <TableScrollContext.Provider value={edges}>
          {typeof children === 'function' ? children(TableFreezeStyles(edges)) : children}
        </TableScrollContext.Provider>
      </div>
      {edges.overflowLeft && blocks.left ? <div style={veil('left', blocks.left)} /> : null}
      {edges.overflowRight && blocks.right ? <div style={veil('right', blocks.right)} /> : null}
    </div>
  );
}

/* 冻结列的一套样式：表头与单元格共用，只有底色与层级不同。
   TableFrame 直接把它交给函数式 children —— 上下文对「渲染 TableFrame 的那个组件」不可见，
   render prop 才能让写表的人拿到两侧遮挡状态。
   表头必须是实色 —— 继承来的透明底会让滑过去的数据列透出来，看着像文字重叠。 */
export function TableFreezeStyles({ overflowLeft, overflowRight }) {
  /* 单元格只负责那条实线分界；界外的渐隐由 TableFrame 叠的渐隐条画。 */
  const lineL = overflowLeft ? 'var(--border-default)' : 'transparent';
  const lineR = overflowRight ? 'var(--border-default)' : 'transparent';
  return {
    head: (left) => ({ position: 'sticky', left, zIndex: 4, background: 'var(--neutral-25)' }),
    headEnd: { position: 'sticky', right: 0, zIndex: 4, background: 'var(--neutral-25)', borderLeftWidth: 1, borderLeftStyle: 'solid', borderLeftColor: lineR },
    cell: (left) => ({ position: 'sticky', left, zIndex: 2, background: 'inherit' }),
    cellEnd: { position: 'sticky', right: 0, zIndex: 2, background: 'inherit', borderLeftWidth: 1, borderLeftStyle: 'solid', borderLeftColor: lineR },
    headEdge: { borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: lineL },
    cellEdge: { borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: lineL },
  };
}

/* 列表外壳：内容 + 吸底翻页条 */
export function ListShell({ children, footer, style }) {
  return (
    <div style={Object.assign({ minWidth: 0 }, style)}>
      {children}
      <StickyFooter>{footer}</StickyFooter>
    </div>
  );
}

/* 表格行悬停：所有列表每一行都要有悬停反馈（背景下沉一级到 --surface-hover）。
   传入该行静止状态的底色，离开时还原；选中行传 locked=true，悬停不会覆盖它的选中底色。
   写成 props 工厂而不是组件，因为 <tr> 常带各页自己的 style / key / onClick，包一层反而更难用。 */
export function TableRowHover(base = 'transparent', locked) {
  return {
    onMouseEnter: (e) => { if (!locked) e.currentTarget.style.background = 'var(--surface-hover)'; },
    onMouseLeave: (e) => { if (!locked) e.currentTarget.style.background = base; },
  };
}
