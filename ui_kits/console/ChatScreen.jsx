(() => {
const { Icon, IconButton, MentionChip, MENTION_KINDS, AnchoredPanel, FileCard, Dialog, PromptQueue } = window.HUITOUAIDesignSystem_52606d;

const MAX_BYTES = 20 * 1024 * 1024;
const formatSize = (n) => (n < 1024 ? n + ' B' : n < 1048576 ? Math.round(n / 1024) + ' KB' : (n / 1048576).toFixed(1) + ' MB');
const OK_EXT = /\.(png|jpe?g|gif|webp|mp4|mov|pdf|csv|xlsx?|docx?|txt|zip)$/i;

/* 可被引用的对象。真实实现里这份目录来自后端搜索；这里按各类的真实体量生成，
   商品四百多条、素材一千多条 —— 目录只给三条样本的话，看不出「几百条里怎么找」这件事。 */
const pick = (arr, i) => arr[i % arr.length];

const FLAVOR = ['原味', '藤椒味', '蜜汁味', '香辣味', '孜然味', '黑胡椒味', '酱香味', '柠檬味'];
const CATEGORY = ['虎皮凤爪', '虎皮鹌鹑蛋', '卤蛋', '鸭脖', '素毛肚', '豆干', '鸡胗'];
const SPEC = ['单袋 60g', '3 袋装', '5 袋装', '10 袋装', '家庭装 500g', '尝鲜装', '礼盒装', '整箱 24 袋', '双拼组合'];
const PRODUCTS = Array.from({ length: 482 }, (_, i) => {
  const sold = 320 + ((i * 137) % 9200);
  const st = i % 11 === 0 ? '已下架' : i % 7 === 0 ? '缺货' : '在售';
  return {
    kind: 'product',
    label: '王小卤' + pick(CATEGORY, i) + ' · ' + pick(FLAVOR, i * 3) + ' · ' + pick(SPEC, i * 5),
    hint: st === '在售' ? '在售 · 近 7 天售出 ' + sold.toLocaleString() : st,
  };
});

const GOAL = ['拉新', '再营销', '广泛探索', '品牌搜索', '相似人群 3%', '直播引流', '短视频种草', '货架托管'];
const REGION = ['美国', '澳洲', '欧洲', '日本', '东南亚', '中国香港', '加拿大'];
const CAMPAIGNS = Array.from({ length: 214 }, (_, i) => {
  const spend = 480 + ((i * 911) % 24000);
  const roas = (0.6 + ((i * 37) % 620) / 100).toFixed(2);
  const st = i % 9 === 0 ? '已暂停' : i % 5 === 0 ? '已标记' : i % 4 === 0 ? '自动驾驶' : '投放中';
  return {
    kind: 'campaign',
    label: pick(GOAL, i) + ' — ' + pick(REGION, i * 3) + (i > 55 ? ' #' + (i - 55) : ''),
    hint: st + ' · 日耗 ¥' + spend.toLocaleString() + ' · ROAS ' + roas,
  };
});

const FORM = ['15s 竖版', '30s 剧情版', '9s 快剪', '口播版', '开箱版', '达人合拍', '货架图文'];
const CREATIVES = Array.from({ length: 1360 }, (_, i) => {
  const ctr = (0.8 + ((i * 53) % 380) / 100).toFixed(1);
  const days = 1 + ((i * 17) % 45);
  return {
    kind: 'creative',
    label: pick(FLAVOR, i) + pick(FORM, i * 2) + ' ' + String.fromCharCode(65 + (i % 26)) + (i > 181 ? '-' + Math.floor(i / 182) : ''),
    hint: '投放 ' + days + ' 天 · CTR ' + ctr + '%',
  };
});

const NICK = ['天天了噜鸭梨', '小卤日记', '干饭阿宁', '深夜食堂菌', '零食猎人阿凯', '大胃王小圆', '办公室零嘴', '追剧搭子妍'];
const CREATORS = Array.from({ length: 96 }, (_, i) => {
  const fans = 3 + ((i * 29) % 260);
  const st = i % 8 === 0 ? '异常' : i % 5 === 0 ? '授权中' : i % 6 === 0 ? '未申请' : '授权完成';
  return {
    kind: 'creator',
    label: pick(NICK, i) + (i > 7 ? ' ' + String.fromCharCode(65 + (i % 26)) : ''),
    hint: st + ' · 粉丝 ' + fans + ' 万',
  };
});

const AGENTS = [
  { kind: 'agent', label: '诊断智能体', hint: '找出账户里正在漏钱的地方' },
  { kind: 'agent', label: '出价智能体', hint: '按转化窗口调价' },
  { kind: 'agent', label: '预算智能体', hint: '在计划之间搬预算' },
  { kind: 'agent', label: '素材智能体', hint: '筛素材、找疲劳' },
  { kind: 'agent', label: '达人智能体', hint: '选达人、跟授权' },
  { kind: 'agent', label: '商品智能体', hint: '挑品、盯库存与动销' },
  { kind: 'agent', label: '复盘智能体', hint: '写日报、找归因' },
  { kind: 'agent', label: '审核智能体', hint: '预检素材与落地页合规' },
];

const ACCOUNTS = [
  { kind: 'account', label: '王小卤虎皮凤爪旗舰店', hint: '巨量千川 · 主账户' },
  { kind: 'account', label: '王小卤食品专营店', hint: '巨量千川 · 分销' },
  { kind: 'account', label: '王小卤腾讯营销号', hint: '腾讯营销 · 测试中' },
];

const MENTIONABLE = [].concat(AGENTS, CAMPAIGNS, PRODUCTS, CREATIVES, CREATORS, ACCOUNTS);
const KIND_ORDER = ['agent', 'campaign', 'product', 'creative', 'creator', 'account'];
const KIND_TOTAL = KIND_ORDER_TOTAL();
function KIND_ORDER_TOTAL() {
  const t = {};
  MENTIONABLE.forEach((m) => { t[m.kind] = (t[m.kind] || 0) + 1; });
  return t;
}
/* 最近引用过的对象。绝大多数提问都在重复引用同几个东西，把它们放在最前面，
   多数情况下一次点击就完事，根本不用搜。 */
const RECENT = [PRODUCTS[3], CAMPAIGNS[5], AGENTS[0], CREATIVES[1]];

const SUGGESTIONS = [
  ['给我昨天的日报', '现在的账户状态如何', '帮我执行最紧急的待执行决策'],
  ['复盘简报', '账户诊断', '执行审批', '计划审核慢怎么办'],
];

const DAILY = [
  { type: 'text', body: '昨天账户消耗 ¥28,412，较前一日 +4.1%；转化 121 次，混合 CPA ¥41.20，较前一日下降 6.8%。「拉新 — 美国」贡献了 62% 的转化，是唯一在目标 CPA 之内的系列。' },
  { type: 'metrics', items: [
    { label: '消耗', value: '¥28,412', delta: 4.1, goodWhen: 'none', basis: '较前一日', series: [18,21,19,24,26,25,28] },
    { label: '转化', value: '121', delta: 9.2, goodWhen: 'up', basis: '较前一日', series: [82,88,91,96,99,112,121] },
    { label: '混合 CPA', value: '¥41.20', delta: -6.8, goodWhen: 'down', basis: '较前一日', series: [52,49,51,47,45,44,41] },
  ] },
  { type: 'text', body: '把时间轴拉长到一周看，消耗在稳步爬升，CPA 却一路走低 —— 说明这轮放量买到的是更便宜的流量，不是靠加价换量。' },
  { type: 'chart', title: '近 7 天消耗与 CPA', note: '数据截至 08-13 06:00',
    days: ['一','二','三','四','五','六','日'], bars: [18,21,19,24,26,25,28], line: [52,49,51,47,45,44,41],
    legend: [{ label: '消耗', color: 'var(--viz-1)', value: '¥28,412' }, { label: '混合 CPA', color: 'var(--viz-3)', value: '¥41.20', line: true }] },
  { type: 'text', body: '拆到系列看，差距集中在两头：品牌搜索 ROAS 6.81 但盘子小，再营销花了 ¥1,110 只做到 0.92，是唯一亏损的系列。' },
  { type: 'table', title: '按系列拆分', columns: [
      { key: 'name', header: '广告系列' },
      { key: 'spend', header: '消耗', align: 'right', mono: true },
      { key: 'cpa', header: 'CPA', align: 'right', mono: true },
      { key: 'roas', header: 'ROAS', align: 'right', mono: true },
    ], rows: [
      { id: 'r1', name: '拉新 — 美国', spend: '¥12,480', cpa: '¥41.20', roas: '3.14' },
      { id: 'r2', name: '品牌搜索 — 美国', spend: '¥6,204', cpa: '¥12.44', roas: '6.81' },
      { id: 'r3', name: 'PMax — 商品目录', spend: '¥3,880', cpa: '¥54.90', roas: '1.61' },
      { id: 'r4', name: '再营销 — DTC', spend: '¥1,110', cpa: '¥88.05', roas: '0.92' },
    ] },
  { type: 'text', body: '结论是把钱从亏损的系列挪到还没吃饱的系列。这条已经过护栏校验，可以直接执行：' },
  { type: 'decision', title: '建议：每日 ¥1,200 从「再营销 — DTC」转向「拉新 — 美国」',
    detail: '再营销以 4.8 的频次反复触达同一批 3.8 万人，点击率已下降 31%；拉新连续 6 天在 15:00 前耗尽预算。',
    tags: ['巨量千川', '预算'], impact: '+¥980 / 周', confidence: '高置信度 · 21 天数据',
    evidence: '覆盖 3 个广告系列的 21 天转化数据，样本量充足，置信度：高。' },
  { type: 'text', body: '如果同意这条调整，我会在执行后监控 72 小时，CPA 恶化超过 15% 自动回滚。' },
  { type: 'footnote', items: ['数据来源 巨量千川', '生成于 08:12', '每 6 小时刷新'],
    actions: [{ label: '导出日报', icon: 'download' }, { label: '推送到群', icon: 'share-2' }] },
];

const DIAGNOSIS = [
  { type: 'text', body: '发现 4 条问题，按每周影响金额排序。前两条可以自动修复，我已经准备好方案。' },
  { type: 'text', body: '按每周能省下的钱排序，前三条都指向同一个问题：预算分配跟不上实际效率变化。' },
  { type: 'table', columns: [
      { key: 'title', header: '结论', wrap: true },
      { key: 'level', header: '严重度' },
      { key: 'impact', header: '每周影响', align: 'right', mono: true },
    ], rows: [
      { id: 'd1', title: '「再营销 — DTC」人群重叠', level: '高', impact: '¥412' },
      { id: 'd2', title: '「拉新 — 美国」预算受限', level: '中', impact: '¥980' },
      { id: 'd3', title: '「广泛 — 澳洲」素材疲劳', level: '中', impact: '¥210' },
      { id: 'd4', title: '2 个广告组仍处于学习期', level: '提示', impact: '—' },
    ] },
  { type: 'text', body: '其中影响最直接的是再营销这一条。它的人群与拉新高度重合，等于在为同一批用户付两次钱：' },
  { type: 'decision', title: '建议：暂停「再营销 — DTC」中的 3 个广告组',
    detail: 'ROAS 连续 5 天低于 0.8，且人群与拉新高度重叠。暂停后 72 小时内若拉新 CPA 恶化超过 15%，将自动恢复。',
    tags: ['巨量千川', '投放'], impact: '+¥412 / 周', confidence: '高置信度 · 21 天数据',
    evidence: '3 个广告组共 21 天数据，ROAS 连续低位，置信度：高。' },
  { type: 'text', body: '另外两条（预算受限、素材疲劳）也已备好方案，你可以在待执行决策里一并处理。' },
  { type: 'footnote', items: ['诊断于 13:44', '每 6 小时复检'], actions: [{ label: '查看全部结论', icon: 'arrow-right' }] },
];

/* 历史对话内容：点左侧任一条目载入对应的往返记录。
   key 与 AppShell 里 PROJECTS / LOOSE_CHATS 的 id 对应。 */
const BUDGET_PLAN = [
  { type: 'text', body: '618 大促总预算 ¥480,000，按预售期、开门红、日常、返场四段拆分。开门红（6/1–6/3）占 34%，是全周期效率最高的窗口。' },
  { type: 'metrics', items: [
    { label: '总预算', value: '¥480,000' },
    { label: '开门红占比', value: '34%', delta: 6.0, goodWhen: 'up', basis: '较去年' },
    { label: '目标 ROI', value: '2.60', delta: 8.3, goodWhen: 'up', basis: '较日常' },
  ] },
  { type: 'text', body: '节奏上做了两个高峰：开门红是主战场，返场（6/16 之后）承接犹豫用户，中间日常期把预算压到低位养账户权重。' },
  { type: 'chart', title: '分日预算节奏', note: '5-20 至 6-20，单位万元',
    days: ['5/20', '5/25', '6/1', '6/3', '6/10', '6/16', '6/20'], bars: [1.2, 1.8, 5.4, 4.9, 2.1, 1.6, 2.8], line: [2.1, 2.3, 2.8, 2.7, 2.4, 2.2, 2.5],
    legend: [{ label: '日预算', color: 'var(--viz-1)', value: '¥48万' }, { label: '目标 ROI', color: 'var(--viz-3)', value: '2.60', line: true }] },
  { type: 'text', body: '目前排的预算在开门红当天会提前耗尽，等于把最好的流量让给对手。建议提前上调：' },
  { type: 'decision', title: '建议：开门红前 48 小时把日预算上调至 ¥54,000',
    detail: '去年同期开门红前两日的转化成本比日常低 23%，当前预算会在 14:00 前耗尽。',
    tags: ['巨量千川', '预算'], impact: '+¥12,400 / 周', confidence: '高置信度 · 去年同期 + 近 30 天数据',
    evidence: '基于去年 618 全周期数据与本账户近 30 天分时表现，置信度：高。' },
  { type: 'text', body: '整体盘子按去年同期 1.3 倍设置，若预售期数据超预期，我会在 5-28 提示是否追加。' },
  { type: 'footnote', items: ['生成于 5-20 09:12', '每日 08:00 复算'], actions: [{ label: '导出预算表', icon: 'download' }] },
];

const AUDIENCE_REVIEW = [
  { type: 'text', body: '预售期共投放 6 个人群包，其中「历史购买 180 天」与「相似人群 3%」重叠 41%，重复触达导致频次虚高。' },
  { type: 'text', body: '四个主力包的表现分层很清楚：直播间互动包 CPA 最低但量小，相似人群量大却贵了近一倍。' },
  { type: 'table', columns: [
      { key: 'name', header: '人群包' },
      { key: 'reach', header: '触达', align: 'right', mono: true },
      { key: 'freq', header: '频次', align: 'right', mono: true },
      { key: 'cpa', header: 'CPA', align: 'right', mono: true },
    ], rows: [
      { id: 'a1', name: '历史购买 180 天', reach: '182,400', freq: '4.6', cpa: '¥28.10' },
      { id: 'a2', name: '相似人群 3%', reach: '316,700', freq: '3.9', cpa: '¥41.20' },
      { id: 'a3', name: '品类兴趣 — 卤味', reach: '94,300', freq: '2.1', cpa: '¥36.80' },
      { id: 'a4', name: '直播间互动', reach: '41,600', freq: '1.8', cpa: '¥22.40' },
    ] },
  { type: 'text', body: '重叠部分的用户已经在历史购买包里被触达过，在相似人群里再买一次纯属浪费：' },
  { type: 'decision', title: '建议：把「相似人群 3%」中的历史购买用户排除',
    detail: '两个包重叠 41%，排除后可释放约 ¥1,800/周 的重复消耗，预计整体频次降至 3.2。',
    tags: ['巨量千川', '定向'], impact: '+¥1,800 / 周', confidence: '中置信度 · 14 天数据',
    evidence: '重叠度由 14 天曝光去重计算，样本充足但周期偏短，置信度：中。' },
  { type: 'text', body: '排除后建议再观察三天，若频次没有降到 3.5 以下，说明还有第三个包在重复触达。' },
  { type: 'footnote', items: ['复盘于 6-09 21:30'], actions: [{ label: '查看人群明细', icon: 'arrow-right' }] },
];

const CREATIVE_PICK = [
  { type: 'text', body: '本周新上 12 条素材，3 条已跑出量。「开袋即食·特写」CTR 4.8%，是账户均值的两倍，建议加投。' },
  { type: 'text', body: '四条素材同预算跑了九天，CTR 与 CPA 高度相关 —— 点击率每差一个百分点，转化成本大约拉开 ¥10。' },
  { type: 'table', columns: [
      { key: 'name', header: '素材' },
      { key: 'ctr', header: 'CTR', align: 'right', mono: true },
      { key: 'cost', header: '消耗', align: 'right', mono: true },
      { key: 'cpa', header: 'CPA', align: 'right', mono: true },
    ], rows: [
      { id: 'v1', name: '开袋即食·特写 15s', ctr: '4.8%', cost: '¥8,240', cpa: '¥24.60' },
      { id: 'v2', name: '办公室分享 30s', ctr: '3.1%', cost: '¥5,110', cpa: '¥33.20' },
      { id: 'v3', name: '产地溯源 45s', ctr: '2.4%', cost: '¥3,880', cpa: '¥47.90' },
      { id: 'v4', name: '促销口播 15s', ctr: '1.6%', cost: '¥1,240', cpa: '¥68.30' },
    ] },
  { type: 'text', body: '促销口播已经没有救回来的迹象，建议把这部分预算让给还在涨的特写素材：' },
  { type: 'decision', title: '建议：暂停「促销口播 15s」，预算转给特写素材',
    detail: 'CTR 1.6% 且 CPA 高出目标 52%，已连续 4 天无改善。',
    tags: ['巨量千川', '素材'], impact: '+¥620 / 周', confidence: '高置信度 · 9 天数据',
    evidence: '4 条素材同期同预算对照，差异显著，置信度：高。' },
  { type: 'text', body: '剩下 9 条素材还在冷启动，样本不足，等各自跑满 50 次转化再做判断。' },
  { type: 'footnote', items: ['更新于 6-10 18:05'] },
];

const PERF_TIMEOUT = [
  { type: 'text', body: '明白，你想分析广告投放计划的表现、找出哪些计划跑得比较好。这是投放表现分析的活，我来派单采集近期数据并做诊断。投放表现分析这一轮超时了，并请你选一下接下来的方向，避免再空跑。' },
  { type: 'section', title: '当前情况', indent: true, lines: [
    '我派了「投放表现分析」去采集当前账号在投广告计划的近期表现，并按消耗、ROI、GMV 等指标排序出表现较好的计划。',
    '但子 Agent 连续两次执行超时，没有返回任何数据结论。这通常是平台报表取数慢或某个数据源卡住导致的，不是账号本身的问题。',
  ] },
  { type: 'section', title: '需要你确认', lines: [
    '为了不再次空跑，请帮我缩小一下范围，我再派一次：我已把问题展示给你，等你选完后我再据此派单。在此期间不会臆造任何数据或结论。',
  ] },
  { type: 'inquiry', question: '分析投放列表表现时，你希望我看哪个时间窗口和数据范围？',
    questions: [
      { key: 'window', label: '时间窗口', options: ['昨天', '近 3 天', '近 7 天', '近 14 天', '近 30 天'] },
      { key: 'scope', label: '数据范围', options: ['全部在投计划', '消耗 Top 20 计划', '指定广告组', '指定单个计划'] },
      { key: 'metric', label: '排序指标', options: ['消耗', 'ROI', 'GMV', '转化成本'] },
    ],
    defaults: [{ key: 'window', label: '近 7 天' }, { key: 'scope', label: '全部在投计划' }, { key: 'metric', label: '消耗' }],
    noteLabel: '补充说明（可选）', notePlaceholder: '例如：只看藤椒味相关的计划',
    dispatchedAt: '13:26', eta: '预计 2 min' },
  { type: 'footnote', items: ['子 Agent 投放表现分析', '连续 2 次超时', '13:23:53'],
    actions: [{ label: '查看执行日志', icon: 'arrow-right' }] },
];

const HISTORY_REPLIES = {
  h14: [{ q: '分析一下广告投放计划的表现，找出哪些计划跑得比较好', a: PERF_TIMEOUT }],
  h1: [
    { q: '618 的预算总盘怎么排？', a: BUDGET_PLAN },
    { q: '开门红那两天要不要单独提预算', a: null },
  ],
  h2: [{ q: '预售期的人群包复盘一下', a: AUDIENCE_REVIEW }],
  h3: [{ q: '这周哪些素材能爆量', a: CREATIVE_PICK }],
  h4: [{ q: '直播间引流的出价怎么定', a: CREATIVE_PICK }],
  h5: [{ q: '藤椒味新品现在跑得怎么样', a: DIAGNOSIS }],
  h6: [{ q: '首发应该定向哪些人群', a: AUDIENCE_REVIEW }],
  h7: [{ q: '首周 CPA 目标定多少合适', a: BUDGET_PLAN }],
  h8: [{ q: '昨天消耗为什么突然涨了', a: DAILY }],
  h9: [{ q: '再营销和拉新的人群重叠严重吗', a: AUDIENCE_REVIEW }],
  h10: [{ q: '素材疲劳的判断标准是什么', a: CREATIVE_PICK }],
  h11: [{ q: '给我八月的月报', a: DAILY }],
  h12: [{ q: '达人分销计划审核到哪一步了', a: DIAGNOSIS }],
  h13: [{ q: '腾讯营销的令牌怎么激活', a: DIAGNOSIS }],
};

const REPLIES = {
  '给我昨天的日报': DAILY,
  '复盘简报': DAILY,
  '账户诊断': DIAGNOSIS,
  '现在的账户状态如何': DIAGNOSIS,
  '帮我执行最紧急的待执行决策': DIAGNOSIS,
};

function ChatScreen({ chat, account, sidebarOpen, onToggleSidebar, onOpenRail }) {
  const [messages, setMessages] = React.useState(() => {
    const turns = HISTORY_REPLIES[chat];
    if (!turns) return [];
    const out = [];
    for (const t of turns) {
      out.push({ role: 'user', body: t.q });
      if (t.a) out.push({ role: 'agent', blocks: t.a });
    }
    return out;
  });
  const [draft, setDraft] = React.useState(chat ? '' : '请问今天广告消耗的如何，花了多少钱，效果如何');
  const [mentions, setMentions] = React.useState([]);
  /* 内容页里点「问 AI」：往引用区补一个胶囊（已有就不重复），并把焦点给到输入框。 */
  React.useEffect(() => {
    const on = (e) => {
      const m = e.detail; if (!m || !m.label) return;
      setMentions((list) => (list.some((x) => x.kind === m.kind && x.label === m.label) ? list : list.concat(m)));
      const el = document.querySelector('[data-huitou-composer] textarea');
      if (el) el.focus();
    };
    window.addEventListener('huitou:ask', on);
    return () => window.removeEventListener('huitou:ask', on);
  }, []);
  const scroller = React.useRef(null);
  const [barOn, setBarOn] = React.useState(false);   // 指针是否停在聊天区内

  /* 输入框浮在滚动区之上，量取其高度作为底部留白，内容不会被压住 */
  const composer = React.useRef(null);
  const [composerH, setComposerH] = React.useState(150);
  const [scrollH, setScrollH] = React.useState(0);
  React.useEffect(() => {
    const el = composer.current, sc = scroller.current;
    if (!el) return;
    const measure = () => { setComposerH(el.offsetHeight); if (sc) setScrollH(sc.clientHeight); };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (sc) ro.observe(sc);
    return () => ro.disconnect();
  }, []);

  /* 本轮提问所在节点：发送后把它顶到视口上沿，回复向下长出来。 */
  const turn = React.useRef(null);
  const [pending, setPending] = React.useState(false);

  /* 把本轮开头滚到接近顶部：留 PEEK 一截上文，避免看起来像开了新对话。
     用 scrollTo + smooth 让上移有动效；不用 scrollIntoView，避免影响外层布局。 */
  const PEEK = 144;
  const toTurnTop = React.useCallback(() => {
    const el = scroller.current, t = turn.current;
    if (!el) return;
    const target = () => (t ? Math.max(0, t.offsetTop - PEEK) : el.scrollHeight);
    const glide = () => {
      if (typeof el.scrollTo === 'function') el.scrollTo({ top: target(), behavior: 'smooth' });
      else el.scrollTop = target();
    };
    glide();
    /* 占位空白与骨架的高度是异步长出来的，稍后再校一次目标位 */
    setTimeout(glide, 80);
  }, []);

  /* 生成期间不追着滚 —— 回复在下方空白里长出来，视口保持不动 */
  const onGrow = React.useCallback(() => {
    if (pending) return;
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [pending]);

  /* 载入历史对话时直接贴底 */
  React.useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  /* 生成未结束时继续发送：新提问排进队列，本轮结束后按顺序自动发出。 */
  const [queue, setQueue] = React.useState([]);
  const qid = React.useRef(0);

  /* 右侧面板要能替用户「说一句」（例如去生成矩阵）：把最新的 send 挂到全局，每次渲染刷新 */
  React.useEffect(() => { window.HUITOU_CHAT_SEND = (text) => send(text, []); });

  /* 区块里的动作：表单提交发一条摘要消息；「在右侧查看」打开对应面板 */
  const onAct = (a) => {
    if (!a) return;
    if (a.type === 'send') send(a.text, []);
    if (a.type === 'open-rail' && onOpenRail) onOpenRail(a.rail);
  };

  const send = (text, refs) => {
    const body = (text || draft).trim();
    if (!body) return;
    if (pending) {
      setQueue((q) => q.concat({ id: (qid.current += 1), body, mentions: refs || mentions }));
      if (!text) { setDraft(''); setMentions([]); }
      return;
    }
    const blocks = (window.matrixReplyFor && window.matrixReplyFor(body)) || REPLIES[body] || DAILY;
    /* 引用随这条消息一起发出去 —— 发完清空，下一句默认不带上一句的引用 */
    const refsOut = refs || mentions;
    const startedAt = Date.now();
    setMessages((m) => [...m, { role: 'user', body, mentions: refsOut, turn: true }, { role: 'agent', blocks: blocks, shown: 0, startedAt, steps: [] }]);
    if (!text) setDraft('');
    setMentions([]);
    setPending(true);
    setTimeout(toTurnTop, 0);

    /* 每 700ms 追加一块。生成期间视口锁在本轮开头，内容向下填充空白 */
    let n = 0;
    const tick = setInterval(() => {
      n += 1;
      /* 每块内容落地时记一步：谁做的、做了什么、到这一步累计多久 */
      const st = Object.assign({}, window.HUITOU_STEP_OF(blocks[n - 1]), { ms: Date.now() - startedAt });
      const done = n >= blocks.length;
      setMessages((m) => m.map((x, i) => (i === m.length - 1 && x.role === 'agent'
        ? Object.assign({}, x, { shown: n, steps: (x.steps || []).concat([st]) }, done ? { elapsed: Date.now() - startedAt } : null)
        : x)));
      if (done) {
        clearInterval(tick); setPending(false);
        /* 方案落地那一刻把右侧面板打开：完整参数与创建进度在那边，对话里只放 diff */
        if (blocks.some((b) => b.type === 'matrix-proposals') && onOpenRail) onOpenRail('matrix');
      }
    }, 700);
  };
  const sendRef = React.useRef(send);
  sendRef.current = send;

  /* 本轮生成结束 → 取队首自动发出 */
  React.useEffect(() => {
    if (pending || !queue.length) return;
    const next = queue[0];
    const t = setTimeout(() => { setQueue((q) => q.slice(1)); sendRef.current(next.body, next.mentions); }, 260);
    return () => clearTimeout(t);
  }, [pending, queue]);

  return (
    <>
      <PaneHeader title={account || '巨量千川 · 王小卤虎皮凤爪'} sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar} />
      {/* 滚动区铺满整块高度，输入框浮在其上：滚动条从标题栏下方一直到面板底部 */}
      {/* 指针进出整块聊天区才切换滚动条可见性 —— 只靠 CSS :hover 会在滑块与内容交界处抖 */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}
        onMouseEnter={() => setBarOn(true)} onMouseLeave={() => setBarOn(false)}>
        <div ref={scroller} className={'huitou-scroll' + (barOn ? '' : ' huitou-scroll-hidden')} style={{
          position: 'absolute', inset: 0, overflowY: messages.length === 0 ? 'hidden' : 'auto',
          display: 'flex', flexDirection: 'column', paddingBottom: composerH,
        }}>
          {messages.length === 0
            ? <EmptyPrompt onPick={send} viewport={Math.max(0, scrollH - composerH)} />
            : <div style={{ maxWidth: 'var(--layout-max-chat-thread)', width: '100%', margin: '0 auto', padding: 'var(--space-9) var(--space-8) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                {messages.map((m, i) => (
                  /* 新一轮提问与上一条回复之间拉开距离 —— 轮次边界要比轮内的问答间距更明显 */
                  <div key={i} ref={m.turn ? turn : null} style={{ display: 'flex', flexDirection: 'column', minWidth: 0, marginTop: m.role === 'user' && i > 0 ? 'var(--space-8)' : 0 }}>
                    <Bubble {...m} onSettled={onGrow} onAct={onAct}
                      onEdit={m.role === 'user' ? () => {
                        setDraft(m.body);
                        if (m.mentions) setMentions(m.mentions);
                        const el = document.querySelector('[data-huitou-composer] textarea');
                        if (el) el.focus();
                      } : null} />
                  </div>
                ))}
                {/* 底部留白：生成时给本轮顶到视口上沿的空间，生成完也留半屏 ——
                    最后一行贴着输入框会让人以为还没写完 */}
                <div style={{ flex: 'none', height: pending ? Math.max(0, scrollH - composerH - 120) : Math.round(Math.max(0, scrollH - composerH) / 2) }} />
              </div>}
        </div>
        {/* 右侧留出滚动条宽度，输入框不遮住它 —— 滚动条完整贯通到底部 */}
        <div ref={composer} data-huitou-composer style={{ position: 'absolute', left: 0, right: 12, bottom: 0, zIndex: 5 }}>
          <Composer draft={draft} setDraft={setDraft} mentions={mentions} setMentions={setMentions} onSend={() => send()} onPrompt={setDraft} compact={scrollH > 0 && scrollH < 520}
            pending={pending} queue={queue}
            onQueueRemove={(it) => setQueue((q) => q.filter((x) => x.id !== it.id))}
            onQueuePromote={(it) => setQueue((q) => [it].concat(q.filter((x) => x.id !== it.id)))}
            onQueueClear={() => setQueue([])}
            onQueueEdit={(it) => {
              setQueue((q) => q.filter((x) => x.id !== it.id));
              setDraft(it.body);
              if (it.mentions) setMentions(it.mentions);
              const el = document.querySelector('[data-huitou-composer] textarea');
              if (el) el.focus();
            }} />
        </div>
      </div>
    </>
  );
}

function EmptyPrompt({ onPick, viewport }) {
  const tight = viewport > 0 && viewport < 240;
  return (
    <div style={{
      /* 在浮层之上的可视区内居中；可用高度不足时自然从顶部开始并允许滚动 */
      minHeight: viewport || undefined,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      flex: 'none', padding: tight ? 'var(--space-6) var(--space-8)' : 'var(--space-8)', textAlign: 'center',
      animation: 'huitou-rise var(--duration-slow) var(--ease-standard) both',
    }}>
      <div>
      <h2 style={{ margin: 0, fontSize: tight ? 'var(--fs-24)' : 'var(--fs-30)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)', lineHeight: 1.25 }}>有什么我能帮你的吗？</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', marginTop: tight ? 'var(--space-6)' : 'var(--space-9)' }}>
        {SUGGESTIONS.map((row, i) => (
          <div key={i} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', animation: 'huitou-rise var(--duration-slow) var(--ease-standard) ' + (120 + i * 90) + 'ms both' }}>
            {row.map((s) => <Chip key={s} label={s} onClick={() => onPick(s)} />)}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

function Chip({ label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        height: 28, padding: '0 var(--space-5)', border: 0, borderRadius: 'var(--radius-pill)',
        background: hover ? 'var(--surface-active)' : 'var(--neutral-100)', color: 'var(--text-primary)',
        font: 'inherit', fontSize: 'var(--fs-13)', cursor: 'pointer', transition: 'var(--transition-control)',
      }}>{label}</button>
  );
}

function Bubble({ role, body, blocks, shown, mentions, startedAt, steps, elapsed, onSettled, onEdit, onAct }) {
  const enter = { animation: 'huitou-rise var(--duration-normal) var(--ease-standard) both' };
  const [hover, setHover] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  if (role === 'loading') return <ReplyLoading onSettled={onSettled} />;
  if (role === 'user') {
    const copy = () => {
      const t = [(mentions || []).map((m) => '@' + m.label).join(' '), body].filter(Boolean).join(' ');
      if (navigator.clipboard) navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    };
    return (
      /* 操作条常驻会让每条消息下面都挂一行灰按钮；只在悬停时出现，且占位不塌陷 */
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ alignSelf: 'flex-end', maxWidth: 'var(--layout-max-chat-bubble)', minWidth: 0 }}>
        <div style={Object.assign({ padding: 'var(--space-5) var(--space-7)', background: 'var(--neutral-100)', borderRadius: 'var(--radius-xl)', fontSize: 'var(--fs-14)', lineHeight: 'var(--lh-normal)' }, enter)}>
          {/* 引用的对象跟着这句话留在记录里，之后回看才知道当时问的是哪几条 */}
          {mentions && mentions.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {mentions.map((m) => <MentionChip key={m.kind + m.label} kind={m.kind} label={m.label} />)}
            </div>
          ) : null}
          {body}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-3)',
          height: 28, marginTop: 2, opacity: hover ? 1 : 0, pointerEvents: hover ? 'auto' : 'none',
          transition: 'opacity var(--duration-fast, .12s) var(--ease-standard)',
        }}>
          {copied ? <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>已复制</span> : null}
          <IconButton icon={copied ? 'check' : 'copy'} label="复制" size="sm" onClick={copy} />
          {onEdit ? <IconButton icon="pencil" label="编辑重发" size="sm" onClick={onEdit} /> : null}
        </div>
      </div>
    );
  }
  const running = shown != null && blocks && shown < blocks.length;
  const next = running ? window.HUITOU_STEP_OF(blocks[shown]) : null;
  return (
    <div style={{ minWidth: 0 }}>
      {/* 计时只在已经出了内容之后才有意义 —— 之前那一刻猫刚开始跑，没有进度可报 */}
      {startedAt && (shown ? true : elapsed != null)
        ? <window.ReplyStatus startedAt={startedAt} steps={steps} elapsed={elapsed} running={!!running} /> : null}
      {blocks ? <ReplyBody blocks={blocks.slice(0, shown == null ? blocks.length : shown)} onAct={onAct} />
        : <span style={{ fontSize: 'var(--fs-14)', lineHeight: 'var(--lh-relaxed)' }}>{body}</span>}
      {running ? (
        <div style={{ marginTop: shown ? 'var(--space-6)' : 0 }}>
          <ReplyLoading onSettled={onSettled} skeleton={!shown} label={next.who + ' ' + next.what} />
        </div>
      ) : null}
    </div>
  );
}

