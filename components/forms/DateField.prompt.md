列表页与设置页的日期／时间选择器。触发器是一小条只读文本，点开是完整面板。

```jsx
<DateField value={d} onChange={setD} />

<DateRangeField start={a} end={b}
  onChange={(s, e) => { setA(s); setB(e); }}
  preset={range} onPreset={setRange}
  presets={['今天', '昨天', '近 7 天', '近 30 天', '本月', '上月']} />

<TimeRangeField from="10:00" to="14:00" minuteStep={30} onChange={setWindow} />
```

面板做法：

- `DateField` —— 单月历，年/月各一对翻页箭头，今天描一圈边，底部「今天 / 清除」。
- `DateRangeField` —— 左侧预设轨 + 双月并排。第一下落起点、第二下落终点，**反着点就自动调头**，不要弹「结束早于开始」再让人重来；未落笔的那一半跟着鼠标预览。底部给出 `起 → 止` 并要一次「确定」，避免选到一半就触发查询。
- `TimeRangeField` —— 开始／结束各一组时/分列，分钟按 `minuteStep` 取值。逐分钟要滚 60 行，而投放时段从来只落在整点或半点。底部要一次「确定」。

通用规则：

- 数字一律等宽 + `tabular-nums`。切换区间时字宽不跳,同排的筛选控件才不会跟着抖。
- 补位的上下月日期照常渲染,只压到 `--text-disabled`;空格子会让月末那一行看着断掉。
- 触发器高度用 `--control-h-sm`,与 `FilterSelect`、搜索框在同一排能齐平。
- 需要接自家日历时传 `onClick`,内置面板会让位。
