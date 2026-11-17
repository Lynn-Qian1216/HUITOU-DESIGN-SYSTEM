(() => {
const { Card, Button, Badge, IconButton, Icon, Divider, StatusDot, StatDelta, Sparkline, SegmentedControl, Select, FilterSelect, DataTable, Dialog, DropdownMenu, Alert, Tabs, Popover, ProgressBar } = window.HUITOUAIDesignSystem_52606d;

/* 账户概览：账户身份与健康度 → AI决策概览 → 数据概览 → 复盘简报 → 详细数据 */

const ACCOUNT = {
  name: '王小卤虎皮凤爪旗舰店',
  id: '000000000000',
  platform: '巨量千川',
  health: { score: 85, level: '良好', checked: '今天 06:00' },
  balance: '¥124,560.00',
  spend: '¥5,812.00',
  budget: '¥8,000.00',
  pacing: 73,
};

const DECISION_SUMMARY = { pending: 2, verifying: 1, executed: 3, impact: '+¥1,610 / 周', urgent: '19:18 后失效' };

const DAYS = ['06-04', '06-05', '06-06', '06-07', '06-08', '06-09', '06-10'];

/* kind: bar 画柱，line 画折线；unit 决定坐标轴与读数的格式 */
/* 腾讯这套是曝光—点击—转化的链路，没有 GMV / ROI / 退款那几项（那是千川电商侧的口径）；
   「转化成本」在没有转化时无法计算，用「—」而不是 0 —— 0 会被读成「不花钱就转化了」。 */
const TENCENT_METRICS = [
  { id: 'spend', label: '花费（元）', value: '20.51', delta: 20410.0, goodWhen: 'none', basis: '较前一周期', unit: '¥', kind: 'bar',
    series: [0, 0.1, 0.6, 3.3, 1.7, 13.8, 1.0] },
  { id: 'imp', label: '曝光量', value: '253', delta: 246.6, goodWhen: 'up', basis: '较前一周期', unit: '', kind: 'bar',
    series: [0, 2, 9, 41, 22, 158, 21] },
  { id: 'clicks', label: '点击数', value: '7', delta: 600.0, goodWhen: 'up', basis: '较前一周期', unit: '', kind: 'bar',
    series: [0, 0, 1, 1, 0, 4, 1] },
  { id: 'ctr', label: '点击率', value: '2.77%', delta: 102.0, goodWhen: 'up', basis: '较前一周期', unit: '%', kind: 'line',
    series: [0, 0, 11.1, 2.4, 0, 2.5, 4.8] },
  { id: 'cpa', label: '转化成本', value: '—', delta: null, goodWhen: 'down', basis: '较前一周期', unit: '¥', kind: 'line',
    series: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'conv', label: '转化数', value: '0', delta: null, goodWhen: 'up', basis: '较前一周期', unit: '', kind: 'bar',
    series: [0, 0, 0, 0, 0, 0, 0] },
];

const OVERVIEW_METRICS = [
  { id: 'spend', label: '整体消耗（元）', value: '6,454.39', delta: -12.5, goodWhen: 'none', basis: '较前一周期', unit: '¥', kind: 'bar',
    series: [7380, 7120, 6890, 7040, 6620, 6510, 6454.39] },
  { id: 'roi', label: '净成交ROI', value: '3.14', delta: 12.5, goodWhen: 'up', basis: '较前一周期', unit: '', kind: 'line',
    series: [2.42, 2.55, 2.61, 2.78, 2.90, 3.02, 3.14] },
  { id: 'gmv', label: '净成交金额（元）', value: '20,266.79', delta: 12.5, goodWhen: 'up', basis: '较前一周期', unit: '¥', kind: 'bar',
    series: [17860, 18150, 17980, 19560, 19190, 19660, 20266.79] },
  { id: 'orders', label: '净成交订单数', value: '482', delta: 12.5, goodWhen: 'up', basis: '较前一周期', unit: '', kind: 'bar',
    series: [396, 412, 405, 441, 448, 462, 482] },
  { id: 'settle', label: '净成交金额结算率', value: '82.4%', delta: 12.5, goodWhen: 'up', basis: '较前一周期', unit: '%', kind: 'line',
    series: [73.1, 74.8, 76.2, 78.0, 79.6, 81.2, 82.4] },
  { id: 'refund', label: '1小时内退款率', value: '3.6%', delta: -12.5, goodWhen: 'down', basis: '较前一周期', unit: '%', kind: 'line',
    series: [5.4, 5.1, 4.8, 4.4, 4.1, 3.8, 3.6] },
];

const AXIS = ['var(--viz-1)', 'var(--viz-3)'];

const fmt = (v, unit) => {
  const n = v >= 10000 ? (v / 10000).toFixed(1) + '万'
    : v >= 1000 ? Math.round(v).toLocaleString()
    : v >= 100 ? String(Math.round(v))
    : v.toFixed(v < 10 ? 2 : 1);
  return unit === '%' ? n + '%' : (unit || '') + n;
};

/* 复盘简报分日／周／月三种周期，各自可选具体期次 */
const BRIEFS = {
  day: {
    unit: '日', schedule: '每日 08:00 生成',
    periods: ['06月10日', '06月09日', '06月08日', '06月07日'],
    data: {
      '06月10日': {
        stats: [{ k: '消耗', v: '¥5,812', d: 4.1, g: 'none' }, { k: '转化', v: '138', d: 9.2, g: 'up' }, { k: '转化成本', v: '¥42.10', d: -6.8, g: 'down' }],
        headline: '昨日消耗 ¥5,812，转化 138 次，转化成本较前日下降 6.8%。午间时段是主要增量来源。',
        points: [
          { tone: 'success', text: '「脆笋去骨鸡爪」午间 CPA ¥22.30，低于账户均值 47%' },
          { tone: 'warning', text: '「线上消费贷」曝光份额下降 12%，出价低于竞价中位' },
          { tone: 'neutral', text: '2 个新广告组仍在学习期，还需 30 次转化才可判断' },
        ],
      },
      '06月09日': {
        stats: [{ k: '消耗', v: '¥4,980', d: -3.3, g: 'none' }, { k: '转化', v: '129', d: 7.5, g: 'up' }, { k: '转化成本', v: '¥44.30', d: -1.6, g: 'down' }],
        headline: '消耗小幅回落至 ¥4,980，但转化仍增长 7.5%，说明流量效率在改善。',
        points: [
          { tone: 'success', text: '达人分销计划 ROI 首次突破 3.2' },
          { tone: 'warning', text: '周末流量成本上升，晚间 CPM 高出均值 18%' },
        ],
      },
      '06月08日': {
        stats: [{ k: '消耗', v: '¥5,150', d: 9.1, g: 'none' }, { k: '转化', v: '120', d: 7.1, g: 'up' }, { k: '转化成本', v: '¥45.00', d: 1.9, g: 'down' }],
        headline: '消耗环比上升 9.1%，转化同步增长，成本基本持平。',
        points: [{ tone: 'neutral', text: '新素材上线首日，观察期内暂不调整出价' }],
      },
      '06月07日': {
        stats: [{ k: '消耗', v: '¥4,720', d: 16.8, g: 'none' }, { k: '转化', v: '112', d: 10.9, g: 'up' }, { k: '转化成本', v: '¥47.20', d: -8.0, g: 'down' }],
        headline: 'AI 上调预算后消耗放量 16.8%，转化成本反而下降 8%。',
        points: [{ tone: 'success', text: '预算上调决策验证通过，已进入三轮监控' }],
      },
    },
  },
  week: {
    unit: '周', schedule: '每周一 08:00 生成',
    periods: ['第 24 周 06/03–06/09', '第 23 周 05/27–06/02', '第 22 周 05/20–05/26'],
    data: {
      '第 24 周 06/03–06/09': {
        stats: [{ k: '消耗', v: '¥32,890', d: 12.4, g: 'none' }, { k: '转化', v: '801', d: 18.6, g: 'up' }, { k: '转化成本', v: '¥41.06', d: -5.2, g: 'down' }],
        headline: '本周消耗 ¥32,890，转化 801 次，转化成本较上周下降 5.2%。AI 执行 14 项决策，其中 11 项达成目标。',
        points: [
          { tone: 'success', text: '午间时段策略全面铺开，贡献本周 46% 的转化' },
          { tone: 'success', text: '暂停 3 个低效广告组，节省预算 ¥2,860' },
          { tone: 'warning', text: '「线上消费贷」连续两周未达标，建议重做人群包' },
        ],
      },
      '第 23 周 05/27–06/02': {
        stats: [{ k: '消耗', v: '¥29,260', d: 5.1, g: 'none' }, { k: '转化', v: '675', d: 4.2, g: 'up' }, { k: '转化成本', v: '¥43.35', d: 0.9, g: 'down' }],
        headline: '消耗与转化同步小幅增长，成本基本持平，账户处于稳定期。',
        points: [
          { tone: 'neutral', text: '本周以素材测试为主，未做大幅预算调整' },
          { tone: 'warning', text: '两个计划触发素材疲劳预警' },
        ],
      },
      '第 22 周 05/20–05/26': {
        stats: [{ k: '消耗', v: '¥27,840', d: -2.4, g: 'none' }, { k: '转化', v: '648', d: -1.1, g: 'up' }, { k: '转化成本', v: '¥42.96', d: -1.3, g: 'down' }],
        headline: '大促预热前的平稳期，各项指标波动均在 3% 以内。',
        points: [{ tone: 'neutral', text: '为 618 预留预算，本周主动控制放量节奏' }],
      },
    },
  },
  month: {
    unit: '月', schedule: '每月 1 日 08:00 生成',
    periods: ['2026年05月', '2026年04月', '2026年03月'],
    data: {
      '2026年05月': {
        stats: [{ k: '消耗', v: '¥128,400', d: 8.7, g: 'none' }, { k: '转化', v: '3,046', d: 15.2, g: 'up' }, { k: '转化成本', v: '¥42.15', d: -5.6, g: 'down' }],
        headline: '五月消耗 ¥128,400，转化 3,046 次，转化成本较四月下降 5.6%。账户健康度由 78 提升至 85。',
        points: [
          { tone: 'success', text: 'AI 全月执行 61 项决策，达成率 82%，累计节省 ¥11,240' },
          { tone: 'success', text: '午间高效时段策略成为账户主要增长来源' },
          { tone: 'warning', text: '素材库更新速度偏慢，6 月需补充 20 条以上新素材' },
          { tone: 'neutral', text: '618 大促预算已按周拆分，6 月起进入预热放量' },
        ],
      },
      '2026年04月': {
        stats: [{ k: '消耗', v: '¥118,100', d: 3.2, g: 'none' }, { k: '转化', v: '2,644', d: 6.8, g: 'up' }, { k: '转化成本', v: '¥44.66', d: -3.4, g: 'down' }],
        headline: '四月完成账户结构梳理，低效计划占比由 31% 降至 12%。',
        points: [
          { tone: 'success', text: '合并重复人群包，解决长期存在的内部竞价问题' },
          { tone: 'warning', text: '月末余额一度不足，触发两次投放中断' },
        ],
      },
      '2026年03月': {
        stats: [{ k: '消耗', v: '¥114,440', d: null, g: 'none' }, { k: '转化', v: '2,476', d: null, g: 'up' }, { k: '转化成本', v: '¥46.22', d: null, g: 'down' }],
        headline: 'HUITOU 接管首月，以数据采集与基线建立为主，未做激进调整。',
        points: [{ tone: 'neutral', text: '完成账户体检，识别出 9 类结构性问题' }],
      },
    },
  },
};

const ROWS = [
  { id: 'p1', name: '脆笋去骨鸡爪--2026-06', status: '投放中', tone: 'success', spend: '¥2,480.00', conv: '68', cpa: '¥36.47', roi: '3.62', delta: -12.4, series: [42, 40, 39, 38, 37, 37, 36] },
  { id: 'p2', name: '虎皮凤爪--达人分销', status: '投放中', tone: 'success', spend: '¥1,610.00', conv: '41', cpa: '¥39.27', roi: '3.20', delta: -4.2, series: [43, 42, 41, 41, 40, 40, 39] },
  { id: 'p3', name: '线上消费贷', status: '已标记', tone: 'warning', spend: '¥1,109.50', conv: '13', cpa: '¥85.35', roi: '0.92', delta: 22.1, series: [64, 69, 72, 76, 80, 84, 85] },
  { id: 'p4', name: '新品试销--藤椒味', status: '学习期', tone: 'info', spend: '¥612.50', conv: '16', cpa: '¥38.28', roi: '1.61', delta: 8.4, series: [34, 35, 36, 36, 37, 38, 38] },
];

function OverviewScreen({ onNavigate, platform, account }) {
  const [range, setRange] = React.useState('近 7 天');
  const tencent = platform === '腾讯营销';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      <AccountHeader platform={platform} account={account} />
      <DecisionOverview onNavigate={onNavigate} />
      <DataOverview range={range} onRange={setRange}
        metrics={tencent ? TENCENT_METRICS : OVERVIEW_METRICS}
        initial={tencent ? ['spend', 'conv'] : ['spend', 'roi']} />
      <ReviewBrief />
      <DetailTable />
    </div>
  );
}

/* ---------- 账户身份 · 健康度 · 今日三项 ---------- */

function AccountHeader({ platform, account }) {
  /* 账户名与平台徽章跟随当前账户 —— 同一屏里指标是腾讯口径、抬头写千川，会让人不敢信数。
     account 传进来的是「平台 · 账户名」，取后半段作名字。 */
  const name = account ? String(account).split(' · ').pop() : ACCOUNT.name;
  const a = Object.assign({}, ACCOUNT, { name, platform: platform || ACCOUNT.platform });
  const box = React.useRef(null);
  const [wide, setWide] = React.useState(false);

  /* 三项数据：宽栏一行三列，窄栏改为竖排 —— 两种都排满，不留落单格 */
  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setWide(el.clientWidth >= 480);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section ref={box} style={{ background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', padding: 'var(--space-5) var(--gutter-card)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-tight)' }}>{a.name}</span>
            <Badge tone="info">{a.platform}</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 2, fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>ID: {a.id}</span>
            <span>·</span>
            <StatusDot tone="success" label="令牌有效" style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }} />
            <span>·</span>
            <span style={{ whiteSpace: 'nowrap' }}>{a.health.checked} 完成体检</span>
          </div>
        </div>
        <HealthScore health={a.health} />
      </div>
      <Divider spacing="0" />
      <div style={{ display: 'grid', gridTemplateColumns: wide ? 'repeat(3, minmax(0, 1fr))' : 'minmax(0, 1fr)' }}>
        <TodayStat label="账户余额" value={a.balance} note="可支撑约 15 天" />
        <TodayStat label="今日花费" value={a.spend} note={'已用 ' + a.pacing + '% · 日预算 ' + a.budget} bar={a.pacing} rule={wide ? 'left' : 'top'} />
        <TodayStat label="日预算" value={a.budget} note="今日 13:18 由 AI 上调" rule={wide ? 'left' : 'top'} />
      </div>
    </section>
  );
}

