/**
 * @startingPoint section="Core" subtitle="Buttons, icon buttons and badges" viewport="700x180"
 */
export interface ButtonProps {
  /** primary is black, not blue. One primary per view. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name shown before the label. */
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
