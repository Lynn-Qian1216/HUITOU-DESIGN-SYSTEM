(() => {
const { Icon, IconButton, Button, Badge, Card, StatusDot, Input, FilterSelect, Switch, Tabs, EmptyState, Popover, DropdownMenu, Tag } = window.HUITOUAIDesignSystem_52606d;
const { TableFrame, FilterBar, rowHoverProps, AskButton } = window;

/* AI 团队：这个账户里有哪些 AI 成员（成员）、它们按什么节奏自动跑（定时任务）。
   成员按分工分两组：协调成员对接你并调度别人，专业成员各管一件具体事。
   成员用卡片而不是表格 —— 挑成员看的是「它能干什么」，那是一段话，塞进表格列会被截断。 */

const GROUPS = [
  { id: 'coord', name: '协调成员', tag: '协调成员' },
  { id: 'pro', name: '专业成员', tag: '专业成员' },
];

const MEMBERS = [
  { id: 'mb1', group: 'coord', name: '总控', desc: '协调各位 AI 成员分工处理复杂问题，并把结果汇总成一份清晰结论。', jobs: 0 },
  { id: 'mb2', group: 'coord', name: '广点通 PM', desc: '负责与你沟通需求、确认重要信息、安排合适成员处理并汇报结果。', jobs: 0 },
  { id: 'mb3', group: 'pro', name: '搭建管家', desc: '根据已确认的方案创建或调整广告计划、创意、定向人群和素材，实际变更前需要人工审批。', jobs: 0 },
  { id: 'mb4', group: 'pro', name: '巡检员', desc: '定期检查账户的消耗、转化和异常情况，并生成日报、周报或月报。', jobs: 3 },
  { id: 'mb5', group: 'pro', name: '优化专家', desc: '查看账户和广告计划的投放表现，找出问题并给出需要人工确认的优化建议。', jobs: 1 },
  { id: 'mb6', group: 'pro', name: '版位顾问', desc: '根据产品和投放目标推荐版位组合，也可以核对你明确指定的版位是否可用。', jobs: 0 },
  { id: 'mb7', group: 'pro', name: '矩阵规划师', desc: '根据营销目标和投放要求，整理分阶段的账户投放方案与广告组合。', jobs: 0 },
  { id: 'mb8', group: 'pro', name: '报表管家', desc: '合并客户文件与平台数据，补齐缺失日期并生成可下载的完整结果报表。', jobs: 0 },
  { id: 'mb9', group: 'pro', name: '规则设计师', desc: '分析历史优化效果，提出决策规则的改进建议，经人工审核后再生效。', jobs: 0 },
  { id: 'mb10', group: 'pro', name: '定时管家', desc: '把「什么时候对哪些广告做什么」登记成一次性或周期预约，并按确认的时间执行。', jobs: 2 },
  { id: 'mb11', group: 'pro', name: '策略管家', desc: '把你的要求整理成异常提醒规则，并帮助查看、启用、停用或删除这些规则。', jobs: 0 },
  { id: 'mb12', group: 'pro', name: '策略自审官', desc: '定期回看已生效的策略是否仍然合适，发现偏差时提出撤销或调整建议。', jobs: 0 },
  { id: 'mb13', group: 'pro', name: '定向顾问', desc: '按人群包与投放目标核对定向设置，指出过窄、重叠或已失效的定向条件。', jobs: 0 },
];

/* 产出：AI 成员跑完一件事留下的文件。列表按「谁产出的、从哪来的」组织 ——
   同一份周报可能来自定时任务，也可能来自一次对话里的临时要求，来源不同追溯路径就不同。 */
const FILE = {
  Excel:    { icon: 'file-spreadsheet', color: 'var(--green-600)' },
  CSV:      { icon: 'file-spreadsheet', color: 'var(--green-600)' },
  Markdown: { icon: 'file-text',        color: 'var(--text-secondary)' },
  PDF:      { icon: 'file',             color: 'var(--red-600)' },
};

const OUTPUTS = [
  { id: 'op1', name: '账户日报 · 08-31', type: 'PDF', owner: '巡检员', from: '定时任务 · 每日账户体检', size: '412 KB', at: '今天 06:04' },
  { id: 'op2', name: '账户日报 · 08-30', type: 'PDF', owner: '巡检员', from: '定时任务 · 每日账户体检', size: '408 KB', at: '昨天 06:03' },
  { id: 'op3', name: '周报 · 8-18 至 8-24', type: 'PDF', owner: '巡检员', from: '定时任务 · 周报汇总', size: '1.2 MB', at: '8-25 10:02' },
  { id: 'op4', name: '异常单元清单 · 8 月', type: 'Excel', owner: '巡检员', from: '定时任务 · 异常消耗巡检', size: '86 KB', at: '今天 14:01' },
  { id: 'op5', name: '八月完整结果报表', type: 'Excel', owner: '报表管家', from: '对话 · 给我八月的月报', size: '3.4 MB', at: '今天 11:20' },
  { id: 'op6', name: '朋友圈版位分日明细', type: 'CSV', owner: '报表管家', from: '对话 · 导一份分日数据', size: '640 KB', at: '8-29 17:45' },
  { id: 'op7', name: '出价优化建议 · 08-31', type: 'Markdown', owner: '优化专家', from: '定时任务 · 出价优化建议', size: '18 KB', at: '今天 12:31' },
  { id: 'op8', name: '素材疲劳诊断说明', type: 'Markdown', owner: '优化专家', from: '对话 · 为什么 CPM 涨了', size: '24 KB', at: '8-28 15:12' },
  { id: 'op9', name: '秋季新品投放方案', type: 'PDF', owner: '矩阵规划师', from: '对话 · 排一版新品节奏', size: '2.1 MB', at: '8-27 09:40' },
  { id: 'op10', name: '大促预约变更清单', type: 'Excel', owner: '定时管家', from: '定时任务 · 大促预约起量', size: '52 KB', at: '8-30 20:15' },
  { id: 'op11', name: '决策规则改进建议', type: 'Markdown', owner: '规则设计师', from: '对话 · 复盘上月的自动决策', size: '31 KB', at: '8-26 14:08' },
  { id: 'op12', name: '策略回看 · 8 月', type: 'Markdown', owner: '策略自审官', from: '定时任务 · 月度策略回看', size: '27 KB', at: '8-31 23:10' },
  { id: 'op13', name: '八月经营总结', type: 'PDF', owner: '总控', from: '对话 · 汇总一下这个月', size: '1.8 MB', at: '今天 09:22' },
  { id: 'op14', name: '定向重叠核对表', type: 'Excel', owner: '定向顾问', from: '对话 · 人群包是不是重了', size: '74 KB', at: '8-24 16:30' },
];

const RESULT = { 成功: 'success', 有告警: 'warning', 失败: 'danger' };
const MODE = {
  自动执行: { tone: 'ai', hint: '命中条件即执行，事后在 AI决策里留痕' },
  待审批: { tone: 'warning', hint: '生成方案后等人点执行，超时自动失效' },
  只提醒: { tone: 'neutral', hint: '只出结论与提醒，不产生任何变更' },
};

const JOBS = [
  { id: 'jb1', mins: 940, name: '每日账户体检', cron: '每天 06:00', owner: '巡检员', mode: '只提醒', next: '明天 06:00', last: '今天 06:00', result: '成功', note: '出 3 条结论，1 条已转决策', on: true },
  { id: 'jb2', mins: 40, name: '异常消耗巡检', cron: '每小时（09:00–23:00）', owner: '巡检员', mode: '只提醒', next: '今天 15:00', last: '今天 14:00', result: '成功', note: '未发现超阈值单元', on: true },
  { id: 'jb3', mins: 8140, name: '周报汇总', cron: '每周一 10:00', owner: '巡检员', mode: '只提醒', next: '9-07 10:00', last: '8-25 10:00', result: '成功', note: '已发企业微信群', on: true },
  { id: 'jb4', mins: 1330, name: '出价优化建议', cron: '每天 12:30', owner: '优化专家', mode: '待审批', next: '明天 12:30', last: '今天 12:30', result: '有告警', note: '2 条建议等审批，19:18 后失效', on: true },
  { id: 'jb5', mins: 580, name: '大促预约起量', cron: '9-01 00:00 一次性', owner: '定时管家', mode: '待审批', next: '9-01 00:00', last: '未运行', result: '成功', note: '已登记 6 个单元的预约变更', on: true },
  { id: 'jb6', mins: 510, name: '月末结算对账', cron: '每月最后一天 23:00', owner: '定时管家', mode: '只提醒', next: '8-31 23:00', last: '7-31 23:00', result: '失败', note: '账单接口超时，已重试 2 次', on: false },
];

function TeamScreen() {
  const [tab, setTab] = React.useState('members');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      <Tabs value={tab} onChange={setTab} items={[
        { id: 'members', label: '成员', count: MEMBERS.length },
        { id: 'jobs', label: '定时任务', count: JOBS.length },
        { id: 'outputs', label: '产出', count: OUTPUTS.length },
      ]} />
      {tab === 'members' ? <MembersTab /> : tab === 'jobs' ? <JobsTab /> : <OutputsTab />}
    </div>
  );
}

/* ── 成员 ─────────────────────────────────────────────── */

function MembersTab() {
  const [q, setQ] = React.useState('');
  const rows = MEMBERS.filter((m) => !q || m.name.includes(q) || m.desc.includes(q));
  const groups = GROUPS.map((g) => ({ ...g, items: rows.filter((m) => m.group === g.id) })).filter((g) => g.items.length);

  return (
    <>
      <Card padded={false}>
        <FilterBar inset trailing={<Button variant="secondary" size="sm" iconLeft="plus">添加成员</Button>}>
          <Input placeholder="搜索成员或职责" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 200px', minWidth: 0, maxWidth: 280 }} />
        </FilterBar>
      </Card>

      {groups.length ? groups.map((g) => (
        <section key={g.id} style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-semibold)' }}>{g.name}</h3>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{g.items.length} 位</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)', minWidth: 0 }}>
            {g.items.map((m) => <MemberCard key={m.id} m={m} tag={g.tag} />)}
          </div>
        </section>
      )) : <Card><EmptyState compact icon="search-x" title="没有匹配的成员" description="换个关键词试试。" /></Card>}
    </>
  );
}

