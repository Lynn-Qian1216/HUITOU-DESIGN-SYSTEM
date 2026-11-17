(() => {
const { Icon, IconButton, Button, Badge, Card, StatusDot, MetricCard, EmptyState, Input, FilterSelect, Switch, SegmentedControl } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, TableFrame, FilterBar, rowHoverProps } = window;

/* 广告计划（工作台级）：所有账户的在投计划汇总。
   投手来这里只有两个动作 —— 先看「有没有出事」，再决定「先看哪一条」。
   所以顺序是：汇总数 → 需要注意的三类（可直接筛）→ 列表。
   账户切换放左栏常驻，因为跨账户比较是这一页存在的理由。 */

const RANGES = ['今日', '昨日', '近 7 天'];

const PLANS = [
  { id: 'p1', acct: 'a1', name: '虎皮凤爪 · 全域推广', state: 'live', spend: 5812, imp: 184320, clicks: 4210, conv: 148, cpa: 39.3, target: 45, budget: 6000, src: '矩阵 · 第三轮' },
  { id: 'p2', acct: 'a1', name: '凤爪 · 达人分销测试', state: 'live', spend: 2140, imp: 61200, clicks: 1180, conv: 31, cpa: 69.0, target: 45, budget: 2200, src: '手动' },
  { id: 'p3', acct: 'a2', name: '官旗 · 会员召回', state: 'live', spend: 3960, imp: 121400, clicks: 2960, conv: 96, cpa: 41.3, target: 45, budget: 4000, src: '矩阵 · 第二轮' },
  { id: 'p4', acct: 'a2', name: '官旗 · 新客首单', state: 'paused', spend: 880, imp: 24100, clicks: 460, conv: 0, cpa: null, target: 45, budget: 1500, src: '手动' },
  { id: 'p5', acct: 'a3', name: '达人分销 · 秋季礼盒', state: 'live', spend: 1620, imp: 44800, clicks: 980, conv: 44, cpa: 36.8, target: 45, budget: 3000, src: '矩阵 · 第三轮' },
  { id: 'p6', acct: 'a4', name: '藤椒味 · 新品试销', state: 'live', spend: 1240, imp: 39600, clicks: 860, conv: 18, cpa: 68.9, target: 45, budget: 1400, src: '手动' },
  { id: 'p7', acct: 'a5', name: '会员召回 · 秋季', state: 'live', spend: 2260, imp: 71500, clicks: 1620, conv: 58, cpa: 39.0, target: 45, budget: 2600, src: '矩阵 · 第二轮' },
  { id: 'p8', acct: 'b1', name: '朋友圈 · 宠物险主力', state: 'live', spend: 2914, imp: 96500, clicks: 1840, conv: 62, cpa: 47.0, target: 45, budget: 3200, src: '矩阵 · 第一轮' },
  { id: 'p9', acct: 'b1', name: '朋友圈 · 竖版新素材', state: 'live', spend: 1180, imp: 38900, clicks: 720, conv: 12, cpa: 98.3, target: 45, budget: 1200, src: '矩阵 · 第一轮' },
  { id: 'p10', acct: 'b2', name: '小程序 · 会员召回', state: 'live', spend: 1470, imp: 52300, clicks: 1120, conv: 39, cpa: 37.7, target: 45, budget: 2000, src: '手动' },
  { id: 'p11', acct: 'b3', name: '视频号直播引流', state: 'live', spend: 3120, imp: 142600, clicks: 3410, conv: 101, cpa: 30.9, target: 45, budget: 3200, src: '手动' },
  { id: 'p12', acct: 'b4', name: '搜一搜品专', state: 'paused', spend: 0, imp: 0, clicks: 0, conv: 0, cpa: null, target: 45, budget: 0, src: '手动' },
];

const num = (n) => n.toLocaleString('zh-CN');
const yuan = (n) => '¥' + n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* 三类卡点，判据写在一处：角标、筛选、行内着色都读它 */
const FLAGS = [
  { id: 'over', label: '超出目标成本', tone: 'danger', icon: 'trending-up', test: (p) => p.cpa != null && p.cpa > p.target * 1.15 },
  { id: 'zero', label: '有花费零转化', tone: 'warning', icon: 'circle-slash', test: (p) => p.spend > 0 && p.conv === 0 },
  { id: 'cap', label: '预算即将耗尽', tone: 'warning', icon: 'battery-low', test: (p) => p.budget > 0 && p.spend / p.budget >= 0.9 },
];

function PlansView({ onOpenAccount }) {
  const { team } = window.useTeam();
  /* 只看当前团队名下的账户 */
  const all = (window.HUITOU_ACCOUNTS || []).filter((a) => team.accounts.includes(a.id));
  /* 先选平台：两个平台的字段口径不同（腾讯讲营销单元与版位，千川讲全域推广与 ROI），
     并成一张表只能取交集。切平台后账户与表头都跟着换。 */
  const [platform, setPlatform] = React.useState('qianchuan');
  const accounts = all.filter((a) => a.platform === platform);
  const [acct, setAcct] = React.useState('all');
  React.useEffect(() => { setAcct('all'); setFlag(null); }, [platform, team.id]);
  const [range, setRange] = React.useState('今日');
  const [flag, setFlag] = React.useState(null);
  const [q, setQ] = React.useState('');
  const [state, setState] = React.useState('全部状态');
  const [on, setOn] = React.useState({});
  /* 窄栏下 216px 的左栏会把正文挤到 380px，表格只剩两列可见 —— 这时把账户切换降级成筛选条上的一个下拉 */
  const [wide, setWide] = React.useState(() => window.innerWidth >= 1100);
  React.useEffect(() => {
    const fit = () => setWide(window.innerWidth >= 1100);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const inPlatform = PLANS.filter((p) => accounts.some((a) => a.id === p.acct));
  const scope = inPlatform.filter((p) => acct === 'all' || p.acct === acct);
  const counts = FLAGS.reduce((m, f) => Object.assign(m, { [f.id]: scope.filter(f.test).length }), {});
  const rows = scope
    .filter((p) => !flag || FLAGS.find((f) => f.id === flag).test(p))
    .filter((p) => !q || p.name.includes(q))
    .filter((p) => state === '全部状态' || (state === '投放中' ? p.state === 'live' : p.state !== 'live'));

  const spend = scope.reduce((n, p) => n + p.spend, 0);
  const conv = scope.reduce((n, p) => n + p.conv, 0);
  const cpa = conv ? spend / conv : null;
  const live = scope.filter((p) => p.state === 'live').length;
  const acctHit = accounts.find((a) => a.id === acct);
  const acctName = acct === 'all' || !acctHit ? '全部账户' : acctHit.tag || acctHit.name;

  return (
    <>
      <window.PageHeader title="广告计划" description={'团队「' + team.name + '」下所有账户的在投计划汇总。先选平台，再选账户。'}
        actions={<>
          <SegmentedControl value={range} onChange={setRange} options={RANGES.map((r) => ({ value: r, label: r }))} size="sm" />
          <Button variant="secondary" iconLeft="download">导出</Button>
        </>} />

      <PlatformTabs value={platform} onChange={setPlatform} all={all} />

      <div style={{ display: 'flex', gap: 'var(--space-7)', alignItems: 'flex-start', minWidth: 0 }}>
        {wide ? <AccountRail accounts={accounts} value={acct} onChange={setAcct} plans={inPlatform} /> : null}

        <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <MetricCard label={'花费 · ' + range} value={yuan(spend)} />
          <MetricCard label="转化数" value={num(conv)} />
          <MetricCard label="平均转化成本（CPA）" value={cpa ? yuan(cpa) : '—'} target="¥45.00" />
          <MetricCard label="在投计划" value={live + ' / ' + scope.length} />
        </div>

        {/* 需要注意：三类卡点直接当筛选用 —— 看见问题的下一步就是只看这些行 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>需要注意</span>
          {FLAGS.map((f) => {
            const n = counts[f.id];
            const active = flag === f.id;
            return (
              <button key={f.id} type="button" disabled={!n} onClick={() => setFlag(active ? null : f.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', padding: '5px var(--space-5)', font: 'inherit', fontSize: 'var(--fs-12)',
                  borderWidth: 1, borderStyle: 'solid', borderRadius: 'var(--radius-pill)', cursor: n ? 'pointer' : 'default',
                  borderColor: active ? 'var(--status-' + f.tone + '-fg)' : n ? 'var(--status-' + f.tone + '-border)' : 'var(--border-subtle)',
                  background: n ? 'var(--status-' + f.tone + '-bg)' : 'var(--surface-card)',
                  color: n ? 'var(--status-' + f.tone + '-fg)' : 'var(--text-tertiary)',
                }}>
                <Icon name={f.icon} size={12} />{f.label}
                <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--fw-medium)' }}>{n}</span>
              </button>
            );
          })}
          {flag ? <Button variant="ghost" size="sm" iconLeft="x" onClick={() => setFlag(null)}>清除筛选</Button> : null}
        </div>

        <Card padded={false} style={{ marginBottom: 'var(--space-6)' }}>
          <FilterBar inset trailing={<span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{acctName} · {rows.length} 条</span>}>
            {wide ? null : (
              <FilterSelect value={acctName} width={168}
                onChange={(label) => setAcct(label === '全部账户' ? 'all' : (accounts.find((x) => (x.tag || x.name) === label) || {}).id || 'all')}
                options={[{ label: '全部账户', count: inPlatform.length }].concat(accounts.map((x) => ({ label: x.tag || x.name, count: inPlatform.filter((p) => p.acct === x.id).length })))} />
            )}
            <Input placeholder="搜索计划名称" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 220 }} />
            <FilterSelect value={state} onChange={setState} width={128}
              options={['全部状态', '投放中', '已暂停'].map((o) => ({ label: o }))} />
          </FilterBar>
        </Card>

        {rows.length ? (
          <>
            <PlanTable rows={rows} accounts={accounts} on={on} onToggle={(id) => setOn((m) => Object.assign({}, m, { [id]: !m[id] }))} onOpenAccount={onOpenAccount} />
            <StickyFooter>
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>合计</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums' }}>
                花费 {yuan(rows.reduce((n, p) => n + p.spend, 0))} · 转化 {num(rows.reduce((n, p) => n + p.conv, 0))}
              </span>
            </StickyFooter>
          </>
        ) : <Card><EmptyState compact icon="search-x" title="没有符合条件的计划" description="换个关键词，或清除上方的筛选。" /></Card>}
        </div>
      </div>
    </>
  );
}

const PLATFORMS = [
  { id: 'qianchuan', label: '巨量千川', icon: 'flame' },
  { id: 'tencent', label: '腾讯营销', icon: 'circle-dot' },
];

function PlatformTabs({ value, onChange, all }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-7)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)' }}>
      {PLATFORMS.map((p) => {
        const on = p.id === value;
        return (
          <button key={p.id} type="button" onClick={() => onChange(p.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 0 10px', marginBottom: -1,
              border: 0, borderBottom: '2px solid ' + (on ? 'var(--neutral-900)' : 'transparent'), background: 'transparent',
              fontFamily: 'inherit', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)',
              color: on ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition-control)',
            }}>
            <window.PlatformMark platform={p.id} size={15} fallback={p.icon} />
            {p.label}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{all.filter((a) => a.platform === p.id).length}</span>
          </button>
        );
      })}
    </div>
  );
}

/* 账户切换常驻左栏：带各自的花费与卡点数，不用逐个点进去才知道哪个账户在烧钱 */
function AccountRail({ accounts, value, onChange, plans }) {
  const total = plans.reduce((n, p) => n + p.spend, 0);
  const items = [{ id: 'all', label: '全部账户', spend: total, flags: plans.filter((p) => FLAGS.some((f) => f.test(p))).length }]
    .concat(accounts.map((a) => {
      const mine = plans.filter((p) => p.acct === a.id);
      return { id: a.id, label: a.tag || a.name, platform: a.platform, spend: mine.reduce((n, p) => n + p.spend, 0), flags: mine.filter((p) => FLAGS.some((f) => f.test(p))).length, count: mine.length };
    }));
  return (
    <div style={{ width: 216, flex: 'none', position: 'sticky', top: 0 }}>
      <Card padded={false}>
        {items.map((it, i) => {
          const on = it.id === value;
          return (
            <button key={it.id} type="button" onClick={() => onChange(it.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)', width: '100%', textAlign: 'left', font: 'inherit',
                padding: 'var(--space-5)', borderWidth: 0, borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
                background: on ? 'var(--surface-selected)' : 'transparent', cursor: 'pointer',
              }}>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 'var(--fs-13)', fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
                <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{yuan(it.spend)}{it.count != null ? ' · ' + it.count + ' 条' : ''}</span>
              </span>
              {it.flags ? <Badge tone="danger">{it.flags}</Badge> : null}
            </button>
          );
        })}
      </Card>
    </div>
  );
}

function PlanTable({ rows, accounts, on, onToggle, onOpenAccount }) {
  const th = { padding: '10px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)' };
  const td = { padding: 'var(--space-5) var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' };
  const numTd = Object.assign({}, td, { textAlign: 'right', fontVariantNumeric: 'tabular-nums' });
  const nameOf = (id) => { const a = accounts.find((x) => x.id === id); return a ? a.tag || a.name : id; };
  return (
    <TableFrame>{(fz) => (
      <table style={{ width: '100%', minWidth: 1180, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
        <thead>
          <tr>
            <th style={Object.assign({}, th, fz.head(0), { width: 56 })} />
            <th style={Object.assign({}, th, fz.head(56), fz.headEdge, { width: 220, minWidth: 220 })}>计划名称</th>
            <th style={Object.assign({}, th, { width: 130 })}>账户</th>
            <th style={Object.assign({}, th, { width: 116 })}>创建来源</th>
            <th style={Object.assign({}, th, { width: 130 })}>预算进度</th>
            <th style={Object.assign({}, th, { textAlign: 'right' })}>花费</th>
            <th style={Object.assign({}, th, { textAlign: 'right' })}>曝光</th>
            <th style={Object.assign({}, th, { textAlign: 'right' })}>点击</th>
            <th style={Object.assign({}, th, { textAlign: 'right' })}>点击率</th>
            <th style={Object.assign({}, th, { textAlign: 'right' })}>转化</th>
            <th style={Object.assign({}, th, { textAlign: 'right' })}>转化成本</th>
            <th style={Object.assign({}, th, fz.headEnd, { width: 96 })}>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const live = on[p.id] != null ? on[p.id] : p.state === 'live';
            const bg = live ? 'var(--surface-card)' : 'var(--neutral-25)';
            const hit = FLAGS.filter((f) => f.test(p));
            const over = p.cpa != null && p.cpa > p.target;
            const pct = p.budget ? Math.min(100, Math.round((p.spend / p.budget) * 100)) : 0;
            return (
              <tr key={p.id} {...rowHoverProps(bg)} style={{ background: bg }}>
                <td style={Object.assign({}, td, fz.cell(0))}><Switch checked={live} onChange={() => onToggle(p.id)} aria-label={live ? '暂停' : '启用'} /></td>
                <td style={Object.assign({}, td, fz.cell(56), fz.cellEdge, { maxWidth: 220 })}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
                    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                    {hit.map((f) => <Icon key={f.id} name={f.icon} size={12} style={{ flex: 'none', color: 'var(--status-' + f.tone + '-fg)' }} />)}
                  </div>
                </td>
                <td style={td}><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>{nameOf(p.acct)}</span></td>
                <td style={td}><span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{p.src}</span></td>
                <td style={td}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ position: 'relative', display: 'block', width: 56, height: 3, borderRadius: 999, background: 'var(--neutral-200)', overflow: 'hidden' }}>
                      <span style={{ position: 'absolute', inset: '0 auto 0 0', width: pct + '%', background: pct >= 90 ? 'var(--status-warning-fg)' : 'var(--neutral-900)' }} />
                    </span>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
                  </span>
                </td>
                <td style={numTd}>{yuan(p.spend)}</td>
                <td style={numTd}>{num(p.imp)}</td>
                <td style={numTd}>{num(p.clicks)}</td>
                <td style={numTd}>{p.imp ? ((p.clicks / p.imp) * 100).toFixed(2) + '%' : '—'}</td>
                <td style={numTd}>{p.conv ? num(p.conv) : '—'}</td>
                <td style={Object.assign({}, numTd, { color: p.cpa == null ? 'var(--text-tertiary)' : over ? 'var(--status-danger-fg)' : 'var(--status-success-fg)' })}>
                  {p.cpa == null ? '—' : yuan(p.cpa)}
                </td>
                <td style={Object.assign({}, td, fz.cellEnd)}>
                  <span style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                    <IconButton icon="arrow-right" label={'进入「' + nameOf(p.acct) + '」'} size="sm" variant="secondary" onClick={() => onOpenAccount && onOpenAccount(accounts.find((a) => a.id === p.acct))} />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}</TableFrame>
  );
}

Object.assign(window, { PlansView });
})();
