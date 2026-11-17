(() => {
const { Icon, Button, Badge, Card, Input, Select, FormField, Switch, Tabs, Alert, StatusDot, EmptyState, FilterSelect } = window.HUITOUAIDesignSystem_52606d;
const { FilterBar } = window;

/* 系统设置是组织级的：这里定的是「AI 在所有账户上能做什么、做到什么程度」。
   与它相邻的三处分工 —— 团队管理定「谁能操作」，用户设置定「我个人的偏好」，
   广告投放的「投放设置」定「这一个账户放开到什么程度」。
   按作用域分：会变的（自动化程度）按账户定，不该变的（资金天花板、口径）在这里定。
   最后加审计日志，因为这两项一旦改动，出事时要能查是谁改的。 */

/* 每张卡自己一份状态与基线 —— 共用一份的话，改 A 卡会点亮 B 卡，
   而在 B 卡按重置会把 A 卡的编辑一起冲掉。 */
/* 组织护栏是跨页共享的真值：投放设置要按它校验账户级设置。
   写两份（这里一份、导出一份）必然对不上，所以放模块级，保存时就地更新。 */
const ORG_CAPS = { dayCap: '50000', bidCap: '200', stepPct: '20', minRun: '3' };

function useSection(initial, commit) {
  const [base, setBase] = React.useState(initial);
  const [v, setV] = React.useState(initial);
  const dirty = JSON.stringify(v) !== JSON.stringify(base);
  return {
    v: v, dirty: dirty,
    set: (k) => (val) => setV((s) => Object.assign({}, s, { [k]: val })),
    num: (k) => (e) => setV((s) => Object.assign({}, s, { [k]: e.target.value.replace(/[^0-9]/g, '') })),
    save: () => { setBase(v); commit && commit(v); },
    reset: () => setV(base),
  };
}

/* 一张卡 = 一组设置，页脚统一「保存 / 重置」—— 分散的即时保存在动钱的设置里容易误触 */
function SettingsCard({ title, note, children, dirty, onSave, onReset, readOnly }) {
  return (
    <Card padded={false} style={{ maxWidth: 760, marginBottom: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-6) var(--gutter-card)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)' }}>{title}</span>
        {note ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{note}</span> : null}
        <span style={{ flex: 1 }} />
        {dirty ? <StatusDot tone="warning" label="有未保存的修改" style={{ fontSize: 'var(--fs-12)' }} /> : null}
      </div>
      <div style={{ padding: 'var(--space-6) var(--gutter-card)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>{children}</div>
      {readOnly ? null : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)' }}>
          <Button variant="primary" iconLeft="save" disabled={!dirty} onClick={onSave}>保存</Button>
          <Button variant="ghost" disabled={!dirty} onClick={onReset}>重置</Button>
        </div>
      )}
    </Card>
  );
}

/* 开关行：左侧说清「开了会怎样」，右侧一个开关。说明写后果，不写功能名 */
function ToggleRow({ label, desc, checked, onChange, disabled, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)', paddingBottom: last ? 0 : 'var(--space-6)', borderBottomWidth: last ? 0 : 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{label}</span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', lineHeight: 'var(--lh-normal)' }}>{desc}</span>
      </span>
      <Switch checked={checked} disabled={disabled} onChange={onChange} />
    </div>
  );
}

function Guardrails({ readOnly }) {
  /* 这里是天花板；具体到某个账户放开到什么程度，在该账户的「投放设置」里定 */
  const caps = useSection(ORG_CAPS, (next) => Object.assign(ORG_CAPS, next));
  const stop = useSection({ pauseLoss: true, lossPct: '200', weekendHold: false });
  const v = caps.v, money = caps.num;

  return (
    <>
      <SettingsCard title="资金上限" note="AI 与成员都不得越过，账户级设置不能超过这里" readOnly={readOnly} dirty={caps.dirty}
        onSave={caps.save} onReset={caps.reset}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
          <FormField label="全组织单日花费上限" hint="所有账户合计，达到即全部暂停">
            <Input value={v.dayCap} disabled={readOnly} iconLeft="circle-dollar-sign" onChange={money('dayCap')} />
          </FormField>
          <FormField label="单条计划出价上限" hint="超过这个数的出价一律需人工审批">
            <Input value={v.bidCap} disabled={readOnly} iconLeft="circle-dollar-sign" onChange={money('bidCap')} />
          </FormField>
          <FormField label="单次调价幅度上限" hint="百分比。防止一次调到失控">
            <Input value={v.stepPct} disabled={readOnly} suffix="%" onChange={money('stepPct')} />
          </FormField>
          <FormField label="新建计划最短观察期" hint="这段时间内不允许关停，避免误杀冷启动">
            <Input value={v.minRun} disabled={readOnly} suffix="天" onChange={money('minRun')} />
          </FormField>
        </div>
      </SettingsCard>

      <SettingsCard title="自动止损" readOnly={readOnly} dirty={stop.dirty}
        onSave={stop.save} onReset={stop.reset}>
        <ToggleRow label="成本严重超标时自动关停" checked={stop.v.pauseLoss} disabled={readOnly} onChange={() => stop.set('pauseLoss')(!stop.v.pauseLoss)}
          desc={'转化成本达到目标的 ' + stop.v.lossPct + '% 时直接关停，不等审批。关掉的话只会发通知。'} />
        {stop.v.pauseLoss ? (
          <FormField label="触发阈值" hint="相对目标 CPA 的百分比。低于 150% 容易误杀波动">
            <Input value={stop.v.lossPct} disabled={readOnly} suffix="%" style={{ maxWidth: 200 }} onChange={stop.num('lossPct')} />
          </FormField>
        ) : null}
        <ToggleRow last label="周末与节假日冻结变更" checked={stop.v.weekendHold} disabled={readOnly} onChange={() => stop.set('weekendHold')(!stop.v.weekendHold)}
          desc="没人值守时 AI 只观察不动手，周一恢复。止损关停不受此限制。" />
      </SettingsCard>
    </>
  );
}

