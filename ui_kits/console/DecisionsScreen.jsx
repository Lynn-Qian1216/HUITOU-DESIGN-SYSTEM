(() => {
/* 被通知或待办带过来时，对应那一条套一圈高亮环，两秒后消退。 */
function FocusWrap({ id, children }) {
  const on = window.useFocus(id);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!on || !ref.current) return;
    const box = ref.current.closest('.huitou-scroll');
    if (box) box.scrollTop = Math.max(0, ref.current.offsetTop - box.offsetTop - 24);
  }, [on]);
  return <div ref={ref} className={window.focusClass(on, 'card')}>{children}</div>;
}
const { Icon, IconButton, Button, Badge, Card, Divider, StatusDot, Input, Select, Tabs, Tag, EmptyState, AgentTimeline, Popover, Dialog, Alert , Pagination, FilterSelect, DecisionCard, DecisionActions, TrackingTable, MetricRounds, PriorityChip, ExpiryChip, MetaChip, ResultNote } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, StrategyConfig } = window;

/* AI决策：当前队列 + 历史执行。点进单条决策查看完整决策思路。 */

const GOAL = '利用CTR高位窗口扩量获取更多优质转化，目标达成日转化量提升20%+';
const REASON = '该计划近3日消耗持续超预算15%，CTR表现优异达3.6%，建议上调日预算抓住增长窗口期。AI发现该计划在午间时段(10:00-14:00)转化效率尤为突出，CPA仅¥22.30，远低于账户均值¥38.50。';

const ROUNDS = ['一轮 19:00', '二轮 21:00', '三轮 23:00'];

/* 当前队列按「类型 × 状态」全组合生成：六种改动 × 四种状态 = 24 条。
   手写 24 段会漏掉组合，也很难保证同一类型在四种状态下说的是同一件事。
   每个类型给一套自己的指标（改预算看转化与 ROI、素材看 CTR 与 CPM），
   每个状态只决定轮次数据与出口，不改这条决策本身在说什么。 */

const METRIC = {
  转化: { name: '日转化量', target: '≥500', from: '350', pass: ['512', '536'], miss: ['392', '388', '381'] },
  ROI: { name: 'ROI', target: '≥3.5', from: '2.5', pass: ['3.6', '3.8'], miss: ['2.9', '2.7', '2.6'] },
  CPA: { name: 'CPA', target: '≤¥30', from: '¥38.50', pass: ['¥28.60', '¥27.10'], miss: ['¥33.40', '¥37.20', '¥39.10'] },
  账户ROI: { name: '账户 ROI', target: '≥1.8', from: '1.42', pass: ['1.9', '2.1'], miss: ['1.5', '1.44', '1.40'] },
  无效消耗: { name: '无效消耗占比', target: '≤8%', from: '17%', pass: ['7%', '6%'], miss: ['14%', '15%', '16%'] },
  CTR: { name: 'CTR', target: '≥3.2%', from: '1.9%', pass: ['3.4%', '3.6%'], miss: ['2.8%', '2.4%', '2.1%'] },
  CPM: { name: 'CPM', target: '≤¥42', from: '¥51', pass: ['¥40', '¥38'], miss: ['¥46', '¥48', '¥49'] },
  夜间消耗: { name: '夜间无效消耗', target: '≤5%', from: '18%', pass: ['4%', '3%'], miss: ['12%', '14%', '15%'] },
  午间占比: { name: '午间转化占比', target: '≥34%', from: '26%', pass: ['36%', '38%'], miss: ['28%', '27%', '27%'] },
};

