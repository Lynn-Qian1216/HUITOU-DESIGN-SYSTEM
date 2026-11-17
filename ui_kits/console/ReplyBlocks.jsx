(() => {
const { Card, Button, Badge, Icon, StatDelta, Sparkline, StatusDot, DataTable, Divider, Popover, AgentInquiry } = window.HUITOUAIDesignSystem_52606d;

/* 智能体回复由若干区块组成：文本、指标条、图表、决策卡、表格、脚注。
   每个区块都是白底 + 1px 细描边 + 10px 圆角，与产品其他表面保持一致。 */
function ReplyBody({ blocks, onAct }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {blocks.map((b, i) => {
        if (b.type === 'text') return <p key={i} style={{ margin: 0, fontSize: 'var(--fs-14)', lineHeight: 'var(--lh-relaxed)' }}>{b.body}</p>;
        if (b.type === 'metrics') return <MetricStrip key={i} items={b.items} />;
        if (b.type === 'chart') return <ChartCard key={i} {...b} />;
        if (b.type === 'decision') return <DecisionCard key={i} {...b} onAct={onAct} />;
        if (b.type === 'table') return <TableCard key={i} {...b} />;
        if (b.type === 'footnote') return <Footnote key={i} {...b} onAct={onAct} />;
        if (b.type === 'section') return <Section key={i} {...b} />;
        if (b.type === 'inquiry') return <AgentInquiry key={i} {...b} />;
        if (b.type === 'matrix-form') return <window.MatrixFormBlock key={i} kind={b.kind} onAct={onAct} />;
        if (b.type === 'matrix-proposals') return <window.MatrixProposalsBlock key={i} onAct={onAct} />;
        if (b.type === 'matrix-materials') return <window.MatrixMaterialBlock key={i} onAct={onAct} />;
        if (b.type === 'matrix-creatives') return <window.MatrixCreativesBlock key={i} onAct={onAct} />;
        if (b.type === 'matrix-plans') return <window.MatrixPlansBlock key={i} onAct={onAct} />;
        return null;
      })}
    </div>
  );
}

/* 带小标题的说明段：标题 + 若干行，行可缩进表示隶属关系 */
function Section({ title, lines = [], indent }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-semibold)' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
        {lines.map((l, i) => (
          <p key={i} style={{ margin: 0, paddingLeft: indent ? 'var(--space-6)' : 0, fontSize: 'var(--fs-14)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-secondary)', textWrap: 'pretty' }}>{l}</p>
        ))}
      </div>
    </div>
  );
}

/* 询问卡已提升为设计系统组件（components/feedback/AgentInquiry.jsx） */

function MetricStrip({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 'var(--space-4)' }}>
      {items.map((m) => (
        <div key={m.label} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 'var(--space-6)', minWidth: 0 }}>
          <div style={{ fontSize: 'var(--fs-11)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)' }}>{m.label}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)', marginTop: 'var(--space-4)', minWidth: 0 }}>
            <span style={{ fontSize: 'var(--fs-24)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{m.value}</span>
            {m.series ? <Sparkline data={m.series} width={54} height={20} area /> : null}
          </div>
          {m.delta != null ? <div style={{ marginTop: 'var(--space-3)' }}><StatDelta value={m.delta} goodWhen={m.goodWhen} basis={m.basis} /></div> : null}
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, note, days, bars, line, legend }) {
  const max = Math.max(...bars) * 1.15;
  const lo = Math.min(...line), hi = Math.max(...line), span = (hi - lo) || 1;
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 'var(--gutter-card)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{title}</span>
        {note ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{note}</span> : null}
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-7)', margin: 'var(--space-5) 0 var(--space-6)' }}>
        {legend.map((l) => (
          <span key={l.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
            <span style={{ width: 8, height: l.line ? 2 : 8, borderRadius: l.line ? 0 : 2, background: l.color }} />
            {l.label}
            <span style={{ fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{l.value}</span>
          </span>
        ))}
      </div>
      <div style={{ position: 'relative', height: 132, display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
        {[0, 1, 2, 3].map((i) => <span key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: 20 + i * 36, height: 1, background: 'var(--viz-grid)' }} />)}
        {bars.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
            <div style={{ width: '100%', maxWidth: 30, height: (v / max) * 106, background: 'var(--viz-1)', borderRadius: '3px 3px 0 0' }} />
            <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{days[i]}</span>
          </div>
        ))}
        {/* 折线落在各柱中心；显式给出尺寸，避免 SVG 按 viewBox 比例自撑高溢出卡片 */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 6, left: 0, width: '100%', height: 'calc(100% - 32px)', pointerEvents: 'none' }}>
          <polyline fill="none" stroke="var(--viz-3)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"
            points={line.map((v, i) => `${((i + 0.5) / line.length) * 100},${100 - ((v - lo) / span) * 88 - 6}`).join(' ')} />
        </svg>
      </div>
    </div>
  );
}

function DecisionCard({ title, detail, impact, confidence, evidence, tags = [], onAct }) {
  const [state, setState] = React.useState('open');
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 'var(--space-5)', padding: 'var(--gutter-card)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flex: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--status-ai-bg)', border: '1px solid var(--status-ai-border)', color: 'var(--status-ai-fg)' }}>
          <Icon name="sparkles" size={14} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{title}</span>
            <Badge tone="ai">待执行决策</Badge>
          </div>
          <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 'var(--lh-relaxed)' }}>{detail}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
            {tags.map((t) => <Badge key={t} tone="neutral">{t}</Badge>)}
          </div>
        </div>
        <div style={{ textAlign: 'right', flex: 'none' }}>
          <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)' }}>预计影响</div>
          <div style={{ fontSize: 'var(--fs-18)', fontWeight: 'var(--fw-medium)', color: 'var(--viz-positive)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{impact}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5) var(--gutter-card)', borderTop: '1px solid var(--border-subtle)', background: 'var(--neutral-25)' }}>
        <Popover placement="top" width={240} content={<span>{evidence}</span>}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>
            <Icon name="info" size={13} />{confidence}
          </span>
        </Popover>
        <div style={{ flex: 1 }} />
        {state === 'done'
          ? <StatusDot tone="success" label="已执行 · 监控中" style={{ fontSize: 'var(--fs-13)' }} />
          : <>
              <Button variant="ghost" size="sm" onClick={() => setState('muted')}>忽略</Button>
              <Button variant="secondary" size="sm">查看详情</Button>
              <Button variant="primary" size="sm" iconLeft="play" onClick={() => { setState('done'); onAct && onAct(); }}>立即执行</Button>
            </>}
      </div>
    </div>
  );
}

function TableCard({ title, columns, rows }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
      {title ? <div style={{ padding: 'var(--space-6) var(--gutter-card) 0', fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{title}</div> : null}
      <DataTable dense columns={columns} rows={rows} />
    </div>
  );
}

function Footnote({ items = [], actions = [], onAct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{items.join(' · ')}</span>
      <div style={{ flex: 1 }} />
      {actions.map((a) => <Button key={a.label} variant="ghost" size="sm" iconLeft={a.icon} onClick={a.act && onAct ? () => onAct(a.act) : undefined}>{a.label}</Button>)}
    </div>
  );
}

Object.assign(window, { ReplyBody });
})();
