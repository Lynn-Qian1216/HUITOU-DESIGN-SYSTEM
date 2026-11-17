(() => {
const { AgentLoading, RunningCat, Icon } = window.HUITOUAIDesignSystem_52606d;

/* 回复占位：逐帧奔跑猫 + 状态文案 + 与真实回复同形的方块骨架。
   动画与骨架都由设计系统的 AgentLoading 承担，这里只负责把高度变化回调给会话区，
   让它跟着滚到底。已出内容之后的追加占位传 skeleton={false}，不重复骨架。
   label 由会话区按当前正在生成的那一块传进来，所以文案跟着实际进度走，
   而不是三句话空转。 */

function ReplyLoading({ onSettled, skeleton = true, label }) {
  const box = React.useRef(null);

  React.useEffect(() => {
    const el = box.current;
    if (!el || !onSettled) return;
    onSettled();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => onSettled());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} style={{ animation: 'huitou-rise var(--duration-normal) var(--ease-standard) both' }}>
      <AgentLoading label={label || '正在读取账户数据'} skeleton={skeleton} />
    </div>
  );
}

/* 每块内容对应一个「谁在做什么」。生成时用作猫旁边的文案，结束后作为工作明细。
   之所以按块型给固定说法：这些块本来就是不同工种的产物 —— 指标与图表来自取数，
   决策来自护栏校验，脚注来自出处标注。 */
const STEPS = {
  text:     { who: '巡检员',   what: '整理结论与说明' },
  section:  { who: '巡检员',   what: '归纳当前情况' },
  metrics:  { who: '报表管家', what: '读取投放数据' },
  chart:    { who: '报表管家', what: '汇总近 7 天趋势' },
  table:    { who: '报表管家', what: '拆分明细并排序' },
  decision: { who: '优化专家', what: '校验护栏并生成方案' },
  inquiry:  { who: '总控',     what: '整理待你确认的问题' },
  footnote: { who: '巡检员',   what: '标注数据来源与时效' },
};
const stepOf = (b) => STEPS[b && b.type] || { who: '总控', what: '处理这一步' };

const fmt = (ms) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return s < 60 ? s + ' 秒' : Math.floor(s / 60) + ' 分 ' + String(s % 60).padStart(2, '0') + ' 秒';
};

/* 回复顶部的一行状态。生成中是计时，结束后是用时 + 可展开的工作明细 ——
   过程本身要留得住：回头看时想知道这个结论是从哪几步来的。 */
function ReplyStatus({ startedAt, steps, elapsed, running }) {
  const [now, setNow] = React.useState(Date.now());
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [running]);

  const ms = elapsed != null ? elapsed : now - startedAt;
  const list = steps || [];

  return (
    <div style={{ marginBottom: 'var(--space-5)' }}>
      <button type="button" disabled={running} onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', height: 24,
          padding: 0, border: 0, background: 'none', font: 'inherit', fontSize: 'var(--fs-12)',
          color: 'var(--text-tertiary)', cursor: running ? 'default' : 'pointer',
        }}>
        {running ? (
          <span style={{
            width: 6, height: 6, flex: 'none', borderRadius: '50%', background: 'var(--blue-600)',
            animation: 'huitou-pulse 1.2s var(--ease-standard) infinite',
          }} />
        ) : <Icon name="check" size={12} style={{ color: 'var(--text-tertiary)' }} />}
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{running ? '正在回复 ' + fmt(ms) : '用时 ' + fmt(ms)}</span>
        {!running && list.length ? (
          <Icon name="chevron-right" size={12} style={{
            color: 'var(--text-tertiary)',
            transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--duration-fast, .12s) var(--ease-standard)',
          }} />
        ) : null}
      </button>
      {open && !running && list.length ? (
        <div style={{
          marginTop: 'var(--space-4)', paddingLeft: 'var(--space-5)',
          borderLeftWidth: 1, borderLeftStyle: 'solid', borderLeftColor: 'var(--border-subtle)',
          display: 'flex', flexDirection: 'column', gap: 3,
          animation: 'huitou-rise var(--duration-fast, .12s) var(--ease-standard) both',
        }}>
          {list.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', fontSize: 'var(--fs-12)', minWidth: 0 }}>
              <span style={{ flex: 'none', color: 'var(--text-secondary)' }}>{s.who}</span>
              <span style={{ flex: '1 1 auto', minWidth: 0, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.what}</span>
              <span style={{ flex: 'none', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(s.ms)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

Object.assign(window, { ReplyLoading, ReplyStatus, RunningCat, HUITOU_STEP_OF: stepOf });
})();
