(() => {
const { Icon, IconButton, Button, Badge, Card, Divider, StatusDot, StatDelta, Sparkline, Input, Select, FilterSelect, Switch, Tabs, EmptyState, Pagination, DropdownMenu, Popover, Tag } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, TableFrame, FilterBar, AskButton, TableScrollContext, TableFreezeStyles } = window;

/* 广告投放：八项汇总指标 + 计划列表（开关、状态、投放设置、七项数据列） */

const RANGE = { from: '2026-08-08', to: '2026-08-14' };

const SUMMARY = [
  { label: '整体消耗（元）', value: '¥25,910.68', delta: -25.9, goodWhen: 'none' },
  { label: '净成交ROI', value: '2.30', delta: -4.3, goodWhen: 'up' },
  { label: '净成交金额（元）', value: '¥59,580.30', delta: -29.1, goodWhen: 'up' },
  { label: '1小时内退款率', value: '5.50%', delta: 14.7, goodWhen: 'down' },
  { label: '整体支付ROI', value: '2.43', delta: -3.6, goodWhen: 'up' },
  { label: '整体成交金额（元）', value: '¥63,047.40', delta: -28.6, goodWhen: 'up' },
  { label: '净成交金额结算率', value: '94.50%', delta: -0.7, goodWhen: 'up' },
  { label: '净成交订单数', value: '1,355', delta: -30.6, goodWhen: 'up' },
];

const PLANS = [
  { id: '1865498524981579', name: '05-18_糯糯食光-2-2.2-2.4', on: true, status: '投放中', budget: '12,999元', roiTarget: '2.38', spend: '11,037.83', roi: '2.37', gmv: '26,118.20', orders: '547', total: '28,083.90', guard: true },
  { id: '1865781902860823', name: '5.21-悦悦的低卡好物-脆笋去骨', on: true, status: '投放中', budget: '3,000元', roiTarget: '2.40', spend: '6,470.53', roi: '2.34', gmv: '15,119.10', orders: '378', total: '15,830.30', guard: true },
  { id: '1872739245147610', name: '8.6-脆笋-小胡过家家-郝', on: false, status: '已暂停', budget: '3,999元', roiTarget: '2.40', spend: '2,994.90', roi: '2.43', gmv: '7,281.00', orders: '152', total: '7,428.90', guard: true },
  { id: '1864422628795400', name: '05-06_脆笋去骨-咖喱食光', on: true, status: '投放中', budget: '21,999元', roiTarget: '2.50', spend: '1,768.39', roi: '2.20', gmv: '3,887.70', orders: '102', total: '4,065.50', guard: true },
  { id: '1869571438180538', name: '7.2-脆笋-小艾轻食零食-郝', on: false, status: '已暂停', budget: '1,000元', roiTarget: '2.30', spend: '1,340.64', roi: '2.00', gmv: '2,677.40', orders: '73', total: '2,677.40', guard: true },
  { id: '1872562639925324', name: '8.4-脆笋-不二の零食铺子-郝', on: false, status: '已暂停', budget: '800元', roiTarget: '2.33', spend: '1,170.39', roi: '2.21', gmv: '2,583.70', orders: '65', total: '2,849.60', guard: true },
  { id: '1870769742434320', name: '7.15-红油-阿妍解馋记-郝', on: false, status: '已暂停', budget: '800元', roiTarget: '2.00', spend: '690.52', roi: '1.86', gmv: '1,287.30', orders: '24', total: '1,397.00', guard: true },
  { id: '1869397904759836', name: '6.30-脆笋-小胡过家家-郝', on: false, status: '已暂停', budget: '1,500元', roiTarget: '2.08', spend: '397.06', roi: '1.05', gmv: '416.20', orders: '11', total: '505.10', guard: true },
];

function CampaignsScreen() {
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState('全部状态');
  const [sort, setSort] = React.useState('spend');
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(20);
  const [on, setOn] = React.useState(() => PLANS.reduce((m, p) => Object.assign(m, { [p.id]: p.on }), {}));

  const rows = PLANS.filter((p) => {
    if (q && !(p.name.includes(q) || p.id.includes(q))) return false;
    if (status !== '全部状态') {
      const st = on[p.id] ? '投放中' : '已暂停';
      if (st !== status) return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const at = Math.min(page, pageCount);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      <Header />
      <SummaryGrid />
      <Card padded={false}>
        <FilterBar inset trailing={<Button variant="ghost" size="sm" iconLeft="download">导出</Button>}>
          <Input placeholder="搜索名称、ID或标签" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 200px', minWidth: 0 }} />
          <FilterSelect value={status} onChange={setStatus} width={132}
            options={['全部状态', '投放中', '已暂停'].map((o) => ({ label: o, count: o === '全部状态' ? PLANS.length : PLANS.filter((x) => (on[x.id] ? '投放中' : '已暂停') === o).length }))} />
        </FilterBar>
      </Card>

      <PlanTable rows={rows} on={on} onToggle={(id) => setOn((m) => Object.assign({}, m, { [id]: !m[id] }))} sort={sort} onSort={setSort} />
      {rows.length === 0 ? <Card><EmptyState compact icon="search-x" title="没有符合条件的计划" description="换个关键词，或把状态筛选放宽。" /></Card> : null}
      <StickyFooter>
        <Pagination page={at} pageCount={pageCount} total={rows.length} onChange={setPage}
          pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
      </StickyFooter>
    </div>
  );
}

function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap', minWidth: 0 }}>
      <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap' }}>商品全域投放</span>
      <span style={{ flex: 1 }} />
      <IconButton icon="maximize-2" label="全屏" variant="secondary" size="sm" />
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', height: 'var(--control-h-sm)',
        padding: '0 var(--space-5)', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)',
        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
        fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', cursor: 'pointer',
      }}>
        <Icon name="calendar" size={14} style={{ color: 'var(--text-tertiary)' }} />
        {RANGE.from}
        <Icon name="chevron-right" size={12} style={{ color: 'var(--text-tertiary)' }} />
        {RANGE.to}
      </span>
    </div>
  );
}

