(() => {
const { Icon, IconButton, Button, Badge, Card, Divider, StatusDot, Input, Select, FilterSelect, Checkbox, Tabs, EmptyState, Pagination, DropdownMenu, Popover } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, TableFrame, FilterBar, DateRangeField, AskButton } = window;

/* 商品库：筛选条 + 商品列表（保本ROI 可编辑、类目、销量、库存、上架时间、佣金率） */

/* 商品缩略图占位：assets/placeholders/product-*.png，替换同名文件即可换成真实商品图 */
const PRODUCT_N = 6;
const imageOf = (seed) => {
  let h = 0;
  for (let i = 0; i < String(seed).length; i++) h = (h * 31 + String(seed).charCodeAt(i)) % 9973;
  return (window.__res ? window.__res('../../assets/placeholders/product-' + ((h % PRODUCT_N) + 1) + '.png') : '../../assets/placeholders/product-' + ((h % PRODUCT_N) + 1) + '.png');
};

const PRODUCTS = Array.from({ length: 9 }, (_, i) => ({
  id: 'p' + i,
  image: 'p' + i,
  sku: '3825727183331131665',
  name: '【0泡发】王小卤脆笋去骨脱骨238g*2袋装休闲零食',
  price: '59.9 元',
  baseRoi: '1.5',
  category: ['鸡肉零食', '素食零食', '组合装'][i % 3],
  status: ['在售', '在售', '在售', '已下架', '缺货'][i % 5],
  sales: '2700000',
  stock: '39990000',
  listed: '2026-07-06 23:00:38',
  rate: '0%',
}));

function ProductsScreen() {
  const [q, setQ] = React.useState('');
  const [range, setRange] = React.useState('今天');
  const [type, setType] = React.useState('全部类型');
  const [status, setStatus] = React.useState('全部状态');
  const [unrun, setUnrun] = React.useState(true);
  const [preferred, setPreferred] = React.useState(false);
  const [roi, setRoi] = React.useState('2.0');
  const [picked, setPicked] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(20);

  const rows = PRODUCTS.filter((p) => !q || p.name.includes(q) || p.sku.includes(q));
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const at = Math.min(page, pageCount);
  const allOn = rows.length > 0 && picked.length === rows.length;
  const toggle = (id) => setPicked((v) => v.includes(id) ? v.filter((x) => x !== id) : v.concat(id));
  const toggleAll = () => setPicked(allOn ? [] : rows.map((r) => r.id));

  const th = {
    padding: '12px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap',
    fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = { padding: 'var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      {/* 标题行 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', minWidth: 0 }}>
        <span style={{ flex: 1 }} />
        <IconButton icon="maximize-2" label="全屏" variant="secondary" size="sm" />
        <IconButton icon="sliders-horizontal" label="列设置" variant="secondary" size="sm" />
        <DateRangeField start="2025-10-28" end="2025-10-28" preset={range} onPreset={setRange}
          presets={['今天', '昨天', '近 7 天', '近 30 天', '自定义区间…']} />
      </div>

      <Card padded={false}>
        {/* 筛选条 */}
        <FilterBar inset trailing={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-5)', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-semibold)' }}>默认保本ROI：</span>
            <Input value={roi} onChange={(e) => setRoi(e.target.value)} style={{ width: 96 }} />
          </span>
        }>
          <Input placeholder="搜索商品名称/ID" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 180px', minWidth: 0, maxWidth: 240 }} />
          <FilterSelect value={type} onChange={setType} width={140}
            options={['全部类型', '鸡肉零食', '素食零食', '组合装'].map((o) => ({ label: o, count: o === '全部类型' ? PRODUCTS.length : PRODUCTS.filter((x) => x.category === o).length }))} />
          <FilterSelect value={status} onChange={setStatus} width={132}
            options={['全部状态', '在售', '已下架', '缺货'].map((o) => ({ label: o, count: o === '全部状态' ? PRODUCTS.length : PRODUCTS.filter((x) => x.status === o).length }))} />
          <Checkbox checked={unrun} onChange={() => setUnrun(!unrun)} label="只看未投放商品" />
          <Checkbox checked={preferred} onChange={() => setPreferred(!preferred)} label="只看跑量优选商品" />
        </FilterBar>

      </Card>

      <TableFrame>
          <table style={{ width: '100%', minWidth: 1000, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
            <thead>
              <tr>
                <th style={Object.assign({}, th, { width: 44 })}>
                  <Checkbox checked={allOn} indeterminate={!allOn && picked.length > 0} onChange={toggleAll} />
                </th>
                <th style={Object.assign({}, th, { minWidth: 320 })}>商品信息</th>
                <th style={Object.assign({}, th, { width: 130 })}>商品保本ROI</th>
                <th style={Object.assign({}, th, { width: 110 })}>类目</th>
                <th style={Object.assign({}, th, { width: 110 })}>销量</th>
                <th style={Object.assign({}, th, { width: 120 })}>库存</th>
                <th style={Object.assign({}, th, { width: 130 })}>首次上架时间</th>
                <th style={Object.assign({}, th, { width: 110 })}>商品佣金率</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} {...rowHoverProps('transparent', picked.includes(p.id))} style={{ background: picked.includes(p.id) ? 'var(--surface-selected)' : 'transparent' }}>
                  <td style={td}><Checkbox checked={picked.includes(p.id)} onChange={() => toggle(p.id)} /></td>
                  <td style={td}><ProductCell p={p} /></td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{p.baseRoi}</span>
                      <IconButton icon="pencil" label="修改保本ROI" size="sm" />
                    </span>
                  </td>
                  <td style={td}>{p.category}</td>
                  <td style={Object.assign({}, td, { fontVariantNumeric: 'tabular-nums' })}>{p.sales}</td>
                  <td style={Object.assign({}, td, { fontVariantNumeric: 'tabular-nums' })}>{p.stock}</td>
                  <td style={Object.assign({}, td, { whiteSpace: 'normal', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-snug)' })}>
                    {p.listed.split(' ')[0]}<br />{p.listed.split(' ')[1]}
                  </td>
                  <td style={Object.assign({}, td, { fontVariantNumeric: 'tabular-nums' })}>{p.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </TableFrame>

      {rows.length === 0 ? <Card><EmptyState compact icon="search-x" title="没有匹配的商品" description="换个关键词，或把筛选条件放宽。" /></Card> : null}
      <StickyFooter>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          {picked.length ? <>
            <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>已选 {picked.length} 个商品</span>
            <Button variant="secondary" size="sm" iconLeft="sparkles">批量建计划</Button>
          </> : null}
          <span style={{ flex: 1, minWidth: 0 }}>
            <Pagination page={at} pageCount={pageCount} total={rows.length} onChange={setPage}
              pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
          </span>
        </div>
      </StickyFooter>
    </div>
  );
}

/* 商品单元格：缩略图位留白，等真实图片；名称截断，下面是 ID 与价格 */
function ProductCell({ p }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', minWidth: 0 }}>
      <img src={imageOf(p.id)} alt="" style={{
        width: 48, height: 48, flex: 'none', objectFit: 'cover', display: 'block',
        borderRadius: 'var(--radius-sm)', background: 'var(--neutral-100)',
        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
      }} />
      <div style={{ minWidth: 0, maxWidth: 300 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
          <span style={{ fontWeight: 'var(--fw-medium)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
          <AskButton kind="product" label={p.name} hint={'SKU ' + p.sku} />
        </div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 4 }}>
          ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{p.sku}</span>
        </div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          价格 <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{p.price}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProductsScreen });
})();
