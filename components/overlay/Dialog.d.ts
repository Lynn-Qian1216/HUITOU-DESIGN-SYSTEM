export interface DialogProps {
  open?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned button row. Primary action last. */
  footer?: React.ReactNode;
  width?: number;
  onClose?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element;
