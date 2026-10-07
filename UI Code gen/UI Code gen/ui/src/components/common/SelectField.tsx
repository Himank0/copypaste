import type { SelectHTMLAttributes } from 'react';
import { useId } from 'react';
import './SelectField.css';

export interface SelectFieldOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectFieldOption[];
  /** Validation error message, if any. Presence toggles the invalid style + aria-invalid. */
  error?: string;
}

/**
 * Standard label + select + error-message pattern mirroring `FormField`'s
 * aria-invalid/aria-describedby wiring (Constitution §13c). Use for every
 * dropdown-style input instead of hand-rolling label/select markup per field.
 *
 * @example
 * <SelectField label="Channel" options={[{ value: 'na', label: 'N/A' }]} value={channel} onChange={...} />
 */
export function SelectField({ label, options, error, className, id, ...selectProps }: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  const selectClassName = [
    'cmd-select-field__input',
    error ? 'cmd-select-field__input--invalid' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="cmd-select-field">
      <label className="cmd-select-field__label" htmlFor={selectId}>
        {label}
      </label>
      <select
        id={selectId}
        className={selectClassName}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} className="cmd-select-field__error">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export default SelectField;
