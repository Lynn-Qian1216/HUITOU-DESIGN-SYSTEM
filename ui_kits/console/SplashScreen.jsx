(() => {
/* 全屏加载动效。
   图形与动画帧全部来自设计稿导出的原始文件 assets/motion-stage.svg（Figma node 5746-18134）——
   该文件内含 13 个 morph 图层（Cat_Morph___00___Legs_Open → 12___Legs_Tucked），
   这里只做一件事：把这些图层按 00→12→01 乒乓顺序逐帧点亮。姿态没有一帧是重画的。

   注：.svg 文件在本项目中会被清理掉内联 <style>，所以逐帧播放的 CSS 放在页面里，
   并在运行时根据文件里实际存在的图层 id 生成 —— 以后换导出（帧数变了也行）无需改代码。 */

const SVG_URL = (window.__resources && window.__resources.motionStage) || '../../assets/motion-stage.svg';
const CYCLE = 600;      // 一个步频
const DOT_CYCLE = 1200; // 加载点循环

let cached = null;
const loadStage = () => (cached = cached || fetch(SVG_URL).then((r) => r.text()).catch(() => ''));

/* 依据实际图层生成逐帧 keyframes：00→12→01 乒乓 */
function buildCSS(frameIds, dotIds) {
  const n = frameIds.length;
  if (!n) return '';
  const seq = [];
  for (let i = 0; i < n; i++) seq.push(i);
  for (let i = n - 2; i >= 1; i--) seq.push(i);
  const w = 100 / seq.length;
  const r = (v) => Number(v.toFixed(4));
  const out = [];
  // 静态兜底：默认只显示中间那一帧。动画运行时会覆盖它，
  // prefers-reduced-motion 关掉动画后也只会剩这一个姿态，不会 13 帧叠在一起。
  const resting = frameIds[Math.floor((n - 1) / 2)];
  out.push(`${frameIds.map((id) => '#' + id).join(',')}{opacity:0}`);
  out.push(`#${resting}{opacity:1}`);
  if (dotIds.length) out.push(`${dotIds.map((id) => '#' + id).join(',')}{opacity:.18}`);
  for (let i = 0; i < n; i++) {
    const stops = [];
    let cursor = 0;
    seq.forEach((fi, si) => {
      if (fi !== i) return;
      const a = r(si * w), b = r((si + 1) * w);
      if (a > cursor) stops.push(`${r(cursor)}%,${r(a - 0.001)}%{opacity:0}`);
      stops.push(`${a}%,${r(b - 0.001)}%{opacity:1}`);
      cursor = b;
    });
    if (cursor < 100) stops.push(`${r(cursor)}%,100%{opacity:0}`);
    out.push(`@keyframes hs-f${i}{${stops.join('')}}`);
    out.push(`#${frameIds[i]}{animation:hs-f${i} ${CYCLE}ms linear infinite}`);
  }
  dotIds.forEach((id, i) => {
    out.push(`#${id}{animation:hs-dot ${DOT_CYCLE}ms var(--ease-standard) ${i * 180}ms infinite}`);
  });
  out.push('@keyframes hs-dot{0%,100%{opacity:.18}30%{opacity:1}}');
  out.push('@media (prefers-reduced-motion:reduce){[id^="Cat_Morph"],[id^="Dot_"]{animation:none}}');
  return out.join('');
}

function MotionStage({ width = 500 }) {
  const ref = React.useRef(null);
  const [markup, setMarkup] = React.useState('');
  const [css, setCss] = React.useState('');

  React.useEffect(() => { let live = true; loadStage().then((t) => { if (live) setMarkup(t); }); return () => { live = false; }; }, []);

  React.useEffect(() => {
    const host = ref.current;
    if (!markup || !host) return;
    const svg = host.querySelector('svg');
    if (svg) {
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.width = '100%';
      svg.style.height = 'auto';
      svg.style.display = 'block';
    }
    const frameIds = [...host.querySelectorAll('g[id^="Cat_Morph"]')].map((g) => g.id).sort();
    const dotIds = [...host.querySelectorAll('circle[id^="Dot"]')].map((c) => c.id).sort();
    // 逐帧靠 CSS 接管，清掉导出里写死的 opacity
    frameIds.forEach((id) => host.querySelector(`#${id}`).removeAttribute('opacity'));
    dotIds.forEach((id) => host.querySelector(`#${id}`).removeAttribute('opacity'));
    setCss(buildCSS(frameIds, dotIds));
  }, [markup]);

  return (
    <>
      <style>{css}</style>
      <div ref={ref} style={{ width, maxWidth: '100%', lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}

/* 开屏动画随视口缩放：小屏按宽度的 28% 走，大屏封顶 250 —— 固定 500 在笔记本上占掉半屏。 */
function SplashScreen({ onDone, duration = 2400, width = 'min(250px, 28vw)' }) {
  const [leaving, setLeaving] = React.useState(false);
  const skip = React.useCallback(() => setLeaving(true), []);

  React.useEffect(() => {
    const t = setTimeout(skip, duration);
    const key = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip(); };
    window.addEventListener('keydown', key);
    return () => { clearTimeout(t); window.removeEventListener('keydown', key); };
  }, [duration, skip]);

  React.useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => onDone && onDone(), 420);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <div onClick={skip} role="status" aria-label="正在加载 HUITOU"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, display: 'flex',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        background: 'var(--neutral-50)',
        cursor: leaving ? 'default' : 'pointer',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 420ms var(--ease-standard)',
        pointerEvents: leaving ? 'none' : 'auto',
      }}>
      <MotionStage width={width} />
    </div>
  );
}

Object.assign(window, { SplashScreen, MotionStage });
})();
