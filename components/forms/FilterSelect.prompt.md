列表页表头的筛选下拉。与 `Select` 的区别只有一点：每项右侧给出命中行数。

```jsx
const countBy = (rows, key, label) => (label.startsWith('全部') ? rows.length : rows.filter((r) => r[key] === label).length);

<FilterSelect value={type} onChange={setType} width={148}
  options={['全部类型', '改日预算', '改出价', '暂停广告'].map((o) => ({ label: o, count: countBy(rows, 'type', o) }))} />
```

- 计数必须从明细 reduce 推导，不写常量 —— 否则筛完发现数字对不上。
- 命中 0 的项**置灰保留**，不要移除：选项列表随数据增删会让人以为自己看错了。
- 表单里的普通选择仍然用 `Select`；`FilterSelect` 只用于「筛一批数据」的场景。
