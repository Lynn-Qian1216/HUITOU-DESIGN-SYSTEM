export interface AlertProps {
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'ai';
  title?: React.ReactNode;
  /** Button row under the body. */
  action?: React.ReactNode;
  onDismiss?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Alert(props: AlertProps): JSX.Element;