function HealthScore({ health }) {
  const tone = health.score >= 90 ? 'success' : health.score >= 75 ? 'warning' : 'neutral';
  const dash = 2 * Math.PI * 26;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flex: 'none' }}>
      <div style={{ position: 'relative', width: 46, height: 46, flex: 'none' }}>
        <svg width="46" height="46" viewBox="0 0 60 60" style={{ display: 'block', transform: 'rotate(-90deg)' }}>
          <circle cx="30" cy="30" r="26" fill="none" stroke="var(--neutral-100)" strokeWidth="6" />
          <circle cx="30" cy="30" r="26" fill="none" stroke={'var(--status-' + tone + '-fg)'} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={(dash * health.score) / 100 + ' ' + dash} />
        </svg>
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', letterSpacing: 'var(--ls-tight)' }}>{health.score}</span>
      </div>
      <div>
        <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>健康度</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
          <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', color: 'var(--status-' + tone + '-fg)', whiteSpace: 'nowrap' }}>{health.level}</span>
          <Popover placement="left" width={210} content={<span>由投放稳定性、成本达标率、素材健康度与账户配置四项加权得出，每日 06:00 体检一次。</span>}>
            <Icon name="info" size={12} style={{ color: 'var(--text-tertiary)' }} />
          </Popover>
        </div>
        <Button variant="link" size="sm" style={{ marginTop: 2 }}>体检报告</Button>
      </div>
    </div>
  );
}

