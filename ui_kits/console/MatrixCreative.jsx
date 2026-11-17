(() => {
const { Card, Button, Badge, Icon, Checkbox, StatusDot, IconButton, EmptyState, Dialog } = window.HUITOUAIDesignSystem_52606d;
const setStore = window.setMatrixStore;

/* 投放矩阵 · 后两段（创意矩阵 → 广告计划 → AI 决策）。
   矩阵 = 营销单元 × 创意。单元先定，创意后配 —— 顺序不能反：创意要按单元的版位与人群来选尺寸和说法。
   用户在这一段只做一件事：把图给够。分配是 AI 的判断，不是又一张勾选表 ——
   让人决定「哪张图配哪个单元」，等于把矩阵的复杂度原样退回给人。 */

/* 素材库：上一批没用完的图。缺图时引导上传，不缺就直接从这里挑。
   缩略图这里是占位（我无法生成图片）—— 接真实素材库时换成 CDN 缩略图即可。 */
const LIBRARY = [
  { id: 'm1', name: '守护爸妈-诊室场景.jpg', size: '1080×1920 · 9:16', url: 'assets/creatives/v-1.jpg', used: false },
  { id: 'm2', name: '住院医疗300万-方图.jpg', size: '800×800 · 1:1', url: 'assets/creatives/sq-1.jpg', used: false },
  { id: 'm3', name: '保障要点-横版.jpg', size: '1280×720 · 16:9', url: 'assets/creatives/h-1.jpg', used: true },
  { id: 'm4', name: '陪诊-父女候诊.jpg', size: '1080×1920 · 9:16', url: 'assets/creatives/v-2.jpg', used: false },
  { id: 'm5', name: '为自己的健康-方图.jpg', size: '800×800 · 1:1', url: 'assets/creatives/sq-2.jpg', used: false },
  { id: 'm6', name: '双保额对比-横版.jpg', size: '1280×720 · 16:9', url: 'assets/creatives/h-2.jpg', used: true },
  { id: 'm7', name: '病房-更安心的未来.jpg', size: '1080×1920 · 9:16', url: 'assets/creatives/v-3.jpg', used: false },
  { id: 'm8', name: '给自己一份健康保障.jpg', size: '1080×1920 · 9:16', url: 'assets/creatives/v-4.jpg', used: false },
  { id: 'm9', name: '锁-利益点方图.jpg', size: '800×800 · 1:1', url: 'assets/creatives/sq-3.jpg', used: false },
  { id: 'm10', name: '盾牌-要点横版.jpg', size: '1280×720 · 16:9', url: 'assets/creatives/h-3.jpg', used: false },
  { id: 'm11', name: '门诊场景-竖版.jpg', size: '1080×1920 · 9:16', url: 'assets/creatives/v-5.jpg', used: false },
  { id: 'm12', name: '挂号处-情绪冲突.jpg', size: '1080×1920 · 9:16', url: 'assets/creatives/v-6.jpg', used: true },
  { id: 'm13', name: '300万保额-方图.jpg', size: '800×800 · 1:1', url: 'assets/creatives/sq-4.jpg', used: false },
  { id: 'm14', name: '安心守护-方图.jpg', size: '800×800 · 1:1', url: 'assets/creatives/sq-5.jpg', used: false },
  { id: 'm15', name: '保障清单-横版.jpg', size: '1280×720 · 16:9', url: 'assets/creatives/h-4.jpg', used: false },
  { id: 'm16', name: '理赔流程-横版.jpg', size: '1280×720 · 16:9', url: 'assets/creatives/h-5.jpg', used: false },
].map((m) => Object.assign({}, m, { url: window.__res ? window.__res(m.url) : m.url }));


/* 缩略图一律可点开看大图 —— 素材是这一步唯一要判断的东西，判断不了就等于没上传。
   上传的图有真实 objectURL；案例与素材库没有真图，用占位块，点开后说明原因。 */
function Thumb({ item, size = 44, onOpen }) {
  const inner = item.url
    ? <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    : <Icon name="image" size={Math.round(size * 0.36)} />;
  const style = { flex: 'none', width: size, height: size, borderRadius: 'var(--radius-sm)', background: item.tone || 'var(--neutral-100)', display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)', overflow: 'hidden' };
  if (!onOpen) return <span style={style}>{inner}</span>;
  return (
    <button type="button" title="查看大图" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpen(item); }}
      style={Object.assign({ padding: 0, borderWidth: 0, cursor: 'zoom-in' }, style)}>{inner}</button>
  );
}

