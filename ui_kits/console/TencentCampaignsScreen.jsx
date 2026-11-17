(() => {
const { Icon, IconButton, Button, Card, StatusDot, StatDelta, Input, FilterSelect, Switch, EmptyState, Pagination, Popover } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, TableFrame, FilterBar, DateRangeField, rowHoverProps, AskButton, TableScrollContext, TableFreezeStyles } = window;

/* 腾讯营销 · 广告投放：营销单元列表。
   腾讯这套的投放对象是「营销单元」，指标是曝光—点击—转化那条链路（花费、曝光次数、
   点击次数、点击率、点击均价、转化量、转化成本），没有 ROI/GMV —— 那是千川电商侧的口径。
   所以这一屏不复用千川的计划表：列不同、汇总口径不同、行内操作也不同
  （腾讯是编辑 / 复制 / 添加创意，创意挂在营销单元下面）。 */

const CONTENT = ['商品目录', '微信小程序', '公众号', '视频号直播'];

const UNITS = [
  { id: '31184920571', name: '8.29.2 虎皮凤爪-朋友圈-公众号小图', content: '公众号', bid: '182.00', state: '部分投放中', spend: '90.97', imp: '2,165', clicks: '43', ctr: '1.99%', cpc: '2.12', conv: '0', cpa: '0.00', src: 'matrix', batch: '8.29 版位对照' },
  { id: '31184920448', name: '8.29.1 虎皮凤爪-朋友圈-公众号小图', content: '公众号', bid: '183.00', state: '投放中', spend: '3.45', imp: '159', clicks: '2', ctr: '1.26%', cpc: '1.73', conv: '0', cpa: '0.00', src: 'matrix', batch: '8.29 版位对照' },
  { id: '31184903312', name: '8.28.1 脆笋-AIM 无联测试 TY', content: '商品目录', bid: '200.00', state: '暂停中', spend: '0.00', imp: '0', clicks: '0', ctr: '—', cpc: '0.00', conv: '0', cpa: '0.00', src: 'manual' },
  { id: '31184903177', name: '8.28.1 脆笋-AIM 测试 TY', content: '商品目录', bid: '210.00', state: '暂停中', spend: '0.00', imp: '0', clicks: '0', ctr: '—', cpc: '0.00', conv: '0', cpa: '0.00', src: 'manual' },
  { id: '31184887026', name: '8.27.1 脆笋-AIM 测试 TY-A', content: '商品目录', bid: '200.00', state: '暂停中', spend: '4,679.38', imp: '48,464', clicks: '9,931', ctr: '20.49%', cpc: '0.47', conv: '46', cpa: '101.73', src: 'matrix', batch: '8.27 出价梯度' },
  { id: '31184832905', name: '8.23.1 红油凤爪-视频号直播引流', content: '视频号直播', bid: '300.00', state: '投放中', spend: '493.49', imp: '7,050', clicks: '238', ctr: '3.38%', cpc: '2.07', conv: '2', cpa: '246.75', src: 'manual' },
  { id: '31184821660', name: '8.22.2 脆笋-AIM 测试 TY', content: '商品目录', bid: '200.00', state: '暂停中', spend: '264.67', imp: '16,935', clicks: '1,145', ctr: '6.76%', cpc: '0.23', conv: '5', cpa: '52.93', src: 'matrix', batch: '8.22 人群拓量' },
  { id: '31184821533', name: '8.22.1 虎皮凤爪-小程序放量测试 TY', content: '微信小程序', bid: '0.00', state: '暂停中', spend: '0.00', imp: '0', clicks: '0', ctr: '—', cpc: '0.00', conv: '0', cpa: '0.00', src: 'manual' },
  { id: '31184810274', name: '8.21.2 虎皮凤爪-公众号测试 TY-一键起量', content: '公众号', bid: '280.00', state: '暂停中', spend: '0.07', imp: '3', clicks: '0', ctr: '0.00%', cpc: '0.00', conv: '0', cpa: '0.00', src: 'matrix', batch: '8.21 一键起量对照' },
  { id: '31184810119', name: '8.21.1 虎皮凤爪-公众号测试 TY', content: '公众号', bid: '255.00', state: '暂停中', spend: '24.45', imp: '1,986', clicks: '14', ctr: '0.70%', cpc: '1.75', conv: '0', cpa: '0.00', src: 'matrix', batch: '8.21 一键起量对照' },
  { id: '31184796508', name: '8.20.1 会员召回-小程序拉活 TY', content: '微信小程序', bid: '160.00', state: '部分投放中', spend: '1,208.60', imp: '31,472', clicks: '612', ctr: '1.94%', cpc: '1.98', conv: '9', cpa: '134.29', src: 'manual' },
  { id: '31184781340', name: '8.19.1 藤椒味-朋友圈新品试销', content: '商品目录', bid: '240.00', state: '暂停中', spend: '736.12', imp: '18,240', clicks: '390', ctr: '2.14%', cpc: '1.89', conv: '3', cpa: '245.37', src: 'manual' },
];

const STATE_TONE = { 投放中: 'success', 部分投放中: 'success', 暂停中: 'neutral' };
const STATE_HINT = {
  投放中: '营销单元与其下全部创意均在投放。',
  部分投放中: '单元下部分创意在投放，其余处于审核中或未通过。',
  暂停中: '单元已手动暂停，不再消耗预算。',
};

const SUMMARY = [
  { label: '花费（元）', value: '¥7,501.20', delta: -18.4, goodWhen: 'none' },
  { label: '曝光次数', value: '126,474', delta: -22.7, goodWhen: 'up' },
  { label: '点击次数', value: '12,375', delta: -11.2, goodWhen: 'up' },
  { label: '点击率', value: '9.78%', delta: 14.9, goodWhen: 'up' },
  { label: '点击均价（元）', value: '0.61', delta: -8.1, goodWhen: 'down' },
  { label: '转化量', value: '65', delta: -6.4, goodWhen: 'up' },
  { label: '转化成本（元）', value: '115.40', delta: 12.6, goodWhen: 'down' },
  { label: '千次曝光成本（元）', value: '59.31', delta: 5.5, goodWhen: 'down' },
];

function TencentCampaignsScreen() {
  const [q, setQ] = React.useState('');
  const [state, setState] = React.useState('全部状态');
  const [content, setContent] = React.useState('全部营销内容');
  const [src, setSrc] = React.useState('全部来源');
  const [range, setRange] = React.useState('近 7 天');
  const [sort, setSort] = React.useState('spend');
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(20);
  const [on, setOn] = React.useState(() => UNITS.reduce((m, u) => Object.assign(m, { [u.id]: u.state !== '暂停中' }), {}));

  const rows = UNITS.filter((u) => (!q || u.name.includes(q) || u.id.includes(q))
    && (state === '全部状态' || stateOf(u, on) === state)
    && (content === '全部营销内容' || u.content === content)
    && (src === '全部来源' || (src === '投放矩阵' ? u.src === 'matrix' : u.src !== 'matrix')));
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const at = Math.min(page, pageCount);
  const shown = rows.slice((at - 1) * size, at * size);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap', minWidth: 0 }}>
        <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap' }}>营销单元</span>
        <span style={{ flex: 1 }} />
        <IconButton icon="sliders-horizontal" label="列设置" variant="secondary" size="sm" />
        <DateRangeField start="2026-08-23" end="2026-08-29" preset={range} onPreset={setRange}
          presets={['今天', '昨天', '近 7 天', '近 30 天', '自定义区间…']} />
      </div>

      <SummaryGrid />

      <Card padded={false}>
        <FilterBar inset trailing={<>
          <Button variant="ghost" size="sm" iconLeft="download">导出</Button>
          <Button size="sm" iconLeft="plus">新建营销单元</Button>
        </>}>
          <Input placeholder="搜索营销单元名称或 ID" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 200px', minWidth: 0, maxWidth: 260 }} />
          <FilterSelect value={state} onChange={(v) => { setState(v); setPage(1); }} width={140}
            options={['全部状态', '投放中', '部分投放中', '暂停中'].map((o) => ({ label: o, count: o === '全部状态' ? UNITS.length : UNITS.filter((x) => stateOf(x, on) === o).length }))} />
          <FilterSelect value={src} onChange={(v) => { setSrc(v); setPage(1); }} width={132}
            options={['全部来源', '投放矩阵', '手动创建'].map((o) => ({ label: o, count: o === '全部来源' ? UNITS.length : UNITS.filter((x) => (o === '投放矩阵' ? x.src === 'matrix' : x.src !== 'matrix')).length }))} />
          <FilterSelect value={content} onChange={(v) => { setContent(v); setPage(1); }} width={148}
            options={['全部营销内容'].concat(CONTENT).map((o) => ({ label: o, count: o.startsWith('全部') ? UNITS.length : UNITS.filter((x) => x.content === o).length }))} />
        </FilterBar>
      </Card>

      {rows.length ? (
        <>
          <UnitTable rows={shown} on={on} onToggle={(id) => setOn((m) => Object.assign({}, m, { [id]: !m[id] }))} sort={sort} onSort={setSort} />
          <StickyFooter>
            <Pagination page={at} pageCount={pageCount} total={rows.length} onChange={setPage}
              pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
          </StickyFooter>
        </>
      ) : <Card><EmptyState compact icon="search-x" title="没有符合条件的营销单元" description="换个关键词，或把筛选条件放宽。" /></Card>}
    </div>
  );
}

