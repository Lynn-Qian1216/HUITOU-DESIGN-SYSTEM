任何挂在触发器下方的浮层都走它：下拉、日历、筛选面板。

```jsx
const trigger = React.useRef(null);
<button ref={trigger} onClick={() => setOpen(!open)}>近 30 天</button>
{open ? <AnchoredPanel anchor={trigger} matchWidth onClose={() => setOpen(false)}>…</AnchoredPanel> : null}
```

- **不要用 `position: absolute` 自己摆浮层。** 列表页的卡片和滚动容器都带 `overflow: hidden`，absolute 面板会被裁在卡片里 —— 这是下拉「被遮挡」的唯一原因。这里用 `fixed`，量完位置再显示。
- 越过右边缘往回收，下方放不下就翻到上方，都留 8px 余量。
- 量位置那一帧用 `opacity: 0` 遮住，不用 `visibility: hidden` —— 隐藏子树里的 `focus()` 会被浏览器丢掉，面板里的搜索框就永远聚焦不上。
- 外点与 Esc 关闭已收在组件里：面板不在触发器的 DOM 子树内，各处自己判断 `contains` 会失效。
- 面板跟随滚动重新定位。若浮层需要盖住整屏并阻断交互，那是 `Dialog` 的活，不是这个。
