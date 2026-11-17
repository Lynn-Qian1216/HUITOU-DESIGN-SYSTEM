(() => {
const { Icon, Button, Badge, Card, StatusDot, MetricCard, FilterSelect, SegmentedControl } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, TableFrame, FilterBar, rowHoverProps } = window;

/* 数据看板：按广告主看结算与实时两张表。
   这一页的读者不是投手而是账务与广告主对接人 —— 他要回答的是「这个月该收多少钱、对方认不认」，
   所以广告主是第一层维度（不是平台、不是账户），两张表分别对应「结算完的」和「正在发生的」。 */

const ADVERTISERS = [
  { id: 'bz', name: '保众', trade: '保险经纪', unit: '有效线索', price: 68, accounts: 5 },
  { id: 'dws', name: '东吴证券', trade: '证券开户', unit: '有效开户', price: 320, accounts: 4 },
];

const PERIODS = ['2026-08', '2026-07', '2026-06'];

/* 结算明细：ours 是我方统计口径，theirs 是广告主回传确认的量，两者之差就是对账要谈的东西 */
const SETTLE = {
  bz: {
    '2026-08': [
      { ch: '腾讯 · 朋友圈', spend: 128400, ours: 2140, theirs: 2096, state: 'ok' },
      { ch: '腾讯 · 视频号', spend: 61200, ours: 1015, theirs: 1015, state: 'ok' },
      { ch: '千川 · 全域推广', spend: 84600, ours: 1372, theirs: 1180, state: 'dispute' },
      { ch: '千川 · 达人分销', spend: 32800, ours: 540, theirs: null, state: 'pending' },
    ],
    '2026-07': [
      { ch: '腾讯 · 朋友圈', spend: 116900, ours: 1980, theirs: 1980, state: 'ok' },
      { ch: '腾讯 · 视频号', spend: 54300, ours: 908, theirs: 902, state: 'ok' },
      { ch: '千川 · 全域推广', spend: 77100, ours: 1244, theirs: 1244, state: 'ok' },
    ],
    '2026-06': [
      { ch: '腾讯 · 朋友圈', spend: 98200, ours: 1602, theirs: 1602, state: 'ok' },
      { ch: '千川 · 全域推广', spend: 64500, ours: 1030, theirs: 1030, state: 'ok' },
    ],
  },
  dws: {
    '2026-08': [
      { ch: '腾讯 · 搜一搜品专', spend: 96200, ours: 312, theirs: 306, state: 'ok' },
      { ch: '腾讯 · 朋友圈', spend: 142800, ours: 441, theirs: 420, state: 'dispute' },
      { ch: '千川 · 全域推广', spend: 58400, ours: 168, theirs: null, state: 'pending' },
    ],
    '2026-07': [
      { ch: '腾讯 · 搜一搜品专', spend: 88400, ours: 290, theirs: 290, state: 'ok' },
      { ch: '腾讯 · 朋友圈', spend: 131500, ours: 402, theirs: 402, state: 'ok' },
    ],
    '2026-06': [
      { ch: '腾讯 · 搜一搜品专', spend: 79600, ours: 254, theirs: 254, state: 'ok' },
    ],
  },
};

const STATES = {
  ok: { label: '已对账', tone: 'success' },
  pending: { label: '待确认', tone: 'warning' },
  dispute: { label: '有差异', tone: 'danger' },
};

const num = (n) => n.toLocaleString('zh-CN');
const sign = (n) => (n < 0 ? '-' : '');
const yuan = (n) => sign(n) + '¥' + Math.abs(Math.round(n)).toLocaleString('zh-CN');
const yuan2 = (n) => sign(n) + '¥' + Math.abs(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* 广告主标签：与平台标签同一套下划线样式，只是把 Logo 换成首字方块 */
function AdvertiserTabs({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-7)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)' }}>
      {ADVERTISERS.map((a) => {
        const on = a.id === value;
        return (
          <button key={a.id} type="button" onClick={() => onChange(a.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 0 10px', marginBottom: -1, border: 0,
              borderBottom: '2px solid ' + (on ? 'var(--neutral-900)' : 'transparent'), background: 'transparent', fontFamily: 'inherit',
              fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'var(--transition-control)',
            }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 'var(--radius-sm)',
              background: on ? 'var(--neutral-900)' : 'var(--neutral-200)', color: on ? 'var(--neutral-0)' : 'var(--text-secondary)',
              fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)',
            }}>{a.name[0]}</span>
            {a.name}
            <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', fontWeight: 'var(--fw-regular)' }}>{a.trade}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 结算报表 ---------- */

/* 结算明细行：被通知或待办带过来时，差异那一行自己高亮 ——
   容器闪一下只说明来对了页，说不清要看的是哪一行。 */
function SettleRow({ row, adv, billable, diff, st }) {
  const ids = React.useMemo(() => (row.state === 'dispute' ? ['settle-dispute', 'settle-' + row.ch] : ['settle-' + row.ch]), [row.state, row.ch]);
  const on = window.useFocus(ids);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!on || !ref.current) return;
    const box = ref.current.closest('.huitou-scroll');
    if (box) box.scrollTop = Math.max(0, ref.current.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 120);
  }, [on]);
  return (
    <tr ref={ref} className={window.focusClass(on, 'row')} {...rowHoverProps('transparent', on)}
      style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <td style={{ padding: 'var(--space-5) var(--space-6)', whiteSpace: 'nowrap' }}>{row.ch}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{yuan(row.spend)}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{num(row.ours)}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: row.theirs == null ? 'var(--text-tertiary)' : undefined }}>
        {row.theirs == null ? '待回传' : num(row.theirs)}
      </td>
      <td style={{
        padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums',
        color: diff == null || diff === 0 ? 'var(--text-tertiary)' : 'var(--status-danger-fg)',
      }}>{diff == null ? '—' : diff === 0 ? '0' : (diff > 0 ? '+' : '') + num(diff)}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--fw-medium)' }}>{yuan(billable * adv.price)}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', whiteSpace: 'nowrap' }}>
          <StatusDot tone={st.tone} />
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>{st.label}</span>
        </span>
      </td>
    </tr>
  );
}

