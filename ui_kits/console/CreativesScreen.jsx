(() => {
const { Icon, IconButton, Button, Badge, Card, Checkbox, Switch, StatusDot, Input, FilterSelect, Tabs, EmptyState, Pagination, Popover, StatDelta } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, TableFrame, FilterBar, DateRangeField, rowHoverProps, AskButton, TableScrollContext, TableFreezeStyles } = window;

/* 腾讯营销 · 创意：创意列表（按疲劳度分组）/ 素材拆解 / 组合测试。
   指标按腾讯那套：曝光、点击率、转化、转化成本、消耗。 */

const COVER_N = 6;
const coverOf = (seed) => {
  let h = 0;
  for (let i = 0; i < String(seed).length; i++) h = (h * 31 + String(seed).charCodeAt(i)) % 9973;
  return (window.__res ? window.__res('../../assets/placeholders/product-' + ((h % COVER_N) + 1) + '.png') : '../../assets/placeholders/product-' + ((h % COVER_N) + 1) + '.png');
};

/* 疲劳度是推导值，不是人工打的标签：CTR 相对首周跌幅 + 已投天数一起决定。
   所以列表里同时给出跌幅，让人看得出这个判断是怎么来的。 */
const FATIGUE = {
  起量中: { tone: 'success', hint: 'CTR 仍在涨或持平' },
  衰退中: { tone: 'warning', hint: 'CTR 较首周跌 10–30%' },
  已疲劳: { tone: 'danger', hint: 'CTR 较首周跌超 30%' },
};
const REVIEW = { 可投: 'success', 审核中: 'info', 未通过: 'danger' };
const REVIEW_LABEL = { 可投: '审核通过', 审核中: '审核中', 未通过: '审核不通过' };

const COPY = ['一口脆到底，追剧就配它', '0 泡发，只用鲜笋', '办公室零嘴天选', '晚八点的解馋刚需', '一次囤够一整月'];
const FORM = ['15s 竖版', '30s 剧情', '9s 快剪', '口播', '开箱', '达人合拍', '货架图文'];
const PLACEMENT = ['朋友圈', '公众号', '小程序', '视频号'];
/* 每个维度自带一份权重：文案、形式、版位对点击率各有独立贡献。
   若点击率只由投放天数推导，三个维度就成了同一份数据的三种切法，
   拆解页会给出三张一模一样的表 —— 那正是这个页面要否证的东西。 */
const LIFT_COPY = [0.42, 0.18, -0.12, 0.55, -0.34];
const LIFT_FORM = [0.30, -0.20, 0.12, -0.42, 0.24, 0.48, -0.52];
const LIFT_PLACEMENT = [0.22, -0.30, 0.14, 0.36];

/* 创意挂在营销单元（广告计划）下面 —— 一个单元下多条创意，所以列表里要能看到归属。 */
const PLANS = ['8.29.2 虎皮凤爪-朋友圈-公众号小图', '8.28.1 脆笋-AIM 测试 TY', '8.27.1 脆笋-AIM 测试 TY-A', '8.23.1 红油凤爪-视频号直播引流', '8.22.1 虎皮凤爪-小程序放量测试 TY', '8.21.1 虎皮凤爪-公众号测试 TY', '8.20.1 会员召回-小程序拉活 TY', '8.19.1 藤椒味-朋友圈新品试销'];
const LANDING = ['https://h5.wxlmall.com/act/hupi-0829?chn=wx_moments', 'https://h5.wxlmall.com/act/cuisun-aim?chn=wx_official', 'https://h5.wxlmall.com/live/channels-0823', 'https://h5.wxlmall.com/act/member-recall?chn=mp', 'https://h5.wxlmall.com/act/tengjiao-new?chn=wx_moments'];

const CREATIVES = Array.from({ length: 42 }, (_, i) => {
  const days = 2 + ((i * 7) % 40);
  const drop = days > 24 ? 34 + (i % 18) : days > 12 ? 12 + (i % 16) : -(4 + (i % 12));
  const fatigue = drop > 30 ? '已疲劳' : drop > 10 ? '衰退中' : '起量中';
  const review = i % 13 === 0 ? '未通过' : i % 9 === 0 ? '审核中' : '可投';
  const ci = i % COPY.length;
  const fi = (i * 3) % FORM.length;
  const pi = (i * 5) % PLACEMENT.length;
  const ctr = (2.9 - drop / 28 + LIFT_COPY[ci] + LIFT_FORM[fi] + LIFT_PLACEMENT[pi]).toFixed(2);
  /* 点击次数、点击均价、转化成本都由 消耗 / 曝光 / 点击率 / 转化 推出，
     不另生成一份 —— 同一行里派生指标与其输入必须算得通。 */
  const spendNum = 860 + ((i * 613) % 12400);
  const impNum = 12000 + ((i * 3571) % 480000);
  const clicks = Math.round(impNum * parseFloat(ctr) / 100);
  const conv = 18 + ((i * 29) % 320);
  return {
    plan: PLANS[i % PLANS.length],
    landing: LANDING[i % LANDING.length],
    on: i % 13 !== 0 && i % 7 !== 3,
    clicks: clicks.toLocaleString(),
    cpc: clicks ? (spendNum / clicks).toFixed(2) : '—',
    id: 'cr' + (i + 1),
    name: COPY[ci] + ' · ' + FORM[fi] + ' ' + String.fromCharCode(65 + (i % 26)),
    copy: COPY[ci],
    form: FORM[fi],
    placement: PLACEMENT[pi],
    days, drop, fatigue, review,
    spend: '¥' + spendNum.toLocaleString(),
    imp: impNum.toLocaleString(),
    ctr: clicks ? ctr + '%' : '—',
    conv,
    cpa: conv ? '¥' + (spendNum / conv).toFixed(2) : '—',
    reject: i % 13 === 0 ? '落地页与创意主体不一致' : null,
  };
});

const FATIGUE_ORDER = ['已疲劳', '衰退中', '起量中'];

function CreativesScreen() {
  const [tab, setTab] = React.useState('list');
  const [q, setQ] = React.useState('');
  const [range, setRange] = React.useState('近 7 天');
  const [live, setLive] = React.useState('全部投放状态');
  const [on, setOn] = React.useState(() => CREATIVES.reduce((m, c) => Object.assign(m, { [c.id]: c.on }), {}));
  const [review, setReview] = React.useState('全部审核状态');
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(20);

  const rows = CREATIVES.filter((c) => (!q || c.name.includes(q) || c.id.includes(q) || c.plan.includes(q))
    && (live === '全部投放状态' || (on[c.id] ? '投放中' : '已暂停') === live)
    && (review === '全部审核状态' || REVIEW_LABEL[c.review] === review));
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const at = Math.min(page, pageCount);
  const shown = rows.slice((at - 1) * size, at * size);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      <Tabs value={tab} onChange={setTab}
        items={[
          { id: 'list', label: '创意', count: CREATIVES.length },
          { id: 'parts', label: '素材拆解' },
          { id: 'combo', label: '组合测试' },
        ]} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', minWidth: 0 }}>
        <span style={{ flex: 1 }} />
        <IconButton icon="sliders-horizontal" label="列设置" variant="secondary" size="sm" />
        <DateRangeField start="2026-06-05" end="2026-06-11" preset={range} onPreset={setRange}
          presets={['今天', '昨天', '近 7 天', '近 30 天', '自定义区间…']} />
      </div>

      {tab === 'list' ? (
        <>
          <Card padded={false}>
            <FilterBar inset trailing={<Button variant="secondary" size="sm" iconLeft="sparkles">生成新创意</Button>}>
              <Input placeholder="搜索创意名称/ID" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 180px', minWidth: 0, maxWidth: 240 }} />
              <FilterSelect value={live} onChange={setLive} width={148}
                options={['全部投放状态', '投放中', '已暂停'].map((o) => ({ label: o, count: o.startsWith('全部') ? CREATIVES.length : CREATIVES.filter((x) => (on[x.id] ? '投放中' : '已暂停') === o).length }))} />
              <FilterSelect value={review} onChange={setReview} width={148}
                options={['全部审核状态', '审核通过', '审核中', '审核不通过'].map((o) => ({ label: o, count: o.startsWith('全部') ? CREATIVES.length : CREATIVES.filter((x) => REVIEW_LABEL[x.review] === o).length }))} />
            </FilterBar>
          </Card>

          {rows.length ? (
            <>
              <CreativeTable rows={shown} on={on} onToggle={(id) => setOn((m) => Object.assign({}, m, { [id]: !m[id] }))} />
              <StickyFooter>
                <Pagination page={at} pageCount={pageCount} total={rows.length} onChange={setPage}
                  pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
              </StickyFooter>
            </>
          ) : <Card><EmptyState compact icon="search-x" title="没有匹配的创意" description="换个关键词，或把筛选条件放宽。" /></Card>}
        </>
      ) : null}

      {tab === 'parts' ? <PartsBreakdown /> : null}
      {tab === 'combo' ? <ComboMatrix /> : null}
    </div>
  );
}

