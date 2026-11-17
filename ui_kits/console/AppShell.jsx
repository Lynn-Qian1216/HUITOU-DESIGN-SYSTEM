(() => {
const { Icon, IconButton, Avatar, Divider, DropdownMenu, SidebarAccount } = window.HUITOUAIDesignSystem_52606d;

/* 图标栏随账户所属平台变 —— 两个平台的投放对象不是一套东西：
   千川围绕商品与达人带货，腾讯营销围绕创意组件与人群包。
   不做「所有平台一套导航 + 灰掉不支持的项」：灰掉的入口只会让人反复去点。 */
const RAIL_BY_PLATFORM = {
  巨量千川: [
    { id: 'overview', label: '账户概览', icon: 'circle-gauge' },
    { id: 'ai-1', label: 'AI决策', icon: 'sparkles', dot: true },
    { id: 'team', label: 'AI团队', icon: 'users' },
    { id: 'campaigns', label: '广告投放', icon: 'send', dot: true },
    { id: 'creators', label: '达人', icon: 'user-round' },
    { id: 'products', label: '商品库', icon: 'package' },
  ],
  腾讯营销: [
    { id: 'overview', label: '账户概览', icon: 'circle-gauge' },
    { id: 'ai-1', label: 'AI决策', icon: 'sparkles', dot: true },
    { id: 'team', label: 'AI团队', icon: 'users' },
    { id: 'campaigns', label: '广告投放', icon: 'send', dot: true },
    { id: 'creatives', label: '创意', icon: 'image' },
    { id: 'components', label: '组件', icon: 'box' },
    { id: 'audiences', label: '人群包', icon: 'users-round' },
    { id: 'matrix', label: '投放矩阵', icon: 'grid-3x3' },
  ],
};
const RAIL = RAIL_BY_PLATFORM.巨量千川;

/* 历史对话按项目归档：一个大促、一次新品、一轮复盘各成一个项目。
   未归档的对话落在「其他聊天历史」里。 */
const PROJECTS = [
  { id: 'pj1', name: '618 大促', meta: '5-20 至 6-20', chats: [
    { id: 'h1', title: '大促预算总盘与分日节奏', time: '刚刚', pinned: true },
    { id: 'h2', title: '预售期人群包复盘', time: '2h前' },
    { id: 'h3', title: '爆量素材筛选', time: '昨天' },
    { id: 'h4', title: '直播间引流出价策略', time: '3天前' },
  ] },
  { id: 'pj2', name: '藤椒味新品上市', meta: '8-01 起', chats: [
    { id: 'h5', title: '新品试销诊断', time: '15min前', pinned: true },
    { id: 'h6', title: '首发人群定向建议', time: '昨天' },
    { id: 'h7', title: '首周 CPA 目标测算', time: '2天前' },
  ] },
  { id: 'pj3', name: '日常运营', meta: '长期', chats: [
    { id: 'h14', title: '在投计划表现分析', time: '刚刚' },
    { id: 'h8', title: '昨日消耗异常排查', time: '30min前' },
    { id: 'h9', title: '再营销人群重叠复盘', time: '昨天' },
    { id: 'h10', title: '素材疲劳度检查', time: '2天前' },
    { id: 'h11', title: '八月月报', time: '3天前' },
  ] },
];

const LOOSE_CHATS = [
  { id: 'h12', title: '达人分销计划审核', time: '昨天' },
  { id: 'h13', title: '腾讯营销令牌激活', time: '4天前' },
];

const ALL_CHATS = [...PROJECTS.flatMap((p) => p.chats.map((c) => ({ ...c, project: p.name }))), ...LOOSE_CHATS];

/* 左上角账户切换：按平台分组，支持搜索与置顶。
   主行显示账号标签（用户自己起的名字），原名与 ID 一起降到副行 —— 平时认账号靠标签，
   原名只在核对时需要，压成一行 11px 的灰字够用。 */
const SWITCH_ACCOUNTS = [
  { id: 's1', platform: '巨量千川', tag: '主力店 · 凤爪', name: '王小卤虎皮凤爪旗舰店', account: '000000000000', pinned: true },
  { id: 's2', platform: '巨量千川', tag: '官旗大盘', name: '王小卤食品官方旗舰店', account: '000000000001', pinned: true },
  { id: 's3', platform: '巨量千川', tag: '达人分销', name: '王小卤虎皮凤爪 · 达人分销', account: '000000000002' },
  { id: 's4', platform: '巨量千川', tag: '新品测试', name: '新品试销 — 藤椒味', account: '000000000003' },
  { id: 's5', platform: '腾讯营销', tag: '朋友圈主力', name: '虎皮凤爪 · 朋友圈', account: '310000000000', pinned: true },
  { id: 's6', platform: '腾讯营销', tag: '小程序召回', name: '会员召回 — 小程序', account: '310000000001' },
  { id: 's7', platform: '腾讯营销', tag: '直播引流', name: '视频号直播引流', account: '310000000002' },
];

/* 常用指令库：把高频问法固定下来，点一下填进输入框。 */
const PROMPTS = [
  { id: 'p1', icon: 'file-text', label: '每日复盘', text: '给我昨天的日报' },
  { id: 'p2', icon: 'stethoscope', label: '账户诊断', text: '账户诊断' },
  { id: 'p3', icon: 'list-checks', label: '待执行决策', text: '帮我执行最紧急的待执行决策' },
  { id: 'p4', icon: 'grid-3x3', label: '创建营销矩阵', text: '帮我创建营销矩阵' },
];

function AppShell({ tab, onTab, onGo, rail, onRail, chat, onChat, detail, plain, hideRail, platform = '巨量千川', account, onPlatform, onGoAccounts, onGoSettings, onGoWorkspace, children }) {
  const [sidebar, setSidebar] = React.useState(true);
  const [split, setSplit] = React.useState(0.36);   // 会话区占内容区的比例
  const [held, setHeld] = React.useState(null);     // 保留上一次面板内容，供收起时播完动画
  const [open, setOpen] = React.useState(false);    // 面板是否展开到位
  const [paneW, setPaneW] = React.useState(0);      // 面板目标宽度（px），动画期间锁住内容宽度
  const [dragging, setDragging] = React.useState(false);
  const row = React.useRef(null);
  const surface = React.useRef(null);
  const [surfaceEl, setSurfaceEl] = React.useState(null);
  const setSurface = React.useCallback((el) => { surface.current = el; setSurfaceEl(el); }, []);
  const auto = React.useRef(false);
  const sidebarTimer = React.useRef(null);
  const toggleSidebar = () => {
    auto.current = false;
    setSidebar((s) => !s);
    /* 侧栏动画期间面板宽度持续变化，关掉过渡让它即时跟随，动画结束再恢复 */
    setDragging(true);
    clearTimeout(sidebarTimer.current);
    sidebarTimer.current = setTimeout(() => setDragging(false), 300);
  };
  React.useEffect(() => () => clearTimeout(sidebarTimer.current), []);

  /* 展开：先挂载内容再放开宽度；收起：先收宽度，动画结束后卸载 */
  React.useEffect(() => {
    if (detail) {
      setHeld(detail);
      const t = setTimeout(() => setOpen(true), 16);
      return () => clearTimeout(t);
    }
    setOpen(false);
    const t = setTimeout(() => setHeld(null), 260);
    return () => clearTimeout(t);
  }, [!!detail, rail]);

  /* 面板目标宽度：内容区减去图标栏后按比例分配。动画期间给内容固定宽度，
     避免逐帧重排造成卡顿。 */
  React.useEffect(() => {
    const el = surfaceEl;
    if (!el) return;
    /* 宽度变化只在越过阈值时才写 state：ResizeObserver 的回调本身会引起布局，
       逐像素回写会和布局互相触发，永远收敛不了。 */
    let raf = 0;
    const measure = () => {
      const next = Math.max(0, Math.round((el.clientWidth - 64 - 9) * (1 - split)));
      setPaneW((p) => (Math.abs(p - next) > 1 ? next : p));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [surfaceEl, split]);

  /* 窄窗口下打开数据面板时自动收起会话栏，让会话＋面板＋图标栏都放得下 */
  React.useEffect(() => {
    const el = row.current;
    if (!el) return;
    /* 收起只省下 228→56，所以「放不下」这个判断在两种状态间是会翻转的 ——
       用带间隔的阈值（收起看 1000，恢复看 1180）避免在边界上来回抖。 */
    let raf = 0;
    const fit = () => {
      const w = el.clientWidth;
      if (detail && w < 1000 && sidebar) { auto.current = true; setSidebar(false); }
      else if (auto.current && !sidebar && (!detail || w > 1180)) { auto.current = false; setSidebar(true); }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    });
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [detail, sidebar]);

  if (plain) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-page)' }}>
        <TopBarShell tab={tab} onTab={onTab} onGo={onGo} />
        {children}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-page)' }}>
      <TopBarShell tab={tab} onTab={onTab} onGo={onGo} />
      <div ref={row} style={{ flex: 1, minHeight: 0, display: 'flex', background: 'var(--surface-page)' }}>
        <SidebarShell open={sidebar} mini={<MiniSidebar account={account} onChat={onChat} onGoAccounts={onGoAccounts} onGoSettings={onGoSettings} onPlatform={onPlatform} />}>
          <ChatSidebar chat={chat} onChat={onChat} account={account} onGoAccounts={onGoAccounts} onGoSettings={onGoSettings} onGoWorkspace={onGoWorkspace} onPlatform={onPlatform} />
        </SidebarShell>
        {/* 会话与右侧数据面板是同一块表面，左上角切圆角。 */}
        <div ref={setSurface} style={{
          flex: 1, minWidth: 0, display: 'flex', background: 'var(--neutral-0)',
          borderTop: '1px solid var(--border-subtle)', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)',
          borderTopLeftRadius: 'var(--radius-2xl)', borderTopRightRadius: 'var(--radius-2xl)', overflow: 'hidden',
        }}>
          <div style={{
            flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column',
          }}>
            {React.Children.map(children, (c) => React.isValidElement(c) ? React.cloneElement(c, { sidebarOpen: sidebar, onToggleSidebar: toggleSidebar }) : c)}
          </div>
          {held ? <SplitHandle surface={surface} onSplit={setSplit} collapsed={!open} onDragState={setDragging} /> : null}
          {held ? <DetailPane open={open} width={paneW} dragging={dragging}>{held}</DetailPane> : null}
          {hideRail ? null : <IconRail rail={rail} onRail={onRail} platform={platform} />}
        </div>
        <div style={{ width: 12, flex: 'none' }} />
      </div>
    </div>
  );
}