const TYPES = [
  {
    type: '改日预算', change: '1000元 → 1200元', delta: '+20%', editable: true, impact: '+¥980 / 周',
    plan: '吃货小卤--脆笋去骨鸡爪--2026-0…', strategy: '转化成本超标预警',
    goal: '利用 CTR 高位窗口扩量获取更多优质转化，目标日转化量提升 20% 以上',
    reason: '该计划近 3 日消耗持续超预算 15%，CTR 达 3.6%，建议上调日预算抓住增长窗口。午间时段（10:00–14:00）CPA 仅 ¥22.30，远低于账户均值 ¥38.50。',
    metrics: ['转化', 'ROI'], failNote: 'ROI 三轮均未达标，已自动回滚预算',
  },
  {
    type: '改出价', change: '出价 ¥32 → ¥36', delta: '+12%', editable: true, impact: '+¥210 / 周',
    plan: '线上消费贷', strategy: '转化成本超标预警',
    goal: '在成本可控前提下抢占午间高转化窗口，目标 ROI 回到 3.5 以上',
    reason: '出价长期低于竞价中位，午间常错失优质流量。近 7 日曝光份额下降 12%，而已获转化的 CPA 仅 ¥28.60，说明流量质量本身没问题。小幅上调后观察三轮，ROI 未回升即回滚。',
    metrics: ['ROI', 'CPA'], failNote: '新增流量转化率偏低，CPA 反升，已回滚出价',
  },
  {
    type: '新建广告', change: '', impact: '+¥420 / 周',
    strategy: '时段效率优化',
    goal: '为午间高转化人群单独建计划，避免与全天计划争抢预算',
    reason: '现有计划无法按时段拆分预算，午间高效流量与夜间低效流量共用同一份日预算。新建计划可独立控制时段与出价，代价是需重新度过学习期，前 3 日数据波动较大。',
    metrics: ['转化', 'ROI'], failNote: '学习期结束仍未起量，转化量三轮未达标',
  },
  {
    type: '暂停广告', change: '2 个广告计划', impact: '+¥360 / 周',
    plan: '吃货小卤--泡椒凤爪--2026-0…', strategy: '低效计划止损',
    goal: '止损连续低于回本线的计划，把预算释放给达标计划',
    reason: '这 2 个计划近 5 日 ROI 分别为 0.71 与 0.68，均低于保本线 1.0，且与主计划人群重叠 41%，属于重复购买同一批用户。暂停后预算自动回流，无需额外操作。',
    metrics: ['账户ROI', '无效消耗'], failNote: '预算回流后集中到次优计划，账户 ROI 未回升',
  },
  {
    type: '素材筛选', change: '下线 3 条 · 保留 2 条', impact: '+¥240 / 周',
    plan: '线上消费贷', strategy: '素材疲劳预警',
    goal: '淘汰疲劳素材，把曝光集中到仍在起量的两条上',
    reason: '5 条在投素材中，3 条投放已超 12 天，CPM 上涨 22% 而 CTR 从 3.6% 降至 1.9%，属典型素材疲劳。另 2 条上线 4 天，CTR 稳定在 3.4% 以上。下线后需 48 小时内补新素材，否则曝光会向单条集中。',
    metrics: ['CTR', 'CPM'], failNote: '保留素材同步进入疲劳期，CTR 未回升',
  },
  {
    type: '调时段', change: '关停 00:00–07:00', impact: '+¥150 / 周',
    plan: '吃货小卤--脆笋去骨鸡爪--2026-0…', strategy: '时段效率优化',
    goal: '把夜间低效时段的预算挪到午间高转化窗口',
    reason: '近 14 日 00:00–07:00 消耗占 18%，转化仅占 6%，该时段 CPA 为全天均值的 2.3 倍。关停后预算会自然前移到 11:00–14:00。代价是日间竞价压力上升，需观察出价是否被动抬高。',
    metrics: ['夜间消耗', '午间占比'], failNote: '日间竞价被动抬高，夜间消耗占比未降到线内',
  },
];

/* 状态只决定轮次数据与失效时间：验证中给两轮（先未达标、再达标，第三轮待跑），
   失败给三轮全未达标，待执行与已拒绝一轮未跑。 */
const ROUNDS_BY_STATUS = {
  待执行: (m) => [null, null, null],
  验证中: (m) => [{ v: m.miss[0] }, { v: m.pass[0] }, null],
  失败: (m) => m.miss.map((v) => ({ v })),
  已拒绝: (m) => [null, null, null],
};

