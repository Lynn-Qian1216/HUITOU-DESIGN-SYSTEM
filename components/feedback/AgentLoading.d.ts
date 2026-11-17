export interface AgentLoadingProps {
  /** 单条状态文案。与 phases 二选一。 */
  label?: string;
  /** 多条状态文案，按 phaseMs 轮换，说明智能体正在做什么。 */
  phases?: string[];
  /** 文案轮换间隔，默认 900ms。 */
  phaseMs?: number;
  /** 是否显示与真实回复同形的骨架块（两行文本 + 三格指标）。默认 true。 */
  skeleton?: boolean;
  /** 奔跑猫的宽度，默认 42。 */
  catWidth?: number;
  /** 逐帧 SVG 路径。默认 '../../assets/motion-reply.svg'（相对页面）。 */
  src?: string;
  style?: React.CSSProperties;
}
export declare function AgentLoading(props: AgentLoadingProps): JSX.Element;

export interface RunningCatProps {
  width?: number;
  src?: string;
  style?: React.CSSProperties;
}
export declare function RunningCat(props: RunningCatProps): JSX.Element;
