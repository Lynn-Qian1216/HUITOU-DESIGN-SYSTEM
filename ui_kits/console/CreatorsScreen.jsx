(() => {
const { Icon, IconButton, Button, Badge, Card, Divider, StatusDot, StatDelta, Input, Select, FilterSelect, Tabs, EmptyState, Pagination, DropdownMenu, Popover, Dialog, Avatar, ProgressBar, Alert, FormField } = window.HUITOUAIDesignSystem_52606d;
const { StickyFooter, TableFrame, ListShell, AskButton } = window;

/* 达人：分销计划（按导入批次跟踪各达人分销阶段）+ 授权状态（巨量千川授权） */

/* 头像占位图：assets/placeholders/avatar-*.png，按 id 稳定取图，替换同名文件即可换成真实头像 */
const AVATAR_N = 8;
const avatarOf = (seed) => {
  let h = 0;
  for (let i = 0; i < String(seed).length; i++) h = (h * 31 + String(seed).charCodeAt(i)) % 9973;
  return (window.__res ? window.__res('../../assets/placeholders/avatar-' + ((h % AVATAR_N) + 1) + '.png') : '../../assets/placeholders/avatar-' + ((h % AVATAR_N) + 1) + '.png');
};

/* 当前进度：四个节点，每个节点有「进行中」与「已完成」两态。
   pending 表示该节点正在处理（截图中的粉点），done 表示已通过（绿点）。 */
const STEPS = ['申请合作', '商品授权', '建广告', '投放中'];

/* 批次内每位达人的状态归类，对应截图里的五列计数 */
const BATCH_STATE = { done: '完成', failed: '失败', paused: '暂停', running: '进行中', idle: '未开始' };
const STATE_TONE = { 完成: 'success', 失败: 'danger', 暂停: 'warning', 进行中: 'info', 未开始: null };
const stateOf = (c) => {
  if (c.progress === 'idle') return '未开始';
  if (c.progress === 'live') return c.run === '进行中' ? '完成' : '暂停';
  if (PROGRESS[c.progress].state === 'pending') return c.run === '进行中' ? '进行中' : '失败';
  return '进行中';
};

const PROGRESS = {
  idle:      { at: 0, state: 'idle',    label: '待启动' },
  applying:  { at: 0, state: 'pending', label: '申请合作' },
  applied:   { at: 0, state: 'done',    label: '成功合作' },
  authing:   { at: 1, state: 'pending', label: '商品授权' },
  authed:    { at: 1, state: 'done',    label: '商品已授权' },
  building:  { at: 2, state: 'pending', label: '建广告' },
  live:      { at: 3, state: 'done',    label: '投放中' },
};

const BATCHES = [
  {
    id: 'b3', name: '618 大促 · 头部达人', file: '618头部达人名单.xlsx', imported: '06-11 09:20', by: '天了噜鸭梨',
    status: '进行中', gmv: '¥86,420', spend: '¥24,180',
    creators: [
      { id: 'c1', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', run: '进行中', product: '虎皮凤爪-香辣味', sku: '0000000000000000000', progress: 'idle', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
      { id: 'c2', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', run: '进行中', product: '虎皮凤爪-香辣味', sku: '0000000000000000000', progress: 'applying', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
      { id: 'c3', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', run: '进行中', product: '虎皮凤爪-香辣味', sku: '0000000000000000000', progress: 'applied', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
      { id: 'c4', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', run: '进行中', product: '虎皮凤爪-香辣味', sku: '0000000000000000000', progress: 'authing', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
      { id: 'c5', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', run: '进行中', product: '虎皮凤爪-香辣味', sku: '0000000000000000000', progress: 'authed', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
      { id: 'c6', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', run: '未启动', product: '虎皮凤爪-香辣味', sku: '0000000000000000000', progress: 'building', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
      { id: 'c7', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', run: '未启动', product: '虎皮凤爪-香辣味', sku: '0000000000000000000', progress: 'live', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
      { id: 'c8', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', run: '未启动', product: '虎皮凤爪-香辣味', sku: '0000000000000000000', progress: 'live', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
    ],
  },
  {
    id: 'b2', name: '藤椒味新品试销', file: '新品达人_0801.xlsx', imported: '08-01 14:05', by: '天了噜鸭梨',
    status: '进行中', gmv: '¥21,660', spend: '¥9,240',
    creators: [
      { id: 'd1', name: '不二の零食铺子', douyin: '00000000001', code: '00000000101', run: '进行中', product: '去骨鸡爪-藤椒味', sku: '0000000000000000021', progress: 'live', baseRoi: '2.0', targetRoi: '2.3', budget: '¥800', rate: '6%' },
      { id: 'd2', name: '阿妍解馋记', douyin: '00000000002', code: '00000000102', run: '进行中', product: '去骨鸡爪-藤椒味', sku: '0000000000000000021', progress: 'building', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
      { id: 'd3', name: '轻食日记', douyin: '00000000003', code: '00000000103', run: '未启动', product: '去骨鸡爪-藤椒味', sku: '0000000000000000021', progress: 'authing', baseRoi: '2.0', targetRoi: '2.0', budget: '¥500', rate: '5%' },
    ],
  },
  {
    id: 'b1', name: '5 月常规分销', file: '5月达人批次.xlsx', imported: '05-06 10:12', by: '林招',
    status: '已完成', gmv: '¥142,300', spend: '¥52,870',
    creators: [
      { id: 'e1', name: '小胡过家家', douyin: '00000000004', code: '00000000104', run: '进行中', product: '虎皮凤爪-original', sku: '0000000000000000033', progress: 'live', baseRoi: '2.0', targetRoi: '2.4', budget: '¥1,500', rate: '5%' },
      { id: 'e2', name: '糯糯食光', douyin: '00000000005', code: '00000000105', run: '进行中', product: '虎皮凤爪-original', sku: '0000000000000000033', progress: 'live', baseRoi: '2.0', targetRoi: '2.4', budget: '¥2,000', rate: '7%' },
    ],
  },
  {
    id: 'b4', name: '5 月常规分销 · 补投', file: '5月达人批次_补.xlsx', imported: '05-18 11:40', by: '林招',
    status: '已完成', gmv: '¥12,100', spend: '¥4,200',
    creators: [{id: 'b4_0',name: '吃货小丸子',douyin: '20000000000',code: '30000000000',run: '进行中',product: '虎皮凤爪-香辣味',sku: '3825727183331131000',progress: 'live',baseRoi: '1.5',targetRoi: '2.0',budget: '¥500',rate: '5%'},{id: 'b4_1',name: '悦悦的低卡好物',douyin: '20000000001',code: '30000000001',run: '进行中',product: '去骨鸡爪-藤椒味',sku: '3825727183331131000',progress: 'live',baseRoi: '2.0',targetRoi: '2.3',budget: '¥800',rate: '6%'},{id: 'b4_2',name: '小胡过家家',douyin: '20000000002',code: '30000000002',run: '未启动',product: '虎皮凤爪-original',sku: '3825727183331131000',progress: 'building',baseRoi: '2.2',targetRoi: '2.4',budget: '¥1,200',rate: '7%'}],
  },
  {
    id: 'b5', name: '直播间引流 · 6 月', file: '直播达人_0601.xlsx', imported: '06-01 09:05', by: '天了噜鸭梨',
    status: '进行中', gmv: '¥19,113', spend: '¥7,217',
    creators: [{id: 'b5_0',name: '悦悦的低卡好物',douyin: '20000000100',code: '30000000100',run: '进行中',product: '去骨鸡爪-藤椒味',sku: '3825727183331131000',progress: 'authing',baseRoi: '2.0',targetRoi: '2.3',budget: '¥800',rate: '6%'},{id: 'b5_1',name: '小胡过家家',douyin: '20000000101',code: '30000000101',run: '未启动',product: '虎皮凤爪-original',sku: '3825727183331131000',progress: 'applied',baseRoi: '2.2',targetRoi: '2.4',budget: '¥1,200',rate: '7%'},{id: 'b5_2',name: '轻食日记',douyin: '20000000102',code: '30000000102',run: '进行中',product: '脆笋-原味',sku: '3825727183331131000',progress: 'idle',baseRoi: '1.5',targetRoi: '2.6',budget: '¥1,500',rate: '5%'},{id: 'b5_3',name: '阿妍解馋记',douyin: '20000000103',code: '30000000103',run: '进行中',product: '虎皮凤爪-香辣味',sku: '3825727183331131000',progress: 'applying',baseRoi: '2.0',targetRoi: '2.0',budget: '¥500',rate: '6%'}],
  },
  {
    id: 'b6', name: '会员召回 · 秋季', file: '会员召回名单.xlsx', imported: '06-05 16:22', by: '林招',
    status: '进行中', gmv: '¥26,126', spend: '¥10,234',
    creators: [{id: 'b6_0',name: '小胡过家家',douyin: '20000000200',code: '30000000200',run: '未启动',product: '虎皮凤爪-original',sku: '3825727183331131000',progress: 'applying',baseRoi: '2.2',targetRoi: '2.4',budget: '¥1,200',rate: '7%'},{id: 'b6_1',name: '轻食日记',douyin: '20000000201',code: '30000000201',run: '进行中',product: '脆笋-原味',sku: '3825727183331131000',progress: 'authed',baseRoi: '1.5',targetRoi: '2.6',budget: '¥1,500',rate: '5%'},{id: 'b6_2',name: '阿妍解馋记',douyin: '20000000202',code: '30000000202',run: '进行中',product: '虎皮凤爪-香辣味',sku: '3825727183331131000',progress: 'live',baseRoi: '2.0',targetRoi: '2.0',budget: '¥500',rate: '6%'},{id: 'b6_3',name: '糯糯食光',douyin: '20000000203',code: '30000000203',run: '未启动',product: '去骨鸡爪-藤椒味',sku: '3825727183331131000',progress: 'live',baseRoi: '2.2',targetRoi: '2.3',budget: '¥800',rate: '7%'},{id: 'b6_4',name: '不二の零食铺子',douyin: '20000000204',code: '30000000204',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131000',progress: 'building',baseRoi: '1.5',targetRoi: '2.4',budget: '¥1,200',rate: '5%'}],
  },
  {
    id: 'b7', name: '虎皮凤爪 · 中腰部矩阵', file: '中腰部达人_0610.xlsx', imported: '06-10 10:15', by: '天了噜鸭梨',
    status: '进行中', gmv: '¥33,139', spend: '¥13,251',
    creators: [{id: 'b7_0',name: '轻食日记',douyin: '20000000300',code: '30000000300',run: '进行中',product: '脆笋-原味',sku: '3825727183331131000',progress: 'live',baseRoi: '1.5',targetRoi: '2.6',budget: '¥1,500',rate: '5%'},{id: 'b7_1',name: '阿妍解馋记',douyin: '20000000301',code: '30000000301',run: '进行中',product: '虎皮凤爪-香辣味',sku: '3825727183331131000',progress: 'building',baseRoi: '2.0',targetRoi: '2.0',budget: '¥500',rate: '6%'},{id: 'b7_2',name: '糯糯食光',douyin: '20000000302',code: '30000000302',run: '未启动',product: '去骨鸡爪-藤椒味',sku: '3825727183331131000',progress: 'authing',baseRoi: '2.2',targetRoi: '2.3',budget: '¥800',rate: '7%'},{id: 'b7_3',name: '不二の零食铺子',douyin: '20000000303',code: '30000000303',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131000',progress: 'applied',baseRoi: '1.5',targetRoi: '2.4',budget: '¥1,200',rate: '5%'},{id: 'b7_4',name: '吃货小丸子',douyin: '20000000304',code: '30000000304',run: '进行中',product: '脆笋-原味',sku: '3825727183331131000',progress: 'idle',baseRoi: '2.0',targetRoi: '2.6',budget: '¥1,500',rate: '6%'},{id: 'b7_5',name: '悦悦的低卡好物',douyin: '20000000305',code: '30000000305',run: '未启动',product: '虎皮凤爪-香辣味',sku: '3825727183331131000',progress: 'applying',baseRoi: '2.2',targetRoi: '2.0',budget: '¥500',rate: '7%'}],
  },
  {
    id: 'b8', name: '藤椒味 · 二轮试销', file: '新品达人_0815.xlsx', imported: '08-15 14:30', by: '天了噜鸭梨',
    status: '进行中', gmv: '¥40,152', spend: '¥16,268',
    creators: [{id: 'b8_0',name: '阿妍解馋记',douyin: '20000000400',code: '30000000400',run: '进行中',product: '虎皮凤爪-香辣味',sku: '3825727183331131000',progress: 'applied',baseRoi: '2.0',targetRoi: '2.0',budget: '¥500',rate: '6%'},{id: 'b8_1',name: '糯糯食光',douyin: '20000000401',code: '30000000401',run: '未启动',product: '去骨鸡爪-藤椒味',sku: '3825727183331131000',progress: 'idle',baseRoi: '2.2',targetRoi: '2.3',budget: '¥800',rate: '7%'},{id: 'b8_2',name: '不二の零食铺子',douyin: '20000000402',code: '30000000402',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131000',progress: 'applying',baseRoi: '1.5',targetRoi: '2.4',budget: '¥1,200',rate: '5%'},{id: 'b8_3',name: '吃货小丸子',douyin: '20000000403',code: '30000000403',run: '进行中',product: '脆笋-原味',sku: '3825727183331131000',progress: 'authed',baseRoi: '2.0',targetRoi: '2.6',budget: '¥1,500',rate: '6%'},{id: 'b8_4',name: '悦悦的低卡好物',douyin: '20000000404',code: '30000000404',run: '未启动',product: '虎皮凤爪-香辣味',sku: '3825727183331131000',progress: 'live',baseRoi: '2.2',targetRoi: '2.0',budget: '¥500',rate: '7%'},{id: 'b8_5',name: '小胡过家家',douyin: '20000000405',code: '30000000405',run: '进行中',product: '去骨鸡爪-藤椒味',sku: '3825727183331131000',progress: 'live',baseRoi: '1.5',targetRoi: '2.3',budget: '¥800',rate: '5%'},{id: 'b8_6',name: '轻食日记',douyin: '20000000406',code: '30000000406',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131000',progress: 'building',baseRoi: '2.0',targetRoi: '2.4',budget: '¥1,200',rate: '6%'}],
  },
  {
    id: 'b9', name: '组合装 · 大促预热', file: '组合装达人.xlsx', imported: '05-12 08:50', by: '林招',
    status: '已完成', gmv: '¥47,165', spend: '¥19,285',
    creators: [{id: 'b9_0',name: '糯糯食光',douyin: '20000000500',code: '30000000500',run: '未启动',product: '去骨鸡爪-藤椒味',sku: '3825727183331131000',progress: 'authed',baseRoi: '2.2',targetRoi: '2.3',budget: '¥800',rate: '7%'},{id: 'b9_1',name: '不二の零食铺子',douyin: '20000000501',code: '30000000501',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131000',progress: 'live',baseRoi: '1.5',targetRoi: '2.4',budget: '¥1,200',rate: '5%'},{id: 'b9_2',name: '吃货小丸子',douyin: '20000000502',code: '30000000502',run: '进行中',product: '脆笋-原味',sku: '3825727183331131000',progress: 'live',baseRoi: '2.0',targetRoi: '2.6',budget: '¥1,500',rate: '6%'}],
  },
  {
    id: 'b10', name: '素食零食 · 新客', file: '素食达人_0620.xlsx', imported: '06-20 13:05', by: '林招',
    status: '进行中', gmv: '¥54,178', spend: '¥22,302',
    creators: [{id: 'b10_0',name: '不二の零食铺子',douyin: '20000000600',code: '30000000600',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131000',progress: 'building',baseRoi: '1.5',targetRoi: '2.4',budget: '¥1,200',rate: '5%'},{id: 'b10_1',name: '吃货小丸子',douyin: '20000000601',code: '30000000601',run: '进行中',product: '脆笋-原味',sku: '3825727183331131000',progress: 'authing',baseRoi: '2.0',targetRoi: '2.6',budget: '¥1,500',rate: '6%'},{id: 'b10_2',name: '悦悦的低卡好物',douyin: '20000000602',code: '30000000602',run: '未启动',product: '虎皮凤爪-香辣味',sku: '3825727183331131000',progress: 'applied',baseRoi: '2.2',targetRoi: '2.0',budget: '¥500',rate: '7%'},{id: 'b10_3',name: '小胡过家家',douyin: '20000000603',code: '30000000603',run: '进行中',product: '去骨鸡爪-藤椒味',sku: '3825727183331131000',progress: 'idle',baseRoi: '1.5',targetRoi: '2.3',budget: '¥800',rate: '5%'}],
  },
  {
    id: 'b11', name: '虎皮凤爪 · 头部续约', file: '头部续约名单.xlsx', imported: '07-02 17:40', by: '天了噜鸭梨',
    status: '进行中', gmv: '¥61,191', spend: '¥25,319',
    creators: [{id: 'b11_0',name: '吃货小丸子',douyin: '20000000700',code: '30000000700',run: '进行中',product: '脆笋-原味',sku: '3825727183331131400',progress: 'idle',baseRoi: '2.0',targetRoi: '2.6',budget: '¥1,500',rate: '6%'},{id: 'b11_1',name: '悦悦的低卡好物',douyin: '20000000701',code: '30000000701',run: '未启动',product: '虎皮凤爪-香辣味',sku: '3825727183331131400',progress: 'applying',baseRoi: '2.2',targetRoi: '2.0',budget: '¥500',rate: '7%'},{id: 'b11_2',name: '小胡过家家',douyin: '20000000702',code: '30000000702',run: '进行中',product: '去骨鸡爪-藤椒味',sku: '3825727183331131400',progress: 'authed',baseRoi: '1.5',targetRoi: '2.3',budget: '¥800',rate: '5%'},{id: 'b11_3',name: '轻食日记',douyin: '20000000703',code: '30000000703',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131400',progress: 'live',baseRoi: '2.0',targetRoi: '2.4',budget: '¥1,200',rate: '6%'},{id: 'b11_4',name: '阿妍解馋记',douyin: '20000000704',code: '30000000704',run: '未启动',product: '脆笋-原味',sku: '3825727183331131400',progress: 'live',baseRoi: '2.2',targetRoi: '2.6',budget: '¥1,500',rate: '7%'}],
  },
  {
    id: 'b12', name: '去骨鸡爪 · 站内测款', file: '测款达人_0705.xlsx', imported: '07-05 09:30', by: '林招',
    status: '已完成', gmv: '¥68,204', spend: '¥28,336',
    creators: [{id: 'b12_0',name: '悦悦的低卡好物',douyin: '20000000800',code: '30000000800',run: '未启动',product: '虎皮凤爪-香辣味',sku: '3825727183331131400',progress: 'live',baseRoi: '2.2',targetRoi: '2.0',budget: '¥500',rate: '7%'},{id: 'b12_1',name: '小胡过家家',douyin: '20000000801',code: '30000000801',run: '进行中',product: '去骨鸡爪-藤椒味',sku: '3825727183331131400',progress: 'live',baseRoi: '1.5',targetRoi: '2.3',budget: '¥800',rate: '5%'},{id: 'b12_2',name: '轻食日记',douyin: '20000000802',code: '30000000802',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131400',progress: 'building',baseRoi: '2.0',targetRoi: '2.4',budget: '¥1,200',rate: '6%'},{id: 'b12_3',name: '阿妍解馋记',douyin: '20000000803',code: '30000000803',run: '未启动',product: '脆笋-原味',sku: '3825727183331131400',progress: 'authing',baseRoi: '2.2',targetRoi: '2.6',budget: '¥1,500',rate: '7%'},{id: 'b12_4',name: '糯糯食光',douyin: '20000000804',code: '30000000804',run: '进行中',product: '虎皮凤爪-香辣味',sku: '3825727183331131400',progress: 'applied',baseRoi: '1.5',targetRoi: '2.0',budget: '¥500',rate: '5%'},{id: 'b12_5',name: '不二の零食铺子',douyin: '20000000805',code: '30000000805',run: '进行中',product: '去骨鸡爪-藤椒味',sku: '3825727183331131400',progress: 'idle',baseRoi: '2.0',targetRoi: '2.3',budget: '¥800',rate: '6%'}],
  },
  {
    id: 'b13', name: '双十一 · 预沟通', file: '双11达人预沟通.xlsx', imported: '08-10 11:11', by: '天了噜鸭梨',
    status: '进行中', gmv: '¥75,217', spend: '¥31,353',
    creators: [{id: 'b13_0',name: '小胡过家家',douyin: '20000000900',code: '30000000900',run: '进行中',product: '去骨鸡爪-藤椒味',sku: '3825727183331131400',progress: 'authing',baseRoi: '1.5',targetRoi: '2.3',budget: '¥800',rate: '5%'},{id: 'b13_1',name: '轻食日记',douyin: '20000000901',code: '30000000901',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131400',progress: 'applied',baseRoi: '2.0',targetRoi: '2.4',budget: '¥1,200',rate: '6%'},{id: 'b13_2',name: '阿妍解馋记',douyin: '20000000902',code: '30000000902',run: '未启动',product: '脆笋-原味',sku: '3825727183331131400',progress: 'idle',baseRoi: '2.2',targetRoi: '2.6',budget: '¥1,500',rate: '7%'},{id: 'b13_3',name: '糯糯食光',douyin: '20000000903',code: '30000000903',run: '进行中',product: '虎皮凤爪-香辣味',sku: '3825727183331131400',progress: 'applying',baseRoi: '1.5',targetRoi: '2.0',budget: '¥500',rate: '5%'},{id: 'b13_4',name: '不二の零食铺子',douyin: '20000000904',code: '30000000904',run: '进行中',product: '去骨鸡爪-藤椒味',sku: '3825727183331131400',progress: 'authed',baseRoi: '2.0',targetRoi: '2.3',budget: '¥800',rate: '6%'},{id: 'b13_5',name: '吃货小丸子',douyin: '20000000905',code: '30000000905',run: '未启动',product: '虎皮凤爪-original',sku: '3825727183331131400',progress: 'live',baseRoi: '2.2',targetRoi: '2.4',budget: '¥1,200',rate: '7%'},{id: 'b13_6',name: '悦悦的低卡好物',douyin: '20000000906',code: '30000000906',run: '进行中',product: '脆笋-原味',sku: '3825727183331131400',progress: 'live',baseRoi: '1.5',targetRoi: '2.6',budget: '¥1,500',rate: '5%'}],
  },
  {
    id: 'b14', name: '腾讯营销 · 视频号达人', file: '视频号达人_0801.xlsx', imported: '08-01 15:20', by: '林招',
    status: '进行中', gmv: '¥82,230', spend: '¥34,370',
    creators: [{id: 'b14_0',name: '轻食日记',douyin: '20000001000',code: '30000001000',run: '进行中',product: '虎皮凤爪-original',sku: '3825727183331131400',progress: 'applying',baseRoi: '2.0',targetRoi: '2.4',budget: '¥1,200',rate: '6%'},{id: 'b14_1',name: '阿妍解馋记',douyin: '20000001001',code: '30000001001',run: '未启动',product: '脆笋-原味',sku: '3825727183331131400',progress: 'authed',baseRoi: '2.2',targetRoi: '2.6',budget: '¥1,500',rate: '7%'},{id: 'b14_2',name: '糯糯食光',douyin: '20000001002',code: '30000001002',run: '进行中',product: '虎皮凤爪-香辣味',sku: '3825727183331131400',progress: 'live',baseRoi: '1.5',targetRoi: '2.0',budget: '¥500',rate: '5%'}],
  },
];

const AUTH_STATE = {
  live:    { tone: 'success', label: '授权生效' },
  waiting: { tone: 'warning', label: '待达人确认' },
  failed:  { tone: 'danger',  label: '授权失败' },
  none:    { tone: 'neutral', label: '未申请' },
};

const ROW_STATE = {
  done:    { tone: 'success', label: '授权完成' },
  ongoing: { tone: 'warning', label: '授权中' },
  error:   { tone: 'danger',  label: '异常' },
  idle:    { tone: 'neutral', label: '未申请' },
};

const AUTH = [
  { id: 'a1', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', plan: '王小卤 · 虎皮凤爪达人分销 06 批', batch: 'b3', creator: 'c1',
    douyinAuth: { state: 'live', type: '达人合作', period: '2026-06-20 ~ 2027-06-20' },
    adAuth: { state: 'live', type: '商品投放', period: '2026-06-20 ~ 长期' },
    rate: '5%', plans: 3, status: 'done' },
  { id: 'a2', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', plan: '王小卤 · 虎皮凤爪达人分销 06 批', batch: 'b3', creator: 'c4',
    douyinAuth: { state: 'waiting', type: '达人合作', period: '2026-06-20 ~ 2027-06-20' },
    adAuth: { state: 'waiting', type: '商品投放', period: '2026-06-20 ~ 长期' },
    rate: '5%', plans: 3, status: 'ongoing' },
  { id: 'a3', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', plan: '王小卤 · 虎皮凤爪达人分销 06 批', batch: 'b3', creator: 'c6',
    douyinAuth: { state: 'failed', type: '达人合作', period: '2026-06-20 ~ 2027-06-20' },
    adAuth: { state: 'failed', type: '直播投放', period: '--' },
    rate: '5%', plans: 3, status: 'error' },
  { id: 'a4', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', plan: '王小卤 · 虎皮凤爪达人分销 06 批', batch: 'b3', creator: 'c8',
    douyinAuth: { state: 'none', type: '--', period: '--' },
    adAuth: { state: 'none', type: '--', period: '--' },
    rate: '5%', plans: 3, status: 'idle' },
  { id: 'a5', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', plan: '藤椒味新品试销', batch: 'b2', creator: 'd1',
    douyinAuth: { state: 'live', type: '达人合作', period: '2026-06-20 ~ 2027-06-20' },
    adAuth: { state: 'live', type: '商品投放', period: '2026-06-20 ~ 长期' },
    rate: '5%', plans: 3, status: 'done' },
  { id: 'a6', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', plan: '藤椒味新品试销', batch: 'b2', creator: 'd2',
    douyinAuth: { state: 'live', type: '达人合作', period: '2026-06-20 ~ 2027-06-20' },
    adAuth: { state: 'live', type: '商品投放', period: '2026-06-20 ~ 长期' },
    rate: '5%', plans: 3, status: 'done' },
  { id: 'a7', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', plan: '5 月常规分销', batch: 'b1', creator: 'e1',
    douyinAuth: { state: 'live', type: '达人合作', period: '2026-06-20 ~ 2027-06-20' },
    adAuth: { state: 'live', type: '商品投放', period: '2026-06-20 ~ 长期' },
    rate: '5%', plans: 3, status: 'done' },
  { id: 'a8', name: '吃货小丸子', douyin: '00000000000', code: '00000000000', plan: '5 月常规分销', batch: 'b1', creator: 'e2',
    douyinAuth: { state: 'live', type: '达人合作', period: '2026-06-20 ~ 2027-06-20' },
    adAuth: { state: 'live', type: '商品投放', period: '2026-06-20 ~ 长期' },
    rate: '5%', plans: 3, status: 'done' },
];

function CreatorsScreen() {
  const [tab, setTab] = React.useState('plans');
  const [jump, setJump] = React.useState(null);   // { batch, creator }：从授权页跳到批次内的某位达人

  const goToCreator = (row) => {
    if (!row.batch) return;
    setJump({ batch: row.batch, creator: row.creator });
    setTab('plans');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
      <Tabs value={tab} onChange={(id) => { setTab(id); setJump(null); }}
        items={[{ id: 'plans', label: '达人分销计划', icon: 'users', count: BATCHES.length }, { id: 'auth', label: '达人授权状态', icon: 'shield-check', count: AUTH.length }]} />
      {tab === 'plans'
        ? <DistributionPlans jump={jump} onJumpDone={() => setJump(null)} />
        : <AuthStatus onOpenCreator={goToCreator} />}
    </div>
  );
}

/* ---------- 达人分销计划 ---------- */

function DistributionPlans({ jump, onJumpDone }) {
  const [openId, setOpenId] = React.useState(jump ? jump.batch : null);   // 非空则进入该批次的达人列表
  const [focus, setFocus] = React.useState(jump ? jump.creator : null);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(8);

  React.useEffect(() => {
    if (!jump) return;
    setOpenId(jump.batch);
    setFocus(jump.creator);
  }, [jump]);
  const [importing, setImporting] = React.useState(false);
  const [q, setQ] = React.useState('');
  const batches = BATCHES.filter((b) => !q || b.name.includes(q) || b.file.includes(q));
  const current = BATCHES.find((b) => b.id === openId);

  if (current) return <BatchDetail batch={current} focus={focus} onBack={() => { setOpenId(null); setFocus(null); onJumpDone && onJumpDone(); }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Input placeholder="搜索批次名称或文件名" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 200px', minWidth: 0 }} />
        <Button variant="primary" size="md" iconLeft="upload" onClick={() => setImporting(true)}>导入名单</Button>
      </div>

      <Alert tone="info" title="批次由 Excel 名单生成，导入后自动跟踪每位达人的分销阶段" />

      <BatchTable batches={batches} page={page} onPage={setPage} size={size} onSize={(n) => { setSize(n); setPage(1); }} onOpen={setOpenId} />

      <ImportDialog open={importing} onClose={() => setImporting(false)} />
    </div>
  );
}

/* 批次列表：一张卡片一个批次 —— 卡内两行，
   第一行是名称与来源，第二行是达人总数与五项状态计数；点卡片展开达人明细。 */
function BatchTable({ batches, page, onPage, size, onSize, onOpen }) {
  if (!batches.length) {
    return <Card><EmptyState compact icon="search-x" title="没有匹配的批次" description="换个关键词，或导入新的达人名单。" /></Card>;
  }
  const pageCount = Math.max(1, Math.ceil(batches.length / size));
  const at = Math.min(page, pageCount);
  const rows = batches.slice((at - 1) * size, at * size);
  return (
    <ListShell footer={<Pagination page={at} pageCount={pageCount} total={batches.length} onChange={onPage}
      pageSize={size} pageSizeOptions={[8, 20, 50]} onPageSizeChange={onSize} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minWidth: 0 }}>
        {rows.map((b) => <BatchCard key={b.id} batch={b} onOpen={() => onOpen(b.id)} />)}
      </div>
    </ListShell>
  );
}

function BatchCard({ batch: b, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const counts = Object.values(BATCH_STATE).reduce((m, label) => Object.assign(m, { [label]: 0 }), {});
  for (const c of b.creators) counts[stateOf(c)] += 1;
  return (
    <section style={{
      background: 'var(--surface-card)', borderRadius: 'var(--radius-card)', overflow: 'hidden', minWidth: 0,
      borderWidth: 1, borderStyle: 'solid', borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
    }}>
      <div onClick={onOpen} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          padding: 'var(--space-6) var(--gutter-card)', cursor: 'pointer',
          background: hover ? 'var(--surface-hover)' : 'transparent',
          transition: 'var(--transition-control)',
        }}>
        {/* 第一行：名称 · 来源 · 操作 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 2, fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', minWidth: 0 }}>
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                来源：<span style={{ fontFamily: 'var(--font-mono)' }}>{b.file}</span>
              </span>
              <span style={{ flex: 'none' }}>·</span>
              <span style={{ flex: 'none', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{b.imported}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 'none' }} onClick={(e) => e.stopPropagation()}>
            <Button variant="link" size="sm">全部暂停</Button>
            <DropdownMenu align="right" trigger={<IconButton icon="ellipsis" label="批次操作" size="sm" />} items={[
              { id: 'resume', label: '全部恢复', icon: 'circle-play' },
              { id: 'export', label: '导出批次', icon: 'download' },
              { id: 'refresh', label: '刷新进度', icon: 'refresh-cw' },
              { divider: true },
              { id: 'delete', label: '删除批次', icon: 'trash-2', tone: 'danger' },
            ]} />
            <Icon name="chevron-right" size={15} style={{ color: hover ? 'var(--text-primary)' : 'var(--text-tertiary)' }} />
          </div>
        </div>

        {/* 第二行：达人总数 + 五项状态计数 */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4) var(--space-7)', flexWrap: 'wrap', marginTop: 'var(--space-5)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5, fontSize: 'var(--fs-12)', whiteSpace: 'nowrap' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>达人总数</span>
            <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums' }}>{b.creators.length}</span>
          </span>
          <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)', flex: 'none' }} />
          {Object.values(BATCH_STATE).map((label) => <CountItem key={label} label={label} n={counts[label]} />)}
        </div>
      </div>

    </section>
  );
}

/* 计数：为零的整项转第三级灰，非零的按状态取色 —— 只在有意义时着色 */
function CountItem({ label, n }) {
  const tone = n ? STATE_TONE[label] : null;
  const color = n ? (tone ? 'var(--status-' + tone + '-fg)' : 'var(--text-primary)') : 'var(--text-tertiary)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5, fontSize: 'var(--fs-12)', whiteSpace: 'nowrap' }}>
      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <span style={{ fontSize: 'var(--fs-14)', fontWeight: n ? 'var(--fw-medium)' : 'var(--fw-regular)', fontVariantNumeric: 'tabular-nums', color: color }}>{n}</span>
    </span>
  );
}

/* 批次详情：返回 + 批次信息 + 状态计数 + 达人列表 */
function BatchDetail({ batch: b, focus, onBack }) {
  /* leaving 期间播放右移淡出，250ms 后才真正切回列表 */
  const [leaving, setLeaving] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(20);
  const back = () => {
    setLeaving(true);
    setTimeout(() => onBack && onBack(), 250);
  };
  const counts = Object.values(BATCH_STATE).reduce((m, label) => Object.assign(m, { [label]: 0 }), {});
  for (const c of b.creators) counts[stateOf(c)] += 1;
  const pageCount = Math.max(1, Math.ceil(b.creators.length / size));
  const at = Math.min(page, pageCount);
  /* 入场与右侧面板同一语汇：小幅左移 + 淡入 */
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setEntered(true), 16);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0,
      opacity: entered && !leaving ? 1 : 0,
      transform: entered && !leaving ? 'none' : 'translateX(16px)',
      transition: 'opacity 250ms var(--ease-standard), transform 250ms var(--ease-standard)',
      pointerEvents: leaving ? 'none' : 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', minWidth: 0 }}>
        <Button variant="secondary" size="sm" iconLeft="chevron-left" onClick={back}>返回批次列表</Button>
        <span style={{ flex: 1 }} />
        <Button variant="secondary" size="sm" iconLeft="refresh-cw">刷新进度</Button>
        <Button variant="secondary" size="sm" iconLeft="download">导出批次</Button>
      </div>

      <section style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-card)', padding: 'var(--gutter-card)', minWidth: 0,
        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', minWidth: 0 }}>
          <span style={{ fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-semibold)' }}>{b.name}</span>
          <Badge tone={b.status === '已完成' ? 'neutral' : 'success'} dot>{b.status}</Badge>
        </div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 3 }}>
          来源：<span style={{ fontFamily: 'var(--font-mono)' }}>{b.file}</span> · {b.imported} 由 {b.by} 导入
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4) var(--space-7)', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5, fontSize: 'var(--fs-12)', whiteSpace: 'nowrap' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>达人总数</span>
            <span style={{ fontSize: 'var(--fs-14)', fontWeight: 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums' }}>{b.creators.length}</span>
          </span>
          <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)', flex: 'none' }} />
          {Object.values(BATCH_STATE).map((label) => <CountItem key={label} label={label} n={counts[label]} />)}
        </div>
      </section>

      <TableFrame>
        <CreatorTable creators={b.creators.slice((at - 1) * size, at * size)} focus={focus} />
      </TableFrame>
      <StickyFooter>
        <Pagination page={at} pageCount={pageCount} total={b.creators.length} onChange={setPage}
          pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
      </StickyFooter>
    </div>
  );
}

function CreatorTable({ creators, focus }) {
  const [hover, setHover] = React.useState(null);
  const row = React.useRef(null);
  React.useEffect(() => {
    const el = row.current;
    if (!el || !focus) return;
    /* 只调整最近的滚动容器，不用 scrollIntoView */
    let sc = el.parentElement;
    while (sc && !/(auto|scroll)/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
    if (sc) sc.scrollTop = Math.max(0, el.offsetTop - sc.clientHeight / 3);
  }, [focus]);
  const th = {
    padding: '10px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap',
    fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-50)',
  };
  const td = { padding: 'var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' };
  return (
    <div style={{ minWidth: 0 }}>
      <table style={{ width: '100%', minWidth: 1020, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
        <thead>
          <tr>
            <th style={Object.assign({}, th, { minWidth: 210 })}>达人信息</th>
            <th style={Object.assign({}, th, { minWidth: 180 })}>商品信息</th>
            <th style={Object.assign({}, th, { width: 130 })}>当前进度</th>
            <th style={Object.assign({}, th, { minWidth: 160 })}>ROI</th>
            <th style={Object.assign({}, th, { width: 110 })}>日预算</th>
            <th style={Object.assign({}, th, { width: 110 })}>达人佣金率</th>
            <th style={Object.assign({}, th, { minWidth: 170 })}>操作</th>
          </tr>
        </thead>
        <tbody>
          {creators.map((c) => {
            const first = c.progress === 'idle';
            const on = focus === c.id;
            const live = hover === c.id;
            return (
              <tr key={c.id} ref={on ? row : null}
                onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)}
                style={{
                  background: on ? 'var(--status-info-bg)' : first ? 'var(--surface-selected)' : 'transparent',
                  boxShadow: on ? 'inset 2px 0 0 var(--status-info-fg)' : 'none',
                  transition: 'background-color var(--duration-slow) var(--ease-standard)',
                }}>
                <td style={td}><CreatorCell c={c} /></td>
                <td style={td}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 'var(--fw-medium)' }}>{c.product}</div>
                    <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>{c.sku}</div>
                  </div>
                </td>
                <td style={td}><ProgressCell progress={c.progress} /></td>
                <td style={td}><RoiCell c={c} editable={first} show={live} /></td>
                <td style={td}><EditableValue value={c.budget} editable={first} show={live} /></td>
                <td style={td}><EditableValue value={c.rate} editable={first} show={live} /></td>
                <td style={td}><RowActions running={c.run === '进行中'} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CreatorCell({ c }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', minWidth: 0 }}>
      <Avatar name={c.name} src={avatarOf(c.id)} size="lg" />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontWeight: 'var(--fw-semibold)' }}>{c.name}</span>
          <Badge tone={c.run === '进行中' ? 'info' : 'neutral'}>{c.run}</Badge>
          <AskButton kind="creator" label={c.name} hint={c.run} />
        </div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 4 }}>
          抖音号：<span style={{ fontFamily: 'var(--font-mono)' }}>{c.douyin}</span>
        </div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          合作码：<span style={{ fontFamily: 'var(--font-mono)' }}>{c.code}</span>
        </div>
      </div>
    </div>
  );
}

/* 四节点进度：已过的填实，当前节点按 pending／done 区分，未到的留空 */
function ProgressCell({ progress }) {
  const p = PROGRESS[progress];
  const dot = (i) => {
    if (p.state === 'idle') return { fill: 'var(--neutral-0)', border: 'var(--border-strong)' };
    if (i < p.at) return { fill: 'var(--status-success-fg)', border: 'var(--status-success-fg)' };
    if (i === p.at) return p.state === 'pending'
      ? { fill: 'var(--status-danger-fg)', border: 'var(--status-danger-fg)' }
      : { fill: 'var(--status-success-fg)', border: 'var(--status-success-fg)' };
    return { fill: 'var(--neutral-0)', border: 'var(--border-strong)' };
  };
  const done = (i) => p.state !== 'idle' && (i < p.at || (i === p.at && p.state === 'done'));
  const tone = p.state === 'idle' ? 'neutral' : p.state === 'pending' ? 'danger' : 'success';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {STEPS.map((s, i) => {
          const d = dot(i);
          return (
            <React.Fragment key={s}>
              {i ? <span style={{ width: 12, height: 1.5, background: done(i - 1) ? 'var(--status-success-fg)' : 'var(--border-default)' }} /> : null}
              <Popover placement="top" width={110} content={<span>{s}</span>}>
                <span style={{ width: 8, height: 8, borderRadius: 999, flex: 'none', background: d.fill, borderWidth: 1, borderStyle: 'solid', borderColor: d.border }} />
              </Popover>
            </React.Fragment>
          );
        })}
      </div>
      <Badge tone={tone}>{p.label}</Badge>
    </div>
  );
}

function RoiCell({ c, editable, show }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <RoiRow label="商品保本ROI" value={c.baseRoi} editable={editable} show={show} />
      <RoiRow label="计划目标ROI" value={c.targetRoi} editable={editable} show={show} />
    </div>
  );
}

/* 编辑按钮始终占位、仅切换可见性 —— 悬停时列宽不跳动 */
const editSlot = (show) => ({
  opacity: show ? 1 : 0,
  pointerEvents: show ? 'auto' : 'none',
  transition: 'opacity var(--duration-fast) var(--ease-standard)',
});

function RoiRow({ label, value, editable, show }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 'var(--fw-medium)' }}>{value}</span>
      {editable ? <IconButton icon="pencil" label={'修改' + label} size="sm" style={editSlot(show)} /> : null}
    </div>
  );
}

function EditableValue({ value, editable, show }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {editable ? <IconButton icon="pencil" label="修改" size="sm" style={editSlot(show)} /> : null}
    </span>
  );
}

function RowActions({ running }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <IconButton icon={running ? 'circle-pause' : 'circle-play'} label={running ? '暂停' : '启动'} size="sm" />
      <Button variant="link" size="sm">刷新进度</Button>
      <Button variant="link" size="sm">编辑</Button>
      <DropdownMenu align="right" trigger={<IconButton icon="ellipsis" label="更多操作" size="sm" />} items={[
        { id: 'home', label: '查看达人主页', icon: 'external-link' },
        { id: 'log', label: '查看进度日志', icon: 'history' },
        { divider: true },
        { id: 'drop', label: '移出批次', icon: 'user-minus', tone: 'danger' },
      ]} />
    </div>
  );
}

function ImportDialog({ open, onClose }) {
  return (
    <Dialog open={open} width={520} title="导入达人名单" description="上传 Excel 名单，HUITOU 生成新批次并按名单跟踪分销阶段。" onClose={onClose}
      footer={<>
        <Button onClick={onClose}>取消</Button>
        <Button variant="primary" iconLeft="upload" onClick={onClose}>生成批次</Button>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <FormField label="批次名称" hint="留空则使用文件名"><Input placeholder="例如：618 大促 · 头部达人" /></FormField>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)',
          padding: 'var(--space-9)', borderRadius: 'var(--radius-md)', background: 'var(--neutral-25)',
          borderWidth: 1, borderStyle: 'dashed', borderColor: 'var(--border-default)',
        }}>
          <Icon name="file-spreadsheet" size={20} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: 'var(--fs-13)' }}>拖入 .xlsx / .csv 文件，或</span>
          <Button variant="secondary" size="sm">选择文件</Button>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)' }}>需包含达人昵称、抖音号、联系方式三列</span>
        </div>
        <Button variant="link" size="sm" iconLeft="download">下载名单模板</Button>
      </div>
    </Dialog>
  );
}

/* ---------- 达人授权状态 ---------- */

function AuthStatus({ onOpenCreator }) {
  const [q, setQ] = React.useState('');
  const [batch, setBatch] = React.useState('选择批次状态');
  const [size, setSize] = React.useState(20);
  const [page, setPage] = React.useState(1);
  const rows = AUTH.filter((a) => {
    if (q && !(a.name.includes(q) || a.douyin.includes(q))) return false;
    if (batch !== '选择批次状态' && ROW_STATE[a.status].label !== batch) return false;
    return true;
  });
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const at = Math.min(page, pageCount);
  const th = {
    padding: '12px var(--space-6)', textAlign: 'left', whiteSpace: 'nowrap',
    fontSize: 'var(--fs-13)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)', background: 'var(--neutral-25)',
  };
  const td = { padding: 'var(--space-6)', whiteSpace: 'nowrap', verticalAlign: 'middle', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border-subtle)' };
  return (
    <>
    <Card padded={false}>
      {/* 工具条：搜索 · 批次状态 · 刷新 · 日期区间 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-6) var(--gutter-card)', flexWrap: 'wrap' }}>
        <Input placeholder="搜索达人名称/抖音号" iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: '1 1 200px', minWidth: 0, maxWidth: 260 }} />
        <FilterSelect value={batch} onChange={setBatch} width={150}
          options={['选择批次状态', '授权完成', '授权中', '异常', '未申请'].map((o) => ({ label: o, count: AUTH.filter((a) => (o === '选择批次状态' || ROW_STATE[a.status].label === o) && (!q || a.name.includes(q) || a.douyin.includes(q))).length }))} />
        <Button variant="secondary" size="md" iconLeft="refresh-cw">刷新</Button>
        <span style={{ flex: 1 }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', height: 'var(--control-h-md)',
          padding: '0 var(--space-5)', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--border-default)',
          fontSize: 'var(--fs-13)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', cursor: 'pointer',
        }}>
          <Icon name="calendar" size={14} style={{ color: 'var(--text-tertiary)' }} />
          2025-10-28
          <Icon name="chevron-right" size={12} style={{ color: 'var(--text-tertiary)' }} />
          2025-10-28
        </span>
      </div>

    </Card>

    <TableFrame>
        <table style={{ width: '100%', minWidth: 1060, borderCollapse: 'collapse', fontSize: 'var(--fs-13)' }}>
          <thead>
            <tr>
              <th style={Object.assign({}, th, { minWidth: 200 })}>达人信息</th>
              <th style={Object.assign({}, th, { minWidth: 170 })}>所属分销计划</th>
              <th style={Object.assign({}, th, { minWidth: 190 })}>抖音号授权</th>
              <th style={Object.assign({}, th, { minWidth: 190 })}>投放授权</th>
              <th style={Object.assign({}, th, { width: 110 })}>达人佣金率</th>
              <th style={Object.assign({}, th, { width: 120 })}>关联广告计划</th>
              <th style={Object.assign({}, th, { width: 110 })}>状态</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice((at - 1) * size, at * size).map((a) => (
              <tr key={a.id} {...rowHoverProps()}>
                <td style={td}><CreatorIdentity a={a} /></td>
                <td style={td}>
                  <div style={{ minWidth: 0, maxWidth: 170 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.plan}</div>
                    <Button variant="link" size="sm" style={{ marginTop: 2 }} iconRight="arrow-right" onClick={() => onOpenCreator && onOpenCreator(a)}>查看详情</Button>
                  </div>
                </td>
                <td style={td}><AuthCell auth={a.douyinAuth} /></td>
                <td style={td}><AuthCell auth={a.adAuth} /></td>
                <td style={td}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{a.rate}</span>
                    <IconButton icon="pencil" label="修改佣金率" size="sm" />
                  </span>
                </td>
                <td style={td}>
                  <div>
                    <div style={{ fontVariantNumeric: 'tabular-nums' }}>{a.plans}个计划</div>
                    <Button variant="link" size="sm" style={{ marginTop: 2 }}>查看计划</Button>
                  </div>
                </td>
                <td style={td}>
                  <StatusDot tone={ROW_STATE[a.status].tone} label={ROW_STATE[a.status].label}
                    style={{ fontSize: 'var(--fs-13)', color: 'var(--text-primary)', whiteSpace: 'nowrap' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </TableFrame>

    {rows.length === 0 ? <Card><EmptyState compact icon="search-x" title="没有匹配的达人" description="换个关键词，或把批次状态筛选放宽。" /></Card> : null}
    <StickyFooter>
      <Pagination page={at} pageCount={pageCount} total={rows.length} onChange={setPage}
        pageSize={size} pageSizeOptions={[20, 50, 100]} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
    </StickyFooter>
    </>
  );
}

function CreatorIdentity({ a }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', minWidth: 0 }}>
      <Avatar name={a.name} src={avatarOf(a.id)} size="lg" />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 'var(--fw-semibold)' }}>{a.name}</div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 4 }}>
          抖音号：<span style={{ fontFamily: 'var(--font-mono)' }}>{a.douyin}</span>
        </div>
        <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', marginTop: 2 }}>
          合作码：<span style={{ fontFamily: 'var(--font-mono)' }}>{a.code}</span>
        </div>
      </div>
    </div>
  );
}

/* 授权单元格：状态徽标 + 授权类型 + 有效期 */
function AuthCell({ auth }) {
  const st = AUTH_STATE[auth.state];
  return (
    <div style={{ minWidth: 0 }}>
      <Badge tone={st.tone}>{st.label}</Badge>
      <div style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary)', marginTop: 6 }}>{auth.type}</div>
      <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{auth.period}</div>
    </div>
  );
}

Object.assign(window, { CreatorsScreen });
})();
