决策详情里的完整验证跟踪表。卡片上的 `MetricRounds` 只给最新值，这里要能横向比较每一轮——「哪一轮开始掉的」只有摊开才看得出来。

```jsx
<TrackingTable rounds={['一轮 19:00', '二轮 21:00', '三轮 23:00']} metrics={decision.metrics} />
```

`metrics` 与 `MetricRounds` 同结构，同一条决策两处共用一份数据。未跑的轮次传 `null`，单元格显示「待验证」。

采样量偏低的轮次传 `flag: true`，值旁挂问号说明，不要把数据藏起来：数值本身要留在表里，可信度另说。
