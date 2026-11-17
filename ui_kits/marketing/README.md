# UI Kit —— 官网

对外的营销站点。1160px 居中栏宽、64px 吸顶头部，`--surface-page` 与 `--surface-card` 交替的区块之间以细线分隔。唯一的背景处理是首屏后方低密度的点阵，并做了淡出遮罩。

打开 `index.html` 查看完整首页。

| 文件 | 界面 |
|---|---|
| `SiteChrome.jsx` | 头部、页脚、`Section` 区块容器 |
| `Hero.jsx` | 主标题、行动号召、展示真实组件的产品外框 |
| `Sections.jsx` | 四阶段闭环、效果数据、客户引言、价格、结尾行动号召 |

首屏的产品外框直接渲染真实的 `MetricCard` 与 `AgentTimeline` 组件，而不是截图 —— 这是官网展示产品的推荐做法。