function MemberCard({ m, tag }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div className="huitou-ask-host" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', minWidth: 0,
        background: 'var(--surface-card)', borderRadius: 'var(--radius-card)',
        borderWidth: 1, borderStyle: 'solid', borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        boxShadow: hover ? 'var(--shadow-sm)' : 'none', transition: 'var(--transition-control)',
      }}>
      <div style={{ display: 'flex', gap: 'var(--space-5)', padding: 'var(--gutter-card) var(--gutter-card) var(--space-6)', minWidth: 0 }}>
        <span style={{
          width: 34, height: 34, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-md)',
          background: 'var(--status-ai-bg)', color: 'var(--status-ai-fg)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--status-ai-border)',
          fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)',
        }}>{m.name.slice(0, 1)}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-semibold)', minWidth: 0 }}>{m.name}</span>
            <StatusDot tone="success" label="可用" style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }} />
            <AskButton kind="agent" label={m.name} hint={tag} />
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}><Tag style={{ whiteSpace: 'nowrap', flex: 'none' }}>{tag}</Tag></div>
          <p style={{
            margin: 'var(--space-5) 0 0', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)',
            lineHeight: 'var(--lh-normal)', textWrap: 'pretty',
          }}>{m.desc}</p>
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginTop: 'auto',
        padding: 'var(--space-5) var(--gutter-card)',
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
      }}>
        <Stat label="定时任务" value={m.jobs} />
        <Stat label="产出" value={OUTPUTS.filter((o) => o.owner === m.name).length} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-4)', flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ flex: 1 }} />
      <span style={{
        fontSize: 'var(--fs-16)', fontVariantNumeric: 'tabular-nums',
        color: value ? 'var(--text-primary)' : 'var(--text-tertiary)',
      }}>{value}</span>
    </span>
  );
}

