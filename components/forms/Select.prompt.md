表单里的普通选择。自绘面板，不是原生 `<select>` —— 原生列表在 Windows 上是系统外观，跟同一排的筛选控件对不上。

```jsx
<Select value={period} onChange={(e) => setPeriod(e.target.value)}
  options={['近 7 天', '近 30 天', '本季度至今']} />
```

- `onChange` 仍是事件形状（`e.target.value`），旧写法不用改。
- 面板样式与 `DropdownMenu`、`FilterSelect` 一致：内缩 `--space-2`、行高 30、圆角 `--radius-xs`。
- 要在选项右侧带命中行数时用 `FilterSelect`，不要给 `Select` 塞计数。