function AssetPreview({ item, onClose }) {
  if (!item) return null;
  return (
    <Dialog open onClose={onClose} title={item.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: 260, maxHeight: 420, background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {item.url
            ? <img src={item.url} alt={item.name} style={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain', display: 'block' }} />
            : <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--text-tertiary)', fontSize: 'var(--fs-12)' }}>
                <Icon name="image" size={28} />
                <span>缩略图占位 · 接入素材库后显示真实图片</span>
              </span>}
        </div>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
          {item.size || item.ratio}{item.metric ? ' · ' + item.metric : ''}
        </span>
      </div>
    </Dialog>
  );
}

/* 第一步：把图给够。
   在「传图」之前先给两样东西：AI 从腾讯营销后台抓来的同类高转化案例，和一张按版位算出来的规格清单。
   规格清单是硬门槛 —— 三种比例各差几张写在明处，凑齐才能进下一步；
   理由：图不合尺寸，后面 AI 分配只能二次裁切，测出来的是裁切不是创意。 */
/* 参考只给图和数：看图学做图，写成四条文字建议没人读。每张只标比例与最好的那一个指标。 */
const CASES = [
  { id: 'c1', name: '门诊场景 · 赔付金额大字', ratio: '9:16', metric: '点击率 4.8%', url: 'assets/creatives/v-5.jpg' },
  { id: 'c2', name: '情绪冲突 · 挂号处', ratio: '9:16', metric: '转化成本 ¥52', url: 'assets/creatives/v-6.jpg' },
  { id: 'c3', name: '利益点方图 · 300万', ratio: '1:1', metric: '点击率 3.6%', url: 'assets/creatives/sq-4.jpg' },
  { id: 'c4', name: '保障要点横版', ratio: '16:9', metric: '转化率 2.1%', url: 'assets/creatives/h-4.jpg' },
].map((c) => Object.assign({}, c, { url: window.__res ? window.__res(c.url) : c.url }));


const RATIOS = [
  { k: '9:16', v: 9 / 16, px: '1080×1920' },
  { k: '1:1', v: 1, px: '1080×1080' },
  { k: '16:9', v: 16 / 9, px: '1920×1080' },
];
const SPEC_USE = {
  '9:16': '朋友圈 / 视频号竖版主图，本轮主力',
  '1:1': '小程序与公众号方图，信息型画面',
  '16:9': '优量汇横版，流程图或对比表',
};
/* 需要哪几种比例由选中的单元的版位算出来，不是固定三种 —— 没有横版版位就别让人白拍横图 */
function specsFor(units) {
  const has = (kw) => units.some((u) => (String(u.to || '') + ' ' + (u.keep || []).join(' ')).includes(kw));
  const list = [{ ratio: '9:16', need: 3, main: true }, { ratio: '1:1', need: 2 }];
  if (has('智能版位') || has('优量汇') || has('横版')) list.push({ ratio: '16:9', need: 2 });
  return list.map((s) => Object.assign({}, s, { px: (RATIOS.find((r) => r.k === s.ratio) || {}).px, use: SPEC_USE[s.ratio] }));
}
function classify(w, h) {
  const r = w / h;
  let best = null;
  RATIOS.forEach((x) => { const d = Math.abs(r - x.v) / x.v; if (d < 0.04 && (!best || d < best.d)) best = { k: x.k, d: d }; });
  if (!best) return { why: '比例不符 · 只收 9:16 / 1:1 / 16:9' };
  if (Math.min(w, h) < 720) return { why: '短边不足 720px' };
  return { ratio: best.k, dims: w + '×' + h };
}
function libRatio(m) { const p = String(m.size).split('·')[1]; return p ? p.trim() : null; }

function MatrixMaterialBlock({ onAct }) {
  const st = window.useMatrixStore();
  const units = (window.matrixUnits ? window.matrixUnits() : []).filter((p) => (st.picked || []).includes(p.id));
  const specs = specsFor(units);
  const need = specs.reduce((n, s) => n + s.need, 0);
  const [picked, setPicked] = React.useState([]);
  const [uploaded, setUploaded] = React.useState([]);
  const [done, setDone] = React.useState(false);
  const [refsOpen, setRefsOpen] = React.useState(true);
  const [preview, setPreview] = React.useState(null);
  const fileRef = React.useRef(null);
  const all = uploaded.filter((m) => m.ratio).concat(LIBRARY.filter((m) => picked.includes(m.id)));
  const bad = uploaded.filter((m) => !m.ratio);
  const countOf = (ratio) =>
    uploaded.filter((m) => m.ratio === ratio).length + LIBRARY.filter((m) => picked.includes(m.id) && libRatio(m) === ratio).length;
  const metSpecs = specs.filter((s) => countOf(s.ratio) >= s.need).length;
  const ready = metSpecs === specs.length;

  /* 尺寸要真的量过才算数：读进 Image 拿自然宽高，再判比例与短边 */
  const onFiles = (e) => {
    Array.from(e.target.files || []).slice(0, 12).forEach((f, i) => {
      const id = 'u' + Date.now() + i;
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        const c = classify(img.naturalWidth, img.naturalHeight);
        setUploaded((u) => u.concat([{ id: id, name: f.name, url: url, ratio: c.ratio, why: c.why, size: c.ratio ? c.dims + ' · ' + c.ratio : c.why, tone: 'var(--neutral-200)', fresh: true }]));
      };
      img.onerror = () => { setUploaded((u) => u.concat([{ id: id, name: f.name, why: '无法读取图片', size: '无法读取图片', tone: 'var(--neutral-200)' }])); URL.revokeObjectURL(url); };
      img.src = url;
    });
    e.target.value = '';
  };

  if (done) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>
        <Icon name="check" size={14} style={{ color: 'var(--status-success-fg)', flex: 'none' }} />
        <span style={{ flex: 1, minWidth: 0 }}>素材已就绪 · {all.length} 张（新上传 {uploaded.filter((m) => m.ratio).length} 张，素材库 {picked.length} 张）</span>
      </div>
    );
  }

  return (
    <>
      {/* 参考放在表单外：它是「照着做」的材料，不是要填的东西 —— 混在卡片里会被当成一个待办步骤 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Icon name="sparkles" size={13} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>同类高转化案例 · 抓自腾讯营销「宠物保险」近 30 天在投素材</span>
          <span style={{ flex: 1 }} />
          <Button variant="ghost" size="sm" iconRight={refsOpen ? 'chevron-up' : 'chevron-down'} onClick={() => setRefsOpen((v) => !v)}>{refsOpen ? '收起' : '展开'}</Button>
        </div>
        {refsOpen ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
            {CASES.map((c) => (
              <button key={c.id} type="button" title="查看大图" onClick={() => setPreview(c)}
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 0, border: 0, background: 'transparent', font: 'inherit', textAlign: 'left', cursor: 'zoom-in', minWidth: 0 }}>
                <span style={{ position: 'relative', display: 'block', width: '100%', height: 84, background: 'var(--neutral-100)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img src={c.url} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', left: 6, top: 6, padding: '1px 6px', borderRadius: 'var(--radius-sm)', background: 'var(--neutral-900)', color: 'var(--neutral-0)', fontSize: 'var(--fs-11)', fontVariantNumeric: 'tabular-nums' }}>{c.ratio}</span>
                </span>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{c.metric}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

    <Card padded={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>图片素材</span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{units.length} 个单元 · {specs.length} 种规格，共 {need} 张</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums', color: ready ? 'var(--status-success-fg)' : 'var(--text-primary)' }}>
          规格已满足 <strong>{metSpecs}</strong> / {specs.length}
        </span>
      </div>

      <div style={{ padding: 'var(--space-6) var(--gutter-card)', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>本轮要传的图（按选中单元的版位算出来）</span>
          <div style={{ display: 'flex', flexDirection: 'column', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {specs.map((s, i) => {
              const n = countOf(s.ratio);
              const ok = n >= s.need;
              return (
                <div key={s.ratio} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'linear-gradient(to right, var(--status-success-bg) ' + Math.min(100, (n / s.need) * 100) + '%, var(--surface-card) ' + Math.min(100, (n / s.need) * 100) + '%)' }}>
                  <span style={{ fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', width: 44, flex: 'none' }}>{s.ratio}</span>
                  <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', width: 84, flex: 'none' }}>{s.px}</span>
                  <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.use}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 'var(--fs-12)', fontVariantNumeric: 'tabular-nums', color: ok ? 'var(--status-success-fg)' : 'var(--text-primary)', flex: 'none' }}>{n} / {s.need} 张</span>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={() => fileRef.current && fileRef.current.click()}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', width: '100%', height: 148, borderWidth: 1, borderStyle: 'dashed', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-md)', background: 'var(--neutral-25)', font: 'inherit', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Icon name="upload" size={22} style={{ color: 'var(--text-tertiary)' }} />
            <span>上传图片素材</span>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>JPG / PNG，短边不小于 720px，上传后自动识别比例</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />

          {uploaded.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))', gap: 'var(--space-4)' }}>
              {uploaded.map((m) => (
                <span key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', minWidth: 0 }}>
                  <span style={{ position: 'relative', display: 'block', width: '100%', height: 84, background: m.tone, borderRadius: 'var(--radius-md)', overflow: 'hidden', outline: m.ratio ? '1px solid var(--border-subtle)' : '1px solid var(--status-danger-fg)', outlineOffset: -1 }}>
                    {m.url
                      ? <img src={m.url} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)' }}><Icon name="image" size={16} /></span>}
                    {m.ratio ? <span style={{ position: 'absolute', left: 4, top: 4, padding: '1px 5px', borderRadius: 'var(--radius-sm)', background: 'var(--neutral-900)', color: 'var(--neutral-0)', fontSize: 'var(--fs-11)' }}>{m.ratio}</span> : null}
                    <button type="button" title="查看大图" onClick={() => setPreview(m)}
                      style={{ position: 'absolute', right: 4, bottom: 4, width: 20, height: 20, display: 'grid', placeItems: 'center', padding: 0, border: 0, borderRadius: 'var(--radius-sm)', background: 'var(--neutral-0)', color: 'var(--text-secondary)', cursor: 'zoom-in' }}>
                      <Icon name="maximize-2" size={11} />
                    </button>
                    <button type="button" title="移除" onClick={() => { if (m.url) URL.revokeObjectURL(m.url); setUploaded((u) => u.filter((x) => x.id !== m.id)); }}
                      style={{ position: 'absolute', right: 4, top: 4, width: 20, height: 20, display: 'grid', placeItems: 'center', padding: 0, border: 0, borderRadius: 'var(--radius-sm)', background: 'var(--neutral-0)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <Icon name="x" size={11} />
                    </button>
                  </span>
                  <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 'var(--fs-11)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                    <span style={{ fontSize: 'var(--fs-11)', color: m.ratio ? 'var(--text-tertiary)' : 'var(--status-danger-fg)' }}>{m.ratio ? m.size.split(' · ')[0] : m.why}</span>
                  </span>
                </span>
              ))}
            </div>
          ) : null}
          {bad.length ? (
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--status-danger-fg)' }}>{bad.length} 张不计入 —— 尺寸不合规的图只能二次裁切，测出来的是裁切不是创意。</span>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>或从素材库补（上一批没用完的）</span>
            <span style={{ flex: 1 }} />
            {/* 再点一次取消：同一个按钮既是全选也是撤销，不用另加一个「清空」 */}
            <Button variant="ghost" size="sm" onClick={() => {
              const ids = LIBRARY.filter((m) => !m.used).map((m) => m.id);
              const allOn = ids.every((id) => picked.includes(id));
              setPicked((pp) => (allOn ? pp.filter((id) => !ids.includes(id)) : pp.concat(ids.filter((id) => !pp.includes(id)))));
            }}>{LIBRARY.filter((m) => !m.used).every((m) => picked.includes(m.id)) ? '取消全选' : '全选未用过'}</Button>
          </div>
          {/* 与上方参考图同一种铺法：图大、说明在下 —— 素材要能看清才选得动 */}
          <div className="huitou-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))', gap: 'var(--space-4)', maxHeight: 496, overflowY: 'auto', margin: '0 calc(var(--space-4) * -1)', padding: '0 var(--space-4)' }}>
            {LIBRARY.map((m) => {
              const on = picked.includes(m.id);
              return (
                <label key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', minWidth: 0, cursor: 'pointer' }}>
                  <span style={{ position: 'relative', display: 'block', width: '100%', height: 84, background: 'var(--neutral-100)', borderRadius: 'var(--radius-md)', overflow: 'hidden', outline: on ? '2px solid var(--neutral-900)' : '1px solid var(--border-subtle)', outlineOffset: on ? -2 : -1 }}>
                    <img src={m.url} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{ position: 'absolute', left: 4, top: 4 }}><Checkbox checked={on} onChange={() => setPicked((pp) => (on ? pp.filter((x) => x !== m.id) : pp.concat(m.id)))} /></span>
                    <button type="button" title="查看大图" onClick={(e) => { e.preventDefault(); setPreview(m); }}
                      style={{ position: 'absolute', right: 4, bottom: 4, width: 20, height: 20, display: 'grid', placeItems: 'center', padding: 0, border: 0, borderRadius: 'var(--radius-sm)', background: 'var(--neutral-0)', color: 'var(--text-secondary)', cursor: 'zoom-in' }}>
                      <Icon name="maximize-2" size={11} />
                    </button>
                  </span>
                  <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 'var(--fs-11)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                    <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{(String(m.size).split('·')[1] || '').trim()}{m.used ? ' · 用过' : ''}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
          {ready
            ? '规格齐了。我按单元的版位与人群分配，同一张图会做不同版式。'
            : '还差：' + specs.filter((s) => countOf(s.ratio) < s.need).map((s) => s.ratio + ' ' + (s.need - countOf(s.ratio)) + ' 张').join('、')}
        </span>
        <span style={{ flex: 1 }} />
        <Button variant="primary" size="sm" iconRight="arrow-right" disabled={!ready}
          onClick={() => {
            setDone(true);
            setStore({ assets: all, phase: 'materials-ok' });
            window.markMatrixGen && window.markMatrixGen('creatives', 2000);
            onAct && onAct({ type: 'send', text: '素材已就绪 ' + all.length + ' 张' });
          }}>提交，生成创意矩阵</Button>
      </div>
      <AssetPreview item={preview} onClose={() => setPreview(null)} />
    </Card>
    </>
  );
}

/* 第二步：AI 分配的结果。人只审「分得对不对」，所以每组把「为什么给这个单元」写出来。 */
function MatrixCreativesBlock({ onAct }) {
  const st = window.useMatrixStore();
  const units = (window.matrixUnits ? window.matrixUnits() : []).filter((p) => (st.picked || []).includes(p.id));
  const assets = st.assets || [];
  const groups = window.matrixCreativeGroups(units, assets, st.content || {});
  const [preview, setPreview] = React.useState(null);
  const locked = st.phase === 'creatives-ok' || st.phase === 'plans' || st.phase === 'approved';

  return (
    <Card padded={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>创意矩阵</span>
        <Badge tone="ai">AI 分配</Badge>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{groups.length} 组 · 每个单元一组</span>
        <span style={{ flex: 1 }} />
        {locked ? null : <Button variant="ghost" size="sm" iconLeft="refresh-cw" onClick={() => setStore({ reshuffle: (st.reshuffle || 0) + 1 })}>重新分配</Button>}
      </div>
      <div>
        {groups.map((g, i) => (
          <div key={g.id} style={{ padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{g.unit.name}</span>
              <Badge tone="neutral">{g.form}</Badge>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{g.assets.length} 张 · {g.ratio}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              {g.assets.map((m) => <Thumb key={m.id} item={m} size={56} onOpen={setPreview} />)}
              <span style={{ minWidth: 180, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 'var(--fs-13)' }}>{g.title}</span>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>落地页 {g.landing} · 行动号召「{g.cta}」</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
              <Icon name="sparkles" size={11} style={{ flex: 'none', marginTop: 3, color: 'var(--status-ai-fg)' }} />
              <span style={{ minWidth: 0 }}>{g.why}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)', flexWrap: 'wrap' }}>
        {locked
          ? <StatusDot tone="success" label={'已确认 ' + groups.length + ' 组创意'} style={{ fontSize: 'var(--fs-12)' }} />
          : <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>确认后我把单元与创意组合成广告计划，一个单元一条。</span>}
        <span style={{ flex: 1 }} />
        {locked ? null : (
          <Button variant="primary" size="sm" iconRight="arrow-right"
            onClick={() => { setStore({ creatives: groups, phase: 'creatives-ok' }); window.markMatrixGen && window.markMatrixGen('plans', 1600); onAct && onAct({ type: 'send', text: '创意矩阵已确认 ' + groups.length + ' 组' }); }}>
            确认，生成广告计划
          </Button>
        )}
      </div>
      <AssetPreview item={preview} onClose={() => setPreview(null)} />
    </Card>
  );
}

/* 第三步：广告计划 = 单元 × 创意，逐条决策。
   决策粒度是「每条计划一条」—— 整批一个按钮的话，那条 CPA 明显偏高的也会被一起放出去。 */
function MatrixPlansBlock({ onAct }) {
  const st = window.useMatrixStore();
  const plans = window.matrixPlans(st);
  const [acted, setActed] = React.useState({});
  const c = st.content || {};
  const submitted = st.phase === 'approved';
  const ok = plans.filter((p) => acted[p.id] === 'go');
  const skipped = plans.filter((p) => acted[p.id] === 'skip');
  const left = plans.length - ok.length - skipped.length;

  const submit = () => {
    /* 批次里的每条计划要摊平成 BatchCard / 详情认识的形状（dim / bid / budget / from / to / verify），
       同时带上 creative，详情里才能显示这条投的是哪组素材 */
    const batch = {
      id: 'B-r' + st.round, round: st.round, name: c.batch || '本轮批次',
      cpaTarget: Number(c.cpa) || 100, approvedAt: Date.now(),
      plans: ok.map((p) => Object.assign({}, p.unit, { id: p.id, name: p.name, creative: p.creative })),
    };
    window.setMatrixRound(st.round, { phase: 'approved' });
    setStore({ phase: 'approved', approvedAt: batch.approvedAt, batches: (st.batches || []).concat(batch) });
    onAct && onAct({ type: 'send', text: '开始投放 ' + ok.length + ' 条广告计划' });
  };

  return (
    <Card padded={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' }}>
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>广告计划</span>
        <Badge tone="neutral">{plans.length} 条</Badge>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>营销单元 × 创意</span>
        <span style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" iconRight="arrow-up-right" onClick={() => onAct && onAct({ type: 'open-rail', rail: 'matrix' })}>在右侧查看</Button>
      </div>
      <div>
        {plans.map((p, i) => {
          const state = acted[p.id];
          return (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', minWidth: 0,
              borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
              background: state === 'skip' ? 'var(--neutral-25)' : 'var(--surface-card)', opacity: state === 'skip' ? 0.6 : 1,
            }}>
              <span style={{ flex: 'none', marginTop: 2 }}><Thumb item={p.creative.assets[0]} size={40} /></span>
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{p.name}</span>
                  <Badge tone="ai">只改 · {p.unit.dim}</Badge>
                </span>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>{p.creative.title}</span>
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>
                  出价 ¥{p.unit.bid} · 日预算 ¥{p.unit.budget} · {p.creative.assets.length} 张素材 · {p.creative.form}
                </span>
              </span>
              <span style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                {submitted || state
                  ? <StatusDot tone={state === 'go' ? 'success' : 'neutral'} label={state === 'go' ? '开始投放' : '本轮跳过'} style={{ fontSize: 'var(--fs-12)' }} />
                  : <>
                      <Button variant="ghost" size="sm" onClick={() => setActed((a) => Object.assign({}, a, { [p.id]: 'skip' }))}>跳过</Button>
                      <Button variant="secondary" size="sm" iconLeft="check" onClick={() => setActed((a) => Object.assign({}, a, { [p.id]: 'go' }))}>批准</Button>
                    </>}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)', flexWrap: 'wrap' }}>
        {submitted
          ? <StatusDot tone="success" label={'已提交 ' + ok.length + ' 条，腾讯创建中'} style={{ fontSize: 'var(--fs-12)' }} />
          : <span style={{ fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums' }}>
              批准 <strong>{ok.length}</strong> 条 · 跳过 {skipped.length} 条{left ? ' · 待决策 ' + left + ' 条' : ''} · 合计日预算 ¥{ok.reduce((s, p) => s + p.unit.budget, 0)}
            </span>}
        <span style={{ flex: 1 }} />
        {submitted ? null : <>
          {left ? <Button variant="ghost" size="sm" onClick={() => setActed(plans.reduce((a, p) => Object.assign(a, { [p.id]: a[p.id] || 'go' }), Object.assign({}, acted)))}>全部批准</Button> : null}
          <Button variant="primary" size="sm" iconLeft="play" disabled={!ok.length || !!left} onClick={submit}>开始投放 {ok.length} 条</Button>
        </>}
      </div>
    </Card>
  );
}

/* AI 的分配逻辑：按单元变量决定版式与说法。假数据也要有内在一致性，
   否则「AI 分配」看起来就是随机切片。 */
/* 版式与说法都由单元要验证的变量决定，不按序号轮换：
   - 改版位 → 用该版位的原生尺寸，不二次裁切；
   - 改人群 / 出价 / 出价类型 → 创意保持同一套基准，否则价格与图两件事一起动，归因不清。 */
/* 创意只有三种比例：9:16（竖版沉浸位）、16:9（横版信息流）、1:1（方图通投）。
   版位决定用哪一种 —— 尺寸不是审美选择，是版位的原生规格。 */
const BASE_FORM = { form: '竖版大图', ratio: '9:16 · 1080×1920', cta: '立即投保' };
const PLACEMENT_FORM = {
  朋友圈: { form: '竖版大图', ratio: '9:16 · 1080×1920' },
  视频号: { form: '竖版大图', ratio: '9:16 · 1080×1920' },
  公众号: { form: '横版图文', ratio: '16:9 · 1920×1080' },
  小程序: { form: '方图', ratio: '1:1 · 1080×1080' },
};
function creativeSpec(u, product) {
  if (u.dim === '版位') {
    const key = Object.keys(PLACEMENT_FORM).find((k) => String(u.to || '').includes(k)) || '朋友圈';
    const f = PLACEMENT_FORM[key];
    return Object.assign({ cta: '立即投保', title: product + ' · ' + key + '原生版式', why: '这个单元改的是版位（' + u.to + '）。' + f.form + ' 是该版位的原生尺寸，不用二次裁切 —— 裁切会引入清晰度差异，那就不是纯版位对照了。' }, f);
  }
  const base = Object.assign({}, BASE_FORM, { title: product + ' · 基准版式' });
  if (u.dim === '定向') return Object.assign(base, { why: '这个单元拓的是人群（' + u.to + '）。创意与其他单元用同一套基准版式和说法，避免人群和文案两个变量一起动。' });
  if (u.dim === '出价') return Object.assign(base, { why: '这个单元试的是出价（' + u.from + ' → ' + u.to + '）。创意与其他单元保持同一套，价格差异才归因得清。' });
  if (u.dim === '出价类型') return Object.assign(base, { why: '这个单元换的是出价方式（' + u.to + '）。创意与其他单元保持同一套，跑量差异才能归到出价方式上。' });
  return Object.assign(base, { why: '创意用基准版式，保持与其他单元一致。' });
}
function matrixCreativeGroups(units, assets, content) {
  const pool = assets.length ? assets : LIBRARY.filter((m) => !m.used);
  const product = content.product || '宠物责任险';
  const used = [];
  return units.map((u, i) => {
    const spec = creativeSpec(u, product);
    const want = String(spec.ratio).split(' · ')[0];
    /* 先按本组比例挑没被别的组用掉的，够两张就停；实在没有再退回整池 */
    const fits = pool.filter((m) => !used.includes(m.id) && String(m.size || '').includes(want));
    const picked = (fits.length ? fits : pool.filter((m) => !used.includes(m.id))).slice(0, 2);
    const final = picked.length ? picked : pool.slice(0, 1);
    final.forEach((m) => used.push(m.id));
    return Object.assign({ id: 'cg' + u.id, unit: u, assets: final, landing: content.media || '微信原生页' }, spec);
  });
}

/* 计划 = 单元 × 创意，一个单元一条 —— 全交叉会让 3 个单元变成 9 条，
   多出来的 6 条测的是「图」不是「单元」，与这一轮要验证的东西无关。 */
function matrixPlans(st) {
  const units = (window.matrixUnits ? window.matrixUnits() : []).filter((p) => (st.picked || []).includes(p.id));
  const groups = st.creatives || matrixCreativeGroups(units, st.assets || [], st.content || {});
  return units.map((u, i) => {
    const g = groups[i] || groups[0];
    return { id: 'plan' + u.id, unit: u, creative: g, name: ((st.content || {}).batch || '本轮') + ' · ' + u.name };
  });
}

Object.assign(window, {
  MatrixMaterialBlock, MatrixCreativesBlock, MatrixPlansBlock,
  matrixCreativeGroups, matrixPlans, MATRIX_LIBRARY: LIBRARY, MatrixThumb: Thumb,
});
})();
