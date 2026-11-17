/**
 * @startingPoint section="Data" subtitle="Metric cards, deltas and sparklines" viewport="700x200"
 */
export interface MetricCardProps {
  /** Uppercase overline, e.g. "Blended CPA". */
  label: React.ReactNode;
  /** Pre-formatted figure — the component does not format. */
  value: React.ReactNode;
  delta?: number;
  goodWhen?: 'up' | 'down' | 'none';
  basis?: string;
  /** Optional sparkline series. */
  series?: number[];
  target?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function MetricCard(props: MetricCardProps): JSX.Element;
