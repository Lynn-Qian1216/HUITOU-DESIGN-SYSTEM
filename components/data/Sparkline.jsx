import React from 'react';

export function Sparkline({ data = [], width = 96, height = 28, color = 'var(--viz-1)', area, style, ...rest }) {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - ((v - min) / span) * (height - 3) - 1.5]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return (
    <svg {...rest} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', flex: 'none', overflow: 'hidden', ...style }} aria-hidden>
      {area ? <path d={`${d} L${width} ${height} L0 ${height} Z`} fill={color} opacity="0.07" /> : null}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
