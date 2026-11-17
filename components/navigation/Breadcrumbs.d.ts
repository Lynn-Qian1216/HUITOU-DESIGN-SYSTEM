export interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string; onClick?: (e: React.MouseEvent) => void }>;
  style?: React.CSSProperties;
}
export declare function Breadcrumbs(props: BreadcrumbsProps): JSX.Element;
