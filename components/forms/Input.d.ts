export interface InputProps {
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered inside the field. */
  iconLeft?: string;
  /** Trailing unit or hint, mono 12px — e.g. "USD", "/day". */
  suffix?: React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
