import React from 'react';
import { Icon } from '../core/Icon.jsx';

const STAGE = {
  diagnose: { icon: 'stethoscope', tone: 'info' },
  strategise: { icon: 'lightbulb', tone: 'ai' },
  execute: { icon: 'play', tone: 'success' },
  learn: { icon: 'brain', tone: 'neutral' },
  alert: { icon: 'triangle-alert', tone: 'warning' },
};

export function AgentTimeline({ items = [], style, ...rest }) {
  return (
    <ol {...rest} style={{ listStyle: 'none', margin: 0, padding: 0, ...style }}>
      {items.map((it, i) => {
        const s = STAGE[it.stage] || STAGE.learn;
        const last = i === items.length - 1;
        return (
          <li key={i} style={{ display: 'flex', gap: 'var(--space-5)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26,
                borderRadius: 'var(--radius-pill)', background: `var(--status-${s.tone}-bg)`,
                border: `1px solid var(--status-${s.tone}-border)`, color: `var(--status-${s.tone}-fg)`,
              }}>
                <Icon name={s.icon} size={13} />
              </span>
              {!last ? <span style={{ flex: 1, width: 1, background: 'var(--border-subtle)', margin: '4px 0' }} /> : null}
            </div>
            <div style={{ paddingBottom: last ? 0 : 'var(--space-7)', minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
                <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{it.title}</span>
                <span style={{ fontSize: 'var(--fs-11)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{it.time}</span>
              </div>
              {it.detail ? <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: 2 }}>{it.detail}</div> : null}
              {it.meta ? <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{it.meta}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
