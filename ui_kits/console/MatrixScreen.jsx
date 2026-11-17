(() => {
const { Card, Button, Icon, Badge, EmptyState, Dialog, IconButton, StatusDot } = window.HUITOUAIDesignSystem_52606d;

/* 腾讯营销 · 投放矩阵（右侧面板）。只放结果，不放表单。
   矩阵是三段：营销单元矩阵 → 创意矩阵 → 广告计划（= 单元 × 创意）→ 逐条决策后投放。
   三段都在左侧对话里推进，这里是同一份状态的看板：走到哪一段、每段有多少条、投出去之后跑成什么样。
   步骤条用「已完成 / 进行中 / 未开始」三态，而不是页签 —— 后一段的内容依赖前一段，跳着看没有意义。 */

const STAGES = [
  { key: 'units', name: '营销单元矩阵', at: ['proposed'] },
  { key: 'creatives', name: '创意矩阵', at: ['units-ok', 'materials-ok'] },
  { key: 'plans', name: '广告计划', at: ['creatives-ok'] },
];
const ORDER = ['proposed', 'units-ok', 'materials-ok', 'creatives-ok', 'approved'];

/* 按当前阶段决定「回到对话继续」发哪一句：每句对应 matrixReplyFor 里那一段的入口 */
function resumeText(st, units) {
  if (st.phase === 'units-ok') return '确认 ' + units.length + ' 条营销单元';
  if (st.phase === 'materials-ok') return '素材已就绪 ' + (st.assets || []).length + ' 张';
  if (st.phase === 'creatives-ok') return '创意矩阵已确认 ' + (st.creatives || []).length + ' 组';
  return '帮我创建营销矩阵';
}

function MatrixScreen() {
  const st = window.useMatrixStore();
  const proposals = window.matrixUnits ? window.matrixUnits() : [];
  const units = proposals.filter((p) => (st.picked || []).includes(p.id));
  const [tab, setTab] = React.useState('current');
  const [confirmDel, setConfirmDel] = React.useState(false);
  const created = st.batches || [];
  const idx = ORDER.indexOf(st.phase);
  ensureShimmer();
  const running = (idx >= 0 && st.phase !== 'approved') || !!st.gen;

  const discard = () => {
    window.setMatrixRound(st.round, { phase: 'discarded', picked: [] });
    window.setMatrixStore({ phase: 'asked-content', picked: [], assets: [], creatives: null });
    setConfirmDel(false);
    if (window.HUITOU_CHAT_SEND) window.HUITOU_CHAT_SEND('这版方案不要了，删掉');
  };
  const goChat = () => window.HUITOU_CHAT_SEND && window.HUITOU_CHAT_SEND('帮我创建营销矩阵');

  const counts = {
    units: units.length,
    creatives: st.creatives ? st.creatives.length : (st.assets || []).length ? units.length : 0,
    plans: st.creatives ? units.length : 0,
  };
  const stageState = (s) => {
    const first = ORDER.indexOf(s.at[0]);
    if (idx < 0) return 'idle';
    if (idx > ORDER.indexOf(s.at[s.at.length - 1])) return 'done';
    return idx >= first ? 'active' : 'idle';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <TabBtn on={tab === 'current'} onClick={() => setTab('current')} dot={running} count={created.length}>当前批次</TabBtn>
        <TabBtn on={tab === 'history'} onClick={() => setTab('history')} count={2}>历史批次</TabBtn>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
          {tab === 'current' ? '三段都在对话里推进，这里看进度与结果' : '留下好的、关停差的，AI 从结果里学走下一轮的起点'}
        </span>
      </div>

      {tab === 'history' ? <window.BatchesView /> : <>
        <SettingsCard st={st} />
        {running ? (
          <Card padded={false} selected>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-6) var(--gutter-card)', minWidth: 0, flexWrap: 'wrap', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
              <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap' }}>{(st.content || {}).batch || '本轮矩阵'}</span>
<Badge tone={st.gen ? 'ai' : 'warning'}>{st.gen ? '生成中' : '草稿'}</Badge>
              <span style={{ flex: 1 }} />
              {/* 「继续」要落在当前这一段，不能重走第一步 —— 重走会 startRound()，多出一份并存的草稿 */}
              {st.gen ? null : <>
                <Button variant="ghost" size="sm" iconLeft="message-square" onClick={() => window.HUITOU_CHAT_SEND && window.HUITOU_CHAT_SEND(resumeText(st, units))}>回到对话继续</Button>
                <IconButton icon="trash-2" label="删除这版草稿" size="sm" onClick={() => setConfirmDel(true)} />
              </>}
            </div>

            {/* 流程条：节点之间用连接线，走过的那段实心 —— 三个并排的圆点读起来是三个标签，不是一条流程。
                节点在上、文字在下居中，连接线接在圆点的垂直中线上。 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', padding: 'var(--space-7) var(--gutter-card) var(--space-6)' }}>
              {STAGES.map((s, i) => {
                const state = stageState(s);
                const busy = st.gen === s.key && state !== 'idle';
                const prevDone = i > 0 && stageState(STAGES[i - 1]) === 'done';
                const dotBg = state === 'done' ? 'var(--neutral-900)' : state === 'active' ? 'var(--neutral-0)' : 'var(--neutral-0)';
                const dotBorder = state === 'done' ? 'var(--neutral-900)' : state === 'active' ? 'var(--status-warning-fg)' : 'var(--border-default)';
                return (
                  <div key={s.key} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <span style={{ flex: 1, height: 1.5, background: i === 0 ? 'transparent' : prevDone ? 'var(--neutral-900)' : 'var(--border-default)' }} />
                      <span style={{
                        flex: 'none', width: 22, height: 22, borderRadius: 999, display: 'grid', placeItems: 'center',
                        fontSize: 'var(--fs-11)', fontVariantNumeric: 'tabular-nums',
                        background: dotBg, borderWidth: 1.5, borderStyle: 'solid', borderColor: dotBorder,
                        color: state === 'done' ? 'var(--neutral-0)' : state === 'active' ? 'var(--status-warning-fg)' : 'var(--text-tertiary)',
                        boxShadow: state === 'active' ? '0 0 0 3px var(--status-warning-bg)' : 'none',
                      }}>{busy ? <Icon name="loader-circle" size={12} style={{ animation: 'matrixSpin 1s linear infinite' }} /> : state === 'done' ? <Icon name="check" size={12} /> : i + 1}</span>
                      <span style={{ flex: 1, height: 1.5, background: i === STAGES.length - 1 ? 'transparent' : state === 'done' ? 'var(--neutral-900)' : 'var(--border-default)' }} />
                    </div>
                    <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center' }}>
                      <span style={{ fontSize: 'var(--fs-13)', fontWeight: state === 'idle' ? 'var(--fw-regular)' : 'var(--fw-medium)', color: state === 'idle' ? 'var(--text-tertiary)' : 'var(--text-primary)', whiteSpace: 'nowrap' }}>{s.name}</span>
                      <span style={{ fontSize: 'var(--fs-11)', color: state === 'active' ? 'var(--status-warning-fg)' : 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        {busy ? '生成中…' : state === 'idle' ? '未开始' : counts[s.key] ? counts[s.key] + ' 条' : state === 'active' ? '进行中' : '—'}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

            {st.gen ? <DraftSkeleton stage={st.gen} rows={st.gen === 'units' ? 4 : Math.max(1, units.length)} /> : <Draft st={st} units={units} />}

            <Dialog open={confirmDel} width={420} title="删除这版矩阵草稿？"
              description={units.length + ' 条营销单元与已配的创意会一起删除，不会提交腾讯。对话里会留一条记录，之后可以让 AI 重新生成。'}
              onClose={() => setConfirmDel(false)}
              footer={<>
                <Button onClick={() => setConfirmDel(false)}>取消</Button>
                <Button variant="danger" iconLeft="trash-2" onClick={discard}>删除草稿</Button>
              </>} />
          </Card>
        ) : null}

        {created.length ? <window.BatchesView fresh={created} onlyPending /> : null}

        {!running && !created.length && !(st.setup || (st.profile && st.profile.name)) ? (
          <Card>
            <EmptyState icon="grid-3x3" title="还没有进行中的批次"
              description="矩阵在对话里生成：先定营销单元，再配创意，两者组合成广告计划，逐条决策后投放。"
              action={<Button variant="primary" iconLeft="sparkles" onClick={goChat}>去对话里生成</Button>} />
          </Card>
        ) : null}
      </>}
    </div>
  );
}

/* 画像与营销内容填在对话里，但对话会被后面的消息埋掉 —— 所以它们的常驻位置在这里。
   这张卡在整轮矩阵期间一直在，改了对话侧的回执同步变（同一份共享状态）。 */
function SettingsCard({ st }) {
  const [open, setOpen] = React.useState(null);      // 展开看的那一段
  const [edit, setEdit] = React.useState(null);      // 正在编辑的那一段
  const [draft, setDraft] = React.useState({});
  const rows = window.matrixRows || (() => []);
  /* 提交过的用正式值，还在对话里填的用 draft —— 面板要在填的过程中就有东西看 */
  const prof = st.profile || {};
  const cont = st.content || {};
  const has = prof.name || cont.goal || st.setup;
  if (!has) return null;
  const SECTIONS = [
    { kind: 'profile', name: '投放画像', src: prof, line: prof.name === '（跳过）' ? '已跳过' : prof.name || '对话里填写中…' },
    { kind: 'content', name: '营销内容与目标', src: cont, line: cont.goal ? cont.goal + ' · 目标 CPA ¥' + (cont.cpa || '—') : '对话里填写中…' },
  ];
  const cur = SECTIONS.find((x) => x.kind === edit);
  return (
    <Card padded={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>本轮设置</span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>整批共用，改了之后新生成的方案按新的来</span>
      </div>
      {SECTIONS.map((sec, i) => {
        const list = rows(sec.kind, sec.src);
        const on = open === sec.kind;
        return (
          <div key={sec.kind} style={{ borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)' }}>
              <button type="button" onClick={() => setOpen(on ? null : sec.kind)}
                style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 0, border: 0, background: 'none', font: 'inherit', color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ fontSize: 'var(--fs-13)', whiteSpace: 'nowrap' }}>{sec.name}</span>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sec.line}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{list.length} 项</span>
                <Icon name="chevron-down" size={13} style={{ flex: 'none', color: 'var(--text-tertiary)', transform: on ? 'rotate(180deg)' : 'none' }} />
              </button>
              <Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => { setDraft(Object.assign({}, sec.src)); setEdit(sec.kind); }}>修改</Button>
            </div>
            {on ? (
              <div style={{ padding: '0 var(--gutter-card) var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-5) var(--space-6)' }}>
                {list.map(([k, v]) => (
                  <div key={k} style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{k}</div>
                    <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-primary)', marginTop: 2, whiteSpace: 'pre-line', lineHeight: 'var(--lh-normal)' }}>{v}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
      <Dialog open={!!edit} width={720} title={cur ? '修改' + cur.name : ''} onClose={() => setEdit(null)}
        footer={<>
          <Button onClick={() => setEdit(null)}>取消</Button>
          <Button variant="primary" iconLeft="check" onClick={() => {
            window.setMatrixStore(edit === 'profile' ? { profile: draft } : { content: draft });
            setEdit(null);
          }}>保存修改</Button>
        </>}>
        {/* 这两张表比视口高，弹窗里必须自己滚 —— 否则标题与页脚被挤出视口，保存按钮点不到 */}
        <div className="huitou-scroll" style={{ maxHeight: 'min(60vh, 520px)', overflowY: 'auto', margin: '0 calc(var(--space-5) * -1)', padding: '0 var(--space-5)' }}>
          {edit === 'profile'
            ? <window.ProfileStep v={draft} set={(k, val) => setDraft((d) => Object.assign({}, d, { [k]: val }))} />
            : <window.FixedStep v={draft} set={(k, val) => setDraft((d) => Object.assign({}, d, { [k]: val }))} />}
        </div>
      </Dialog>
    </Card>
  );
}

/* 草稿明细：走到哪一段就显示那一段的东西。单元在最上（后面两段都挂在它上面），
   创意配好后每个单元后面跟一行创意，计划成立后再多一行出价与预算的合计。 */
function Draft({ st, units }) {
  const groups = st.creatives || null;
  const Thumb = window.MatrixThumb;
  const [detail, setDetail] = React.useState(null);
  const Detail = window.MatrixUnitDetail;
  /* 草稿行与批次行看的是同一份腾讯参数，所以详情复用批次那张弹窗 —— 两处不能长成两套 */
  const draftBatch = { name: (st.content || {}).batch || '本轮矩阵', cpaTarget: Number((st.content || {}).cpa) || 100, day: 0, span: 7, fresh: true };
  if (!units.length) return null;
  return (
    <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)' }}>
      {units.map((u, i) => {
        const g = groups ? groups[i] : null;
        return (
          <div key={u.id} style={{ padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setDetail(Object.assign({}, u, { state: '草稿', creative: g }))}
                style={{ padding: 0, border: 0, background: 'none', font: 'inherit', fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left' }}>{u.name}</button>
              <Badge tone="ai">只改 · {u.dim}</Badge>
              <span style={{ flex: 1 }} />
              <Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => setDetail(Object.assign({}, u, { state: '草稿', creative: g }))}>编辑</Button>
            </div>
            {/* 一行摘要：腾讯建单里最容易看错的四项，展开前先给出来 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
              <span>{u.dim === '版位' && u.to ? u.to : '智能版位'}</span>
              <span>{u.dim === '定向' && u.to ? u.to : '手动定向 · 25-50 岁'}</span>
              <span>{u.dim === '出价类型' && u.to ? u.to : '稳定拿量'}</span>
              <span>长期投放 · 全天</span>
            </div>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>¥{u.bid} · 日预算 ¥{u.budget}</span>
            {g ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
                {g.assets.slice(0, 3).map((m) => <Thumb key={m.id} item={m} size={28} />)}
                <span style={{ minWidth: 0, fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {g.form} · {g.assets.length} 张 · {g.title}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>创意待配</span>
            )}
          </div>
        );
      })}
      {groups ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)', flexWrap: 'wrap' }}>
          <StatusDot tone="warning" label={'待决策 ' + units.length + ' 条广告计划'} style={{ fontSize: 'var(--fs-12)' }} />
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>合计日预算 ¥{units.reduce((s, u) => s + u.budget, 0)}</span>
        </div>
      ) : null}
      {detail && Detail ? <Detail p={detail} batch={draftBatch} onClose={() => setDetail(null)} /> : null}
    </div>
  );
}

/* 生成中的占位：与真实行同结构同高，生成完不产生跳动。
   微光扫过用 keyframes 注入一次（inline style 表达不了 @keyframes）。 */
function ensureShimmer() {
  if (document.getElementById('matrix-shimmer')) return;
  const el = document.createElement('style');
  el.id = 'matrix-shimmer';
  el.textContent = '@keyframes matrixShimmer{0%{background-position:-160% 0}100%{background-position:260% 0}}@keyframes matrixSpin{to{transform:rotate(360deg)}}';
  document.head.appendChild(el);
}
function Bar({ w, h = 12 }) {
  ensureShimmer();
  return <span style={{ display: 'block', width: w, height: h, borderRadius: 999, background: 'linear-gradient(90deg,var(--neutral-100) 0%,var(--neutral-200) 45%,var(--neutral-100) 90%)', backgroundSize: '220% 100%', animation: 'matrixShimmer 1.15s var(--ease-standard) infinite' }} />;
}
function DraftSkeleton({ rows = 4, stage }) {
  return (
    <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 'var(--space-5) var(--gutter-card)', fontSize: 'var(--fs-12)', color: 'var(--status-ai-fg)' }}>
        <Icon name="sparkles" size={12} />
        <span>{stage === 'creatives' ? '正在按每个单元的版位与人群分配创意…' : stage === 'plans' ? '正在把单元与创意组合成广告计划…' : '正在读取账户数据，生成营销单元…'}</span>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8, opacity: 1 - i * 0.12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <Bar w={140 + (i % 3) * 34} h={13} />
            <Bar w={62} h={13} />
            <span style={{ flex: 1 }} />
            <Bar w={104} h={12} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
            <Bar w={64} /><Bar w={118} /><Bar w={72} /><Bar w={86} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TabBtn({ on, onClick, count, dot, children }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 var(--space-5)', cursor: 'pointer', font: 'inherit',
        fontSize: 'var(--fs-13)', fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)',
        border: 0, borderRadius: 'var(--radius-sm)', background: on ? 'var(--surface-selected)' : 'transparent',
        color: on ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'var(--transition-control)',
      }}>
      {children}
      {count ? <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{count}</span> : null}
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--status-warning-fg)' }} /> : null}
    </button>
  );
}

Object.assign(window, { MatrixScreen });
})();
