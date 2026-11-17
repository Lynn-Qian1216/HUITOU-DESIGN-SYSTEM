随提问一起上传的附件：截图、素材、对账单、商品表。

```jsx
<FileChip name="藤椒味_15s_竖版_final_v3.mp4" status="uploading" progress={62} onRemove={drop} />
<FileChip name="10月对账单.xlsx" size={248320} onRemove={drop} />
<FileChip name="banner.png" status="error" error="超过 20MB" onRetry={retry} onRemove={drop} />
```

- **三种状态共用一个外形**，只换右侧那一小块：上传中给百分比 + 底边进度条，失败给原因和「重试」，完成给体积。换形状会让同一批文件在上传过程中排版反复重排。
- 文件名从**中间**截断 —— 尾部的 `_final_v3.mp4` 才是分辨两个文件的地方。完整名字在 `title` 里。
- 失败必须给出原因（「超过 20MB」「格式不支持」），不要只写「上传失败」。
- 图标按扩展名走 `fileIcon()`；不要给每个文件生成缩略图，一排缩略图看不出谁是谁。
