(() => {
const { Icon, IconButton, Button, Badge, Card, Divider, StatusDot, Input, Select, FilterSelect, Switch, Checkbox, FormField, EmptyState, Popover, Alert, Avatar, Tooltip } = window.HUITOUAIDesignSystem_52606d;

/* 投放设置：这一个账户的默认值与 AI 放开程度。
   组织级的资金天花板与数据口径在工作台的「系统设置」里定，这里只能更保守不能更激进 ——
   成熟的老账户可以放开自动执行，新账户仍逐条审批，这是按账户变的，一刀切会逼全组织降到最保守那档。 */
/* 账户级默认值与 AI 起量规则。
   分组用一条细线分隔而非层层卡片；数值输入统一右侧带单位后缀；
   底部操作条常驻，改动后才可保存。 */

/* 读组织护栏的同一份对象；值是字符串，比较前转数字 */
const ORG = () => { const o = window.HUITOU_ORG_CAPS || {}; return { bidCap: Number(o.bidCap) || 200, stepPct: Number(o.stepPct) || 20, minRun: Number(o.minRun) || 3, dayCap: Number(o.dayCap) || 50000 }; };

const DEFAULTS = {
  mode: '建议后审批',
  autoScope: '仅调价与预算',
  dailyLimit: '10',
  bidCap: '160',
  dayCap: '8000',
  stepPct: '15',
  minRun: '3',
  digest: '每日 09:00',
  targetRoi: '3.0',
  baseRoi: '1.5',
  rate: '0',
  trialBudget: '300',
  rampLine: '300',
  rampTime: '30',
  rampUnit: '分钟',
  autoStop: true,
  autoRevert: true,
};

function DeliverySettings() {
  /* 基线跟着保存走：比对模块常量的话，保存后 dirty 永远落不回去；
     取消也回到基线而不是出厂值，否则会把别的分组里看不见的编辑一起冲掉。 */
  const [base, setBase] = React.useState(DEFAULTS);
  const [v, setV] = React.useState(DEFAULTS);
  const [saved, setSaved] = React.useState(false);
  const [group, setGroup] = React.useState('guardrails');
  const scroller = React.useRef(null);
  const marks = React.useRef({});
  /* 左栏是目录不是分页：点击滚到对应段落，滚动时反过来点亮当前段 */
  const goto = (id) => {
    setGroup(id);
    const el = marks.current[id], sc = scroller.current;
    if (el && sc) sc.scrollTo({ top: Math.max(0, el.offsetTop - 8), behavior: 'smooth' });
  };
  const onScroll = () => {
    const sc = scroller.current;
    if (!sc) return;
    let cur = GROUPS[0].id;
    GROUPS.forEach((g) => { const el = marks.current[g.id]; if (el && el.offsetTop - 16 <= sc.scrollTop) cur = g.id; });
    setGroup(cur);
  };
  const set = (k) => (e) => { setV(Object.assign({}, v, { [k]: e.target ? e.target.value : e })); setSaved(false); };
  const dirty = JSON.stringify(v) !== JSON.stringify(base);
  /* 账户级只能更保守：逐项对照组织护栏，越界的列出来并挡住保存 */
  const breaches = (() => {
    const o = ORG(), out = [];
    if (Number(v.dayCap) > o.dayCap) out.push('单日花费上限不得高于 ¥' + o.dayCap.toLocaleString('zh-CN'));
    if (Number(v.bidCap) > o.bidCap) out.push('出价上限不得高于 ¥' + o.bidCap);
    if (Number(v.stepPct) > o.stepPct) out.push('调价幅度不得高于 ' + o.stepPct + '%');
    if (Number(v.minRun) < o.minRun) out.push('最短观察期不得少于 ' + o.minRun + ' 天');
    return out;
  })();
  const overCap = breaches.length > 0;

  /* 自己撑满面板高度：内容区独立滚动，操作条作为同级兄弟常驻底部 */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0 }}>
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', gap: 'var(--space-6)' }}>
      <GroupRail value={group} onChange={goto} />
      <div ref={scroller} onScroll={onScroll} className="huitou-scroll" style={{ position: 'relative', flex: 1, minHeight: 0, minWidth: 0, overflowY: 'auto' }}>
      {saved ? <Alert tone="success" title="投放设置已保存" onDismiss={() => setSaved(false)} style={{ marginBottom: 'var(--space-6)' }}>
        新值仅对之后新建的计划生效，已在投放的计划不变。
      </Alert> : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 720 }}>
        <Section id="guardrails" marks={marks} first title="投放护栏" subtitle="本账户的上限。组织护栏之内可以更严，不能更松">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <SettingRow label="本账户单日花费上限" hint={'达到即暂停本账户全部计划。组织上限 ¥' + ORG().dayCap.toLocaleString('zh-CN')}>
              <NumField value={v.dayCap} onChange={set('dayCap')} prefix="¥" width={150} />
            </SettingRow>
            <SettingRow label="单条计划出价上限" hint={'超过这个数的出价需人工审批。组织上限 ¥' + ORG().bidCap}>
              <NumField value={v.bidCap} onChange={set('bidCap')} prefix="¥" width={130} />
            </SettingRow>
            <SettingRow label="单次调价幅度上限" hint={'防止一次调到失控。组织上限 ' + ORG().stepPct + '%'}>
              <NumField value={v.stepPct} onChange={set('stepPct')} suffix="%" width={110} />
            </SettingRow>
            <SettingRow label="新建计划最短观察期" hint={'这段时间内不允许关停。组织下限 ' + ORG().minRun + ' 天'} last>
              <NumField value={v.minRun} onChange={set('minRun')} suffix="天" width={110} />
            </SettingRow>
          </div>
          {breaches.length ? (
            <Alert tone="warning" title="超出组织护栏" style={{ marginTop: 'var(--space-5)' }}>
              {breaches.join('；')}。保存前请调整，或让拥有者在工作台的系统设置里放宽。
            </Alert>
          ) : null}
        </Section>

        <Section id="defaults" marks={marks} title="默认值" subtitle="新建广告计划与达人分销时自动带入">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <SettingRow label="默认计划目标 ROI" hint="计划目标 ROI 为空时自动使用该值">
              <NumField value={v.targetRoi} onChange={set('targetRoi')} onClear={() => set('targetRoi')('')} />
            </SettingRow>
            <SettingRow label="默认商品保本 ROI" hint="商品达到该 ROI 即为盈亏平衡，低于该值则亏损">
              <NumField value={v.baseRoi} onChange={set('baseRoi')} onClear={() => set('baseRoi')('')} />
            </SettingRow>
            <SettingRow label="默认达人佣金率" hint="后续可在达人列表中单独修改">
              <NumField value={v.rate} onChange={set('rate')} suffix="%" onClear={() => set('rate')('')} />
            </SettingRow>
            <SettingRow label="新计划试投日预算" hint="新建广告计划时的默认日预算上限" last>
              <NumField value={v.trialBudget} onChange={set('trialBudget')} prefix="¥" suffix="元 / 天" width={150} />
            </SettingRow>
          </div>
        </Section>

        <Section id="ramp" marks={marks} title="起量设置" subtitle="达到起量线前 AI 不介入，让广告自然跑量">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <SettingRow label="起量线" hint="达到起量线之前 AI 不做任何操作">
              <NumField value={v.rampLine} onChange={set('rampLine')} prefix="¥" width={130} />
            </SettingRow>
            <SettingRow label="最大起量时间" hint="超过该时间仍未达到起量线，自动关停广告计划">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <NumField value={v.rampTime} onChange={set('rampTime')} width={92} />
                <FilterSelect value={v.rampUnit} onChange={set('rampUnit')} width={96} options={['分钟', '小时', '天']} />
              </span>
            </SettingRow>
            {/* 这条开关只在起量规则里成立，说明里的「上方」必须和它同屏 */}
            <SettingRow label="超时未起量自动关停" hint="关掉后只发通知，不自动关停" last>
              <Switch checked={v.autoStop} onChange={(next) => { setV(Object.assign({}, v, { autoStop: next })); setSaved(false); }} />
            </SettingRow>
          </div>
        </Section>

        <Section id="ai" marks={marks} title="AI 自动化程度" subtitle="这个账户放开到什么程度。组织护栏之外的一律走审批">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-5)' }}>
            {[
              { v: '只观察', d: '只给分析，不提操作建议' },
              { v: '建议后审批', d: '提方案，逐条批准后执行' },
              { v: '护栏内自动', d: '护栏内直接执行' },
            ].map((m) => {
              const on = v.mode === m.v;
              return (
                <button key={m.v} type="button" onClick={() => { setV(Object.assign({}, v, { mode: m.v })); setSaved(false); }}
                  style={{ textAlign: 'left', padding: 'var(--space-5)', borderWidth: 1, borderStyle: 'solid', borderColor: on ? 'var(--border-strong)' : 'var(--border-subtle)', borderRadius: 'var(--radius-md)', background: on ? 'var(--surface-selected)' : 'var(--surface-card)', font: 'inherit', cursor: 'pointer', minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{m.v}</span>
                    {on ? <Icon name="check" size={13} /> : null}
                  </span>
                  <span style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 4, lineHeight: 'var(--lh-normal)' }}>{m.d}</span>
                </button>
              );
            })}
          </div>

          {v.mode === '护栏内自动' ? (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'var(--space-6)' }}>
              <SettingRow label="可自动执行的操作" hint="超出范围的变更仍需人工审批">
                <FilterSelect value={v.autoScope} onChange={set('autoScope')} width={180} options={['仅调价与预算', '调价、预算与关停', '含新建计划']} />
              </SettingRow>
              <SettingRow label="每日自动执行上限" hint="超出后当天剩余决策转为待审批">
                <NumField value={v.dailyLimit} onChange={set('dailyLimit')} suffix="次" width={110} />
              </SettingRow>
              <SettingRow label="本账户出价上限" hint="在「投放护栏」里设置" last>
                <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>¥{v.bidCap}</span>
              </SettingRow>
            </div>
          ) : null}

          {/* 效果回归回滚跟着 AI 走：它约束的是 AI 的变更，不是起量 */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: v.mode === '护栏内自动' ? 0 : 'var(--space-6)' }}>
            <SettingRow label="效果回归自动回滚" hint="72 小时内 CPA 恶化超过 15% 时撤回本次变更">
              <Switch checked={v.autoRevert} onChange={(next) => { setV(Object.assign({}, v, { autoRevert: next })); setSaved(false); }} />
            </SettingRow>
            <SettingRow label="决策摘要推送时间" hint="汇总这个账户昨日的执行与待办，走用户设置里的飞书机器人" last>
              <FilterSelect value={v.digest} onChange={set('digest')} width={150} options={['每日 09:00', '每日 18:00', '每周一 09:00', '不推送']} />
            </SettingRow>
          </div>
        </Section>
      </div>
      </div>
      </div>

      {/* 常驻操作条：滚动区之外，天然贴底通栏 */}
      <div style={{
        flex: 'none', padding: 'var(--space-5) 0 0',
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', minWidth: 0,
      }}>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
          {overCap ? '有设置超出组织护栏' : dirty ? '有未保存的改动' : '设置已是最新'}
        </span>
        <span style={{ flex: 1 }} />
        <Button size="md" disabled={!dirty} onClick={() => { setV(base); setSaved(false); }}>取消</Button>
        <Button variant="primary" size="md" disabled={!dirty || overCap} onClick={() => { setBase(v); setSaved(true); }}>保存设置</Button>
      </div>
    </div>
  );
}

