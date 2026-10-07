import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback renderer; receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Top-level React error boundary (Constitution §13 gap fix). Mounted once
 * near the app root (see App.tsx) to catch render-time crashes that would
 * otherwise unmount the whole React tree to a blank white screen. This is
 * distinct from `ErrorBanner`, which handles expected data-fetch failures.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console -- last-resort diagnostic surface for uncaught render errors
    console.error('Unhandled UI error caught by ErrorBoundary:', error, info.componentStack);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) {
        return fallback(error, this.reset);
      }

      return (
        <div className="cmd-error-boundary" role="alert">
          <h1 className="cmd-error-boundary__title">Something went wrong</h1>
          <p className="cmd-error-boundary__message">
            An unexpected error occurred. Please try again, and contact support if the problem persists.
          </p>
          <button type="button" className="cmd-error-boundary__button" onClick={this.reset}>
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
