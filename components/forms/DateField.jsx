import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { AnchoredPanel } from '../overlay/AnchoredPanel.jsx';

/* 日期与时间选择器。触发器是只读的一小条，面板走成熟产品的常规做法：
   单选一张月历、区间左侧预设 + 双月并排、时间用时/分两列。
   数字一律等宽 + tabular-nums —— 切换区间时字宽不跳，同排筛选控件才不会跟着抖。 */

const WEEK = ['一', '二', '三', '四', '五', '六', '日'];
const pad = (n) => String(n).padStart(2, '0');
const iso = (y, m, d) => y + '-' + pad(m + 1) + '-' + pad(d);
const parse = (s) => { const p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return p ? { y: +p[1], m: +p[2] - 1, d: +p[3] } : null; };
const addMonth = (y, m, n) => { const t = y * 12 + m + n; return { y: Math.floor(t / 12), m: ((t % 12) + 12) % 12 }; };
const todayIso = () => { const t = new Date(); return iso(t.getFullYear(), t.getMonth(), t.getDate()); };

/* 周一起头的 6×7 网格；补位的上下月日期照常渲染，只是压到 tertiary —— 空格子会让月末那一行看着断掉。 */
function grid(y, m) {
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7;
  const start = new Date(y, m, 1 - lead);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { iso: iso(d.getFullYear(), d.getMonth(), d.getDate()), day: d.getDate(), out: d.getMonth() !== m };
  });
}

const shell = (extra) => Object.assign({
  display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)',
  height: 'var(--control-h-sm)', padding: '0 var(--space-5)',
  background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)',
  borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
  fontSize: 'var(--fs-13)', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap', cursor: 'pointer', color: 'var(--text-primary)',
  transition: 'var(--transition-control)',
}, extra);

/* 面板一律走 AnchoredPanel（fixed 定位）——列表页的卡片带 overflow: hidden，
   absolute 的日历会被裁在卡片里。 */
const PANEL = { borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' };

function NavBtn({ icon, onClick, label }) {
  return (
    <button type="button" aria-label={label} onClick={onClick}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24,
        border: 0, borderRadius: 'var(--radius-xs)', background: 'transparent',
        color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'var(--transition-control)', flex: 'none',
      }}>
      <Icon name={icon} size={14} />
    </button>
  );
}

