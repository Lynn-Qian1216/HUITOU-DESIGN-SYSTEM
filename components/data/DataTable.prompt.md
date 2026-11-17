Hairline-ruled table. Numbers right-aligned and tabular; no zebra striping, no vertical rules.

```jsx
<DataTable rows={rows} footer={<Pagination page={1} pageCount={4} total={82} />}
  columns={[{ key: 'name', header: 'Campaign' }, { key: 'spend', header: 'Spend', align: 'right' }]} />
```

Drop it into a `<Card padded={false}>`.
