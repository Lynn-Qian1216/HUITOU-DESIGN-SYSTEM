window.HUITOU_DATA = {
  accounts: [
    { id: 'northwind', name: 'Northwind DTC', platform: 'Meta · Google', spend: '¥28,412' },
    { id: 'lumen', name: 'Lumen Supply Co.', platform: 'Meta', spend: '¥9,204' },
  ],
  metrics: [
    { label: '花费 · 7 天', value: '¥28,412', delta: 4.1, goodWhen: 'none', basis: '较前 7 天', series: [18, 21, 19, 24, 26, 25, 28] },
    { label: '混合 CPA', value: '¥41.20', delta: -18.4, goodWhen: 'down', basis: '较前 7 天', series: [52, 49, 51, 47, 45, 44, 41], target: '¥45.00' },
    { label: 'ROAS', value: '3.14', delta: 12.4, goodWhen: 'up', basis: '较前 7 天', series: [2.1, 2.4, 2.3, 2.7, 2.9, 3.0, 3.14] },
    { label: '转化 · 7 天', value: '689', delta: 9.2, goodWhen: 'up', basis: '较前 7 天', series: [82, 88, 91, 96, 99, 112, 121] },
  ],
  findings: [
    { id: 'f1', severity: 'danger', title: '「再营销 — DTC」在反复触达同一批 3.8 万人', detail: '近 7 天频次 4.8，点击率下降 31%。花费 ¥1,110 仅带来 12 次转化。', evidence: '21 天数据 · 高置信度', impact: '¥412 / 周' },
    { id: 'f2', severity: 'warning', title: '「拉新 — 美国」受预算限制', detail: '该广告组连续 6 天在 15:00 前消耗了 98% 的日预算。', evidence: '14 天数据 · 高置信度', impact: '¥980 / 周' },
    { id: 'f3', severity: 'warning', title: '「广泛 — 澳洲」素材疲劳', detail: '前三素材投放均已超过 12 天，CPM 上涨 22%。', evidence: '9 天数据 · 中等置信度', impact: '¥210 / 周' },
    { id: 'f4', severity: 'info', title: '2 个新广告组仍处于学习期', detail: '还需 30 次转化，结果才具备参考价值。', evidence: '4 天数据 · 低置信度', impact: '—' },
  ],
  campaigns: [
    { id: 'c1', name: '拉新 — 美国', platform: 'Meta', status: '投放中', tone: 'success', spend: '¥12,480.00', cpa: '¥41.20', roas: '3.14', delta: -18.4, series: [52,49,51,47,45,44,41] },
    { id: 'c2', name: '再营销 — DTC', platform: 'Meta', status: '已标记', tone: 'warning', spend: '¥1,109.50', cpa: '¥88.05', roas: '0.92', delta: 22.1, series: [60,64,69,72,78,84,88] },
    { id: 'c3', name: '广泛 — 澳洲', platform: 'Meta', status: '自动驾驶', tone: 'ai', spend: '¥980.00', cpa: '¥29.99', roas: '2.07', delta: -4.2, series: [33,32,31,31,30,30,29] },
    { id: 'c4', name: '品牌搜索 — 美国', platform: 'Google', status: '投放中', tone: 'success', spend: '¥6,204.10', cpa: '¥12.44', roas: '6.81', delta: -2.1, series: [13,13,12.8,12.6,12.5,12.4,12.44] },
    { id: 'c5', name: 'PMax — 商品目录', platform: 'Google', status: '学习期', tone: 'info', spend: '¥3,880.00', cpa: '¥54.90', roas: '1.61', delta: 8.4, series: [48,50,51,52,53,54,54.9] },
    { id: 'c6', name: '相似人群 3% — 欧洲', platform: 'Meta', status: '已暂停', tone: 'neutral', spend: '¥0.00', cpa: '—', roas: '—', delta: 0, series: [40,40,40,40,40,40,40] },
  ],
  activity: [
    { stage: 'execute', title: '已暂停「再营销 — DTC」中的 3 个广告组', detail: 'ROAS 连续 5 天低于 0.8', meta: '预计每周节省 ¥412', time: '14:02' },
    { stage: 'strategise', title: '建议调整预算', detail: '每日 ¥1,200 从「再营销 — DTC」转向「拉新 — 美国」', meta: '高置信度 · 21 天数据', time: '13:51' },
    { stage: 'diagnose', title: '检测到人群重叠', detail: '3.8 万用户频次达 4.8，点击率持续下滑', time: '13:44' },
    { stage: 'learn', title: '已回滚素材轮播实验', detail: '72 小时后 CPA 无显著差异', meta: 'p = 0.41', time: '09:20' },
    { stage: 'alert', title: 'Google Ads 授权将在 3 天后过期', detail: '授权过期后自动变更将暂停', time: '昨天' },
  ],
  connections: [
    { id: 'meta', name: 'Meta Ads', account: 'act_884120735', status: '已连接', tone: 'success', synced: '2 分钟前' },
    { id: 'google', name: 'Google Ads', account: '412-889-0021', status: '3 天后过期', tone: 'warning', synced: '6 分钟前' },
    { id: 'ga4', name: 'GA4', account: 'properties/318842', status: '已连接', tone: 'success', synced: '1 小时前' },
    { id: 'shopify', name: 'Shopify', account: 'northwind-dtc', status: '未连接', tone: 'neutral', synced: '—' },
  ],
};
