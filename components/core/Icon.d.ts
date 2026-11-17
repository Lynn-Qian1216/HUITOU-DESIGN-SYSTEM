export interface IconProps {
  /** Lucide icon name in kebab-case, e.g. "chart-line", "sparkles". */
  name: string;
  /** Pixel box. 14 inline, 16 default, 20 section headers, 24 max. */
  size?: 14 | 16 | 20 | 24 | number;
  /** Overrides currentColor. Prefer inheriting. */
  color?: string;
  /** Accessible label. Omit for decorative icons. */
  title?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
