(() => {
const { Card, Badge, Button, Tabs, Popover, Icon, Divider, ProgressBar, EmptyState, Tag } = window.HUITOUAIDesignSystem_52606d;

function DiagnosisScreen({ onNavigate }) {
  const D = window.HUITOU_DATA;
  const [tab, setTab] = React.useState('open');
  const [selected, setSelected] = React.useState('f1');
  const finding = D.findings.find((x) => x.id === selected);
  return (
    <>
      <PageHeader
        title="诊断"
        description="HUITOU 在该账户中发现的问题，按每周影响金额排序。每条结论都附带证据与置信度。"
        actions={<>
          <Button variant="secondary" iconLeft="refresh-cw">重新诊断</Button>
          <Button variant="primary" iconLeft="lightbulb" onClick={() => onNavigate('strategy')}>生成策略</Button>
        </>}
      />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'open', label: '待处理', count: 4 }, { id: 'resolved', label: '已解决', count: 17 }, { id: 'muted', label: '已忽略', count: 2 }]} style={{ marginBottom: 'var(--space-7)' }} />
      {tab !== 'open' ? (
        <Card><EmptyState icon="inbox" title={tab === 'resolved' ? '已解决的问题每周归档' : '暂无忽略项'} description="该视图在 UI Kit 中为占位。" /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {D.findings.map((fi) => (
              <Card key={fi.id} interactive selected={fi.id === selected} onClick={() => setSelected(fi.id)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)' }}>
                  <Icon name={fi.severity === 'danger' ? 'circle-alert' : fi.severity === 'warning' ? 'triangle-alert' : 'info'} size={16} style={{ color: `var(--status-${fi.severity}-fg)`, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{fi.title}</div>
                    <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: 4 }}>{fi.detail}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
                      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{fi.evidence}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flex: 'none' }}>
                    <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>影响</div>
                    <div style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{fi.impact}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card title={<window.CardTitle info="证据与建议响应">{finding.title}</window.CardTitle>} footer={<span>13:44 检测到 · 每 6 小时复检一次</span>}>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
              <Badge tone={finding.severity} dot>{finding.severity === 'danger' ? '高严重度' : finding.severity === 'warning' ? '中严重度' : '提示'}</Badge>
              <Badge tone="neutral">Meta Ads</Badge>
              <Badge tone="ai" icon="sparkles">可自动修复</Badge>
            </div>
            <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>{finding.detail}</div>
            <Divider />
            <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' }}>证据</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <EvidenceRow label="7 天频次" value="4.8" bar={82} tone="danger" />
              <EvidenceRow label="点击率变化" value="−31%" bar={64} tone="warning" />
              <EvidenceRow label="人群重叠" value="38,412 人" bar={71} tone="warning" />
            </div>
            <Divider />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
              <Popover placement="top" width={230} content={<span>覆盖 3 个广告系列的 21 天转化数据，置信度：高。</span>}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
                  <Icon name="info" size={13} /> 高置信度
                </span>
              </Popover>
              <div style={{ flex: 1 }} />
              <Button variant="ghost" size="sm">忽略</Button>
              <Button variant="primary" size="sm" iconLeft="sparkles" onClick={() => onNavigate('strategy')}>生成修复方案</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

function EvidenceRow({ label, value, bar, tone }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-13)', marginBottom: 5 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      </div>
      <div style={{ height: 4, background: 'var(--neutral-100)', borderRadius: 999 }}>
        <div style={{ width: `${bar}%`, height: '100%', background: `var(--status-${tone}-fg)`, borderRadius: 999 }} />
      </div>
    </div>
  );
}

Object.assign(window, { DiagnosisScreen });
})();
