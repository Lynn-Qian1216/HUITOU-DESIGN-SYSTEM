export interface InfoHintProps {
  /** The explanatory copy. A sentence or two — it wraps. */
  label: React.ReactNode;
  /** Glyph size in px. Default 13, matching FormField's hint. */
  size?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Bubble max width in px. Default 260. */
  width?: number;
  style?: React.CSSProperties;
}
export declare function InfoHint(props: InfoHintProps): JSX.Element;
