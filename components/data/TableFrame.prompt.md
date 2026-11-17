长列表页的标准结构 —— 宽表在 `TableFrame` 里横向滚动，翻页器放进 `StickyFooter` 吸在滚动区底部。

```jsx
<TableFrame>
  <table style={{ width: '100%', minWidth: 1060 }}>…</table>
</TableFrame>
<StickyFooter>
  <Pagination page={at} pageCount={pageCount} total={rows.length} onChange={setPage}
    pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={setSize} />
</StickyFooter>
```

`ListShell` 是两者的简写（`children` + `footer`）。

三条约束：**页面只保留外层一层纵向滚动**（嵌套滚动区在窄面板下会被压没）；`StickyFooter` 必须是滚动区的**直系后代** —— 带 `transform` 的祖先或 `overflow: hidden` 的容器（含默认的 `Card`）都会让 sticky 失效；宽表**不要放进 `Card`**，需要卡片外观时把描边交给 `TableFrame` 自己，或给 `Card` 传 `overflow="visible"`。

横向滚动轨会自动出现在吸底条顶部，与表格 `scrollLeft` 双向同步，表格不溢出时不渲染 —— 不需要额外接线。
