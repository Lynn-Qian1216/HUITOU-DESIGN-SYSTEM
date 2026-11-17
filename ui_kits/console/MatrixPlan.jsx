(() => {
const { Card, Button, Badge, Icon, Checkbox, StatusDot, EmptyState, Alert, AgentLoading } = window.HUITOUAIDesignSystem_52606d;
const { TableFrame, rowHoverProps } = window;

/* 第三步 · 创建营销矩阵。AI 生成方案，人只做执行 / 不执行。

   领导的 demo 把三个阶段（现有投放 / 待测试 / 下一阶段）等权铺开，每条单元二十来个字段，
   八条就是五屏。三个阶段的重要性其实不同：
   - 待测试方案是这一页存在的理由，展开；
   - 下一阶段的计划取决于这一轮的结果，现在写出来是假的 —— 只留一行说什么时候会生成。

   每条方案的正文只放 diff：改了哪一个变量、从什么到什么、想验证什么。
   二十个参数里只有一个不一样，把它们全列出来，人反而找不到那一个。 */

const PROPOSALS = [
  { id: 'p1', name: '智能定向拓量对照', base: 'u1', dim: '定向', from: '沿用腾讯现有定向', to: '智能定向 · 全国 · 年龄性别不限',
    verify: '智能拓量能否带来有效预约，且不明显抬高成本', bid: 80, budget: 100,
    keep: ['智能版位', 'oCPM · 稳定拿量', '沿用现有素材', '长期投放 · 全天'] },
  { id: 'p2', name: '手动版位 · 公众号与小程序', base: 'u1', dim: '版位', from: '智能版位', to: '手动 · 微信公众号与小程序',
    verify: '公众号场景下有效预约成本是否低于智能版位', bid: 80, budget: 100,
    keep: ['沿用腾讯现有定向', 'oCPM · 稳定拿量', '沿用现有素材', '长期投放 · 全天'] },
  { id: 'p3', name: '出价下探 ¥60', base: 'u1', dim: '出价', from: '¥80', to: '¥60',
    verify: '降价 25% 后是否还能起量；若 3 天无消耗则回滚', bid: 60, budget: 100,
    keep: ['沿用腾讯现有定向', '智能版位', '沿用现有素材', '长期投放 · 全天'] },
  { id: 'p4', name: '最大转化量投放对照', base: 'u1', dim: '出价类型', from: '稳定拿量', to: '最大转化量投放',
    verify: '放开出价约束后能否拿到首批有效预约，成本上限 ¥120', bid: 80, budget: 150,
    keep: ['沿用腾讯现有定向', '智能版位', '沿用现有素材', '长期投放 · 全天'] },
];

const VERSIONS = [
  { id: 'v3', label: '本轮方案', when: '刚刚', current: true },
  { id: 'v2', label: '备选方案', when: '1 天前' },
  { id: 'v1', label: '复盘基准', when: '3 天前' },
];

function PlanStep({ plan, setPlan, embedded }) {
  /* 嵌在右侧面板时，勾选走全局状态 —— 对话里那份方案块要同步 */
  const st = embedded ? window.useMatrixStore() : null;
  const phase = embedded ? 'ready' : plan.phase;
  const picked = embedded ? st.picked : plan.picked;
  const [showBaseLocal, setShowBaseLocal] = React.useState(false);
  const showBase = embedded ? showBaseLocal : plan.showBase;
  const set = (patch) => {
    if (embedded) {
      if ('picked' in patch) window.setMatrixStore({ picked: patch.picked });
      if ('showBase' in patch) setShowBaseLocal(patch.showBase);
      return;
    }
    setPlan((s) => Object.assign({}, s, patch));
  };
  const approved = embedded && st.phase === 'approved';

  /* 生成由 phase 驱动，谁把 phase 拨成 loading 都行 —— 上一步页脚的「创建营销矩阵」也走这条路 */
  const generate = () => set({ phase: 'loading' });
  React.useEffect(() => {
    if (phase !== 'loading') return;
    const t = setTimeout(() => set({ phase: 'ready', picked: PROPOSALS.map((x) => x.id) }), 1800);
    return () => clearTimeout(t);
  }, [phase]);
  const toggle = (id) => set({ picked: picked.includes(id) ? picked.filter((x) => x !== id) : picked.concat(id) });

  if (phase === 'empty') {
    return (
      <Card>
        <EmptyState icon="sparkles" title="还没有本轮方案"
          description="AI 会读取现有投放与画像，生成几条「只改一个变量」的待测试单元。你只需要决定执行哪几条。"
          action={<Button variant="primary" iconLeft="sparkles" onClick={generate}>创建营销矩阵</Button>} />
      </Card>
    );
  }
  if (phase === 'loading') {
    return <Card><AgentLoading label="矩阵规划师 读取现有投放与画像" skeleton /></Card>;
  }

  return (
    <>
      {/* 方案头：版本、依据、重新生成。历史方案是可切的，但不占一屏 —— 一行胶囊够了 */}
      {embedded ? null : <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', minWidth: 0 }}>
        {VERSIONS.map((v) => (
          <span key={v.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, height: 26, padding: '0 var(--space-5)', fontSize: 'var(--fs-12)', whiteSpace: 'nowrap', flex: 'none',
            borderRadius: 'var(--radius-pill)', borderWidth: 1, borderStyle: 'solid',
            borderColor: v.current ? 'var(--border-focus)' : 'var(--border-subtle)',
            background: v.current ? 'var(--surface-selected)' : 'var(--surface-card)',
            color: v.current ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: v.current ? 'var(--fw-medium)' : 'var(--fw-regular)',
          }}>{v.label}<span style={{ color: 'var(--text-tertiary)' }}>· {v.when}</span></span>
        ))}
        <span style={{ flex: 1 }} />
        {embedded
          ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>要改方案，在对话里说</span>
          : <Button variant="secondary" size="sm" iconLeft="refresh-cw" onClick={generate}>重新生成</Button>}
      </div>}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>待测试方案</span>
        <Badge tone="neutral">{PROPOSALS.length} 条</Badge>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{approved ? '已批准，提交腾讯创建中' : '每条只改一个变量 · 勾上的会提交腾讯创建'}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', minWidth: 0 }}>
        {PROPOSALS.map((p) => <ProposalCard key={p.id} p={p} on={picked.includes(p.id)} locked={approved} onToggle={() => toggle(p.id)} />)}
      </div>

      {/* 下一阶段只留一行：它的内容取决于这一轮的结果，现在写出来的都是假的 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', borderWidth: 1, borderStyle: 'dashed', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-md)' }}>
        <Icon name="arrow-down-to-line" size={13} style={{ flex: 'none' }} />
        <span>下一阶段：本轮跑满 7 天后，AI 依据胜出的那个变量再生成一组方案 —— 现在不预先排。</span>
      </div>
    </>
  );
}

/* 方案卡：正文只放 diff。左侧勾选就是「执行」。 */
function ProposalCard({ p, on, locked, onToggle }) {
  const [more, setMore] = React.useState(false);
  return (
    <Card padded={false} selected={on}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', padding: 'var(--space-6) var(--gutter-card)', minWidth: 0 }}>
        <span style={{ flex: 'none', paddingTop: 2 }}><Checkbox checked={on} disabled={locked} onChange={onToggle} /></span>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', minWidth: 0 }}>
            <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', minWidth: 0 }}>{p.name}</span>
            <Badge tone="ai">只改 · {p.dim}</Badge>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>出价 ¥{p.bid} · 日预算 ¥{p.budget}</span>
          </div>

          {/* 原值 → 方案值，一行说清改了什么 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--fs-13)', minWidth: 0 }}>
            <span style={{ color: 'var(--text-tertiary)', textDecoration: 'line-through', minWidth: 0 }}>{p.from}</span>
            <Icon name="arrow-right" size={13} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
            <span style={{ fontWeight: 'var(--fw-medium)', minWidth: 0 }}>{p.to}</span>
          </div>

          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>验证：</span>{p.verify}
          </div>

          <button type="button" onClick={() => setMore(!more)}
            style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, border: 0, background: 'none', font: 'inherit', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
            <Icon name="chevron-right" size={12} style={{ transform: more ? 'rotate(90deg)' : 'none', transition: 'transform var(--duration-fast, .12s) var(--ease-standard)' }} />
            {more ? '收起' : '其余设置 · ' + p.keep.length + ' 项'}
          </button>
          {more ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', padding: 'var(--space-5)', background: 'var(--neutral-25)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
              {p.keep.map((k) => <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="check" size={11} style={{ color: 'var(--text-tertiary)' }} />{k}</span>)}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

/* 草稿是可以改的：AI 给的组合只是起点。用户在详情里改过的字段存在 store.unitEdits，
   这里合并后再给出去 —— 各处读的是同一份合并结果，改一处四处同步。 */
function matrixUnits() {
  const e = ((window.HUITOU_MATRIX || {}).unitEdits) || {};
  return PROPOSALS.map((p) => Object.assign({}, p, e[p.id] || {}));
}
Object.assign(window, { PlanStep, MATRIX_PROPOSALS: PROPOSALS, matrixUnits });
})();
