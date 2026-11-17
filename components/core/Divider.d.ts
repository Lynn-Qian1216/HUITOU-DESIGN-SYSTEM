export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  /** Uppercase overline centred in the rule. */
  label?: string;
  /** CSS length for the surrounding margin. */
  spacing?: string;
  style?: React.CSSProperties;
}
export declare function Divider(props: DividerProps): JSX.Element;
