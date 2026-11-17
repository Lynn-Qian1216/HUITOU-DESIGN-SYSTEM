(() => {
const { Card, Button, Badge, Icon, Divider, Tabs, StatDelta, Avatar, Alert } = window.HUITOUAIDesignSystem_52606d;

const STAGES = [
  { icon: 'stethoscope', title: '诊断', body: 'HUITOU 每 6 小时读取一次花费、投放、素材与转化数据，并按每周影响金额对问题排序。' },
  { icon: 'lightbulb', title: '制定策略', body: '每条结论都会转化为具体变更，附带预期结果、支撑证据与置信度。' },
  { icon: 'play', title: '自动执行', body: '已批准的策略手册在你设定的护栏内自动运行。每次变更都记录原因与时间戳。' },
  { icon: 'brain', title: '持续学习', body: '结果回流至模型。未能奏效的变更会被回滚并记录，避免重复同样的错误。' },
];

function HowItWorks() {
  return (
    <Section eyebrow="工作原理" title="一个闭环，而不是一块看板" description="报表工具只告诉你发生了什么。HUITOU 把数据与账户之间的环路真正闭合。" tone="page">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--space-5)' }}>
        {STAGES.map((s, i) => (
          <div key={s.title} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', color: 'var(--text-primary)' }}>
                <Icon name={s.icon} size={16} />
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>0{i + 1}</span>
            </div>
            <h3 style={{ margin: 'var(--space-6) 0 0', fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-normal)' }}>{s.title}</h3>
            <p style={{ margin: 'var(--space-4) 0 0', fontSize: 'var(--fs-14)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Proof() {
  const stats = [
    { v: '−22%', l: '混合 CPA 中位降幅', s: '基于 140 个账户前 90 天数据' },
    { v: '4.1 小时', l: '首次修复中位耗时', s: '从接入到变更生效' },
    { v: '1.1 万', l: '每周自动变更次数', s: '每次均有记录且可回滚' },
    { v: '99.9%', l: '数据同步可用率', s: '滚动 12 个月' },
  ];
  return (
    <Section tone="card" eyebrow="效果" title="用账户结果衡量，而不是看板数字">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--space-8)' }}>
        {stats.map((s) => (
          <div key={s.l} style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 'var(--space-7)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-48)', fontWeight: 900, letterSpacing: 'var(--ls-tight)', lineHeight: 1.1 }}>{s.v}</div>
            <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', marginTop: 'var(--space-5)' }}>{s.l}</div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 3 }}>{s.s}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Quote() {
  return (
    <Section tone="page">
      <div style={{ maxWidth: '46ch' }}>
        <blockquote style={{ margin: 0, fontSize: 'var(--fs-30)', fontWeight: 'var(--fw-light)', letterSpacing: 'var(--ls-tight)', lineHeight: 'var(--lh-snug)' }}>
          「它找出了我们从三月起就一直在为之付费的人群重叠。修复在周一晨会之前就上线了。」
        </blockquote>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', marginTop: 'var(--space-8)' }}>
          <Avatar name="Priya Nair" size="md" />
          <div>
            <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>Priya Nair</div>
            <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>Northwind DTC 增长负责人</div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Pricing() {
  const plans = [
    { name: '协同驾驶', price: '¥3,490', unit: '/ 月 每账户', body: '诊断与策略。每项变更都由你批准。', features: ['每 6 小时诊断一次', '附带证据的策略草案', '支持 Meta 与 Google Ads', '邮件简报'], cta: '免费试用', variant: 'secondary' },
    { name: '自动驾驶', price: '¥9,290', unit: '/ 月 每账户', body: 'HUITOU 在你设定的护栏内执行，并在事后汇报。', features: ['包含协同驾驶的全部能力', '自动执行变更', '自定义护栏与上限', '自动回滚规则', 'Slack 通知'], cta: '预约演示', variant: 'primary', featured: true },
    { name: '企业版', price: '定制', unit: '多账户', body: '跨品牌、跨地区、跨代理商的账户组合管理。', features: ['包含自动驾驶的全部能力', '账户数量不限', '单点登录与审计日志', '专属策略顾问', 'SLA 服务保障'], cta: '联系销售', variant: 'secondary' },
  ];
  return (
    <Section tone="card" eyebrow="价格" title="按账户计费，而非按席位" description="所有方案均包含完整的诊断引擎。可随时取消；退出后 30 天内变更仍可回滚。">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-5)', alignItems: 'start' }}>
        {plans.map((p) => (
          <div key={p.name} style={{ background: p.featured ? 'var(--neutral-900)' : 'var(--surface-card)', color: p.featured ? 'var(--text-inverse)' : 'var(--text-primary)', border: `1px solid ${p.featured ? 'var(--neutral-900)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-panel)', padding: 'var(--space-9)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{p.name}</span>
              {p.featured ? <Badge tone="ai" icon="sparkles">最受欢迎</Badge> : null}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 'var(--space-6)' }}>
              <span style={{ fontSize: 'var(--fs-38)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tighter)' }}>{p.price}</span>
              <span style={{ fontSize: 'var(--fs-13)', color: p.featured ? 'var(--neutral-400)' : 'var(--text-tertiary)' }}>{p.unit}</span>
            </div>
            <p style={{ fontSize: 'var(--fs-14)', color: p.featured ? 'var(--neutral-300)' : 'var(--text-secondary)', marginTop: 'var(--space-5)', lineHeight: 'var(--lh-relaxed)' }}>{p.body}</p>
            <div style={{ height: 1, background: p.featured ? 'var(--neutral-800)' : 'var(--border-subtle)', margin: 'var(--space-8) 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {p.features.map((ft) => (
                <span key={ft} style={{ display: 'flex', gap: 'var(--space-5)', fontSize: 'var(--fs-13)', color: p.featured ? 'var(--neutral-200)' : 'var(--text-secondary)' }}>
                  <Icon name="check" size={14} style={{ marginTop: 2, color: p.featured ? 'var(--neutral-0)' : 'var(--text-primary)' }} />{ft}
                </span>
              ))}
            </div>
            <Button variant={p.variant} size="lg" fullWidth style={{ marginTop: 'var(--space-9)', ...(p.featured ? { background: 'var(--neutral-0)', color: 'var(--neutral-900)', borderColor: 'var(--neutral-0)' } : null) }}>{p.cta}</Button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CTA() {
  return (
    <section style={{ background: 'var(--neutral-900)' }}>
      <div style={{ maxWidth: 'var(--layout-max-marketing)', margin: '0 auto', padding: 'var(--space-13) var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-11)' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: 'var(--text-inverse)', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-38)', fontWeight: 900, letterSpacing: 'var(--ls-tight)', lineHeight: 1.3, maxWidth: '18ch' }}>看看 HUITOU 能在你的账户里发现什么。</h2>
          <p style={{ color: 'var(--neutral-400)', fontSize: 'var(--fs-16)', marginTop: 'var(--space-6)', maxWidth: '48ch', lineHeight: 'var(--lh-relaxed)' }}>以只读权限接入账户，一小时内获得完整诊断。未经你同意，不会做任何变更。</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flex: 'none' }}>
          <Button size="lg" style={{ background: 'var(--neutral-0)', color: 'var(--neutral-900)', borderColor: 'var(--neutral-0)' }} iconRight="arrow-right">预约演示</Button>
          <Button size="lg" style={{ background: 'transparent', color: 'var(--neutral-0)', borderColor: 'var(--neutral-700)' }}>阅读文档</Button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HowItWorks, Proof, Quote, Pricing, CTA });
})();
