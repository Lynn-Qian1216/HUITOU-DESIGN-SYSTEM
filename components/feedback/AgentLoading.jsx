import React from 'react';

/* 逐帧奔跑猫加载动效 + 与真实回复同形的骨架块。
   图形来自设计稿导出的逐帧 SVG（13 个 Cat_Morph 图层），按 00→12→01 乒乓顺序
   点亮，没有一帧姿态是重画的。.svg 保存时内联 <style> 会被清掉，所以逐帧 CSS
   在运行时按文件里实际存在的图层 id 生成 —— 换导出（帧数变了也行）无需改代码。 */

const CYCLE = 560;
const cache = {};
const load = (url) => (cache[url] = cache[url] || fetch(url).then((r) => r.text()).catch(() => ''));

function buildCSS(ids, ns) {
  const n = ids.length;
  if (!n) return '';
  const seq = [];
  for (let i = 0; i < n; i++) seq.push(i);
  for (let i = n - 2; i >= 1; i--) seq.push(i);
  const w = 100 / seq.length;
  const r = (v) => Number(v.toFixed(4));
  const out = [];
  for (let i = 0; i < n; i++) {
    const stops = [];
    let cursor = 0;
    seq.forEach((fi, si) => {
      if (fi !== i) return;
      const a = r(si * w), b = r((si + 1) * w);
      if (a > cursor) stops.push(r(cursor) + '%,' + r(a - 0.001) + '%{opacity:0}');
      stops.push(a + '%,' + r(b - 0.001) + '%{opacity:1}');
      cursor = b;
    });
    if (cursor < 100) stops.push(r(cursor) + '%,100%{opacity:0}');
    out.push('@keyframes ' + ns + i + '{' + stops.join('') + '}');
    out.push('#' + ids[i] + '{animation:' + ns + i + ' ' + CYCLE + 'ms linear infinite}');
  }
  out.push('@media (prefers-reduced-motion:reduce){[id^="Cat_Morph"]{animation:none}}');
  return out.join('');
}

export function RunningCat({ width = 42, src = '../../assets/motion-reply.svg', style }) {
  const ref = React.useRef(null);
  const [markup, setMarkup] = React.useState('');
  const [css, setCss] = React.useState('');

  React.useEffect(() => {
    let live = true;
    load(src).then((t) => { if (live) setMarkup(t); });
    return () => { live = false; };
  }, [src]);

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
    const ids = [].slice.call(host.querySelectorAll('g[id^="Cat_Morph"]')).map((g) => g.id).sort();
    ids.forEach((id) => { const el = host.querySelector('#' + id); if (el) el.removeAttribute('opacity'); });
    setCss(buildCSS(ids, 'hs-cat-'));
  }, [markup]);

  return (
    <React.Fragment>
      <style>{css}</style>
      <div ref={ref} style={Object.assign({ width: width, flex: 'none', lineHeight: 0 }, style)}
        dangerouslySetInnerHTML={{ __html: markup }} />
    </React.Fragment>
  );
}

function Bar({ w, delay }) {
  return <span style={{
    display: 'block', width: w, height: 10, borderRadius: 'var(--radius-xs)', background: 'var(--neutral-100)',
    animation: 'huitou-pulse 1.4s var(--ease-standard) ' + delay + 'ms infinite',
  }} />;
}

function Block({ h, delay }) {
  return <span style={{
    display: 'block', width: '100%', height: h, borderRadius: 'var(--radius-card)', background: 'var(--neutral-100)',
    animation: 'huitou-pulse 1.4s var(--ease-standard) ' + delay + 'ms infinite',
  }} />;
}

export function AgentLoading({ label, phases, phaseMs = 900, skeleton = true, catWidth = 42, src, style }) {
  const list = phases && phases.length ? phases : (label ? [label] : ['正在读取账户数据']);
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % list.length), phaseMs);
    return () => clearInterval(t);
  }, [list.length, phaseMs]);

  return (
    <div style={Object.assign({ minWidth: 0 }, style)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
        <RunningCat width={catWidth} src={src} />
        <span key={phase} style={{
          fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', whiteSpace: 'nowrap',
          animation: 'huitou-fade var(--duration-normal) var(--ease-standard) both',
        }}>{list[phase % list.length]}</span>
        <span style={{ display: 'inline-flex', gap: 3, flex: 'none' }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              width: 3, height: 3, borderRadius: 999, background: 'var(--text-tertiary)',
              animation: 'huitou-pulse 1.1s var(--ease-standard) ' + (i * 160) + 'ms infinite',
            }} />
          ))}
        </span>
      </div>

      {skeleton ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', marginTop: 'var(--space-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Bar w="100%" delay={0} />
            <Bar w="72%" delay={120} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-4)' }}>
            <Block h={58} delay={200} />
            <Block h={58} delay={280} />
            <Block h={58} delay={360} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
