export type MentionKind = 'agent' | 'campaign' | 'product' | 'creative' | 'creator' | 'account';

export interface MentionChipProps {
  kind?: MentionKind;
  /** The entity's own name. */
  label: string;
  size?: 'sm' | 'md';
  /** Renders the remove button. */
  onRemove?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function MentionChip(props: MentionChipProps): JSX.Element;

export declare const MENTION_KINDS: Record<MentionKind, { label: string; icon: string; ai?: boolean }>;
