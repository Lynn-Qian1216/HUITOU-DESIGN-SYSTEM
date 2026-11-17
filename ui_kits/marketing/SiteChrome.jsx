(() => {
const { Button, Badge, Icon, Divider } = window.HUITOUAIDesignSystem_52606d;

function SiteHeader({ onNav }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,.92)', backdropFilter: 'var(--blur-scrim)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 'var(--layout-max-marketing)', margin: '0 auto', padding: '0 var(--space-8)', height: 64, display: 'flex', alignItems: 'center', gap: 'var(--space-9)' }}>
        <img src="../../assets/logo-wordmark.svg" style={{ height: 22 }} alt="HUITOU" />
        <nav style={{ display: 'flex', gap: 'var(--space-8)', flex: 1 }}>
          {['产品', '工作原理', '价格', '客户案例', '文档'].map((l) => (
            <a key={l} href="#" onClick={(e) => { e.preventDefault(); onNav && onNav(l); }}
              style={{ fontSize: 'var(--fs-14)', color: 'var(--text-secondary)', textDecoration: 'none' }}>{l}</a>
          ))}
        </nav>
        <Button variant="ghost" size="md">登录</Button>
        <Button variant="primary" size="md">预约演示</Button>
      </div>
    </header>
  );
}

function SiteFooter() {
  const cols = [
    { h: '产品', items: ['诊断', '策略', '自动驾驶', '报告', '集成'] },
    { h: '公司', items: ['关于我们', '加入我们', '安全', '联系我们'] },
    { h: '资源', items: ['文档', '更新日志', '行业基准', '服务状态'] },
  ];
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
      <div style={{ maxWidth: 'var(--layout-max-marketing)', margin: '0 auto', padding: 'var(--space-12) var(--space-8) var(--space-9)', display: 'grid', gridTemplateColumns: '1.6fr repeat(3, 1fr)', gap: 'var(--space-9)' }}>
        <div>
          <img src="../../assets/logo-wordmark.svg" style={{ height: 22 }} alt="HUITOU" />
          <p style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: 'var(--space-6)', maxWidth: 260, lineHeight: 'var(--lh-relaxed)' }}>
            广告投放操作系统。每个广告账户，都有属于自己的 AI 投手。
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{c.h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
              {c.items.map((i) => <a key={i} href="#" style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', textDecoration: 'none' }}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 'var(--layout-max-marketing)', margin: '0 auto', padding: '0 var(--space-8) var(--space-9)', display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
        <span>© 2026 HUITOU AI</span><span>·</span><a href="#" style={{ color: 'inherit' }}>隐私政策</a><span>·</span><a href="#" style={{ color: 'inherit' }}>服务条款</a>
      </div>
    </footer>
  );
}

function Section({ eyebrow, title, description, children, tone = 'page', style }) {
  return (
    <section style={{ background: tone === 'card' ? 'var(--surface-card)' : 'var(--surface-page)', borderTop: '1px solid var(--border-subtle)', ...style }}>
      <div style={{ maxWidth: 'var(--layout-max-marketing)', margin: '0 auto', padding: 'var(--space-13) var(--space-8)' }}>
        {eyebrow ? <div style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{eyebrow}</div> : null}
        {title ? <h2 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-38)', fontWeight: 900, letterSpacing: 'var(--ls-tight)', lineHeight: 1.3, maxWidth: '22ch' }}>{title}</h2> : null}
        {description ? <p style={{ margin: 'var(--space-6) 0 0', fontSize: 'var(--fs-18)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)', maxWidth: '58ch' }}>{description}</p> : null}
        <div style={{ marginTop: title || description ? 'var(--space-11)' : 0 }}>{children}</div>
      </div>
    </section>
  );
}

Object.assign(window, { SiteHeader, SiteFooter, Section });
})();
