import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* 达标与否由目标本身推导，不靠数据里手写的标记 —— 标记漏写一次，
   界面就会把没达标的数说成达标。目标形如「≥500」「≤¥42」「≥3.2%」，
   取比较号与数值，值里的 ¥ % 千分位一律剥掉。 */
const numOf = (v) => {
  const m = String(v).replace(/[,¥$\s]/g, '').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

export function meetsTarget(target, v) {
  const t = numOf(target); const x = numOf(v);
  if (t == null || x == null) return null;
  return /[≤]|<=/.test(String(target)) ? x <= t : x >= t;
}

/* 验证中／失败时的指标进度：每个指标一行 —— 名称、起点 → 最新值、目标、轮次圆点。
   最新值达标压绿、未达标压红。光给一串数字的话，人得自己拿目标去比。 */
export function MetricRounds({ metrics = [], failNote, style }) {
  return (
    <div style={Object.assign({ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }, style)}>
      {failNote ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--fs-13)', color: 'var(--status-danger-fg)' }}>
          <Icon name="triangle-alert" size={13} style={{ flex: 'none' }} />
          <span>{failNote}</span>
        </div>
      ) : null}
      {metrics.map((m) => {
        const hit = m.rounds.filter(Boolean);
        const last = hit[hit.length - 1];
        const bad = last ? meetsTarget(m.target, last.v) === false : false;
        return (
          <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', fontSize: 'var(--fs-13)', flexWrap: 'wrap' }}>
            <span style={{ flex: 'none', minWidth: 84, color: 'var(--text-secondary)' }}>{m.name}</span>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-3)', fontVariantNumeric: 'tabular-nums', flex: 'none' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>{m.from}</span>
              <Icon name="arrow-right" size={11} style={{ color: 'var(--text-tertiary)' }} />
              <span style={{ fontWeight: 'var(--fw-medium)', color: last ? (bad ? 'var(--status-danger-fg)' : 'var(--viz-positive)') : 'var(--text-tertiary)' }}>{last ? last.v : '—'}</span>
            </span>
            <span style={{ flex: 'none', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>目标 {m.target}</span>
            <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center', flex: 'none' }}>
              {m.rounds.map((r, i) => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: 'var(--radius-pill)', flex: 'none',
                  background: !r ? 'var(--neutral-200)' : meetsTarget(m.target, r.v) === false ? 'var(--status-danger-fg)' : 'var(--viz-positive)',
                }} />
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
