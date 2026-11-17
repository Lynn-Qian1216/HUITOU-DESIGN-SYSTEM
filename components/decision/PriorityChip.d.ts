export interface PriorityChipProps {
  /** 级别：高 / 中 / 低。缺省「中」。 */
  level?: '高' | '中' | '低';
  style?: React.CSSProperties;
}
/** 决策级别方章：高 danger、中 warning、低 link 蓝，宽度固定以便成列对齐。 */
export declare function PriorityChip(props: PriorityChipProps): JSX.Element;

export interface ExpiryChipProps {
  /** 失效时间文案，如「今天 19:18 后失效」。 */
  label: string;
  style?: React.CSSProperties;
}
/** 决策时效胶囊（warning 调）。只在决策仍待处理时显示。 */
export declare function ExpiryChip(props: ExpiryChipProps): JSX.Element;

export interface MetaChipProps {
  /** 字段名，不截断。 */
  label: string;
  /** 字段值，过长时省略号截断。 */
  value: React.ReactNode;
  style?: React.CSSProperties;
}
/** 只读的「标签：值」小片，用于决策详情头部的上下文行。 */
export declare function MetaChip(props: MetaChipProps): JSX.Element;

export interface ResultNoteProps {
  /** 终态结论：success 达标、revert 已回滚、pending 监控中。 */
  result?: 'success' | 'revert' | 'pending';
  /** 结论文案。 */
  text: string;
  style?: React.CSSProperties;
}
/** 决策终态的一句话结论，带图标与语义色。 */
export declare function ResultNote(props: ResultNoteProps): JSX.Element;
