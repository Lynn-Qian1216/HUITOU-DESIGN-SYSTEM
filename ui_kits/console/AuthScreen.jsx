(() => {
const { Icon, Button, Input, Checkbox, Alert } = window.HUITOUAIDesignSystem_52606d;

/* 登录与注册共享表单逻辑，视觉独立于工作台的紧凑字号。 */
function AuthScreen({ onDone }) {
  const [mode, setMode] = React.useState('login');
  const [phone, setPhone] = React.useState('');
  return (
    <main className={'auth-page auth-page--'+mode}>
      <div className="auth-atmosphere" aria-hidden="true">
        <div className="auth-silver-mist" />
        <div className="auth-silver-light" />
      </div>
      <header className="auth-header">
        <img src={(window.__resources && window.__resources.logoWordmark) || '../../assets/logo-wordmark-cn-h.svg'} alt="慧投" />
        <span>广告投放，从容有序。</span>
      </header>
      <section className="auth-stage">
        <div className="auth-card">
          <div className="auth-intro">
            <div className="auth-symbol"><Icon name="fingerprint" size={30}/></div>
            <h1>{mode === 'login' ? '欢迎回来。' : '从这里，开始。'}</h1>
            <p>{mode === 'login' ? '登录慧投，继续你的工作。' : '创建慧投账号，开启你的工作空间。'}</p>
          </div>
          {mode === 'login'
            ? <LoginForm phone={phone} setPhone={setPhone} onDone={onDone} onRegister={() => setMode('register')} />
            : <RegisterForm phone={phone} setPhone={setPhone} onDone={onDone} onLogin={() => setMode('login')} />}
        </div>
      </section>
      <footer className="auth-footer"><span>杭州中科昊萌网络科技有限公司</span><span>HUITOU · 专注每一次投放</span></footer>
    </main>
  );
}

/* 验证码按钮：倒计时期间只改自己的文案，不整块替换 —— 换掉的话焦点会从输入框跳走 */
function CodeButton({ disabled, onSend }) {
  const [left, setLeft] = React.useState(0);
  React.useEffect(() => {
    if (!left) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <Button className="auth-code" size="md" variant="secondary" disabled={disabled || left > 0}
      onClick={() => { setLeft(60); onSend && onSend(); }}
      style={{ flex: 'none', width: 104 }}>
      {left ? left + ' 秒' : '获取验证码'}
    </Button>
  );
}

function PhoneField({ value, onChange, autoFocus }) {
  return (
    <Field label="手机号">
      <Input value={value} autoFocus={autoFocus} placeholder="11 位手机号" inputMode="numeric"
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} />
    </Field>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="auth-field" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)' }}>{label}</span>
      {children}
      {hint ? <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>{hint}</span> : null}
    </label>
  );
}

function LoginForm({ phone, setPhone, onDone, onRegister }) {
  const [by, setBy] = React.useState('code');   // code | password
  const [code, setCode] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [agree, setAgree] = React.useState(true);
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const phoneOk = phone.length === 11;
  const DEMO = true;   // 演示：不填也能进，填了按真实规则校验
  const ready = DEMO || (phoneOk && agree && (by === 'code' ? code.length === 6 : pwd.length >= 6));

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    /* 校验放在计时器之前同步做：写在 setTimeout 里的话，闭包读到的是提交那一刻的旧值，
       而且失败分支的 setBusy(false) 会被这一轮渲染盖掉，按钮永久停在「登录中…」。 */
    if (by === 'password' && pwd === '000000') { setErr('手机号或密码不正确。连续错误 5 次将锁定 10 分钟。'); return; }
    setErr('');
    setBusy(true);
    setTimeout(() => { onDone && onDone(); }, 700);
  };

  return (
    <form className="auth-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {err ? <Alert tone="danger" title="登录失败">{err}</Alert> : null}

      <PhoneField value={phone} onChange={setPhone} autoFocus />

      {by === 'code' ? (
        <Field label="验证码">
          <span style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <Input value={code} placeholder="6 位数字" inputMode="numeric" style={{ width: '100%' }}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} />
            </span>
            <CodeButton disabled={!phoneOk} />
          </span>
        </Field>
      ) : (
        <Field label="密码">
          <Input value={pwd} type="password" placeholder="至少 6 位" onChange={(e) => setPwd(e.target.value)} />
        </Field>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--fs-13)' }}>
        <button type="button" onClick={() => { setBy(by === 'code' ? 'password' : 'code'); setErr(''); }}
          style={{ padding: 0, border: 0, background: 'transparent', font: 'inherit', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {by === 'code' ? '用密码登录' : '用验证码登录'}
        </button>
        <span style={{ flex: 1 }} />
        {by === 'password' ? <a href="#reset" style={{ fontSize: 'var(--fs-13)' }}>忘记密码</a> : null}
      </div>

      <Agreement checked={agree} onChange={() => setAgree((v) => !v)} />

      <Button type="submit" variant="primary" size="lg" disabled={!ready || busy} style={{ width: '100%' }}>
        {busy ? '登录中…' : '登录'}
      </Button>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 'calc(var(--space-4) * -1)' }}>演示环境：不填也可直接登录</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', color: 'var(--text-tertiary)', fontSize: 'var(--fs-12)' }}>
        <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        其他方式
        <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
      </div>
      <Button variant="secondary" size="md" iconLeft="scan-line" disabled={!agree} style={{ width: '100%' }}>飞书扫码登录</Button>

      <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
        还没有账号？<button type="button" onClick={onRegister} style={{ padding: 0, border: 0, background: 'transparent', font: 'inherit', color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>注册</button>
      </span>
    </form>
  );
}

function RegisterForm({ phone, setPhone, onDone, onLogin }) {
  const [code, setCode] = React.useState('');
  const [name, setName] = React.useState('');
  const [org, setOrg] = React.useState('');
  const [invite, setInvite] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const phoneOk = phone.length === 11;
  const ready = true || (phoneOk && code.length === 6 && name.trim() && org.trim() && agree);   // 演示：直接进

  return (
    <form className="auth-form" onSubmit={(e) => { e.preventDefault(); if (!ready) return; setBusy(true); setTimeout(() => onDone && onDone(), 800); }}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

      <PhoneField value={phone} onChange={setPhone} autoFocus />

      <Field label="验证码">
        <span style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <span style={{ flex: 1, minWidth: 0 }}>
            <Input value={code} placeholder="6 位数字" inputMode="numeric" style={{ width: '100%' }}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} />
          </span>
          <CodeButton disabled={!phoneOk} />
        </span>
      </Field>

      <Field label="你的称呼" hint="团队成员列表里显示的名字，之后可改">
        <Input value={name} placeholder="例如：王亮" onChange={(e) => setName(e.target.value)} />
      </Field>

      {/* 注册即建团队：一个人也是一个团队，否则接进来的账户无处归属 */}
      <Field label="团队名称" hint="你将成为该团队的拥有者，接入的广告账户归它所有">
        <Input value={org} placeholder="例如：王小卤 · 电商投放" onChange={(e) => setOrg(e.target.value)} />
      </Field>

      <Field label="邀请码" hint="选填。同事给了邀请码就直接加入他的团队，不再新建">
        <Input value={invite} placeholder="选填" onChange={(e) => setInvite(e.target.value)} />
      </Field>

      <Agreement checked={agree} onChange={() => setAgree((v) => !v)} />

      <Button type="submit" variant="primary" size="lg" disabled={!ready || busy} style={{ width: '100%' }}>
        {busy ? '创建中…' : '注册并进入'}
      </Button>

      <span style={{ fontSize: 'var(--fs-13)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
        已有账号？<button type="button" onClick={onLogin} style={{ padding: 0, border: 0, background: 'transparent', font: 'inherit', color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>去登录</button>
      </span>
    </form>
  );
}

/* 协议默认不勾（注册）/ 默认勾上（登录）：注册是第一次同意，得让人自己点一下 */
function Agreement({ checked, onChange }) {
  return (
    <label className="auth-agreement" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', lineHeight: 'var(--lh-normal)', cursor: 'pointer' }}>
      <span style={{ paddingTop: 1 }}><Checkbox checked={checked} onChange={onChange} /></span>
      <span>我已阅读并同意 <a href="#terms">服务协议</a> 与 <a href="#privacy">隐私政策</a>，并授权慧投读取所接入广告账户的数据。</span>
    </label>
  );
}

Object.assign(window, { AuthScreen });
})();
