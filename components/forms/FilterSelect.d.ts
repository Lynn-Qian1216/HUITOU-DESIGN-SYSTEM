export interface FilterSelectOption {
  label: string;
  /** Rows this option would match. 0 renders the option disabled, never hidden. */
  count?: number;
}
export interface FilterSelectProps {
  options: Array<string | FilterSelectOption>;
  /** Selected option label. */
  value: string;
  onChange?: (label: string) => void;
  size?: 'sm' | 'md' | 'lg';
  width?: number | string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function FilterSelect(props: FilterSelectProps): JSX.Element;
