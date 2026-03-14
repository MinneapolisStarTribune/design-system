import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { FloatingPortal } from '@floating-ui/react';
import { Toast } from '@/components/Toast/Toast';
import type { ToastVariant } from '@/components/Toast/Toast';
import containerStyles from '@/components/Toast/Toast.module.scss';

export type ShowToastRenderOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  showIcon?: boolean;
  duration?: number;
  dataTestId?: string;
};

type ToastItem = ShowToastRenderOptions & { id: string; exiting?: boolean };

export interface ToastContextValue {
  showToast: (options: ShowToastRenderOptions) => string;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
  /** When set, the toast container portals into this element instead of document.body (e.g. for Storybook or tests). */
  portalRoot?: HTMLElement | null;
}

/**
 * Global toast provider. Wrap your app with ToastRenderer, then use useToast() to show
 * or hide toasts. FloatingPortal only controls where the container is mounted (e.g. body);
 * showToast and hideToast control which toasts are visible.
 *
 * @example
 * // In app root:
 * <ToastRenderer>
 *   <App />
 * </ToastRenderer>
 *
 * // In any component:
 * const { showToast, hideToast } = useToast();
 * showToast({ title: 'Saved', variant: 'success', duration: 5000 });
 */

export const ToastRenderer: React.FC<ToastProviderProps> = ({ children, portalRoot }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const durationTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const hideToast = useCallback(
    (id: string) => {
      const timeouts = durationTimeoutsRef.current;
      const timeout = timeouts.get(id);
      if (timeout) {
        clearTimeout(timeout);
        timeouts.delete(id);
      }
      setToasts((prev) =>
        prev.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast))
      );
    },
    [durationTimeoutsRef]
  );

  const showToast = useCallback((options: ShowToastRenderOptions): string => {
    const id = `toast-${++idRef.current}`;
    const item: ToastItem = { ...options, id };
    setToasts((prev) => [...prev, item]);

    const duration = options.duration ?? 5000;
    if (duration > 0) {
      const timeout = setTimeout(() => {
        durationTimeoutsRef.current.delete(id);
        setToasts((prev) =>
          prev.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast))
        );
      }, duration);
      durationTimeoutsRef.current.set(id, timeout);
    }

    return id;
  }, []);

  const value: ToastContextValue = useMemo(
    () => ({ showToast, hideToast }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <FloatingPortal root={portalRoot ?? undefined}>
        <div
          className={containerStyles.container}
          role="region"
          aria-label="Notifications"
          data-testid="toast-container"
          aria-live="polite"
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              title={toast.title}
              description={toast.description}
              variant={toast.variant}
              showIcon={toast.showIcon}
              onClose={() => hideToast(toast.id)}
              dataTestId={toast.dataTestId}
            />
          ))}
        </div>
      </FloatingPortal>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context == null) {
    throw new Error('useToast must be used within a ToastRenderer.');
  }
  return context;
}
