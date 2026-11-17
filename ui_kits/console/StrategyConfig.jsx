(() => {
const { Icon, Button, Badge, Card, Switch, Tag, Input, FilterSelect, Dialog, FormField, Select, EmptyState, Divider } = window.HUITOUAIDesignSystem_52606d;

/* 策略配置 —— AI 决策的来源。队列里每一条决策都由某条策略触发，
   所以策略页要能回答两件事：这条规则什么时候会开火、开火后 AI 能自己动到什么程度。
   规则写成一句可读的句子（当…持续…则…），比一堆下拉框更快让人判断对错。 */

const MODES = {
  auto: { label: '自动执行', tone: 'ai', hint: '命中即执行，事后通知' },
  suggest: { label: '仅建议', tone: 'neutral', hint: '进入队列，等你确认' },
};

const STRATEGIES = [
  {
    id: 'st-01', name: '转化成本超标预警', scope: '全部广告计划', mode: 'auto', on: true,
    when: ['转化成本 连续 2 小时 高于 目标 CPA × 1.2', '当日消耗 ≥ ¥500'],
    then: '出价下调 10%，单日最多 2 次',
    guard: ['单计划日降幅 ≤ 25%', 'CPA 恶化 > 15% 自动回滚'],
    stat: { fire: 42, adopt: 38, effect: '省 ¥12,480' },
  },
  {
    id: 'st-02', name: 'CTR 高位扩量', scope: '巨量千川 · 商品广告', mode: 'suggest', on: true,
    when: ['CTR 高于同类计划 P75', 'ROI ≥ 3.0 持续 3 天'],
    then: '日预算上调 20%',
    guard: ['单日预算变动上限 25%', '仅 09:00–23:00 生效'],
    stat: { fire: 28, adopt: 19, effect: '增收 ¥26,100' },
  },
  {
    id: 'st-03', name: '素材衰退下线', scope: '全部素材', mode: 'suggest', on: true,
    when: ['完播率 7 日环比下降 > 30%', '曝光 ≥ 50,000'],
    then: '暂停投放并推荐 2 条替换素材',
    guard: ['单日下线不超过 5 条', '新素材需人工确认'],
    stat: { fire: 17, adopt: 14, effect: '省 ¥4,860' },
  },
  {
    id: 'st-04', name: '低效时段收缩', scope: '腾讯营销 · 朋友圈', mode: 'suggest', on: false,
    when: ['时段 ROI 低于账户均值 50%', '连续 5 日成立'],
    then: '关闭该时段投放',
    guard: ['不触碰大促期间的时段设置'],
    stat: { fire: 6, adopt: 2, effect: '省 ¥1,120' },
  },
];

function StrategyConfig({ onToast }) {
  const [items, setItems] = React.useState(STRATEGIES);
  const [q, setQ] = React.useState('');
  const [mode, setMode] = React.useState('全部方式');
  const [edit, setEdit] = React.useState(null);
  const [auto, setAuto] = React.useState(true);

  const toggle = (id) => setItems((l) => l.map((x) => x.id === id ? { ...x, on: !x.on } : x));
  const rows = items.filter((x) => (!q || x.name.includes(q) || x.scope.includes(q))
    && (mode === '全部方式' || MODES[x.mode].label === mode));

  return (
    <>
      {/* 全局护栏在最上：它是所有策略的上限，比单条策略更该先被看到 */}
      <Card title="全局护栏" subtitle="所有策略都不得越过的边界" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
          <Switch checked={auto} onChange={setAuto} label="允许自动执行"
            description={auto ? '标记为「自动执行」的策略命中后直接生效' : '全部策略降级为仅建议，命中只进队列'} />
          <FormField label="单日预算变动上限" hint="按广告计划计">
            <Input defaultValue="25" suffix="%" style={{ maxWidth: 160 }} />
          </FormField>
          <FormField label="每日自动决策上限" hint="超出后转为建议">
            <Input defaultValue="20" suffix="条" style={{ maxWidth: 160 }} />
          </FormField>
          <FormField label="观察期" hint="执行后监控多久再判定成败">
            <Select defaultValue="72 小时" options={['24 小时', '48 小时', '72 小时', '7 天']} style={{ maxWidth: 160 }} />
          </FormField>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
        <Input placeholder="搜索策略名称或适用范围" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 268 }} />
        <FilterSelect value={mode} onChange={setMode} width={140}
          options={['全部方式', '自动执行', '仅建议'].map((o) => ({ label: o }))} />
        <div style={{ flex: 1 }} />
        <Button variant="secondary" iconLeft="plus" onClick={() => setEdit({ name: '', scope: '', mode: 'suggest' })}>新建策略</Button>
      </div>

      {rows.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {rows.map((s) => <StrategyRow key={s.id} s={s} globalAuto={auto} onToggle={() => toggle(s.id)} onEdit={() => setEdit(s)} />)}
        </div>
      ) : (
        <Card><EmptyState icon="search-x" title="没有符合条件的策略" description="换个关键词，或把筛选条件放宽。" compact /></Card>
      )}

      <Dialog open={!!edit} title={edit && edit.id ? '编辑策略' : '新建策略'}
        description="改动保存后对新触发的决策生效，已在队列中的不受影响。"
        onClose={() => setEdit(null)}
        footer={<>
          <Button variant="secondary" onClick={() => setEdit(null)}>取消</Button>
          <Button variant="primary" onClick={() => { setEdit(null); onToast && onToast(); }}>保存</Button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <FormField label="策略名称"><Input defaultValue={edit ? edit.name : ''} placeholder="例如：转化成本超标预警" /></FormField>
          <FormField label="适用范围"><Input defaultValue={edit ? edit.scope : ''} placeholder="全部广告计划" /></FormField>
          <FormField label="执行方式" hint="自动执行仍受全局护栏约束">
            <Select defaultValue={edit ? MODES[edit.mode].label : '仅建议'} options={['仅建议', '自动执行']} />
          </FormField>
        </div>
      </Dialog>
    </>
  );
}

