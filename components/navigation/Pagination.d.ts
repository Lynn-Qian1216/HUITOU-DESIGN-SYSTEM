export interface PaginationProps {
  page?: number;
  pageCount?: number;
  /** Total row count, shown on the left. */
  total?: number;
  /** Rows per page. Pass it to show the 每页 N 条 selector; omit to hide. */
  pageSize?: number;
  /** Choices offered in the selector. Defaults to [10, 20, 50, 100]. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  onChange?: (page: number) => void;
  style?: React.CSSProperties;
}
export declare function Pagination(props: PaginationProps): JSX.Element;
