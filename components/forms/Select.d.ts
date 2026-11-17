export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface SelectProps {
  /** Strings, or { value, label, disabled } objects. */
  options: Array<string | SelectOption>;
  value?: string;
  /** Event-shaped for drop-in parity with the native element: `e.target.value`. */
  onChange?: (e: { target: { value: string } }) => void;
  /** Shown, in tertiary, when nothing is selected. */
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  width?: number | string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
