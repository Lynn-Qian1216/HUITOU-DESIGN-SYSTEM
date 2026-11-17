export interface SwitchProps {
  checked?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  /** Receives the next boolean value. */
  onChange?: (next: boolean) => void;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
