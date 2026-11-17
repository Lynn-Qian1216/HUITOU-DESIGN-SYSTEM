export interface AnchoredPanelProps {
  /** Ref to the trigger element the panel is positioned against. */
  anchor: React.RefObject<HTMLElement>;
  /** Which edge of the anchor the panel aligns to. Default 'left'. */
  align?: 'left' | 'right';
  /** Distance from the anchor, in px. Default 4. */
  gap?: number;
  /** Give the panel at least the anchor's width. */
  matchWidth?: boolean;
  /** Called on outside click and Escape. */
  onClose?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function AnchoredPanel(props: AnchoredPanelProps): JSX.Element;
