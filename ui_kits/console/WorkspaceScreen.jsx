(() => {
const { Icon, IconButton, Avatar, Button, Badge, Card, Divider, StatusDot, StatDelta, Sparkline, MetricCard, DataTable, AgentTimeline, EmptyState, Input, SegmentedControl, DropdownMenu, SidebarAccount, Tag } = window.HUITOUAIDesignSystem_52606d;

const NAV = [
  { label: '', items: [
    { id: 'home', label: '首页', icon: 'house' },
    { id: 'todos', label: '待办', icon: 'list-checks' },
    { id: 'accounts', label: '广告账户', icon: 'wallet' },
    { id: 'plans', label: '广告计划', icon: 'megaphone' },
    { id: 'dashboard', label: '数据看板', icon: 'activity' },
  ] },
  { label: '组织', items: [
    { id: 'team', label: '团队管理', icon: 'users' },
    { id: 'library', label: '经验库', icon: 'library' },
    { id: 'settings', label: '系统设置', icon: 'settings' },
  ] },
  { label: '个人', items: [
    { id: 'profile', label: '用户设置', icon: 'user' },
  ] },
];

const PLATFORMS = [
  { id: 'qianchuan', label: '巨量千川', icon: 'flame' },
  { id: 'tencent', label: '腾讯营销', icon: 'circle-dot' },
];

const ACCOUNTS = [
  { id: 'a1', platform: 'qianchuan', tag: '主力店 · 凤爪', pinned: true, name: '王小卤虎皮凤爪旗舰店', account: '00000000', ai: { kind: 'alert', count: 1 }, balance: '¥124,560.00', budget: '¥5,812.00', spend: '¥5,812.00', health: { level: '良好', score: 85 }, token: 'valid' },
  { id: 'a2', platform: 'qianchuan', tag: '官旗大盘', pinned: true, name: '王小卤食品官方旗舰店', account: '00000001', ai: { kind: 'approval', count: 2 }, balance: '¥124,560.00', budget: '¥5,812.00', spend: '¥5,812.00', health: { checking: true, progress: 64, eta: '4min' }, token: 'expired' },
  { id: 'a3', platform: 'qianchuan', tag: '达人分销', pinned: true, name: '王小卤虎皮凤爪 · 达人分销', account: '00000002', ai: { kind: 'normal' }, balance: '¥124,560.00', budget: '¥5,812.00', spend: '¥5,812.00', health: { level: '优秀', score: 92 }, token: 'valid' },
  { id: 'a4', platform: 'qianchuan', tag: '新品测试', name: '新品试销 — 藤椒味', account: '00000003', ai: { kind: 'normal' }, balance: '¥124,560.00', budget: '¥5,812.00', spend: '¥5,812.00', health: { level: '优秀', score: 92 }, token: 'valid' },
  { id: 'a5', platform: 'qianchuan', tag: '会员召回', name: '会员召回 — 秋季', account: '00000004', ai: { kind: 'normal' }, balance: '¥124,560.00', budget: '¥5,812.00', spend: '¥5,812.00', health: { level: '合格', score: 62 }, token: 'valid' },
  { id: 'b1', platform: 'tencent', tag: '朋友圈主力', pinned: true, name: '虎皮凤爪 · 朋友圈', account: '31000000', ai: { kind: 'alert', count: 2 }, balance: '¥98,300.00', budget: '¥3,200.00', spend: '¥2,914.00', health: { level: '良好', score: 81 }, token: 'valid' },
  { id: 'b2', platform: 'tencent', tag: '小程序召回', name: '会员召回 — 小程序', account: '31000001', ai: { kind: 'approval', count: 1 }, balance: '¥98,300.00', budget: '¥3,200.00', spend: '¥1,470.00', health: { level: '合格', score: 62 }, token: 'valid' },
  { id: 'b3', platform: 'tencent', tag: '直播引流', name: '视频号直播引流', account: '31000002', ai: { kind: 'normal' }, balance: '¥98,300.00', budget: '¥3,200.00', spend: '¥3,120.00', health: { level: '优秀', score: 94 }, token: 'valid' },
  { id: 'b4', platform: 'tencent', tag: '品专 · 待续费', name: '搜一搜品专', account: '31000003', ai: { kind: 'normal' }, balance: '¥0.00', budget: '¥0.00', spend: '¥0.00', health: { level: '合格', score: 58 }, token: 'expired' },
];

/* 账号标签：用户给这个账号取的、自己看得懂的名字，一个账号只有一个。
   平台不提供这个字段，它只存在本地，点一下就地改。 */
function TagsCell({ value, onChange }) {
  const [editing, setEditing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const open = () => { setDraft(value || ''); setEditing(true); };
  /* 退出编辑时把悬停态一并清掉 —— 输入框顶掉按钮时不会触发 mouseleave，笔会一直留着 */
  const close = () => { setEditing(false); setHover(false); };
  const commit = () => { onChange(draft.trim()); close(); };
  if (editing) {
    return (
      <Input autoFocus value={draft} size="sm" placeholder="给这个账号起个名字"
        onChange={(e) => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') close(); }}
        style={{ width: 168 }} />
    );
  }
  /* 笔只在悬停时出现，空闲行保持干净 */
  return (
    <button type="button" onClick={open} title={value ? value + ' · 点击编辑' : '点击编辑标签'}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'nowrap', minWidth: 168, minHeight: 24,
        padding: '2px 4px', margin: '-2px -4px', background: 'none', border: 0, borderRadius: 'var(--radius-sm)',
        font: 'inherit', textAlign: 'left', cursor: 'text',
      }}>
      {value
        ? <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Tag>{value}</Tag></span>
        : <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>添加标签</span>}
      <Icon name="pencil" size={12} style={{ color: 'var(--text-tertiary)', flex: 'none', opacity: hover ? 1 : 0, transition: 'var(--transition-control)' }} />
    </button>
  );
}

const HEALTH_TONE = { 优秀: 'success', 良好: 'warning', 合格: 'neutral' };

function AIDecisionCell({ ai }) {
  if (ai.kind === 'normal') {
    return <span style={{ color: 'var(--text-secondary)', borderBottom: '1px dashed var(--border-strong)', paddingBottom: 1, cursor: 'default' }}>正常</span>;
  }
  const tone = ai.kind === 'alert' ? 'warning' : 'danger';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, color: `var(--status-${tone}-fg)`, fontWeight: 'var(--fw-medium)', borderBottom: `1px dashed var(--status-${tone}-fg)`, paddingBottom: 1, cursor: 'pointer' }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{ai.count}</span>
      {ai.kind === 'alert' ? '告警' : '需审批'}
    </span>
  );
}

