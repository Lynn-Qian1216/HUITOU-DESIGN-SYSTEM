import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { StatusDot } from '../data/StatusDot.jsx';
import { RoundsProgress } from '../data/ProgressTrack.jsx';
import { PriorityChip, ExpiryChip, ResultNote } from './PriorityChip.jsx';
import { MetricRounds } from './MetricRounds.jsx';

const STATUS_TONE = {
  待执行: 'warning', 验证中: 'success', 失败: 'danger',
  已拒绝: 'neutral', 已执行: 'success', 已失效: 'neutral',
};

/* 每种状态的出口是设计的一部分，不是数据。失败的主操作是「换个改法」而不是原样重跑
   —— 同样的参数还会失败一次；验证中也不是什么都不能做，数不对时人得能立刻停手。 */
export function DecisionActions({ status = '待执行', onAct }) {
  const act = (s) => () => onAct && onAct(s);
  if (status === '待执行') {
    return (
      <>
        <Button variant="primary" size="md" onClick={act('验证中')}>执行</Button>
        <Button variant="secondary" size="md" onClick={act('已拒绝')}>拒绝</Button>
      </>
    );
  }
  if (status === '验证中') {
    return (
      <>
        <Button size="md" disabled>验证中…</Button>
        <Button variant="secondary" size="md" onClick={act('待执行')}>立即回滚</Button>
      </>
    );
  }
  if (status === '失败') {
    return (
      <>
        <Button variant="secondary" size="md" onClick={act('待执行')}>调整后重试</Button>
        <Button variant="ghost" size="md" onClick={act('已拒绝')}>不再尝试</Button>
      </>
    );
  }
  if (status === '已拒绝') return <Button variant="secondary" size="md" onClick={act('待执行')}>恢复执行</Button>;
  if (status === '已失效') return <Button variant="secondary" size="md" disabled>已失效</Button>;
  return <StatusDot tone="success" label="已执行 · 监控完成" style={{ fontSize: 'var(--fs-13)' }} />;
}

/* 失败是终态，措辞必须写死 —— 让 RoundsProgress 按轮数推的话，它会说「验证中 · 第 3/3 轮」，
   和卡片上「验证提前终止」自相矛盾。 */
function RoundProgress({ done, total, failed, outcome }) {
  let label;
  if (failed) label = done < total ? '验证终止 · ' + done + '/' + total + ' 轮' : '验证未达标 · ' + total + '/' + total + ' 轮';
  else if (outcome === 'success') label = '验证达标 · ' + total + '/' + total + ' 轮';
  else if (outcome === 'revert') label = '验证未达标 · ' + total + '/' + total + ' 轮 · 已回滚';
  return <RoundsProgress done={done} total={total} label={label} />;
}

