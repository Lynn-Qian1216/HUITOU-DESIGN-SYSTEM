(() => {
const { Icon, Button, Badge, StatusDot, Alert } = window.HUITOUAIDesignSystem_52606d;

/* 接入账户只有一步：挑平台，点「授权接入」跳到该平台自己的授权流程。
   慧投这边没有第二步 —— 扫码、管理员确认都发生在对方站内，回来时账户已经在列表里了。 */

const PLATFORM_OPTIONS = [
  { id: 'tencent', label: '腾讯营销', state: 'ready',
    desc: '微信生态投放。覆盖朋友圈、视频号、小程序与搜一搜品专。',
    scope: ['读取账户与计划数据', '创建与修改广告计划', '调整预算与出价'] },
  { id: 'qianchuan', label: '巨量千川', state: 'ready',
    desc: '抖音电商投放。支持商品全域推广、达人分销与直播间引流。',
    scope: ['读取账户与计划数据', '创建与修改广告计划', '调整预算与出价'] },
  { id: 'juliang', label: '巨量营销', state: 'wip',
    desc: '抖音、今日头条通投。接入开发中，开放后这里会直接可用。', scope: [] },
  { id: 'bilibili', label: 'Bilibili', state: 'soon', desc: '花火与效果广告。', scope: [] },
  { id: 'xiaohongshu', label: '小红书', state: 'soon', desc: '聚光平台投放。', scope: [] },
];

const STATE_BADGE = { wip: '接入中', soon: '敬请期待' };

function ConnectAccountFlow({ onDone, onCancel }) {
  /* 点了「授权接入」就离开慧投，这里只演示跳转中的一瞬 */
  const [going, setGoing] = React.useState(null);
  const cfg = PLATFORM_OPTIONS.find((p) => p.id === going);

  return (
    <div style={{ minWidth: 0 }}>
      <Alert tone="info" title="授权在对方平台完成" style={{ marginBottom: 'var(--space-6)' }}>
        点「授权接入」会跳转到该平台的授权页，由账户管理员确认。授权仅用于读取数据与在护栏内调整投放，不涉及资金操作，可随时解除。
      </Alert>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(268px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-7)' }}>
        {PLATFORM_OPTIONS.map((p) => <PlatformCard key={p.id} p={p} busy={going === p.id} onConnect={() => { setGoing(p.id); setTimeout(() => onDone && onDone(), 1400); }} />)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
          {cfg ? '正在前往' + cfg.label + '的授权页…' : '已接入的账户会自动合并，不会重复创建。'}
        </span>
        <span style={{ flex: 1 }} />
      </div>

      <div style={{ marginTop: 'var(--space-7)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
        <span>接入过程中遇到问题？</span>
        <a href="#contact-admin" style={{ fontSize: 'var(--fs-12)' }}>联系管理员</a>
      </div>
    </div>
  );
}

function PlatformCard({ p, busy, onConnect }) {
  const [hover, setHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const ready = p.state === 'ready';
  /* 已接入过的账户就列在它自己的平台卡里 —— 否则「再接一个」时看不出这个平台下已经有谁 */
  const linked = (window.HUITOU_ACCOUNTS || []).filter((a) => a.platform === p.id);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', minWidth: 0,
        padding: 'var(--gutter-card)', borderRadius: 'var(--radius-card)',
        background: ready && hover ? 'var(--surface-hover)' : 'var(--surface-card)',
        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
        opacity: ready ? 1 : 0.7, transition: 'var(--transition-control)',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, flex: 'none',
          borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', color: 'var(--text-secondary)',
        }}>
          <window.PlatformMark platform={p.id} size={16} fallback="megaphone" />
        </span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap' }}>{p.label}</span>
        {ready ? null : <Badge tone="neutral">{STATE_BADGE[p.state]}</Badge>}
      </div>

      {linked.length ? (
        <div style={{ position: 'relative', marginTop: 'var(--space-5)' }}>
          <button type="button" onClick={() => setOpen((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', width: '100%', padding: 'var(--space-4) var(--space-5)', borderWidth: 1, borderStyle: 'solid', borderColor: open ? 'var(--border-strong)' : 'var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
            <StatusDot tone="success" />
            <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-12)', color: 'var(--text-secondary)' }}>已接入 {linked.length} 个广告账户</span>
            <Icon name="chevron-down" size={13} style={{ flex: 'none', color: 'var(--text-tertiary)', transform: open ? 'rotate(180deg)' : 'none' }} />
          </button>
          {open ? (
            <>
              <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 20 }} />
              <div className="huitou-scroll" style={{ position: 'absolute', left: 0, right: 0, top: 'calc(100% + 4px)', zIndex: 21, maxHeight: 208, overflowY: 'auto', background: 'var(--surface-card)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
                {linked.map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)' }}>
                    <span style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 'var(--fs-12)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.tag || a.name}</span>
                      <span style={{ fontSize: 'var(--fs-11)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{a.account}</span>
                    </span>
                    {a.token === 'expired' ? <Badge tone="danger">令牌过期</Badge> : null}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      <span style={{ display: 'block', fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)', marginTop: 'var(--space-5)' }}>{p.desc}</span>

      {p.scope.length ? (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          {p.scope.map((s) => (
            <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>
              <Icon name="check" size={12} style={{ flex: 'none' }} />{s}
            </span>
          ))}
        </span>
      ) : null}

      <span style={{ flex: 1, minHeight: 'var(--space-6)' }} />
      {ready ? (
        <Button variant="primary" iconRight="external-link" disabled={busy} onClick={onConnect} style={{ width: '100%' }}>
          {busy ? '正在跳转…' : '授权接入'}
        </Button>
      ) : (
        <Button disabled style={{ width: '100%' }}>{p.state === 'wip' ? '即将开放' : '敬请期待'}</Button>
      )}
    </div>
  );
}

Object.assign(window, { ConnectAccountFlow });
})();