function HealthCell({ health }) {
  if (health.checking) {
    return (
      <div style={{ minWidth: 130 }}>
        <div style={{ height: 5, background: 'var(--neutral-100)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${health.progress}%`, height: '100%', background: 'var(--neutral-900)', borderRadius: 999 }} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 4, fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
          <span>体检中…</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{health.progress}% · {health.eta}</span>
        </div>
      </div>
    );
  }
  const tone = HEALTH_TONE[health.level] || 'neutral';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <Badge tone={tone}>{health.level}</Badge>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-12)', color: tone === 'neutral' ? 'var(--text-tertiary)' : `var(--status-${tone}-fg)` }}>{health.score}/100</span>
    </span>
  );
}

function WorkspaceSidebar({ onAccountMenu, view, onView }) {
  const teamStore = window.useTeam();
  return (
    <aside style={{ width: 228, flex: 'none', display: 'flex', flexDirection: 'column', background: 'var(--surface-page)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6) var(--space-4)' }}>
        {NAV.map((s, si) => (
          <div key={si} style={{ marginBottom: 'var(--space-7)' }}>
            {s.label ? <div style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)', padding: '0 var(--space-5) var(--space-4)' }}>{s.label}</div> : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {s.items.map((it) => {
                const on = it.id === view;
                return (
                  <button key={it.id} type="button" aria-current={on ? 'page' : undefined} onClick={() => onView(it.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-5)', height: 36, padding: '0 var(--space-5)',
                      border: 0, borderRadius: 'var(--radius-md)', width: '100%', textAlign: 'left',
                      background: on ? 'var(--neutral-0)' : 'transparent',
                      boxShadow: on ? 'var(--inset-hairline)' : 'none',
                      color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)',
                      fontFamily: 'inherit', fontSize: 'var(--fs-14)', cursor: 'pointer', transition: 'var(--transition-control)',
                    }}>
                    <Icon name={it.icon} size={16} />
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {/* 计数跟着当前团队走，写死的数字会和列表对不上 */}
                    {it.id === 'accounts' ? <span style={{ fontSize: 'var(--fs-11)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{teamStore.team.accounts.length}</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <SidebarAccount name="天了噜鸭梨" phone="198****7311" bordered={false}
        teams={teamStore.teams} teamId={teamStore.team.id} onTeamChange={teamStore.setTeam} onCreateTeam={teamStore.createTeam}
        onSelect={onAccountMenu} />
    </aside>
  );
}

/* 工作台首页：跨账户数据汇总 + 需要关注的账户提醒。
   这里只做汇总与导航 —— 执行决策必须进到对应账户，避免脱离上下文操作。 */
function WorkspaceHome({ onOpenAccount }) {
  return (
    <>
      <PageHeader title="今天" description="2 个平台 · 9 个广告账户 · 数据截至 08-13 06:00"
        actions={<Button variant="secondary" iconLeft="download">导出周报</Button>} />

      {/* 跨账户汇总 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
        <MetricCard label="账户总余额" value="¥67,723.90" />
        <MetricCard label="账户日预算" value="¥10,400.00" />
        <MetricCard label="今日花费" value="¥397.94" delta={-60} goodWhen="up" basis="较昨日" />
        <MetricCard label="转化数" value="1" delta={-80} goodWhen="up" basis="较昨日" />
        <MetricCard label="平均转化成本（CPA）" value="¥397.94" delta={99} goodWhen="down" basis="较昨日" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-5)', alignItems: 'start' }}>
        <AttentionList onOpenAccount={onOpenAccount} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', minWidth: 0 }}>
          <PlatformSummary />
          <Card title={<window.CardTitle info="今天跨账户的全部动作">智能体动态</window.CardTitle>}>
            <AgentTimeline items={window.HUITOU_DATA.activity} />
          </Card>
        </div>
      </div>
    </>
  );
}

/* 需要关注：只提示与导航，不提供执行入口 */
const ATTENTION = [
  { id: 'a1', account: '00000000', name: '王小卤虎皮凤爪旗舰店', platform: '巨量千川', kind: 'decision', text: '2 条待执行决策，最早一条 19:18 后失效', impact: '¥980 / 周', tone: 'warning' },
  { id: 'b1', account: '31000000', name: '虎皮凤爪 · 朋友圈', platform: '腾讯营销', kind: 'decision', text: '2 条告警：人群重叠，频次 4.8 且点击率下滑 31%', impact: '¥412 / 周', tone: 'danger' },
  { id: 'a2', account: '00000001', name: '王小卤食品官方旗舰店', platform: '巨量千川', kind: 'token', text: '授权 3 天后过期，过期后自动变更暂停', impact: '—', tone: 'danger' },
  { id: 'a4', account: '00000003', name: '新品试销 — 藤椒味', platform: '巨量千川', kind: 'health', text: '健康度 62，素材疲劳导致 CPM 上涨 22%', impact: '¥210 / 周', tone: 'warning' },
  { id: 'b4', account: '31000003', name: '搜一搜品专', platform: '腾讯营销', kind: 'balance', text: '账户余额为 0，投放已停止', impact: '—', tone: 'danger' },
];

const KIND_ICON = { decision: 'sparkles', token: 'key-round', health: 'stethoscope', balance: 'wallet' };

function AttentionList({ onOpenAccount }) {
  return (
    <Card title={<window.CardTitle info="按影响排序。处理需进入对应账户">需要关注</window.CardTitle>} padded={false}
      footer={<span>共 5 个账户需要关注 · 其中 3 项可由 AI 自动修复</span>}>
      {ATTENTION.map((d, i) => (
        <AttentionRow key={d.id} item={d} last={i === ATTENTION.length - 1} onOpen={() => onOpenAccount && onOpenAccount(d)} />
      ))}
    </Card>
  );
}

function AttentionRow({ item, last, onOpen }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onOpen} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-6) var(--gutter-card)', cursor: 'pointer',
        background: hover ? 'var(--surface-hover)' : 'transparent',
        borderBottomWidth: last ? 0 : 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)',
        transition: 'var(--transition-control)',
      }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, flex: 'none',
        borderRadius: 'var(--radius-sm)', background: 'var(--status-' + item.tone + '-bg)',
        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--status-' + item.tone + '-border)',
        color: 'var(--status-' + item.tone + '-fg)',
      }}>
        <Icon name={KIND_ICON[item.kind]} size={13} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
          <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
          <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', flex: 'none' }}>{item.platform}</span>
        </div>
        <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 'var(--lh-normal)' }}>{item.text}</div>
      </div>
      <div style={{ textAlign: 'right', flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        {item.impact !== '—' ? (
          <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', color: 'var(--viz-positive)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{item.impact}</span>
        ) : null}
        <Icon name="arrow-right" size={14} style={{ color: hover ? 'var(--text-primary)' : 'var(--text-tertiary)' }} />
      </div>
    </div>
  );
}

