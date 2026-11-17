export interface ToastProps {
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'ai';
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Usually a single link-style Button, e.g. "Undo". */
  action?: React.ReactNode;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
