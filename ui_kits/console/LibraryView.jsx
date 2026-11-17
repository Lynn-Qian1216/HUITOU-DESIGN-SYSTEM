(() => {
const { Icon, Button, Badge, Card, Input, Textarea, Checkbox, FilterSelect, Dialog, FormField, EmptyState, Tabs, StatusDot, Alert, Avatar } = window.HUITOUAIDesignSystem_52606d;
const { FilterBar } = window;

/* 经验库：把「这条经验能不能照着做」摆在最前面。
   三种来源的可信度天差地别 —— 行业共识可直接照做，同行投稿要看审核状态与采纳数，
   AI 从自己账户里提炼的只对自己账户成立。所以来源标签是每张卡上最先读到的东西，
   而不是排序或筛选里的一个次要维度。 */

const SOURCES = {
  consensus: { label: '行业共识', tone: 'ai', icon: 'book-marked', note: '平台文档与长期验证' },
  peer: { label: '同行投稿', tone: 'neutral', icon: 'users', note: '经审核后发布' },
  mine: { label: 'AI 提炼', tone: 'warning', icon: 'sparkles', note: '来自你自己的投放记录' },
};

const TOPICS = ['出价与预算', '定向与人群', '创意与素材', '账户结构', '转化归因', '合规与审核'];

const ENTRIES = [
  { id: 'e1', src: 'consensus', topic: '出价与预算', platform: 'tencent',
    title: '新建单元前三天不要动出价', body: '模型需要约 20 个转化完成冷启动。三天内频繁调价会让学习期重置，表现为成本先降后暴涨。确需调整时单次幅度不超过 10%，间隔至少 4 小时。',
    adopted: 218, saved: 96, updated: '2026-08-21' },
  { id: 'e2', src: 'consensus', topic: '创意与素材', platform: 'tencent',
    title: '一个单元只测一个变量', body: '同时换版位和素材，跑出差异也无法归因。矩阵建单时固定其余三个维度，只让一个维度取多值。',
    adopted: 184, saved: 71, updated: '2026-07-30' },
  { id: 'e3', src: 'peer', topic: '定向与人群', platform: 'qianchuan', author: '用户3390',
    title: '达人分销的相似达人拓展要单独建单元', body: '和商品定向混在一个单元里，预算会被相似达人吃掉。实测分开后整体 ROI 提升约 18%，但要接受前两天成本偏高。',
    adopted: 46, saved: 33, updated: '2026-09-02' },
  { id: 'e4', src: 'mine', topic: '出价与预算', platform: 'tencent',
    title: '你的朋友圈单元在周一成本普遍偏高', body: '近 8 周数据：周一 CPA 平均 ¥52.4，其余工作日 ¥41.8。建议周一日预算下调 30%，把量留到周三、周四。',
    accounts: ['b1', 'b2'], adopted: 0, saved: 4, updated: '2026-09-08' },
  { id: 'e5', src: 'peer', topic: '合规与审核', platform: 'tencent', author: '用户1786',
    title: '保险类素材避免出现「最高赔付」字样', body: '「最高」属绝对化用语，审核驳回率高。改为「赔付上限 3 万元」既合规也更具体。',
    adopted: 92, saved: 57, updated: '2026-06-14' },
  { id: 'e6', src: 'mine', topic: '创意与素材', platform: 'qianchuan',
    title: '你的方图素材点击率长期低于竖版', body: '近 30 天：9:16 平均点击率 4.1%，1:1 为 2.6%。方图目前只在小程序版位有量，可考虑把预算压到竖版。',
    accounts: ['a1'], adopted: 0, saved: 2, updated: '2026-09-09' },
];

/* 待审核只有管理员看得到，投稿人看自己的那条在「我的投稿」里 */
const PENDING = [
  { id: 'p1', src: 'peer', topic: '账户结构', platform: 'qianchuan', author: '用户9038',
    title: '全域推广不要和标准计划抢同一批商品', body: '同商品下两种计划同时在投会互相抬价。建议一个商品只用一种计划形态。',
    submitted: '2026-09-09', state: 'pending' },
  { id: 'p2', src: 'peer', topic: '转化归因', platform: 'tencent', author: '用户4471',
    title: '表单类转化看 3 日归因比 1 日更稳', body: '留电到回访通常跨天，1 日归因会低估效果，容易把跑得动的单元误关。',
    submitted: '2026-09-07', state: 'pending' },
  { id: 'p3', src: 'peer', topic: '定向与人群', platform: 'tencent', author: '用户6620',
    title: '定向拓展开了就不要再叠加兴趣词', body: '两者作用重叠，实测拓展后人群反而更窄。', submitted: '2026-09-05', state: 'changes' },
];

const PLATFORM_LABEL = { tencent: '腾讯营销', qianchuan: '巨量千川', all: '通用' };

function LibraryView() {
  const store = window.useTeam ? window.useTeam() : { team: { role: 'owner' } };
  const isAdmin = store.team.role === 'owner' || store.team.role === 'admin';
  const [tab, setTab] = React.useState('all');
  const [entries, setEntries] = React.useState(ENTRIES);
  const [pending, setPending] = React.useState(PENDING);
  const [detail, setDetail] = React.useState(null);
  const [saved, setSaved] = React.useState(['e2']);
  const [adoptions, setAdoptions] = React.useState({ e1: { accounts: ['b1'], scope: 'long', at: '2026-09-03' } });
  const [adopting, setAdopting] = React.useState(null);
  const adopt = (id, accounts, scope) => setAdoptions((m) => Object.assign({}, m, { [id]: { accounts: accounts, scope: scope, at: '2026-09-11' } }));
  const revoke = (id) => setAdoptions((m) => { const n = Object.assign({}, m); delete n[id]; return n; });
  const toggleSave = (id) => setSaved((v) => (v.includes(id) ? v.filter((x) => x !== id) : v.concat(id)));
  const [compose, setCompose] = React.useState(null);
  const [generating, setGenerating] = React.useState(false);

  /* AI 提炼：从自己账户的投放记录里生成，生成完仍是草稿，要自己看过才提交 */
  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setCompose({
        title: '你的宠物险单元在预算耗尽前 2 小时成本上升',
        body: '近 6 周数据：日预算用掉 85% 之后的时段，CPA 平均比当日均值高 34%。建议把日预算上调 20%，或把投放时段收窄到 09:00–21:00。',
        topic: '出价与预算', ai: true,
      });
    }, 1600);
  };

  return (
    <>
      <window.PageHeader title="经验库" description="行业共识可直接照做；同行投稿经审核后发布；AI 提炼只对你自己的账户成立。"
        actions={<>
          <Button variant="secondary" iconLeft="sparkles" disabled={generating} onClick={generate}>
            {generating ? '正在提炼…' : '从我的投放提炼'}
          </Button>
          <Button variant="primary" iconLeft="plus" onClick={() => setCompose({ title: '', body: '', topic: TOPICS[0] })}>投稿经验</Button>
        </>} />

      <Tabs value={tab} onChange={setTab} style={{ marginBottom: 'var(--space-6)' }} items={[]
        .concat([{ id: 'all', label: '全部经验', count: entries.length }])
        .concat([{ id: 'mine', label: 'AI 提炼', count: entries.filter((e) => e.src === 'mine').length }])
        .concat([{ id: 'adopted', label: '已采纳', count: Object.keys(adoptions).length }])
        .concat([{ id: 'saved', label: '我的收藏', count: saved.length }])
        .concat(isAdmin ? [{ id: 'review', label: '待审核', count: pending.length }] : [])
      } />

      {tab === 'review'
        ? <ReviewTab pending={pending} setPending={setPending} setEntries={setEntries} />
        : <BrowseTab entries={entries} tab={tab} saved={saved} adoptions={adoptions} onToggleSave={toggleSave} onRevoke={revoke} onOpen={setDetail} />}

      <EntryDetail entry={detail} saved={detail ? saved.includes(detail.id) : false}
        adoption={detail ? adoptions[detail.id] : null} onToggleSave={toggleSave}
        onAdopt={() => setAdopting(detail)} onRevoke={revoke} onClose={() => setDetail(null)} />
      <AdoptDialog entry={adopting} onClose={() => setAdopting(null)}
        onDone={(accounts, scope) => { adopt(adopting.id, accounts, scope); setAdopting(null); }} />
      <ComposeDialog draft={compose} onClose={() => setCompose(null)}
        onSubmit={(d) => { setPending((v) => [{ id: 'n' + Date.now(), src: 'peer', topic: d.topic, platform: 'tencent', author: '用户7311', title: d.title, body: d.body, submitted: '2026-09-11', state: 'pending' }].concat(v)); setCompose(null); }} />
    </>
  );
}