/* 按平台汇总：一眼看清两个平台各自的盘子与待办 */
const PLATFORM_ROLLUP = [
  { id: 'qianchuan', label: '巨量千川', accounts: 5, spend: '¥42,914', roi: '2.94', pending: 6 },
  { id: 'tencent', label: '腾讯营销', accounts: 4, spend: '¥11,600', roi: '2.41', pending: 3 },
];

function PlatformSummary() {
  return (
    <Card title="按平台汇总" padded={false}>
      {PLATFORM_ROLLUP.map((p, i) => (
        <div key={p.id} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-6)', padding: 'var(--space-6) var(--gutter-card)',
          borderBottomWidth: i === PLATFORM_ROLLUP.length - 1 ? 0 : 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)',
          flexWrap: 'wrap',
        }}>
          <span style={{ flex: '1 1 120px', minWidth: 0, fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap' }}>{p.label}</span>
          <RollupStat label="账户" value={p.accounts} />
          <RollupStat label="消耗 · 7 天" value={p.spend} />
          <RollupStat label="ROI" value={p.roi} />
          <RollupStat label="待执行" value={p.pending} tone={p.pending ? 'warning' : null} />
        </div>
      ))}
    </Card>
  );
}

/* 图钉：置顶时实心常驻，未置顶时只在悬停行内浮现 —— 一列灰图钉会让人以为每行都被标记过 */
function PinCell({ on, onToggle }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" title={on ? '取消置顶' : '置顶'} aria-pressed={on}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{ flex: 'none', display: 'grid', placeItems: 'center', width: 22, height: 22, marginTop: 1, padding: 0, borderWidth: 1, borderStyle: 'solid', borderRadius: 'var(--radius-sm)', borderColor: on ? 'var(--border-default)' : 'transparent', background: on ? 'var(--surface-selected)' : hover ? 'var(--surface-hover)' : 'transparent', color: on ? 'var(--text-primary)' : 'var(--text-tertiary)', opacity: on || hover ? 1 : 0, cursor: 'pointer', transition: 'var(--transition-control)' }}>
      <Icon name={on && hover ? 'pin-off' : 'pin'} size={13} />
    </button>
  );
}

