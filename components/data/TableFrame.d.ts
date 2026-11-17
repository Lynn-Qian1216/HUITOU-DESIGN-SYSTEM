export interface TableFrameProps {
  /**
   * 表格本体。宽表请给 `<table>` 设 minWidth，让它在框内横向滚动。
   * 传函数则拿到冻结列样式：`{(fz) => <table>…</table>}`，
   * fz.head/cell(left) 锁左侧列，fz.headEnd/cellEnd 锁行尾列，
   * fz.headEdge/cellEdge 叠在最后一个左冻结列上 —— 阴影只在该侧有被遮住的列时出现。
   */
  children?: React.ReactNode | ((fz: ReturnType<typeof TableFreezeStyles>) => React.ReactNode);
  /** 覆盖默认描边／圆角。嵌在 Card 内时常传 { borderWidth: 0, borderRadius: 0 }。 */
  style?: React.CSSProperties;
}
/** 宽表外框：内层横向滚动、隐藏原生滚动条，可见滚动轨由 StickyFooter 承担。 */
export declare function TableFrame(props: TableFrameProps): JSX.Element;

export interface StickyFooterProps {
  /** 翻页器等常驻内容。 */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
/**
 * 吸底条：贴住所在滚动区下沿（运行时量取宿主 padding-bottom），
 * 内部顶部自动长出当前宽表的横向滚动轨。必须是滚动区的直系后代。
 */
export declare function StickyFooter(props: StickyFooterProps): JSX.Element;

export interface ListShellProps {
  children?: React.ReactNode;
  /** 放进吸底条的内容，通常是 <Pagination>。 */
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
/** 列表外壳：内容 + 吸底翻页条，等价于手写 children + <StickyFooter>。 */
export declare function ListShell(props: ListShellProps): JSX.Element;

/** Hover props for a <tr>. `base` is the row's resting background; `locked` keeps a selected row's own background. */
export declare function TableRowHover(base?: string, locked?: boolean): {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
};

export interface TableEdges {
  /** 左侧已有列被滑出视口。 */
  overflowLeft: boolean;
  /** 右侧还有列没露出来。 */
  overflowRight: boolean;
}
/** 由 TableFrame 提供：两侧是否还有被遮住的列。供冻结列决定是否投影。 */
export declare const TableScrollContext: React.Context<TableEdges>;

/**
 * 冻结列样式工厂。head/cell 传该列左侧已冻结宽度之和；
 * headEnd/cellEnd 用于行尾列。headEdge/cellEdge 叠在最后一个左冻结列上投出右向阴影。
 */
export declare function TableFreezeStyles(edges: TableEdges): {
  head: (left: number) => React.CSSProperties;
  cell: (left: number) => React.CSSProperties;
  headEnd: React.CSSProperties;
  cellEnd: React.CSSProperties;
  headEdge: React.CSSProperties;
  cellEdge: React.CSSProperties;
};
