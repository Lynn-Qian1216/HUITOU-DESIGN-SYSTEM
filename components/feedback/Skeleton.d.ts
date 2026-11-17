export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: string;
  /** More than one renders a paragraph, last line at 62%. */
  lines?: number;
  style?: React.CSSProperties;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;
