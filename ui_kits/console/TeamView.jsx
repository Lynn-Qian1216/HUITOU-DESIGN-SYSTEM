(() => {
const { Icon, IconButton, Button, Badge, Card, Checkbox, DataTable, EmptyState, Input, Select, FilterSelect, FormField, Dialog, DropdownMenu, StatusDot, Tabs, Alert } = window.HUITOUAIDesignSystem_52606d;
const { FilterBar } = window;

/* 团队管理。一个团队 = 一组成员 + 一批归属它的广告账户。
   这一页要回答三个问题，所以是三个页签：谁在里面、管着哪些账户、各角色能做什么。
   权限的分界不是「能看什么」，而是「能不能让 AI 直接动钱」—— 所以角色只有三档，
   且所有会削弱管控的操作（降级、停用、移出、解散）都要过一次确认。 */

const ROLE_LABEL = { owner: '拥有者', admin: '管理员', operator: '操作员' };
const ROLE_ORDER = ['owner', 'admin', 'operator'];

/* 权限项。lock 的两项不可改：拥有者一列全开（否则能把自己锁出去），
   「查看数据」是所有角色的底线，关掉这个人就不该在团队里。 */
const CAPS = [
  { id: 'view', cap: '查看数据与报告', owner: true, admin: true, operator: true, lock: true },
  { id: 'approve', cap: '在授权账户内审批 AI 决策', owner: true, admin: true, operator: true },
  { id: 'auto', cap: '让 AI 直接执行（免审批）', owner: true, admin: true, operator: false },
  { id: 'accounts', cap: '接入 / 移出广告账户', owner: true, admin: true, operator: false },
  { id: 'members', cap: '邀请成员、调整角色', owner: true, admin: true, operator: false },
  { id: 'team', cap: '转让拥有者、解散团队', owner: true, admin: false, operator: false, lock: true },
];
const CAPS_DEFAULT = CAPS.reduce((m, c) => Object.assign(m, { [c.id]: { admin: c.admin, operator: c.operator } }), {});
const BUDGET_DEFAULT = { owner: '不限', admin: '20000', operator: '5000' };

const MEMBERS_BY_TEAM = {
  t1: [
    { id: 'm1', name: '用户7563', phone: '150****7563', role: 'admin', status: 'active', last: '刚刚' },
    { id: 'm2', name: '用户3390', phone: '130****3390', role: 'operator', status: 'active', last: '12 分钟前' },
    { id: 'm3', name: '用户1786', phone: '182****1786', role: 'operator', status: 'active', last: '3 小时前' },
    { id: 'm4', name: '用户7311', phone: '198****7311', role: 'owner', status: 'active', last: '刚刚', me: true },
    { id: 'm5', name: '用户8742', phone: '182****8742', role: 'operator', status: 'disabled', last: '8 天前' },
    { id: 'm6', name: '用户2064', phone: '155****2064', role: 'operator', status: 'invited', last: '—' },
  ],
  t2: [
    { id: 'n1', name: '用户2210', phone: '139****2210', role: 'owner', status: 'active', last: '1 小时前' },
    { id: 'n2', name: '用户7311', phone: '198****7311', role: 'admin', status: 'active', last: '刚刚', me: true },
    { id: 'n3', name: '用户5164', phone: '186****5164', role: 'admin', status: 'active', last: '昨天' },
    { id: 'n4', name: '用户9038', phone: '133****9038', role: 'operator', status: 'active', last: '2 小时前' },
    { id: 'n5', name: '用户4471', phone: '159****4471', role: 'operator', status: 'active', last: '昨天' },
    { id: 'n6', name: '用户6620', phone: '188****6620', role: 'operator', status: 'active', last: '3 天前' },
    { id: 'n7', name: '用户1903', phone: '137****1903', role: 'operator', status: 'invited', last: '—' },
    { id: 'n8', name: '用户8855', phone: '176****8855', role: 'operator', status: 'disabled', last: '20 天前' },
  ],
  t3: [
    { id: 'x1', name: '用户3077', phone: '135****3077', role: 'owner', status: 'active', last: '昨天' },
    { id: 'x2', name: '用户7311', phone: '198****7311', role: 'operator', status: 'active', last: '刚刚', me: true },
    { id: 'x3', name: '用户4402', phone: '187****4402', role: 'operator', status: 'active', last: '5 小时前' },
  ],
};

/* 归属列表直接由全局账户表 + 团队映射得出，和「广告账户」「广告计划」看到的是同一批 */
const OWNED_BY_TEAM = new Proxy({}, {
  get: (_, id) => ((window.HUITOU_TEAMS || []).find((t) => t.id === id) || { accounts: [] }).accounts
    .map((aid) => (window.HUITOU_ACCOUNTS || []).find((a) => a.id === aid))
    .filter(Boolean)
    .map((a) => ({ id: a.id, platform: a.platform, account: a.account, name: a.name })),
});

/* 还没归属任何团队的账户，「分配账户」从这里挑 */
const UNASSIGNED = [
  { id: 'u1', platform: 'qianchuan', account: '00000003', name: '新品试销 — 藤椒味' },
  { id: 'u2', platform: 'qianchuan', account: '00000004', name: '会员召回 — 秋季' },
  { id: 'u3', platform: 'tencent', account: '31000004', name: '易诚保险 · 小程序新客' },
];

const PLATFORM_LABEL = { tencent: '腾讯营销', qianchuan: '巨量千川' };

/* 改过的团队名放模块级，切换器与身份行读同一份 —— 放组件 state 里会出现两个名字并存 */
function teamMeta(id) {
  const ms = MEMBERS_BY_TEAM[id] || [];
  const me = ms.find((m) => m.me) || {};
  const invited = ms.filter((m) => m.status === 'invited').length;
  return { members: ms.length, invited: invited, accounts: (OWNED_BY_TEAM[id] || []).length, role: me.role };
}

function TeamView() {
  const store = window.useTeam();
  const team = store.team.id;
  const [members, setMembers] = React.useState(() => MEMBERS_BY_TEAM[team] || MEMBERS_BY_TEAM.t1);
  const [owned, setOwned] = React.useState(() => OWNED_BY_TEAM[team] || []);
  /* 团队由左下角的全局切换器决定，这一页只管「当前团队」 */
  React.useEffect(() => {
    setMembers(MEMBERS_BY_TEAM[team] || [{ id: 'me', name: '用户7311', phone: '198****7311', role: 'owner', status: 'active', last: '刚刚', me: true }]);
    setOwned(OWNED_BY_TEAM[team] || []);
  }, [team]);
  const [tab, setTab] = React.useState('members');
  const [invite, setInvite] = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);   // 破坏性操作统一走确认
  const [renaming, setRenaming] = React.useState(null);
  const [gone, setGone] = React.useState({});           // 已退出 / 已解散的团队

  const cur = store.team;
  const mine = members.find((m) => m.me) || {};
  const canManage = mine.role === 'owner' || mine.role === 'admin';
  const owners = members.filter((m) => m.role === 'owner' && m.status === 'active');

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--fs-20)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)' }}>
          团队管理<window.InfoHint label="团队决定谁能看到哪些广告账户，以及谁能让 AI 直接执行。" width={300} />
        </h1>
        <span style={{ flex: 1 }} />
        {/* 菜单只列这个角色真能做的事 —— 与「角色权限」页签的对照表必须一致 */}
        <DropdownMenu align="right" trigger={<Button variant="secondary" iconLeft="settings">团队设置</Button>} items={[]
          .concat(canManage ? [{ id: 'rename', label: '重命名团队', icon: 'pencil', onClick: () => setRenaming({ name: cur.name }) }] : [])
          .concat(mine.role === 'owner' ? [{ id: 'transfer', label: '转让拥有者', icon: 'crown', onClick: () => setConfirm({ kind: 'transfer', to: (members.find((m) => !m.me && m.status === 'active') || {}).id }) }] : [])
          .concat(canManage ? [{ divider: true }] : [])
          .concat([{ id: 'leave', label: '退出团队', icon: 'log-out', disabled: mine.role === 'owner' && owners.length <= 1, onClick: () => setConfirm({ kind: 'leave' }) }])
          .concat(mine.role === 'owner' ? [{ id: 'delete', label: '解散团队', icon: 'trash-2', tone: 'danger', onClick: () => setConfirm({ kind: 'delete' }) }] : [])
        } />
      </div>

      {/* 当前团队的身份行：切完团队要立刻看清自己在这里是谁 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap', marginBottom: 'var(--space-6)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
        <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-primary)', fontWeight: 'var(--fw-medium)' }}>{cur.name}</span>
        <Badge tone={mine.role === 'owner' ? 'ai' : 'neutral'}>我的角色：{ROLE_LABEL[mine.role] || '—'}</Badge>
        <span>{members.length} 名成员{members.filter((m) => m.status === 'invited').length ? '（含 ' + members.filter((m) => m.status === 'invited').length + ' 人待接受）' : ''} · {owned.length} 个广告账户 · 创建于 {cur.created}</span>
      </div>

      <Tabs value={tab} onChange={setTab} style={{ marginBottom: 'var(--space-6)' }} items={[
        { id: 'members', label: '成员', count: members.length },
        { id: 'accounts', label: '广告账户', count: owned.length },
        { id: 'roles', label: '角色权限' },
      ]} />

      {gone[team] ? (
        <Card><EmptyState icon={gone[team] === 'left' ? 'log-out' : 'trash-2'}
          title={gone[team] === 'left' ? '你已退出这个团队' : '团队已解散'}
          description={gone[team] === 'left' ? '需要由团队成员重新邀请才能再次进入。' : '名下广告账户已回到未分配池。'} /></Card>
      ) : tab === 'members' ? (
        <MembersTab members={members} setMembers={setMembers} canManage={canManage} owners={owners}
          onInvite={() => setInvite({ phone: '', role: 'operator' })} onConfirm={setConfirm} />
      ) : tab === 'accounts' ? (
        <AccountsTab owned={owned} setOwned={setOwned} canManage={canManage} teamName={cur.name} />
      ) : (
        <RolesTab myRole={mine.role} isOwner={mine.role === 'owner'} />
      )}

      <Dialog open={!!invite} width={420} title="添加成员" onClose={() => setInvite(null)}
        footer={<>
          <Button onClick={() => setInvite(null)}>取消</Button>
          <Button variant="primary" disabled={!invite || invite.phone.length < 11}
            onClick={() => {
              setMembers((v) => v.concat([{ id: 'i' + Date.now(), name: '用户' + invite.phone.slice(-4), phone: invite.phone.slice(0, 3) + '****' + invite.phone.slice(-4), role: invite.role, status: 'invited', last: '—' }]));
              setInvite(null);
            }}>发送邀请</Button>
        </>}>
        {invite ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <FormField label="手机号" hint="对方用这个号码登录后自动加入本团队">
              <Input value={invite.phone} placeholder="11 位手机号"
                onChange={(e) => setInvite(Object.assign({}, invite, { phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 11) }))} />
            </FormField>
            <FormField label="角色" hint={invite.role === 'admin' ? '管理员可让 AI 免审批直接执行' : '操作员的决策需审批后才会落地'}>
              <Select value={ROLE_LABEL[invite.role]} options={['管理员', '操作员']} width="100%"
                onChange={(e) => setInvite(Object.assign({}, invite, { role: e.target.value === '管理员' ? 'admin' : 'operator' }))} />
            </FormField>
          </div>
        ) : null}
      </Dialog>

      <Dialog open={!!renaming} width={420} title="重命名团队" onClose={() => setRenaming(null)}
        footer={<>
          <Button onClick={() => setRenaming(null)}>取消</Button>
          <Button variant="primary" disabled={!renaming || !renaming.name.trim()}
            onClick={() => { store.renameTeam(team, renaming.name.trim()); setRenaming(null); }}>保存</Button>
        </>}>
        {renaming ? (
          <FormField label="团队名称"><Input value={renaming.name} onChange={(e) => setRenaming({ name: e.target.value })} /></FormField>
        ) : null}
      </Dialog>

      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} teamName={cur.name} members={members}
        onPick={(id) => setConfirm((c) => Object.assign({}, c, { to: id }))}
        onDone={(kind, payload) => {
          if (kind === 'remove') setMembers((v) => v.filter((m) => m.id !== payload.id));
          if (kind === 'demote') setMembers((v) => v.map((m) => (m.id === payload.id ? Object.assign({}, m, { role: payload.role }) : m)));
          /* 转让：接任者成为拥有者，我降为管理员 */
          if (kind === 'transfer') setMembers((v) => v.map((m) => (m.id === confirm.to ? Object.assign({}, m, { role: 'owner' }) : m.me ? Object.assign({}, m, { role: 'admin' }) : m)));
          if (kind === 'leave') { setMembers((v) => v.filter((m) => !m.me)); setGone((g) => Object.assign({}, g, { [team]: 'left' })); }
          if (kind === 'delete') { setMembers([]); setOwned([]); setGone((g) => Object.assign({}, g, { [team]: 'deleted' })); }
          setConfirm(null);
        }} />
    </>
  );
}

