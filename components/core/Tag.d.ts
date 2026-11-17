export interface TagProps {
  /** Renders a dismiss affordance when provided. */
  onRemove?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