const QUEUE_STATUSES = ['待执行', '验证中', '失败', '已拒绝'];
const EXPIRY = ['今天 19:18 后失效', '今天 21:00 后失效', '明天 09:00 后失效'];
const TIMES = ['13:18', '13:30', '13:52', '14:02', '11:06', '10:22'];

const QUEUE = QUEUE_STATUSES.flatMap((status, si) => TYPES.map((t, ti) => {
  const i = si * TYPES.length + ti;
  const failed = status === '失败';
  return Object.assign({}, t, {
    id: 'd' + (i + 1),
    status,
    priority: ['高', '中', '低'][(ti + si) % 3],
    /* 失败与已拒绝的收益都不会发生，措辞和取色在卡片里按状态处理，这里只给该显示的值。 */
    impact: failed ? '未达成' : t.impact,
    expiry: status === '待执行' ? EXPIRY[ti % EXPIRY.length] : undefined,
    time: '2026年06月11日 ' + TIMES[(ti + si) % TIMES.length],
    failNote: failed ? t.failNote : undefined,
    metrics: t.metrics.map((k) => {
      const m = METRIC[k];
      return { name: m.name, target: m.target, from: m.from, rounds: ROUNDS_BY_STATUS[status](m) };
    }),
  });
}));

/* 历史执行同样按「类型 × 结果」全组合生成：六种改动 × 三种结局 = 18 条。
   结局不是三个同义的「结束」——「达成」是验证通过、「已回滚」是跑完没达标退回原值、
   「已失效」是压根没被处理过。前两者有三轮数据，后者一轮都没有。 */

const OUTCOMES = [
  { status: '已执行', result: 'success', text: (m) => '达成：' + m[0].name + ' ' + m[0].pass[1] + '，' + m[1].name + ' ' + m[1].pass[1], rounds: (m) => [{ v: m.miss[0] }, { v: m.pass[0] }, { v: m.pass[1] }] },
  { status: '已执行', result: 'revert', text: () => '未达成，已于 72 小时后回滚', rounds: (m) => m.miss.map((v) => ({ v })) },
  { status: '已失效', result: 'expired', text: () => '超过有效期未处理', rounds: () => [null, null, null] },
];

const HISTORY_DAYS = ['2026年06月10日 14:02', '2026年06月09日 09:20', '2026年06月08日 16:44', '2026年06月07日 11:15', '2026年06月06日 15:38', '2026年06月05日 10:07'];

const HISTORY = OUTCOMES.flatMap((o, oi) => TYPES.map((t, ti) => {
  const i = oi * TYPES.length + ti;
  const ms = t.metrics.map((k) => METRIC[k]);
  return Object.assign({}, t, {
    id: 'h' + (i + 1),
    status: o.status,
    result: o.result,
    priority: ['高', '中', '低'][(ti + oi) % 3],
    /* 回滚与失效都没拿到收益，卡片按状态压色，这里只给该显示的值。 */
    impact: o.result === 'success' ? t.impact : o.result === 'revert' ? '未达成' : '已过期',
    time: HISTORY_DAYS[(ti + oi) % HISTORY_DAYS.length],
    resultText: o.text(ms),
    failNote: undefined,
    metrics: ms.map((m) => ({ name: m.name, target: m.target, from: m.from, rounds: o.rounds(m) })),
  });
}));

/* ---------- 列表 ---------- */

/* 带计数的筛选下拉：每项右侧给出命中行数，选不到数据的项不隐藏、只置灵，
   避免类型列表随数据跳动。计数由明细 reduce 推导，不写常量。 */
const countBy = (rows, key, label) => (label.startsWith('全部') ? rows.length : rows.filter((r) => r[key] === label).length);

