export interface SparklineProps {
  /** Ordered numeric series; scaled to fit. */
  data: number[];
  width?: number;
  height?: number;
  /** Any --viz-* token. Defaults to ink. */
  color?: string;
  /** Adds a 7%-opacity fill below the line. */
  area?: boolean;
  style?: React.CSSProperties;
}
export declare function Sparkline(props: SparklineProps): JSX.Element;