function RollupStat({ label, value, tone }) {
  return (
    <span style={{ textAlign: 'right', flex: 'none', minWidth: 62 }}>
      <span style={{ display: 'block', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{
        display: 'block', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums',
        color: tone ? 'var(--status-' + tone + '-fg)' : 'var(--text-primary)', marginTop: 2, whiteSpace: 'nowrap',
      }}>{value}</span>
    </span>
  );
}

/* 平台标签：切换后只显示该平台下的广告账户。 */
function PlatformTabs({ value, onChange, counts }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-7)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)' }}>
      {PLATFORMS.map((p) => {
        const on = p.id === value;
        return (
          <button key={p.id} type="button" onClick={() => onChange(p.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 0 10px', marginBottom: -1,
              border: 0, borderBottom: `2px solid ${on ? 'var(--neutral-900)' : 'transparent'}`, background: 'transparent',
              fontFamily: 'inherit', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)',
              color: on ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition-control)',
            }}>
            <window.PlatformMark platform={p.id} size={15} fallback={p.icon} />
            {p.label}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{counts[p.id]}</span>
          </button>
        );
      })}
    </div>
  );
}

function AccountsView({ onOpenAccount }) {
  const { team } = window.useTeam();
  const [connecting, setConnecting] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [platform, setPlatform] = React.useState('qianchuan');
  const [selected, setSelected] = React.useState([]);
  const [tags, setTags] = React.useState(() => ACCOUNTS.reduce((m, a) => Object.assign(m, { [a.id]: a.tag || '' }), {}));
  /* 置顶是本地偏好：置顶的排在最前，图标平时不占视觉重量，悬停才露出可点的空图钉 */
  const [pins, setPins] = React.useState(() => ACCOUNTS.filter((a) => a.pinned).map((a) => a.id));
  const togglePin = (id) => setPins((v) => (v.includes(id) ? v.filter((x) => x !== id) : [id].concat(v)));
  const toggle = (id) => setSelected((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
  const counts = PLATFORMS.reduce((m, p) => ({ ...m, [p.id]: ACCOUNTS.filter((a) => team.accounts.includes(a.id) && a.platform === p.id).length }), {});
  const rows = ACCOUNTS.filter((a) => team.accounts.includes(a.id)).filter((a) => a.platform === platform && a.name.includes(q))
    .map((a) => Object.assign({}, a, { pinned: pins.includes(a.id) }))
    .sort((x, y) => (y.pinned ? 1 : 0) - (x.pinned ? 1 : 0));
  const pinnedCount = rows.filter((r) => r.pinned).length;
  const label = PLATFORMS.find((p) => p.id === platform).label;
  if (connecting) {
    return (
      <>
        <PageHeader title="接入账户" description="选择平台后跳转到该平台完成授权。" onBack={() => setConnecting(false)} />
        <ConnectAccountFlow onCancel={() => setConnecting(false)} onDone={() => setConnecting(false)} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="广告账户" description={'当前团队「' + team.name + '」名下的账户。点击任意一行进入该账户的对话工作台。'}
        actions={<><Button variant="secondary" iconLeft="download">导出</Button><Button variant="primary" iconLeft="plus" onClick={() => setConnecting(true)}>接入账户</Button></>} />
      <PlatformTabs value={platform} onChange={setPlatform} counts={counts} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <Input placeholder={`在 ${label} 中搜索账户`} iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 240 }} />
        <div style={{ flex: 1 }} />
        {selected.length ? <><span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>已选 {selected.length} 项</span><Button size="sm" variant="secondary" iconLeft="stethoscope">批量体检</Button></> : null}
        <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>{rows.length} 个账户{pinnedCount ? ' · ' + pinnedCount + ' 个已置顶' : ''}</span>
      </div>
      <Card padded={false}>
        {rows.length === 0 ? <EmptyState compact icon="search-x" title={`${label} 下没有符合条件的账户`} description="换个关键词，或切换平台。" /> : null}
        {rows.length ? <DataTable
          rows={rows} selectable selected={selected} onToggleRow={toggle}
          columns={[
            { key: 'name', header: '账户', render: (r, i) => (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)' }}>
                <PinCell on={r.pinned} onToggle={() => togglePin(r.id)} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 'var(--fw-medium)' }}>{r.name}</div>
                  <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>ID: {r.account}</div>
                </div>
              </div>
            ) },
            { key: 'tags', header: '账号标签', render: (r) => (
              <TagsCell value={tags[r.id] || ''} onChange={(v) => setTags((m) => Object.assign({}, m, { [r.id]: v }))} />
            ) },
            { key: 'ai', header: 'AI决策', render: (r) => <AIDecisionCell ai={r.ai} /> },
            { key: 'balance', header: '账户余额', align: 'right', mono: true },
            { key: 'budget', header: '日预算', align: 'right', mono: true },
            { key: 'spend', header: '消耗', align: 'right', mono: true },
            { key: 'health', header: '健康度', render: (r) => <HealthCell health={r.health} /> },
            { key: 'act', header: '操作', render: (r) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                {r.token === 'valid'
                  ? <Button size="sm">令牌有效</Button>
                  : <Button size="sm" variant="danger">激活令牌</Button>}
                <DropdownMenu align="right" trigger={<IconButton icon="ellipsis" label="更多操作" size="sm" />} items={[
                  { id: 'pin', label: r.pinned ? '取消置顶' : '置顶', icon: r.pinned ? 'pin-off' : 'pin', onClick: () => togglePin(r.id) },
                  { id: 'check', label: '立即体检', icon: 'stethoscope' },
                  { divider: true },
                  { id: 'remove', label: '解除接入', icon: 'unplug', tone: 'danger' },
                ]} />
                <IconButton icon="arrow-right" label={`进入「${r.name}」的广告投放`} variant="secondary" size="sm" onClick={() => onOpenAccount(r)} />
              </div>
            ) },
          ]}
        /> : null}
      </Card>
    </>
  );
}

