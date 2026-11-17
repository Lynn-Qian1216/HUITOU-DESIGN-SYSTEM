export interface ProgressTrackProps {
  /** 节点名称，按顺序。 */
  steps: string[];
  /** 当前所处节点索引。 */
  at?: number;
  /** 当前节点的状态：done 已通过（绿）、pending 正在处理（红）、idle 未启动（空心）。 */
  state?: 'done' | 'pending' | 'idle';
  /** 状态徽标文案。缺省用 steps[at]。 */
  label?: string;
  /** 是否显示下方状态徽标，默认 true。 */
  showLabel?: boolean;
  style?: React.CSSProperties;
}
/** 多节点流程进度：走过填实、当前着色、未到留空心，下方配状态徽标。 */
export declare function ProgressTrack(props: ProgressTrackProps): JSX.Element;

export interface ScoreRingProps {
  /** 0–100 的评分。 */
  score: number;
  /** 直径，默认 60。 */
  size?: number;
  /** 环宽，默认 5。 */
  thickness?: number;
  /** 右侧眉标，如「健康度」。 */
  label?: string;
  /** 右侧档位文案，如「良好」，颜色随档位。 */
  hint?: string;
  style?: React.CSSProperties;
}
/** 环形评分：≥90 绿、≥75 琥珀、其余中性 —— 读的是档位，不是连续色阶。 */
export declare function ScoreRing(props: ScoreRingProps): JSX.Element;

export interface RoundsProgressProps {
  /** Rounds completed. */
  done?: number;
  /** Total rounds. Default 3. */
  total?: number;
  /** Overrides the derived Chinese label. */
  label?: string;
  style?: React.CSSProperties;
}
export declare function RoundsProgress(props: RoundsProgressProps): JSX.Element;
