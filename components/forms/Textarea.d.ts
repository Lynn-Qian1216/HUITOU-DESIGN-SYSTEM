export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Minimum height, in lines. Default 4. */
  rows?: number;
  /** Height ceiling, in lines; past it the field scrolls. Default 10. */
  maxRows?: number;
  /** Set false to get a fixed-height field with the native resize handle. Default true. */
  autoGrow?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