function TodayStat({ label, value, note, bar, rule }) {
  return (
    <div style={{
      padding: 'var(--space-5) var(--gutter-card)', minWidth: 0,
      borderLeftWidth: rule === 'left' ? 1 : 0, borderLeftStyle: 'solid', borderLeftColor: 'var(--border-subtle)',
      borderTopWidth: rule === 'top' ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
    }}>
      <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{value}</div>
      {bar != null ? <div style={{ height: 3, background: 'var(--neutral-100)', borderRadius: 999, margin: 'var(--space-3) 0 2px' }}>
        <div style={{ width: bar + '%', height: '100%', background: 'var(--neutral-900)', borderRadius: 999 }} />
      </div> : null}
      {/* 面板收到最窄时也不换行：这三格并排，一格折成两行整排就参差了 */}
      <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: bar != null ? 0 : 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note}</div>
    </div>
  );
}

/* ---------- AI决策概览：用设计系统里唯一为 AI 保留的紫色做标记。
   浅紫底 + 紫描边 + sparkles 标记，一眼看出是机器给的结论；
   但仍是卡片语言（不是整块反色），所以不会压过其他区块。
   数字放在白色内嵌块上，与紫底形成层次。 ---------- */

function DecisionOverview({ onNavigate }) {
  const s = DECISION_SUMMARY;
  return (
    <section style={{
      background: 'var(--status-ai-bg)', borderRadius: 'var(--radius-card)', padding: 'var(--space-5) var(--gutter-card)',
      borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--status-ai-border)', minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flex: 'none',
          borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--status-ai-border)', color: 'var(--status-ai-fg)',
        }}>
          <Icon name="sparkles" size={15} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-semibold)', letterSpacing: 'var(--ls-normal)' }}>AI决策概览</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 2 }}>
            <StatusDot tone="ai" label="自动驾驶运行中" pulse style={{ fontSize: 'var(--fs-12)', color: 'var(--status-ai-fg)', whiteSpace: 'nowrap' }} />
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>·</span>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{s.urgent}</span>
          </div>
        </div>
        <span style={{ flex: 1 }} />
        <Button size="sm" iconRight="arrow-right" onClick={() => onNavigate && onNavigate('decisions')}
          style={{ background: 'var(--status-ai-fg)', borderColor: 'var(--status-ai-fg)', color: 'var(--neutral-0)' }}>立即处理</Button>
      </div>

      <div style={{
        display: 'flex', alignItems: 'stretch', gap: 'var(--space-4)', flexWrap: 'wrap',
        marginTop: 'var(--space-5)',
      }}>
        <DecisionStat n={s.pending} label="待执行" hint="需要你确认" accent />
        <DecisionStat n={s.verifying} label="验证中" hint="三轮采样后收口" />
        <DecisionStat n={s.executed} label="今日已执行" hint="全部在护栏内" />
        <div style={{
          flex: '1 1 140px', minWidth: 0, background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--status-ai-border)',
          padding: 'var(--space-4) var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>预计影响</div>
          <div style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', color: 'var(--viz-positive)', fontVariantNumeric: 'tabular-nums', letterSpacing: 'var(--ls-tight)', marginTop: 2, whiteSpace: 'nowrap' }}>{s.impact}</div>
        </div>
      </div>
    </section>
  );
}

