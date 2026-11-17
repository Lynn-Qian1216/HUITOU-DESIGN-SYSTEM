export interface StatusDotProps {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'ai';
  label?: React.ReactNode;
  /** Slow pulse for live/running states. */
  pulse?: boolean;
  style?: React.CSSProperties;
}
export declare function StatusDot(props: StatusDotProps): JSX.Element;
