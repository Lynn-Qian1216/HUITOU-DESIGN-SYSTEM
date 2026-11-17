决策进入验证后，卡片上「当初想干什么」就不如「现在到了什么数」重要。`MetricRounds` 就是那半张卡：每个指标一行，起点 → 最新值 → 目标 → 轮次圆点。

```jsx
<MetricRounds metrics={[
  { name: '日转化量', target: '≥500', from: '350', rounds: [{ v: '392' }, { v: '512' }, null] },
  { name: 'ROI', target: '≥3.5', from: '2.5', rounds: [{ v: '2.9' }, { v: '3.6' }, null] },
]} />
<MetricRounds metrics={failedMetrics} failNote="ROI 三轮均未达标，已自动回滚预算" />
```

达标与否由 `target` 推导（`meetsTarget` 解析 ≥/≤ 与数值，剥掉 ¥ % 千分位），不要在数据里另写 `pass: true`——标记漏写一次，界面就会把没达标的数说成达标。

未跑的轮次传 `null`，不要省略数组项：圆点数量代表总轮数，少一个就变成「只有两轮」。
