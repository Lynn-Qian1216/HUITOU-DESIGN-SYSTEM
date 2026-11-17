export interface BadgeProps {
  /** ai is reserved for machine-authored content. */
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'ai';
  /** Leading 6px dot. */
  dot?: boolean;
  /** Lucide icon name, 12px. */
  icon?: string;
  /** false renders the solid fill. Default true (soft). */
  subtle?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
