import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ToastRenderer,
  type ToastRendererItem,
} from '@/components/Toast/native/ToastRenderer.native';
import type { ToastVariant } from '@/components/Toast/Toast.types';

export const Snack = {
  toast: 'toast',
} as const;

export type SnackSlot = keyof typeof Snack;

const DEFAULT_TOAST_DURATION_MS = 5000;
const EXIT_DURATION_MS = 120;

export type SnackToastShowOptions = {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  showIcon?: boolean;
  showCloseButton?: boolean;
  duration?: number;
  dataTestId?: string;
  onClose?: () => void;
};

type SlotsState = {
  toast: ToastRendererItem[];
};

type SnackSlotShowOptions<Slot extends SnackSlot> = Slot extends 'toast'
  ? SnackToastShowOptions
  : never;

type SnackContextValue = {
  show: <Slot extends SnackSlot>(slot: Slot, item: SnackSlotShowOptions<Slot>) => string;
  hide: (slot: SnackSlot, id: string) => void;
};

const SnackContext = createContext<SnackContextValue | null>(null);

export type SnackProviderProps = {
  children: React.ReactNode;
};

export const SnackProvider: React.FC<SnackProviderProps> = ({ children }) => {
  const [slots, setSlots] = useState<SlotsState>({ toast: [] });
  const timersRef = useRef<
    Map<string, { exit?: ReturnType<typeof setTimeout>; remove?: ReturnType<typeof setTimeout> }>
  >(new Map());
  const counterRef = useRef(0);

  const hide = useCallback((slot: SnackSlot, id: string) => {
    if (slot !== 'toast') {
      return;
    }

    const existing = timersRef.current.get(id);
    if (existing?.exit) {
      clearTimeout(existing.exit);
    }
    if (existing?.remove) {
      clearTimeout(existing.remove);
      timersRef.current.delete(id);
    }

    setSlots((prev) => ({
      ...prev,
      toast: prev.toast.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
    }));

    const removeTimeout = setTimeout(() => {
      setSlots((prev) => ({
        ...prev,
        toast: prev.toast.filter((toast) => toast.id !== id),
      }));
      timersRef.current.delete(id);
    }, EXIT_DURATION_MS);

    timersRef.current.set(id, { remove: removeTimeout });
  }, []);

  const show = useCallback(
    <Slot extends SnackSlot>(slot: Slot, incoming: SnackSlotShowOptions<Slot>): string => {
      const id = incoming.id ?? `snack-${slot}-${++counterRef.current}`;

      if (slot !== 'toast') {
        return id;
      }

      const toastIncoming = incoming as SnackToastShowOptions;
      const duration = toastIncoming.duration ?? DEFAULT_TOAST_DURATION_MS;
      const item: ToastRendererItem = {
        id,
        title: toastIncoming.title,
        description: toastIncoming.description,
        variant: toastIncoming.variant,
        showIcon: toastIncoming.showIcon,
        showCloseButton: toastIncoming.showCloseButton,
        dataTestId: toastIncoming.dataTestId,
        onClose: toastIncoming.onClose,
      };

      setSlots((prev) => ({
        ...prev,
        toast: [...prev.toast, item],
      }));

      if (duration === Infinity || duration <= 0) {
        return id;
      }

      const whenToStartExitMs = Math.max(0, duration - EXIT_DURATION_MS);

      const exitTimeout = setTimeout(() => {
        setSlots((prev) => ({
          ...prev,
          toast: prev.toast.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
        }));
      }, whenToStartExitMs);

      const removeTimeout = setTimeout(() => {
        setSlots((prev) => ({
          ...prev,
          toast: prev.toast.filter((toast) => toast.id !== id),
        }));
        timersRef.current.delete(id);
      }, duration);

      timersRef.current.set(id, { exit: exitTimeout, remove: removeTimeout });
      return id;
    },
    []
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(({ exit, remove }) => {
        if (exit) clearTimeout(exit);
        if (remove) clearTimeout(remove);
      });
      timers.clear();
    };
  }, []);

  const ctxValue: SnackContextValue = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <SnackContext.Provider value={ctxValue}>
      {children}
      <ToastRenderer
        items={slots.toast}
        onDismiss={(id) => {
          const item = slots.toast.find((toast) => toast.id === id);
          hide('toast', id);
          item?.onClose?.();
        }}
      />
    </SnackContext.Provider>
  );
};

export type SnackBoundActions<Slot extends SnackSlot> = {
  show: (item: SnackSlotShowOptions<Slot>) => string;
  hide: (id: string) => void;
};

export function useSnack<Slot extends SnackSlot>(slot: Slot): SnackBoundActions<Slot> {
  const context = useContext(SnackContext);
  if (context == null) {
    throw new Error('useSnack must be used within a SnackProvider.');
  }

  return {
    show: (item) => context.show(slot, item) as string,
    hide: (id) => context.hide(slot, id),
  };
}

export type ToastActions = SnackBoundActions<'toast'> & {
  showToast: (item: SnackToastShowOptions) => string;
  hideToast: (id: string) => void;
};

export function useToast(): ToastActions {
  const base = useSnack('toast');
  return {
    ...base,
    showToast: (item) => base.show(item),
    hideToast: (id) => base.hide(id),
  };
}