function DecisionsScreen({ onToast }) {
  const [tab, setTab] = React.useState('queue');
  const [open, setOpen] = React.useState(null);
  const [q, setQ] = React.useState('');
  const [type, setType] = React.useState('全部类型');
  const [status, setStatus] = React.useState('全部状态');
  const [acted, setActed] = React.useState({});

  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(20);
  const source = tab === 'history' ? HISTORY : QUEUE;
  const ORDER = { 待执行: 0, 验证中: 1, 失败: 2, 已拒绝: 3, 已执行: 0, 已失效: 1 };
  /* 默认按级别从高到低 —— 队列是待办清单，先看的必须是最急的那条。
     同级别内再按状态排（待执行在前），级别相同又都待执行时保持原顺序。 */
  const RANK = { 高: 0, 中: 1, 低: 2 };
  /* 只看原始状态排序：刚点完「执行」的卡片若立刻重排，会从眼下跳到列表另一处，
     用户找不回刚才那条。状态徒得就地变，位置等下一次进页或刷筛选时再收。 */
  const rows = source.filter((d) => {
    const st = acted[d.id] || d.status;
    if (q && !(d.type.includes(q) || (d.plan || '').includes(q) || d.strategy.includes(q) || d.id.includes(q))) return false;
    if (type !== '全部类型' && d.type !== type) return false;
    if (status !== '全部状态' && st !== status) return false;
    return true;
  }).sort((a, b) => (RANK[a.priority] - RANK[b.priority]) || (ORDER[a.status] - ORDER[b.status]));
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const at = Math.min(page, pageCount);

  if (open) {
    const d = source.find((x) => x.id === open) || QUEUE[0];
    return <DecisionDetail decision={{ ...d, status: acted[d.id] || d.status }} onBack={() => setOpen(null)}
      onAct={(next) => { setActed((a) => ({ ...a, [d.id]: next })); if (next === '验证中') onToast && onToast(); }} />;
  }

  return (
    <>
      <Tabs value={tab} onChange={(v) => { setTab(v); setStatus('全部状态'); }} style={{ marginBottom: 'var(--space-7)' }}
        items={[{ id: 'queue', label: '当前队列', count: QUEUE.length }, { id: 'history', label: '历史执行', count: HISTORY.length }, { id: 'strategy', label: '策略配置' }]} />

      {tab === 'strategy' ? <StrategyConfig onToast={onToast} /> : <>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <Input placeholder="搜索广告计划、ID或标签" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 268 }} />
        <FilterSelect value={type} onChange={setType} width={148}
          options={['全部类型', '改日预算', '改出价', '新建广告', '暂停广告', '素材筛选', '调时段'].map((o) => ({ label: o, count: countBy(source, 'type', o) }))} />
        <FilterSelect value={status} onChange={setStatus} width={140}
          options={(tab === 'queue' ? ['全部状态', '待执行', '验证中', '失败', '已拒绝'] : ['全部状态', '已执行', '已失效']).map((o) => ({ label: o, count: countBy(source, 'status', o) }))} />
      </div>

      {rows.length ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {rows.slice((at - 1) * size, at * size).map((d, i) => (
              <FocusWrap key={d.id} id={i === 0 ? [d.id, 'decision-first'] : d.id}>
              <DecisionCard decision={{ ...d, status: acted[d.id] || d.status }}
                onOpen={() => setOpen(d.id)}
                onAct={(next) => { setActed((a) => ({ ...a, [d.id]: next })); if (next === '验证中') onToast && onToast(); }} />
              </FocusWrap>
            ))}
          </div>
          <StickyFooter>
            <Pagination page={at} pageCount={pageCount} total={rows.length} onChange={setPage}
              pageSize={size} pageSizeOptions={[5, 10, 20]} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
          </StickyFooter>
        </>
      ) : (
        <Card><EmptyState icon="search-x" title="没有符合条件的决策" description="换个关键词，或把筛选条件放宽。" compact /></Card>
      )}
      </>}
    </>
  );
}

/* ---------- 单条决策卡 ---------- */

/* ---------- 局部零件 ---------- */

function FieldRow({ label, clamp, lines = 1, children }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--fs-13)', lineHeight: 'var(--lh-normal)' }}>
      <span style={{ flex: 'none', width: 30, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{
        flex: 1, minWidth: 0, color: 'var(--text-primary)',
        ...(clamp ? { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : null),
      }}>{children}</span>
    </div>
  );
}

Object.assign(window, { DecisionsScreen, FieldRow, GOAL, REASON, ROUNDS });
})();
