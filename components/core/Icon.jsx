import React from 'react';

const CDN = 'https://cdn.jsdelivr.net/npm/lucide-static@0.454.0/icons/';
const cache = new Map();

/* 同一个图标在 lucide 不同版本里换过名字（circle-check ↔ check-circle 这类）。
   直接写死一个名字，遇到版本不匹配就是一片空白 —— 取不到时换另一种写法再试一次。 */
const swap = (n) => {
  const m = /^(circle|square)-(.+)$/.exec(n);
  if (m) return m[2] + '-' + m[1];
  const r = /^(.+)-(circle|square)$/.exec(n);
  if (r) return r[2] + '-' + r[1];
  if (/-round$/.test(n)) return n.replace(/-round$/, '');
  if (/^grid-\d/.test(n)) return 'grid';
  return null;
};
const clean = (t) => t.replace(/<!--[\s\S]*?-->/g, '').replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '').replace(/>\s+</g, '><').trim();
const fetchIcon = (n) => fetch(CDN + n + '.svg').then((r) => (r.ok ? r.text() : '')).then(clean).catch(() => '');

function load(name) {
  if (!cache.has(name)) {
    cache.set(name, fetchIcon(name).then((t) => {
      if (t) return t;
      const alt = swap(name);
      return alt ? fetchIcon(alt) : '';
    }));
  }
  return cache.get(name);
}

/** Lucide glyph, inlined so it inherits currentColor and the 1.5px stroke. */
export function Icon({ name, size = 16, color, style, title, ...rest }) {
  const [svg, setSvg] = React.useState('');
  React.useEffect(() => {
    let live = true;
    load(name).then((t) => { if (live) setSvg(t); });
    return () => { live = false; };
  }, [name]);
  return (
    <span
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...rest}
      style={{
        display: 'inline-flex', flex: 'none', width: size, height: size,
        color: color || 'currentColor', lineHeight: 0, ...style,
      }}
    />
  );
}
