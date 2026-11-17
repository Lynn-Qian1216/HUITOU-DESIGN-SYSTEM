export interface PopoverProps {
  /** Panel body — rich content is allowed. */
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  width?: number;
  /** The trigger. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Popover(props: PopoverProps): JSX.Element;
