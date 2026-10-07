/**
 * Shared form validation utility (Constitution §13c). Express a screen's
 * validation rules as a declarative rules map keyed by field name instead
 * of scattering inline `if` conditions across components.
 *
 * @example
 * const errors = validateFields(values, {
 *   email: [required('Please enter email'), email('Enter a valid email address')],
 *   password: [required('Please enter password')],
 * });
 */

export type Validator<T> = (value: T) => string | undefined;

/** Fails if the (trimmed, for strings) value is empty/undefined/null. */
export function required(message = 'This field is required'): Validator<unknown> {
  return (value) => {
    if (value === undefined || value === null) return message;
    if (typeof value === 'string' && value.trim() === '') return message;
    return undefined;
  };
}

/** Fails if the string isn't a plausible email address. */
export function email(message = 'Enter a valid email address'): Validator<string> {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value) => (value && !EMAIL_RE.test(value) ? message : undefined);
}

/** Fails if the string is shorter than `min` characters. */
export function minLength(min: number, message = `Must be at least ${min} characters`): Validator<string> {
  return (value) => (value && value.length < min ? message : undefined);
}

/**
 * Runs each field's validator chain in order, stopping at the first failing
 * validator per field. Returns only the fields that have an error.
 */
export function validateFields<T extends Record<string, unknown>>(
  values: T,
  rules: Partial<{ [K in keyof T]: Validator<T[K]>[] }>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const key in rules) {
    const validators = rules[key];
    if (!validators) continue;
    for (const validate of validators) {
      const error = validate(values[key]);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  }

  return errors;
}
