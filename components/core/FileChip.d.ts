export interface FileChipProps {
  name: string;
  /** Bytes. Shown once the upload finishes. */
  size?: number;
  status?: 'uploading' | 'ready' | 'error';
  /** 0–100, used while status is 'uploading'. */
  progress?: number;
  /** Short reason, shown in place of the size when status is 'error'. */
  error?: string;
  onRemove?: () => void;
  onRetry?: () => void;
  style?: React.CSSProperties;
}
export declare function FileChip(props: FileChipProps): JSX.Element;

/** Lucide icon name for a filename's extension. */
export declare function fileIcon(name: string): string;
/** 2.4 MB / 640 KB / 812 B */
export declare function formatBytes(n: number): string;