function WorkspaceScreen({ onOpenAccount, view: viewProp, onView , lit }) {
  const [viewState, setViewState] = React.useState('home');
  const view = viewProp || viewState;
  const setView = (v) => { setViewState(v); onView && onView(v); };
  const body = view === 'accounts'
    ? <AccountsView onOpenAccount={onOpenAccount} />
    : view === 'home'
      ? <WorkspaceHome onOpenAccount={onOpenAccount} />
      : view === 'profile'
      ? <window.UserSettings />
      : view === 'todos'
      ? <window.TodosView />
      : view === 'dashboard'
      ? <window.DashboardView />
      : view === 'plans'
      ? <window.PlansView onOpenAccount={onOpenAccount} />
      : view === 'library'
      ? <window.LibraryView />
      : view === 'settings'
      ? <window.SystemSettings />
      : view === 'team'
      ? <TeamView />
      : <EmptyState icon="hammer" title="该模块尚未设计" description="UI Kit 中留白，等待真实产品界面。" />;
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', background: 'var(--surface-page)' }}>
      <WorkspaceSidebar onAccountMenu={(id) => { if (id === 'logout') { window.HUITOU_LOGOUT && window.HUITOU_LOGOUT(); return; }
                const map = { profile: 'profile', team: 'team', billing: 'billing', prefs: 'settings', help: 'help' }; if (map[id]) setView(map[id]); }} view={view} onView={setView} />
      <div style={{
        flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--neutral-0)',
        borderTop: '1px solid var(--border-subtle)', borderLeft: '1px solid var(--border-subtle)',
        borderTopLeftRadius: 'var(--radius-2xl)', overflow: 'hidden',
      }}>
        <div className={'huitou-scroll' + (lit ? ' huitou-flash' : '')} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--space-9) var(--space-9) var(--space-11)' }} data-flash={view}>{body}</div>
      </div>
    </div>
  );
}

Object.assign(window, { HUITOU_ACCOUNTS: ACCOUNTS, WorkspaceScreen });
})();
