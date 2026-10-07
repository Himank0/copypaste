import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import './Toast.css';

export type ToastTone = 'info' | 'success' | 'error';

interface ToastEntry {
  id: string;
  message: string;
  tone: ToastTone;
}

export interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION_MS = 4000;

/**
 * Mounts the toast viewport and provides `useToast()` to descendants.
 * Mount once near the root of the app (see App.tsx). Use for all transient
 * feedback (save success, errors, session expiry) per Constitution §13d —
 * do not build bespoke inline success/error banners for this purpose.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), DEFAULT_DURATION_MS);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="cmd-toast-viewport" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`cmd-toast cmd-toast--${toast.tone}`} role="status">
            <span>{toast.message}</span>
            <button
              type="button"
              className="cmd-toast__dismiss"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