/* ── 定时任务 ─────────────────────────────────────────── */

/* 定时任务总览：先答三件事 —— 现在有几个在跑、下一个什么时候跑什么、有没有需要管的。
   放在筛选之上，因为它是不随筛选变的账户级事实。 */
function JobsOverview({ on }) {
  const live = JOBS.filter((j) => on[j.id]);
  const next = live.slice().sort((a, b) => a.mins - b.mins)[0];
  const bad = JOBS.filter((j) => j.result !== '成功' && on[j.id]);
  const paused = JOBS.length - live.length;
  const wait = (m) => m < 60 ? m + ' 分钟后' : m < 1440 ? Math.round(m / 60) + ' 小时后' : Math.round(m / 1440) + ' 天后';
  return (
    <Card padded={false}>
      <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', minWidth: 0, padding: 'var(--space-6) var(--gutter-card)' }}>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>正在工作</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--fs-24)', fontWeight: 'var(--fw-semibold)', fontVariantNumeric: 'tabular-nums' }}>{live.length}</span>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>/ {JOBS.length} 个任务</span>
          </div>
          <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
            {paused ? paused + ' 个已暂停' : '全部启用中'}
          </div>
        </div>
        <div style={{ width: 1, background: 'var(--border-subtle)', flex: 'none' }} />
        <div style={{ flex: '2 1 300px', minWidth: 0, padding: 'var(--space-6) var(--gutter-card)' }}>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>下一个执行</div>
          {next ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)', minWidth: 0, flexWrap: 'wrap' }}>
                <Icon name="clock" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
                <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{next.name}</span>
                <Badge tone={MODE[next.mode].tone} dot>{next.mode}</Badge>
              </div>
              <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
                {next.next} · {wait(next.mins)} · 由 {next.owner} 执行
              </div>
            </>
          ) : <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)' }}>没有启用中的任务</div>}
        </div>
        <div style={{ width: 1, background: 'var(--border-subtle)', flex: 'none' }} />
        <div style={{ flex: '1 1 220px', minWidth: 0, padding: 'var(--space-6) var(--gutter-card)' }}>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>需要关注</div>
          {bad.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              {bad.map((j) => (
                <StatusDot key={j.id} tone={RESULT[j.result]} label={j.name + ' · ' + j.result}
                  style={{ fontSize: 'var(--fs-13)', color: 'var(--text-primary)' }} />
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <StatusDot tone="success" label="上一轮全部成功" style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function JobsTab() {
  const [q, setQ] = React.useState('');
  const [owner, setOwner] = React.useState('全部成员');
  const [on, setOn] = React.useState(() => JOBS.reduce((m, j) => Object.assign(m, { [j.id]: j.on }), {}));
  const owners = Array.from(new Set(JOBS.map((j) => j.owner)));
  const rows = JOBS.filter((j) => (!q || j.name.includes(q) || j.cron.includes(q))
    && (owner === '全部成员' || j.owner === owner));

  const th = {
    padding: '10px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap', verticalAlign: 'middle',
    fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = {
    padding: 'var(--space-5) var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)',
  };

  return (
    <>
      <JobsOverview on={on} />
      <Card padded={false}>
        <FilterBar inset trailing={<Button size="sm" iconLeft="plus">新建任务</Button>}>
          <Input placeholder="搜索任务名称或频率" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 180px', minWidth: 0, maxWidth: 240 }} />
          <FilterSelect value={owner} onChange={setOwner} width={150}
            options={['全部成员'].concat(owners).map((o) => ({ label: o, count: o === '全部成员' ? JOBS.length : JOBS.filter((x) => x.owner === o).length }))} />
        </FilterBar>
      </Card>

      {rows.length ? (
        <TableFrame>{(fz) => (
          <table style={{ width: '100%', minWidth: 1040, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
            <thead>
              <tr>
                <th style={Object.assign({}, th, fz.head(0), { width: 60 })} />
                <th style={Object.assign({}, th, fz.head(60), fz.headEdge, { minWidth: 200, maxWidth: 240 })}>任务</th>
                <th style={Object.assign({}, th, { minWidth: 170 })}>频率</th>
                <th style={Object.assign({}, th, { minWidth: 140 })}>执行成员</th>
                <th style={Object.assign({}, th, { width: 110 })}>执行方式</th>
                <th style={Object.assign({}, th, { minWidth: 130 })}>下次运行</th>
                <th style={Object.assign({}, th, { minWidth: 210 })}>上次结果</th>
                <th style={Object.assign({}, th, fz.headEnd, { width: 56 })} />
              </tr>
            </thead>
            <tbody>
              {rows.map((j) => {
                const live = on[j.id];
                return (
                  <tr key={j.id} {...rowHoverProps(live ? 'var(--surface-card)' : 'var(--neutral-25)')}
                    style={{ background: live ? 'var(--surface-card)' : 'var(--neutral-25)' }}>
                    <td style={Object.assign({}, td, fz.cell(0))}>
                      <Switch checked={live} onChange={() => setOn((m) => Object.assign({}, m, { [j.id]: !m[j.id] }))}
                        aria-label={live ? '暂停该任务' : '启用该任务'} />
                    </td>
                    <td style={Object.assign({}, td, fz.cell(60), fz.cellEdge, { maxWidth: 240 })}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
                        <Icon name="clock" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
                        <span style={{ fontWeight: 'var(--fw-medium)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.name}</span>
                        <AskButton kind="job" label={j.name} hint={j.cron} />
                      </div>
                    </td>
                    <td style={Object.assign({}, td, { color: 'var(--text-secondary)' })}>{j.cron}</td>
                    <td style={td}><Tag>{j.owner}</Tag></td>
                    <td style={td}>
                      <Popover placement="top" width={210} content={<span>{MODE[j.mode].hint}</span>}>
                        <span style={{ cursor: 'help' }}><Badge tone={MODE[j.mode].tone} dot>{j.mode}</Badge></span>
                      </Popover>
                    </td>
                    <td style={Object.assign({}, td, { color: live ? 'var(--text-secondary)' : 'var(--text-tertiary)' })}>{live ? j.next : '已暂停'}</td>
                    <td style={td}>
                      <StatusDot tone={RESULT[j.result]} label={j.last + ' · ' + j.result}
                        style={{ fontSize: 'var(--fs-13)', color: 'var(--text-primary)' }} />
                      <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2, paddingLeft: 14 }}>{j.note}</div>
                    </td>
                    <td style={Object.assign({}, td, fz.cellEnd, { textAlign: 'right' })}>
                      <DropdownMenu align="right" trigger={<IconButton icon="ellipsis" label="任务操作" size="sm" />} items={[
                        { id: 'run', label: '立即运行一次', icon: 'play' },
                        { id: 'edit', label: '编辑频率与范围', icon: 'pencil' },
                        { id: 'log', label: '查看运行记录', icon: 'history' },
                        { divider: true },
                        { id: 'off', label: live ? '暂停任务' : '启用任务', icon: live ? 'pause' : 'play' },
                      ]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}</TableFrame>
      ) : <Card><EmptyState compact icon="search-x" title="没有匹配的任务" description="换个关键词，或把执行成员筛选放宽。" /></Card>}
    </>
  );
}

/* ── 产出 ─────────────────────────────────────────────── */

function OutputsTab() {
  const [q, setQ] = React.useState('');
  const [type, setType] = React.useState('全部格式');
  const [owner, setOwner] = React.useState('全部成员');
  const types = Array.from(new Set(OUTPUTS.map((o) => o.type)));
  const owners = Array.from(new Set(OUTPUTS.map((o) => o.owner)));
  const rows = OUTPUTS.filter((o) => (!q || o.name.includes(q) || o.from.includes(q))
    && (type === '全部格式' || o.type === type)
    && (owner === '全部成员' || o.owner === owner));

  const th = {
    padding: '10px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap', verticalAlign: 'middle',
    fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = {
    padding: 'var(--space-5) var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)',
  };

  return (
    <>
      <Card padded={false}>
        <FilterBar inset trailing={<Button variant="secondary" size="sm" iconLeft="download">批量下载</Button>}>
          <Input placeholder="搜索文件名或来源" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 180px', minWidth: 0, maxWidth: 240 }} />
          <FilterSelect value={type} onChange={setType} width={130}
            options={['全部格式'].concat(types).map((o) => ({ label: o, count: o === '全部格式' ? OUTPUTS.length : OUTPUTS.filter((x) => x.type === o).length }))} />
          <FilterSelect value={owner} onChange={setOwner} width={150}
            options={['全部成员'].concat(owners).map((o) => ({ label: o, count: o === '全部成员' ? OUTPUTS.length : OUTPUTS.filter((x) => x.owner === o).length }))} />
        </FilterBar>
      </Card>

      {rows.length ? (
        <TableFrame>{(fz) => (
          <table style={{ width: '100%', minWidth: 980, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
            <thead>
              <tr>
                <th style={Object.assign({}, th, fz.head(0), fz.headEdge, { minWidth: 240, maxWidth: 300 })}>文件</th>
                <th style={Object.assign({}, th, { width: 100 })}>格式</th>
                <th style={Object.assign({}, th, { minWidth: 130 })}>产出成员</th>
                <th style={Object.assign({}, th, { minWidth: 240 })}>来源</th>
                <th style={Object.assign({}, th, { width: 90, textAlign: 'right' })}>大小</th>
                <th style={Object.assign({}, th, { minWidth: 120 })}>产出时间</th>
                <th style={Object.assign({}, th, fz.headEnd, { width: 92 })} />
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const f = FILE[o.type];
                return (
                  <tr key={o.id} {...rowHoverProps('var(--surface-card)')} style={{ background: 'var(--surface-card)' }}>
                    <td style={Object.assign({}, td, fz.cell(0), fz.cellEdge, { maxWidth: 300 })}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
                        <Icon name={f.icon} size={14} style={{ color: f.color, flex: 'none' }} />
                        <span style={{ fontWeight: 'var(--fw-medium)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.name}</span>
                        <AskButton kind="file" label={o.name} hint={o.owner + ' · ' + o.type} />
                      </div>
                    </td>
                    <td style={td}><Badge tone="neutral">{o.type}</Badge></td>
                    <td style={td}><Tag>{o.owner}</Tag></td>
                    <td style={Object.assign({}, td, { color: 'var(--text-secondary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' })}>{o.from}</td>
                    <td style={Object.assign({}, td, { textAlign: 'right', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' })}>{o.size}</td>
                    <td style={Object.assign({}, td, { color: 'var(--text-secondary)' })}>{o.at}</td>
                    <td style={Object.assign({}, td, fz.cellEnd, { textAlign: 'right' })}>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <IconButton icon="download" label="下载" size="sm" />
                        <DropdownMenu align="right" trigger={<IconButton icon="ellipsis" label="文件操作" size="sm" />} items={[
                          { id: 'preview', label: '预览', icon: 'eye' },
                          { id: 'source', label: '查看来源', icon: 'arrow-up-right' },
                          { id: 'send', label: '发到企业微信', icon: 'send' },
                          { divider: true },
                          { id: 'del', label: '删除', icon: 'trash-2', danger: true },
                        ]} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}</TableFrame>
      ) : <Card><EmptyState compact icon="search-x" title="没有匹配的产出" description="换个关键词，或把格式与成员筛选放宽。" /></Card>}
    </>
  );
}

Object.assign(window, { TeamScreen });
})();
