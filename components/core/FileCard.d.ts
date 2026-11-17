export interface FileCardProps {
  name: string;
  size?: number;
  /** Object URL for images. Omit for other types — the extension icon is used. */
  thumb?: string;
  status?: 'uploading' | 'ready' | 'error';
  progress?: number;
  error?: string;
  onRemove?: () => void;
  onRetry?: () => void;
  /** Click-to-preview. Omit to make the card inert. */
  onOpen?: () => void;
  style?: React.CSSProperties;
}
export declare function FileCard(props: FileCardProps): JSX.Element;
