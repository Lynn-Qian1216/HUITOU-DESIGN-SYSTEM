import type { DecisionMetric } from './MetricRounds';

export interface TrackingTableProps {
  /** 跟踪的指标，一行一个。 */
  metrics: DecisionMetric[];
  /** 轮次表头，默认 ['一轮','二轮','三轮']。带时间更好：['一轮 19:00', …]。 */
  rounds?: string[];
  style?: React.CSSProperties;
}
/** 决策详情的完整验证跟踪表：一行一指标、一列一轮，存疑轮次挂问号说明。 */
export declare function TrackingTable(props: TrackingTableProps): JSX.Element;
