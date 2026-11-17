export interface SidebarNavProps {
  /** Grouped items: { label?, items: [{ id, label, icon, badge? }] }. */
  sections: Array<{ label?: string; items: Array<{ id: string; label: string; icon: string; badge?: string | number }> }>;
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Collapses to 64px, icon only. */
  collapsed?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SidebarNav(props: SidebarNavProps): JSX.Element;
