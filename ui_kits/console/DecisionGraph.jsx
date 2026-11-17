(() => {
const { Icon, Badge, Card, Divider, Popover, Button } = window.HUITOUAIDesignSystem_52606d;

/* 决策图谱 —— 数据结构是图（有向无环图），不是树：
   节点扁平存放，层级由 node.layer 推导；边是任意 from→to 的列表，
   允许一个节点被多个上游指向、也允许跨层连接。目标层现在只有一个节点
   （单目标），将来多目标只需往 nodes 里加 layer:'objective' 的节点、
   并补上指向它的边，布局与连线无需改动。 */

const MIN_W = 790;

/* layer: signal 影响条件 · rule 规则／护栏 · decision 决策 · objective 目标 */
const GRAPH = {
  nodes: [
    { id: 's1', layer: 'signal', label: '消耗超预算 +15%', meta: '近 3 日 · 日均 ¥1,150', tone: 'warning' },
    { id: 's2', layer: 'signal', label: 'CTR 3.6%', meta: '账户均值 2.4%', tone: 'success' },
    { id: 's3', layer: 'signal', label: '午间 CPA ¥22.30', meta: '10:00–14:00 · 均值 ¥38.50', tone: 'success' },
    { id: 's4', layer: 'signal', label: '预算 15:00 触顶', meta: '连续 6 天', tone: 'warning' },
    { id: 's5', layer: 'signal', label: '素材与定向无改动', meta: '排除人为干扰', tone: 'neutral' },

    { id: 'r1', layer: 'rule', kind: 'rule', code: 'R-014', label: '转化成本超标预警',
      expr: 'CPA > 目标 CPA × 1.15 且 持续 ≥ 3 日',
      note: '触发后进入扩量／收量判定，优先检查 CTR 与时段效率。' },
    { id: 'r2', layer: 'rule', kind: 'rule', code: 'R-032', label: '预算受限扩量',
      expr: '预算触顶时间 < 18:00 且 ROI ≥ 目标 × 0.9',
      note: '预算在日内提前耗尽且回报达标时，建议上调预算而非出价。' },
    { id: 'g1', layer: 'rule', kind: 'guard', code: 'G-002', label: '单日变动上限 25%',
      expr: '|Δ预算| / 原预算 ≤ 25%',
      note: '护栏：限制单次调整幅度，本次 +20% 符合。' },

    { id: 'd1', layer: 'decision', label: '改日预算', meta: '1000元 → 1200元' },

    /* 多目标：role 决定角色与呈现，weight 为该目标在本次决策中的权重 */
    { id: 'o1', layer: 'objective', role: 'primary', label: '提升转化量', meta: '日转化量 350 → ≥500', weight: 0.5, hit: 'up' },
    { id: 'o2', layer: 'objective', role: 'constraint', label: '维持 ROI', meta: 'ROI 2.5 → ≥3.5', weight: 0.35, hit: 'up' },
    { id: 'o3', layer: 'objective', role: 'watch', label: '控制退款率', meta: '1 小时退款率 ≤5%', weight: 0.15, hit: 'risk' },
  ],
  /* kind: support 支撑（实线）· exclude 排除／护栏（虚线）· tension 与目标存在张力（点线）；w 为影响权重 */
  edges: [
    { from: 's1', to: 'r1', w: 2, kind: 'support' },
    { from: 's2', to: 'r1', w: 2, kind: 'support' },
    { from: 's3', to: 'r1', w: 1, kind: 'support' },
    { from: 's5', to: 'r1', w: 1, kind: 'exclude' },
    { from: 's1', to: 'r2', w: 1, kind: 'support' },
    { from: 's4', to: 'r2', w: 2, kind: 'support' },
    { from: 's3', to: 'r2', w: 1, kind: 'support' },
    { from: 'r1', to: 'd1', w: 2, kind: 'support' },
    { from: 'r2', to: 'd1', w: 2, kind: 'support' },
    { from: 'g1', to: 'd1', w: 1, kind: 'exclude' },
    { from: 'd1', to: 'o1', w: 2, kind: 'support' },
    { from: 'd1', to: 'o2', w: 1.5, kind: 'support' },
    { from: 'd1', to: 'o3', w: 1, kind: 'tension' },
    { from: 'g1', to: 'o3', w: 1, kind: 'exclude' },
  ],
};

const LAYERS = [
  { id: 'signal', label: '影响条件', icon: 'activity' },
  { id: 'rule', label: '命中规则', icon: 'scale' },
  { id: 'decision', label: '决策', icon: 'sparkles' },
  { id: 'objective', label: '目标', icon: 'target' },
];

const byLayer = (id) => GRAPH.nodes.filter((n) => n.layer === id);

/* 邻接表：图结构下用它做一跳高亮，不假设父子关系 */
const ADJ = GRAPH.nodes.reduce((m, n) => Object.assign(m, { [n.id]: [] }), {});
for (const e of GRAPH.edges) { ADJ[e.from].push(e.to); ADJ[e.to].push(e.from); }

/* 视口：图本身按自然尺寸排布，永不折行、永不压缩变形；
   用户用手拖动平移、滚轮或按钮缩放。连线位置用 offsetLeft/offsetTop 量取
   （布局坐标，不受 transform 影响），所以缩放时线和节点始终对齐。 */
const STAGE_H = 380;
const ZOOM = { min: 0.5, max: 1.6, step: 0.15 };

function DecisionGraph() {
  const viewport = React.useRef(null);
  const stage = React.useRef(null);
  const nodes = React.useRef({});
  const drag = React.useRef(null);

  const [paths, setPaths] = React.useState([]);
  const [size, setSize] = React.useState({ w: MIN_W, h: STAGE_H });
  const [view, setView] = React.useState({ scale: 1, x: 0, y: 0 });
  const [focus, setFocus] = React.useState(null);
  const [grabbing, setGrabbing] = React.useState(false);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const el = viewport.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setTick((t) => t + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* 量取布局坐标并生成连线；offset* 不受 transform 影响 */
  React.useLayoutEffect(() => {
    const host = stage.current;
    if (!host) return;
    setSize({ w: host.offsetWidth, h: host.offsetHeight });
    const next = [];
    for (const e of GRAPH.edges) {
      const a = nodes.current[e.from], b = nodes.current[e.to];
      if (!a || !b) continue;
      const x1 = a.offsetLeft + a.offsetWidth, y1 = a.offsetTop + a.offsetHeight / 2;
      const x2 = b.offsetLeft, y2 = b.offsetTop + b.offsetHeight / 2;
      const mx = x1 + (x2 - x1) / 2;
      next.push(Object.assign({}, e, {
        d: 'M' + x1 + ' ' + y1 + ' C' + mx + ' ' + y1 + ' ' + mx + ' ' + y2 + ' ' + x2 + ' ' + y2,
        x2: x2, y2: y2,
      }));
    }
    setPaths(next);
  }, [tick]);

  /* 首次布局完成后按视口宽度适配一次 */
  React.useEffect(() => { fit(); }, [size.w]);

  const fit = () => {
    const el = viewport.current;
    if (!el || !size.w) return;
    const scale = Math.min(1, Math.max(ZOOM.min, (el.clientWidth - 16) / size.w));
    setView({ scale: scale, x: (el.clientWidth - size.w * scale) / 2, y: (STAGE_H - size.h * scale) / 2 });
  };

  const zoomTo = (next, cx, cy) => {
    const el = viewport.current;
    if (!el) return;
    setView((v) => {
      const s2 = Math.min(ZOOM.max, Math.max(ZOOM.min, next));
      const px = cx != null ? cx : el.clientWidth / 2;
      const py = cy != null ? cy : STAGE_H / 2;
      return { scale: s2, x: px - (px - v.x) * (s2 / v.scale), y: py - (py - v.y) * (s2 / v.scale) };
    });
  };

  const onWheel = (e) => {
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    zoomTo(view.scale * (e.deltaY < 0 ? 1.1 : 0.9), e.clientX - r.left, e.clientY - r.top);
  };

  const onDown = (e) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, ox: view.x, oy: view.y };
    setGrabbing(true);
    const move = (ev) => {
      const d = drag.current;
      if (!d) return;
      setView((v) => Object.assign({}, v, { x: d.ox + (ev.clientX - d.x), y: d.oy + (ev.clientY - d.y) }));
    };
    const up = () => {
      drag.current = null;
      setGrabbing(false);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const lit = (id) => !focus || id === focus || ADJ[focus].indexOf(id) > -1;
  const edgeOn = (e) => !focus || e.from === focus || e.to === focus;

  const col = { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 0 };
  const reg = (id) => (el) => { nodes.current[id] = el; };
  const hover = (id) => ({ onEnter: () => setFocus(id), onLeave: () => setFocus(null) });

  return (
    <div style={{ minWidth: 0 }}>
      <div ref={viewport} onWheel={onWheel} onMouseDown={onDown}
        style={{
          position: 'relative', height: STAGE_H, overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--neutral-25)',
          backgroundImage: 'radial-gradient(var(--neutral-300) 1px, transparent 1px)',
          backgroundSize: 16 * view.scale + 'px ' + 16 * view.scale + 'px',
          backgroundPosition: view.x + 'px ' + view.y + 'px',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
          cursor: grabbing ? 'grabbing' : 'grab',
        }}>
        <div ref={stage} style={{
          position: 'absolute', top: 0, left: 0, width: MIN_W,
          transform: 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.scale + ')',
          transformOrigin: '0 0',
          padding: 'var(--space-6)',
          display: 'grid',
          gridTemplateColumns: '180px 40px 215px 44px 176px 44px 175px',
          alignItems: 'center',
        }}>
          <svg width={size.w} height={size.h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
            {paths.map((p, i) => (
              <g key={i} style={{ opacity: edgeOn(p) ? 1 : 0.12, transition: 'opacity var(--duration-fast) var(--ease-standard)' }}>
                <path d={p.d} fill="none" strokeWidth={p.w}
                  stroke={p.kind === 'tension' ? 'var(--status-warning-fg)' : edgeOn(p) && focus ? 'var(--neutral-700)' : 'var(--neutral-400)'}
                  strokeDasharray={p.kind === 'exclude' ? '3 3' : p.kind === 'tension' ? '1.5 3' : undefined} />
                <circle cx={p.x2} cy={p.y2} r="2.5"
                  fill={p.kind === 'tension' ? 'var(--status-warning-fg)' : edgeOn(p) && focus ? 'var(--neutral-700)' : 'var(--neutral-400)'} />
              </g>
            ))}
          </svg>

          <div style={col}>
            <ColLabel layer={LAYERS[0]} />
            {byLayer('signal').map((n) => <SignalNode key={n.id} innerRef={reg(n.id)} node={n} dim={!lit(n.id)} {...hover(n.id)} />)}
          </div>
          <span />
          <div style={col}>
            <ColLabel layer={LAYERS[1]} />
            {byLayer('rule').map((n) => <RuleNode key={n.id} innerRef={reg(n.id)} node={n} dim={!lit(n.id)} {...hover(n.id)} />)}
          </div>
          <span />
          <div style={col}>
            <ColLabel layer={LAYERS[2]} />
            {byLayer('decision').map((n) => <DecisionNode key={n.id} innerRef={reg(n.id)} node={n} dim={!lit(n.id)} {...hover(n.id)} />)}
          </div>
          <span />
          <div style={col}>
            <ColLabel layer={LAYERS[3]} />
            {byLayer('objective').map((n) => <ObjectiveNode key={n.id} innerRef={reg(n.id)} node={n} dim={!lit(n.id)} {...hover(n.id)} />)}
          </div>
        </div>

        {/* 缩放控件 */}
        <div style={{
          position: 'absolute', right: 'var(--space-5)', bottom: 'var(--space-5)',
          display: 'flex', alignItems: 'center', gap: 2, padding: 2,
          background: 'rgba(255,255,255,.92)', backdropFilter: 'var(--blur-scrim)',
          borderRadius: 'var(--radius-sm)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
        }} onMouseDown={(e) => e.stopPropagation()}>
          <ZoomBtn icon="minus" label="缩小" onClick={() => zoomTo(view.scale - ZOOM.step)} />
          <span style={{ minWidth: 38, textAlign: 'center', fontSize: 'var(--fs-11)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            {Math.round(view.scale * 100)}%
          </span>
          <ZoomBtn icon="plus" label="放大" onClick={() => zoomTo(view.scale + ZOOM.step)} />
          <span style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 2px' }} />
          <ZoomBtn icon="maximize" label="适应宽度" onClick={fit} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-5)', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>
        <LegendItem>支撑</LegendItem>
        <LegendItem dashed>排除项与护栏</LegendItem>
        <LegendItem dotted>与目标存在张力</LegendItem>
        <span>线宽＝影响权重</span>
        <span style={{ flex: 1 }} />
        <span>拖动平移 · 滚轮缩放 · 权重之和 100%</span>
      </div>
    </div>
  );
}

function ZoomBtn({ icon, label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 24, height: 24, padding: 0, border: 0, borderRadius: 'var(--radius-xs)',
        background: hover ? 'var(--surface-hover)' : 'transparent', color: 'var(--text-secondary)',
        cursor: 'pointer', transition: 'var(--transition-control)',
      }}>
      <Icon name={icon} size={13} />
    </button>
  );
}

function ColLabel({ layer }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>
      <Icon name={layer.icon} size={11} />{layer.label}
    </div>
  );
}

const nodeBase = (dim) => ({
  background: 'var(--surface-card)',
  borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
  borderRadius: 'var(--radius-sm)', padding: '9px var(--space-5)',
  minWidth: 0, opacity: dim ? 0.28 : 1,
  transition: 'opacity var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
  cursor: 'default', position: 'relative', zIndex: 1,
});

const ellipsis = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };

function SignalNode({ node, innerRef, dim, onEnter, onLeave }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div ref={innerRef}
      onMouseEnter={() => { setHover(true); onEnter(); }} onMouseLeave={() => { setHover(false); onLeave(); }}
      style={Object.assign({}, nodeBase(dim), { borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)' })}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', minWidth: 0 }}>
        <span style={{ width: 5, height: 5, flex: 'none', borderRadius: 999, background: 'var(--status-' + node.tone + '-fg)', transform: 'translateY(-2px)' }} />
        <span style={Object.assign({ flex: 1, minWidth: 0, fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }, ellipsis)}>{node.label}</span>
      </div>
      <div style={Object.assign({ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', marginTop: 2, paddingLeft: 13 }, ellipsis)}>{node.meta}</div>
    </div>
  );
}

function RuleNode({ node, innerRef, dim, onEnter, onLeave }) {
  const [hover, setHover] = React.useState(false);
  const guard = node.kind === 'guard';
  return (
    <div ref={innerRef}
      onMouseEnter={() => { setHover(true); onEnter(); }} onMouseLeave={() => { setHover(false); onLeave(); }}
      style={Object.assign({}, nodeBase(dim), {
        borderColor: hover || guard ? 'var(--border-default)' : 'var(--border-subtle)',
        borderStyle: guard ? 'dashed' : 'solid',
        background: guard ? 'var(--neutral-25)' : 'var(--surface-card)',
      })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
        <Icon name={guard ? 'shield-check' : 'scale'} size={13} style={{ flex: 'none', color: 'var(--text-tertiary)' }} />
        <span style={Object.assign({ flex: 1, minWidth: 0, fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }, ellipsis)}>{node.label}</span>
        <Popover placement="top" width={230} content={<span>{node.note}<br />{node.code} 命中于 13:02，来源：策略库。</span>}>
          <span style={{ fontSize: 'var(--fs-11)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', flex: 'none', borderBottomWidth: 1, borderBottomStyle: 'dashed', borderBottomColor: 'var(--border-default)', cursor: 'default' }}>{node.code}</span>
        </Popover>
      </div>
      <div style={Object.assign({ fontSize: 'var(--fs-11)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: 3, paddingLeft: 19 }, ellipsis)}>{node.expr}</div>
    </div>
  );
}

function DecisionNode({ node, innerRef, dim, onEnter, onLeave }) {
  return (
    <div ref={innerRef} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={Object.assign({}, nodeBase(dim), {
        background: 'var(--neutral-900)', borderColor: 'var(--neutral-900)',
        borderRadius: 'var(--radius-md)', padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-md)', zIndex: 2,
      })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
        <Icon name="sparkles" size={13} style={{ flex: 'none', color: 'var(--violet-500)' }} />
        <span style={Object.assign({ flex: 1, minWidth: 0, fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', color: 'var(--neutral-400)' }, ellipsis)}>本次决策</span>
      </div>
      <div style={Object.assign({ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', color: 'var(--neutral-0)', marginTop: 'var(--space-5)' }, ellipsis)}>{node.label}</div>
      <div style={{ fontSize: 'var(--fs-20)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)', fontVariantNumeric: 'tabular-nums', color: 'var(--neutral-0)', marginTop: 2 }}>{node.meta}</div>
    </div>
  );
}

const ROLE = {
  primary: { label: '主目标', tone: 'neutral' },
  constraint: { label: '约束目标', tone: 'info' },
  watch: { label: '观察目标', tone: 'warning' },
};

/* 目标节点：多目标并列，各自显示角色、权重占比与本次决策对它的作用方向 */
function ObjectiveNode({ node, innerRef, dim, onEnter, onLeave }) {
  const [hover, setHover] = React.useState(false);
  const role = ROLE[node.role] || ROLE.primary;
  const risk = node.hit === 'risk';
  return (
    <div ref={innerRef}
      onMouseEnter={() => { setHover(true); onEnter(); }} onMouseLeave={() => { setHover(false); onLeave(); }}
      style={Object.assign({}, nodeBase(dim), {
        borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        background: 'var(--surface-card)',
      })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
        <Icon name={risk ? 'triangle-alert' : 'target'} size={13}
          style={{ flex: 'none', color: risk ? 'var(--status-warning-fg)' : 'var(--text-secondary)' }} />
        <span style={Object.assign({ flex: 1, minWidth: 0, fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }, ellipsis)}>{node.label}</span>
        <span style={{ fontSize: 'var(--fs-11)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', flex: 'none' }}>
          {Math.round(node.weight * 100)}%
        </span>
      </div>
      <div style={Object.assign({ fontSize: 'var(--fs-11)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: 3, paddingLeft: 19 }, ellipsis)}>{node.meta}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)', paddingLeft: 19 }}>
        <span style={{ flex: 1, minWidth: 0, height: 3, background: 'var(--neutral-100)', borderRadius: 999 }}>
          <span style={{ display: 'block', width: (node.weight * 100) + '%', height: '100%', borderRadius: 999, background: risk ? 'var(--status-warning-fg)' : 'var(--neutral-700)' }} />
        </span>
        <Popover placement="top" width={220}
          content={<span>{risk ? '本次决策对该目标存在张力：扩量可能抬高退款率，已由护栏 G-002 限制变动幅度。' : '本次决策对该目标为正向作用，权重 ' + Math.round(node.weight * 100) + '%。'}</span>}>
          <span style={{ flex: 'none', fontSize: 'var(--fs-11)', color: risk ? 'var(--status-warning-fg)' : 'var(--text-tertiary)', borderBottomWidth: 1, borderBottomStyle: 'dashed', borderBottomColor: 'var(--border-default)', cursor: 'default', whiteSpace: 'nowrap' }}>
            {role.label}
          </span>
        </Popover>
      </div>
    </div>
  );
}

function LegendItem({ dashed, dotted, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <svg width="14" height="6" style={{ flex: 'none' }}>
        <path d="M0 3 H14" stroke={dotted ? 'var(--status-warning-fg)' : 'var(--neutral-400)'} strokeWidth="1.5"
          strokeDasharray={dashed ? '3 3' : dotted ? '1.5 3' : undefined} />
      </svg>
      {children}
    </span>
  );
}

Object.assign(window, { DecisionGraph, DECISION_GRAPH: GRAPH });
})();