function MembersTab({ members, setMembers, canManage, owners, onInvite, onConfirm }) {
  const [q, setQ] = React.useState('');
  const [role, setRole] = React.useState('全部角色');
  const [status, setStatus] = React.useState('全部状态');

  const rows = members
    .filter((m) => !q || m.name.includes(q) || m.phone.includes(q))
    .filter((m) => role === '全部角色' || ROLE_LABEL[m.role] === role)
    .filter((m) => status === '全部状态' || (status === '启用' ? m.status === 'active' : status === '待接受' ? m.status === 'invited' : m.status === 'disabled'));

  const setRoleOf = (id, next) => setMembers((v) => v.map((m) => (m.id === id ? Object.assign({}, m, { role: next }) : m)));
  const toggle = (id) => setMembers((v) => v.map((m) => (m.id === id ? Object.assign({}, m, { status: m.status === 'active' ? 'disabled' : 'active' }) : m)));

  return (
    <>
      <Card padded={false} style={{ marginBottom: 'var(--space-6)' }}>
        <FilterBar inset trailing={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {canManage ? null : <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>仅管理员可添加</span>}
            <Button size="sm" variant="primary" iconLeft="user-plus" disabled={!canManage} onClick={onInvite}>添加成员</Button>
          </span>
        }>
          <Input placeholder="搜索姓名或手机号" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 220 }} />
          <FilterSelect value={role} onChange={setRole} width={124}
            options={['全部角色'].concat(ROLE_ORDER.map((r) => ROLE_LABEL[r])).map((o) => ({ label: o, count: o === '全部角色' ? members.length : members.filter((m) => ROLE_LABEL[m.role] === o).length }))} />
          <FilterSelect value={status} onChange={setStatus} width={124}
            options={['全部状态', '启用', '待接受', '停用'].map((o) => ({ label: o }))} />
        </FilterBar>
      </Card>

      <Card padded={false}>
        {rows.length ? (
          <DataTable
            rows={rows}
            columns={[
              { key: 'name', header: '成员', render: (r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  {r.name}
                  {r.me ? <Badge tone="neutral">我</Badge> : null}
                </span>
              ) },
              { key: 'phone', header: '手机号', mono: true },
              { key: 'role', header: '角色', render: (r) => <Badge tone={r.role === 'owner' ? 'ai' : 'neutral'}>{ROLE_LABEL[r.role]}</Badge> },
              { key: 'status', header: '状态', render: (r) => (
                r.status === 'invited'
                  ? <StatusDot tone="warning" label="待接受" style={{ fontSize: 'var(--fs-12)' }} />
                  : <StatusDot tone={r.status === 'active' ? 'success' : 'neutral'} label={r.status === 'active' ? '启用' : '停用'} style={{ fontSize: 'var(--fs-12)' }} />
              ) },
              { key: 'last', header: '最近活跃', muted: true },
              canManage ? { key: 'act', header: '操作', align: 'right', render: (r) => {
                /* 唯一的活跃拥有者不能被降级或停用；自己的角色只能由别人改 —— 否则会把团队锁死 */
                const lastOwner = r.role === 'owner' && owners.length <= 1;
                if (r.status === 'invited') {
                  return (
                    <span style={{ display: 'inline-flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                      <Button size="sm" variant="ghost">重新发送</Button>
                      <Button size="sm" variant="ghost" onClick={() => setMembers((v) => v.filter((m) => m.id !== r.id))}>撤销</Button>
                    </span>
                  );
                }
                return (
                  <DropdownMenu align="right" trigger={<IconButton icon="ellipsis" label="更多操作" size="sm" />} items={[
                    { id: 'admin', label: '设为管理员', icon: 'shield', disabled: r.me || lastOwner || r.role === 'admin', onClick: () => setRoleOf(r.id, 'admin') },
                    { id: 'operator', label: '设为操作员', icon: 'user', disabled: r.me || lastOwner || r.role === 'operator', onClick: () => onConfirm({ kind: 'demote', member: r, role: 'operator' }) },
                    { divider: true },
                    { id: 'toggle', label: r.status === 'active' ? '停用' : '启用', icon: r.status === 'active' ? 'user-x' : 'user-check', disabled: r.me || lastOwner, onClick: () => toggle(r.id) },
                    { id: 'remove', label: '移出团队', icon: 'trash-2', tone: 'danger', disabled: r.me || lastOwner, onClick: () => onConfirm({ kind: 'remove', member: r }) },
                  ]} />
                );
              } } : null,
            ].filter(Boolean)}
          />
        ) : <EmptyState compact icon="search-x" title="没有符合条件的成员" description="换个关键词，或把筛选放宽。" />}
      </Card>
    </>
  );
}

