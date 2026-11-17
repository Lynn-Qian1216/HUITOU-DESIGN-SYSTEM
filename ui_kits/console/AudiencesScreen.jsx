(() => {
const { Icon, IconButton, Button, Badge, Card, StatusDot, Input, FilterSelect, EmptyState, Pagination, Popover, Alert, ProgressBar } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, TableFrame, FilterBar, rowHoverProps } = window;

/* 腾讯营销 · 人群包：列表（规模、来源、新鲜度）+ 失效提醒。
   新鲜度不是「更新时间」的同义词 —— 它按「距上次更新的天数 / 该来源的建议更新周期」算，
   同样 7 天没更新，行为人群包已经过期，而基础属性包还很新。 */

const SOURCE = {
  行为人群: { cycle: 7, icon: 'mouse-pointer-click' },
  订单回流: { cycle: 14, icon: 'shopping-bag' },
  相似扩展: { cycle: 21, icon: 'users-round' },
  基础属性: { cycle: 90, icon: 'sliders-horizontal' },
  外部导入: { cycle: 30, icon: 'upload' },
};
const SOURCES = Object.keys(SOURCE);
const MIN_SIZE = 50000;   // 可投下限：低于此值腾讯侧不放量

const NAMES = ['近 30 天加购未购', '藤椒味复购客', '虎皮凤爪高价值客', '零食兴趣泛人群', '直播间互动未转化', '竞品浏览人群', '门店周边 3km', '会员到期未续'];

const PACKS = Array.from({ length: 34 }, (_, i) => {
  const source = SOURCES[i % SOURCES.length];
  const cycle = SOURCE[source].cycle;
  const age = (i * 5) % (cycle * 2);
  const size = i % 11 === 0 ? 12000 + ((i * 733) % 30000) : 60000 + ((i * 9173) % 4200000);
  /* 新鲜度：0 天为满，达到建议周期归零。过期的不截断成 0，让人看出过了多久。 */
  const fresh = Math.round((1 - age / cycle) * 100);
  return {
    id: 'a' + (i + 1),
    name: NAMES[i % NAMES.length] + (i > 7 ? ' ' + String.fromCharCode(65 + (i % 26)) : ''),
    source, cycle, age, fresh, size,
    used: (i * 3) % 7,
    cpa: '¥' + (24 + ((i * 13) % 42)) + '.' + (10 + (i % 89)),
    ctr: (1.8 + ((i * 17) % 26) / 10).toFixed(2) + '%',
  };
});

const stateOf = (p) => (p.size < MIN_SIZE ? 'thin' : p.age > p.cycle ? 'stale' : p.fresh <= 25 ? 'aging' : 'ok');
const STATE = {
  ok: { label: '可投', tone: 'success' },
  aging: { label: '即将过期', tone: 'warning' },
  stale: { label: '已过期', tone: 'danger' },
  thin: { label: '规模不足', tone: 'danger' },
};

const fmtSize = (n) => (n >= 10000 ? (n / 10000).toFixed(n >= 1000000 ? 0 : 1) + ' 万' : n.toLocaleString());

function AudiencesScreen() {
  const [q, setQ] = React.useState('');
  const [source, setSource] = React.useState('全部来源');
  const [state, setState] = React.useState('全部状态');
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(20);

  const rows = PACKS.filter((p) => (!q || p.name.includes(q) || p.id.includes(q))
    && (source === '全部来源' || p.source === source)
    && (state === '全部状态' || STATE[stateOf(p)].label === state));
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const at = Math.min(page, pageCount);

  const bad = PACKS.filter((p) => ['stale', 'thin'].includes(stateOf(p)));
  const soon = PACKS.filter((p) => stateOf(p) === 'aging');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      {/* 失效提醒放在最上面并写清后果 —— 「已过期」本身不说明问题，「不再拉新、只在老人群里循环」才说明问题 */}
      {bad.length ? (
        <Alert tone="danger" title={bad.length + ' 个人群包已不可投'}
          action={<Button variant="secondary" size="sm" onClick={() => setState('已过期')}>只看这些</Button>}>
          其中 {bad.filter((p) => stateOf(p) === 'stale').length} 个超过建议更新周期，{bad.filter((p) => stateOf(p) === 'thin').length} 个规模跌破 {fmtSize(MIN_SIZE)} 可投下限。
          继续投放不会报错，但腾讯侧不再放量，预算会挤到其余人群包里。
        </Alert>
      ) : null}
      {soon.length ? (
        <Alert tone="warning" title={soon.length + ' 个人群包临近过期'}
          action={<Button variant="ghost" size="sm" onClick={() => setState('即将过期')}>只看这些</Button>}>
          新鲜度低于 25%，建议在本周内重新计算，否则下周起会陆续停止放量。
        </Alert>
      ) : null}

      <Card padded={false}>
        <FilterBar inset trailing={
          <span style={{ display: 'inline-flex', gap: 'var(--space-4)' }}>
            <Button variant="ghost" size="sm" iconLeft="refresh-cw">批量重算</Button>
            <Button variant="secondary" size="sm" iconLeft="plus">新建人群包</Button>
          </span>
        }>
          <Input placeholder="搜索人群包名称/ID" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 180px', minWidth: 0, maxWidth: 240 }} />
          <FilterSelect value={source} onChange={setSource} width={140}
            options={['全部来源'].concat(SOURCES).map((o) => ({ label: o, count: o.startsWith('全部') ? PACKS.length : PACKS.filter((x) => x.source === o).length }))} />
          <FilterSelect value={state} onChange={setState} width={140}
            options={['全部状态', '可投', '即将过期', '已过期', '规模不足'].map((o) => ({ label: o, count: o.startsWith('全部') ? PACKS.length : PACKS.filter((x) => STATE[stateOf(x)].label === o).length }))} />
        </FilterBar>
      </Card>

      {rows.length ? (
        <>
          <PackTable rows={rows.slice((at - 1) * size, at * size)} />
          <StickyFooter>
            <Pagination page={at} pageCount={pageCount} total={rows.length} onChange={setPage}
              pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
          </StickyFooter>
        </>
      ) : <Card><EmptyState compact icon="search-x" title="没有匹配的人群包" description="换个关键词，或把筛选条件放宽。" /></Card>}
    </div>
  );
}

