import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import './FormField.css';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Validation error message, if any. Presence toggles the invalid style + aria-invalid. */
  error?: string;
}

/**
 * Standard label + input + error-message pattern with correct
 * aria-invalid/aria-describedby wiring (Constitution §13c). Use for every
 * validated form input instead of hand-rolling label/error markup per field.
 *
 * @example
 * <FormField label="Email" type="email" value={email} onChange={...} error={fieldErrors.email} />
 */
export function FormField({ label, error, className, id, ...inputProps }: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const inputClassName = [
    'cmd-form-field__input',
    error ? 'cmd-form-field__input--invalid' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="cmd-form-field">
      <label className="cmd-form-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={inputClassName}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error ? (
        <span id={errorId} className="cmd-form-field__error">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export default FormField;