/* 关掉开关一律是「暂停中」；打开则回到该单元自身的投放状态（可能是部分投放中） */
function stateOf(u, on) {
  if (!on[u.id]) return '暂停中';
  return u.state === '暂停中' ? '投放中' : u.state;
}

function SummaryGrid() {
  const box = React.useRef(null);
  const [cols, setCols] = React.useState(3);
  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setCols(el.clientWidth >= 760 ? 4 : 3);
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

function UnitTable({ rows, on, onToggle, sort, onSort }) {
  const COLS = [
    { key: 'spend', header: '花费(元)' },
    { key: 'imp', header: '曝光次数' },
    { key: 'clicks', header: '点击次数' },
    { key: 'ctr', header: '点击率' },
    { key: 'cpc', header: '点击均价' },
    { key: 'conv', header: '转化量' },
    { key: 'cpa', header: '转化成本' },
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
  /* 横向滚动时锁住「开关 + 营销单元名称」与「操作」：中间数据列滑动，两头不动。
     阴影只在该侧确有被遮住的列时出现。 */
  return (
    <TableFrame>{(fz) => (
      <table style={{ width: '100%', minWidth: 1330, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
        <thead>
          <tr>
            <th style={Object.assign({}, th, fz.head(0), { width: 60 })} />
            <th style={Object.assign({}, th, fz.head(60), fz.headEdge, { width: 200, minWidth: 200, maxWidth: 200 })}>营销单元名称</th>
            <th style={Object.assign({}, th, { width: 110 })}>营销内容</th>
            <th style={Object.assign({}, th, { width: 150 })}>创建来源</th>
            <th style={Object.assign({}, th, { width: 96, textAlign: 'right' })}>出价</th>
            <th style={Object.assign({}, th, { width: 124 })}>状态</th>
            {COLS.map((c) => (
              <th key={c.key} style={Object.assign({}, th, { textAlign: 'right', cursor: 'pointer' })} onClick={() => onSort(c.key)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  {c.header}
                  <Icon name={sort === c.key ? 'arrow-down' : 'chevrons-up-down'} size={11}
                    style={{ color: sort === c.key ? 'var(--text-primary)' : 'var(--neutral-400)' }} />
                </span>
              </th>
            ))}
            <th style={Object.assign({}, th, fz.headEnd, { width: 188 })}>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => {
            const live = on[u.id];
            const st = stateOf(u, on);
            return (
              <tr key={u.id} {...rowHoverProps(live ? 'var(--surface-card)' : 'var(--neutral-25)')} style={{ background: live ? 'var(--surface-card)' : 'var(--neutral-25)' }}>
                <td style={Object.assign({}, td, fz.cell(0))}><Switch checked={live} onChange={() => onToggle(u.id)} aria-label={live ? '暂停该单元' : '启用该单元'} /></td>
                <td style={Object.assign({}, td, fz.cell(60), fz.cellEdge, { maxWidth: 200 })}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
                    <Icon name="clipboard-list" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
                    <span title={u.name} style={{ fontWeight: 'var(--fw-medium)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</span>
                    <AskButton kind="campaign" label={u.name} hint={'花费 ¥' + u.spend} />
                  </div>
                  <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2, paddingLeft: 22 }}>ID: {u.id}</div>
                </td>
                <td style={Object.assign({}, td, { color: 'var(--text-secondary)' })}>{u.content}</td>
                {/* 创建来源：矩阵建的点批次名可回到那一批，手动建的只是一句灰字 */}
                <td style={Object.assign({}, td, { maxWidth: 150 })}>
                  {u.src === 'matrix'
                    ? <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                        <Icon name="grid-3x3" size={12} style={{ flex: 'none', color: 'var(--status-ai-fg)' }} />
                        <button type="button" title={'投放矩阵 · ' + u.batch} onClick={() => window.HUITOU_OPEN_RAIL && window.HUITOU_OPEN_RAIL('matrix')}
                          style={{ padding: 0, border: 0, background: 'none', font: 'inherit', fontSize: 'var(--fs-12)', color: 'var(--text-primary)', cursor: 'pointer', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.batch}</button>
                      </div>
                    : <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
                        <Icon name="user" size={12} style={{ flex: 'none' }} />手动创建
                      </span>}
                </td>
                <td style={Object.assign({}, td, { textAlign: 'right', fontVariantNumeric: 'tabular-nums' })}>{u.bid}</td>
                <td style={td}>
                  <Popover placement="top" width={210} content={<span>{STATE_HINT[st]}</span>}>
                    <span style={{ cursor: 'help' }}>
                      <StatusDot tone={STATE_TONE[st]} label={st}
                        style={{ fontSize: 'var(--fs-13)', color: st === '暂停中' ? 'var(--text-secondary)' : 'var(--text-primary)', whiteSpace: 'nowrap' }} />
                    </span>
                  </Popover>
                </td>
                {COLS.map((c) => (
                  <td key={c.key} style={Object.assign({}, td, {
                    textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                    color: u[c.key] === '—' ? 'var(--text-tertiary)' : undefined,
                    fontWeight: c.key === sort ? 'var(--fw-semibold)' : 'var(--fw-regular)',
                  })}>{u[c.key]}</td>
                ))}
                <td style={Object.assign({}, td, fz.cellEnd)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <Button variant="link" size="sm">编辑</Button>
                    <Button variant="link" size="sm">复制</Button>
                    <Button variant="link" size="sm">添加创意</Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}</TableFrame>
  );
}

Object.assign(window, { TencentCampaignsScreen });
})();
