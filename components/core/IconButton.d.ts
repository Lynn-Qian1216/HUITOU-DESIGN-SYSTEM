export interface IconButtonProps {
  /** Lucide icon name. */
  icon: string;
  /** Required — becomes aria-label and tooltip. */
  label: string;
  variant?: 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
