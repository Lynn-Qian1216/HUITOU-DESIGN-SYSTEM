export interface CardProps {
  title?: React.ReactNode;
  /** A line that varies with the data — cycle, freshness, counts. Explanatory copy goes in info. */
  subtitle?: React.ReactNode;
  /** Explanatory copy, tucked behind a question mark next to the title. */
  info?: React.ReactNode;
  /** Right-aligned header slot — usually an IconButton or Button. */
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  /** false removes body padding (tables, charts that bleed). */
  padded?: boolean;
  /** Defaults to 'hidden' for clean rounded corners. Pass 'visible' when a child
   *  needs position: sticky — an overflow:hidden ancestor silently kills sticky. */
  overflow?: 'hidden' | 'visible';
  /** Adds hover border + shadow. */
  interactive?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
