(() => {
const { Icon, IconButton, Button, Badge, Card, Divider, StatusDot, AgentTimeline, Popover, Alert, PriorityChip, ExpiryChip, MetaChip, TrackingTable, DecisionActions } = window.HUITOUAIDesignSystem_52606d;

/* 单条决策详情：单栏纵向叠放，决策图谱占满宽度。
   目标折进概要卡，证据与护栏移到图谱下方并排。 */

const THINKING = [
  { stage: 'diagnose', title: '发现异常', detail: '该计划近 3 日消耗持续超预算 15%，触发「转化成本超标预警」策略。', meta: '06-11 13:02', time: '13:02' },
  { stage: 'diagnose', title: '拆解时段表现', detail: '午间 10:00–14:00 转化效率显著高于全天，CPA ¥22.30，账户均值 ¥38.50。', meta: '样本 21 天 · 4,312 次转化', time: '13:06' },
  { stage: 'learn', title: '排除干扰因素', detail: '同期未上新素材、未调整定向，CTR 上升来自流量结构变化而非人为改动。', time: '13:11' },
  { stage: 'strategise', title: '生成候选方案', detail: '比较「上调预算 20%」「上调出价 12%」「拆分时段计划」三种方案，预算方案预期收益最高且风险最低。', meta: '3 个候选 · 择优 1', time: '13:15' },
  { stage: 'strategise', title: '确定执行参数', detail: '日预算 1000 元 → 1200 元（+20%），落在单日 25% 变动上限之内。', time: '13:18' },
];

const CANDIDATES = [
  { name: '上调日预算 20%', gain: '+20% 转化量', risk: '低', picked: true, note: 'CTR 处于高位，扩量边际成本可控' },
  { name: '上调出价 12%', gain: '+9% 转化量', risk: '中', note: '会同时抬高非午间时段成本' },
  { name: '拆分时段计划', gain: '+24% 转化量', risk: '高', note: '需重新度过学习期，短期波动大' },
];

const EVIDENCE = [
  { label: '近 3 日消耗超预算', value: '+15%', bar: 74, tone: 'warning' },
  { label: 'CTR（账户均值 2.4%）', value: '3.6%', bar: 88, tone: 'success' },
  { label: '午间 CPA（均值 ¥38.50）', value: '¥22.30', bar: 62, tone: 'success' },
  { label: '预算触顶时间', value: '15:00', bar: 80, tone: 'warning' },
];

function DecisionDetail({ decision: d, onBack, onAct }) {
  const guards = [
    ['单日预算变动 ≤ 25%', '本次 +20%，符合'],
    ['回滚条件：CPA 恶化 > 15%', '72 小时内持续监控'],
    ['生效时段：全天', '不改动投放时段'],
    ['需人工确认', d.status === '待执行' ? '等待你确认' : '已确认'],
  ];
  return (
    <div style={{ minWidth: 0 }}>
      {/* 返回：吸附在面板上沿，负 margin 通栏，与底部操作条同一套约束 */}
      <div style={{
        position: 'sticky', top: 'calc(var(--space-8) * -1)', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap',
        margin: '0 calc(var(--space-8) * -1) var(--space-7)',
        padding: 'var(--space-5) var(--space-8)',
        background: 'var(--surface-page)', borderBottom: '1px solid var(--border-subtle)',
      }}>
        <Button variant="ghost" size="sm" iconLeft="arrow-left" onClick={onBack}>返回决策列表</Button>
        <Divider orientation="vertical" spacing="0" />
        <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>决策 {d.id.toUpperCase()}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
        {/* 概要（含目标） */}
        <section style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 'var(--gutter-card)', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                <PriorityChip level={d.priority} />
                <span style={{ fontSize: 'var(--fs-20)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap' }}>{d.type}</span>
                {d.change ? <span style={{ fontSize: 'var(--fs-16)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{d.change}</span> : null}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
                {d.plan ? <MetaChip label="计划" value={d.plan} /> : null}
                <MetaChip label="策略" value={d.strategy} />
                <MetaChip label="生成时间" value={d.time} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', minWidth: 0, flexWrap: 'wrap' }}>
              {d.expiry ? <ExpiryChip label={d.expiry} /> : null}
              <StatusDot tone={(d.status === '已拒绝' || d.status === '已失效') ? 'neutral' : d.status === '待执行' ? 'warning' : 'success'}
                label={d.status} pulse={d.status === '验证中'}
                style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap' }} />
            </div>
          </div>
          <Divider spacing="var(--space-6)" />
          <FieldRow label="目标">{d.goal || window.GOAL}</FieldRow>
        </section>

        {/* 决策图谱：占满宽度 */}
        <Card title="决策图谱">
          <DecisionGraph />
        </Card>

        {/* 证据 + 护栏 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', minWidth: 0 }}>
          <Card title="证据" subtitle="21 天数据 · 高置信度">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {EVIDENCE.map((e) => (
                <div key={e.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-5)', fontSize: 'var(--fs-13)', marginBottom: 5 }}>
                    <span style={{ color: 'var(--text-secondary)', minWidth: 0 }}>{e.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', flex: 'none', whiteSpace: 'nowrap' }}>{e.value}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--neutral-100)', borderRadius: 999 }}>
                    <div style={{ width: `${e.bar}%`, height: '100%', background: `var(--status-${e.tone}-fg)`, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title={<window.CardTitle info="执行时必须满足的约束">护栏</window.CardTitle>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {guards.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 'var(--space-5)', fontSize: 'var(--fs-13)' }}>
                  <Icon name="shield-check" size={14} style={{ flex: 'none', marginTop: 3, color: 'var(--text-tertiary)' }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block' }}>{k}</span>
                    <span style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 1 }}>{v}</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 候选方案 */}
        <Card title={<window.CardTitle info="择优保留 1 个，其余记录在案">候选方案对比</window.CardTitle>} padded={false}>
          {CANDIDATES.map((c, i) => (
            <div key={c.name} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap',
              padding: 'var(--space-6) var(--gutter-card)',
              borderBottom: i < CANDIDATES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              background: c.picked ? 'var(--surface-selected)' : 'transparent',
            }}>
              <Icon name={c.picked ? 'circle-check' : 'circle'} size={16}
                style={{ flex: 'none', color: c.picked ? 'var(--text-primary)' : 'var(--neutral-300)' }} />
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <div style={{ fontSize: 'var(--fs-14)', fontWeight: c.picked ? 'var(--fw-medium)' : 'var(--fw-regular)' }}>{c.name}</div>
                <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', marginTop: 2 }}>{c.note}</div>
              </div>
              <span style={{ fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums', color: 'var(--viz-positive)', flex: 'none', whiteSpace: 'nowrap' }}>{c.gain}</span>
              <Badge tone={c.risk === '低' ? 'success' : c.risk === '中' ? 'warning' : 'danger'}>风险{c.risk}</Badge>
            </div>
          ))}
        </Card>

        {/* 推理时间线 */}
        <Card title={<window.CardTitle info="按时间顺序记录的每一步">推理时间线</window.CardTitle>}>
          <AgentTimeline items={THINKING} />
        </Card>

        {/* 验证进度 */}
        <Card title={<window.CardTitle info="三轮采样，任一轮回归超阈值即自动回滚">验证进度</window.CardTitle>} padded={false}>
          <div style={{ padding: 'var(--gutter-card)' }}>
            <TrackingTable metrics={d.metrics} rounds={window.ROUNDS} />
          </div>
        </Card>

      </div>

      {/* 常驻操作条：吸附在可视区底部，滚到哪里都能执行 */}
      <div style={{
        /* bottom 取滚动容器 padding 的负值，吸附到面板下沿而非 padding 盒内侧；
           左右负 margin 让操作条通栏，底部不留负 margin（会与吸附约束冲突）。 */
        position: 'sticky', bottom: 'calc(var(--space-8) * -1)', zIndex: 10,
        margin: 'var(--space-7) calc(var(--space-8) * -1) 0',
        padding: 'var(--space-5) var(--space-8)',
        background: 'rgba(255,255,255,.92)', backdropFilter: 'var(--blur-scrim)',
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap',
      }}>
        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, marginRight: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap' }}>{d.type}{d.change ? ' · ' + d.change : ''}</span>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
            {d.expiry ? d.expiry : d.impact ? '预计 ' + d.impact : '已记录'}
          </span>
        </span>
        <span style={{ flex: 1 }} />
        <DecisionActions status={d.status} onAct={onAct} />
      </div>
    </div>
  );
}

Object.assign(window, { DecisionDetail });
})();
