export interface AgentInquiryQuestion {
  key: string;
  label: string;
  options: string[];
}
export interface AgentInquiryProps {
  /** The one thing the agent needs answered, in full. */
  question: string;
  questions: AgentInquiryQuestion[];
  /** Fallback answer per question key, used by the "default scope" action. */
  defaults?: Array<{ key: string; label: string }>;
  noteLabel?: string;
  notePlaceholder?: string;
  /** Receipt copy shown after submit. */
  dispatchedAt?: string;
  eta?: string;
  onSubmit?: (answers: Record<string, string>, note: string) => void;
  style?: React.CSSProperties;
}
export declare function AgentInquiry(props: AgentInquiryProps): JSX.Element;