function PackTable({ rows }) {
  const th = {
    padding: '12px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap',
    fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = { padding: 'var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' };
  const num = Object.assign({}, td, { fontVariantNumeric: 'tabular-nums' });

  return (
    <TableFrame>
      <table style={{ width: '100%', minWidth: 1040, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
        <thead>
          <tr>
            <th style={Object.assign({}, th, { minWidth: 280 })}>人群包</th>
            <th style={Object.assign({}, th, { width: 128 })}>来源</th>
            <th style={Object.assign({}, th, { width: 120 })}>规模</th>
            <th style={Object.assign({}, th, { width: 180 })}>新鲜度</th>
            <th style={Object.assign({}, th, { width: 120 })}>状态</th>
            <th style={Object.assign({}, th, { width: 110 })}>在投计划</th>
            <th style={Object.assign({}, th, { width: 110 })}>转化成本</th>
            <th style={Object.assign({}, th, { width: 96 })}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const s = stateOf(p);
            const thin = s === 'thin';
            return (
              <tr key={p.id} {...rowHoverProps()}>
                <td style={td}>
                  <div style={{ minWidth: 0, maxWidth: 300 }}>
                    <div style={{ fontWeight: 'var(--fw-medium)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>{p.id}</div>
                  </div>
                </td>
                <td style={td}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                    <Icon name={SOURCE[p.source].icon} size={13} style={{ color: 'var(--text-tertiary)' }} />{p.source}
                  </span>
                </td>
                <td style={num}>
                  <span style={{ color: thin ? 'var(--status-danger-fg)' : 'var(--text-primary)', fontWeight: thin ? 'var(--fw-medium)' : 'var(--fw-regular)' }}>{fmtSize(p.size)}</span>
                </td>
                <td style={td}><Freshness pack={p} /></td>
                <td style={td}>
                  <Popover placement="right" width={228} content={<span>{thin
                    ? '规模 ' + fmtSize(p.size) + '，低于可投下限 ' + fmtSize(MIN_SIZE) + '，腾讯侧不会放量。'
                    : p.source + '的建议更新周期为 ' + p.cycle + ' 天，本包已 ' + p.age + ' 天未更新。'}</span>}>
                    <span style={{ cursor: 'help' }}><Badge tone={STATE[s].tone} dot>{STATE[s].label}</Badge></span>
                  </Popover>
                </td>
                <td style={num}>{p.used ? p.used + ' 个' : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>
                <td style={num}>{p.used ? p.cpa : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}</td>
                <td style={Object.assign({}, td, { textAlign: 'right' })}>
                  <Button variant="ghost" size="sm">{s === 'ok' ? '用于投放' : '重算'}</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableFrame>
  );
}

/* 新鲜度给条 + 天数，不只给百分比 —— 「38%」说明不了要不要现在重算，「7 天前更新 / 建议 7 天」说明得了。 */
function Freshness({ pack: p }) {
  const over = p.age > p.cycle;
  const pct = Math.max(0, Math.min(100, p.fresh));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <ProgressBar value={pct} tone={over ? 'danger' : pct <= 25 ? 'warning' : 'success'} style={{ width: 132 }} />
      <span style={{ fontSize: 'var(--fs-11)', color: over ? 'var(--status-danger-fg)' : 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {p.age} 天前更新 · 建议 {p.cycle} 天
      </span>
    </div>
  );
}

Object.assign(window, { AudiencesScreen });
})();