function BrowseTab({ entries, tab, saved, adoptions, onToggleSave, onRevoke, onOpen }) {
  const onlyMine = tab === 'mine';
  const onlySaved = tab === 'saved';
  const onlyAdopted = tab === 'adopted';
  const [q, setQ] = React.useState('');
  const [src, setSrc] = React.useState('全部来源');
  const [topic, setTopic] = React.useState('全部主题');
  const [sort, setSort] = React.useState('最多采纳');

  const rows = entries
    .filter((e) => !onlyMine || e.src === 'mine')
    .filter((e) => !onlySaved || saved.includes(e.id))
    .filter((e) => !onlyAdopted || !!adoptions[e.id])
    .filter((e) => !q || e.title.includes(q) || e.body.includes(q))
    .filter((e) => src === '全部来源' || SOURCES[e.src].label === src)
    .filter((e) => topic === '全部主题' || e.topic === topic)
    .slice()
    .sort((a, b) => (sort === '最多采纳' ? b.adopted - a.adopted : b.updated.localeCompare(a.updated)));

  return (
    <>
      {onlyMine ? (
        <Alert tone="warning" title="这些结论只对你自己的账户成立" style={{ marginBottom: 'var(--space-6)' }}>
          由 AI 从你名下账户的历史投放中提炼，样本就是你的数据。想分享给同行，先投稿走审核。
        </Alert>
      ) : null}

      <Card padded={false} style={{ marginBottom: 'var(--space-6)' }}>
        <FilterBar inset trailing={<span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{rows.length} 条</span>}>
          <Input placeholder="搜索经验" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 240 }} />
          {onlyMine ? null : (
            <FilterSelect value={src} onChange={setSrc} width={124}
              options={['全部来源'].concat(Object.keys(SOURCES).map((k) => SOURCES[k].label)).map((o) => ({ label: o }))} />
          )}
          <FilterSelect value={topic} onChange={setTopic} width={136} options={['全部主题'].concat(TOPICS).map((o) => ({ label: o }))} />
          <FilterSelect value={sort} onChange={setSort} width={116} options={['最多采纳', '最近更新'].map((o) => ({ label: o }))} />
        </FilterBar>
      </Card>

      {rows.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
          {rows.map((e) => <EntryCard key={e.id} e={e} saved={saved.includes(e.id)} adoption={adoptions[e.id]} onToggleSave={onToggleSave} onRevoke={onRevoke} onOpen={onOpen} />)}
        </div>
      ) : onlyAdopted ? (
        <Card><EmptyState compact icon="check" title="还没有采纳任何经验" description="在经验详情里点「采纳到投放矩阵」，AI 建单时会按它来。" /></Card>
      ) : onlySaved ? (
        <Card><EmptyState compact icon="bookmark" title="还没有收藏" description="在任意经验的详情里点「收藏」，之后在这里找回。" /></Card>
      ) : <Card><EmptyState compact icon="search-x" title="没有符合条件的经验" description="换个关键词，或把筛选放宽。" /></Card>}
    </>
  );
}