function AccountsTab({ owned, setOwned, canManage, teamName }) {
  const [q, setQ] = React.useState('');
  const [plat, setPlat] = React.useState('全部平台');
  const [sel, setSel] = React.useState([]);
  const [assign, setAssign] = React.useState(null);

  const rows = owned
    .filter((a) => !q || a.name.includes(q) || a.account.includes(q))
    .filter((a) => plat === '全部平台' || PLATFORM_LABEL[a.platform] === plat);
  const toggle = (id) => setSel((v) => (v.includes(id) ? v.filter((x) => x !== id) : v.concat(id)));
  const removeMany = () => { setOwned((v) => v.filter((a) => !sel.includes(a.id))); setSel([]); };

  return (
    <>
      <Alert tone="info" title="同一平台账户只能属于一个团队" style={{ marginBottom: 'var(--space-6)' }}>
        把账户移出后，它会回到未分配池，任何团队都可以重新认领；团队成员随即失去该账户的数据与操作权限。
      </Alert>

      <Card padded={false} style={{ marginBottom: 'var(--space-6)' }}>
        <FilterBar inset trailing={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {canManage ? null : <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>仅管理员可分配</span>}
            <Button size="sm" variant="primary" iconLeft="plus" disabled={!canManage} onClick={() => setAssign([])}>分配账户</Button>
          </span>
        }>
          <Input placeholder="搜索名称或账户 ID" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 220 }} />
          <FilterSelect value={plat} onChange={setPlat} width={136}
            options={['全部平台', '腾讯营销', '巨量千川'].map((o) => ({ label: o, count: o === '全部平台' ? owned.length : owned.filter((a) => PLATFORM_LABEL[a.platform] === o).length }))} />
          {sel.length ? <Button size="sm" variant="danger" iconLeft="unplug" onClick={removeMany}>移出所选 {sel.length}</Button> : null}
        </FilterBar>
      </Card>

      <Card padded={false}>
        {rows.length ? (
          <DataTable
            rows={rows} selectable={canManage} selected={sel} onToggleRow={toggle}
            columns={[
              { key: 'platform', header: '广告平台', render: (r) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <window.PlatformMark platform={r.platform} size={14} fallback="megaphone" />
                  {PLATFORM_LABEL[r.platform]}
                </span>
              ) },
              { key: 'account', header: '账户 ID', mono: true },
              { key: 'name', header: '名称' },
              canManage ? { key: 'act', header: '操作', align: 'right', render: (r) => (
                <Button size="sm" variant="ghost" onClick={() => setOwned((v) => v.filter((a) => a.id !== r.id))}>移出团队</Button>
              ) } : null,
            ].filter(Boolean)}
          />
        ) : <EmptyState compact icon="wallet" title="没有符合条件的账户" description="换个关键词，或把已接入的账户分配给这个团队。" />}
      </Card>

      <Dialog open={!!assign} width={520} title="分配账户到本团队" onClose={() => setAssign(null)}
        footer={<>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginRight: 'auto' }}>只列出尚未归属任何团队的账户</span>
          <Button onClick={() => setAssign(null)}>取消</Button>
          <Button variant="primary" disabled={!assign || !assign.length}
            onClick={() => { setOwned((v) => v.concat(UNASSIGNED.filter((a) => assign.includes(a.id)))); setAssign(null); }}>
            分配 {assign && assign.length ? assign.length + ' 个' : ''}
          </Button>
        </>}>
        {assign ? (
          <div style={{ display: 'flex', flexDirection: 'column', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {UNASSIGNED.filter((a) => !owned.some((o) => o.id === a.id)).map((a, i) => {
              const on = assign.includes(a.id);
              return (
                <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5)', borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: on ? 'var(--surface-selected)' : 'transparent', cursor: 'pointer' }}>
                  <Checkbox checked={on} onChange={() => setAssign((v) => (on ? v.filter((x) => x !== a.id) : v.concat(a.id)))} />
                  <window.PlatformMark platform={a.platform} size={14} fallback="megaphone" />
                  <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-13)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                  <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{a.account}</span>
                </label>
              );
            })}
          </div>
        ) : null}
      </Dialog>
    </>
  );
}

