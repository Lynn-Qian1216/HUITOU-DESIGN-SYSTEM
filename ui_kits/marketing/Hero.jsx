(() => {
const { Button, Badge, Icon, MetricCard, AgentTimeline, StatusDot, Sparkline } = window.HUITOUAIDesignSystem_52606d;

function Hero() {
  return (
    <section style={{ background: 'var(--surface-card)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--neutral-200) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: .5, maskImage: 'linear-gradient(to bottom, #000, transparent 70%)', WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 70%)' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--layout-max-marketing)', margin: '0 auto', padding: 'var(--space-14) var(--space-8) var(--space-13)' }}>
        <Badge tone="ai" icon="sparkles">自动驾驶已支持 Meta 与 Google</Badge>
        <h1 style={{ margin: 'var(--space-7) 0 0', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-56)', fontWeight: 900, letterSpacing: 'var(--ls-tight)', lineHeight: 1.18, maxWidth: '16ch' }}>
          每个广告账户，都有 AI 投手。
        </h1>
        <p style={{ margin: 'var(--space-7) 0 0', fontSize: 'var(--fs-20)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)', maxWidth: '54ch' }}>
          HUITOU 持续读取账户数据，找出预算漏损、执行修复，并从结果中学习。每一次变更都有记录，且可回滚。
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-9)' }}>
          <Button variant="primary" size="lg" iconRight="arrow-right">预约演示</Button>
          <Button variant="secondary" size="lg">查看实时诊断</Button>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)', marginTop: 'var(--space-7)', fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)' }}>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon name="check" size={14} /> 无需代理商月费</span>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon name="check" size={14} /> 4 分钟完成接入</span>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon name="check" size={14} /> 每次变更均可回滚</span>
        </div>
        <ProductFrame />
      </div>
    </section>
  );
}

function ProductFrame() {
  return (
    <div style={{ marginTop: 'var(--space-12)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-2xl)', background: 'var(--surface-page)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 var(--space-6)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
        <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--neutral-200)' }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--neutral-200)' }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--neutral-200)' }} />
        <span style={{ marginLeft: 'var(--space-6)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>app.huitou.ai/northwind/overview</span>
        <div style={{ flex: 1 }} />
        <StatusDot tone="ai" label="自动驾驶已开启" pulse style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }} />
      </div>
      <div style={{ padding: 'var(--space-8)', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--space-5)' }}>
        <MetricCard label="花费 · 7 天" value="¥28,412" delta={4.1} goodWhen="none" basis="较前 7 天" series={[18,21,19,24,26,25,28]} />
        <MetricCard label="混合 CPA" value="¥41.20" delta={-18.4} goodWhen="down" basis="较前 7 天" series={[52,49,51,47,45,44,41]} target="¥45.00" />
        <MetricCard label="ROAS" value="3.14" delta={12.4} basis="较前 7 天" series={[2.1,2.4,2.3,2.7,2.9,3.0,3.14]} />
        <MetricCard label="转化 · 7 天" value="689" delta={9.2} basis="较前 7 天" series={[82,88,91,96,99,112,121]} />
      </div>
      <div style={{ padding: '0 var(--space-8) var(--space-8)' }}>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 'var(--gutter-card)' }}>
          <div style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 'var(--space-6)' }}>智能体动态</div>
          <AgentTimeline items={window.HUITOU_MKT.activity} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Hero });
})();