/* 白色内嵌块：待执行那一项用琥珀标出需要行动，其余墨色 */
function DecisionStat({ n, label, hint, accent }) {
  return (
    <div style={{
      flex: '1 1 120px', minWidth: 0, background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)',
      borderWidth: 1, borderStyle: 'solid', borderColor: accent ? 'var(--status-warning-border)' : 'var(--status-ai-border)',
      padding: 'var(--space-5) var(--space-6)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: 'var(--fs-24)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)',
          fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          color: accent ? 'var(--status-warning-fg)' : 'var(--text-primary)',
        }}>{n}</span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>条</span>
      </div>
      {/* 说明收进问号，三格只剩数字与名目 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, minWidth: 0 }}>
        {accent ? <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--status-warning-fg)', flex: 'none' }} /> : null}
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: accent ? 'var(--fw-medium)' : 'var(--fw-regular)', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        <window.InfoHint label={hint} size={12} />
      </div>
    </div>
  );
}

/* ---------- 数据概览：选两个指标做双轴对比 ---------- */

function DataOverview({ range, onRange, metrics: pool = OVERVIEW_METRICS, initial = ['spend', 'roi'] }) {
  const box = React.useRef(null);
  const [wide, setWide] = React.useState(false);
  const [picked, setPicked] = React.useState(initial);
  React.useEffect(() => { setPicked(initial); }, [pool]);

  /* 六个指标：窄栏 2 列 × 3 行，宽栏 3 列 × 2 行 —— 两种都排满，不留落单格 */
  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setWide(el.clientWidth >= 640);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggle = (id) => setPicked((p) => {
    if (p.includes(id)) return p.length === 1 ? p : p.filter((x) => x !== id);
    return p.length < 2 ? p.concat(id) : [p[1], id];   // 已选两个时替换较早的那个
  });
  const metrics = picked.map((id) => pool.find((m) => m.id === id)).filter(Boolean);
  return (
    <Card title={<window.CardTitle info="点选两个指标做双轴对比">数据概览</window.CardTitle>}
      actions={<SegmentedControl size="sm" options={['今日', '近 7 天', '近 30 天']} value={range} onChange={onRange} />}>
      <div ref={box} style={{ minWidth: 0 }} />
      <div style={{ display: 'grid', gridTemplateColumns: wide ? 'repeat(4, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-3)' }}>
        {pool.map((m) => (
          <MetricTile key={m.id} m={m} rank={picked.indexOf(m.id)} onClick={() => toggle(m.id)} />
        ))}
      </div>
      <CompareChart metrics={metrics} />
    </Card>
  );
}

function MetricTile({ m, rank, onClick }) {
  const [hover, setHover] = React.useState(false);
  const on = rank > -1;
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', width: '100%', textAlign: 'left', minWidth: 0, font: 'inherit', cursor: 'pointer',
        padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-md)',
        background: on ? 'var(--surface-selected)' : hover ? 'var(--surface-hover)' : 'var(--surface-card)',
        borderWidth: 1, borderStyle: 'solid', borderColor: on ? 'var(--border-strong)' : 'var(--border-subtle)',
        transition: 'var(--transition-control)',
      }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 7, height: 7, borderRadius: 2, flex: 'none', background: on ? AXIS[rank] : 'var(--neutral-300)' }} />
        <span style={{ minWidth: 0, fontSize: 'var(--fs-11)', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.label}</span>
      </span>
      <span style={{ display: 'block', fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{m.value}</span>
      {/* 没有可比基数时不画涨跌 —— ↑0.0% 会被读成「持平」，而这里是「算不出来」 */}
      <span style={{ display: 'block', marginTop: 1, fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>
        {m.delta == null ? '—' : <StatDelta value={m.delta} goodWhen={m.goodWhen} basis={m.basis} />}
      </span>
    </button>
  );
}

/* 双轴对比：左轴第一个指标，右轴第二个；花费与转化画柱，成本与 ROI 画折线 */
function CompareChart({ metrics }) {
  const box = React.useRef(null);
  const [w, setW] = React.useState(620);
  const [at, setAt] = React.useState(null);

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setW(Math.max(280, el.clientWidth));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 210, padL = 48, padR = metrics.length > 1 ? 48 : 12, padT = 12, padB = 26;
  const iw = Math.max(40, w - padL - padR), ih = H - padT - padB;
  const n = DAYS.length;
  const step = iw / n;
  const bars = metrics.filter((x) => x.kind === 'bar');

  const scales = metrics.map((m) => {
    const hi = Math.max.apply(null, m.series), lo = Math.min.apply(null, m.series);
    const top = hi * 1.12;
    const bottom = m.kind === 'bar' ? 0 : Math.max(0, lo - (hi - lo) * 0.5);
    return { top: top, bottom: bottom, y: (v) => padT + ih - ((v - bottom) / (top - bottom || 1)) * ih };
  });

  return (
    <div ref={box} style={{ marginTop: 'var(--space-7)', minWidth: 0 }}>
      <div style={{ display: 'flex', gap: 'var(--space-7)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
        {metrics.map((m, i) => (
          <span key={m.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
            <span style={{ width: 9, height: m.kind === 'line' ? 2 : 9, borderRadius: m.kind === 'line' ? 0 : 2, background: AXIS[i] }} />
            {m.label}
            <span style={{ color: 'var(--text-tertiary)' }}>{i === 0 ? '左轴' : '右轴'}</span>
          </span>
        ))}
      </div>

      <svg width="100%" height={H} viewBox={'0 0 ' + w + ' ' + H} style={{ display: 'block', overflow: 'visible' }}
        onMouseLeave={() => setAt(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * w - padL;
          const i = Math.floor(x / step);
          setAt(i >= 0 && i < n ? i : null);
        }}>
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const y = padT + ih * p;
          const s0 = scales[0];
          return (
            <g key={p}>
              <line x1={padL} x2={padL + iw} y1={y} y2={y} stroke="var(--viz-grid)" strokeWidth="1" />
              {s0 ? <text x={padL - 8} y={y + 3.5} textAnchor="end" fontSize="10" fill="var(--text-tertiary)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmt(s0.bottom + (s0.top - s0.bottom) * (1 - p), metrics[0].unit)}
              </text> : null}
              {metrics[1] ? <text x={padL + iw + 8} y={y + 3.5} fontSize="10" fill="var(--text-tertiary)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmt(scales[1].bottom + (scales[1].top - scales[1].bottom) * (1 - p), metrics[1].unit)}
              </text> : null}
            </g>
          );
        })}

        {at != null ? <rect x={padL + at * step} y={padT} width={step} height={ih} fill="var(--neutral-900)" opacity="0.04" /> : null}

        {metrics.map((m, mi) => m.kind !== 'bar' ? null : (
          <g key={m.id}>
            {m.series.map((v, i) => {
              const bw = Math.min(26, step * (bars.length > 1 ? 0.32 : 0.52));
              const slot = bars.indexOf(m);
              const cx = padL + i * step + step / 2 + (bars.length > 1 ? (slot - 0.5) * (bw + 2) : 0);
              const y = scales[mi].y(v);
              return <rect key={i} x={cx - bw / 2} y={y} width={bw} height={Math.max(1, padT + ih - y)} fill={AXIS[mi]} rx="2" />;
            })}
          </g>
        ))}

        {metrics.map((m, mi) => m.kind !== 'line' ? null : (
          <g key={m.id}>
            <polyline fill="none" stroke={AXIS[mi]} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
              points={m.series.map((v, i) => (padL + i * step + step / 2) + ',' + scales[mi].y(v)).join(' ')} />
            {m.series.map((v, i) => (
              <circle key={i} cx={padL + i * step + step / 2} cy={scales[mi].y(v)} r={at === i ? 3.5 : 2}
                fill="var(--neutral-0)" stroke={AXIS[mi]} strokeWidth="1.5" />
            ))}
          </g>
        ))}

        {DAYS.map((d, i) => (
          <text key={d} x={padL + i * step + step / 2} y={H - 8} textAnchor="middle" fontSize="10"
            fill={at === i ? 'var(--text-primary)' : 'var(--text-tertiary)'}>{d.slice(3)}</text>
        ))}
      </svg>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', minHeight: 20, marginTop: 'var(--space-4)', fontSize: 'var(--fs-12)', flexWrap: 'wrap' }}>
        {at != null ? (
          <>
            <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{DAYS[at]}</span>
            {metrics.map((m, i) => (
              <span key={m.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: AXIS[i] }} />
                {m.label}
                <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums' }}>{fmt(m.series[at], m.unit)}</span>
              </span>
            ))}
          </>
        ) : <span style={{ color: 'var(--text-tertiary)' }}>悬停查看每日读数</span>}
      </div>
    </div>
  );
}

/* ---------- 复盘简报：日 / 周 / 月，可选期次、预览与下载 ---------- */

function ReviewBrief() {
  const [cycle, setCycle] = React.useState('day');
  const [period, setPeriod] = React.useState(BRIEFS.day.periods[0]);
  const [preview, setPreview] = React.useState(false);

  const cfg = BRIEFS[cycle];
  const current = cfg.data[period] || cfg.data[cfg.periods[0]];
  const label = cfg.data[period] ? period : cfg.periods[0];

  const switchCycle = (next) => { setCycle(next); setPeriod(BRIEFS[next].periods[0]); };

  return (
    <>
      <Card title="复盘简报" subtitle={cfg.schedule}
        actions={<SegmentedControl size="sm" options={[{ value: 'day', label: '日报' }, { value: 'week', label: '周报' }, { value: 'month', label: '月报' }]}
          value={cycle} onChange={switchCycle} />}
        footer={<span>由 HUITOU 依据投放数据自动撰写，可在设置中调整推送时间与接收人</span>}>

        {/* 期次选择 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <Icon name="calendar" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
          <FilterSelect value={label} onChange={setPeriod} width={150} options={cfg.periods} />
          <span style={{ flex: 1 }} />
          <Button variant="secondary" size="sm" iconLeft="eye" onClick={() => setPreview(true)}>预览</Button>
          <DropdownMenu align="right" trigger={<Button variant="secondary" size="sm" iconLeft="download" iconRight="chevron-down">下载</Button>}
            items={[
              { id: 'pdf', label: label + ' ' + cfg.unit + '报 PDF', icon: 'file-text' },
              { id: 'img', label: '简报长图 PNG', icon: 'image' },
              { divider: true },
              { id: 'xlsx', label: '完整数据表 XLSX', icon: 'table-2' },
              { id: 'csv', label: '完整数据表 CSV', icon: 'file-spreadsheet' },
            ]} />
        </div>

        <BriefBody brief={current} statsOnly />
      </Card>

      <Dialog open={preview} width={620} title={label + ' ' + cfg.unit + '报'} description={cfg.schedule + ' · 王小卤虎皮凤爪旗舰店'}
        onClose={() => setPreview(false)}
        footer={<>
          <Button onClick={() => setPreview(false)}>关闭</Button>
          <Button variant="secondary" iconLeft="table-2">下载完整数据表</Button>
          <Button variant="primary" iconLeft="download">下载 PDF</Button>
        </>}>
        <BriefBody brief={current} full />
      </Dialog>
    </>
  );
}

/* statsOnly：卡片里只留三项汇总，结论与要点留给预览弹窗 */
function BriefBody({ brief, full, statsOnly }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 'var(--space-5)', marginBottom: statsOnly ? 0 : 'var(--space-6)' }}>
        {brief.stats.map((st) => (
          <div key={st.k} style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{st.k}</div>
            <div style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)', fontVariantNumeric: 'tabular-nums', marginTop: 3 }}>{st.v}</div>
            {st.d != null ? <div style={{ marginTop: 2 }}><StatDelta value={st.d} goodWhen={st.g} /></div>
              : <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 4 }}>无对比期</div>}
          </div>
        ))}
      </div>

      {statsOnly ? null : <>
        <div style={{ fontSize: 'var(--fs-14)', lineHeight: 'var(--lh-relaxed)' }}>{brief.headline}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
          {brief.points.map((p) => (
            <div key={p.text} style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'flex-start' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--status-' + p.tone + '-fg)', flex: 'none', marginTop: 7 }} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}>{p.text}</span>
            </div>
          ))}
        </div>
      </>}

      {full ? (
        <div style={{ marginTop: 'var(--space-7)', paddingTop: 'var(--space-6)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)' }}>
          <div style={{ fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>分计划明细</div>
          <DataTable dense rows={ROWS}
            columns={[
              { key: 'name', header: '广告计划' },
              { key: 'spend', header: '花费', align: 'right', mono: true },
              { key: 'conv', header: '转化', align: 'right', mono: true },
              { key: 'cpa', header: '转化成本', align: 'right', mono: true },
              { key: 'roi', header: 'ROI', align: 'right', mono: true },
            ]} />
        </div>
      ) : null}
    </div>
  );
}

