export interface EmptyStateProps {
  /** Lucide icon name, 20px in a sunken square. */
  icon?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
  style?: React.CSSProperties;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
