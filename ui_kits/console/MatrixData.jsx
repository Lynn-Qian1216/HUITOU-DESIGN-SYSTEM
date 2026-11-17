(() => {
/* 投放矩阵的数据与共用计算。放一处，四个分步文件都读它。 */

const MIN_SIZE = 50000;

const AUDIENCES = [
  { id: 'a1', name: '近 30 天加购未购', size: 1840000, state: 'ok' },
  { id: 'a2', name: '藤椒味复购客', size: 262000, state: 'ok' },
  { id: 'a3', name: '虎皮凤爪高价值客', size: 96000, state: 'ok' },
  { id: 'a4', name: '零食兴趣泛人群', size: 4120000, state: 'ok' },
  { id: 'a5', name: '直播间互动未转化', size: 38000, state: 'thin' },
  { id: 'a6', name: '竞品浏览人群', size: 730000, state: 'stale' },
];

const CREATIVES = [
  { id: 'c1', name: '一口脆到底 · 15s 竖版 A', review: '可投' },
  { id: 'c2', name: '0 泡发 · 30s 剧情 B', review: '可投' },
  { id: 'c3', name: '办公室零嘴 · 9s 快剪 C', review: '可投' },
  { id: 'c4', name: '晚八点解馋 · 口播 D', review: '审核中' },
  { id: 'c5', name: '一次囤够 · 开箱 E', review: '未通过' },
];

const PLACEMENTS = [
  { id: 'p1', name: '朋友圈' },
  { id: 'p2', name: '视频号' },
  { id: 'p3', name: '公众号' },
  { id: 'p4', name: '小程序' },
];

/* 出价作为变量时是几个档位，不是一个数 —— 试探哪个价位能买到量，是这一页存在的理由之一。 */
const BIDS = [
  { id: 'b1', name: '¥32', note: '低价试探' },
  { id: 'b2', name: '¥36', note: '基准' },
  { id: 'b3', name: '¥40', note: '抢量' },
];

const BLOCKED = {
  thin: '规模低于 5 万可投下限',
  stale: '超过建议更新周期',
  审核中: '创意仍在审核，通过后才能投',
  未通过: '创意未通过审核',
};

/* 营销内容这一段的字段与取值跟腾讯营销后台对齐 —— 投手在两边来回切，
   同一件事换个说法就得重新对照一遍。 */
const GOALS = [
  { id: 'g1', name: '商品销售', icon: 'shopping-bag' },
  { id: 'g2', name: '品牌宣传', icon: 'megaphone' },
  { id: 'g3', name: '加粉互动', icon: 'message-circle-heart' },
  { id: 'g4', name: '线索留资', icon: 'clipboard-list' },
  { id: 'g5', name: '用户增长', icon: 'user-plus' },
];
const PRODUCT_TYPES = ['电商商品', '金融产品', '应用', '小程序'];
const PRODUCTS = ['王小卤虎皮鸡爪 · 藤椒味 · 礼盒装', '王小卤虎皮凤爪 · 原味 · 100g', '王小卤鸭脖 · 藤椒味', '平安产险家养宠物责任保险-均分'];
const MEDIA = ['Android 应用', 'iOS 应用', '页面跳转', '视频号动态', '视频号直播', '视频号直播预约', '微信公众号'];
const CONVERSIONS = [
  '下单-商详页:浏览商品-提交订单',
  '加购-商详页:浏览商品-加入购物车',
  '表单预约-自定义 H5 落地页:浏览页面-提交表单',
  '添加企微-企微加粉页:浏览页面-添加成功',
  '表单预约-萌宠2-自定义 H5 落地页:浏览页面-提交表单-低价险支付',
];

/* 账户里已有的营销单元，供「引用」一键带入营销内容 */
const EXISTING_UNIT = {
  name: '8.23.1 宠物责任险 AIM 测试',
  goal: '线索留资', productType: '金融产品', product: '平安产险家养宠物责任保险-均分',
  store: false, media: '页面跳转', conversion: '表单预约-萌宠2-自定义 H5 落地页:浏览页面-提交表单-低价险支付',
  cpaBasis: '表单预约',
};
const CARRIERS = ['藤椒味主推页', '原味主推页', '王小卤官方小程序 · 商详', '小程序 · 领券页'];
const CATEGORIES = ['休闲零食', '生鲜食品', '保健食品', '日用百货'];
const PATHS = ['看到广告 → 进商详 → 下单', '看到广告 → 领券 → 下单', '看到广告 → 留电 → 电话回访', '看到广告 → 加企微 → 私域成交'];

/* 营销单元的五块设置，取值跟腾讯后台对齐。
   这里只有四个维度能进矩阵（版位 / 定向 / 出价 / 创意），其余是整批固定值 ——
   把二十来个字段都做成可变量，条数会失控，也不是投手真正想控制的东西。 */
const UNIT = {
  placeModes: ['智能版位', '手动版位'],
  billings: ['oCPM', 'oCPC', 'oCPA', 'CPM', 'CPC', 'CPA'],
  bidTypes: ['稳定拿量', '最大转化量投放'],
  budgetModes: ['不限', '指定日预算'],
  targetModes: ['智能定向', '手动定向'],
  geos: ['不限', '按区域', '从地图选择'],
  ages: ['不限', '14~18 岁', '19~24 岁', '25~29 岁', '30~39 岁', '40~49 岁', '50 岁及以上'],
  dateModes: ['指定开始及结束日期', '长期投放'],
  timeModes: ['全天', '指定开始和结束时间', '指定多个时段'],
};

const blockOf = (kind, x) => {
  if (kind === 'audience') return x.state === 'ok' ? null : BLOCKED[x.state];
  if (kind === 'creative') return x.review === '可投' ? null : BLOCKED[x.review];
  return null;
};

const fmtSize = (n) => (n >= 10000 ? (n / 10000).toFixed(n >= 1000000 ? 0 : 1) + ' 万' : n.toLocaleString());

/* 四个维度，每个要么固定一个值（不进矩阵），要么作为变量取多个值。
   条数 = 各维度取值数相乘 —— 这个乘法就是用户在这一页真正要控制的东西。 */
const DIMS = [
  { key: 'audience', label: '定向人群', items: AUDIENCES, icon: 'users' },
  { key: 'creative', label: '创意', items: CREATIVES, icon: 'image' },
  { key: 'placement', label: '投放版位', items: PLACEMENTS, icon: 'layout-grid' },
  { key: 'bid', label: '出价', items: BIDS, icon: 'gauge' },
];

function itemsOf(key) {
  const d = DIMS.find((x) => x.key === key);
  return d ? d.items : [];
}

/* 笛卡尔积。每格要么是一条待建计划，要么带着不能建的原因。 */
function buildCells(dims) {
  let rows = [{}];
  for (const d of DIMS) {
    const sel = itemsOf(d.key).filter((x) => dims[d.key].values.includes(x.id));
    if (!sel.length) return [];
    rows = rows.flatMap((r) => sel.map((x) => Object.assign({}, r, { [d.key]: x })));
  }
  return rows.map((r) => {
    const reason = blockOf('audience', r.audience) || blockOf('creative', r.creative);
    return Object.assign({}, r, { reason });
  });
}

const planName = (batch, r) => [batch || '未命名批次', r.audience.name, r.creative.name.split(' · ')[0], r.placement.name, r.bid.name].join(' · ');

Object.assign(window, {
  MATRIX: { AUDIENCES, CREATIVES, PLACEMENTS, BIDS, BLOCKED, CARRIERS, GOALS, PRODUCT_TYPES, PRODUCTS, MEDIA, CONVERSIONS, CATEGORIES, PATHS, DIMS, UNIT, EXISTING_UNIT, MIN_SIZE },
  matrixHelpers: { blockOf, fmtSize, itemsOf, buildCells, planName },
});
})();
