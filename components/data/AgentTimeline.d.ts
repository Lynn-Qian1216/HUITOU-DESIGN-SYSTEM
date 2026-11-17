/**
 * @startingPoint section="Data" subtitle="Agent activity log — diagnose, strategise, execute, learn" viewport="700x300"
 */
export interface AgentTimelineProps {
  /** One entry per agent step. stage drives the icon and tone. */
  items: Array<{ stage: 'diagnose' | 'strategise' | 'execute' | 'learn' | 'alert'; title: React.ReactNode; detail?: React.ReactNode; meta?: React.ReactNode; time: string }>;
  style?: React.CSSProperties;
}
export declare function AgentTimeline(props: AgentTimelineProps): JSX.Element;
