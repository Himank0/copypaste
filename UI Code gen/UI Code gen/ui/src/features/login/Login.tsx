import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { FormField } from '../../components/common/FormField';
import { ROUTE_PATHS } from '../../routes/paths';
import { required, validateFields } from '../../utils/validation';
import './Login.css';

interface FieldErrors {
  email?: string;
  password?: string;
}

// #region MOCK_DATA_TODO — remove once a real authentication service/API exists
// Spec (section 10) explicitly requests a hardcoded mock login until the
// backend auth API is available.
const MOCK_VALID_EMAIL = 'admin.admin@team.telstra.com';
const MOCK_VALID_PASSWORD = 'admin';
// #endregion MOCK_DATA_TODO

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FieldErrors {
    return validateFields(
      { email, password },
      {
        email: [required('Please enter email')],
        password: [required('Please enter password')],
      }
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // #region MOCK_DATA_TODO — remove once a real authentication service/API exists
    const isMockMatch = email.trim() === MOCK_VALID_EMAIL && password === MOCK_VALID_PASSWORD;
    // #endregion MOCK_DATA_TODO

    if (!isMockMatch) {
      setIsSubmitting(false);
      showToast('Invalid email or password.', 'error');
      return;
    }

    setIsSubmitting(false);
    login({ displayName: 'Paul Mackay', initials: 'PM', email: email.trim() });
    navigate(ROUTE_PATHS.home, { replace: true });
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-card__title">Sign in</h1>
        <p className="login-card__subtitle">Contract Management Database</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldErrors.email}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
          />

          <button type="submit" className="login-form__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
