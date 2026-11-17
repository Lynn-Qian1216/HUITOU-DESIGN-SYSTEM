export interface DecisionRound {
  /** 该轮观测值，含单位，如「¥28.60」「3.4%」。 */
  v: string;
  /** 采样量偏低等需要打问号的轮次。 */
  flag?: boolean;
}

export interface DecisionMetric {
  /** 指标名，如「日转化量」。 */
  name: string;
  /** 目标，形如「≥500」「≤¥42」「≥3.2%」——达标与否由它推导。 */
  target: string;
  /** 决策执行前的起始值。 */
  from: string;
  /** 每轮结果，未跑的轮次填 null。 */
  rounds: (DecisionRound | null)[];
}

export interface MetricRoundsProps {
  /** 该决策跟踪的指标，通常 1–2 个。 */
  metrics: DecisionMetric[];
  /** 失败原因，置顶显示。仅失败态传。 */
  failNote?: string;
  style?: React.CSSProperties;
}
/** 验证中／失败时的指标进度：名称、起点 → 最新值、目标、轮次圆点。 */
export declare function MetricRounds(props: MetricRoundsProps): JSX.Element;

/** 按目标字符串判断某个值是否达标；无法解析时返回 null。 */
export declare function meetsTarget(target: string, v: string): boolean | null;
