(() => {
const { Card, Button, Badge, Icon, IconButton, Checkbox, StatusDot, StatDelta, ProgressBar, EmptyState, Divider, DropdownMenu, Dialog, Input, FormField, Select } = window.HUITOUAIDesignSystem_52606d;
const { TableFrame, StickyFooter, rowHoverProps } = window;

/* 批次列表：矩阵的后半程。建完不是结束 —— 跑一段、留好的、关停差的、让 AI 学走。
   每批一张卡，按与目标 CPA 的差距分三档；点任一行看这条单元的完整参数。 */

const BATCHES = [
  {
    id: 'B3', name: '秋新品 · 第一轮', created: '3 天前', day: 3, span: 7, cpaTarget: 40,
    plans: [
      { id: 'p1', name: '藤椒味复购客 · 一口脆到底 · 朋友圈 · ¥36', spend: 4120, conv: 128, cpa: 32.2 },
      { id: 'p2', name: '近 30 天加购未购 · 0 泡发 · 朋友圈 · ¥36', spend: 3980, conv: 104, cpa: 38.3 },
      { id: 'p3', name: '藤椒味复购客 · 0 泡发 · 视频号 · ¥32', spend: 2760, conv: 61, cpa: 45.2 },
      { id: 'p4', name: '近 30 天加购未购 · 一口脆到底 · 视频号 · ¥40', spend: 3510, conv: 52, cpa: 67.5 },
      { id: 'p5', name: '零食兴趣泛人群 · 办公室零嘴 · 朋友圈 · ¥40', spend: 5240, conv: 58, cpa: 90.3 },
      { id: 'p6', name: '虎皮凤爪高价值客 · 一口脆到底 · 视频号 · ¥36', spend: 1180, conv: 34, cpa: 34.7 },
    ],
    learned: '朋友圈 + 复购客的组合连续 3 天 CPA 低于目标 20%，AI 已把它写进下一轮的起始参数。',
  },
  {
    id: 'B2', name: '618 大促 · 第二轮', created: '12 天前', day: 7, span: 7, cpaTarget: 45,
    plans: [
      { id: 'q1', name: '竞品浏览人群 · 晚八点解馋 · 朋友圈 · ¥40', spend: 8600, conv: 214, cpa: 40.2 },
      { id: 'q2', name: '零食兴趣泛人群 · 一次囤够 · 小程序 · ¥36', spend: 6120, conv: 96, cpa: 63.8 },
      { id: 'q3', name: '藤椒味复购客 · 晚八点解馋 · 视频号 · ¥36', spend: 5480, conv: 141, cpa: 38.9 },
    ],
    learned: '晚八点口播在两个人群上都好于快剪，AI 已调高该素材在下一轮的初始权重。',
  },
];

/* 三档：好于目标 15% 以上留下加量，超出目标 30% 以上关停，中间的继续观察。
   阈值写在这里而不是散在渲染里 —— 三处（角标、行内建议、页脚计数）必须用同一条线。 */
const verdictOf = (cpa, target) => (cpa <= target * 0.85 ? 'keep' : cpa >= target * 1.3 ? 'stop' : 'watch');
const VERDICT = {
  keep: { label: '建议保留', tone: 'success', act: '加预算' },
  watch: { label: '继续观察', tone: 'neutral', act: '' },
  stop: { label: '建议关停', tone: 'danger', act: '关停' },
};

function BatchesView({ fresh, onlyPending }) {
  const [open, setOpen] = React.useState(BATCHES[0].id);
  /* 最新批准的一批排最上 */
  const created = (fresh || []).slice().sort((a, b) => b.approvedAt - a.approvedAt);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      {created.map((snap) => <PendingBatch key={snap.id} snap={snap} />)}
      {onlyPending ? null : BATCHES.map((b) => <BatchCard key={b.id} batch={b} open={open === b.id} onToggle={() => setOpen(open === b.id ? null : b.id)} />)}
    </div>
  );
}

/* 刚批准的一批：批准即在列表里长出来，先是「创建中」，核验通过后逐条变成「在投」。
   数据还没有，花费 / 转化 / CPA 给「—」而不是 0 —— 0 会被读成「投了但没效果」。 */
function PendingBatch({ snap }) {
  const plans = snap.plans;
  const [live, setLive] = React.useState(0);
  React.useEffect(() => {
    /* 逐条上线，间隔 600ms，看得出是一条条建出来的 */
    if (live >= plans.length) return;
    const t = setTimeout(() => setLive(live + 1), live ? 600 : 1400);
    return () => clearTimeout(t);
  }, [live, plans.length]);
  const batch = {
    id: snap.id, name: snap.name, created: '刚刚', day: 0, span: 7,
    cpaTarget: snap.cpaTarget, fresh: true,
    /* 保留方案原字段（from / to / verify / bid / budget）—— 详情要显示这条单元自己的参数，不是默认值 */
    plans: plans.map((p, i) => Object.assign({}, p, { spend: 0, conv: 0, cpa: null, state: i < live ? '在投' : '创建中' })),
    learned: live < plans.length
      ? '正在提交腾讯创建，配置核验通过后自动开启。'
      : '已全部开启。观察期 7 天，首日报告明早 08:00；任一条 3 天无消耗会提醒你回滚出价。',
  };
  return <BatchCard batch={batch} open onToggle={() => {}} />;
}

function BatchCard({ batch, open, onToggle }) {
  const [picked, setPicked] = React.useState([]);
  const [detail, setDetail] = React.useState(null);   // 点行看单条营销单元的完整参数
  const spend = batch.plans.reduce((s, p) => s + p.spend, 0);
  const conv = batch.plans.reduce((s, p) => s + p.conv, 0);
  const cpa = conv ? spend / conv : 0;
  const fresh = !!batch.fresh;
  const counts = fresh ? {} : batch.plans.reduce((m, p) => {
    const v = verdictOf(p.cpa, batch.cpaTarget);
    return Object.assign(m, { [v]: (m[v] || 0) + 1 });
  }, {});
  const liveN = batch.plans.filter((p) => p.state === '在投').length;

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.concat(id)));

  const th = {
    padding: '10px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap',
    fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = { padding: 'var(--space-5) var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' };
  const num = Object.assign({}, td, { fontVariantNumeric: 'tabular-nums', textAlign: 'right' });

  return (
    <Card padded={false}>
      {/* 卡头就是这批的全部结论：跑了几天、整批 CPA 与目标的关系、三档各几条 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-6) var(--gutter-card)', minWidth: 0, flexWrap: 'wrap' }}>
        <button type="button" onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: '1 1 240px', minWidth: 0, padding: 0, border: 0, background: 'none', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
          <Icon name="chevron-right" size={14} style={{ flex: 'none', color: 'var(--text-tertiary)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--duration-fast, .12s) var(--ease-standard)' }} />
          <span style={{ minWidth: 0, fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{batch.name}</span>
          <Badge tone="neutral">{batch.plans.length} 条</Badge>
        </button>
        <span style={{ flex: 'none', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          观察期 {batch.day}/{batch.span} 天 · {batch.created}创建
        </span>
        {fresh ? (
          <span style={{ flex: 'none', display: 'flex', gap: 'var(--space-5)' }}>
            {liveN < batch.plans.length
              ? <StatusDot tone="warning" label={'创建中 ' + liveN + ' / ' + batch.plans.length} pulse style={{ fontSize: 'var(--fs-12)' }} />
              : <StatusDot tone="success" label={'在投 ' + liveN + ' 条'} style={{ fontSize: 'var(--fs-12)' }} />}
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>目标 CPA ¥{batch.cpaTarget}</span>
          </span>
        ) : <>
          <span style={{ flex: 'none', display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>整批 CPA</span>
            <span style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', color: cpa <= batch.cpaTarget ? 'var(--status-success-fg)' : 'var(--status-danger-fg)' }}>¥{cpa.toFixed(1)}</span>
            <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>/ 目标 ¥{batch.cpaTarget}</span>
          </span>
          <span style={{ flex: 'none', display: 'flex', gap: 'var(--space-5)' }}>
            {['keep', 'watch', 'stop'].map((k) => (counts[k] ? <StatusDot key={k} tone={VERDICT[k].tone} label={VERDICT[k].label + ' ' + counts[k]} style={{ fontSize: 'var(--fs-12)' }} /> : null))}
          </span>
        </>}
      </div>

      {open ? <>
        <TableFrame>{(fz) => (
          <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
            <thead>
              <tr>
                <th style={Object.assign({}, th, fz.head(0), fz.headEdge, { width: 40 })} />
                <th style={Object.assign({}, th, { minWidth: 300 })}>计划</th>
                <th style={Object.assign({}, th, { width: 110, textAlign: 'right' })}>花费</th>
                <th style={Object.assign({}, th, { width: 90, textAlign: 'right' })}>转化</th>
                <th style={Object.assign({}, th, { width: 130, textAlign: 'right' })}>CPA</th>
                <th style={Object.assign({}, th, fz.headEnd, { width: 130 })}>{fresh ? '状态' : '建议'}</th>
              </tr>
            </thead>
            <tbody>
              {batch.plans.map((p) => {
                const v = p.cpa == null ? 'watch' : verdictOf(p.cpa, batch.cpaTarget);
                const gap = p.cpa == null ? 0 : ((p.cpa - batch.cpaTarget) / batch.cpaTarget) * 100;
                const dash = { color: 'var(--text-tertiary)' };
                return (
                  <tr key={p.id} {...rowHoverProps('var(--surface-card)')} onClick={() => setDetail(p)}
                    style={{ background: 'var(--surface-card)', cursor: 'pointer' }}>
                    <td style={Object.assign({}, td, fz.cell(0), fz.cellEdge)} onClick={(e) => e.stopPropagation()}><Checkbox checked={picked.includes(p.id)} onChange={() => toggle(p.id)} /></td>
                    <td style={Object.assign({}, td, { maxWidth: 340 })}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
                        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                        {p.dim ? <Badge tone="ai">只改 · {p.dim}</Badge> : null}
                        <Icon name="chevron-right" size={12} style={{ flex: 'none', color: 'var(--text-tertiary)' }} />
                      </span>
                    </td>
                    <td style={Object.assign({}, num, fresh ? dash : null)}>{fresh ? '—' : '¥' + p.spend.toLocaleString()}</td>
                    <td style={Object.assign({}, num, fresh ? dash : null)}>{fresh ? '—' : p.conv}</td>
                    {/* CPA 直接按目标着色，并给出差距 —— 不让人自己拿数去比 */}
                    <td style={num}>
                      {p.cpa == null ? <span style={dash}>—</span> : <>
                        <span style={{ color: v === 'stop' ? 'var(--status-danger-fg)' : v === 'keep' ? 'var(--status-success-fg)' : 'var(--text-primary)' }}>¥{p.cpa.toFixed(1)}</span>
                        <span style={{ marginLeft: 6, fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{gap > 0 ? '+' : ''}{gap.toFixed(0)}%</span>
                      </>}
                    </td>
                    <td style={Object.assign({}, td, fz.cellEnd)}>
                      {fresh
                        ? <StatusDot tone={p.state === '在投' ? 'success' : 'warning'} label={p.state} pulse={p.state !== '在投'} style={{ fontSize: 'var(--fs-12)' }} />
                        : <Badge tone={VERDICT[v].tone}>{VERDICT[v].label}</Badge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}</TableFrame>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', flexWrap: 'wrap' }}>
          <Icon name="sparkles" size={13} style={{ color: 'var(--status-ai-fg)', flex: 'none' }} />
          <span style={{ flex: '1 1 240px', minWidth: 0, fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>{batch.learned}</span>
          {fresh ? <Button variant="ghost" size="sm" iconLeft="arrow-up-right" onClick={() => window.HUITOU_OPEN_RAIL && window.HUITOU_OPEN_RAIL('campaigns')}>在广告投放里查看</Button> : picked.length
            ? <>
                <Button variant="secondary" size="sm" iconLeft="pause">关停选中 {picked.length} 条</Button>
                <Button variant="secondary" size="sm" iconLeft="trending-up">加预算</Button>
              </>
            : <>
                <Button variant="secondary" size="sm" iconLeft="pause" disabled={!counts.stop}>关停 {counts.stop || 0} 条低效</Button>
                <Button variant="primary" size="sm" iconLeft="copy">照优胜组合再建一轮</Button>
              </>}
        </div>
      </> : null}
      <UnitDetail p={detail} batch={batch} onClose={() => setDetail(null)} />
    </Card>
  );
}

/* 单条营销单元的完整参数。按腾讯建单的分区排，读的时候能和后台逐行对上；
   最后一节「为什么这样安排」是这一页与腾讯后台唯一的区别 —— 参数谁都能看，
   为什么这么设只有生成它的人知道，不写下来，回头没人能复盘。 */
function UnitDetail({ p: raw, batch, onClose }) {
  /* 传进来的 p 是父组件的一次性快照，保存后不会自己变 —— 本地叠一层 patch，
     保存时同时写进 store 和这一层，只读行与标题立刻显示改完的值 */
  const [form, setForm] = React.useState(null);
  const [patch, setPatch] = React.useState(null);
  const rawId = raw && raw.id;
  React.useEffect(() => { setForm(null); setPatch(null); }, [rawId]);
  const p = raw ? Object.assign({}, raw, patch || {}) : null;
  if (!p) return null;
  const c = (window.HUITOU_MATRIX || {}).content || {};
  const u = (window.HUITOU_MATRIX || {}).profile || {};
  const fresh = !!batch.fresh;
  const draft = p.state === '草稿';
  const cpaTarget = batch.cpaTarget;
  const v = p.cpa == null ? null : verdictOf(p.cpa, cpaTarget);

  /* 参数写成「标签 + 值」的两列，标签左对齐成一条竖线 —— 原来是一段段自由文字，
     眼睛没有可对齐的边，读一条要从头扫到尾。变量所在的那一行标出来，其余是整批固定值。 */
  const changed = p.verify ? p.dim : null;
  /* 一份字段表，只读与编辑共用 —— 腾讯建单的字段这里要全，缺一项就得回后台补。
     默认值按这条单元的变量算出来，用户改过的存在 store.unitEdits 里覆盖上来。 */
  const DIM_KEY = { 定向: 'audience', 版位: 'placement', 出价类型: 'bidType' };
  const fv = Object.assign({
    name: p.name,
    dateFrom: draft ? '决策通过后次日' : fresh ? '批准后次日' : '已开始',
    dateTo: '长期投放（不设结束日）',
    timeRange: '全天',
    firstDay: '不单独设置',
    tracking: '当前创建接口暂未接入',
    audience: p.dim === '定向' && p.to ? p.to : '手动定向，全国常住，25 至 50 岁，性别不限',
    expand: '开',
    placement: p.dim === '版位' && p.to ? p.to : '智能版位，优先微信公众号与小程序',
    billing: '按展示计费，并按转化效果优化',
    bidType: p.dim === '出价类型' && p.to ? p.to : '稳定拿量',
    bid: String(p.bid || 80),
    budget: String(p.budget || 100),
    boost: '关',
    firstParty: '关',
    creativeDir: p.creative ? p.creative.form + ' · ' + p.creative.ratio : draft ? '待配 —— 下一步在对话里上传素材' : '沿用当前素材',
  }, p.fields || {});

  const editing = !!form;
  const setF = (k, val) => setForm((d) => Object.assign({}, d, { [k]: val }));
  const startEdit = () => setForm(Object.assign({}, fv));
  const save = () => {
    const st = window.HUITOU_MATRIX || {};
    const dimKey = DIM_KEY[p.dim];
    const next = {
      fields: form, name: form.name,
      bid: Number(form.bid) || p.bid, budget: Number(form.budget) || p.budget,
      /* 变量取值跟着对应字段走，否则「本条变量」和参数表会各说各的 */
      to: dimKey ? form[dimKey] : p.dim === '出价' ? '¥' + form.bid : p.to,
    };
    const edits = Object.assign({}, st.unitEdits, { [p.id]: Object.assign({}, st.unitEdits && st.unitEdits[p.id], next) });
    window.setMatrixStore && window.setMatrixStore({ unitEdits: edits });
    setPatch(edits[p.id]);
    setForm(null);
  };

  /* 只读与编辑是同一张表：编辑态把值单元格换成控件，行序与分区不变 —— 另起一张表单会让同一字段出现两次 */
  const groups = [
    { title: '营销单元', rows: [
      ['单元名称', fv.name, 'name'],
      ['投放开始', fv.dateFrom, 'dateFrom'],
      ['投放结束', fv.dateTo, 'dateTo'],
      ['投放时间', fv.timeRange, 'timeRange'],
      ['首日开始时间', fv.firstDay, 'firstDay'],
      ['监测链接组', fv.tracking, 'tracking'],
    ] },
    { title: '定向', dim: '定向', rows: [
      ['定向', fv.audience, 'audience'],
      ['定向拓展', fv.expand, 'expand', 'onoff'],
    ] },
    { title: '投放版位', dim: '版位', rows: [['版位', fv.placement, 'placement']] },
    { title: '出价与预算', dim: p.dim === '出价' ? '出价' : '出价类型', rows: [
      ['计费方式', fv.billing, 'billing'],
      ['出价类型', fv.bidType, 'bidType', 'bidType'],
      ['出价', '¥' + fv.bid, 'bid', 'num'],
      ['一键起量', fv.boost, 'boost', 'onoff'],
      ['一方数据加强', fv.firstParty, 'firstParty', 'onoff'],
      ['日预算', '¥' + fv.budget, 'budget', 'num'],
    ] },
    { title: '创意', dim: '创意', rows: p.creative
      ? [['版式', p.creative.form + ' · ' + p.creative.ratio], ['标题', p.creative.title], ['素材', p.creative.assets.map((m) => m.name).join('、')], ['落地页', p.creative.landing + ' · 行动号召「' + p.creative.cta + '」']]
      : [['素材方向', fv.creativeDir, 'creativeDir']] },
    { title: '腾讯创建情况', rows: p.state === '草稿'
      ? [['状态', '还未提交 —— 本地草稿，决策通过后才会建到腾讯'], ['字段', '按腾讯建单字段对齐，提交后回写核验结果']]
      : fresh
      ? [['状态', p.state === '在投' ? '已创建到腾讯，配置核验与草稿一致' : '正在提交腾讯创建'], ['配置来源', '腾讯实际单元']]
      : [['状态', '已创建并投放中'], ['配置来源', '腾讯实际单元']] },
    { title: '营销内容（整批共用）', rows: [
      ['营销目的', (c.goal || '—') + ' · ' + (c.media || '—')],
      ['推广产品', c.product || '—'],
      ['转化', c.conversion || '—'],
    ] },
  ];

  const why = p.verify
    ? '只改「' + p.dim + '」：' + p.from + ' → ' + p.to + '。验证：' + p.verify + '；其余设置保持不变，这样这一条的结果才能归因到这一个变量上。'
    : '先准备一条信息完整、能够公平比较的新单元；账号原有单元缺少部分定向明细，所以这一轮先看能否获得有效转化，不急着判断哪项设置最好。';

  return (
    <Dialog open width={720} title={p.name}
      description={(draft ? batch.name + ' · 待决策' : fresh ? batch.name + ' · 观察期 0/' + batch.span + ' 天' : batch.name + ' · 观察期 ' + batch.day + '/' + batch.span + ' 天') + ' · 目标 CPA ¥' + cpaTarget}
      onClose={onClose}
      footer={<>
        {editing ? <>
          <Button onClick={() => setForm(null)}>取消</Button>
          <Button variant="primary" iconLeft="check" onClick={save}>保存修改</Button>
        </> : <>
        <Button onClick={onClose}>关闭</Button>
        {draft ? <Button variant="secondary" iconLeft="pencil" onClick={startEdit}>编辑参数</Button> : null}
        {draft
            ? <Button variant="secondary" iconLeft="message-square" onClick={() => { onClose(); window.HUITOU_CHAT_SEND && window.HUITOU_CHAT_SEND('接着建矩阵'); }}>回到对话继续</Button>
            : <Button variant="secondary" iconLeft="arrow-up-right" onClick={() => window.HUITOU_OPEN_RAIL && window.HUITOU_OPEN_RAIL('campaigns')}>在广告投放里查看</Button>}
        {fresh ? null : <Button variant={v === 'stop' ? 'danger' : 'primary'} iconLeft={v === 'stop' ? 'pause' : 'trending-up'}>{v === 'stop' ? '关停这条' : '加预算'}</Button>}
        </>}
      </>}>

      {/* 内容比视口高，这一层自己滚，标题与页脚固定 —— 否则弹窗被垂直居中裁掉两头 */}
      <div className="huitou-scroll" style={{ maxHeight: 'min(60vh, 520px)', overflowY: 'auto', margin: '0 calc(var(--space-5) * -1)', padding: '0 var(--space-5)' }}>
      {/* 有数据的先给数据：参数是死的，跑出来的数才是要判断的 */}
      {p.cpa == null ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)', marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-sm)', background: 'var(--neutral-25)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
          <Icon name="clock" size={13} style={{ flex: 'none' }} />
          <span>{fresh && p.state !== '在投' ? '尚未开始投放，没有数据。' : '已开启，首日数据明早 08:00 汇总。'}</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          {[['花费', '¥' + p.spend.toLocaleString()], ['转化', String(p.conv)], ['CPA', '¥' + p.cpa.toFixed(1)]].map(([k, val], i) => (
            <div key={k} style={{ minWidth: 0 }}>
              <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{k}</div>
              <div style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', marginTop: 2, color: i === 2 ? (v === 'stop' ? 'var(--status-danger-fg)' : v === 'keep' ? 'var(--status-success-fg)' : 'var(--text-primary)') : 'var(--text-primary)' }}>{val}</div>
              {i === 2 ? <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', marginTop: 2 }}>目标 ¥{cpaTarget} · {VERDICT[v].label}</div> : null}
            </div>
          ))}
        </div>
      )}

      {/* 这一条测的是什么，放最上面 —— 原来埋在最后一节，人要读完八组参数才知道该看哪一行 */}
      {p.verify ? (
        <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5) var(--space-6)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)' }}>本条变量</span>
            <Badge>{p.dim}</Badge>
            <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>{p.from}</span>
            <Icon name="arrow-right" size={13} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{p.to}</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}>验证：{p.verify}</div>
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {groups.map((g, gi) => (
          <div key={g.title} style={{ display: 'grid', gridTemplateColumns: '100px minmax(0, 1fr)', gap: '0 var(--space-6)', padding: 'var(--space-5) 0', borderTopWidth: gi ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)' }}>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', paddingTop: 1 }}>{g.title}</div>
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {g.rows.map(([k, val, key, kind]) => {
                const hot = changed && g.dim === changed;
                const edit = editing && key;
                return (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr)', gap: 'var(--space-5)', alignItems: edit ? 'center' : 'start', minHeight: edit ? 34 : 0, minWidth: 0 }}>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{k}</span>
                    {edit ? (
                      <span style={{ minWidth: 0, display: 'flex' }}>
                        {kind === 'onoff'
                          ? <Select size="sm" options={['开', '关']} value={form[key]} onChange={(e) => setF(key, e.target.value)} width={140} />
                          : kind === 'bidType'
                          ? <Select size="sm" options={['稳定拿量', '最大转化量投放', '优先跑量']} value={form[key]} onChange={(e) => setF(key, e.target.value)} width={200} />
                          : <span style={{ flex: 1, minWidth: 0, maxWidth: kind === 'num' ? 140 : 'none' }}>
                              <Input size="sm" style={{ width: '100%' }} value={form[key]} onChange={(e) => setF(key, kind === 'num' ? e.target.value.replace(/[^0-9]/g, '') : e.target.value)} />
                            </span>}
                      </span>
                    ) : (
                      <span style={{ fontSize: 'var(--fs-13)', lineHeight: 'var(--lh-normal)', color: 'var(--text-primary)', fontWeight: hot ? 'var(--fw-medium)' : 'var(--fw-regular)', minWidth: 0, wordBreak: 'break-word' }}>{val}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '100px minmax(0, 1fr)', gap: '0 var(--space-6)', padding: 'var(--space-5) 0 0', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
            <Icon name="sparkles" size={12} style={{ color: 'var(--status-ai-fg)' }} />为什么
          </div>
          <div style={{ fontSize: 'var(--fs-13)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', minWidth: 0 }}>{why}</div>
        </div>
      </div>
      </div>
    </Dialog>
  );
}

Object.assign(window, { BatchesView, MatrixUnitDetail: UnitDetail });
})();
