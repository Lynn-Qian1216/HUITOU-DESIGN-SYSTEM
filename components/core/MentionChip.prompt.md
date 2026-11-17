提问时引用的对象：智能体、广告、商品、素材、达人、账户。

```jsx
<MentionChip kind="agent" label="诊断智能体" onRemove={() => drop(i)} />
<MentionChip kind="product" label="王小卤虎皮凤爪 · 藤椒味" onRemove={() => drop(i)} />
```

- **胶囊必须分两段：类型 + 名字。** 只写名字的话，「藤椒味」既可能是商品也可能是素材。
- 智能体走紫（`--status-ai-*`），其余一律中性。一排胶囊里五种颜色等于没有颜色 —— 紫色在本系统里只代表机器在替你做事。
- 只读展示（如在已发出的提问里回显引用）不传 `onRemove`，× 就不出现。
