export interface ProgressBarProps {
  /** 0–100. */
  value: number;
  label?: React.ReactNode;
  showValue?: boolean;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'ai';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