/* 常用指令：输入框上方一行，点一下填进输入框 */
function PromptBar({ onPrompt, compact }) {
  const items = window.HUITOU_PROMPTS || [];
  if (!items.length) return null;
  return (
    <div className="huitou-scroll" style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)',
      flexWrap: compact ? 'nowrap' : 'wrap',
      overflowX: compact ? 'auto' : 'visible', paddingBottom: compact ? 2 : 0,
    }}>
      {items.map((p) => <PromptChip key={p.id} item={p} onClick={() => onPrompt && onPrompt(p.text)} />)}
    </div>
  );
}

function PromptChip({ item, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick} title={item.text}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, height: 26, padding: '0 var(--space-5)',
        borderWidth: 1, borderStyle: 'solid', borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        borderRadius: 'var(--radius-pill)', background: hover ? 'var(--surface-hover)' : 'var(--surface-card)',
        font: 'inherit', fontSize: 'var(--fs-12)', color: 'var(--text-primary)', cursor: 'pointer',
        whiteSpace: 'nowrap', transition: 'var(--transition-control)',
      }}>
      <Icon name={item.icon} size={12} style={{ color: 'var(--text-tertiary)' }} />{item.label}
    </button>
  );
}

/* @ 选择面板。素材有一千多条，平铺一个长列表是找不到东西的，所以分两层：
   —— 不输入时给「最近引用」+ 六个类型入口（带条数）。多数提问都在重复引用同几个对象，一次点击就完事。
   —— 一输入就跨类型搜，每组只露前 4 条，后面接一行「在 商品 中查看全部 482 条」把范围收进单类。
   —— 进入单类后顶部挂一枚范围胶囊，Backspace 退出去。范围一直显示在眼前，不会搜到一半忘了自己在哪。
   不做可折叠分组：折叠只是把一次点击换成两次，找不到东西这件事一点没变。 */
