export interface TooltipProps {
  /** One short line, unless width is set. No rich content. */
  label: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Max width in px. Set it to let longer copy wrap into a paragraph. */
  width?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