function SettleRow({ row, adv, billable, diff, st }) {
  const ids = React.useMemo(() => (row.state === 'dispute' ? ['settle-dispute', 'settle-' + row.ch] : ['settle-' + row.ch]), [row.state, row.ch]);
  const on = window.useFocus(ids);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!on || !ref.current) return;
    const box = ref.current.closest('.huitou-scroll');
    if (box) box.scrollTop = Math.max(0, ref.current.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 120);
  }, [on]);
  return (
    <tr ref={ref} className={window.focusClass(on, 'row')} {...rowHoverProps('transparent', on)}
      style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <td style={{ padding: 'var(--space-5) var(--space-6)', whiteSpace: 'nowrap' }}>{row.ch}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{yuan(row.spend)}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{num(row.ours)}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: row.theirs == null ? 'var(--text-tertiary)' : undefined }}>
        {row.theirs == null ? '待回传' : num(row.theirs)}
      </td>
      <td style={{
        padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums',
        color: diff == null || diff === 0 ? 'var(--text-tertiary)' : 'var(--status-danger-fg)',
      }}>{diff == null ? '—' : diff === 0 ? '0' : (diff > 0 ? '+' : '') + num(diff)}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--fw-medium)' }}>{yuan(billable * adv.price)}</td>
      <td style={{ padding: 'var(--space-5) var(--space-6)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', whiteSpace: 'nowrap' }}>
          <StatusDot tone={st.tone} />
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>{st.label}</span>
        </span>
      </td>
    </tr>
  );
}

