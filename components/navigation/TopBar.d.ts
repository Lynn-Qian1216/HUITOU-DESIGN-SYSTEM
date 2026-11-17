export interface TopBarProps {
  /** Leading slot — account switcher, breadcrumbs or search. */
  left?: React.ReactNode;
  title?: React.ReactNode;
  /** Trailing controls, right-aligned. */
  actions?: React.ReactNode;
  sticky?: boolean;
  style?: React.CSSProperties;
}
export declare function TopBar(props: TopBarProps): JSX.Element;
