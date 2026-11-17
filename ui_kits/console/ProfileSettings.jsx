(() => {
const { Icon, Avatar, Button, Card, Input, FormField, Checkbox, Tabs, Alert, StatusDot, Badge, Divider } = window.HUITOUAIDesignSystem_52606d;

/* 用户设置 · 通知设置。飞书机器人 Webhook：填地址与密钥，再勾选哪些广告账户的通知走这个机器人。
   账户按平台分组，组头是一个三态勾选（全选 / 部分 / 全不选）—— 账户几十个，逐个勾不现实。 */

const GROUPS = [
  { id: 'qianchuan', label: '巨量千川', accounts: [
    { id: 'q1', name: 'KOC（博采06）-品牌-短视频', account: '1807809279709260' },
    { id: 'q2', name: 'ECP_1720186143871_8768', account: '1803745907090475' },
  ] },
  { id: 'tencent', label: '腾讯广点通', accounts: [
    { id: 't1', name: '中科昊萌(杭州)网络科技有限公司', account: '78224902' },
    { id: 't2', name: '中科昊萌(杭州)网络科技有限公司', account: '63688997' },
    { id: 't3', name: '中科昊萌(杭州)网络科技有限公司', account: '79357045' },
    { id: 't4', name: '中科昊萌(杭州)网络科技有限公司', account: '79357031' },
    { id: 't5', name: '中科昊萌(杭州)网络科技有限公司', account: '79357029' },
    { id: 't6', name: '中科昊萌(杭州)网络科技有限公司', account: '79357027' },
    { id: 't7', name: '中科昊萌(杭州)网络科技有限公司', account: '79357025' },
    { id: 't8', name: '中科昊萌(杭州)网络科技有限公司', account: '79357021' },
    { id: 't9', name: '中科昊萌(杭州)网络科技有限公司', account: '79357016' },
  ] },
];

const ALL_IDS = GROUPS.reduce((a, g) => a.concat(g.accounts.map((x) => x.id)), []);
const SAVED = { hook: 'https://open.feishu.cn/open-apis/bot/v2/hook/7c2e…', secret: '', picked: ALL_IDS };

/* 个人资料：名字与头像是别人在团队里认你的方式，手机号是登录凭据 ——
   前两项随时可改，后者要走验证码，所以它归「账号与安全」。 */
const PRESET = ['var(--neutral-900)', 'var(--status-ai-fg)', 'var(--status-success-fg)', 'var(--status-warning-fg)', 'var(--status-danger-fg)'];

function ProfilePane() {
  const [name, setName] = React.useState('天了噜鸭梨');
  const [title, setTitle] = React.useState('投放负责人');
  const [color, setColor] = React.useState(PRESET[0]);
  const [saved, setSaved] = React.useState(true);
  const touch = (fn) => (v) => { setSaved(false); fn(v); };

  return (
    <Card padded={false} style={{ maxWidth: 720 }}>
      <div style={{ padding: 'var(--space-6) var(--gutter-card)', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ flex: 1 }} />
          {saved ? <StatusDot tone="success" label="已保存" style={{ fontSize: 'var(--fs-12)' }} /> : <StatusDot tone="warning" label="有未保存的修改" style={{ fontSize: 'var(--fs-12)' }} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <span style={{ display: 'grid', placeItems: 'center', width: 56, height: 56, flex: 'none', borderRadius: 'var(--radius-pill)', background: color, color: 'var(--neutral-0)', fontSize: 'var(--fs-20)', fontWeight: 'var(--fw-medium)' }}>
            {(name || '·').slice(0, 1)}
          </span>
          <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>头像</span>
            {/* 没有真实上传能力时不给「上传」按钮画饼：默认用名字首字，底色可换 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              {PRESET.map((c) => (
                <button key={c} type="button" onClick={() => touch(setColor)(c)} title="用这个底色"
                  style={{ width: 24, height: 24, padding: 0, borderWidth: 2, borderStyle: 'solid', borderColor: color === c ? 'var(--text-primary)' : 'transparent', borderRadius: 'var(--radius-pill)', background: c, cursor: 'pointer' }} />
              ))}
              <Button size="sm" variant="secondary" iconLeft="upload">上传图片</Button>
            </div>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>不上传就用名字首字，底色从上面选。JPG / PNG，建议 256×256 以上。</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
          <FormField label="用户名" hint="团队成员列表里显示的名字">
            <Input value={name} onChange={(e) => touch(setName)(e.target.value)} />
          </FormField>
          <FormField label="职位" hint="选填，只在团队里可见">
            <Input value={title} placeholder="例如：投放负责人" onChange={(e) => touch(setTitle)(e.target.value)} />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
          <FormField label="手机号" hint="登录凭据，修改需验证码">
            <Input value="198****7311" disabled suffix="已验证" />
          </FormField>
          <FormField label="所在团队" hint="在侧栏底部切换">
            <Input value={(window.getCurrentTeam ? window.getCurrentTeam().name : '')} disabled />
          </FormField>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)' }}>
        <Button variant="primary" iconLeft="save" disabled={saved} onClick={() => setSaved(true)}>保存资料</Button>
        <Button variant="ghost" onClick={() => { setName('天了噜鸭梨'); setTitle('投放负责人'); setColor(PRESET[0]); setSaved(true); }}>重置</Button>
      </div>
    </Card>
  );
}

function SecurityPane() {
  const ROWS = [
    { label: '登录手机号', value: '198****7311', note: '用于短信验证码登录', act: '更换手机号' },
    { label: '登录密码', value: '上次修改于 2026-03-12', note: '建议每 6 个月更换一次', act: '修改密码' },
    { label: '飞书账号', value: '未绑定', note: '绑定后可用飞书扫码登录', act: '绑定' },
  ];
  return (
    <Card padded={false} style={{ maxWidth: 720 }}>
      {ROWS.map((r, i) => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-6) var(--gutter-card)', borderTopWidth: i ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', flexWrap: 'wrap' }}>
          <span style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{r.label}</span>
            <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>{r.value}</span>
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{r.note}</span>
          </span>
          <Button size="sm" variant="secondary">{r.act}</Button>
        </div>
      ))}
    </Card>
  );
}

function NotifySettings() {
  const [hook, setHook] = React.useState(SAVED.hook);
  const [secret, setSecret] = React.useState(SAVED.secret);
  const [picked, setPicked] = React.useState(SAVED.picked);
  const [saved, setSaved] = React.useState(true);

  const touch = (fn) => (...a) => { setSaved(false); fn(...a); };
  const toggle = touch((id) => setPicked((v) => (v.includes(id) ? v.filter((x) => x !== id) : v.concat(id))));
  const toggleGroup = touch((g) => {
    const ids = g.accounts.map((x) => x.id);
    const allOn = ids.every((id) => picked.includes(id));
    setPicked((v) => (allOn ? v.filter((id) => !ids.includes(id)) : v.concat(ids.filter((id) => !v.includes(id)))));
  });
  const reset = () => { setHook(SAVED.hook); setSecret(SAVED.secret); setPicked(SAVED.picked); setSaved(true); };

  return (
    <Card padded={false} style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-6) var(--gutter-card)', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-medium)' }}>飞书通知设置</span>
        <window.InfoHint label="在飞书群聊中添加「自定义机器人」，复制生成的 Webhook 地址；若开启了签名校验，一并填入密钥。" width={320} />
        <span style={{ flex: 1 }} />
        {saved ? <StatusDot tone="success" label="已生效" style={{ fontSize: 'var(--fs-12)' }} /> : <StatusDot tone="warning" label="有未保存的修改" style={{ fontSize: 'var(--fs-12)' }} />}
      </div>

      <div style={{ padding: 'var(--space-6) var(--gutter-card)', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
        <p style={{ margin: 0, fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-normal)' }}>
          配置飞书机器人 Webhook，系统将通过飞书向你发送 AI 决策通知和异常告警。
        </p>

        <FormField label="机器人 webhook 地址" hint="在飞书群聊中添加入群机器人，复制生成的 Webhook 地址">
          <Input value={hook} placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/…" onChange={touch((e) => setHook(e.target.value))} />
        </FormField>

        <FormField label="签名密钥" hint="如开启了飞书机器人的安全设置中的签名校验，请填入此密钥">
          <Input value={secret} placeholder="留空表示未开启签名校验" onChange={touch((e) => setSecret(e.target.value))} />
        </FormField>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>接收通知的广告账户</div>
            <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2 }}>勾选要接收本机器人通知的广告账户；不选则本配置不绑定具体账户。</div>
          </div>
          <div className="huitou-scroll" style={{ maxHeight: 320, overflowY: 'auto', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            {GROUPS.map((g, gi) => {
              const ids = g.accounts.map((x) => x.id);
              const n = ids.filter((id) => picked.includes(id)).length;
              return (
                <div key={g.id} style={{ borderTopWidth: gi ? 1 : 0, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-5)', background: 'var(--neutral-25)', cursor: 'pointer' }}>
                    <Checkbox checked={n === ids.length} indeterminate={n > 0 && n < ids.length} onChange={() => toggleGroup(g)} />
                    <window.PlatformMark platform={g.id} size={14} fallback="megaphone" />
                    <span style={{ fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)' }}>{g.label}</span>
                    <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>（已选 {n}/{ids.length}）</span>
                  </label>
                  {g.accounts.map((a) => (
                    <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-4) var(--space-5) var(--space-4) var(--space-8)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', cursor: 'pointer' }}>
                      <Checkbox checked={picked.includes(a.id)} onChange={() => toggle(a.id)} />
                      <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--fs-13)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>ID: {a.account}</span>
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
          {!picked.length ? (
            <Alert tone="warning" title="未选择账户">本配置不绑定具体账户，你将只收到与账户无关的系统通知。</Alert>
          ) : null}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5) var(--gutter-card)', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--border-subtle)', background: 'var(--neutral-25)' }}>
        <Button variant="primary" iconLeft="save" disabled={saved} onClick={() => setSaved(true)}>保存设置</Button>
        <Button variant="ghost" onClick={reset}>重置</Button>
        <span style={{ flex: 1 }} />
        <Button variant="secondary" size="sm" iconLeft="send" disabled={!hook.trim()}>发送测试消息</Button>
      </div>
    </Card>
  );
}

Object.assign(window, { MyProfilePane: ProfilePane, MySecurityPane: SecurityPane, MyNotifyPane: NotifySettings });
})();