/* 口径说明行：MetricCard 的 basis 依赖 delta，这里没有环比可给，自己在卡下补一行 */
function WithCaption({ children, caption }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {children}
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', paddingLeft: 'var(--space-5)' }}>{caption}</span>
    </div>
  );
}

function SettlementReport({ adv }) {
  const [period, setPeriod] = React.useState(PERIODS[0]);
  const [only, setOnly] = React.useState('全部状态');
  const all = (SETTLE[adv.id] || {})[period] || [];
  const rows = all.filter((r) => only === '全部状态' || STATES[r.state].label === only);

  const billable = (r) => (r.theirs == null ? r.ours : r.theirs);
  const tot = all.reduce((m, r) => ({
    spend: m.spend + r.spend, ours: m.ours + r.ours, bill: m.bill + billable(r),
    amount: m.amount + billable(r) * adv.price,
    hold: m.hold + (r.state === 'ok' ? 0 : billable(r) * adv.price),
  }), { spend: 0, ours: 0, bill: 0, amount: 0, hold: 0 });
  const gross = tot.amount - tot.spend;

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
        <MetricCard label={'结算金额 · ' + period} value={yuan(tot.amount)} />
        <MetricCard label={adv.unit + '（已确认 / 我方 ' + num(tot.ours) + '）'} value={num(tot.bill)} />
        <MetricCard label="结算单价" value={yuan2(adv.price)} />
        <MetricCard label={'毛利（' + (gross / tot.amount * 100).toFixed(1) + '%）'} value={yuan(gross)} />
      </div>

      {tot.hold > 0 ? (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', padding: 'var(--space-5) var(--space-6)', marginBottom: 'var(--space-6)',
          background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)',
        }}>
          <Icon name="triangle-alert" size={14} style={{ color: 'var(--status-warning-fg)', marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>{yuan(tot.hold)} 尚未确认</div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginTop: 2 }}>
              该金额按我方口径估算，广告主回传确认后才计入应收。差异行以对方口径为准。
            </div>
          </div>
          <Button variant="secondary" size="sm">发起对账</Button>
        </div>
      ) : null}

      <Card padded={false} style={{ marginBottom: 'var(--space-6)' }}>
        <FilterBar inset trailing={<span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{rows.length} 个渠道</span>}>
          <FilterSelect value={period} onChange={setPeriod} options={PERIODS.map((p) => ({ value: p, label: p }))} />
          <FilterSelect value={only} onChange={setOnly} options={['全部状态', '已对账', '待确认', '有差异'].map((s) => ({ value: s, label: s }))} />
        </FilterBar>
        <TableFrame>
          {(freeze) => (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
              <thead>
                <tr>
                  {['渠道 / 媒体', '投放消耗', '我方口径', '对方确认', '差异', '结算金额', '状态'].map((h, i) => (
                    <th key={h} style={{
                      textAlign: i === 0 || i === 6 ? 'left' : 'right', padding: 'var(--space-4) var(--space-6)', whiteSpace: 'nowrap',
                      fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)',
                      borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const b = billable(r);
                  const diff = r.theirs == null ? null : r.theirs - r.ours;
                  const st = STATES[r.state];
                  return (
                    <SettleRow key={r.ch} row={r} adv={adv} billable={b} diff={diff} st={st} />
                  );
                })}
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <td style={{ padding: 'var(--space-5) var(--space-6)', fontWeight: 'var(--fw-medium)' }}>合计</td>
                  <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--fw-medium)' }}>{yuan(tot.spend)}</td>
                  <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{num(tot.ours)}</td>
                  <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{num(tot.bill)}</td>
                  <td></td>
                  <td style={{ padding: 'var(--space-5) var(--space-6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--fw-medium)' }}>{yuan(tot.amount)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          )}
        </TableFrame>
      </Card>

      <StickyFooter
        status={<span>{period} · 应收 {yuan(tot.amount - tot.hold)}，待确认 {yuan(tot.hold)}</span>}
        actions={<>
          <Button variant="secondary" iconLeft="download">导出对账单</Button>
          <Button variant="primary">生成结算单</Button>
        </>} />
    </>
  );
}