/* 一张月历。range 模式下 sel = [start, end]，hover 用来预览未落笔的那一半。 */
function Month({ y, m, nav, sel, hover, onPick, onHover, range }) {
  const cells = grid(y, m);
  const today = todayIso();
  const [a, b] = range ? sel : [sel, sel];
  const edge = range && hover && a && !b ? (hover < a ? [hover, a] : [a, hover]) : [a, b];
  const inRange = (v) => range && edge[0] && edge[1] && v > edge[0] && v < edge[1];
  const isEnd = (v) => v === edge[0] || v === edge[1];

  return (
    <div style={{ padding: 'var(--space-6)', minWidth: 236 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {nav ? <NavBtn icon="chevrons-left" label="上一年" onClick={() => nav(-12)} /> : <span style={{ width: 24 }} />}
        {nav ? <NavBtn icon="chevron-left" label="上一月" onClick={() => nav(-1)} /> : <span style={{ width: 24 }} />}
        <span style={{ flex: 1, textAlign: 'center', fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums' }}>{y} 年 {m + 1} 月</span>
        {nav ? <NavBtn icon="chevron-right" label="下一月" onClick={() => nav(1)} /> : <span style={{ width: 24 }} />}
        {nav ? <NavBtn icon="chevrons-right" label="下一年" onClick={() => nav(12)} /> : <span style={{ width: 24 }} />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 28px)', gap: 2, justifyContent: 'center' }}>
        {WEEK.map((w) => (
          <span key={w} style={{ height: 24, display: 'grid', placeItems: 'center', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{w}</span>
        ))}
        {cells.map((c) => {
          const end = isEnd(c.iso);
          const mid = inRange(c.iso);
          return (
            <button key={c.iso} type="button"
              onClick={() => onPick(c.iso)}
              onMouseEnter={(e) => { if (onHover) onHover(c.iso); if (!end) e.currentTarget.style.background = mid ? 'var(--surface-selected)' : 'var(--surface-hover)'; }}
              onMouseLeave={(e) => { if (!end) e.currentTarget.style.background = mid ? 'var(--neutral-50)' : 'transparent'; }}
              style={{
                height: 28, border: 0, padding: 0, cursor: 'pointer',
                borderRadius: end ? 'var(--radius-xs)' : mid ? 0 : 'var(--radius-xs)',
                background: end ? 'var(--neutral-900)' : mid ? 'var(--neutral-50)' : 'transparent',
                color: end ? 'var(--text-inverse)' : c.out ? 'var(--text-disabled)' : 'var(--text-primary)',
                font: 'inherit', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums',
                fontWeight: end ? 'var(--fw-medium)' : 'var(--fw-regular)',
                boxShadow: !end && c.iso === today ? 'inset 0 0 0 1px var(--border-strong)' : 'none',
                transition: 'var(--transition-control)',
              }}>{c.day}</button>
          );
        })}
      </div>
    </div>
  );
}

function Footer({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-5)',
      padding: 'var(--space-4) var(--space-6)',
      borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
      background: 'var(--neutral-25)',
    }}>{children}</div>
  );
}

function TextBtn({ children, onClick, primary }) {
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={(e) => { e.currentTarget.style.background = primary ? 'var(--neutral-800)' : 'var(--surface-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = primary ? 'var(--neutral-900)' : 'transparent'; }}
      style={{
        height: 26, padding: '0 var(--space-5)', border: 0, borderRadius: 'var(--radius-xs)',
        background: primary ? 'var(--neutral-900)' : 'transparent',
        color: primary ? 'var(--text-inverse)' : 'var(--text-secondary)',
        font: 'inherit', fontSize: 'var(--fs-12)', cursor: 'pointer', transition: 'var(--transition-control)', flex: 'none',
      }}>{children}</button>
  );
}

export function DateField({ value, placeholder = '选择日期', onChange, onClick, disabled, style }) {
  const [open, setOpen] = React.useState(false);
  const trigger = React.useRef(null);
  const p = parse(value) || parse(todayIso());
  const [view, setView] = React.useState({ y: p.y, m: p.m });
  React.useEffect(() => { if (open) { const q = parse(value) || parse(todayIso()); setView({ y: q.y, m: q.m }); } }, [open, value]);

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <span ref={trigger} role="button" tabIndex={0} onClick={() => { if (disabled) return; onClick ? onClick() : setOpen((o) => !o); }} style={shell(style)}>
        <Icon name="calendar" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
        <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-tertiary)', fontFamily: value ? undefined : 'var(--font-sans)' }}>{value || placeholder}</span>
      </span>
      {open ? (
        <AnchoredPanel anchor={trigger} onClose={() => setOpen(false)} style={PANEL}>
            <Month y={view.y} m={view.m} sel={value}
              nav={(n) => setView((v) => addMonth(v.y, v.m, n))}
              onPick={(d) => { setOpen(false); if (onChange) onChange(d); }} />
            <Footer>
              <TextBtn onClick={() => { setOpen(false); if (onChange) onChange(todayIso()); }}>今天</TextBtn>
              <span style={{ flex: 1 }} />
              <TextBtn onClick={() => { setOpen(false); if (onChange) onChange(''); }}>清除</TextBtn>
            </Footer>
        </AnchoredPanel>
      ) : null}
    </span>
  );
}

export function DateRangeField({ start, end, presets, preset, onPreset, onChange, onClick, disabled, style }) {
  const [open, setOpen] = React.useState(false);
  const trigger = React.useRef(null);
  const [draft, setDraft] = React.useState([start, end]);
  const [hover, setHover] = React.useState(null);
  const s = parse(start) || parse(todayIso());
  const [view, setView] = React.useState({ y: s.y, m: s.m });
  React.useEffect(() => { if (open) { setDraft([start, end]); setHover(null); const q = parse(start) || parse(todayIso()); setView({ y: q.y, m: q.m }); } }, [open, start, end]);

  const right = addMonth(view.y, view.m, 1);
  const [a, b] = draft;
  /* 第一下落起点、第二下落终点；反着点就调个头，不要提示「结束早于开始」再让人重来。 */
  const pick = (d) => {
    if (!a || (a && b)) { setDraft([d, null]); return; }
    setDraft(d < a ? [d, a] : [a, d]);
  };

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <span ref={trigger} role="button" tabIndex={0} onClick={() => { if (disabled) return; onClick ? onClick() : setOpen((o) => !o); }} style={shell(style)}>
        <Icon name="calendar" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
        {start}
        <Icon name="chevron-right" size={12} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
        {end}
      </span>
      {open ? (
        <AnchoredPanel anchor={trigger} align="right" onClose={() => setOpen(false)} style={PANEL}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              {presets ? (
                <div style={{
                  width: 116, flex: 'none', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 1,
                  borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
                }}>
                  {presets.map((p) => {
                    const on = p === preset;
                    return (
                      <button key={p} type="button" role="option" aria-selected={on}
                        onClick={() => { setOpen(false); if (onPreset) onPreset(p); }}
                        onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                        onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                        style={{
                          height: 30, padding: '0 var(--space-5)', border: 0, borderRadius: 'var(--radius-xs)',
                          background: on ? 'var(--surface-selected)' : 'transparent',
                          font: 'inherit', fontSize: 'var(--fs-13)', textAlign: 'left', cursor: 'pointer',
                          color: 'var(--text-primary)', fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)',
                          transition: 'var(--transition-control)', flex: 'none',
                        }}>{p}</button>
                    );
                  })}
                </div>
              ) : null}
              <div style={{ display: 'flex' }} onMouseLeave={() => setHover(null)}>
                <Month range y={view.y} m={view.m} sel={draft} hover={hover} onHover={setHover} onPick={pick}
                  nav={(n) => setView((v) => addMonth(v.y, v.m, n))} />
                <span style={{ width: 1, background: 'var(--border-subtle)' }} />
                <Month range y={right.y} m={right.m} sel={draft} hover={hover} onHover={setHover} onPick={pick} />
              </div>
            </div>
            <Footer>
              <span style={{ fontSize: 'var(--fs-12)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: a && b ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>
                {a && b ? a + ' → ' + b : a ? a + ' → 选择结束日期' : '选择开始日期'}
              </span>
              <span style={{ flex: 1 }} />
              <TextBtn onClick={() => setOpen(false)}>取消</TextBtn>
              <TextBtn primary onClick={() => { if (!a || !b) return; setOpen(false); if (onChange) onChange(a, b); if (onPreset) onPreset('自定义区间…'); }}>确定</TextBtn>
            </Footer>
        </AnchoredPanel>
      ) : null}
    </span>
  );
}

/* 时/分两列滚动选择。分钟按 minuteStep 取值 —— 逐分钟列表要滚 60 行，
   而投放时段这类场景从来只落在整点或半点上。 */
function TimeColumn({ items, value, onPick }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const hit = el.querySelector('[data-on="1"]');
    /* offsetTop 是相对最近定位祖先（面板）算的，不是相对滚动容器 —— 直接用会滚不到位。 */
    if (hit) el.scrollTop = hit.offsetTop - el.offsetTop - 4;
  }, [value]);
  return (
    <div ref={ref} style={{ width: 56, maxHeight: 176, overflowY: 'auto', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 1 }}>
      {items.map((v) => {
        const on = v === value;
        return (
          <button key={v} type="button" data-on={on ? '1' : '0'} onClick={() => onPick(v)}
            onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--surface-hover)'; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
            style={{
              height: 26, flex: 'none', border: 0, borderRadius: 'var(--radius-xs)',
              background: on ? 'var(--neutral-900)' : 'transparent', color: on ? 'var(--text-inverse)' : 'var(--text-primary)',
              font: 'inherit', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums',
              cursor: 'pointer', transition: 'var(--transition-control)',
            }}>{v}</button>
        );
      })}
    </div>
  );
}

