import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useExternalTrigger } from './useExternalTrigger';

describe('useExternalTrigger', () => {
  afterEach(() => {
    vi.useRealTimers();
    // Some tests imperatively append DOM nodes (injection-slot containers, iframes) directly to
    // document.body outside any React tree, so RTL's automatic component-cleanup doesn't remove
    // them — without this they leak across tests and getElementById can resolve to a stale node.
    document.body.innerHTML = '';
  });

  describe('window global registry', () => {
    it('opens and closes a mounted instance by id via window.openTooltip/closeTooltip', () => {
      const { result } = renderHook(() => useExternalTrigger('share-top', undefined, undefined));

      expect(result.current.open).toBe(false);

      act(() => {
        (window as unknown as Record<string, (id: string) => void>).openTooltip('share-top');
      });
      expect(result.current.open).toBe(true);
      expect(result.current.isExternallyTriggered).toBe(true);

      act(() => {
        (window as unknown as Record<string, (id: string) => void>).closeTooltip('share-top');
      });
      expect(result.current.open).toBe(false);
    });

    it('is a silent no-op for an id with no mounted instance', () => {
      renderHook(() => useExternalTrigger('mounted-id', undefined, undefined));

      expect(() => {
        (window as unknown as Record<string, (id: string) => void>).openTooltip('never-mounted');
      }).not.toThrow();
    });

    it('is a silent no-op after the instance unmounts', () => {
      const { result, unmount } = renderHook(() =>
        useExternalTrigger('share-top', undefined, undefined)
      );
      unmount();

      expect(() => {
        (window as unknown as Record<string, (id: string) => void>).openTooltip('share-top');
      }).not.toThrow();
      expect(result.current.open).toBe(false);
    });

    it('supports custom global names', () => {
      renderHook(() =>
        useExternalTrigger('promo-a', undefined, undefined, {
          openGlobalName: 'openPromo',
          closeGlobalName: 'closePromo',
        })
      );

      expect(typeof (window as unknown as Record<string, unknown>).openPromo).toBe('function');
      expect(typeof (window as unknown as Record<string, unknown>).closePromo).toBe('function');
    });

    it('does nothing when no id is given', () => {
      const { result } = renderHook(() => useExternalTrigger(undefined, undefined, undefined));

      expect(result.current.injectionSlotProps).toBeNull();
      expect(result.current.forceMount).toBe(false);
    });
  });

  describe('controlled vs. uncontrolled open state', () => {
    it('manages its own state when uncontrolled', () => {
      const { result } = renderHook(() => useExternalTrigger('id-a', undefined, undefined));

      act(() => result.current.handleOpenChange(true));
      expect(result.current.open).toBe(true);
    });

    it('defers to the given open prop and calls onOpenChange rather than managing state itself', () => {
      const onOpenChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ open }) => useExternalTrigger('id-a', open, onOpenChange),
        { initialProps: { open: false } }
      );

      act(() => result.current.handleOpenChange(true));
      expect(onOpenChange).toHaveBeenCalledWith(true);
      // Controlled: the hook's own `open` doesn't flip until the caller feeds the new value back.
      expect(result.current.open).toBe(false);

      rerender({ open: true });
      expect(result.current.open).toBe(true);
    });

    it('routes an externally-triggered open through onOpenChange in controlled mode too', () => {
      const onOpenChange = vi.fn();
      renderHook(() => useExternalTrigger('id-a', false, onOpenChange));

      act(() => {
        (window as unknown as Record<string, (id: string) => void>).openTooltip('id-a');
      });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('injection slot', () => {
    it('is null when enableInjectionSlot is not set', () => {
      const { result } = renderHook(() => useExternalTrigger('id-a', undefined, undefined));
      expect(result.current.injectionSlotProps).toBeNull();
    });

    it('force-mounts until the first open, then stops', () => {
      const { result } = renderHook(() =>
        useExternalTrigger('id-a', undefined, undefined, { enableInjectionSlot: true })
      );

      expect(result.current.forceMount).toBe(true);

      act(() => result.current.handleOpenChange(true));
      act(() => result.current.handleOpenChange(false));

      expect(result.current.forceMount).toBe(false);
    });

    it('keeps force-mount active for a grace period after a locally-driven close, to let the close notification deliver', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() =>
        useExternalTrigger('id-a', undefined, undefined, {
          enableInjectionSlot: true,
          closeNotifyGracePeriodMs: 200,
        })
      );

      act(() => result.current.handleOpenChange(true));

      // Mount an iframe into the injection slot so a close notification is actually sent.
      const container = document.createElement('div');
      document.body.appendChild(container);
      act(() => result.current.injectionSlotProps?.ref(container));
      const iframe = document.createElement('iframe');
      document.getElementById(`id-a-injection-slot`)?.appendChild(iframe);

      act(() => result.current.handleOpenChange(false));
      // Grace period still active — force-mount should still be true even though open is false.
      expect(result.current.forceMount).toBe(true);

      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current.forceMount).toBe(false);
    });

    it('posts a "requestClose" message into an injected iframe on a locally-driven close, not an externally-driven one', () => {
      const { result } = renderHook(() =>
        useExternalTrigger('id-a', undefined, undefined, { enableInjectionSlot: true })
      );

      act(() => result.current.handleOpenChange(true));

      const container = document.createElement('div');
      document.body.appendChild(container);
      act(() => result.current.injectionSlotProps?.ref(container));

      const iframe = document.createElement('iframe');
      document.getElementById('id-a-injection-slot')?.appendChild(iframe);
      const postMessage = vi.spyOn(iframe.contentWindow as Window, 'postMessage');

      act(() => result.current.handleOpenChange(false));
      expect(postMessage).toHaveBeenCalledWith({ event: 'requestClose', id: 'id-a' }, '*');

      postMessage.mockClear();
      act(() => result.current.handleOpenChange(true));
      act(() => {
        (window as unknown as Record<string, (id: string) => void>).closeTooltip('id-a');
      });
      expect(postMessage).not.toHaveBeenCalled();
    });

    it('renders the injection slot fully hidden (display: none) while not externally triggered', () => {
      const { result } = renderHook(() =>
        useExternalTrigger('id-a', undefined, undefined, { enableInjectionSlot: true })
      );

      act(() => result.current.handleOpenChange(true));
      expect(result.current.injectionSlotProps?.style).toEqual({ display: 'none' });
    });

    it('renders the injection slot laid-out-but-invisible (not display:none) while externally triggered and unsettled', () => {
      const { result } = renderHook(() =>
        useExternalTrigger('id-a', undefined, undefined, { enableInjectionSlot: true })
      );

      act(() => {
        (window as unknown as Record<string, (id: string) => void>).openTooltip('id-a');
      });

      expect(result.current.injectionSlotProps?.style).toEqual({
        visibility: 'hidden',
        position: 'absolute',
      });
    });
  });
});
