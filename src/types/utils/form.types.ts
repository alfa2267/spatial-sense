import { DeepPartial } from './common.types';

/**
 * Base form field configuration
 */
export interface FormField<T = any> {
  /** Field name */
  name: string;
  /** Field label */
  label: string;
  /** Field type (e.g., 'text', 'number', 'select', etc.) */
  type: string;
  /** Whether the field is required */
  required?: boolean;
  /** Default value */
  defaultValue?: T;
  /** Validation function */
  validate?: (value: T, values?: Record<string, unknown>) => string | undefined;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is hidden */
  hidden?: boolean;
  /** Additional field-specific options */
  options?: unknown;
  /** Help text */
  helpText?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show the field label */
  showLabel?: boolean;
  /** Custom component to use for rendering the field */
  component?: React.ComponentType<any>;
  /** Additional props to pass to the field component */
  componentProps?: Record<string, unknown>;
}

/**
 * Form configuration
 */
export interface FormConfig<T extends Record<string, any>> {
  /** Form fields */
  fields: FormField[];
  /** Form submission handler */
  onSubmit: (values: T) => void | Promise<void>;
  /** Form reset handler */
  onReset?: () => void;
  /** Initial form values */
  initialValues?: DeepPartial<T>;
  /** Whether to validate on mount */
  validateOnMount?: boolean;
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  /** Whether to validate on change */
  validateOnChange?: boolean;
  /** Form submission button text */
  submitButtonText?: string;
  /** Whether to show the reset button */
  showResetButton?: boolean;
  /** Reset button text */
  resetButtonText?: string;
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Whether the form is valid */
  isValid?: boolean;
  /** Form validation schema */
  validationSchema?: unknown;
  /** Additional form props */
  formProps?: Record<string, unknown>;
}

/**
 * Form state
 */
export interface FormState<T extends Record<string, any>> {
  /** Form values */
  values: T;
  /** Form errors */
  errors: Record<keyof T, string>;
  /** Touched fields */
  touched: Record<keyof T, boolean>;
  /** Whether the form is valid */
  isValid: boolean;
  /** Whether the form is submitting */
  isSubmitting: boolean;
  /** Whether the form has been submitted */
  isSubmitted: boolean;
  /** Form submission count */
  submitCount: number;
}

/**
 * Form field props
 */
export interface FormFieldProps<T = any> {
  /** Field name */
  name: string;
  /** Field value */
  value: T;
  /** Field error */
  error?: string;
  /** Whether the field has been touched */
  touched?: boolean;
  /** Change handler */
  onChange: (value: T) => void;
  /** Blur handler */
  onBlur: () => void;
  /** Additional field props */
  [key: string]: unknown;
}
