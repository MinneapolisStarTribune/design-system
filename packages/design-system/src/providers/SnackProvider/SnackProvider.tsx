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
} from '@/components/Toast/ToastRenderer/ToastRenderer';
import {
  CandyBarRenderer,
  type CandyBarRendererItem,
} from '@/components/CandyBar/CandyBarRenderer/CandyBarRenderer';
import type { ToastVariant } from '@/components/Toast/Toast';

// --- Constants ---

export const Snack = {
  toast: 'toast',
  candybar: 'candybar',
} as const;

export type SnackSlot = keyof typeof Snack;

const DEFAULT_TOAST_DURATION_MS = 5000;
const EXIT_DURATION_MS = 120; // must match Toast.module.scss animation duration

// --- Slot items ---

type SnackToastShowOptions = {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  showIcon?: boolean;
  duration?: number;
  dataTestId?: string;
};

type SnackCandyBarShowOptions = {
  id?: string;
  children: React.ReactNode;
};

type SlotsState = {
  toast: ToastRendererItem[];
  candybar: CandyBarRendererItem[];
};

type SnackSlotShowOptions<Slot extends SnackSlot> = Slot extends 'toast'
  ? SnackToastShowOptions
  : SnackCandyBarShowOptions;

type SnackContextValue = {
  show: <Slot extends SnackSlot>(slot: Slot, item: SnackSlotShowOptions<Slot>) => string;
  hide: (slot: SnackSlot, id: string) => void;
};

const SnackContext = createContext<SnackContextValue | null>(null);

export type SnackProviderProps = {
  children: React.ReactNode;
};

export const SnackProvider: React.FC<SnackProviderProps> = ({ children }) => {
  const [slots, setSlots] = useState<SlotsState>({
    toast: [],
    candybar: [],
  });

  // We need per-toast timers for: (1) exit animation start and (2) removal after duration.
  const timersRef = useRef<
    Map<string, { exit?: ReturnType<typeof setTimeout>; remove?: ReturnType<typeof setTimeout> }>
  >(new Map());
  const counterRef = useRef(0);

  const hide = useCallback((slot: SnackSlot, id: string) => {
    if (slot === 'toast') {
      const existing = timersRef.current.get(id);
      if (existing?.exit) clearTimeout(existing.exit);
      if (existing?.remove) clearTimeout(existing.remove);
      timersRef.current.delete(id);

      // Trigger exit animation; provider removes after EXIT_DURATION_MS.
      setSlots((prev) => ({
        ...prev,
        toast: prev.toast.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
      }));

      const removeTimeout = setTimeout(() => {
        setSlots((prev) => ({ ...prev, toast: prev.toast.filter((t) => t.id !== id) }));
        timersRef.current.delete(id);
      }, EXIT_DURATION_MS);
      timersRef.current.set(id, { remove: removeTimeout });
      return;
    }

    // Candybar is single-slot and persistent. No auto-dismiss timers.
    setSlots((prev) => ({ ...prev, candybar: prev.candybar.filter((t) => t.id !== id) }));
  }, []);

  const show = useCallback(
    <Slot extends SnackSlot>(slot: Slot, incoming: SnackSlotShowOptions<Slot>): string => {
      const id = incoming.id ?? `snack-${slot}-${++counterRef.current}`;

      if (slot === 'toast') {
        const toastIncoming = incoming as SnackToastShowOptions;
        const duration = toastIncoming.duration ?? DEFAULT_TOAST_DURATION_MS;
        const item: ToastRendererItem = {
          id,
          title: toastIncoming.title,
          description: toastIncoming.description,
          variant: toastIncoming.variant,
          showIcon: toastIncoming.showIcon,
          exiting: false,
          dataTestId: toastIncoming.dataTestId,
        };

        setSlots((prev) => ({
          ...prev,
          // Queue-based: newest on top is handled by Toast.module.scss flex-direction: column-reverse
          toast: [...prev.toast, item],
        }));

        // duration === Infinity means persistent (only removed via hide()).
        if (duration === Infinity || duration <= 0) {
          return id;
        }

        const whenToStartExitMs = Math.max(0, duration - EXIT_DURATION_MS);

        const exitTimeout = setTimeout(() => {
          setSlots((prev) => ({
            ...prev,
            toast: prev.toast.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
          }));
        }, whenToStartExitMs);

        const removeTimeout = setTimeout(() => {
          setSlots((prev) => ({ ...prev, toast: prev.toast.filter((t) => t.id !== id) }));
          timersRef.current.delete(id);
        }, duration);

        timersRef.current.set(id, { exit: exitTimeout, remove: removeTimeout });
        return id;
      }

      // Single-slot: show() replaces existing active content.
      const candyIncoming = incoming as SnackCandyBarShowOptions;
      const item: CandyBarRendererItem = { id, children: candyIncoming.children };

      setSlots((prev) => ({
        ...prev,
        candybar: [item],
      }));

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
      <ToastRenderer items={slots.toast} onDismiss={(id) => hide('toast', id)} />
      <CandyBarRenderer
        activeItem={slots.candybar[0] ?? null}
        onDismiss={(id) => hide('candybar', id)}
      />
    </SnackContext.Provider>
  );
};

type SnackBoundActions<Slot extends SnackSlot> = {
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
  } as SnackBoundActions<Slot>;
}

export function useToast() {
  return useSnack('toast');
}

export function useCandyBar() {
  return useSnack('candybar');
}
