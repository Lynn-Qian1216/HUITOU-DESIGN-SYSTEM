export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