function EntryCard({ e, saved, adoption, onToggleSave, onRevoke, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const s = SOURCES[e.src];
  return (
    <button type="button" onClick={() => onOpen(e)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 0, textAlign: 'left', font: 'inherit',
        padding: 'var(--gutter-card)', borderWidth: 1, borderStyle: 'solid', borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        borderRadius: 'var(--radius-card)', background: 'var(--surface-card)', cursor: 'pointer', transition: 'var(--transition-control)',
      }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Badge tone={s.tone}>{s.label}</Badge>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{e.topic}</span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>· {PLATFORM_LABEL[e.platform]}</span>
        <span style={{ flex: 1 }} />
        {adoption ? <Badge tone="success">已采纳</Badge> : null}
      </span>
      <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)', lineHeight: 'var(--lh-snug)' }}>{e.title}</span>
      <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.body}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', marginTop: 'var(--space-3)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
        {adoption
          ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--status-success-fg)' }}><Icon name="check" size={12} />已用于 {adoption.accounts.length} 个账户{adoption.scope === 'long' ? ' · 长期' : ' · 仅下一批'}</span>
          : e.src === 'mine'
          ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="wallet" size={12} />{(e.accounts || []).length} 个账户</span>
          : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="check" size={12} />{e.adopted} 人采纳</span>}
        <span style={{ flex: 1 }} />
        <span>{e.updated}</span>
        <span role="button" title={saved ? '取消收藏' : '收藏'}
          onClick={(ev) => { ev.stopPropagation(); onToggleSave(e.id); }}
          style={{ display: 'grid', placeItems: 'center', width: 20, height: 20, marginLeft: 2, borderRadius: 'var(--radius-sm)', color: saved ? 'var(--text-primary)' : 'var(--text-tertiary)', opacity: saved || hover ? 1 : 0, cursor: 'pointer', transition: 'var(--transition-control)' }}>
          <Icon name={saved ? 'bookmark-check' : 'bookmark'} size={13} />
        </span>
      </span>
    </button>
  );
}