function Metrics({ readOnly }) {
  const m = useSection({ window: '3 日', cpaBasis: '表单提交', currency: 'CNY', tz: 'Asia/Shanghai (UTC+8)', dedupe: true });
  const v = m.v, set = m.set;

  return (
    <SettingsCard title="口径设置" note="全组织统一，改动会影响历史对比" readOnly={readOnly} dirty={m.dirty}
      onSave={m.save} onReset={m.reset}>
      <Alert tone="warning" title="改口径等于换尺子">
        归因窗口或转化口径一变，此前的 CPA、ROI 与经验库里的阈值都不再可比。建议只在季度初调整。
      </Alert>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
        <FormField label="归因窗口" hint="表单类转化通常跨天，1 日会低估效果">
          <Select value={v.window} disabled={readOnly} width="100%" options={['1 日', '3 日', '7 日', '15 日']} onChange={(e) => set('window')(e.target.value)} />
        </FormField>
        <FormField label="CPA 转化口径" hint="用哪个事件计成本">
          <Select value={v.cpaBasis} disabled={readOnly} width="100%" options={['表单提交', '有效留电', '到店核销', '成交']} onChange={(e) => set('cpaBasis')(e.target.value)} />
        </FormField>
        <FormField label="结算币种">
          <Select value={v.currency} disabled={readOnly} width="100%" options={['CNY', 'USD', 'HKD']} onChange={(e) => set('currency')(e.target.value)} />
        </FormField>
        <FormField label="报表时区" hint="决定「今日」从几点开始">
          <Select value={v.tz} disabled={readOnly} width="100%" options={['Asia/Shanghai (UTC+8)', 'Asia/Singapore (UTC+8)', 'UTC']} onChange={(e) => set('tz')(e.target.value)} />
        </FormField>
      </div>
      <ToggleRow last label="跨账户转化去重" checked={v.dedupe} disabled={readOnly} onChange={() => set('dedupe')(!v.dedupe)}
        desc="同一用户在多个账户下触发的转化只计一次。关掉后各账户口径独立，合计会偏高。" />
    </SettingsCard>
  );
}

const LOGS = [
  { id: 'l1', at: '2026-09-11 10:24', who: '用户7311', act: '修改', target: '自动止损阈值', from: '180%', to: '200%', kind: 'setting' },
  { id: 'l2', at: '2026-09-10 16:02', who: '用户2210', act: '调整角色', target: '用户9038', from: '管理员', to: '操作员', kind: 'member' },
  { id: 'l3', at: '2026-09-10 09:15', who: 'AI', act: '自动关停', target: '朋友圈 · 竖版新素材', from: 'CPA ¥98.3', to: '已暂停', kind: 'ai' },
  { id: 'l4', at: '2026-09-09 14:38', who: '用户7311', act: '修改', target: 'AI 自动化程度', from: '护栏内自动', to: '建议后审批', kind: 'setting' },
  { id: 'l5', at: '2026-09-08 11:07', who: '用户5164', act: '分配账户', target: '王小卤 · 视频号直播', from: '未分配', to: '王小卤 · 电商投放', kind: 'member' },
  { id: 'l6', at: '2026-09-07 20:41', who: 'AI', act: '自动调价', target: '虎皮凤爪 · 全域推广', from: '¥42', to: '¥38', kind: 'ai' },
];

const KIND = { setting: { label: '设置变更', tone: 'neutral' }, member: { label: '成员与归属', tone: 'neutral' }, ai: { label: 'AI 执行', tone: 'ai' } };

function AuditLog() {
  const [kind, setKind] = React.useState('全部类型');
  const rows = LOGS.filter((l) => kind === '全部类型' || KIND[l.kind].label === kind);
  return (
    <>
      <Card padded={false} style={{ marginBottom: 'var(--space-6)', maxWidth: 760 }}>
        <FilterBar inset trailing={<span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>保留 180 天</span>}>
          <FilterSelect value={kind} onChange={setKind} width={140}
            options={['全部类型'].concat(Object.keys(KIND).map((k) => KIND[k].label)).map((o) => ({ label: o }))} />
        </FilterBar>
      </Card>
      <Card padded={false} style={{ maxWidth: 760 }}>
        {rows.length ? rows.map((l, i) => (
          <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', flexWrap: 'wrap' }}>
            <span style={{ width: 132, flex: 'none', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{l.at}</span>
            <span style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 'var(--fs-13)' }}>
                <strong style={{ fontWeight: 'var(--fw-medium)' }}>{l.who}</strong> {l.act}「{l.target}」
              </span>
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{l.from} → {l.to}</span>
            </span>
            <Badge tone={KIND[l.kind].tone}>{KIND[l.kind].label}</Badge>
          </div>
        )) : <EmptyState compact icon="search-x" title="没有这一类记录" description="换个类型看看。" />}
      </Card>
    </>
  );
}

/* 账户级设置按这套上限校验 —— 同一个对象，保存后立刻生效。
   这三段由「设置」页平铺渲染，不再自带页头与页签。 */
Object.assign(window, { OrgGuardrails: Guardrails, OrgMetrics: Metrics, OrgAuditLog: AuditLog, HUITOU_ORG_CAPS: ORG_CAPS });
})();
