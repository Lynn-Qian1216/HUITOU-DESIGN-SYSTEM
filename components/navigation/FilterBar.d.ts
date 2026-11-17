export interface FilterBarProps {
  /** Filter controls, laid out left to right. */
  children?: React.ReactNode;
  /** Pushed to the right edge — export buttons, result counts. */
  trailing?: React.ReactNode;
  /** Adds the card's own gutter padding, for a bar nested inside a Card. */
  inset?: boolean;
  style?: React.CSSProperties;
}
export declare function FilterBar(props: FilterBarProps): JSX.Element;
