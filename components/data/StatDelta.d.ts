export interface StatDeltaProps {
  /** Signed percentage change. */
  value: number;
  /** Which direction is good — CPA is 'down', ROAS is 'up'. */
  goodWhen?: 'up' | 'down' | 'none';
  /** Comparison window, e.g. "vs. previous 7 days". Always state it. */
  basis?: string;
  style?: React.CSSProperties;
}
export declare function StatDelta(props: StatDeltaProps): JSX.Element;