function EntryDetail({ entry, saved, adoption, onToggleSave, onAdopt, onRevoke, onClose }) {
  if (!entry) return null;
  const s = SOURCES[entry.src];
  return (
    <Dialog open width={560} title={entry.title} onClose={onClose}
      footer={<>
        <Button variant="ghost" iconLeft={saved ? 'bookmark-check' : 'bookmark'} onClick={() => onToggleSave(entry.id)}>{saved ? '已收藏' : '收藏'}</Button>
        <span style={{ flex: 1 }} />
        <Button onClick={onClose}>关闭</Button>
        {adoption
          ? <Button variant="danger" iconLeft="x" onClick={() => { onRevoke(entry.id); onClose(); }}>撤销采纳</Button>
          : <Button variant="primary" iconLeft="check" onClick={onAdopt}>采纳到投放矩阵</Button>}
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Badge tone={s.tone}>{s.label}</Badge>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{s.note}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>更新于 {entry.updated}</span>
        </div>

        {adoption ? (
          <Alert tone="success" title={'已采纳 · ' + (adoption.scope === 'long' ? '长期生效' : '仅下一批')}>
            应用于 {adoption.accounts.length} 个账户，AI 建矩阵时会按它来，并在方案理由里注明。采纳于 {adoption.at}。
          </Alert>
        ) : null}

        <p style={{ margin: 0, fontSize: 'var(--fs-14)', color: 'var(--text-primary)', lineHeight: 'var(--lh-relaxed)' }}>{entry.body}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)' }}>
          <Meta label="主题" value={entry.topic} />
          <Meta label="适用平台" value={PLATFORM_LABEL[entry.platform]} />
          {entry.author ? <Meta label="投稿人" value={entry.author} /> : null}
          {entry.src === 'mine'
            ? <Meta label="数据来源" value={(entry.accounts || []).length + ' 个账户的历史投放'} />
            : <Meta label="采纳 / 收藏" value={entry.adopted + ' / ' + entry.saved} />}
        </div>
      </div>
    </Dialog>
  );
}

