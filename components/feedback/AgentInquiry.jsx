import React from 'react';
import { Badge } from '../core/Badge.jsx';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';
import { Input } from '../forms/Input.jsx';
import { StatusDot } from '../data/StatusDot.jsx';

/* 询问卡：智能体缺少条件时向你要参数。
   它不是一段灰字提示，而是一张可作答的卡 —— 选项即答案，选完直接重新派单。
   未选完主操作保持禁用；提交后卡片折成一张回执，选择结果留在原位可查。
   只在对话流里出现，宽度随气泡走，不要塞进 Card（外框会重）。 */

function Chip({ label, selected, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        height: 28, padding: '0 var(--space-6)', borderWidth: 1, borderStyle: 'solid',
        borderColor: selected ? 'var(--border-focus)' : hover ? 'var(--border-default)' : 'var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        background: selected ? 'var(--surface-selected)' : hover ? 'var(--surface-hover)' : 'var(--surface-card)',
        font: 'inherit', fontSize: 'var(--fs-13)', fontWeight: selected ? 'var(--fw-medium)' : 'var(--fw-regular)',
        color: 'var(--text-primary)', cursor: 'pointer', transition: 'var(--transition-control)', whiteSpace: 'nowrap',
      }}>{label}</button>
  );
}

const Label = ({ children }) => (
  <div style={{ fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>{children}</div>
);

export function AgentInquiry({
  question, questions = [], defaults = [],
  noteLabel = '补充说明（可选）', notePlaceholder,
  dispatchedAt, eta, onSubmit, style,
}) {
  const [answers, setAnswers] = React.useState({});
  const [note, setNote] = React.useState('');
  const [sent, setSent] = React.useState(null);
  const complete = questions.every((q) => answers[q.key]);
  const pick = (key, v) => setAnswers((a) => Object.assign({}, a, { [key]: v }));
  const submit = (vals) => { setSent(questions.map((q) => vals[q.key])); if (onSubmit) onSubmit(vals, note); };

  return (
    <div style={Object.assign({
      background: 'var(--neutral-25)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
      borderRadius: 'var(--radius-card)', overflow: 'hidden',
    }, style)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', padding: 'var(--gutter-card)', paddingBottom: 'var(--space-6)' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flex: 'none',
          borderRadius: 'var(--radius-sm)', background: 'var(--status-ai-bg)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--status-ai-border)', color: 'var(--status-ai-fg)',
        }}>
          <Icon name="circle-help" size={14} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{question}</span>
            {sent ? <Badge tone="ai" dot>已按此派单</Badge> : <Badge tone="warning" dot>待你选择</Badge>}
          </div>
          {sent ? null : (
            <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: 4 }}>
              选完后按你的范围重新派单；不选则按默认范围 {defaults.map((d) => d.label).join(' · ')}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 var(--gutter-card) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {questions.map((q, qi) => (
          <div key={q.key}>
            <Label>{q.label}</Label>
            {sent
              ? <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{sent[qi]}</div>
              : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  {q.options.map((o) => <Chip key={o} label={o} selected={answers[q.key] === o} onClick={() => pick(q.key, o)} />)}
                </div>}
          </div>
        ))}
        {sent
          ? (note ? <div><Label>{noteLabel}</Label><div style={{ fontSize: 'var(--fs-14)' }}>{note}</div></div> : null)
          : <div><Label>{noteLabel}</Label><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={notePlaceholder} /></div>}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap',
        padding: 'var(--space-5) var(--gutter-card)',
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
      }}>
        {sent
          ? <>
              <StatusDot tone="success" label={'已重新派单 · ' + dispatchedAt} style={{ fontSize: 'var(--fs-13)' }} />
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{eta}</span>
              <div style={{ flex: 1 }} />
              <Button variant="ghost" size="sm" onClick={() => setSent(null)}>改一下范围</Button>
            </>
          : <>
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>等你选完后再派单 · 期间不生成任何数据或结论</span>
              <div style={{ flex: 1 }} />
              <Button variant="ghost" size="sm" onClick={() => { const d = {}; defaults.forEach((x) => { d[x.key] = x.label; }); setAnswers(d); submit(d); }}>用默认范围</Button>
              <Button variant="primary" size="sm" iconLeft="send" disabled={!complete} onClick={() => submit(answers)}>按此重新派单</Button>
            </>}
      </div>
    </div>
  );
}
