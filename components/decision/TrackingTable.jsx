import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Popover } from '../overlay/Popover.jsx';

function RoundCell({ round }) {
  if (!round) return <span style={{ color: 'var(--text-tertiary)' }}>待验证</span>;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontVariantNumeric: 'tabular-nums' }}>
      {round.v}
      {round.flag ? (
        <Popover placement="top" width={210} content={<span>该轮采样量偏低，数值仅供参考，将在下一轮复核。</span>}>
          <Icon name="circle-help" size={13} style={{ color: 'var(--status-warning-fg)' }} />
        </Popover>
      ) : null}
    </span>
  );
}

/* 决策详情里的完整跟踪表：一行一个指标，一列一轮。卡片上的 MetricRounds 只给最新值，
   这里要能横向比较每一轮 —— 「哪一轮开始掉的」只有摊开才看得出来。
   存疑的轮次挂问号而不是直接隐藏：数据本身要留在表里，可信度另说。 */
export function TrackingTable({ metrics = [], rounds = ['一轮', '二轮', '三轮'], style }) {
  const th = {
    padding: '10px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap',
    fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = { padding: '10px var(--space-6)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' };
  const last = (i) => (i === metrics.length - 1 ? 'none' : td.borderBottom);
  return (
    <div style={Object.assign({ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }, style)}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 430, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
          <thead>
            <tr>
              <th style={th}>指标</th>
              <th style={th}>预期目标</th>
              <th style={th}>起始值</th>
              {rounds.map((r) => <th key={r} style={th}>{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => (
              <tr key={m.name}>
                <td style={Object.assign({}, td, { borderBottom: last(i) })}>{m.name}</td>
                <td style={Object.assign({}, td, { borderBottom: last(i), fontWeight: 'var(--fw-semibold)', fontVariantNumeric: 'tabular-nums' })}>{m.target}</td>
                <td style={Object.assign({}, td, { borderBottom: last(i), fontVariantNumeric: 'tabular-nums' })}>{m.from}</td>
                {m.rounds.map((r, j) => (
                  <td key={j} style={Object.assign({}, td, { borderBottom: last(i) })}><RoundCell round={r} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
