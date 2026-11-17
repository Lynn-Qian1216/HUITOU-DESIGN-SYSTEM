(() => {
const { Card, Button, Badge, Icon, Checkbox, StatusDot } = window.HUITOUAIDesignSystem_52606d;

/* 投放矩阵 · 对话侧。
   建矩阵是一段对话，不是一张表单页：用户说「创建营销矩阵」，AI 先问画像、再问营销内容与目标、
   然后把生成的方案放回对话里让人勾执行。右侧「投放矩阵」面板只放批准之后的结果 —— 当前批次与历史批次。
   对话与面板共享一个小状态（phase / picked），任一侧的勾选与批准另一侧立刻能看到。 */

const listeners = new Set();
/* phase / picked 是「当前轮」的镜像；每一轮各有一份存在 rounds 里，对话里的方案块绑定自己那一轮，
   新一轮开始时上一轮的块不会被改写。批准过的轮次以快照进 batches，右侧面板按它渲染。 */
const store = window.HUITOU_MATRIX = window.HUITOU_MATRIX || {
  /* 三段：营销单元矩阵 → 创意矩阵 → 广告计划（= 单元 × 创意）→ 逐条决策后投放 */
  phase: 'none',   // none → asked-profile → asked-content → proposed → units-ok → materials-ok → creatives-ok → approved
  profile: null, content: null,
  picked: [],      // 选中的营销单元
  assets: [], creatives: null,
  approvedAt: null,
  round: 0, rounds: {}, batches: [],
};
const ROUND_CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
/* 新一轮沿用上次的批次名时把序号推进：「第一轮」→「第二轮」；没有序号就补一个 */
function nextBatchName(name, n) {
  const s = String(name || '').trim();
  if (/第[一二三四五六七八九十]+轮/.test(s)) return s.replace(/第[一二三四五六七八九十]+轮/, '第' + (ROUND_CN[n] || n) + '轮');
  return (s || '营销矩阵') + ' · 第' + (ROUND_CN[n] || n) + '轮';
}
function startRound(content) {
  markGen('units');
  const n = store.round + 1;
  const all = (window.matrixUnits ? window.matrixUnits() : []).map((p) => p.id);
  const named = n > 1 ? Object.assign({}, content, { batch: nextBatchName(content.batch, n) }) : content;
  const rounds = Object.assign({}, store.rounds, { [n]: { picked: all, phase: 'proposed', content: named } });
  setStore({ content: named, round: n, rounds, phase: 'proposed', picked: all });
  return named;
}
function setRound(n, patch) {
  const cur = store.rounds[n] || {};
  const rounds = Object.assign({}, store.rounds, { [n]: Object.assign({}, cur, patch) });
  const mirror = n === store.round ? { phase: patch.phase || cur.phase, picked: patch.picked || cur.picked } : {};
  setStore(Object.assign({ rounds }, mirror));
}
function setStore(patch) {
  Object.assign(store, patch);
  listeners.forEach((fn) => fn());
}
/* 右侧面板与对话看同一份状态，所以「正在生成」也要是共享状态 ——
   否则对话里在转，右侧却已经把结果画满了，读起来像凭空出现。 */
function markGen(stage, ms) {
  setStore({ gen: stage });
  setTimeout(() => { if (store.gen === stage) setStore({ gen: null }); }, ms || 1600);
}
function useMatrixStore() {
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    const fn = () => tick((n) => n + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return store;
}

/* 对话里的表单块：复用面板里那两步的卡片，底部一行提交。
   提交后把摘要作为一条用户消息发回去 —— 对话记录里要留得住「当时填了什么」。 */
/* 画像与营销内容的字段顺序只有一份 —— 对话回执与右侧面板读同一个，否则两处会长成两套说法 */
function matrixRows(kind, src) {
  src = src || {};
  return (kind === 'profile'
    ? [['产品名称', src.name], ['产品介绍', src.intro], ['核心卖点', src.selling], ['人群', src.audience], ['转化路径', src.path], ['合规要求', src.compliance], ['长期投放要求', (src.rules || []).join('；')]]
    : [['营销目的', src.goal], ['推广产品', [src.productType, src.product].filter(Boolean).join(' · ')], ['关联门店', src.store ? '开' : '关'], ['营销载体', src.media], ['转化', src.conversion], ['批次名称', src.batch],
       ['目标 CPA', src.cpa ? '¥' + src.cpa : ''], ['保本 CPA', src.breakeven ? '¥' + src.breakeven : ''], ['账号日预算上限', src.budgetMax ? '¥' + src.budgetMax : ''], ['账号日预算下限', src.budgetMin ? '¥' + src.budgetMin : ''], ['CPA 转化口径', src.cpaBasis]]
  ).filter(([, v]) => String(v || '').trim());
}

function MatrixFormBlock({ kind, onAct }) {
  const st = useMatrixStore();
  /* 这个块自己记「交过没有」。再建一批时上一轮的画像还在 store 里，
     但这一块还没交 —— 于是先出一张「上次填的」确认卡，让人选保持不变或改几项。 */
  const [done, setDone] = React.useState(false);
  const [prior] = React.useState(() => (kind === 'profile' ? st.profile : st.content) || null);
  const submitted = done;
  const [editing, setEditing] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [profile, setProfile] = React.useState(() => st.profile || { name: '', intro: '', selling: '', audience: '', path: '', compliance: '', rules: [] });
  const [fixed, setFixed] = React.useState(() => st.content || {
    batch: '宠物责任险 · 第一轮', goal: '', productType: '', product: '', store: false, media: '', conversion: '',
    cpa: '100', breakeven: '', budgetMax: '', budgetMin: '', cpaBasis: '表单预约',
  });
  /* 回复一出来就把右侧面板拉开：填写在对话里做，但填出来的东西要有个看得见的常驻位置。
     正在填的内容实时镜像成 draft，面板边填边显示，不用等提交。 */
  const setP = (k, v) => setProfile((s) => Object.assign({}, s, { [k]: v }));
  const setF = (k, v) => setFixed((s) => Object.assign({}, s, { [k]: v }));

  const ready = kind === 'profile' ? !!profile.name.trim() : !!(fixed.goal && fixed.product && fixed.media && fixed.conversion);

  const submit = (skip) => {
    /* 回执里点「修改」再保存：只更新状态、发一句「已更新」，不重走后面的问答 */
    if (editing && done) {
      if (kind === 'profile') setStore({ profile });
      else setStore({ content: fixed });
      setEditing(false);
      onAct && onAct({ type: 'send', text: (kind === 'profile' ? '投放画像已更新：' + profile.name : '营销内容与目标已更新：' + fixed.goal + ' · 目标 CPA ¥' + (fixed.cpa || '—')) });
      return;
    }
    setDone(true);
    setEditing(false);
    if (kind === 'profile') {
      setStore({ profile: skip ? { name: '（跳过）' } : profile, phase: 'asked-content', setup: true });
      /* 画像交了才把右侧拉开 —— 这时候面板上才有东西可看。
         等这条消息渲染完再拉：和提交挤在同一帧，展开动画会被跳过，面板像凭空出现。 */
      setTimeout(() => onAct && onAct({ type: 'open-rail', rail: 'matrix' }), 320);
      const filled = ['name', 'intro', 'selling', 'audience', 'path', 'compliance'].filter((k) => String(profile[k] || '').trim()).length;
      onAct && onAct({ type: 'send', text: skip ? '先跳过画像，直接建' : '投放画像已填好：' + profile.name + '，' + filled + ' 项' });
    } else {
      const named = startRound(fixed);
      onAct && onAct({ type: 'send', text: '营销内容与目标已填好：' + named.goal + ' · ' + named.media + ' · 目标 CPA ¥' + (named.cpa || '—') });
    }
  };

  const keepPrior = () => {
    setDone(true);
    if (kind === 'profile') {
      setStore({ profile: prior, phase: 'asked-content' });
      onAct && onAct({ type: 'send', text: '投放画像保持不变：' + prior.name });
    } else {
      const named = startRound(prior);
      onAct && onAct({ type: 'send', text: '营销内容与目标保持不变：' + named.goal + ' · 目标 CPA ¥' + (named.cpa || '—') + '，批次名推进为「' + named.batch + '」' });
    }
  };

  const rowsOf = (src) => matrixRows(kind, src);

  /* 上一轮填过：先确认。摘要照原样铺出来，人只需要判断「还一样吗」 */
  if (prior && !done && !editing && !(kind === 'profile' && prior.name === '（跳过）')) {
    return (
      <Card padded={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
          <Icon name="history" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
          <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{kind === 'profile' ? '上次填的投放画像' : '上次填的营销内容与目标'}</span>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{rowsOf(prior).length} 项</span>
        </div>
        <div style={{ padding: 'var(--space-5) var(--gutter-card)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5) var(--space-6)' }}>
          {rowsOf(prior).map(([k, v]) => (
            <div key={k} style={{ minWidth: 0 }}>
              <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{k}</div>
              <div style={{ fontSize: 'var(--fs-13)', marginTop: 2, whiteSpace: 'pre-line', lineHeight: 'var(--lh-normal)' }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>这批还按这套来吗？</span>
          <span style={{ flex: 1 }} />
          <Button variant="secondary" size="sm" iconLeft="pencil" onClick={() => { if (kind === 'profile') setProfile(prior); else setFixed(prior); setEditing(true); }}>改几项</Button>
          <Button variant="primary" size="sm" iconRight="arrow-right" onClick={keepPrior}>保持不变，下一步</Button>
        </div>
      </Card>
    );
  }

  /* 已提交的表单折成一行回执 —— 对话往下走了，上面留一整张可编辑的表单会让人以为还没交。
     但填过的内容得看得到、改得了：回执可展开成只读摘要，摘要里有「修改」把表单再放回来。 */
  if (submitted && !editing) {
    const src = kind === 'profile' ? st.profile : st.content;
    const skipped = kind === 'profile' && src.name === '（跳过）';
    const line = kind === 'profile'
      ? (skipped ? '已跳过投放画像' : '投放画像 · ' + src.name)
      : '营销内容与目标 · ' + src.goal + ' · ' + src.media + ' · 目标 CPA ¥' + (src.cpa || '—');
    const filledRows = rowsOf(src);
    const startEdit = () => {
      if (kind === 'profile') setProfile(skipped ? { name: '', intro: '', selling: '', audience: '', path: '', compliance: '', rules: [] } : src);
      else setFixed(src);
      setEditing(true);
    };
    return (
      <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)' }}>
          <button type="button" onClick={() => setExpanded(!expanded)}
            style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 0, border: 0, background: 'none', font: 'inherit', color: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
            <Icon name="check" size={14} style={{ color: 'var(--status-success-fg)', flex: 'none' }} />
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{line}</span>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{skipped ? '' : filledRows.length + ' 项'}</span>
            <Icon name="chevron-down" size={13} style={{ flex: 'none', color: 'var(--text-tertiary)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-fast, .12s) var(--ease-standard)' }} />
          </button>
          <Button variant="ghost" size="sm" iconLeft="pencil" onClick={startEdit}>{skipped ? '补填' : '修改'}</Button>
        </div>
        {expanded && !skipped ? (
          <div style={{ padding: '0 var(--space-6) var(--space-6)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', paddingTop: 'var(--space-5)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5) var(--space-6)' }}>
            {filledRows.map(([k, v]) => (
              <div key={k} style={{ minWidth: 0 }}>
                <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{k}</div>
                <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-primary)', marginTop: 2, whiteSpace: 'pre-line', lineHeight: 'var(--lh-normal)' }}>{v}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      {kind === 'profile' ? <window.ProfileStep v={profile} set={setP} /> : <window.FixedStep v={fixed} set={setF} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
          {kind === 'profile' ? '产品名称与介绍必填；其余不填也能建，方案会更保守。' : '这套会作为整批的营销内容提交腾讯。'}
        </span>
        <span style={{ flex: 1 }} />
        {editing ? <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>取消</Button>
          : kind === 'profile' ? <Button variant="ghost" size="sm" onClick={() => submit(true)}>跳过</Button> : null}
        <Button variant="primary" size="sm" iconRight={editing && done ? undefined : 'arrow-right'} iconLeft={editing && done ? 'check' : undefined} disabled={!ready} onClick={() => submit(false)}>
          {editing && done ? '保存修改' : kind === 'profile' ? '提交，下一步' : '提交，生成方案'}
        </Button>
      </div>
    </div>
  );
}

/* 对话里的方案块：每条一行 diff + 勾选，底部批准。与右侧面板共用勾选状态。 */
function MatrixProposalsBlock({ onAct }) {
  const st = useMatrixStore();
  const list = window.matrixUnits ? window.matrixUnits() : [];
  const [roundId] = React.useState(() => st.round);
  const r = st.rounds[roundId] || { picked: [], phase: 'none', content: st.content };
  const approved = r.phase !== 'proposed' && r.phase !== 'discarded';
  const picked = r.picked || [];
  if (r.phase === 'discarded') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)', borderWidth: 1, borderStyle: 'dashed', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)' }}>
        <Icon name="trash-2" size={14} style={{ flex: 'none' }} />
        <span>这版方案已删除，未提交任何单元。</span>
      </div>
    );
  }
  const toggle = (id) => setRound(roundId, { picked: picked.includes(id) ? picked.filter((x) => x !== id) : picked.concat(id) });
  const chosen = list.filter((p) => picked.includes(p.id));
  /* 这一步只是定下单元，还没有创意 —— 广告计划要等创意配完才成立 */
  const confirmUnits = () => { setRound(roundId, { phase: 'units-ok' }); setStore({ phase: 'units-ok' }); };
  const budget = chosen.reduce((s, p) => s + p.budget, 0);

  return (
    <Card padded={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>营销单元草稿</span>
        <Badge tone="neutral">{list.length} 条</Badge>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>每条只改一个变量</span>
        <span style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" iconRight="arrow-up-right" onClick={() => onAct && onAct({ type: 'open-rail', rail: 'matrix' })}>在右侧查看完整参数</Button>
      </div>
      <div>
        {list.map((p, i) => {
          const on = picked.includes(p.id);
          return (
            <label key={p.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', cursor: approved ? 'default' : 'pointer',
              borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
              background: on ? 'var(--surface-card)' : 'var(--neutral-25)', opacity: approved && !on ? 0.55 : 1,
            }}>
              <span style={{ flex: 'none', paddingTop: 1 }}><Checkbox checked={on} disabled={approved} onChange={() => toggle(p.id)} /></span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{p.name}</span>
                  <Badge tone="ai">只改 · {p.dim}</Badge>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>¥{p.bid} · 日预算 ¥{p.budget}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--fs-12)' }}>
                  <span style={{ color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>{p.from}</span>
                  <Icon name="arrow-right" size={11} style={{ color: 'var(--text-tertiary)' }} />
                  <span>{p.to}</span>
                </span>
              </span>
            </label>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)', flexWrap: 'wrap' }}>
        {approved
          ? <StatusDot tone="success" label={'已定 ' + chosen.length + ' 条营销单元'} style={{ fontSize: 'var(--fs-12)' }} />
          : <span style={{ fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums' }}>执行 <strong>{chosen.length}</strong> / {list.length} 条 · 合计日预算 ¥{budget}</span>}
        <span style={{ flex: 1 }} />
        {approved ? null : (
          <Button variant="primary" size="sm" iconRight="arrow-right" disabled={!chosen.length}
            onClick={() => { confirmUnits(); onAct && onAct({ type: 'send', text: '确认 ' + chosen.length + ' 条营销单元' }); }}>
            确认单元，下一步创意
          </Button>
        )}
      </div>
    </Card>
  );
}

/* 对话脚本：按用户说的话给回复。表单块与方案块是活的，其余是普通文本。 */
const MATRIX_REPLIES = {
  '帮我创建营销矩阵': [
    { type: 'text', body: '好，先花一分钟对齐画像 —— 我需要知道卖什么、卖给谁、什么不能说。产品名称与介绍必填，其余不填我也能建，只是方案会更保守。' },
    { type: 'matrix-form', kind: 'profile' },
  ],
  '__profile_done': [
    { type: 'text', body: '收到。下面这套是腾讯建单的营销内容，同一批广告共用；再加一组经营目标，我用它比较方案、决定留谁关谁 —— 这部分不会提交腾讯。' },
    { type: 'matrix-form', kind: 'content' },
  ],
  '__content_done': [
    { type: 'text', body: '我读了账户里现有的 4 条营销单元（1 条在投，近 14 天消耗 ¥1,605、0 次转化）。现有定向明细不足，不能做严格的单变量归因，所以第一轮先建立可执行的对照组：每条只改一个变量，其余保持不变。' },
    { type: 'matrix-proposals' },
    { type: 'text', body: '勾上要执行的单元。单元只是骨架 —— 确认后我们再配创意，两者组合出来才是能投的广告计划。' },
    { type: 'footnote', items: ['矩阵规划师', '基于 8 月 19 日至今的账户数据'], actions: [{ label: '在右侧查看投放矩阵', icon: 'arrow-up-right', act: { type: 'open-rail', rail: 'matrix' } }] },
  ],
  '__units_done': [
    { type: 'text', body: '单元定了。接下来是创意 —— 你把图给我，分配交给我：我按每个单元的版位与人群决定版式、尺寸和说法，同一张图在不同单元里会做成不同版式。' },
    { type: 'matrix-materials' },
  ],
  '__materials_done': [
    { type: 'text', body: '分好了。一个单元一组创意，每组的版式和说法都跟着这个单元要验证的变量走 —— 创意本身不作为变量，否则出价和图两件事一起动，结果归因不清。' },
    { type: 'matrix-creatives' },
  ],
  '__creatives_done': [
    { type: 'text', body: '组合完成：一个营销单元配一组创意，一条广告计划。下面是这一批的决策队列，逐条过 —— 批准的立刻提交腾讯创建，跳过的留在草稿里，下一轮还能用。' },
    { type: 'matrix-plans' },
    { type: 'footnote', items: ['矩阵规划师 · 创意组合', '素材来自本次上传与素材库'], actions: [{ label: '在右侧查看广告计划', icon: 'arrow-up-right', act: { type: 'open-rail', rail: 'matrix' } }] },
  ],
  '__profile_updated': [
    { type: 'text', body: '画像已更新。如果方案已经生成，我会在下一轮生成时按新画像来；这一轮的方案不受影响。' },
  ],
  '__content_updated': [
    { type: 'text', body: '营销内容与目标已更新。目标 CPA 变了会直接影响择优的标尺，我会按新的数重新判断留谁关谁；营销内容变了则需要重新生成方案 —— 说一句「重新生成」即可。' },
  ],
  '__discarded': [
    { type: 'text', body: '已删除这版方案，没有任何单元提交腾讯。画像与营销内容都还在 —— 想换个思路，直接告诉我调整方向（比如「只测版位，不动定向」），我按新的约束重新生成。' },
  ],
  '__approved': [
    { type: 'text', body: '已提交腾讯创建，配置核验通过后会自动开启，我会在首日结束时给你第一份观察报告。这一批在右侧「投放矩阵 · 当前批次」里能随时看。' },
    { type: 'footnote', items: ['定时任务 · 矩阵观察期日报 已排入', '每日 08:00'], actions: [{ label: '查看当前批次', icon: 'arrow-up-right', act: { type: 'open-rail', rail: 'matrix' } }] },
  ],
};

/* 把用户消息映射到回复。表单提交发出的是摘要句，用前缀匹配 */
const AGAIN = {
  profile: [
    { type: 'text', body: '上次的投放画像还在。这批还按这套来吗？确认一下 —— 保持不变直接下一步，或改几项。' },
    { type: 'matrix-form', kind: 'profile' },
  ],
  content: [
    { type: 'text', body: '营销内容与目标也沿用上次的？目标 CPA 若要调，这一步改。' },
    { type: 'matrix-form', kind: 'content' },
  ],
};

function matrixReplyFor(body) {
  if (MATRIX_REPLIES[body]) return MATRIX_REPLIES[body];
  /* 「接着建」是恢复，不是新建：草稿已经走到后面几段时，从当前那一段接上 */
  if (/接着|继续/.test(body) && /矩阵/.test(body)) {
    if (store.phase === 'units-ok') return MATRIX_REPLIES['__units_done'];
    if (store.phase === 'materials-ok') return MATRIX_REPLIES['__materials_done'];
    if (store.phase === 'creatives-ok') return MATRIX_REPLIES['__creatives_done'];
  }
  if (/创建营销矩阵|建.*矩阵/.test(body)) return store.profile ? AGAIN.profile : MATRIX_REPLIES['帮我创建营销矩阵'];
  if (/^投放画像已填好|^先跳过画像|^投放画像保持不变/.test(body)) return store.content ? AGAIN.content : MATRIX_REPLIES['__profile_done'];
  if (/^营销内容与目标已填好|^营销内容与目标保持不变/.test(body)) return MATRIX_REPLIES['__content_done'];
  if (/^确认 \d+ 条营销单元/.test(body)) return MATRIX_REPLIES['__units_done'];
  if (/^素材已就绪/.test(body)) return MATRIX_REPLIES['__materials_done'];
  if (/^创意矩阵已确认/.test(body)) return MATRIX_REPLIES['__creatives_done'];
  if (/^开始投放|^批准执行/.test(body)) return MATRIX_REPLIES['__approved'];
  if (/方案不要了|删掉/.test(body)) return MATRIX_REPLIES['__discarded'];
  if (/^投放画像已更新/.test(body)) return MATRIX_REPLIES['__profile_updated'];
  if (/^营销内容与目标已更新/.test(body)) return MATRIX_REPLIES['__content_updated'];
  return null;
}

Object.assign(window, { matrixRows, markMatrixGen: markGen, MatrixFormBlock, MatrixProposalsBlock, matrixReplyFor, useMatrixStore, setMatrixStore: setStore, setMatrixRound: setRound });
})();
