export interface FormFieldProps {
  label?: React.ReactNode;
  /** Explanatory copy. Collapses into a help icon beside the label, revealed on hover. Keep it to one line. */
  hint?: React.ReactNode;
  /** Shown in red under the control. */
  error?: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function FormField(props: FormFieldProps): JSX.Element;
