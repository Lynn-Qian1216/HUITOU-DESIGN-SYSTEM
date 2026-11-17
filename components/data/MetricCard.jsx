import React from 'react';
import { StatDelta } from './StatDelta.jsx';
import { Sparkline } from './Sparkline.jsx';

export function MetricCard({ label, value, delta, goodWhen = 'up', basis, series, target, style, ...rest }) {
  return (
    <div {...rest} style={{
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-card)', padding: 'var(--gutter-card)', minWidth: 0, ...style,
    }}>
      <div style={{ fontSize: 'var(--type-overline-size)', fontWeight: 'var(--type-overline-weight)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-6)', marginTop: 'var(--space-4)', minWidth: 0 }}>
        <div style={{ fontSize: 'var(--type-metric-size)', fontWeight: 'var(--type-metric-weight)', letterSpacing: 'var(--ls-tight)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, minWidth: 0, whiteSpace: 'nowrap' }}>{value}</div>
        {series ? <Sparkline data={series} width={64} height={24} area /> : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-5)', marginTop: 'var(--space-4)' }}>
        {delta != null ? <StatDelta value={delta} goodWhen={goodWhen} basis={basis} /> : null}
        {target ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>目标 {target}</span> : null}
      </div>
    </div>
  );
}