function RolesTab({ myRole, isOwner }) {
  const [caps, setCaps] = React.useState(CAPS_DEFAULT);
  const [budget, setBudget] = React.useState(BUDGET_DEFAULT);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(null);

  const view = editing ? draft.caps : caps;
  const money = editing ? draft.budget : budget;
  const on = (c, r) => (r === 'owner' ? true : view[c.id][r]);
  const toggle = (c, r) => setDraft((d) => Object.assign({}, d, {
    caps: Object.assign({}, d.caps, { [c.id]: Object.assign({}, d.caps[c.id], { [r]: !d.caps[c.id][r] }) }),
  }));

  const cell = { padding: '12px var(--space-6)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', textAlign: 'center' };
  const head = Object.assign({}, cell, { background: 'var(--neutral-25)', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' });

  return (
    <Card padded={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>本团队的角色权限</span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>只影响这个团队，其他团队各自设置</span>
        <span style={{ flex: 1 }} />
        {editing ? (
          <>
            <Button size="sm" onClick={() => { setDraft(null); setEditing(false); }}>取消</Button>
            <Button size="sm" variant="primary" iconLeft="check" onClick={() => { setCaps(draft.caps); setBudget(draft.budget); setDraft(null); setEditing(false); }}>保存</Button>
          </>
        ) : (
          <>
            {isOwner ? null : <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>仅拥有者可修改</span>}
            <Button size="sm" variant="secondary" iconLeft="pencil" disabled={!isOwner}
              onClick={() => { setDraft({ caps: JSON.parse(JSON.stringify(caps)), budget: Object.assign({}, budget) }); setEditing(true); }}>设置权限</Button>
          </>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
        <thead>
          <tr>
            <th style={Object.assign({}, head, { textAlign: 'left' })}>权限</th>
            {ROLE_ORDER.map((r) => (
              <th key={r} style={Object.assign({}, head, { width: 132, color: r === myRole ? 'var(--text-primary)' : 'var(--text-secondary)' })}>
                {ROLE_LABEL[r]}{r === myRole ? ' · 我' : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAPS.map((c) => (
            <tr key={c.id}>
              <td style={Object.assign({}, cell, { textAlign: 'left' })}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  {c.cap}
                  {c.lock ? <Icon name="lock" size={11} style={{ color: 'var(--text-tertiary)' }} title="固定项，不可修改" /> : null}
                </span>
              </td>
              {ROLE_ORDER.map((r) => {
                const val = on(c, r);
                const fixed = c.lock || r === 'owner';
                return (
                  <td key={r} style={Object.assign({}, cell, { background: r === myRole ? 'var(--surface-selected)' : 'transparent' })}>
                    {editing && !fixed ? (
                      <span style={{ display: 'inline-flex', justifyContent: 'center' }}>
                        <Checkbox checked={val} onChange={() => toggle(c, r)} />
                      </span>
                    ) : val ? (
                      <Icon name="check" size={14} style={{ color: fixed && editing ? 'var(--neutral-400)' : 'var(--status-success-fg)' }} />
                    ) : <span style={{ color: 'var(--neutral-300)' }}>—</span>}
                  </td>
                );
              })}
            </tr>
          ))}
          {/* 预算上限是这类产品真正要按团队调的一项：同样是操作员，代运营给 ¥2,000，自家投手给 ¥5,000 */}
          <tr>
            <td style={Object.assign({}, cell, { textAlign: 'left', borderBottomWidth: 0 })}>单日预算变更上限</td>
            {ROLE_ORDER.map((r) => (
              <td key={r} style={Object.assign({}, cell, { borderBottomWidth: 0, background: r === myRole ? 'var(--surface-selected)' : 'transparent' })}>
                {editing && r !== 'owner' ? (
                  <Input size="sm" value={money[r]} style={{ width: 96 }}
                    onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); setDraft((d) => Object.assign({}, d, { budget: Object.assign({}, d.budget, { [r]: v }) })); }} />
                ) : (
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{money[r] === '不限' ? '不限' : '¥' + Number(money[r] || 0).toLocaleString('zh-CN') + ' / 日'}</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Card>
  );
}

/* 会削弱管控的操作都过一次确认，并写清后果 —— 这些动作在真实账户上不可撤销 */
const CONFIRM_TEXT = {
  remove: { title: '移出成员', tone: 'danger', act: '移出团队', body: (s) => '「' + s.member.name + '」将立即失去本团队全部账户的数据与操作权限。已提交但未执行的决策会一并作废。' },
  demote: { title: '降低角色', tone: 'primary', act: '确认调整', body: (s) => '「' + s.member.name + '」将变为操作员：AI 决策不再免审批，需要他人批准后才会落地。' },
  transfer: { title: '转让拥有者', tone: 'primary', act: '继续转让', body: () => '转让后你将变为管理员，无法再解散团队或再次转让。' },
  leave: { title: '退出团队', tone: 'danger', act: '退出团队', body: (s) => '退出后你将看不到「' + s.teamName + '」的任何账户与数据，需要由团队成员重新邀请。' },
  delete: { title: '解散团队', tone: 'danger', act: '解散团队', body: (s) => '「' + s.teamName + '」的成员将全部被移出，名下 ' + '广告账户回到未分配池。此操作不可撤销。' },
};

function ConfirmDialog({ state, onClose, onDone, teamName, members = [], onPick }) {
  const cfg = state ? CONFIRM_TEXT[state.kind] : null;
  const targets = members.filter((m) => !m.me && m.status === 'active');
  const nameOf = (id) => (targets.find((t) => t.id === id) || {}).name;
  return (
    <Dialog open={!!state} width={420} title={cfg ? cfg.title : ''} onClose={onClose}
      footer={<>
        <Button onClick={onClose}>取消</Button>
        <Button variant={cfg && cfg.tone === 'danger' ? 'danger' : 'primary'}
          disabled={!!state && state.kind === 'transfer' && !state.to}
          onClick={() => onDone(state.kind, state.member || {})}>{cfg ? cfg.act : ''}</Button>
      </>}>
      {cfg ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <p style={{ margin: 0, fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>{cfg.body(Object.assign({ teamName }, state))}</p>
          {state.kind === 'transfer' ? (
            <FormField label="接任的拥有者" hint="转让必须指定一个人，团队不能没有拥有者">
              <Select value={nameOf(state.to) || ''} options={targets.map((t) => t.name)} width="100%"
                onChange={(e) => onPick((targets.find((t) => t.name === e.target.value) || {}).id)} />
            </FormField>
          ) : null}
        </div>
      ) : null}
    </Dialog>
  );
}

Object.assign(window, { TeamView });
})();
