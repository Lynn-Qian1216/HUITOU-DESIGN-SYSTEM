附件卡片，比 `FileChip` 大一档、带缩略图。用在输入框上方这种「刚上传、还要确认一眼」的位置。

```jsx
<FileCard name="首页截图.png" size={182400} thumb={url} onOpen={preview} onRemove={drop} />
<FileCard name="10月对账单.xlsx" size={248320} onRemove={drop} />
```

- **图片给真缩略图。** 一次传五张截图，光看 `image.png` 谁也认不出哪张是哪张。
- 非图片给扩展名图标块，不硬凑缩略图 —— PDF 首页缩到 40px 只是一团灰。
- × 只在悬停时出现；一排卡片上挂五个 × 太吵。失败态例外，× 常驻。
- 紧凑场景（已发出的消息里回显附件、表格单元格内）用 `FileChip`，不要把卡片塞进去。
