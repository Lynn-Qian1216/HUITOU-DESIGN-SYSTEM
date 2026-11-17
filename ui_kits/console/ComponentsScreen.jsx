(() => {
const { Icon, IconButton, Button, Badge, Card, StatusDot, Input, FilterSelect, Tabs, EmptyState, Pagination, Popover } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, TableFrame, FilterBar, rowHoverProps } = window;

/* 腾讯营销 · 组件：创意组件 / 落地页组件 / 落地载体，分标签页。
   三者是三种东西：创意组件装进创意里，落地页组件装进落地页里，载体是落地页本身跑在哪。
   放同一张表会让「引用数」这一列失去意义 —— 被谁引用完全不同。 */

const GROUPS = [
  {
    id: 'creative', label: '创意组件', unit: '被创意引用',
    hint: '装进创意里的可组装元素：标题、行动号召、贴纸、结尾卡。',
    kinds: ['标题', '行动号召', '贴纸', '结尾卡', '角标'],
    items: [
      ['一口脆到底，追剧就配它', '标题', 24, '3.41%'],
      ['0 泡发，只用鲜笋', '标题', 18, '3.62%'],
      ['办公室零嘴天选', '标题', 11, '2.88%'],
      ['立即购买', '行动号召', 42, '3.30%'],
      ['领券再省 15 元', '行动号召', 36, '3.94%'],
      ['去看看', '行动号召', 9, '2.41%'],
      ['限时 5 折角标', '角标', 22, '3.55%'],
      ['藤椒味贴纸', '贴纸', 7, '3.02%'],
      ['结尾卡 · 复购提醒', '结尾卡', 14, '3.18%'],
      ['结尾卡 · 会员入口', '结尾卡', 6, '2.74%'],
    ],
  },
  {
    id: 'landing', label: '落地页组件', unit: '被落地页引用',
    hint: '装进落地页里的可复用块：表单、转化按钮、商品卡、图文段。',
    kinds: ['表单', '转化按钮', '商品卡', '图文段', '客服入口'],
    items: [
      ['两字段留资表单（手机号 + 城市）', '表单', 12, '18.4%'],
      ['单字段留资表单（手机号）', '表单', 9, '26.1%'],
      ['五字段留资表单', '表单', 3, '7.2%'],
      ['底部吸底购买按钮', '转化按钮', 21, '22.7%'],
      ['浮动加购按钮', '转化按钮', 14, '19.3%'],
      ['商品卡 · 三图规格', '商品卡', 17, '15.8%'],
      ['商品卡 · 单图大图', '商品卡', 8, '13.1%'],
      ['图文段 · 工艺说明', '图文段', 11, '—'],
      ['企微客服入口', '客服入口', 6, '9.4%'],
    ],
  },
  {
    id: 'carrier', label: '落地载体', unit: '在投计划',
    hint: '落地页跑在什么上面：原生推广页、小程序、企微、门店页。',
    kinds: ['原生推广页', '小程序', '企微', '门店页'],
    items: [
      ['藤椒味主推页', '原生推广页', 8, '21.6%'],
      ['原味主推页', '原生推广页', 5, '19.2%'],
      ['组合装囤货页', '原生推广页', 3, '16.4%'],
      ['王小卤官方小程序 · 商详', '小程序', 6, '24.8%'],
      ['小程序 · 领券页', '小程序', 4, '31.2%'],
      ['企微加粉页', '企微', 2, '12.7%'],
      ['门店周边到店页', '门店页', 1, '8.9%'],
    ],
  },
];

/* 审核与状态：组件也要过审，未过审的组件会让引用它的整条创意投不出去。 */
const REVIEW = ['可用', '审核中', '未通过'];
const REJECT = '组件文案含绝对化用语';

const build = (g) => g.items.map((it, i) => ({
  id: g.id + '-' + (i + 1),
  name: it[0], kind: it[1], refs: it[2], rate: it[3],
  review: i % 9 === 4 ? '未通过' : i % 7 === 3 ? '审核中' : '可用',
  updated: '2026-06-' + String(11 - (i % 9)).padStart(2, '0'),
}));
const DATA = GROUPS.reduce((acc, g) => Object.assign(acc, { [g.id]: build(g) }), {});

function ComponentsScreen() {
  const [tab, setTab] = React.useState('creative');
  const [q, setQ] = React.useState('');
  const [kind, setKind] = React.useState('全部类型');
  const [review, setReview] = React.useState('全部审核状态');
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(20);

  const group = GROUPS.find((g) => g.id === tab);
  const all = DATA[tab];
  const rows = all.filter((r) => (!q || r.name.includes(q))
    && (kind === '全部类型' || r.kind === kind)
    && (review === '全部审核状态' || r.review === review));
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const at = Math.min(page, pageCount);

  const switchTab = (v) => { setTab(v); setKind('全部类型'); setReview('全部审核状态'); setPage(1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      <Tabs value={tab} onChange={switchTab}
        items={GROUPS.map((g) => ({ id: g.id, label: g.label, count: DATA[g.id].length }))} />

      <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>{group.hint}</div>

      <Card padded={false}>
        <FilterBar inset trailing={<Button variant="secondary" size="sm" iconLeft="plus">新建{group.label}</Button>}>
          <Input placeholder={'搜索' + group.label + '名称'} iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 180px', minWidth: 0, maxWidth: 240 }} />
          <FilterSelect value={kind} onChange={setKind} width={148}
            options={['全部类型'].concat(group.kinds).map((o) => ({ label: o, count: o.startsWith('全部') ? all.length : all.filter((x) => x.kind === o).length }))} />
          <FilterSelect value={review} onChange={setReview} width={148}
            options={['全部审核状态'].concat(REVIEW).map((o) => ({ label: o, count: o.startsWith('全部') ? all.length : all.filter((x) => x.review === o).length }))} />
        </FilterBar>
      </Card>

      {rows.length ? (
        <>
          <ComponentTable rows={rows.slice((at - 1) * size, at * size)} group={group} />
          <StickyFooter>
            <Pagination page={at} pageCount={pageCount} total={rows.length} onChange={setPage}
              pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
          </StickyFooter>
        </>
      ) : <Card><EmptyState compact icon="search-x" title={'没有匹配的' + group.label} description="换个关键词，或把筛选条件放宽。" /></Card>}
    </div>
  );
}

function ComponentTable({ rows, group }) {
  const th = {
    padding: '12px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap',
    fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = { padding: 'var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' };
  const num = Object.assign({}, td, { fontVariantNumeric: 'tabular-nums' });
  /* 转化率一列的含义随标签页变（创意组件看点击率、落地页组件看转化率），列名跟着换，
     不用一个「效果」糊过去。 */
  const rateLabel = group.id === 'creative' ? '平均点击率' : '平均转化率';

  return (
    <TableFrame>
      <table style={{ width: '100%', minWidth: 940, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
        <thead>
          <tr>
            <th style={Object.assign({}, th, { minWidth: 320 })}>{group.label}</th>
            <th style={Object.assign({}, th, { width: 130 })}>类型</th>
            <th style={Object.assign({}, th, { width: 120 })}>审核</th>
            <th style={Object.assign({}, th, { width: 130 })}>{group.unit}</th>
            <th style={Object.assign({}, th, { width: 130 })}>{rateLabel}</th>
            <th style={Object.assign({}, th, { width: 120 })}>更新时间</th>
            <th style={Object.assign({}, th, { width: 96 })}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} {...rowHoverProps()}>
              <td style={td}>
                <div style={{ minWidth: 0, maxWidth: 340, fontWeight: 'var(--fw-medium)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>{r.id}</div>
              </td>
              <td style={Object.assign({}, td, { color: 'var(--text-secondary)' })}>{r.kind}</td>
              <td style={td}>
                {r.review === '未通过'
                  ? <Popover placement="right" width={224} content={<span>{REJECT}。引用它的创意会一并投不出去。</span>}>
                      <span style={{ cursor: 'help' }}><Badge tone="danger" dot>未通过</Badge></span>
                    </Popover>
                  : <Badge tone={r.review === '可用' ? 'success' : 'info'} dot>{r.review}</Badge>}
              </td>
              <td style={num}>
                {/* 引用数为 0 的组件是死库存，压成灰的，让人一眼看出该清理 */}
                <span style={{ color: r.refs ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{r.refs ? r.refs + ' 处' : '未被引用'}</span>
              </td>
              <td style={num}>{r.rate}</td>
              <td style={Object.assign({}, td, { fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' })}>{r.updated}</td>
              <td style={Object.assign({}, td, { textAlign: 'right' })}>
                <Button variant="ghost" size="sm">编辑</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableFrame>
  );
}

Object.assign(window, { ComponentsScreen });
})();