const GROUP_CAP = 4;
const SCOPE_CAP = 40;

/* 单类范围的表头。别用 MentionChip —— 它的第二段是对象名字，写成「共 8 条」就成了一个叫「共 8 条」的对象。
   这里要的是「我现在在哪一层」，所以做成可点的返回行。 */
function ScopeHead({ kind, onClear }) {
  const k = MENTION_KINDS[kind];
  return (
    <button type="button" onClick={onClear}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--neutral-25)'; }}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)', width: '100%', height: 36,
        padding: '0 var(--space-5)', border: 0, background: 'var(--neutral-25)',
        borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)',
        font: 'inherit', fontSize: 'var(--fs-13)', textAlign: 'left', cursor: 'pointer',
        color: 'var(--text-primary)', transition: 'var(--transition-control)',
      }}>
      <Icon name="arrow-left" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
      <Icon name={k.icon} size={14} style={{ color: k.ai ? 'var(--status-ai-fg)' : 'var(--text-tertiary)', flex: 'none' }} />
      <span style={{ fontWeight: 'var(--fw-medium)' }}>{k.label}</span>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{KIND_TOTAL[kind].toLocaleString()} 条</span>
      <span style={{ flex: 1 }} />
      <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>Backspace 返回</span>
    </button>
  );
}

