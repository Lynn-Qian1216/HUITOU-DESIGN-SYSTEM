(() => {
const { Icon, IconButton, Button, Badge, Card, Checkbox, StatusDot, MetricCard, FilterSelect, SegmentedControl, DropdownMenu, EmptyState, Avatar } = window.HUITOUAIDesignSystem_52606d;
const { FilterBar, rowHoverProps } = window;

/* 待办：把散在各模块里的「等人拍板」的事收成一张单子。
   通知回答「发生了什么」，待办回答「我今天必须做完什么」—— 前者会被划走，后者不会。
   所以分组按截止时间，不按来源：来源决定去哪处理，时间决定先做哪件。
   每条都带「不做会怎样」的代价，这是唯一能让人分清先后的信息。 */

const OWNERS = [
  { id: 'me', name: '我', avatar: '林' },
  { id: 'u2', name: '陈子涵', avatar: '陈' },
  { id: 'u3', name: '李文琪', avatar: '李' },
];

const SOURCES = {
  decision: { label: 'AI 决策', icon: 'sparkles', to: { tab: 'ads', rail: 'ai-1', focus: 'decision-first' } },
  matrix: { label: '投放矩阵', icon: 'grid-3x3', to: { tab: 'ads', rail: 'matrix' } },
  settle: { label: '数据结算', icon: 'file-text', to: { tab: 'workspace', view: 'dashboard', focus: 'settle-dispute' } },
  team: { label: '团队管理', icon: 'users', to: { tab: 'workspace', view: 'team' } },
  library: { label: '经验库', icon: 'library', to: { tab: 'workspace', view: 'library' } },
  account: { label: '广告账户', icon: 'wallet', to: { tab: 'workspace', view: 'accounts' } },
};

/* due 以小时计，负数表示已超时。impact 写清代价，写不出代价的事本来就不该进待办。 */
const TODOS = [
  { id: 't1', src: 'decision', owner: 'me', title: '确认 2 次被护栏拦下的出价上调', account: '保众 · 腾讯营销',
    why: 'AI 想把朋友圈-01 从 ¥68 提到 ¥79，超出账户上限 ¥72', impact: '不处理将持续欠量，昨日缺口 148 条', due: -3, inline: false },
  { id: 't2', src: 'matrix', owner: 'me', title: '审批第 7 批矩阵的 3 条计划', account: '保众 · 腾讯营销',
    why: '草稿已生成，需逐条批准后才创建到腾讯', impact: '今晚 22:00 前不批将错过投放窗口', due: 6, inline: false },
  { id: 't3', src: 'settle', owner: 'me', title: '发起东吴证券 8 月对账', account: '东吴证券',
    why: '朋友圈渠道我方 441 / 对方 420，差 21 单', impact: '涉及应收 ¥6,720，账期 9/25 截止', due: 30, inline: false },
  { id: 't4', src: 'account', owner: 'me', title: '补充「保众-千川-03」的资质材料', account: '保众 · 千川',
    why: '保险类目资质将于 9/22 到期', impact: '到期后该账户全部计划自动下线', due: 76, inline: false },
  { id: 't5', src: 'team', owner: 'u2', title: '处理李文琪的入团申请', account: '电商投放组',
    why: '申请角色：操作员', impact: '—', due: 20, inline: true },
  { id: 't6', src: 'library', owner: 'u2', title: '审核 2 条同行投稿经验', account: '电商投放组',
    why: '待审核队列已积压 5 天', impact: '—', due: null, inline: false },
  { id: 't7', src: 'matrix', owner: 'u3', title: '为第 8 批矩阵补 3 张竖版素材', account: '保众 · 腾讯营销',
    why: '9:16 规格还差 3 张，未凑齐不能进下一步', impact: '矩阵停在创意这一步', due: 12, inline: false },

  { id: 't8', src: 'decision', owner: 'me', title: '确认暂停 3 条超成本计划', account: '保众 · 千川',
    why: 'CPA 连续 6 小时高于结算单价 ¥68，最高一条 ¥112', impact: '每小时多花约 ¥340', due: -8, inline: false },
  { id: 't9', src: 'settle', owner: 'me', title: '补齐保众 8 月结算单的待确认量', account: '保众',
    why: '达人分销渠道 540 单尚未回传确认', impact: '¥36,720 暂不计入应收', due: -1, inline: false },
  { id: 't10', src: 'account', owner: 'me', title: '「东吴证券-腾讯-02」余额不足', account: '东吴证券 · 腾讯营销',
    why: '余额 ¥4,120，按当前速度约 5 小时耗尽', impact: '断投后重新起量需 1-2 天', due: 4, inline: false },
  { id: 't11', src: 'decision', owner: 'me', title: '审批 1 次预算上调 ¥800', account: '保众 · 腾讯营销',
    why: '朋友圈-03 起量稳定，AI 建议加预算，超出你的单日变更上限 ¥500', impact: '不批将在 20:00 前撞到日预算', due: 9, inline: false },
  { id: 't12', src: 'matrix', owner: 'me', title: '第 6 批矩阵观察期已结束，择优', account: '保众 · 腾讯营销',
    why: '9 条计划跑满 72 小时，「短视频+25-34岁」CPA 最低 ¥54.2', impact: '不择优则 5 条低效组合继续消耗', due: 18, inline: false },
  { id: 't13', src: 'team', owner: 'me', title: '为陈子涵分配 2 个广告账户', account: '电商投放组',
    why: '已加入 3 天，名下暂无账户，无法开始投放', impact: '—', due: 44, inline: true },
  { id: 't14', src: 'library', owner: 'me', title: '确认 AI 提炼的 3 条账户经验', account: '保众 · 腾讯营销',
    why: '从你过去 90 天投放中提炼，确认后 AI 建单时遵守', impact: '—', due: null, inline: false },
  { id: 't15', src: 'account', owner: 'me', title: '「保众-腾讯-01」授权 14 天后到期', account: '保众 · 腾讯营销',
    why: '腾讯营销的授权有效期 90 天，到期需重新授权', impact: '到期后数据停止同步，AI 无法接管', due: 336, inline: false },

  { id: 't16', src: 'decision', owner: 'u2', title: '确认关停 1 个低效人群包', account: '保众 · 腾讯营销',
    why: '「泛保险兴趣」7 日 CPA ¥96，高于均值 62%', impact: '每日多花约 ¥410', due: 2, inline: false },
  { id: 't17', src: 'settle', owner: 'u3', title: '核对东吴证券 7 月结算单据', account: '东吴证券',
    why: '财务要求附渠道明细后再付款', impact: '账期 9/20 截止', due: 26, inline: false },
  { id: 't18', src: 'matrix', owner: 'u3', title: '审批第 8 批矩阵的营销单元组合', account: '保众 · 千川',
    why: 'AI 建议 4 个单元，含 2 个未投过的版位组合', impact: '—', due: 34, inline: false },
];

const num = (n) => n.toLocaleString('zh-CN');

/* 分组：超时、今天（24h 内）、本周、无时限。只有这四档 —— 再细人也排不出顺序。 */
const bucketOf = (t) => (t.due == null ? 'later' : t.due < 0 ? 'over' : t.due <= 24 ? 'today' : 'week');
const BUCKETS = [
  { id: 'over', label: '已超时', tone: 'danger' },
  { id: 'today', label: '今天', tone: 'warning' },
  { id: 'week', label: '本周', tone: 'neutral' },
  { id: 'later', label: '无时限', tone: 'neutral' },
];

const dueText = (t) => {
  if (t.due == null) return '无时限';
  if (t.due < 0) return '已超时 ' + Math.abs(t.due) + ' 小时';
  if (t.due <= 24) return Math.round(t.due) + ' 小时内';
  return Math.round(t.due / 24) + ' 天内';
};

function TodoRow({ item, done, onToggle, onSnooze }) {
  const src = SOURCES[item.src];
  const owner = OWNERS.find((o) => o.id === item.owner) || OWNERS[0];
  const over = item.due != null && item.due < 0;
  return (
    <div {...rowHoverProps()} style={{
      display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', padding: 'var(--space-5) var(--space-6)',
      borderBottom: '1px solid var(--border-subtle)', opacity: done ? 0.5 : 1, transition: 'var(--transition-control)',
    }}>
      <span style={{ marginTop: 2 }}><Checkbox checked={done} onChange={onToggle} label="" /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', textDecoration: done ? 'line-through' : 'none' }}>{item.title}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>
            <Icon name={src.icon} size={11} />{src.label}
          </span>
        </div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginTop: 3, textWrap: 'pretty' }}>{item.why}</div>
        {item.impact !== '—' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--fs-12)', color: over ? 'var(--status-danger-fg)' : 'var(--text-tertiary)', marginTop: 3 }}>
            <Icon name="triangle-alert" size={11} />{item.impact}
          </div>
        ) : null}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 6, fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>
          <span>{item.account}</span><span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 999,
              background: 'var(--neutral-200)', fontSize: 9, color: 'var(--text-secondary)',
            }}>{owner.avatar}</span>
            {owner.name}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 'none' }}>
        <span style={{
          fontSize: 'var(--fs-12)', fontWeight: over ? 'var(--fw-medium)' : 'var(--fw-regular)',
          color: over ? 'var(--status-danger-fg)' : item.due != null && item.due <= 24 ? 'var(--status-warning-fg)' : 'var(--text-tertiary)',
          whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
        }}>{dueText(item)}</span>
        <Button variant={over ? 'primary' : 'secondary'} size="sm" disabled={done}
          onClick={() => window.HUITOU_GO && window.HUITOU_GO(SOURCES[item.src].to)}>去处理</Button>
        <DropdownMenu align="right" trigger={<IconButton icon="ellipsis" label="更多" size="sm" />} items={[
          { id: 'snooze', label: '延后到明天', icon: 'clock', onClick: onSnooze },
          { id: 'assign', label: '指派给成员', icon: 'user-plus' },
          { divider: true },
          { id: 'done', label: done ? '标为未完成' : '标为已完成', icon: 'check', onClick: onToggle },
        ]} />
      </div>
    </div>
  );
}

