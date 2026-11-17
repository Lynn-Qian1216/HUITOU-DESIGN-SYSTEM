智能体生成中的等待态 —— 逐帧奔跑猫 + 状态文案 + 与回复同形的骨架块。凡是等 AI 出结果的地方都用它，不要用 `Spinner`。

```jsx
<AgentLoading phases={['正在读取账户数据', '正在核对近 7 天指标', '正在生成结论与建议']} />
<AgentLoading label="正在生成日报" skeleton={false} />
```

`Spinner` 只留给非 AI 的短操作（保存、刷新）。`src` 指向逐帧 SVG，默认按页面深度两级（`../../assets/motion-reply.svg`）；换设计稿导出后帧数变了也无需改代码。`RunningCat` 是只要动画本身时的裸组件。