/* 可拖动分隔条：按下后跟随指针改变会话区与数据面板的比例。
   拖动范围留出两侧最小宽度与右侧图标栏，双击复位。 */
function SplitHandle({ surface, onSplit, collapsed, onDragState }) {
  const [active, setActive] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const start = (e) => {
    e.preventDefault();
    const host = surface.current;
    if (!host) return;
    setActive(true);
    onDragState && onDragState(true);
    const box = host.getBoundingClientRect();
    const usable = box.width - 64;                       // 扣掉右侧图标栏
    const move = (ev) => {
      const ratio = (ev.clientX - box.left) / usable;
      onSplit(Math.min(0.72, Math.max(0.22, ratio)));
    };
    const up = () => {
      setActive(false);
      onDragState && onDragState(false);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const lit = active || hover;
  return (
    <div role="separator" aria-orientation="vertical" title="拖动调整宽度，双击复位"
      onMouseDown={start} onDoubleClick={() => onSplit(0.36)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: 'none', width: collapsed ? 0 : 9, cursor: 'col-resize', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        opacity: collapsed ? 0 : 1,
        transition: 'width 250ms var(--ease-standard), opacity 200ms var(--ease-standard)',
      }}>
      <span style={{
        width: lit ? 3 : 1, height: '100%',
        background: lit ? 'var(--border-strong)' : 'var(--border-subtle)',
        transition: 'width var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard)',
      }} />
      <span style={{
        position: 'absolute', width: 4, height: 28, borderRadius: 999,
        background: 'var(--neutral-400)', opacity: lit ? 1 : 0,
        transition: 'opacity var(--duration-fast) var(--ease-standard)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* 左侧会话栏：宽度 228 ⇄ 56 平滑过渡。收起后不消失，留一条缩略栏 ——
   切账户、开新会话、投放设置、用户这四件事在任何状态下都得能点到，
   收进汉堡里等于每次都要先展开再点。 */
function SidebarShell({ open, mini, children }) {
  return (
    <div style={{
      flex: 'none', width: open ? 228 : 56, minWidth: 0, overflow: 'hidden',
      transition: 'width 250ms var(--ease-standard)',
      willChange: 'width',
    }}>
      {/* 内容层宽度写死，不跟着动画走 —— 否则外层测宽会随每帧变化再触发一次布局 */}
      <div style={{ width: open ? 228 : 56, height: '100%' }}>
        <div style={{ width: open ? 228 : 56, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {open ? children : mini}
        </div>
      </div>
    </div>
  );
}

/* 缩略侧栏：只留四个入口，图标居中，悬停给 tooltip。 */
function MiniSidebar({ account, onChat, onGoAccounts, onGoSettings, onPlatform }) {
  return (
    <aside style={{ width: 56, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--surface-page)' }}>
      <div style={{ padding: 'var(--space-4) 0 0' }}>
        <AccountSwitcher compact account={account} onGoAccounts={onGoAccounts} onPlatform={onPlatform} />
      </div>
      <div style={{ padding: 'var(--space-6) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <MiniButton icon="plus" label="新建对话" onClick={() => onChat && onChat(null)} />
        <MiniButton icon="sliders-horizontal" label="投放设置" onClick={onGoSettings} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 0 var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <MiniButton icon="user" label="天了噜鸭梨" onClick={onGoSettings} />
      </div>
    </aside>
  );
}

function MiniButton({ icon, label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick} title={label} aria-label={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, flex: 'none',
        borderRadius: 'var(--radius-lg)', cursor: 'pointer', border: '1px solid',
        borderColor: hover ? 'var(--border-strong)' : 'var(--border-subtle)',
        background: hover ? 'var(--neutral-0)' : 'transparent',
        color: 'var(--text-secondary)', transition: 'var(--transition-control)',
      }}>
      <Icon name={icon} size={16} />
    </button>
  );
}

/* 数据／决策面板：宽度从 0 平滑长到目标值，会话区因此被同步挤窄；
   内容层固定为目标宽度，动画期间不重排，所以过程是丝滑的位移而非逐帧回流。 */
function DetailPane({ open, width, dragging, children }) {
  return (
    <section style={{
      flex: 'none', width: open ? width : 0, minWidth: 0,
      display: 'flex', flexDirection: 'column', background: 'var(--neutral-0)', overflow: 'hidden',
      opacity: open ? 1 : 0,
      /* 拖动时不做过渡 —— 否则外层宽度滞后于内层固定宽度的内容，两侧会出现延迟展开的怪异感 */
      transition: dragging ? 'none' : 'width 250ms var(--ease-standard), opacity 200ms var(--ease-standard)',
      willChange: 'width',
    }}>
      <div style={{ width: open ? width : 0, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </section>
  );
}

function TopBarShell({ tab, onTab, onGo }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', height: 56, flex: 'none', padding: '0 var(--space-6) 0 var(--space-7)', background: 'var(--surface-page)' }}>
      <img src={(window.__resources && window.__resources.logoWordmark) || "../../assets/logo-wordmark-cn-h.svg"} style={{ height: 24 }} alt="慧投" />
      <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--neutral-200)', borderRadius: 'var(--radius-pill)' }}>
        {[{ id: 'workspace', label: '工作台' }, { id: 'ads', label: '广告投放' }].map((t) => {
          const on = t.id === tab;
          return (
            <button key={t.id} type="button" onClick={() => onTab && onTab(t.id)}
              style={{
                height: 30, padding: '0 var(--space-6)', border: 0, borderRadius: 'var(--radius-pill)',
                background: on ? 'var(--neutral-0)' : 'transparent', boxShadow: on ? 'var(--shadow-xs)' : 'none',
                color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
                font: 'inherit', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)',
                cursor: 'pointer', transition: 'var(--transition-control)',
              }}>{t.label}</button>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <NotificationBell onTab={onTab} onGo={onGo} />
    </header>
  );
}

const NOTICES = [
  { id: 'n1', kind: 'act', tone: 'danger', icon: 'shield-alert', title: '护栏拦下 2 次出价上调',
    body: 'AI 想把「保众-朋友圈-01」的出价从 ¥68 提到 ¥79，超出账户出价上限 ¥72，已暂停等你确认。',
    account: '保众 · 腾讯营销', at: '12 分钟前', go: { tab: 'ads', rail: 'ai-1', focus: 'decision-first' }, cta: '去决策队列' },
  { id: 'n2', kind: 'act', tone: 'warning', icon: 'list-checks', title: '3 条广告计划待审批',
    body: '第 7 批矩阵的草稿已生成完毕，等你逐条批准后才会创建到腾讯。',
    account: '保众 · 腾讯营销', at: '35 分钟前', go: { tab: 'ads', rail: 'matrix' }, cta: '去审批' },
  { id: 'n3', kind: 'act', tone: 'warning', icon: 'file-text', title: '东吴证券 8 月账单有差异',
    body: '朋友圈渠道我方口径 441，对方确认 420，差 21 单（约 ¥6,720）。需发起对账。',
    account: '东吴证券', at: '2 小时前', go: { tab: 'workspace', view: 'dashboard', focus: 'settle-dispute' }, cta: '去对账' },
  { id: 'n4', kind: 'act', tone: 'neutral', icon: 'user-plus', title: '李文琪申请加入「电商投放组」',
    body: '申请角色：操作员。同意后将可查看该团队名下 5 个广告账户。',
    account: '电商投放组', at: '3 小时前', go: { tab: 'workspace', view: 'team' }, cta: '去处理' },
  { id: 'n5', kind: 'info', tone: 'success', icon: 'circle-check', title: 'AI 已在护栏内执行 4 项调整',
    body: '暂停 2 条超成本计划、下调 1 条出价 8%、为 1 条起量计划加预算 ¥300。均在账户护栏内。',
    account: '保众 · 千川', at: '4 小时前', go: { tab: 'ads', rail: 'ai-1', focus: 'decision-first' }, cta: '查看执行记录' },
  { id: 'n6', kind: 'info', tone: 'neutral', icon: 'sparkles', title: '第 6 批矩阵观察期结束',
    body: '9 条计划跑满 72 小时，「短视频+25-34岁」组合 CPA 最低（¥54.2），建议把预算向它倾斜。',
    account: '保众 · 腾讯营销', at: '昨天 21:40', go: { tab: 'ads', rail: 'matrix' }, cta: '查看择优建议' },
  { id: 'n7', kind: 'info', tone: 'neutral', icon: 'book-open', title: '你投稿的经验已通过审核',
    body: '「开户类线索晚 8 点后成本上浮明显」已对全团队可见，已有 3 人采纳。',
    account: '电商投放组', at: '昨天 16:12', go: { tab: 'workspace', view: 'library' }, cta: '去经验库' },
];

const TONE_BG = { danger: 'var(--status-danger-bg)', warning: 'var(--status-warning-bg)', success: 'var(--status-success-bg)', neutral: 'var(--neutral-200)' };
const TONE_FG = { danger: 'var(--status-danger-fg)', warning: 'var(--status-warning-fg)', success: 'var(--status-success-fg)', neutral: 'var(--text-secondary)' };

function NotificationBell({ onTab, onGo }) {
  const jump = (d) => { const fn = onGo || window.HUITOU_GO; if (fn) fn(d); else if (onTab && d && d.tab) onTab(d.tab); };
  const trigger = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [rect, setRect] = React.useState(null);
  const [filter, setFilter] = React.useState('act');
  const [read, setRead] = React.useState([]);

  /* 未读计数只数「待我处理」：把通知播报也算进去，红点就永远消不掉，人会学会忽略它。 */
  const pending = NOTICES.filter((n) => n.kind === 'act');
  const unread = pending.filter((n) => !read.includes(n.id)).length;

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('resize', close);
    document.addEventListener('keydown', key);
    return () => { window.removeEventListener('resize', close); document.removeEventListener('keydown', key); };
  }, [open]);

  const toggle = () => {
    if (!open && trigger.current) setRect(trigger.current.getBoundingClientRect());
    setOpen((v) => !v);
  };

  const list = NOTICES.filter((n) => (filter === 'act' ? n.kind === 'act' : true));

  return (
    <span ref={trigger} style={{ position: 'relative', display: 'inline-flex' }}>
      <IconButton icon="bell" label="通知" size="lg" onClick={toggle} />
      {unread ? (
        <span style={{
          position: 'absolute', top: 4, right: 3, minWidth: 16, height: 16, padding: '0 4px', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', borderRadius: 999, border: '2px solid var(--surface-page)',
          background: 'var(--status-danger-fg)', color: 'var(--neutral-0)', fontSize: 10, fontWeight: 'var(--fw-medium)',
          fontVariantNumeric: 'tabular-nums', pointerEvents: 'none',
        }}>{unread}</span>
      ) : null}

      {open && rect ? (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 60 }} />
          <div style={{
            position: 'fixed', top: rect.bottom + 6, right: Math.max(12, window.innerWidth - rect.right), width: 420, maxHeight: 520,
            display: 'flex', flexDirection: 'column', zIndex: 61, background: 'var(--surface-raised)',
            border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>通知</span>
              <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--neutral-200)', borderRadius: 'var(--radius-pill)' }}>
                {[{ id: 'act', label: '待我处理' }, { id: 'all', label: '全部' }].map((t) => (
                  <button key={t.id} type="button" onClick={() => setFilter(t.id)} style={{
                    height: 24, padding: '0 10px', border: 0, borderRadius: 'var(--radius-pill)', font: 'inherit', fontSize: 'var(--fs-12)',
                    background: filter === t.id ? 'var(--neutral-0)' : 'transparent', boxShadow: filter === t.id ? 'var(--shadow-xs)' : 'none',
                    color: filter === t.id ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition-control)',
                  }}>{t.label}</button>
                ))}
              </div>
              <span style={{ flex: 1 }} />
              <button type="button" onClick={() => setRead(NOTICES.map((n) => n.id))} style={{
                border: 0, background: 'transparent', font: 'inherit', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0,
              }}>全部标为已读</button>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {list.length ? list.map((n) => (
                <NoticeRow key={n.id} item={n} read={read.includes(n.id)} done={false}
                  onOpen={() => {
                    setRead((r) => (r.includes(n.id) ? r : [...r, n.id]));
                    setOpen(false);
                    jump(n.go);
                  }} />
              )) : (
                <div style={{ padding: 'var(--space-9) var(--space-6)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>没有待处理的事</div>
                  <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 4 }}>AI 的自动执行记录在「全部」里</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--space-6)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
              <button type="button" onClick={() => { setOpen(false); jump({ tab: 'workspace', view: 'todos' }); }} style={{
                border: 0, background: 'transparent', font: 'inherit', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)',
                color: 'var(--text-primary)', cursor: 'pointer', padding: 0,
              }}>{pending.length} 项待处理 · 去待办</button>
              <span style={{ flex: 1 }} />
              <button type="button" onClick={() => { setOpen(false); jump({ tab: 'workspace', view: 'profile' }); }} style={{
                border: 0, background: 'transparent', font: 'inherit', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)',
                color: 'var(--text-primary)', cursor: 'pointer', padding: 0,
              }}>通知设置</button>
            </div>
          </div>
        </>
      ) : null}
    </span>
  );
}

/* 单条通知：左侧色块图标表明严重程度，右下角常驻一个动作 ——
   看完不能做什么的通知，等于把决定又推回给人自己去找入口。 */
function NoticeRow({ item, read, done, onOpen }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onOpen} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-5) var(--space-6)', cursor: 'pointer',
        borderBottom: '1px solid var(--border-subtle)', background: hover ? 'var(--surface-sunken)' : 'transparent',
        transition: 'var(--transition-control)', opacity: done ? 0.6 : 1,
      }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, flex: 'none', marginTop: 1,
        borderRadius: 'var(--radius-sm)', background: TONE_BG[item.tone], color: TONE_FG[item.tone],
      }}><Icon name={item.icon} size={14} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--fs-13)', fontWeight: read ? 'var(--fw-regular)' : 'var(--fw-medium)', color: 'var(--text-primary)' }}>{item.title}</span>
          {!read ? <span style={{ width: 6, height: 6, flex: 'none', borderRadius: 999, background: 'var(--brand-500, var(--status-danger-fg))' }} /> : null}
        </div>
        <p style={{ margin: '3px 0 0', fontSize: 'var(--fs-12)', lineHeight: 'var(--lh-normal)', color: 'var(--text-secondary)', textWrap: 'pretty' }}>{item.body}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 6, fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>
          <span>{item.account}</span><span>·</span><span>{item.at}</span>
          <span style={{ flex: 1 }} />
          {done ? (
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>已处理</span>
          ) : (
            <button type="button" onClick={(e) => { e.stopPropagation(); onOpen(); }} style={{
              display: 'inline-flex', alignItems: 'center', gap: 2, padding: '2px 0', border: 0, background: 'transparent',
              font: 'inherit', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)',
              whiteSpace: 'nowrap', cursor: 'pointer',
            }}>{item.cta}<Icon name="chevron-right" size={11} /></button>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatSidebar({ chat, onChat, account, onGoAccounts, onGoSettings, onGoWorkspace, onPlatform }) {
  const teamState = window.useTeam();
  const [query, setQuery] = React.useState('');
  const [searchFocus, setSearchFocus] = React.useState(false);
  const [tabPlat, setTabPlat] = React.useState(null);
  const [pins, setPins] = React.useState(ALL_CHATS.filter((h) => h.pinned).map((h) => h.id));
  const [open, setOpen] = React.useState(['pj1']);
  const togglePin = (id) => setPins((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleOpen = (id) => setOpen((o) => o.includes(id) ? o.filter((x) => x !== id) : [...o, id]);
  const withPin = (c) => ({ ...c, pinned: pins.includes(c.id) });
  const hit = (c) => c.title.includes(query);
  const pinned = ALL_CHATS.map(withPin).filter((c) => c.pinned && hit(c));
  const projects = PROJECTS.map((p) => ({ ...p, chats: p.chats.map(withPin).filter((c) => !c.pinned && hit(c)) }))
    .filter((p) => p.chats.length || !query);
  const loose = LOOSE_CHATS.map(withPin).filter((c) => !c.pinned && hit(c));
  const empty = !pinned.length && !loose.length && !projects.some((p) => p.chats.length);
  return (
    <aside style={{ width: 228, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--surface-page)' }}>
      <div style={{ padding: 'var(--space-4) var(--space-6) 0' }}>
        <AccountSwitcher account={account} onGoAccounts={onGoAccounts} onPlatform={onPlatform} />
      </div>
      <div style={{ padding: 'var(--space-6) var(--space-6) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <NewChatButton onClick={() => onChat && onChat(null)} />
        <SidebarLinkButton icon="sliders-horizontal" label="投放设置" onClick={onGoSettings} />
      </div>
      <Divider spacing="0" style={{ margin: '0 var(--space-6)' }} />
      <div style={{ padding: 'var(--space-6) var(--space-6) var(--space-5)' }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-4)', height: 32, padding: '0 var(--space-5)',
          /* 侧栏本身就是灰底，搜索框再用白底会像一块贴上去的卡片。
             底色反向取深一级，平时不描边；聚焦才翻成白底 + 描边，把“可以打字了”这件事留给聚焦态表达。 */
          background: searchFocus ? 'var(--neutral-0)' : 'var(--neutral-100)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid', borderColor: searchFocus ? 'var(--border-strong)' : 'transparent',
          transition: 'var(--transition-control)',
        }}>
          <Icon name="search" size={14} style={{ color: 'var(--text-tertiary)' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索历史对话"
            onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
            style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', font: 'inherit', fontSize: 'var(--fs-13)' }} />
          {query ? <button type="button" aria-label="清除" onClick={() => setQuery('')} style={{ display: 'inline-flex', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', color: 'var(--text-tertiary)' }}><Icon name="x" size={12} /></button> : null}
        </label>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-4) var(--space-6)' }}>
        {pinned.length ? <>
          <SectionLabel icon="pin">置顶</SectionLabel>
          {pinned.map((h) => <HistoryRow key={h.id} item={h} project={h.project} active={h.id === chat} onClick={() => onChat && onChat(h.id)} onTogglePin={() => togglePin(h.id)} />)}
        </> : null}
        <SectionLabel action={<IconButton icon="folder-plus" label="新建项目" size="sm" />}>项目</SectionLabel>
        {projects.map((p) => (
          <ProjectGroup key={p.id} project={p} expanded={open.includes(p.id) || !!query}
            onToggle={() => toggleOpen(p.id)} chat={chat} onChat={onChat} onTogglePin={togglePin} />
        ))}
        {loose.length ? <>
          <SectionLabel>其他聊天历史</SectionLabel>
          {loose.map((h) => <HistoryRow key={h.id} item={h} active={h.id === chat} onClick={() => onChat && onChat(h.id)} onTogglePin={() => togglePin(h.id)} />)}
        </> : null}
        {empty ? <div style={{ padding: 'var(--space-6) var(--space-5)', fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)' }}>没有匹配的对话</div> : null}
      </div>
      <SidebarAccount name="天了噜鸭梨" phone="198****7311"
        teams={teamState.teams} teamId={teamState.team.id} onTeamChange={teamState.setTeam} onCreateTeam={teamState.createTeam}
        onSelect={(id) => { if (id === 'logout') { window.HUITOU_LOGOUT && window.HUITOU_LOGOUT(); } else if (id === 'prefs') { onGoSettings && onGoSettings(); } else if (onGoWorkspace) onGoWorkspace(id === 'help' ? 'help' : id === 'billing' ? 'billing' : id === 'team' ? 'team' : 'profile'); }} />
    </aside>
  );
}


/* ID 在窄侧栏里只留后 6 位：前缀是账户段位，几个账户之间不变，尾号才是区分位。
   完整 ID 挂在 title 上。 */
const shortId = (id) => (String(id || '').length > 6 ? '…' + String(id).slice(-6) : String(id || ''));

/* 当前账户由外层持有：从工作台点进某个账户，也要能把切换器同步过来 ——
   否则左上角还写着上一个账户，而右侧图标栏已经换成新平台的了。 */
function AccountSwitcher({ account, onGoAccounts, onPlatform, compact }) {
  const teamState = window.useTeam();   // 订阅团队变化，切了要重算可选账户
  const trigger = React.useRef(null);
  const [rect, setRect] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [local, setCurrent] = React.useState(SWITCH_ACCOUNTS.find((x) => x.platform === '腾讯营销') || SWITCH_ACCOUNTS[0]);
  const current = account || local;
  const [tabPlat, setTabPlat] = React.useState(null);
  const [pins, setPins] = React.useState(SWITCH_ACCOUNTS.filter((x) => x.pinned).map((x) => x.id));
  const [q, setQ] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const togglePin = (id) => setPins((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  /* 切账户可能同时切平台，导航要跟着换 —— 交给外层决定，这里只上报。 */
  const pick = (x) => { setCurrent(x); setOpen(false); if (onPlatform) onPlatform(x.platform, x); };
  React.useEffect(() => { if (onPlatform) onPlatform(current.platform, current); }, []);
  /* 换团队后当前账户可能已不属于这个团队 —— 自动落到新团队的第一个账户，
     否则头部还写着上个团队的账户，而切换器里根本选不到它。 */
  const teamId = teamState.team.id;
  React.useEffect(() => {
    if (!window.teamInTeam || window.teamInTeam(current.id)) return;
    const next = SWITCH_ACCOUNTS.find((x) => window.teamInTeam(x.id));
    if (next) { setCurrent(next); if (onPlatform) onPlatform(next.platform, next); }
  }, [teamId]);
  const hit = (x) => x.name.includes(q) || x.account.includes(q) || (x.tag || '').includes(q);
  /* 账户可能上百个，平台在这里必须是并列的入口而不是一节一节往下铺 ——
     否则第二个平台永远在滚动条尽头。置顶组跟着当前平台走。 */
  const PLATS = ['巨量千川', '腾讯营销'];
  const plat = tabPlat || (PLATS.includes(current.platform) ? current.platform : PLATS[0]);
  /* 只列当前团队名下的账户 —— 团队切了而这里不变，切换就只是个装饰 */
  const scoped = SWITCH_ACCOUNTS.filter((x) => teamState.inTeam(x.id));
  const all = scoped.map((x) => ({ ...x, pinned: pins.includes(x.id) })).filter(hit);
  const counts = PLATS.reduce((m, p) => Object.assign(m, { [p]: all.filter((x) => x.platform === p).length }), {});
  const list = all.filter((x) => x.platform === plat);
  const pinned = list.filter((x) => x.pinned);
  const rest = list.filter((x) => !x.pinned);

  return (
    <div style={{ position: 'relative' }}>
      <button ref={trigger} type="button"
        onClick={() => {
          const el = trigger.current;
          if (el) setRect(el.getBoundingClientRect());
          setTabPlat(null);
          setOpen((o) => !o);
        }} title={compact ? (current.tag || current.name) + ' · 切换账户' : undefined} style={{
        display: 'flex', alignItems: 'center', justifyContent: compact ? 'center' : 'flex-start',
        gap: 'var(--space-5)', width: compact ? 40 : '100%', height: compact ? 40 : 'auto', padding: compact ? 0 : 'var(--space-5)',
        background: 'var(--neutral-0)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', font: 'inherit', textAlign: 'left',
        border: '1px solid', borderColor: open ? 'var(--border-strong)' : 'var(--border-subtle)', transition: 'var(--transition-control)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flex: 'none', color: 'var(--blue-600)' }}>
          <window.PlatformMark platform={current.platform} size={26} fallback="chart-column" />
        </span>
        {compact ? null : <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{current.tag || current.name}</span>
          {/* 平台已由左侧图标表明，副行留 ID 与账户原名 */}
          {/* 名字吃掉所有截断，ID 固定宽不参与压缩 —— 半截的号码比没有号码更难读 */}
          <span title={[current.tag ? current.name : '', current.account].filter(Boolean).join(' · ')}
            style={{ display: 'flex', alignItems: 'baseline', gap: 4, fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', minWidth: 0 }}>
            {current.tag ? <span style={{ flex: '0 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{current.name}</span> : null}
            {current.tag && current.account ? <span style={{ flex: 'none' }}>·</span> : null}
            {current.account ? <span style={{ flex: 'none', fontFamily: 'var(--font-mono)' }}>{shortId(current.account)}</span> : null}
          </span>
        </span>}
        {compact ? null : <Icon name="chevrons-up-down" size={14} style={{ color: 'var(--text-tertiary)' }} />}
      </button>
      {open ? (
        <>
          <span onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
          {/* 固定定位：侧栏为展开动画设了 overflow:hidden，绝对定位会被裁掉 */}
          <div style={{
            position: 'fixed', zIndex: 55,
            top: rect ? rect.bottom + 6 : 0, left: rect ? rect.left : 0,
            width: rect ? Math.max(rect.width * 1.5, 342) : 342,
            background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-panel)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
            animation: 'huitou-rise var(--duration-normal) var(--ease-standard) both',
          }}>
            <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)', height: 32, padding: '0 var(--space-5)',
                background: 'var(--neutral-0)', borderRadius: 'var(--radius-sm)',
                border: '1px solid', borderColor: focus ? 'var(--border-strong)' : 'var(--border-subtle)',
                transition: 'var(--transition-control)',
              }}>
                <Icon name="search" size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索账户名称或 ID"
                  onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                  style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', font: 'inherit', fontSize: 'var(--fs-13)' }} />
                {q ? <button type="button" aria-label="清除" onClick={() => setQ('')} style={{ display: 'inline-flex', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', color: 'var(--text-tertiary)' }}><Icon name="x" size={12} /></button> : null}
              </label>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-5)', padding: '0 var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
              {PLATS.map((p) => {
                const on = p === plat;
                return (
                  <button key={p} type="button" onClick={() => setTabPlat(p)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) 2px',
                      background: 'none', border: 0, borderBottom: '2px solid ' + (on ? 'var(--text-primary)' : 'transparent'),
                      marginBottom: -1, font: 'inherit', fontSize: 'var(--fs-13)',
                      fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)',
                      color: on ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition-control)',
                    }}>
                    <window.PlatformMark platform={p} size={14} fallback="megaphone" />
                    {p}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{counts[p]}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ maxHeight: 336, overflowY: 'auto', padding: 'var(--space-3)' }}>
              {pinned.length ? <>
                <SwitchLabel icon="pin">置顶账户</SwitchLabel>
                {pinned.map((x) => <AccountRow key={x.id} item={x} current={x.id === current.id}
                  onPick={() => pick(x)} onTogglePin={() => togglePin(x.id)} />)}
              </> : null}
              {rest.length ? <>
                {pinned.length ? <SwitchLabel>全部账户</SwitchLabel> : null}
                {rest.map((x) => <AccountRow key={x.id} item={x} current={x.id === current.id}
                  onPick={() => pick(x)} onTogglePin={() => togglePin(x.id)} />)}
              </> : null}
              {!list.length ? <div style={{ padding: 'var(--space-7) var(--space-5)', fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                {q ? '这个平台下没有匹配的账户' : '这个平台还没有接入账户'}
              </div> : null}
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 'var(--space-3)' }}>
              <SwitchFooterItem icon="table-2" label="查看全部账户" onClick={() => { setOpen(false); onGoAccounts && onGoAccounts(); }} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

/* 侧栏次级入口：悬停有底色反馈，点击跳转对应页面 */
function SidebarLinkButton({ icon, label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)', height: 40, padding: '0 var(--space-6)',
        background: hover ? 'var(--surface-hover)' : 'transparent', border: 0, borderRadius: 'var(--radius-pill)',
        font: 'inherit', fontSize: 'var(--fs-14)', cursor: 'pointer', textAlign: 'left',
        color: 'var(--text-primary)', transition: 'var(--transition-control)',
      }}>
      <Icon name={icon} size={17} style={{ color: 'var(--text-secondary)' }} />{label}
    </button>
  );
}

/* 新聊天：悬停加深、按下轻微内缩，点击后图标转一圈，明确「已新建」 */
function NewChatButton({ onClick }) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const [spin, setSpin] = React.useState(0);
  return (
    <button type="button"
      onClick={() => { setSpin((n) => n + 1); onClick && onClick(); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)', height: 40, padding: '0 var(--space-6)',
        background: down ? 'var(--surface-active)' : hover ? 'var(--surface-hover)' : 'var(--neutral-0)',
        borderWidth: 1, borderStyle: 'solid', borderColor: hover ? 'var(--border-default)' : 'var(--border-default)',
        borderRadius: 'var(--radius-pill)', font: 'inherit', fontSize: 'var(--fs-14)',
        fontWeight: 'var(--fw-medium)', cursor: 'pointer', textAlign: 'left',
        transition: 'var(--transition-control)',
      }}>
      <span key={spin} style={{ display: 'inline-flex', flex: 'none', animation: spin ? 'huitou-spin 420ms var(--ease-standard)' : undefined }}>
        <Icon name="circle-plus" size={17} style={{ color: 'var(--text-secondary)' }} />
      </span>
      新聊天
    </button>
  );
}

function SwitchFooterItem({ icon, label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%', height: 34,
        padding: '0 var(--space-5)', border: 0, borderRadius: 'var(--radius-sm)',
        background: hover ? 'var(--surface-hover)' : 'transparent',
        font: 'inherit', fontSize: 'var(--fs-13)', cursor: 'pointer', textAlign: 'left',
        color: hover ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'var(--transition-control)',
      }}>
      <Icon name={icon} size={15} /><span style={{ flex: 1 }}>{label}</span>
      {onClick ? <Icon name="arrow-right" size={13} style={{ color: 'var(--text-tertiary)' }} /> : null}
    </button>
  );
}

function SwitchLabel({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: 'var(--space-5) var(--space-5) var(--space-3)', fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)' }}>
      {icon ? <Icon name={icon} size={11} /> : null}{children}
    </div>
  );
}

function AccountRow({ item, current, showPlatform, onPick, onTogglePin }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onPick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '5px var(--space-3) 5px var(--space-5)',
        borderRadius: 'var(--radius-md)', cursor: 'pointer',
        background: current ? 'var(--surface-selected)' : hover ? 'var(--surface-hover)' : 'transparent',
        transition: 'var(--transition-control)',
      }}>
      {/* 置顶组混着两个平台，用品牌标区分，比再写一遍平台名省一整行宽度 */}
      {showPlatform ? <window.PlatformMark platform={item.platform} size={14} fallback="megaphone" style={{ marginRight: 2 }} /> : null}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 'var(--fs-13)', fontWeight: current ? 'var(--fw-medium)' : 'var(--fw-regular)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.tag || item.name}</span>
        <span title={[item.tag ? item.name : '', item.account].filter(Boolean).join(' · ')}
          style={{ display: 'flex', alignItems: 'baseline', gap: 4, fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', minWidth: 0 }}>
          {item.tag ? <span style={{ flex: '0 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span> : null}
          {item.tag ? <span style={{ flex: 'none' }}>·</span> : null}
          <span style={{ flex: 'none', fontFamily: 'var(--font-mono)' }}>{shortId(item.account)}</span>
        </span>
      </span>
      {hover
        ? <IconButton icon="pin" label={item.pinned ? '取消置顶' : '置顶'} size="sm" active={item.pinned}
            onClick={(e) => { e.stopPropagation(); onTogglePin && onTogglePin(); }} />
        : current
          ? <Icon name="check" size={14} style={{ color: 'var(--text-primary)', marginRight: 7 }} />
          : item.pinned ? <Icon name="pin" size={11} style={{ color: 'var(--text-tertiary)', marginRight: 8 }} /> : null}
    </div>
  );
}

function SectionLabel({ icon, action, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: 'var(--space-5) var(--space-3) var(--space-3) var(--space-5)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
      {icon ? <Icon name={icon} size={12} /> : null}{children}
      {action ? <><span style={{ flex: 1 }} />{action}</> : null}
    </div>
  );
}

function ProjectGroup({ project, expanded, onToggle, chat, onChat, onTogglePin }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ marginBottom: 2 }}>
      <div onClick={onToggle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-4)', height: 34,
          padding: '0 var(--space-3) 0 var(--space-4)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
          background: hover ? 'var(--surface-hover)' : 'transparent', transition: 'var(--transition-control)',
        }}>
        <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={13} style={{ color: 'var(--text-tertiary)' }} />
        <Icon name={expanded ? 'folder-open' : 'folder'} size={15} style={{ color: 'var(--text-secondary)' }} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</span>
        {hover
          ? <IconButton icon="ellipsis" label="项目操作" size="sm" onClick={(e) => e.stopPropagation()} />
          : <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', marginRight: 6 }}>{project.chats.length}</span>}
      </div>
      {expanded ? (
        <div style={{ marginLeft: 15, paddingLeft: 'var(--space-4)', borderLeft: '1px solid var(--border-subtle)' }}>
          {project.chats.length
            ? project.chats.map((c) => <HistoryRow key={c.id} item={c} active={c.id === chat} onClick={() => onChat && onChat(c.id)} onTogglePin={() => onTogglePin(c.id)} />)
            : <div style={{ padding: 'var(--space-4) var(--space-5)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>项目内暂无对话</div>}
        </div>
      ) : null}
    </div>
  );
}

function HistoryRow({ item, project, active, onClick, onTogglePin }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 34, padding: '4px var(--space-3) 4px var(--space-5)',
        borderRadius: 'var(--radius-md)', cursor: 'pointer',
        background: active ? 'var(--surface-selected)' : hover ? 'var(--surface-hover)' : 'transparent',
        transition: 'var(--transition-control)',
      }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 'var(--fs-14)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
        {project ? <span style={{ display: 'block', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project}</span> : null}
      </span>
      {hover ? (
        <>
          <IconButton icon="pin" label={item.pinned ? '取消置顶' : '置顶'} size="sm" active={item.pinned}
            onClick={(e) => { e.stopPropagation(); onTogglePin && onTogglePin(); }} />
          <IconButton icon="folder-input" label="移到项目" size="sm" onClick={(e) => e.stopPropagation()} />
        </>
      ) : item.pinned
        ? <Icon name="pin" size={12} style={{ color: 'var(--text-tertiary)', marginRight: 6 }} />
        : item.time ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', flex: 'none', marginRight: 6 }}>{item.time}</span> : null}
    </div>
  );
}

function IconRail({ rail, onRail, platform = '巨量千川' }) {
  const items = RAIL_BY_PLATFORM[platform] || RAIL;
  return (
    <nav style={{ width: 64, flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-6) 0', background: 'var(--neutral-0)', borderLeft: '1px solid var(--border-subtle)' }}>
      {items.map((r) => {
        const on = r.id === rail;
        return (
          <button key={r.id} type="button" title={r.label} onClick={() => onRail && onRail(r.id)}
            style={{
              position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              width: 56, padding: 'var(--space-5) 0', border: 0, borderRadius: 'var(--radius-md)',
              background: on ? 'var(--surface-selected)' : 'transparent',
              color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
              font: 'inherit', cursor: 'pointer', transition: 'var(--transition-control)',
            }}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon name={r.icon} size={20} />
              {r.dot ? <span style={{ position: 'absolute', top: -2, right: -3, width: 6, height: 6, borderRadius: 999, background: 'var(--status-danger-fg)' }} /> : null}
            </span>
            <span style={{ fontSize: 'var(--fs-11)', whiteSpace: 'nowrap' }}>{r.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function PaneHeader({ title, actions, sidebarOpen = true, onToggleSidebar }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', height: 56, flex: 'none', padding: '0 var(--space-8) 0 var(--space-6)' }}>
      <IconButton icon={sidebarOpen ? 'panel-left-close' : 'panel-left-open'} label={sidebarOpen ? '收起左侧栏' : '展开左侧栏'} onClick={onToggleSidebar} />
      <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
      <div style={{ flex: 1 }} />
      {actions || <IconButton icon="ellipsis" label="更多" />}
    </div>
  );
}

/* 右侧数据面板的标题行：标题 + 关闭。 */
function DetailHeader({ title, actions, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', height: 56, flex: 'none', padding: '0 var(--space-7)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--neutral-0)' }}>
      <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap' }}>{title}</span>
      <div style={{ flex: 1 }} />
      {actions}
      <IconButton icon="panel-right-close" label="收起面板" onClick={onClose} />
    </div>
  );
}

/* 面板可窄可宽：标题与操作在窄栏下自动换行堆叠。
   说明文字不常驻 —— 每页顶上一段灰字，第二次来就只是占位。收进标题旁的问号。 */
function PageHeader({ title, description, actions, onBack }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-5) var(--space-8)', marginBottom: 'var(--space-8)' }}>
      <div style={{ flex: '1 1 260px', minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {/* 子页面的返回口在标题左侧 —— 进来时看的就是这里，回去也应该在这里 */}
        {onBack ? <IconButton icon="arrow-left" label="返回" variant="ghost" onClick={onBack} /> : null}
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0, fontSize: 'var(--fs-20)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)' }}>
          {title}{description ? <window.InfoHint label={description} width={300} /> : null}
        </h1>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>{actions}</div>
    </div>
  );
}

Object.assign(window, { RAIL_BY_PLATFORM, AppShell, PaneHeader, DetailHeader, PageHeader, SplitHandle, HUITOU_PROMPTS: PROMPTS });
})();