/* 八项指标：宽栏 4 列 × 2 行，窄栏 2 列 × 4 行 —— 两种都排满 */
function SummaryGrid() {
  const box = React.useRef(null);
  const [cols, setCols] = React.useState(2);
  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setCols(el.clientWidth >= 760 ? 4 : 2);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', minmax(0, 1fr))', gap: 'var(--space-3)', minWidth: 0 }}>
      {SUMMARY.map((m) => (
        <div key={m.label} style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', padding: '10px var(--space-5)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', minWidth: 0,
        }}>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', marginTop: 2, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)', fontVariantNumeric: 'tabular-nums' }}>{m.value}</span>
            <StatDelta value={m.delta} goodWhen={m.goodWhen} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* 计划列表：左侧固定「计划」列，右侧数据列可横向滚动 */
function PlanTable({ rows, on, onToggle, sort, onSort }) {
  const COLS = [
    { key: 'spend', header: '整体消耗(元)' },
    { key: 'roi', header: '净成交ROI' },
    { key: 'gmv', header: '净成交金额(元)' },
    { key: 'orders', header: '净成交订单数' },
    { key: 'total', header: '整体成交金额(元)' },
  ];
  const th = {
    padding: '10px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap', verticalAlign: 'middle',
    fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = {
    padding: 'var(--space-5) var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)',
  };
  /* 横向滚动时锁住「开关 + 计划」与行尾操作：中间数据列滑动，两头不动。
     阴影只在该侧确有被遮住的列时出现。 */
  return (
    <TableFrame>{(fz) => (
      <table style={{ width: '100%', minWidth: 940, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
        <thead>
          <tr>
            <th style={Object.assign({}, th, fz.head(0), { width: 76 })} />
            <th style={Object.assign({}, th, fz.head(76), fz.headEdge, { minWidth: 230 })}>计划</th>
            <th style={Object.assign({}, th, { width: 110 })}>计划状态</th>
            <th style={Object.assign({}, th, { minWidth: 170 })}>投放设置</th>
            {COLS.map((c) => (
              <th key={c.key} style={Object.assign({}, th, { textAlign: 'right', cursor: 'pointer' })} onClick={() => onSort(c.key)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  {c.header}
                  <Icon name={sort === c.key ? 'arrow-down' : 'chevrons-up-down'} size={11}
                    style={{ color: sort === c.key ? 'var(--text-primary)' : 'var(--neutral-400)' }} />
                </span>
              </th>
            ))}
            <th style={Object.assign({}, th, fz.headEnd, { width: 44 })} />
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const live = on[p.id];
            return (
              <tr key={p.id} {...rowHoverProps(live ? 'var(--surface-card)' : 'var(--neutral-25)')} style={{ background: live ? 'var(--surface-card)' : 'var(--neutral-25)' }}>
                <td style={Object.assign({}, td, fz.cell(0))}><PlanSwitch on={live} onChange={() => onToggle(p.id)} /></td>
                <td style={Object.assign({}, td, fz.cell(76), fz.cellEdge)}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
                      <span style={{ fontWeight: 'var(--fw-medium)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                      <AskButton kind="campaign" label={p.name} hint={'日耗 ' + (p.cost || p.budget)} />
                    </div>
                    <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2 }}>ID: {p.id}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                      <AssetLink icon="package" label="商品" />
                      <AssetLink icon="image" label="素材" />
                    </div>
                  </div>
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <StatusDot tone={live ? 'success' : 'neutral'} label={live ? '投放中' : '已暂停'}
                      style={{ fontSize: 'var(--fs-13)', color: live ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap' }} />
                    {p.guard ? <GuardBadge /> : null}
                  </div>
                </td>
                <td style={Object.assign({}, td, { color: 'var(--text-secondary)' })}>
                  <div style={{ fontVariantNumeric: 'tabular-nums' }}>每日预算 {p.budget}</div>
                  <div style={{ fontVariantNumeric: 'tabular-nums', marginTop: 3 }}>ROI目标 {p.roiTarget} <span style={{ color: 'var(--text-tertiary)' }}>(净成交)</span></div>
                </td>
                {COLS.map((c) => (
                  <td key={c.key} style={Object.assign({}, td, {
                    textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                    fontWeight: c.key === sort ? 'var(--fw-semibold)' : 'var(--fw-regular)',
                  })}>{p[c.key]}</td>
                ))}
                <td style={Object.assign({}, td, fz.cellEnd, { textAlign: 'right' })}>
                  <DropdownMenu align="right" trigger={<IconButton icon="ellipsis" label="计划操作" size="sm" />} items={[
                    { id: 'edit', label: '修改预算与出价', icon: 'pencil' },
                    { id: 'detail', label: '查看计划详情', icon: 'external-link' },
                    { id: 'copy', label: '复制计划', icon: 'copy' },
                    { divider: true },
                    { id: 'stop', label: live ? '暂停投放' : '恢复投放', icon: live ? 'pause' : 'play' },
                  ]} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}</TableFrame>
  );
}

/* 启用／停用开关，带文字标签 */
function PlanSwitch({ on, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onChange}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, height: 24, padding: on ? '0 3px 0 7px' : '0 7px 0 3px',
        borderRadius: 'var(--radius-pill)', cursor: 'pointer', font: 'inherit',
        flexDirection: on ? 'row' : 'row-reverse',
        background: on ? 'var(--status-success-bg)' : 'var(--neutral-100)',
        borderWidth: 1, borderStyle: 'solid', borderColor: on ? 'var(--status-success-border)' : 'var(--border-subtle)',
        color: on ? 'var(--status-success-fg)' : 'var(--text-tertiary)',
        transition: 'var(--transition-control)',
      }}>
      <span style={{ fontSize: 'var(--fs-12)', whiteSpace: 'nowrap' }}>{on ? '启用' : '停用'}</span>
      <span style={{ width: 16, height: 16, borderRadius: 999, background: 'var(--neutral-0)', boxShadow: 'var(--shadow-xs)', flex: 'none' }} />
    </button>
  );
}

/* 商品／素材入口：缩略图取自 assets/placeholders，替换同名文件即可换成真实图片 */
const thumbOf = (label) => (window.__res ? window.__res('../../assets/placeholders/product-' + ((label === '商品' ? 1 : 3)) + '.png') : '../../assets/placeholders/product-' + ((label === '商品' ? 1 : 3)) + '.png');

function AssetLink({ icon, label }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, height: 24, padding: '0 5px 0 3px',
        border: 0, borderRadius: 'var(--radius-sm)', cursor: 'pointer', font: 'inherit',
        background: hover ? 'var(--surface-hover)' : 'transparent', transition: 'var(--transition-control)',
      }}>
      <img src={thumbOf(label)} alt="" style={{
        width: 18, height: 18, flex: 'none', objectFit: 'cover', display: 'block',
        borderRadius: 3, background: 'var(--neutral-100)',
      }} />
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{label}</span>
      <Icon name="chevron-right" size={11} style={{ color: 'var(--text-tertiary)' }} />
    </button>
  );
}

/* 保 = 已开启投放保障 */
function GuardBadge() {
  return (
    <Popover placement="top" width={190} content={<span>已开启投放保障：ROI 低于目标时自动限流，避免超成本消耗。</span>}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 2, height: 18, padding: '0 4px',
        borderRadius: 3, background: 'var(--status-success-bg)', color: 'var(--status-success-fg)',
        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--status-success-border)',
        fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap', cursor: 'default',
      }}>
        <Icon name="circle-check" size={10} />保
      </span>
    </Popover>
  );
}

Object.assign(window, { CampaignsScreen });
})();