function Meta({ label, value }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{label}</div>
      <div style={{ fontSize: 'var(--fs-13)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

/* 审核：三种结论各有后果，所以不是「通过 / 拒绝」两个按钮 ——
   「退回修改」保留投稿人的内容，让他改完再来，比直接拒绝更可能留下好经验。 */
function ReviewTab({ pending, setPending, setEntries }) {
  const rows = pending;
  const act = (p, kind) => {
    if (kind === 'pass') {
      setEntries((v) => [{ id: p.id, src: 'peer', topic: p.topic, platform: p.platform, author: p.author, title: p.title, body: p.body, adopted: 0, saved: 0, updated: p.submitted }].concat(v));
      setPending((v) => v.filter((x) => x.id !== p.id));
    } else if (kind === 'reject') {
      setPending((v) => v.filter((x) => x.id !== p.id));
    } else {
      setPending((v) => v.map((x) => (x.id === p.id ? Object.assign({}, x, { state: 'changes' }) : x)));
    }
  };

  if (!rows.length) return <Card><EmptyState compact icon="check" title="没有待审核的投稿" description="同行投稿会先到这里，通过后才对全团队可见。" /></Card>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {rows.map((p) => (
        <Card key={p.id}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <Avatar name={p.author} size="md" />
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)' }}>{p.title}</span>
                {p.state === 'changes' ? <Badge tone="warning">已退回修改</Badge> : <StatusDot tone="warning" label="待审核" style={{ fontSize: 'var(--fs-12)' }} />}
              </div>
              <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                {p.author} · {p.topic} · {PLATFORM_LABEL[p.platform]} · 提交于 {p.submitted}
              </div>
              <p style={{ margin: 'var(--space-5) 0 0', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>{p.body}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>通过后对全团队可见，并计入采纳统计</span>
            <span style={{ flex: 1 }} />
            <Button size="sm" variant="ghost" onClick={() => act(p, 'reject')}>不收录</Button>
            <Button size="sm" onClick={() => act(p, 'changes')} disabled={p.state === 'changes'}>退回修改</Button>
            <Button size="sm" variant="primary" iconLeft="check" onClick={() => act(p, 'pass')}>通过并发布</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* 采纳要问清两件事：给哪个账户、管这一批还是长期 —— 经验不一定对名下每个账户都适用 */
function AdoptDialog({ entry, onClose, onDone }) {
  const store = window.useTeam ? window.useTeam() : { team: { accounts: [] } };
  const all = (window.HUITOU_ACCOUNTS || []).filter((a) => store.team.accounts.includes(a.id));
  const [picked, setPicked] = React.useState([]);
  const [scope, setScope] = React.useState('long');
  React.useEffect(() => { setPicked(all.map((a) => a.id)); setScope('long'); }, [entry]);
  if (!entry) return null;
  return (
    <Dialog open width={480} title="采纳到投放矩阵"
      description="采纳后，AI 在这些账户建矩阵时会遵守这条经验，并在方案理由里注明出处。"
      onClose={onClose}
      footer={<>
        <Button onClick={onClose}>取消</Button>
        <Button variant="primary" iconLeft="check" disabled={!picked.length} onClick={() => onDone(picked, scope)}>确认采纳</Button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <FormField label="生效范围">
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            {[{ v: 'long', t: '长期生效', d: '以后每批都遵守' }, { v: 'once', t: '仅下一批', d: '试一轮再说' }].map((o) => (
              <button key={o.v} type="button" onClick={() => setScope(o.v)}
                style={{ flex: 1, minWidth: 0, textAlign: 'left', padding: 'var(--space-5)', borderWidth: 1, borderStyle: 'solid', borderColor: scope === o.v ? 'var(--border-strong)' : 'var(--border-subtle)', borderRadius: 'var(--radius-md)', background: scope === o.v ? 'var(--surface-selected)' : 'var(--surface-card)', font: 'inherit', cursor: 'pointer' }}>
                <div style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{o.t}</div>
                <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2 }}>{o.d}</div>
              </button>
            ))}
          </div>
        </FormField>
        <FormField label={'应用到账户（' + picked.length + ' / ' + all.length + '）'} hint="经验不一定对名下每个账户都适用">
          <div style={{ display: 'flex', flexDirection: 'column', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', maxHeight: 200, overflowY: 'auto', scrollbarGutter: 'stable' }}>
            {all.map((a, i) => {
              const on = picked.includes(a.id);
              return (
                <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-4) var(--space-5)', borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: on ? 'var(--surface-selected)' : 'transparent', cursor: 'pointer' }}>
                  <Checkbox checked={on} onChange={() => setPicked((v) => (on ? v.filter((x) => x !== a.id) : v.concat(a.id)))} />
                  <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-13)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.tag || a.name}</span>
                  <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{a.account}</span>
                </label>
              );
            })}
          </div>
        </FormField>
      </div>
    </Dialog>
  );
}

function ComposeDialog({ draft, onClose, onSubmit }) {
  const [d, setD] = React.useState(draft);
  React.useEffect(() => { setD(draft); }, [draft]);
  if (!d) return null;
  const ready = d.title.trim() && d.body.trim();
  return (
    <Dialog open width={560} title={d.ai ? 'AI 提炼的经验' : '投稿经验'}
      description={d.ai ? '从你名下账户的历史投放里提炼。看过再提交，不改也可以。' : '提交后由管理员审核，通过才会对全团队可见。'}
      onClose={onClose}
      footer={<>
        <Button onClick={onClose}>取消</Button>
        <Button variant="primary" iconLeft="send" disabled={!ready} onClick={() => onSubmit(d)}>提交审核</Button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <FormField label="结论" hint="一句话说清做什么、别做什么">
          <Input value={d.title} placeholder="例如：新建单元前三天不要动出价" onChange={(e) => setD(Object.assign({}, d, { title: e.target.value }))} />
        </FormField>
        <FormField label="依据与做法" hint="写上数据或场景，别人才判断得出适不适用自己">
          <Textarea rows={5} value={d.body} placeholder="例如：近 8 周数据显示…；建议的做法是…"
            onChange={(e) => setD(Object.assign({}, d, { body: e.target.value }))} />
        </FormField>
        <FormField label="主题">
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            {TOPICS.map((t) => (
              <button key={t} type="button" onClick={() => setD(Object.assign({}, d, { topic: t }))}
                style={{ padding: '5px var(--space-5)', borderWidth: 1, borderStyle: 'solid', borderColor: d.topic === t ? 'var(--border-strong)' : 'var(--border-subtle)', borderRadius: 'var(--radius-pill)', background: d.topic === t ? 'var(--surface-selected)' : 'var(--surface-card)', font: 'inherit', fontSize: 'var(--fs-12)', cursor: 'pointer' }}>{t}</button>
            ))}
          </div>
        </FormField>
      </div>
    </Dialog>
  );
}

Object.assign(window, { LibraryView });
})();