function TodosView() {
  const [scope, setScope] = React.useState('me');
  const [src, setSrc] = React.useState('全部来源');
  const [done, setDone] = React.useState([]);
  const [snoozed, setSnoozed] = React.useState([]);
  const [showDone, setShowDone] = React.useState(false);

  const mine = TODOS.filter((t) => (scope === 'me' ? t.owner === 'me' : true));
  const visible = mine
    .filter((t) => src === '全部来源' || SOURCES[t.src].label === src)
    .filter((t) => !snoozed.includes(t.id))
    .filter((t) => (showDone ? true : !done.includes(t.id)));

  const RECEIVABLE = { t3: 6720, t9: 36720, t17: 0 };
  const over = mine.filter((t) => bucketOf(t) === 'over' && !done.includes(t.id));
  const today = mine.filter((t) => bucketOf(t) === 'today' && !done.includes(t.id));
  const toggle = (id) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  return (
    <>
      <window.PageHeader title="待办" description="等你拍板的事都在这里，按截止时间排。通知会被划走，待办不会 —— 只有处理完或延后才消失。"
        actions={<SegmentedControl value={scope} onChange={setScope} size="sm"
          options={[{ value: 'me', label: '我的' }, { value: 'all', label: '全团队' }]} />} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-5)', alignItems: 'start', marginBottom: 'var(--space-6)' }}>
        <MetricCard label="已超时" value={num(over.length)} />
        <MetricCard label="今天到期" value={num(today.length)} />
        <MetricCard label="今日已完成" value={num(done.length)} />
        <MetricCard label="涉及应收" value={'¥' + mine.filter((t) => !done.includes(t.id)).reduce((a, t) => a + (RECEIVABLE[t.id] || 0), 0).toLocaleString('zh-CN')} />
      </div>

      <Card padded={false}>
        <FilterBar inset trailing={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-5)' }}>
            <button type="button" onClick={() => setShowDone((v) => !v)} style={{
              border: 0, background: 'transparent', font: 'inherit', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0,
            }}>{showDone ? '隐藏已完成' : '显示已完成'}</button>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{visible.length} 项</span>
          </span>
        }>
          <FilterSelect value={src} onChange={setSrc}
            options={['全部来源', ...Object.values(SOURCES).map((s) => s.label)].map((s) => ({ value: s, label: s }))} />
        </FilterBar>

        {visible.length ? BUCKETS.map((b) => {
          const rows = visible.filter((t) => bucketOf(t) === b.id);
          if (!rows.length) return null;
          return (
            <div key={b.id}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-6)',
                background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-subtle)',
              }}>
                <StatusDot tone={b.tone} />
                <span style={{ fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>{b.label}</span>
                <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{rows.length}</span>
              </div>
              {rows.map((t) => (
                <TodoRow key={t.id} item={t} done={done.includes(t.id)} onToggle={() => toggle(t.id)}
                  onSnooze={() => setSnoozed((s) => [...s, t.id])} />
              ))}
            </div>
          );
        }) : (
          <div style={{ padding: 'var(--space-9) var(--space-6)' }}>
            <EmptyState icon="circle-check" title="没有待办" description="AI 在护栏内的自动执行不会进这里，可在通知的「全部」里查看。" />
          </div>
        )}
      </Card>

      {snoozed.length ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-5)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
          <Icon name="clock" size={12} />{snoozed.length} 项已延后到明天
          <button type="button" onClick={() => setSnoozed([])} style={{
            border: 0, background: 'transparent', font: 'inherit', fontSize: 'var(--fs-12)', color: 'var(--text-primary)', cursor: 'pointer', padding: 0,
          }}>撤销</button>
        </div>
      ) : null}
    </>
  );
}

window.TodosView = TodosView;
})();
