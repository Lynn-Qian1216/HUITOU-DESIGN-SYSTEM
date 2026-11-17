import type { DecisionMetric } from './MetricRounds';

export type DecisionStatus = '待执行' | '验证中' | '失败' | '已执行' | '已拒绝' | '已失效';

export interface Decision {
  /** 决策类型，如「改日预算」「素材筛选」。 */
  type: string;
  status: DecisionStatus;
  priority?: '高' | '中' | '低';
  /** 改动本身，如「1000元 → 1200元」。无具体数值改动（如新建广告）可省。 */
  change?: string;
  /** 改动幅度注释，如「+20%」。 */
  delta?: string;
  /** 数值是否允许人工调整。终态下自动隐藏入口。 */
  editable?: boolean;
  /** 收益预估或实测，如「+¥980 / 周」。标题随状态在「预计／实际／原预计影响」间切换。 */
  impact?: string;
  /** 策略来源，如「转化成本超标预警」。 */
  strategy?: string;
  /** 所属广告计划。 */
  plan?: string;
  /** 生成时间。 */
  time?: string;
  /** 失效时间文案。待执行时作胶囊突出，其余并入元信息行。 */
  expiry?: string;
  /** 决策目标。未开始验证时显示。 */
  goal?: string;
  /** 跟踪指标，验证中／失败／已执行时替代目标显示。 */
  metrics?: DecisionMetric[];
  /** 失败原因。 */
  failNote?: string;
  /** 终态结论类型。 */
  result?: 'success' | 'revert' | 'pending';
  /** 终态结论文案。 */
  resultText?: string;
}

export interface DecisionCardProps {
  decision: Decision;
  /** 验证总轮数，默认 3。 */
  rounds?: number;
  /** 点「查看详情」。不传则不渲染该按钮。 */
  onOpen?: () => void;
  /** 操作回调，参数是目标状态（'验证中' | '已拒绝' | '待执行'）。 */
  onAct?: (next: DecisionStatus) => void;
  style?: React.CSSProperties;
}
/** 单条 AI 决策卡：改动在上、来源在中、目标或指标进度在下、出口在底，随状态换内容。 */
export declare function DecisionCard(props: DecisionCardProps): JSX.Element;

export interface DecisionActionsProps {
  status?: DecisionStatus;
  onAct?: (next: DecisionStatus) => void;
}
/** 决策卡底部出口，按状态给不同按钮组。单独用于详情页底栏。 */
export declare function DecisionActions(props: DecisionActionsProps): JSX.Element;
