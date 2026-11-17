export interface DateFieldProps {
  /** ISO date, "YYYY-MM-DD". Empty renders the placeholder in the sans face. */
  value?: string;
  placeholder?: string;
  /** Fires with the picked ISO date, or "" when cleared. */
  onChange?: (value: string) => void;
  /** Supplying this replaces the built-in calendar with your own handler. */
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function DateField(props: DateFieldProps): JSX.Element;

export interface DateRangeFieldProps {
  /** ISO date, "YYYY-MM-DD". */
  start: string;
  end: string;
  /** Preset rail down the left of the panel. */
  presets?: string[];
  /** Currently selected preset label. */
  preset?: string;
  onPreset?: (label: string) => void;
  /** Fires on 确定 with the picked range. */
  onChange?: (start: string, end: string) => void;
  /** Supplying this replaces the built-in calendar with your own handler. */
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function DateRangeField(props: DateRangeFieldProps): JSX.Element;

export interface TimeRangeFieldProps {
  /** "HH:MM". */
  from?: string;
  to?: string;
  /** Minute granularity in the picker. Default 30. */
  minuteStep?: number;
  onChange?: (from: string, to: string) => void;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function TimeRangeField(props: TimeRangeFieldProps): JSX.Element;
