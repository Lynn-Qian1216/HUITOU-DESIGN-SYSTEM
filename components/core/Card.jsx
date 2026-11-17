import React from 'react';
import { InfoHint } from '../overlay/InfoHint.jsx';

export function Card({ title, subtitle, info, actions, footer, padded = true, interactive, selected, overflow = 'hidden', children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <section
      onMouseEnter={() => interactive && setHover(true)} onMouseLeave={() => setHover(false)}
      {...rest}
      style={{
        background: 'var(--surface-card)',
        border: `1px solid var(--border-${selected ? 'focus' : hover ? 'default' : 'subtle'})`,
        borderRadius: 'var(--radius-card)', boxShadow: hover ? 'var(--shadow-sm)' : 'var(--shadow-none)',
        transition: 'var(--transition-control)', cursor: interactive ? 'pointer' : undefined,
        overflow: overflow, ...style,
      }}
    >
      {(title || actions) ? (
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)', padding: 'var(--gutter-card) var(--gutter-card) 0' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* subtitle 留给随数据变的那一行（周期、时效、计数）；解释性的说明走 info，
                收进标题旁的问号里，卡片头部就只有一行。 */}
            {title ? (
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--type-h4-size)', fontWeight: 'var(--type-h4-weight)', letterSpacing: 'var(--ls-normal)' }}>
                {title}{info ? <InfoHint label={info} /> : null}
              </h3>
            ) : null}
            {subtitle ? <p style={{ margin: '4px 0 0', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>{subtitle}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div style={{ padding: padded ? 'var(--gutter-card)' : 0 }}>{children}</div>
      {footer ? <footer style={{ padding: '12px var(--gutter-card)', borderTop: '1px solid var(--border-subtle)', background: 'var(--neutral-25)', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>{footer}</footer> : null}
    </section>
  );
}
