(() => {
const { Card, Button, Badge, StatusDot, Divider, Switch, Checkbox, FormField, Input, Select, FilterSelect, Textarea, Alert, IconButton, Avatar, EmptyState, Icon } = window.HUITOUAIDesignSystem_52606d;

function ConnectionsScreen() {
  const D = window.HUITOU_DATA;
  return (
    <>
      <PageHeader title="数据连接" description="HUITOU 通过这些平台连接读取与写入数据。授权过期时，自动变更将暂停。" actions={<Button variant="primary" iconLeft="plus">添加连接</Button>} />
      <Alert tone="warning" title="Google Ads 授权将在 3 天后过期" action={<Button size="sm">重新连接</Button>} style={{ marginBottom: 'var(--space-7)' }}>
        重新连接以保持 Google 广告系列的自动驾驶运行。
      </Alert>
      <Card padded={false}>
        {D.connections.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', padding: 'var(--space-6) var(--gutter-card)', borderBottom: i < D.connections.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <Avatar name={c.name} square size="md" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)' }}>{c.name}</div>
              <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{c.account}</div>
            </div>
            <StatusDot tone={c.tone} label={c.status} />
            <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', width: 130, textAlign: 'right' }}>{c.synced}同步</span>
            <Button variant="secondary" size="sm">{c.tone === 'neutral' ? '连接' : '管理'}</Button>
          </div>
        ))}
      </Card>
    </>
  );
}

function SettingsScreen() {
  const [auto, setAuto] = React.useState(true);
  const [currency, setCurrency] = React.useState('CNY 人民币');
  const [digest, setDigest] = React.useState(true);
  return (
    <>
      <PageHeader title="设置" description="Northwind DTC 的工作区偏好设置。" actions={<Button variant="primary">保存更改</Button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)', alignItems: 'start' }}>
        <Card title="工作区">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <FormField label="工作区名称"><Input defaultValue="Northwind DTC" /></FormField>
            <FormField label="报告币种"><FilterSelect value={currency} onChange={setCurrency} width="100%" options={['CNY 人民币', 'USD 美元', 'EUR 欧元', 'HKD 港币']} style={{ width: '100%' }} /></FormField>
            <FormField label="目标 CPA" hint="HUITOU 将朝这一数值优化"><Input defaultValue="45.00" suffix="元" /></FormField>
            <FormField label="账户备注" hint="HUITOU 撰写策略时参考的背景信息">
              <Textarea rows={3} defaultValue="冬季系列 9 月 14 日上市。停产 SKU 不要加投。" />
            </FormField>
          </div>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Card title="自动化">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <Switch checked={auto} onChange={setAuto} label="自动驾驶" description="无需询问即执行已批准的策略手册" />
              <Divider spacing="0" />
              <Checkbox checked label="暂停 ROAS 低于 0.8 的广告组" description="连续 5 天后执行" />
              <Checkbox checked label="每日重新平衡预算" description="在单系列 25% 的上限内" />
              <Checkbox label="轮换疲劳素材" description="需要连接素材库" disabled />
            </div>
          </Card>
          <Card title="通知">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <Switch checked={digest} onChange={setDigest} label="每周简报" description="周一 08:00，仅发送给账户负责人" />
              <Checkbox checked label="每次自动变更都通知我" />
              <Checkbox checked label="连接异常时通知我" />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ConnectionsScreen, SettingsScreen });
})();
