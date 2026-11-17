(() => {
const { Icon, Alert } = window.HUITOUAIDesignSystem_52606d;

/* 用户设置与系统设置是两个入口：作用域不同，误改组织设置的代价也不同。
   两页共用同一套骨架 —— 左栏是目录不是分页，右侧连续平铺，点击滚到对应段、
   滚动时反过来点亮，这样「我改了哪些」始终在同一条流里。 */

const USER_SECTIONS = [
  { group: '个人', items: [
    { id: 'profile', label: '个人资料', icon: 'user-round' },
    { id: 'notify', label: '通知设置', icon: 'bell' },
    { id: 'security', label: '账号与安全', icon: 'shield-check' },
  ] },
];

const ORG_SECTIONS = [
  { group: '组织', items: [
    { id: 'guardrails', label: '投放护栏', icon: 'shield' },
    { id: 'metrics', label: '数据口径', icon: 'ruler' },
    { id: 'audit', label: '审计日志', icon: 'scroll-text' },
  ] },
];

function UserSettings() {
  return (
    <SettingsShell title="用户设置" description="只影响你自己：资料、通知走哪个机器人、发给哪些账户。" sections={USER_SECTIONS}>
      {(marks) => <>
        <Block id="profile" title="个人资料" marks={marks}><window.MyProfilePane /></Block>
        <Block id="notify" title="通知设置" marks={marks}><window.MyNotifyPane /></Block>
        <Block id="security" title="账号与安全" marks={marks}><window.MySecurityPane /></Block>
      </>}
    </SettingsShell>
  );
}

function SystemSettings() {
  const store = window.useTeam ? window.useTeam() : { team: { role: 'owner', name: '' } };
  const isOwner = store.team.role === 'owner';
  return (
    <SettingsShell title="系统设置" sections={ORG_SECTIONS}
      description={'组织级设置，对「' + store.team.name + '」下所有账户生效。谁能操作在团队管理里定。'}>
      {(marks) => <>
        <Block id="guardrails" title="投放护栏" marks={marks} note="账户级设置只能更严，不能更松">
          {isOwner ? null : (
            <Alert tone="info" title="你当前是只读" style={{ marginBottom: 'var(--space-5)' }}>
              组织设置会影响整个团队的资金安全，只有拥有者可以修改。
            </Alert>
          )}
          <window.OrgGuardrails readOnly={!isOwner} />
        </Block>
        <Block id="metrics" title="数据口径" marks={marks}><window.OrgMetrics readOnly={!isOwner} /></Block>
        <Block id="audit" title="审计日志" marks={marks}><window.OrgAuditLog /></Block>
      </>}
    </SettingsShell>
  );
}

function SettingsShell({ title, description, sections, children }) {
  const flat = sections.reduce((a, g) => a.concat(g.items), []);
  const [cur, setCur] = React.useState(flat[0].id);
  const scroller = React.useRef(null);
  const marks = React.useRef({});

  const goto = (id) => {
    setCur(id);
    const el = marks.current[id], sc = scroller.current;
    if (el && sc) sc.scrollTo({ top: Math.max(0, el.offsetTop - 12), behavior: 'smooth' });
  };
  const onScroll = () => {
    const sc = scroller.current;
    if (!sc) return;
    let hit = flat[0].id;
    flat.forEach((s) => { const el = marks.current[s.id]; if (el && el.offsetTop - 24 <= sc.scrollTop) hit = s.id; });
    setCur(hit);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0 }}>
      <window.PageHeader title={title} description={description} />

      <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
        <nav style={{ flex: 'none', width: 168, position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {sections.map((g) => (
            <div key={g.group} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ padding: '0 var(--space-5) var(--space-3)', fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)' }}>{g.group}</div>
              {g.items.map((s) => {
                const on = s.id === cur;
                return (
                  <button key={s.id} type="button" onClick={() => goto(s.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '7px var(--space-5)', borderWidth: 0, borderRadius: 'var(--radius-md)', background: on ? 'var(--surface-selected)' : 'transparent', font: 'inherit', fontSize: 'var(--fs-13)', fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)', color: on ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'left', cursor: 'pointer', transition: 'var(--transition-control)' }}>
                    <Icon name={s.icon} size={14} style={{ flex: 'none', color: on ? 'var(--text-primary)' : 'var(--text-tertiary)' }} />
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div ref={scroller} onScroll={onScroll} className="huitou-scroll"
          style={{ position: 'relative', flex: 1, minWidth: 0, minHeight: 0, maxHeight: '100%', overflowY: 'auto', paddingBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', maxWidth: 760 }}>
            {children(marks)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 段落标题用一条细线收口：右侧是连续一列，没有分隔就分不清一段到哪儿结束 */
function Block({ id, title, note, trailing, marks, children }) {
  return (
    <section ref={(el) => { marks.current[id] = el; }} style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-5)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-5)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)' }}>{title}</h2>
        {note ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{note}</span> : null}
        {trailing ? <><span style={{ flex: 1 }} />{trailing}</> : null}
      </div>
      {children}
    </section>
  );
}

Object.assign(window, { UserSettings, SystemSettings });
})();