function StrategyRow({ s, globalAuto, onToggle, onEdit }) {
  const m = MODES[s.mode];
  /* 全局关掉自动执行时，标着「自动执行」的策略实际只会给建议 —— 必须在卡上说出来，
     否则用户以为它还在自己动手。 */
  const downgraded = s.mode === 'auto' && !globalAuto;
  return (
    <Card padded={false} style={{ opacity: s.on ? 1 : 0.6 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', padding: 'var(--space-6) var(--gutter-card)' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>{s.name}</span>
            <Badge tone={downgraded ? 'neutral' : m.tone}>{downgraded ? '仅建议（全局已关自动）' : m.label}</Badge>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{s.scope}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <RuleLine kw="当" items={s.when} />
            <RuleLine kw="则" items={[s.then]} strong />
            <RuleLine kw="但" items={s.guard} muted />
          </div>
        </div>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <Switch checked={s.on} onChange={onToggle} />
          <Button variant="ghost" iconLeft="settings-2" onClick={onEdit}>编辑</Button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', padding: 'var(--space-4) var(--gutter-card)', borderTop: '1px solid var(--border-subtle)', background: 'var(--neutral-25)', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-tertiary)' }}>近 30 天</span>
        <Stat label="触发" value={s.stat.fire + ' 次'} />
        <Stat label="采纳" value={s.stat.adopt + ' 次'} />
        <Stat label="累计效果" value={s.stat.effect} />
      </div>
    </Card>
  );
}

function RuleLine({ kw, items, strong, muted }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--fs-13)', lineHeight: 'var(--lh-normal)' }}>
      <span style={{ flex: 'none', width: 16, color: 'var(--text-tertiary)' }}>{kw}</span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-4)', color: muted ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: strong ? 'var(--fw-medium)' : 'var(--fw-regular)' }}>
        {items.map((t, i) => <span key={i}>{t}{i < items.length - 1 ? '，' : ''}</span>)}
      </span>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </span>
  );
}

Object.assign(window, { StrategyConfig, HUITOU_STRATEGIES: STRATEGIES });
})();