function Row({ icon, ai, title, hint, on, onHover, onClick, arrow, recent }) {
  return (
    <button type="button" onMouseEnter={onHover} onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%', height: 34,
        padding: '0 var(--space-5)', border: 0, borderRadius: 'var(--radius-xs)',
        background: on ? 'var(--surface-hover)' : 'transparent',
        font: 'inherit', fontSize: 'var(--fs-13)', textAlign: 'left', cursor: 'pointer',
        color: 'var(--text-primary)', transition: 'var(--transition-control)',
      }}>
      <Icon name={icon} size={14} style={{ color: ai ? 'var(--status-ai-fg)' : 'var(--text-tertiary)', flex: 'none' }} />
      <span style={{ flex: 'none', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
      {recent ? <span style={{ flex: 'none', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', padding: '1px 5px', borderRadius: 'var(--radius-xs)', background: 'var(--surface-subtle, var(--neutral-100))' }}>最近</span> : null}
      <span style={{ flex: 1, minWidth: 0, textAlign: 'right', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hint}</span>
      {arrow ? <Icon name="chevron-right" size={13} style={{ color: 'var(--text-tertiary)', flex: 'none' }} /> : null}
    </button>
  );
}

/* 面板自带搜索框。它和输入框里 @ 后面的字是同一份内容 —— 在哪边打都行，
   两边同步。打开面板即聚焦到这里，手不用先回到正文再删字。 */
function SearchRow({ value, onChange, kind }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.focus(); }, [kind]);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)', height: 40, flex: 'none',
      padding: '0 var(--space-5)',
      borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)',
    }}>
      <Icon name="search" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
      <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={kind ? '在' + MENTION_KINDS[kind].label + '中搜索' : '搜索智能体、广告、商品、素材…'}
        style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', font: 'inherit', fontSize: 'var(--fs-13)', color: 'var(--text-primary)' }} />
      {value ? (
        <button type="button" aria-label="清空" onClick={() => onChange('')}
          style={{ display: 'inline-flex', border: 0, background: 'transparent', padding: 2, cursor: 'pointer', color: 'var(--text-tertiary)', flex: 'none' }}>
          <Icon name="x" size={13} />
        </button>
      ) : null}
    </div>
  );
}

