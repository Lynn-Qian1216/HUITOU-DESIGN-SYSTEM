/**
 * @startingPoint section="Data" subtitle="Sortable, selectable data table" viewport="700x260"
 */
export interface DataTableProps {
  /** { key, header, align?, mono?, muted?, wrap?, sorted?: 'asc'|'desc', render?(row) } */
  columns: Array<{ key: string; header: React.ReactNode; align?: 'left' | 'right' | 'center'; mono?: boolean; muted?: boolean; wrap?: boolean; sorted?: 'asc' | 'desc'; render?: (row: any) => React.ReactNode }>;
  rows: Array<Record<string, any> & { id?: string }>;
  selectable?: boolean;
  selected?: string[];
  onToggleRow?: (id: string) => void;
  /** 8px row padding instead of 12px. */
  dense?: boolean;
  /** Footer slot — usually Pagination. */
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function DataTable(props: DataTableProps): JSX.Element;
