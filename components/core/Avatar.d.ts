export interface AvatarProps {
  /** Used for initials and the title attribute. */
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | number;
  /** Rounded-square instead of circle — used for accounts and workspaces. */
  square?: boolean;
  /** Violet AI treatment, for the agent's own avatar. */
  agent?: boolean;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
