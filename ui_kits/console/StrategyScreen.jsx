(() => {
const { Card, Button, Badge, AgentTimeline, Dialog, Checkbox, Switch, Alert, Divider, Icon, Toast, FormField, Input, Radio } = window.HUITOUAIDesignSystem_52606d;

function StrategyScreen({ onNavigate, onToast }) {
  const D = window.HUITOU_DATA;
  const [confirm, setConfirm] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  const [auto, setAuto] = React.useState(true);
  return (
    <>
      <PageHeader
        title="策略"
        description="建议执行的变更、背后的推理，以及 HUITOU 必须遵守的护栏。"
        actions={<>
          <Button variant="secondary">放弃</Button>
          <Button variant="primary" iconLeft="play" disabled={applied} onClick={() => setConfirm(true)}>{applied ? '已应用' : '应用策略'}</Button>
        </>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {applied ? <Alert tone="success" title="策略已应用" onDismiss={() => setApplied(false)}>已更新 4 个广告组。HUITOU 将监控 72 小时，若 CPA 恶化超过 15% 则自动回滚。</Alert> : null}
          <Card title="建议变更" subtitle="2 项变更 · 预计每周节省 ¥1,392" padded={false}
            footer={<span>13:51 基于 4 条待处理结论生成</span>}>
            <ChangeRow
              icon="arrow-left-right" title="每日 ¥1,200 转向「拉新 — 美国」"
              detail="来源为「再营销 — DTC」，其以 4.8 的频次反复触达同一批 3.8 万人。"
              tags={['Meta Ads', '预算']} impact="+¥980 / 周"
            />
            <ChangeRow
              icon="pause" title="暂停「再营销 — DTC」中的 3 个广告组"
              detail="三个广告组的 ROAS 均连续 5 天低于 0.8。"
              tags={['Meta Ads', '投放']} impact="+¥412 / 周"
            />
          </Card>
          <Card title={<window.CardTitle info="HUITOU 不被允许做的事">护栏</window.CardTitle>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <Switch checked={auto} onChange={setAuto} label="自动驾驶" description="无需询问即执行已批准的策略手册，每次变更后通知你。" />
              <FormField label="单日预算变动上限" hint="按广告系列计，每 24 小时">
                <Input defaultValue="25" suffix="%" style={{ maxWidth: 220 }} />
              </FormField>
              <FormField label="回滚规则">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Radio checked name="revert" label="72 小时内 CPA 恶化超过 15% 则回滚" />
                  <Radio name="revert" label="暂停变更并通知我" />
                </div>
              </FormField>
            </div>
          </Card>
        </div>
        <Card title="推理过程" subtitle="HUITOU 如何得出这些结论">
          <AgentTimeline items={D.activity} />
        </Card>
      </div>
      <Dialog open={confirm} title="确认应用策略？" description="涉及 4 个广告组的 2 项变更将立即生效。"
        onClose={() => setConfirm(false)}
        footer={<>
          <Button onClick={() => setConfirm(false)}>取消</Button>
          <Button variant="primary" onClick={() => { setConfirm(false); setApplied(true); onToast && onToast(); }}>应用</Button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>HUITOU 将监控 72 小时，若 CPA 恶化超过 15% 则自动回滚。</span>
          <Checkbox checked label="在 Slack 通知团队" description="#growth-northwind" />
        </div>
      </Dialog>
    </>
  );
}

function ChangeRow({ icon, title, detail, tags, impact }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-6) var(--gutter-card)', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--status-ai-bg)', border: '1px solid var(--status-ai-border)', color: 'var(--status-ai-fg)' }}>
        <Icon name={icon} size={14} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{title}</div>
        <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: 3 }}>{detail}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 'var(--space-5)' }}>
          {tags.map((t) => <Badge key={t} tone="neutral">{t}</Badge>)}
        </div>
      </div>
      <div style={{ textAlign: 'right', flex: 'none' }}>
        <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>预计</div>
        <div style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)', color: 'var(--viz-positive)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{impact}</div>
      </div>
    </div>
  );
}

Object.assign(window, { StrategyScreen });
})();
