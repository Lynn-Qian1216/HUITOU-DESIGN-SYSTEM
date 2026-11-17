import React from 'react';
import { Badge } from '../core/Badge.jsx';
import { Popover } from '../overlay/Popover.jsx';

/* 多节点流程进度：走过的节点填实、当前节点按「进行中／已完成」着色、未到的留空心。
   达人分销（申请合作 → 商品授权 → 建广告 → 投放中）与接入流程都用它，
   保证同一段流程在任何界面里读起来一致。 */

export function ProgressTrack({ steps = [], at = 0, state = 'done', label, showLabel = true, style }) {
  const idle = state === 'idle';
  const tone = idle ? 'neutral' : state === 'pending' ? 'danger' : 'success';

  const passed = (i) => !idle && (i < at || (i === at && state === 'done'));
  const dot = (i) => {
    if (idle) return { fill: 'var(--neutral-0)', border: 'var(--border-strong)' };
    if (i < at || (i === at && state === 'done')) return { fill: 'var(--status-success-fg)', border: 'var(--status-success-fg)' };
    if (i === at) return { fill: 'var(--status-danger-fg)', border: 'var(--status-danger-fg)' };
    return { fill: 'var(--neutral-0)', border: 'var(--border-strong)' };
  };

  return (
    <div style={Object.assign({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }, style)}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((s, i) => {
          const d = dot(i);
          return (
            <React.Fragment key={s}>
              {i ? <span style={{ width: 12, height: 1.5, background: passed(i - 1) ? 'var(--status-success-fg)' : 'var(--border-default)' }} /> : null}
              <Popover placement="top" width={110} content={<span>{s}</span>}>
                <span style={{
                  width: 8, height: 8, borderRadius: 999, flex: 'none',
                  background: d.fill, borderWidth: 1, borderStyle: 'solid', borderColor: d.border,
                }} />
              </Popover>
            </React.Fragment>
          );
        })}
      </div>
      {showLabel ? <Badge tone={tone}>{label || steps[at]}</Badge> : null}
    </div>
  );
}

/* 环形分数：健康度这类 0–100 的评分。着色按档位，不按连续色阶 —— 读的是档位不是数值。 */
export function ScoreRing({ score = 0, size = 60, thickness = 5, label, hint, style }) {
  const tone = score >= 90 ? 'success' : score >= 75 ? 'warning' : 'neutral';
  const r = (size - thickness) / 2;
  const dash = 2 * Math.PI * r;
  return (
    <div style={Object.assign({ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flex: 'none' }, style)}>
      <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
        <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--neutral-100)" strokeWidth={thickness} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={'var(--status-' + tone + '-fg)'}
            strokeWidth={thickness} strokeLinecap="round" strokeDasharray={(dash * score) / 100 + ' ' + dash} />
        </svg>
        <span style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: Math.round(size * 0.3), fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums',
          letterSpacing: 'var(--ls-tight)',
        }}>{score}</span>
      </div>
      {label || hint ? (
        <div style={{ minWidth: 0 }}>
          {label ? <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{label}</div> : null}
          {hint ? <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', color: 'var(--status-' + tone + '-fg)', marginTop: 3, whiteSpace: 'nowrap' }}>{hint}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

/* 固定轮次的验证进度：n 段短条 + 一句说清楚的文字。
   为什么不是点阵：三个小圆点谁也读不出「第 2 轮 / 共 3 轮」，只能猜。 */
export function RoundsProgress({ done = 0, total = 3, label, style }) {
  const text = label || (done >= total
    ? '验证完成 · ' + total + '/' + total + ' 轮'
    : done > 0
      ? '验证中 · 第 ' + (done + 1) + '/' + total + ' 轮'
      : '验证未开始 · 共 ' + total + ' 轮');
  return (
    <span style={Object.assign({ display: 'inline-flex', gap: 'var(--space-4)', alignItems: 'center', flex: 'none' }, style)}>
      <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{
            width: 14, height: 3, borderRadius: 'var(--radius-pill)',
            background: i < done ? 'var(--neutral-800)' : 'var(--neutral-200)',
          }} />
        ))}
      </span>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{text}</span>
    </span>
  );
}