/* 左侧分组栏：面板窄，五组设置竖排要滚很久 —— 一次只显示一组，选中项左侧一道实线 */
const GROUPS = [
  { id: 'guardrails', label: '投放护栏', icon: 'shield' },
  { id: 'defaults', label: '默认值', icon: 'sliders-horizontal' },
  { id: 'ramp', label: '起量', icon: 'trending-up' },
  { id: 'ai', label: 'AI 与通知', icon: 'sparkles' },
];

function GroupRail({ value, onChange }) {
  return (
    <div style={{ flex: 'none', width: 116, display: 'flex', flexDirection: 'column', gap: 2, paddingRight: 'var(--space-5)', borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'var(--border-subtle)' }}>
      {GROUPS.map((g) => {
        const on = g.id === value;
        return (
          <button key={g.id} type="button" onClick={() => onChange(g.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '7px var(--space-5)', borderWidth: 0, borderRadius: 'var(--radius-md)', background: on ? 'var(--surface-selected)' : 'transparent', font: 'inherit', fontSize: 'var(--fs-13)', fontWeight: on ? 'var(--fw-medium)' : 'var(--fw-regular)', color: on ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'left', cursor: 'pointer', transition: 'var(--transition-control)' }}>
            <Icon name={g.icon} size={14} style={{ flex: 'none', color: on ? 'var(--text-primary)' : 'var(--text-tertiary)' }} />
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* 每块一张卡：卡片自己的边界就是分组的边界，锚点挂在外层 div 上 */
function Section({ id, title, subtitle, marks, first, children }) {
  return (
    <div ref={marks ? (el) => { marks.current[id] = el; } : undefined} style={{ minWidth: 0 }}>
      <Card title={title} subtitle={subtitle}>{children}</Card>
    </div>
  );
}

/* 设置行：左标签＋说明，右控件；行间用细线分隔，不再层层套卡片。
   标签列固定 200px 不伸缩 —— 让它 grow 的话，面板越宽标签与输入框拉得越开，
   而且每行留白还不一样宽，眼睛要横扫一整行才对得上。行本身仍通栏，分隔线不断开。 */
function SettingRow({ label, hint, last, children }) {
  return (
    <div style={{
      padding: 'var(--space-6) 0',
      borderBottomWidth: last ? 0 : 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)',
    }}>
    <div style={{
      display: 'grid', gridTemplateColumns: 'minmax(0, 200px) auto', justifyContent: 'start',
      alignItems: 'center', gap: 'var(--space-6)',
    }}>
      <div style={{ minWidth: 0 }}>
        {/* 说明收进问号，行高恒定 —— 十来行设置各挂一句灰字，页面就只剩灰字了 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>
          <span style={{ minWidth: 0 }}>{label}</span>
          {hint ? (
            <Tooltip label={hint}>
              <span tabIndex={0} role="note" aria-label={hint} style={{ display: 'inline-flex', color: 'var(--text-tertiary)', cursor: 'help', lineHeight: 0 }}>
                <Icon name="circle-help" size={13} />
              </span>
            </Tooltip>
          ) : null}
        </div>
      </div>
      <div style={{ flex: 'none' }}>{children}</div>
    </div>
    </div>
  );
}

/* 数值输入：可带前缀单位、后缀单位与清除按钮 */
function NumField({ value, onChange, prefix, suffix, width = 120, onClear }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)',
      height: 'var(--control-h-md)', padding: '0 var(--space-5)', width: width,
      background: 'var(--surface-card)', borderRadius: 'var(--radius-field)',
      borderWidth: 1, borderStyle: 'solid', borderColor: focus ? 'var(--border-strong)' : 'var(--border-default)',
      transition: 'var(--transition-control)',
    }}>
      {prefix ? <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)', flex: 'none' }}>{prefix}</span> : null}
      <input value={value} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', font: 'inherit',
          fontSize: 'var(--fs-14)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)',
        }} />
      {suffix ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', flex: 'none', whiteSpace: 'nowrap' }}>{suffix}</span> : null}
      {onClear && value ? (
        <button type="button" aria-label="清除" onClick={onClear}
          style={{ display: 'inline-flex', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', color: 'var(--text-tertiary)', flex: 'none' }}>
          <Icon name="x" size={12} />
        </button>
      ) : null}
    </span>
  );
}

Object.assign(window, { DeliverySettings });
})();