/* 腾讯这套的创意列表：一行一条创意，能看到它挂在哪个营销单元下、落哪个页，
   以及投放与审核两个状态 —— 审核不通过的创意开关仍是开的，但不会有量，
   两个状态必须分开显示，合成一个「状态」会把「已暂停」和「审核不通过」混为一谈。 */
function CreativeTable({ rows, on, onToggle }) {
  const [sel, setSel] = React.useState([]);
  const [sort, setSort] = React.useState('spend');
  const allOn = rows.length > 0 && rows.every((r) => sel.includes(r.id));
  const th = {
    padding: '10px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap', verticalAlign: 'middle',
    fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = { padding: 'var(--space-5) var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' };
  /* 横向滚动时锁住「勾选 + 开关 + 创意名称」与「操作」：只有中间的数据列滑动。
     阴影只在该侧确有被遮住的列时出现。 */
  const COLS = [
    { key: 'spend', header: '花费' },
    { key: 'imp', header: '曝光次数' },
    { key: 'clicks', header: '点击次数' },
    { key: 'ctr', header: '点击率' },
    { key: 'cpc', header: '点击均价' },
    { key: 'conv', header: '转化量' },
    { key: 'cpa', header: '转化成本' },
  ];
  return (
    <TableFrame>{(fz) => (
      <table style={{ width: '100%', minWidth: 1320, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
        <thead>
          <tr>
            <th style={Object.assign({}, th, fz.head(0), { width: 40 })}>
              <Checkbox checked={allOn} onChange={() => setSel(allOn ? [] : rows.map((r) => r.id))} aria-label="全选" />
            </th>
            <th style={Object.assign({}, th, fz.head(40), { width: 56 })} />
            <th style={Object.assign({}, th, fz.head(96), fz.headEdge, { minWidth: 220 })}>创意名称</th>
            <th style={Object.assign({}, th, { width: 92 })}>创意（预览图）</th>
            <th style={Object.assign({}, th, { minWidth: 180 })}>关联广告计划</th>
            <th style={Object.assign({}, th, { width: 124 })}>状态</th>
            <th style={Object.assign({}, th, { minWidth: 180 })}>落地页</th>
            {COLS.map((c) => (
              <th key={c.key} style={Object.assign({}, th, { textAlign: 'right', cursor: 'pointer' })} onClick={() => setSort(c.key)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  {c.header}
                  <Icon name={sort === c.key ? 'arrow-down' : 'chevrons-up-down'} size={11}
                    style={{ color: sort === c.key ? 'var(--text-primary)' : 'var(--neutral-400)' }} />
                </span>
              </th>
            ))}
            <th style={Object.assign({}, th, fz.headEnd, { width: 72 })}>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => {
            const live = on[c.id];
            const picked = sel.includes(c.id);
            return (
              <tr key={c.id} {...rowHoverProps(live ? 'var(--surface-card)' : 'var(--neutral-25)')}
                style={{ background: live ? 'var(--surface-card)' : 'var(--neutral-25)' }}>
                <td style={Object.assign({}, td, fz.cell(0))}>
                  <Checkbox checked={picked} aria-label={'选择 ' + c.name}
                    onChange={() => setSel((v) => picked ? v.filter((x) => x !== c.id) : v.concat(c.id))} />
                </td>
                <td style={Object.assign({}, td, fz.cell(40))}><Switch checked={live} onChange={() => onToggle(c.id)} aria-label={live ? '暂停该创意' : '启用该创意'} /></td>
                <td style={Object.assign({}, td, fz.cell(96), fz.cellEdge)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0, maxWidth: 260 }}>
                    <span style={{ fontWeight: 'var(--fw-medium)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                    <AskButton kind="creative" label={c.name} hint={c.placement} />
                  </div>
                  <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2 }}>{c.id}</div>
                </td>
                <td style={td}>
                  <img src={coverOf(c.id)} alt="" style={{
                    width: 40, height: 40, objectFit: 'cover', display: 'block',
                    borderRadius: 'var(--radius-sm)', background: 'var(--neutral-100)',
                    borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
                  }} />
                </td>
                <td style={Object.assign({}, td, { color: 'var(--text-secondary)' })}>
                  <span style={{ display: 'block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.plan}</span>
                </td>
                <td style={td}>
                  <StatusDot tone={live ? 'success' : 'neutral'} label={live ? '投放中' : '已暂停'}
                    style={{ fontSize: 'var(--fs-13)', color: live ? 'var(--text-primary)' : 'var(--text-secondary)' }} />
                  <div style={{ marginTop: 3 }}>
                    {c.reject
                      ? <Popover placement="right" width={220} content={<span>{c.reject}</span>}>
                          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--status-danger-fg)', cursor: 'help', borderBottomWidth: 1, borderBottomStyle: 'dashed', borderBottomColor: 'currentColor' }}>审核不通过</span>
                        </Popover>
                      : <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{c.review === '审核中' ? '审核中' : '审核通过'}</span>}
                  </div>
                </td>
                <td style={td}><LandingLink url={c.landing} /></td>
                {COLS.map((k) => (
                  <td key={k.key} style={Object.assign({}, td, {
                    textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                    fontWeight: k.key === sort ? 'var(--fw-semibold)' : 'var(--fw-regular)',
                  })}>{c[k.key]}</td>
                ))}
                <td style={Object.assign({}, td, fz.cellEnd)}><Button variant="link" size="sm">编辑</Button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}</TableFrame>
  );
}

/* 落地页：只截前一段，完整地址放在悬浮里 —— 整条 URL 会把这一列撑到别的列没地方 */
function LandingLink({ url }) {
  const short = url.replace(/^https?:\/\//, '').split('?')[0];
  return (
    <Popover placement="top" width={260} content={<span style={{ wordBreak: 'break-all' }}>{url}</span>}>
      <a href={url} onClick={(e) => e.preventDefault()} style={{
        display: 'block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontSize: 'var(--fs-12)',
        color: 'var(--text-link, var(--text-primary))', textDecoration: 'underline', textUnderlineOffset: 2,
      }}>{short}</a>
    </Popover>
  );
}

function CreativeCell({ c }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', minWidth: 0 }}>
      <img src={coverOf(c.id)} alt="" style={{
        width: 44, height: 44, flex: 'none', objectFit: 'cover', display: 'block',
        borderRadius: 'var(--radius-sm)', background: 'var(--neutral-100)',
        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
      }} />
      <div style={{ minWidth: 0, maxWidth: 260 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
          <span style={{ fontWeight: 'var(--fw-medium)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
          <AskButton kind="creative" label={c.name} hint={c.placement} />
        </div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 3 }}>
          {c.placement} · 已投 {c.days} 天 · <span style={{ fontFamily: 'var(--font-mono)' }}>{c.id}</span>
        </div>
      </div>
    </div>
  );
}

/* 素材拆解：把创意按视频 / 文案 / 封面三层各自汇总。
   一条创意跑得差，可能是文案不行也可能是封面不行 —— 只看整条创意永远分不出来。 */
function PartsBreakdown() {
  const agg = (key) => {
    const map = {};
    CREATIVES.forEach((c) => {
      const k = c[key];
      const m = map[k] || (map[k] = { name: k, n: 0, ctr: 0, conv: 0 });
      m.n += 1; m.ctr += parseFloat(c.ctr); m.conv += c.conv;
    });
    return Object.values(map).map((m) => ({ name: m.name, n: m.n, ctr: (m.ctr / m.n).toFixed(2) + '%', conv: m.conv }))
      .sort((a, b) => parseFloat(b.ctr) - parseFloat(a.ctr));
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', minWidth: 0 }}>
      <PartCard title="文案" hint="同一文案在所有创意里的平均表现" rows={agg('copy')} />
      <PartCard title="形式" hint="视频形式，与文案、封面独立结算" rows={agg('form')} />
      <PartCard title="版位" hint="同一素材在不同版位的表现差异" rows={agg('placement')} />
    </div>
  );
}

function PartCard({ title, hint, rows }) {
  const best = rows[0];
  return (
    <Card title={title} subtitle={hint} padded={false}>
      <div style={{ padding: 'var(--space-5) var(--gutter-card) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {rows.map((r) => {
          const top = r.name === best.name;
          return (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', fontSize: 'var(--fs-13)' }}>
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: top ? 'var(--fw-medium)' : 'var(--fw-regular)' }}>{r.name}</span>
              <span style={{ flex: 'none', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{r.n} 条</span>
              <span style={{ flex: 'none', width: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: top ? 'var(--fw-medium)' : 'var(--fw-regular)', color: top ? 'var(--viz-positive)' : 'var(--text-primary)' }}>{r.ctr}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* 组合测试：同一文案 × 不同封面。行列都固定，值是点击率 —— 最优格子加深底色。
   不做条形图：这是二维对比，条形图只能表达一维。 */
function ComboMatrix() {
  const copies = COPY;
  const covers = ['封面 A', '封面 B', '封面 C', '封面 D'];
  const cell = (ri, ci) => (1.9 + ((ri * 7 + ci * 13) % 24) / 10).toFixed(2);
  const values = copies.map((_, ri) => covers.map((_, ci) => parseFloat(cell(ri, ci))));
  const flat = values.flat();
  const max = Math.max.apply(null, flat);
  const min = Math.min.apply(null, flat);

  const th = { padding: '10px var(--space-6)', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textAlign: 'center' };

  return (
    <Card title="同一文案 × 不同封面" subtitle="值为点击率 · 底色深浅表示相对高低，最优组合加边" padded={false}>
      <TableFrame>
        <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={Object.assign({}, th, { textAlign: 'left', minWidth: 220, background: 'var(--neutral-25)' })}>文案</th>
              {covers.map((c) => <th key={c} style={Object.assign({}, th, { background: 'var(--neutral-25)', width: 100 })}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {copies.map((copy, ri) => (
              <tr key={copy}>
                <td style={{ padding: 'var(--space-5) var(--space-6)', fontSize: 'var(--fs-13)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{copy}</td>
                {covers.map((cv, ci) => {
                  const v = values[ri][ci];
                  const t = (v - min) / (max - min || 1);
                  const top = v === max;
                  return (
                    <td key={cv} style={{
                      padding: 'var(--space-5)', textAlign: 'center', fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums',
                      borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
                      background: 'color-mix(in oklab, var(--viz-positive) ' + Math.round(t * 22) + '%, var(--surface-card))',
                      boxShadow: top ? 'inset 0 0 0 2px var(--viz-positive)' : 'none',
                      fontWeight: top ? 'var(--fw-medium)' : 'var(--fw-regular)',
                    }}>{v.toFixed(2)}%</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </TableFrame>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
        <Icon name="info" size={13} style={{ color: 'var(--text-tertiary)' }} />
        <span>最优组合「{copies[values.findIndex((r) => r.includes(max))]} × {covers[values[values.findIndex((r) => r.includes(max))].indexOf(max)]}」点击率 {max.toFixed(2)}%，比最差组合高 {(max - min).toFixed(2)} 个百分点。</span>
        <span style={{ flex: 1 }} />
        <Button variant="secondary" size="sm" iconLeft="copy">按最优组合建计划</Button>
      </div>
    </Card>
  );
}

Object.assign(window, { CreativesScreen });
})();
