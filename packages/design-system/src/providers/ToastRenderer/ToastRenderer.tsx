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

/** Total time until toast is removed. Exit animation runs for the last EXIT_DURATION_MS. */
const DEFAULT_DISPLAY_DURATION_MS = 5000;
const EXIT_DURATION_MS = 120;

export interface ToastProviderProps {
  children: React.ReactNode;
  /** When set, the toast container portals into this element instead of document.body (e.g. for Storybook or tests). */
  portalRoot?: HTMLElement | null;
}

/**
 * Global toast provider. Place ToastRenderer near your other providers (e.g. DesignSystemProvider)
 * at the app root so any component can use useToast(). Toasts portal to document.body and stack
 * bottom-right with newest on top.
 *
 * @example
 * // In app root, next to other providers:
 * <DesignSystemProvider brand="startribune">
 *   <ToastRenderer>
 *     <App />
 *   </ToastRenderer>
 * </DesignSystemProvider>
 *
 * // In any child component:
 * const { showToast, hideToast } = useToast();
 * showToast({ title: 'Saved', variant: 'success' });
 */

export const ToastRenderer: React.FC<ToastProviderProps> = ({ children, portalRoot }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timeoutsRef = useRef<
    Map<string, { exit: ReturnType<typeof setTimeout>; remove: ReturnType<typeof setTimeout> }>
  >(new Map());

  const hideToast = useCallback((id: string) => {
    const ids = timeoutsRef.current.get(id);
    if (ids) {
      clearTimeout(ids.exit);
      clearTimeout(ids.remove);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, EXIT_DURATION_MS);
  }, []);

  const showToast = useCallback((options: ShowToastRenderOptions): string => {
    const id = `toast-${++idRef.current}`;
    setToasts((prev) => [...prev, { ...options, id }]);

    const duration = options.duration ?? DEFAULT_DISPLAY_DURATION_MS;
    if (duration > 0) {
      // Start EXIT_DURATION_MS so animation finishes when we remove at duration
      const whenToStartExitMs = Math.max(0, duration - EXIT_DURATION_MS);
      timeoutsRef.current.set(id, {
        exit: setTimeout(() => {
          setToasts((prev) =>
            prev.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast))
          );
        }, whenToStartExitMs),
        remove: setTimeout(() => {
          timeoutsRef.current.delete(id);
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration),
      });
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
              exiting={toast.exiting}
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
