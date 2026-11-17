AI 决策卡上的四枚定语标记。三个界面（队列卡、决策详情、历史列表）显示同一条决策的级别与时效，必须用同一套组件，否则颜色会各写各的。

```jsx
<PriorityChip level="高" />
<ExpiryChip label="今天 19:18 后失效" />
<MetaChip label="所属计划" value="吃货小卤--脆笋去骨鸡爪--2026-0…" />
<ResultNote result="revert" text="ROI 未达标，已回滚" />
```

`ExpiryChip` 只在决策还等人处理（待执行）时挂出来。已执行、已拒绝的决策再提醒失效时间，会让人以为还有事要做——那时把时间并进元信息行即可。

`ResultNote` 的 `revert` 走 danger 而不是中性：「执行了又退回来」和「顺利完成」在账面上是两回事，不该长得一样。