/* ---------- 实时大屏 ---------- */

/* 大屏用深底：它是挂在墙上远看的，浅底在投影和电视上发白。
   数值每 3 秒自增一点，让人相信它真的在动 —— 这是这块界面唯一的说服力来源。 */
const CHANNELS = {
  bz: [{ ch: '腾讯 · 朋友圈', w: 0.38 }, { ch: '千川 · 全域推广', w: 0.27 }, { ch: '腾讯 · 视频号', w: 0.2 }, { ch: '千川 · 达人分销', w: 0.15 }],
  dws: [{ ch: '腾讯 · 朋友圈', w: 0.44 }, { ch: '腾讯 · 搜一搜品专', w: 0.33 }, { ch: '千川 · 全域推广', w: 0.23 }],
};
const CITIES = ['杭州', '苏州', '成都', '武汉', '西安', '南京', '深圳', '青岛', '合肥', '长沙'];

function BigNum({ label, value, sub, tone }) {
  return (
    <div style={{ padding: 'var(--space-6)', background: 'var(--neutral-800)', borderRadius: 'var(--radius-md)' }}>
      <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--neutral-400)' }}>{label}</div>
      <div style={{ fontSize: 34, lineHeight: 1.1, fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', color: tone || 'var(--neutral-0)', marginTop: 6 }}>{value}</div>
      {sub ? <div style={{ fontSize: 'var(--fs-12)', color: 'var(--neutral-500)', marginTop: 4 }}>{sub}</div> : null}
    </div>
  );
}

function LiveScreen({ adv }) {
  const base = adv.id === 'bz' ? { spend: 30100, lead: 486 } : { spend: 36400, lead: 128 };
  const [tick, setTick] = React.useState(0);
  const [feed, setFeed] = React.useState([]);
  const chans = CHANNELS[adv.id];

  React.useEffect(() => { setFeed([]); setTick(0); }, [adv.id]);
  React.useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 3000);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    const c = chans[Math.floor(Math.random() * chans.length)];
    const item = {
      id: adv.id + '-' + tick + '-' + Math.random().toString(36).slice(2, 6),
      city: CITIES[Math.floor(Math.random() * CITIES.length)],
      ch: c.ch, at: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
    };
    setFeed((f) => [item, ...f].slice(0, 12));
  }, [tick, adv.id]);

  const spend = base.spend + tick * (adv.id === 'bz' ? 137 : 226);
  const lead = base.lead + Math.floor(tick * (adv.id === 'bz' ? 2.1 : 0.8));
  const cpa = spend / lead;
  const revenue = lead * adv.price;
  /* 分小时消耗：固定形状 + 当前小时随 tick 长高，避免每次渲染整图跳动 */
  const hour = new Date().getHours();
  const bars = Array.from({ length: 24 }, (_, h) => {
    if (h > hour) return 0;
    const shape = 0.35 + 0.65 * Math.sin((Math.max(h - 6, 0) / 18) * Math.PI);
    return h === hour ? shape * (0.4 + (tick % 8) * 0.075) : shape;
  });
  const maxBar = Math.max(...bars, 1);

  return (
    <div style={{ background: 'var(--neutral-900)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-7)', color: 'var(--neutral-0)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)' }}>{adv.name} · 实时投放</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,.08)', fontSize: 'var(--fs-11)', color: 'var(--neutral-300)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-success-fg)' }}></span>数据延迟 &lt; 60s
        </span>
        <span style={{ flex: 1 }}></span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--neutral-500)', fontVariantNumeric: 'tabular-nums' }}>更新于 {new Date().toLocaleTimeString('zh-CN', { hour12: false })}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
        <BigNum label="今日消耗" value={yuan(spend)} sub={'预算 ' + yuan(adv.id === 'bz' ? 60000 : 70000)} />
        <BigNum label={'今日' + adv.unit} value={num(lead)} sub={'昨日同时段 ' + num(Math.round(lead * 0.92))} />
        <BigNum label="实时成本" value={yuan2(cpa)} sub={'结算单价 ' + yuan2(adv.price)} tone={cpa > adv.price ? 'var(--status-danger-fg)' : 'var(--neutral-0)'} />
        <BigNum label="预估毛利" value={yuan(revenue - spend)} sub={((revenue - spend) / revenue * 100).toFixed(1) + '%'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 'var(--space-5)' }}>
        <div style={{ padding: 'var(--space-6)', background: 'var(--neutral-800)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--neutral-400)', marginBottom: 'var(--space-5)' }}>分小时消耗</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 116 }}>
            {bars.map((v, h) => (
              <div key={h} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{
                  height: (v / maxBar * 100) + '%', minHeight: v ? 2 : 0, borderRadius: 2,
                  background: h === hour ? 'var(--neutral-0)' : 'var(--neutral-600)', transition: 'height .6s var(--ease-standard, ease)',
                }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-11)', color: 'var(--neutral-600)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
            <span>00</span><span>06</span><span>12</span><span>18</span><span>23</span>
          </div>

          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--neutral-400)', margin: 'var(--space-6) 0 var(--space-5)' }}>渠道实时占比</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {chans.map((c) => (
              <div key={c.ch} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                <span style={{ width: 132, flex: 'none', fontSize: 'var(--fs-12)', color: 'var(--neutral-300)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.ch}</span>
                <span style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--neutral-700)', overflow: 'hidden' }}>
                  <span style={{ display: 'block', width: (c.w * 100) + '%', height: '100%', background: 'var(--neutral-0)' }}></span>
                </span>
                <span style={{ width: 84, textAlign: 'right', fontSize: 'var(--fs-12)', color: 'var(--neutral-0)', fontVariantNumeric: 'tabular-nums' }}>{yuan(spend * c.w)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 'var(--space-6)', background: 'var(--neutral-800)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ fontSize: 'var(--fs-12)', color: 'var(--neutral-400)', marginBottom: 'var(--space-5)' }}>最新{adv.unit}</div>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 300, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {feed.map((f, i) => (
              <div key={f.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: '7px var(--space-5)', borderRadius: 'var(--radius-sm)',
                background: i === 0 ? 'rgba(255,255,255,.07)' : 'transparent', opacity: 1 - i * 0.05, fontSize: 'var(--fs-12)',
              }}>
                <span style={{ color: 'var(--neutral-600)', fontVariantNumeric: 'tabular-nums' }}>{f.at}</span>
                <span style={{ color: 'var(--neutral-0)' }}>{f.city}</span>
                <span style={{ flex: 1 }}></span>
                <span style={{ color: 'var(--neutral-400)', whiteSpace: 'nowrap' }}>{f.ch}</span>
              </div>
            ))}
            {!feed.length ? <div style={{ fontSize: 'var(--fs-12)', color: 'var(--neutral-600)' }}>等待数据…</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const [advId, setAdvId] = React.useState('bz');
  const [tab, setTab] = React.useState('settle');
  const adv = ADVERTISERS.find((a) => a.id === advId);

  return (
    <>
      <window.PageHeader title="数据看板" description="按广告主查看结算报表与实时大屏。结算以广告主回传口径为准，实时数据延迟约 1 分钟。"
        actions={<SegmentedControl value={tab} onChange={setTab} size="sm"
          options={[{ value: 'settle', label: '数据结算报表' }, { value: 'live', label: '数据实时大屏' }]} />} />

      <AdvertiserTabs value={advId} onChange={setAdvId} />

      {tab === 'settle' ? <SettlementReport adv={adv} /> : <LiveScreen adv={adv} />}
    </>
  );
}

window.DashboardView = DashboardView;
})();