/* 分类放到面板顶上的 tag 条：当前筛的是哪一类、还能筛哪些，一眼就看到，
   不用先滚到列表里找那行「查看全部」。切换不改面板尺寸，位置不会窜。 */
function TagBar({ scope, setScope }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 'none', flexWrap: 'nowrap',
      padding: 'var(--space-4) var(--space-5)',
      borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)',
    }}>
      {KIND_ORDER.map((k) => ({ id: k, label: MENTION_KINDS[k].label, icon: MENTION_KINDS[k].icon, ai: MENTION_KINDS[k].ai })).map((t) => {
        const on = scope === t.id;
        return (
          <button key={t.id} type="button" onClick={() => setScope(t.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', flex: 'none', height: 26,
              padding: '0 var(--space-4)', borderRadius: 999,
              borderWidth: 1, borderStyle: 'solid', borderColor: on ? 'var(--action-primary-bg)' : 'var(--border-default)',
              background: on ? 'var(--action-primary-bg)' : 'transparent',
              color: on ? 'var(--action-primary-fg)' : 'var(--text-secondary)',
              font: 'inherit', fontSize: 'var(--fs-12)', whiteSpace: 'nowrap', cursor: 'pointer', outline: 'none',
              transition: 'var(--transition-control)',
            }}>
            {t.icon ? <Icon name={t.icon} size={12} style={{ color: on ? 'var(--action-primary-fg)' : t.ai ? 'var(--status-ai-fg)' : 'var(--text-tertiary)', flex: 'none' }} /> : null}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

const Head = ({ children }) => (
  <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-3)', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{children}</div>
);

function MentionPicker({ anchor, query, setQuery, scope, setScope, onPick, onClose }) {
  const [cursor, setCursor] = React.useState(0);
  const q = query.trim().toLowerCase();
  const match = (m) => !q || m.label.toLowerCase().includes(q);
  /* 没有「全部」这个档 —— 面板一打开就停在第一类上，直接看到具体对象。 */
  const active = scope || KIND_ORDER[0];

  /* 面板上每一行都进这张扁平表，键盘导航只认它。 */
  const rows = React.useMemo(() => {
    /* 单类里也只渲染前 SCOPE_CAP 条：一千多行一次性挂上去，面板会卡。
       其余靠继续输入收窄 —— 翻一千行本来也不是找东西的办法。
       最近引用不单独成组 —— 排在当前类型列表的最前面。 */
    const top = RECENT.filter((m) => m.kind === active && match(m));
    const keys = new Set(top.map((m) => m.label));
    const rest = MENTIONABLE.filter((m) => m.kind === active && match(m) && !keys.has(m.label));
    const out = top.map((m) => ({ type: 'pick', m, recent: true }))
      .concat(rest.slice(0, SCOPE_CAP).map((m) => ({ type: 'pick', m })));
    if (rest.length > SCOPE_CAP) out.push({ type: 'note', text: '还有 ' + (rest.length - SCOPE_CAP).toLocaleString() + ' 条，继续输入以缩小范围' });
    return out;
  }, [q, active]);

  React.useEffect(() => { setCursor(0); }, [q, active]);

  const run = React.useCallback((r) => {
    if (r.type === 'pick') onPick(r.m); else setScope(r.kind);
  }, [onPick, setScope]);

  React.useEffect(() => {
    const key = (e) => {
      const last = rows.filter((r) => r.type !== 'note').length - 1;
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(last, c + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
      else if (e.key === 'Enter' || e.key === 'Tab') { if (rows[cursor]) { e.preventDefault(); run(rows[cursor]); } }
    };
    document.addEventListener('keydown', key, true);
    return () => document.removeEventListener('keydown', key, true);
  }, [rows, cursor, run]);

  return (
    /* 高度写死。内容一多一少就改高度的话，面板是向上展开的，顶边会跟着上下窜 ——
       点进一类再返回，列表整个错位。宁可留白，也要让它待在原地。 */
    <AnchoredPanel anchor={anchor} onClose={onClose} style={{ width: 480, height: 380, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
      <SearchRow value={query} onChange={setQuery} kind={active} />
      <TagBar scope={active} setScope={setScope} />
      <div className="huitou-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--space-2)' }}>
        {rows.length === 0 ? (
          <div style={{ display: 'grid', placeItems: 'center', height: '100%', fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)' }}>没有匹配「{query}」的对象</div>
        ) : rows.map((r, i) => {
          const on = i === cursor;
          if (r.type === 'note') {
            return <div key="note" style={{ padding: 'var(--space-5)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', textAlign: 'center' }}>{r.text}</div>;
          }
          if (r.type === 'scope') {
            const k = MENTION_KINDS[r.kind];
            return (
              <React.Fragment key={'s' + r.kind}>
                <Row icon={k.icon} ai={k.ai} on={on} arrow
                  title={r.more ? '在' + k.label + '中查看全部' : k.label}
                  hint={(r.more || KIND_TOTAL[r.kind]).toLocaleString() + ' 条'}
                  onHover={() => setCursor(i)} onClick={() => run(r)} />
              </React.Fragment>
            );
          }
          const k = MENTION_KINDS[r.m.kind];
          return (
            <React.Fragment key={r.m.kind + r.m.label}>
              <Row icon={k.icon} ai={k.ai} on={on} recent={r.recent} title={r.m.label} hint={r.m.hint}
                onHover={() => setCursor(i)} onClick={() => run(r)} />
            </React.Fragment>
          );
        })}
      </div>
    </AnchoredPanel>
  );
}

function Composer({ draft, setDraft, mentions, setMentions, onSend, onPrompt, compact, pending, queue = [], onQueueRemove, onQueuePromote, onQueueClear, onQueueEdit }) {
  const [focus, setFocus] = React.useState(false);
  const [at, setAt] = React.useState(null);   // 草稿里 @ 的下标，null 表示面板关着
  const [scope, setScope] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [preview, setPreview] = React.useState(null);
  const [dragging, setDragging] = React.useState(false);
  const box = React.useRef(null);
  const input = React.useRef(null);
  const picker = React.useRef(null);
  const seq = React.useRef(0);

  /* 上传只在原型里模拟：进度跑到底就完成，超限或格式不对直接落到失败态。
     失败要写清楚原因 —— 只说「上传失败」的话，人只能靠猜决定要不要重试。 */
  const runUpload = React.useCallback((id) => {
    const tick = () => setFiles((list) => {
      const f = list.find((x) => x.id === id);
      if (!f || f.status !== 'uploading') return list;
      const p = f.progress + 12 + Math.random() * 18;
      if (p >= 100) return list.map((x) => (x.id === id ? Object.assign({}, x, { status: 'ready', progress: 100 }) : x));
      setTimeout(tick, 180);
      return list.map((x) => (x.id === id ? Object.assign({}, x, { progress: p }) : x));
    });
    setTimeout(tick, 180);
  }, []);

  const accept = React.useCallback((incoming) => {
    const added = Array.from(incoming).map((f) => {
      const id = 'f' + (seq.current += 1);
      const bad = f.size > MAX_BYTES ? '超过 20MB' : OK_EXT.test(f.name) ? null : '格式不支持';
      /* 图片当场生成本地预览地址，不等上传回链接 —— 传的过程里就该看得见自己传了什么。 */
      const thumb = !bad && /^image\//.test(f.type) ? URL.createObjectURL(f) : null;
      return { id, name: f.name, size: f.size, thumb, status: bad ? 'error' : 'uploading', progress: 0, error: bad };
    });
    setFiles((list) => list.concat(added));
    added.filter((f) => f.status === 'uploading').forEach((f) => runUpload(f.id));
  }, [runUpload]);

  const retry = React.useCallback((id) => {
    setFiles((list) => list.map((x) => (x.id === id ? Object.assign({}, x, { status: 'uploading', progress: 0, error: null }) : x)));
    runUpload(id);
  }, [runUpload]);

  /* 随内容长高：compact 时 2 行起、常态 3 行起，到 8 行封顶再出滚动条。
     量高度前先把 height 归零，否则删字时读到的还是上一次撑出来的高度。 */
  const MIN_ROWS = compact ? 2 : 3;
  const MAX_ROWS = 8;
  /* 手动拖过高度后就以拖出来的值为准（px），双击把手回到自动。 */
  const [manualH, setManualH] = React.useState(null);
  const metrics = React.useCallback(() => {
    const el = input.current; if (!el) return null;
    const cs = getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || 20;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    /* 元素是 content-box，height 只算内容高 —— scrollHeight 含内边距，量完要减掉，
       否则最小高与封顶都会各多出一行。 */
    return { el, pad, min: line * MIN_ROWS, auto: line * MAX_ROWS, hard: Math.max(line * MIN_ROWS, window.innerHeight * 0.5) };
  }, [MIN_ROWS]);

  React.useLayoutEffect(() => {
    const m = metrics(); if (!m) return;
    const { el, pad, min, auto, hard } = m;
    if (manualH != null) {
      const h = Math.min(Math.max(manualH, min), hard);
      el.style.height = h + 'px';
      el.style.overflowY = 'auto';
      return;
    }
    el.style.height = 'auto';
    const next = Math.min(Math.max(el.scrollHeight - pad, min), auto);
    el.style.height = next + 'px';
    el.style.overflowY = next >= auto ? 'auto' : 'hidden';
  }, [draft, manualH, metrics]);

  /* 上边缘往上拖 = 变高。拖动期间锁住选中与光标，不然会顺手选到正文。 */
  const onGrabTop = React.useCallback((e) => {
    const m = metrics(); if (!m) return;
    e.preventDefault();
    const { el, min, hard } = m;
    const startY = e.clientY;
    const startH = el.getBoundingClientRect().height - (parseFloat(getComputedStyle(el).paddingTop) + parseFloat(getComputedStyle(el).paddingBottom));
    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    const move = (ev) => setManualH(Math.min(Math.max(startH + (startY - ev.clientY), min), hard));
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }, [metrics]);

  const query = at == null ? '' : draft.slice(at + 1);
  /* 面板搜索框与正文里 @ 后面的字是同一份内容，写回草稿即可，不另存一份状态。 */
  const setQuery = React.useCallback((v) => {
    if (at == null) return;
    setDraft(draft.slice(0, at + 1) + v.replace(/\s+/g, ' ').trimStart());
  }, [at, draft, setDraft]);
  const closePicker = React.useCallback(() => { setAt(null); setScope(null); }, []);

  const add = React.useCallback((m) => {
    setMentions((list) => (list.some((x) => x.kind === m.kind && x.label === m.label) ? list : list.concat(m)));
    setDraft(at == null ? draft : draft.slice(0, at));
    setAt(null); setScope(null);
    if (input.current) input.current.focus();
  }, [at, draft, setDraft, setMentions]);

  /* 只在 @ 位于词首时算触发（前面是空白或行首）—— 邮箱、账号名里的 @ 不该弹面板。 */
  const onType = (e) => {
    const v = e.target.value;
    setDraft(v);
    const caret = e.target.selectionStart;
    const head = v.slice(0, caret);
    const i = head.lastIndexOf('@');
    const ok = i >= 0 && (i === 0 || /\s/.test(head[i - 1])) && !/\s/.test(head.slice(i + 1));
    setAt(ok ? i : null);
    if (!ok) setScope(null);
  };

  return (
    <div style={{
      flex: 'none',
      padding: compact ? 'var(--space-5) var(--space-8) var(--space-6)' : 'var(--space-6) var(--space-8) var(--space-8)',
      /* 渐变只占最上缘一小段，指令胶囊及以下全为实色，正文不会从背后透出 */
      background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0, var(--neutral-0) 16px)',
    }}>
      <div style={{ maxWidth: 'var(--layout-max-chat-composer)', margin: '0 auto' }}><PromptBar onPrompt={onPrompt} compact={compact} /></div>
      {queue.length ? (
        <div style={{ maxWidth: 'var(--layout-max-chat-composer)', margin: '0 auto var(--space-4)' }}>
          <PromptQueue items={queue} visible={compact ? 2 : 3}
            note={pending ? '当前回答结束后依次发送' : '正在发送队首…'}
            onRemove={onQueueRemove} onPromote={onQueuePromote} onClear={onQueueClear} onEdit={onQueueEdit} />
        </div>
      ) : null}
      <input ref={picker} type="file" multiple hidden onChange={(e) => { accept(e.target.files); e.target.value = ''; }} />
      <div ref={box}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => { if (!box.current.contains(e.relatedTarget)) setDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files); }}
        style={{
        position: 'relative',
        maxWidth: 'var(--layout-max-chat-composer)', margin: '0 auto', background: 'var(--neutral-0)',
        border: '1px solid', borderColor: dragging ? 'var(--border-focus)' : focus ? 'var(--border-strong)' : 'var(--border-default)',
        borderRadius: 'var(--radius-xl)', padding: compact ? 'var(--space-4) var(--space-5) var(--space-3)' : 'var(--space-5) var(--space-5) var(--space-4)',
        transition: 'var(--transition-control)',
      }}>
        {/* 上边缘拖高把手：命中区跨出边框一点，指针不用瞄得那么准 */}
        <div onPointerDown={onGrabTop} onDoubleClick={() => setManualH(null)}
          title="拖动调整高度 · 双击恢复自动"
          onMouseEnter={(e) => { e.currentTarget.firstChild.style.opacity = 1; }}
          onMouseLeave={(e) => { e.currentTarget.firstChild.style.opacity = 0; }}
          style={{
            position: 'absolute', left: 24, right: 24, top: -6, height: 12, zIndex: 3,
            cursor: 'ns-resize', display: 'grid', placeItems: 'center', touchAction: 'none',
          }}>
          <span style={{ width: 36, height: 3, borderRadius: 999, background: 'var(--border-strong)', opacity: 0, transition: 'opacity var(--duration-fast, .12s) ease' }} />
        </div>
        {dragging ? (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, display: 'grid', placeItems: 'center', pointerEvents: 'none',
            background: 'var(--surface-overlay-soft, rgba(255,255,255,.86))',
            borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-focus)',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>
              <Icon name="upload" size={14} />松开即上传 · 单个不超过 20MB
            </span>
          </div>
        ) : null}
        {/* 附件与引用分两行：一个是「我带了什么文件」，一个是「我在问哪个对象」，
            混在一排里，胶囊长得又像，扫一眼分不出哪个是哪个。附件在上，离回形针近。 */}
        {files.length ? (
          <div className="huitou-scroll" style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)',
            flexWrap: compact ? 'nowrap' : 'wrap', overflowX: compact ? 'auto' : 'visible',
          }}>
            {files.map((f) => (
              <FileCard key={f.id} name={f.name} size={f.size} thumb={f.thumb} status={f.status} progress={f.progress} error={f.error}
                onOpen={f.thumb ? () => setPreview(f) : undefined}
                onRetry={() => retry(f.id)} onRemove={() => setFiles(files.filter((x) => x.id !== f.id))} />
            ))}
          </div>
        ) : null}
        {mentions.length ? (
          <div className="huitou-scroll" style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)',
            flexWrap: compact ? 'nowrap' : 'wrap', overflowX: compact ? 'auto' : 'visible',
          }}>
            {mentions.map((m, i) => (
              <MentionChip key={m.kind + m.label} kind={m.kind} label={m.label}
                onRemove={() => setMentions(mentions.filter((_, j) => j !== i))} />
            ))}
          </div>
        ) : null}
        <textarea
          ref={input} value={draft} onChange={onType}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onPaste={(e) => { const f = e.clipboardData && e.clipboardData.files; if (f && f.length) { e.preventDefault(); accept(f); } }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && at != null) { e.preventDefault(); if (scope) setScope(null); else setAt(null); return; }
            /* 面板开着时 Enter 归它用来插入引用，不发送。 */
            if (e.key === 'Enter' && !e.shiftKey && at == null) { e.preventDefault(); onSend(); }
          }}
          rows={MIN_ROWS} placeholder="向 HUITOU 提问，或用 @ 引用智能体、广告、商品、素材"
          className="huitou-scroll"
          style={{ display: 'block', width: '100%', border: 0, outline: 'none', resize: 'none', boxSizing: 'content-box', font: 'inherit', fontSize: 'var(--fs-14)', lineHeight: 'var(--lh-normal)', color: 'var(--text-primary)', background: 'transparent', padding: 'var(--space-3) var(--space-4)' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <IconButton icon="paperclip" label="上传附件" onClick={() => picker.current && picker.current.click()} />
          <span style={{ width: 1, height: 14, background: 'var(--border-default)' }} />
          <IconButton icon="at-sign" label="引用对象" onClick={() => {
            if (at != null) { setAt(null); setScope(null); return; }
            const next = draft && !/\s$/.test(draft) ? draft + ' @' : draft + '@';
            setDraft(next); setAt(next.length - 1);
            if (input.current) input.current.focus();
          }} />
          {mentions.length ? (
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>已引用 {mentions.length}</span>
          ) : null}
          <div style={{ flex: 1 }} />
          <IconButton icon="mic" label="语音输入" />
          {/* 生成中点发送 = 加入队列：换图标与次级底色，说明这一下不会打断当前回答 */}
          <button type="button" aria-label={pending ? '加入队列' : '发送'} title={pending ? '加入队列，当前回答结束后发送' : '发送'} onClick={onSend}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: 0, borderRadius: 'var(--radius-pill)',
              backgroundColor: pending ? 'var(--neutral-100)' : 'var(--action-primary-bg)',
              color: pending ? 'var(--text-secondary)' : 'var(--action-primary-fg)',
              cursor: 'pointer', transition: 'var(--transition-control)' }}>
            <Icon name={pending ? 'list-plus' : 'arrow-up'} size={17} />
          </button>
        </div>
      </div>
      {preview ? (
        <Dialog open title={preview.name} description={formatSize(preview.size)} width={720} onClose={() => setPreview(null)}>
          <div style={{ display: 'grid', placeItems: 'center', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
            <img src={preview.thumb} alt={preview.name} style={{ maxWidth: '100%', maxHeight: '58vh', display: 'block', borderRadius: 'var(--radius-xs)' }} />
          </div>
        </Dialog>
      ) : null}
      {at != null ? <MentionPicker anchor={box} query={query} setQuery={setQuery} scope={scope} setScope={setScope} onPick={add} onClose={closePicker} /> : null}
    </div>
  );
}

Object.assign(window, { ChatScreen });
})();
