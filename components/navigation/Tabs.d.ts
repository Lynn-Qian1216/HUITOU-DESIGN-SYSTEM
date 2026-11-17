export interface TabsProps {
  items: Array<{ id: string; label: string; icon?: string; count?: number }>;
  value?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
