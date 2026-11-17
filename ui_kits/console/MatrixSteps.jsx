(() => {
const { Card, Button, Badge, Icon, Input, Textarea, Select, Checkbox, FormField, Divider, StatusDot } = window.HUITOUAIDesignSystem_52606d;

/* 第一步 · 投放画像。
   领导那版有十五个框：产品名 / 类别 / 承保主体 / 产品说明 / 卖点 / 核心人群 / 排除人群 /
   性别 / 年龄 / 地域 / 转化路径 / 期望行为 / 落地页用途 / 合规 / 素材方向，再加一节长期要求。
   AI 真正需要的是六件事：卖什么、是什么、凭什么买、卖给谁、怎么算成交、什么不能说。只有产品名称必填。
   其余要么能从账户数据推（类别、地域、素材方向），要么在别处已经填过（落地页在营销内容里）。
   人群的性别 / 年龄 / 地域 / 排除并成一段话 —— 分四个框逼人把「25–50 岁不限性别全国」拆成四次输入。
   画像不卡建单，所以这一步的出口是「跳过」。 */

const DRAFT = {
  name: '宠无忧 · 安心保（中国平安承保）',
  intro: '宠物医疗保险，主推「医疗保障」诉求。基础保障 399 元/年：意外疾病医疗 1.5 万，定点机构报销 70%；升级保障 799 元/年：医疗 3 万、身故责任 500 元、第三者医疗 1 万。',
  selling: '医疗保障高达 3 万元赔付\n双重守护 · 更安心：医疗、身故、三者责任\n基础版 399 元/年 · 升级版 799 元/年',
  audience: '宠物主人，25–50 岁，不限性别，全国常住；排除：无',
  path: '看到广告 → 留电 → 电话回访',
  compliance: '仅承保合法饲养、可鉴别身份的犬猫；799 版第三者医疗每次事故扣除 200 元后按 80% 赔付；底部注明承保方为中国平安财产保险股份有限公司。',
};

function ProfileStep({ v, set }) {
  const M = window.MATRIX;
  const keys = ['name', 'intro', 'selling', 'audience', 'path', 'compliance'];
  const filled = keys.filter((k) => String(v[k] || '').trim()).length;
  const [rule, setRule] = React.useState('');
  const rules = v.rules || [];
  const anchor = React.useRef(null);
  /* 一键起草会把六个字段一次填满，卡片高度跟着涨 —— 不滚到底人只看到第一格变了 */
  const draft = () => {
    Object.keys(DRAFT).forEach((k) => set(k, DRAFT[k]));
    requestAnimationFrame(() => {
      let sc = anchor.current && anchor.current.parentElement;
      while (sc && !/(auto|scroll)/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
      if (!sc) return;
      sc.scrollTop = sc.scrollHeight;
      setTimeout(() => { sc.scrollTop = sc.scrollHeight; }, 120);
    });
  };
  const addRule = () => { if (rule.trim()) { set('rules', rules.concat(rule.trim())); setRule(''); } };

  return (
    <div ref={anchor} style={{ display: 'contents' }}>
    <Card
      title={<window.CardTitle info="AI 用它理解你在卖什么、卖给谁、什么不能说；不填也能建单，只是方案会更保守">投放画像</window.CardTitle>}
      subtitle={'已填 ' + filled + ' / 6 · 产品名称与介绍必填'}
      actions={<Button variant="primary" size="sm" iconLeft="sparkles" onClick={draft}>用账户数据起草</Button>}
      footer={<span>这一批广告跑完后，AI 会把实际转化情况写回画像 —— 下一批不用从头填。</span>}>

      <FormField label="产品名称" required hint="承保或供应主体一并写在这里">
        <Input value={v.name} onChange={(e) => set('name', e.target.value)} placeholder="宠无忧 · 安心保（中国平安承保）" />
      </FormField>
      <div style={{ marginTop: 'var(--space-6)' }}>
        <FormField label="产品介绍" required hint="一段话说清是什么、卖多少钱">
          <Textarea rows={3} value={v.intro} onChange={(e) => set('intro', e.target.value)} placeholder="宠物医疗保险，两档：基础版 399 元/年，升级版 799 元/年" />
        </FormField>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <FormField label="核心卖点" hint="每行一条，AI 写素材时按这个顺序取">
          <Textarea rows={4} value={v.selling} onChange={(e) => set('selling', e.target.value)} placeholder={'医疗保障高达 3 万元赔付\n双重守护 · 更安心'} />
        </FormField>
        <FormField label="人群" hint="一段话：是谁、年龄性别地域、要排除谁">
          <Textarea rows={4} value={v.audience} onChange={(e) => set('audience', e.target.value)} placeholder="宠物主人，25–50 岁，不限性别，全国常住；排除：无" />
        </FormField>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <FormField label="转化路径" hint="用户从看到广告到成交要走几步">
          <Textarea rows={3} value={v.path} onChange={(e) => set('path', e.target.value)} placeholder="看到广告 → 留电 → 电话回访" />
        </FormField>
        <FormField label="合规要求" hint="素材里必须写或不能写的">
          <Textarea rows={3} value={v.compliance} onChange={(e) => set('compliance', e.target.value)} placeholder="例如：底部注明承保方；不得使用「最」「第一」" />
        </FormField>
      </div>

      <Divider spacing="var(--space-6)" />

      {/* 长期投放要求：一条一行，独立生效。它是给 AI 的约束，不是给腾讯的参数 —— 所以是列表不是表单 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>长期投放要求</span>
        <window.InfoHint label="每条独立生效，AI 生成方案时必须遵守；停用后保留记录但不再影响新方案" size={12} />
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{rules.length ? rules.length + ' 条生效中' : '还没有'}</span>
      </div>
      {rules.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          {rules.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minHeight: 28, padding: '0 var(--space-4)', borderRadius: 'var(--radius-xs)', background: 'var(--neutral-25)', fontSize: 'var(--fs-12)' }}>
              <Icon name="pin" size={12} style={{ flex: 'none', color: 'var(--text-tertiary)' }} />
              <span style={{ flex: 1, minWidth: 0 }}>{r}</span>
              <button type="button" onClick={() => set('rules', rules.filter((_, j) => j !== i))} aria-label="移除"
                style={{ display: 'inline-flex', padding: 2, border: 0, background: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><Icon name="x" size={12} /></button>
            </div>
          ))}
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <Input size="sm" value={rule} onChange={(e) => setRule(e.target.value)} placeholder="例如：首轮优先验证朋友圈，搜索场景暂不进入第一阶段"
          onKeyDown={(e) => { if (e.key === 'Enter') addRule(); }} style={{ flex: 1, minWidth: 0 }} />
        <Button variant="secondary" size="sm" iconLeft="plus" onClick={addRule} disabled={!rule.trim()}>新增</Button>
      </div>
    </Card>
    </div>
  );
}

/* 第二步 · 营销内容与目标。上半是腾讯建单的「营销内容」，字段与取值跟后台对齐 ——
   同一批广告的产品与转化目标一致，所以固定下来，不进矩阵。
   营销目的与营销载体做成一排可点的块而不是下拉：取值就五个和七个，
   摊开一眼看完，比点开下拉再读一遍快。 */

function FixedStep({ v, set }) {
  const M = window.MATRIX;
  const ready = v.goal && v.product && v.media && v.conversion;
  const anchor = React.useRef(null);
  /* 引用：把账户里已有单元的营销内容整套带进来，之后仍可逐项改 */
  const reuse = () => {
    const u = M.EXISTING_UNIT;
    ['goal', 'productType', 'product', 'store', 'media', 'conversion', 'cpaBasis'].forEach((k) => set(k, u[k]));
    requestAnimationFrame(() => {
      let sc = anchor.current && anchor.current.parentElement;
      while (sc && !/(auto|scroll)/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
      if (!sc) return;
      sc.scrollTop = sc.scrollHeight;
      setTimeout(() => { sc.scrollTop = sc.scrollHeight; }, 120);
    });
  };

  return (
    <>
    <div ref={anchor} style={{ display: 'contents' }}></div>
    <Card
      title={<window.CardTitle info="腾讯建单里的营销内容部分。同一批次共用这一套，产品或转化目标不同请另建批次">营销内容</window.CardTitle>}
      actions={<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        {ready
          ? <StatusDot tone="success" label="已就绪" style={{ fontSize: 'var(--fs-12)' }} />
          : <StatusDot tone="warning" label="还有必填项" style={{ fontSize: 'var(--fs-12)' }} />}
        <Button variant="primary" size="sm" iconLeft="copy" onClick={reuse}>引用已有营销单元</Button>
      </div>}>

      <FormField label="营销目的" required>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(104px, 1fr))', gap: 'var(--space-4)' }}>
          {M.GOALS.map((g) => {
            const on = v.goal === g.name;
            return (
              <button key={g.id} type="button" onClick={() => set('goal', g.name)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: 'var(--space-6) var(--space-4)', cursor: 'pointer', font: 'inherit',
                  borderWidth: 1, borderStyle: 'solid', borderColor: on ? 'var(--border-focus)' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)', background: on ? 'var(--surface-selected)' : 'var(--surface-card)',
                  color: on ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'var(--transition-control)',
                }}>
                <Icon name={g.icon} size={18} style={{ color: on ? 'var(--text-primary)' : 'var(--text-tertiary)' }} />
                <span style={{ fontSize: 'var(--fs-12)', fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)', whiteSpace: 'nowrap' }}>{g.name}</span>
              </button>
            );
          })}
        </div>
      </FormField>

      <Divider spacing="var(--space-6)" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
        <FormField label="推广产品类型" required>
          <Select value={v.productType} onChange={(e) => set('productType', e.target.value)} width="100%" placeholder="请选择" options={M.PRODUCT_TYPES} />
        </FormField>
        <FormField label="推广产品" required hint="腾讯账号里已绑定的产品">
          <Select value={v.product} onChange={(e) => set('product', e.target.value)} width="100%" placeholder="请选择" options={M.PRODUCTS} />
        </FormField>
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <Checkbox checked={v.store} onChange={() => set('store', !v.store)}
          label="关联门店" description="投放时按门店位置就近展示，适合有线下履约的产品。" />
      </div>

      <Divider spacing="var(--space-6)" />

      <FormField label="营销载体" required hint="用户点击广告后落到哪里">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          {M.MEDIA.map((m) => {
            const on = v.media === m;
            return (
              <button key={m} type="button" onClick={() => set('media', m)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, height: 30, padding: '0 var(--space-5)',
                  cursor: 'pointer', font: 'inherit', fontSize: 'var(--fs-12)',
                  fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)',
                  borderWidth: 1, borderStyle: 'solid', borderColor: on ? 'var(--border-focus)' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)', background: on ? 'var(--surface-selected)' : 'var(--surface-card)',
                  color: on ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'var(--transition-control)',
                }}>
                {on ? <Icon name="check" size={12} /> : null}{m}
              </button>
            );
          })}
        </div>
      </FormField>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <FormField label="转化" required hint="腾讯侧的转化归因链路">
          <Select value={v.conversion} onChange={(e) => set('conversion', e.target.value)} width="100%" placeholder="请选择" options={M.CONVERSIONS} />
        </FormField>
      </div>

      <Divider spacing="var(--space-6)" />

      {/* 批次名称不属于腾讯的营销内容，是这一批矩阵自己要的 —— 用分隔线和小标划开，
          否则会被当成腾讯字段去后台找。日预算在下一步的「出价与预算」里。 */}
      <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' }}>本批次设置</div>
      <FormField label="批次名称" hint="会成为每条营销单元名的前缀">
        <Input value={v.batch} onChange={(e) => set('batch', e.target.value)} placeholder="秋新品 · 第一轮" />
      </FormField>
    </Card>

    <GoalsCard v={v} set={set} />
    </>
  );
}

/* 经营目标与保护线：AI 比较方案、决定留谁关谁用的标尺。不会作为参数提交腾讯 ——
   所以单独一张卡，和上面会进腾讯的字段划开。
   目标、保本、实际三个 CPA 必须用同一种转化口径，否则比出来的是两种东西。 */
function GoalsCard({ v, set }) {
  const M = window.MATRIX;
  const basisOptions = M.CONVERSIONS.map((c) => c.split('-')[0]);
  const spend = 1827.22, conv = 0;
  const actual = conv ? (spend / conv).toFixed(2) : null;
  return (
    <Card
      title={<window.CardTitle info="用于方案比较和后续优化，不会作为参数提交腾讯">经营目标与保护线</window.CardTitle>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
        <FormField label="目标 CPA" hint="希望稳定达到的成本">
          <Input value={v.cpa} onChange={(e) => set('cpa', e.target.value)} suffix="元" placeholder="100" />
        </FormField>
        <FormField label="保本 CPA" hint="超过这条线意味着业务亏损">
          <Input value={v.breakeven} onChange={(e) => set('breakeven', e.target.value)} suffix="元" placeholder="可稍后补充" />
        </FormField>
        <FormField label="账号日预算上限" hint="矩阵全部单元合计的保护线">
          <Input value={v.budgetMax} onChange={(e) => set('budgetMax', e.target.value)} suffix="元" placeholder="不设硬上限" />
        </FormField>
        <FormField label="账号日预算下限" hint="避免预算过低无法完成探索">
          <Input value={v.budgetMin} onChange={(e) => set('budgetMin', e.target.value)} suffix="元" placeholder="可留空" />
        </FormField>
      </div>

      <Divider spacing="var(--space-6)" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
        <FormField label="CPA 转化口径" hint="目标、保本和实际必须用同一种口径">
          <Select value={v.cpaBasis} onChange={(e) => set('cpaBasis', e.target.value)} width="100%" options={basisOptions} />
        </FormField>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginBottom: 6 }}>
            账户当前 CPA<window.InfoHint label="2026-08-20 至 2026-09-02 账户汇总；仅在与左侧口径一致时可直接比较" size={12} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', color: actual ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
              {actual ? '¥' + actual : '暂无可计算'}
            </span>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>消耗 ¥{spend.toLocaleString(undefined, { minimumFractionDigits: 2 })} · {conv} 次{v.cpaBasis || '转化'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

Object.assign(window, { ProfileStep, FixedStep });
})();