function FieldRow({ label, clamp, lines = 1, children }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--fs-13)', lineHeight: 'var(--lh-normal)' }}>
      <span style={{ flex: 'none', width: 30, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={Object.assign({ flex: 1, minWidth: 0, color: 'var(--text-primary)' },
        clamp ? { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : null)}>{children}</span>
    </div>
  );
}

/* 单条 AI 决策卡：级别 · 类型 · 改动数值在最上（决策本身），来源与时间在中间（安静的元信息），
   目标或指标进度在下（随状态换内容），出口在底。整卡可点进详情。 */
export function DecisionCard({ decision: d, rounds = 3, onOpen, onAct, style }) {
  const [hover, setHover] = React.useState(false);
  if (!d) return null;
  const tone = STATUS_TONE[d.status] || 'warning';
  const metrics = d.metrics || [];
  const done = metrics.length ? metrics[0].rounds.filter(Boolean).length : 0;
  const urgent = d.status === '待执行';
  const failed = d.status === '失败';
  const declined = d.status === '已拒绝';
  const executed = d.status === '已执行';
  const expired = d.status === '已失效';
  /* 终态一律不能再改数值；跑过轮次的（验证中／失败／已执行）看指标进度，其余看目标。 */
  const terminal = failed || declined || executed || expired;
  const ran = d.status === '验证中' || failed || executed;
  const achieved = executed && d.result === 'success';
  const missed = failed || (executed && d.result === 'revert');
  const impactLabel = achieved ? '实际影响' : failed ? '验证结果' : missed || declined || expired ? '原预计影响' : '预计影响';
  return (
    <section
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={Object.assign({
        background: 'var(--surface-card)', borderRadius: 'var(--radius-card)', overflow: 'hidden',
        borderWidth: 1, borderStyle: 'solid',
        /* 状态用描边区分轻重：待执行要被处理，描边最实；失败要被看见，走 danger；
           已拒绝已经出局，最淡。不用左侧色条 —— 一列卡片挂五条彩带只剩噪音。 */
        borderColor: hover ? 'var(--border-strong)' : failed ? 'var(--status-danger-border)' : urgent ? 'var(--border-default)' : 'var(--border-subtle)',
        /* 悬停微微抬起：整卡是可点的，得让人看出来。幅度必须小 ——
           队列里卡片紧挨着，放大多了会把相邻卡片顶得晃。 */
        transform: hover ? 'scale(1.006)' : 'none',
        boxShadow: hover ? 'var(--shadow-md)' : 'none',
        transition: 'transform 140ms ease-out, box-shadow 140ms ease-out, border-color 140ms ease-out',
        willChange: 'transform',
      }, style)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)', padding: 'var(--gutter-card) var(--gutter-card) var(--space-5)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <PriorityChip level={d.priority} />
            <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap' }}>{d.type}</span>
            <StatusDot tone={tone} label={d.status} pulse={d.status === '验证中'}
              style={{ color: 'var(--status-' + tone + '-fg)', fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap' }} />
            {d.expiry && urgent ? <ExpiryChip label={d.expiry} /> : null}
          </div>
          {d.change ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 'var(--fs-20)', fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--ls-tight)', fontVariantNumeric: 'tabular-nums',
                /* 被拒和过期的改动压根没发生，压成次级色并划掉 —— 它们是记录，不是待办。
                   回滚过的发生过又退回，不划掉，靠结果一行说明。 */
                color: declined || expired ? 'var(--text-tertiary)' : 'var(--text-primary)',
                textDecoration: declined || expired ? 'line-through' : 'none',
              }}>{d.change}</span>
              {d.delta ? <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)' }}>{d.delta}</span> : null}
              {d.editable && !terminal ? <IconButton icon="pencil" label="修改数值" size="sm" /> : null}
            </div>
          ) : null}
        </div>
        {d.impact ? (
          <div style={{ textAlign: 'right', flex: 'none' }}>
            <div style={{ fontSize: 'var(--fs-11)', letterSpacing: 'var(--ls-caps)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{impactLabel}</div>
            <div style={{
              fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums', marginTop: 2, whiteSpace: 'nowrap',
              /* 只有真正拿到结果的才是绿的。回滚、过期、被拒都属于「这笔收益没发生」，
                 显示成绿色等于谎报战果。 */
              color: missed ? 'var(--status-danger-fg)' : declined || expired ? 'var(--text-tertiary)' : 'var(--viz-positive)',
            }}>{d.impact}</div>
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0 var(--gutter-card) var(--space-6)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
        <Icon name="git-branch" size={12} />
        <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{d.strategy}</span>
        {d.plan ? <><span>·</span><span style={{ minWidth: 0, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.plan}</span></> : null}
        <span>·</span>
        <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{d.time}</span>
        {d.expiry && !urgent ? <><span>·</span><span style={{ whiteSpace: 'nowrap' }}>{d.expiry}</span></> : null}
      </div>

      {/* 验证一旦开始，「当初想干什么」就不如「现在到了什么数」重要。 */}
      <div style={{ padding: '0 var(--gutter-card) var(--space-6)' }}>
        {ran
          ? <MetricRounds metrics={metrics} failNote={failed ? d.failNote : null} />
          : <FieldRow label="目标" clamp lines={2}>{d.goal}</FieldRow>}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)',
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: failed ? 'var(--status-danger-border)' : 'var(--border-subtle)',
        background: failed ? 'var(--status-danger-bg)' : 'var(--neutral-25)', flexWrap: 'wrap',
      }}>
        <DecisionActions status={d.status} onAct={onAct} />
        {ran ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', marginLeft: 'var(--space-3)' }}>
            <RoundProgress done={done} total={rounds} failed={failed} outcome={executed ? d.result : null} />
          </span>
        ) : null}
        <div style={{ flex: 1 }} />
        {d.resultText ? <ResultNote result={d.result} text={d.resultText} /> : null}
        {onOpen ? <Button variant="ghost" size="sm" iconLeft="eye" onClick={onOpen}>查看详情</Button> : null}
      </div>
    </section>
  );
}
