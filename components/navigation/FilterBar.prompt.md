列表页表头那一排筛选控件的容器。

```jsx
<FilterBar inset trailing={<Button variant="ghost" size="sm" iconLeft="download">导出</Button>}>
  <Input placeholder="搜索商品名称/ID" iconLeft="search" style={{ flex: '1 1 180px', maxWidth: 240 }} />
  <FilterSelect value={type} onChange={setType} width={140} options={typeOptions} />
  <Checkbox checked={unrun} onChange={...} label="只看未投放商品" />
</FilterBar>
```

- `trailing` 里的东西自动靠右，不要再手写 `<span style={{flex:1}}/>`。
- 卡片内嵌用 `inset`；独立成行时不加，由外层给留白。
- 控件一律 `sm` 尺寸，同排高度才齐。