/* ---------- 详细数据 ---------- */

function DetailTable() {
  const [tab, setTab] = React.useState('plan');
  return (
    <Card title="详细数据" padded={false}
      actions={<Button variant="ghost" size="sm" iconLeft="download">导出</Button>}>
      <div style={{ padding: '0 var(--gutter-card)' }}>
        <Tabs value={tab} onChange={setTab} items={[{ id: 'plan', label: '按计划' }, { id: 'creative', label: '按素材' }, { id: 'audience', label: '按人群' }]} />
      </div>
      <DataTable
        dense rows={ROWS}
        columns={[
          { key: 'name', header: '广告计划', render: (r) => (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap' }}>{r.name}</div>
              <div style={{ marginTop: 2 }}><StatusDot tone={r.tone} label={r.status} style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }} /></div>
            </div>
          ) },
          { key: 'trend', header: 'CPA 趋势', render: (r) => <Sparkline data={r.series} width={64} height={20} color={r.delta > 0 ? 'var(--viz-negative)' : 'var(--viz-1)'} /> },
          { key: 'spend', header: '花费', align: 'right', mono: true, sorted: 'desc' },
          { key: 'conv', header: '转化', align: 'right', mono: true },
          { key: 'cpa', header: '转化成本', align: 'right', mono: true },
          { key: 'roi', header: 'ROI', align: 'right', mono: true },
          { key: 'delta', header: '成本变化', align: 'right', render: (r) => <StatDelta value={r.delta} goodWhen="down" /> },
        ]}
      />
    </Card>
  );
}

Object.assign(window, { OverviewScreen });
})();