export function TimeRangeField({ from = '00:00', to = '23:59', minuteStep = 30, onChange, onClick, disabled, style }) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState([from, to]);
  const trigger = React.useRef(null);
  React.useEffect(() => { if (open) setDraft([from, to]); }, [open, from, to]);

  const hours = Array.from({ length: 24 }, (_, i) => pad(i));
  /* 步长外的现有值（默认 23:59 就是）也要进列表，否则那一列什么都不选中，看着像坏了。 */
  const mins = React.useMemo(() => {
    const set = new Set(Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => pad(i * minuteStep)));
    draft.forEach((t) => set.add(t.split(':')[1]));
    return [...set].sort();
  }, [minuteStep, draft]);
  const set = (i, part, v) => setDraft((d) => {
    const [h, m] = d[i].split(':');
    const next = part === 'h' ? v + ':' + m : h + ':' + v;
    return i === 0 ? [next, d[1]] : [d[0], next];
  });

  const Side = ({ i, label }) => (
    <div style={{ flex: 'none' }}>
      <div style={{ padding: 'var(--space-4) var(--space-5) 0', fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <TimeColumn items={hours} value={draft[i].split(':')[0]} onPick={(v) => set(i, 'h', v)} />
        <TimeColumn items={mins} value={draft[i].split(':')[1]} onPick={(v) => set(i, 'm', v)} />
      </div>
    </div>
  );

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <span ref={trigger} role="button" tabIndex={0} onClick={() => { if (disabled) return; onClick ? onClick() : setOpen((o) => !o); }} style={shell(style)}>
        <Icon name="clock" size={14} style={{ color: 'var(--text-tertiary)', flex: 'none' }} />
        {from}<span style={{ color: 'var(--text-tertiary)' }}>–</span>{to}
      </span>
      {open ? (
        <AnchoredPanel anchor={trigger} align="right" onClose={() => setOpen(false)} style={PANEL}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <Side i={0} label="开始" />
              <span style={{ width: 1, background: 'var(--border-subtle)' }} />
              <Side i={1} label="结束" />
            </div>
            <Footer>
              <span style={{ fontSize: 'var(--fs-12)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{draft[0]} – {draft[1]}</span>
              <span style={{ flex: 1 }} />
              <TextBtn onClick={() => setOpen(false)}>取消</TextBtn>
              <TextBtn primary onClick={() => { setOpen(false); if (onChange) onChange(draft[0], draft[1]); }}>确定</TextBtn>
            </Footer>
        </AnchoredPanel>
      ) : null}
    </span>
  );
}
