'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

type TriggerHandlers = { open: () => void; close: () => void };

/**
 * Module-level registry mapping an id to the open/close handlers of whichever mounted component
 * currently owns it. Not React state — read/written imperatively so external, non-React code (a
 * vendor script) can target a specific mounted instance by id without any React involvement.
 */
const registry = new Map<string, TriggerHandlers>();

const openById = (id: string) => registry.get(id)?.open();
const closeById = (id: string) => registry.get(id)?.close();

let boundGlobalNames: { openGlobalName: string; closeGlobalName: string } | null = null;

/**
 * Exposes `openById`/`closeById` as named globals on `window`, so an external script (loaded
 * outside this app's bundle) can call e.g. `window.openTooltip('some-id')` to trigger a mounted
 * component. Idempotent for the same pair of names; only reassigns when a caller requests
 * different ones.
 */
const bindGlobals = (openGlobalName: string, closeGlobalName: string) => {
  if (typeof window === 'undefined') return;
  if (
    boundGlobalNames?.openGlobalName === openGlobalName &&
    boundGlobalNames?.closeGlobalName === closeGlobalName
  ) {
    return;
  }

  boundGlobalNames = { openGlobalName, closeGlobalName };
  (window as unknown as Record<string, unknown>)[openGlobalName] = openById;
  (window as unknown as Record<string, unknown>)[closeGlobalName] = closeById;
};

/**
 * Binds the `window.openTooltip`/`window.closeTooltip` globals (or whatever names are given)
 * immediately, without waiting for any component to call `useExternalTrigger`. Call this once,
 * eagerly (e.g. at module scope in whatever bootstraps your vendor script), when something might
 * call these globals before any externally-triggerable component has mounted yet — otherwise the
 * globals only exist once a `useExternalTrigger` instance's own effect has run. Registering a
 * specific id is unaffected either way; this only concerns how early the globals themselves exist.
 *
 * @deprecated Part of the deprecated `TriggerablePopover`/`useExternalTrigger` mechanism — see
 * `useExternalTrigger`'s deprecation note for the replacement.
 */
export function installExternalTriggerGlobals(
  options: Pick<UseExternalTriggerOptions, 'openGlobalName' | 'closeGlobalName'> = {}
) {
  const { openGlobalName = 'openTooltip', closeGlobalName = 'closeTooltip' } = options;
  bindGlobals(openGlobalName, closeGlobalName);
}

export type UseExternalTriggerOptions = {
  /** Name of the `window` global an external script calls to open this component. Default: `"openTooltip"`. */
  openGlobalName?: string;
  /** Name of the `window` global an external script calls to close this component. Default: `"closeTooltip"`. */
  closeGlobalName?: string;
  /**
   * How long (ms) to keep the injection slot mounted after a locally-driven close (e.g. outside
   * click), so the fire-and-forget close notification has time to be delivered before the slot is
   * torn down. The component itself still closes instantly. Default: `200`.
   */
  closeNotifyGracePeriodMs?: number;
  /**
   * How long (ms) the injection slot's rendered size must stay unchanged (via `ResizeObserver`)
   * before it's revealed, so injected content (e.g. a vendor iframe) doesn't flash at a mis-sized
   * default while it resizes itself. An empty slot is never revealed. Default: `250`.
   */
  slotSettleDebounceMs?: number;
};

export type UseExternalTriggerResult = {
  /** Resolved open state — controlled by `openProp` when given, otherwise managed internally. */
  open: boolean;
  /**
   * Pass this to whatever actually drives local open/close (e.g. `useFloating`'s `onOpenChange`)
   * instead of `onOpenChangeProp` directly — it layers in the close-notification/grace-period
   * behavior and marks the change as locally- rather than externally-triggered.
   */
  handleOpenChange: (open: boolean) => void;
  /**
   * True while the current/most recent open was triggered externally (by id) rather than by a
   * normal in-app interaction (e.g. clicking the trigger). Use this to decide whether to render
   * this app's own content or defer to whatever's injected into the slot.
   */
  isExternallyTriggered: boolean;
  /** Pass to the popover shell so its content mounts before the first external open can target it. */
  forceMount: boolean;
  /**
   * Spread onto a plain wrapper `<div>` rendered inside the shell. `null` when no `id` was given
   * (i.e. this instance isn't externally triggerable). Don't hold your own ref to this wrapper's
   * children — the actual `id`-bearing node an external script targets is created imperatively as
   * a child of it (not the wrapper itself), since that node can be replaced/detached by the
   * external script in ways React can't safely reconcile if it holds a reference to it directly.
   *
   * `style` carries three distinct states, not a single visible/hidden toggle:
   * - not externally triggered: `display: none` — fully out of flow, nothing to measure.
   * - externally triggered, content not yet settled: `visibility: hidden` + `position: absolute` —
   *   still laid out (so injected content, e.g. a vendor iframe, actually renders and can be
   *   measured by `ResizeObserver`) but invisible and out of flow, so it can't flash at a
   *   mis-sized default or affect the shell's visible size while unsettled.
   * - externally triggered and settled: plain flow, fully visible.
   */
  injectionSlotProps: {
    ref: (el: HTMLDivElement | null) => void;
    'data-testid': string;
    style: CSSProperties;
  } | null;
};

/**
 * Makes a component externally addressable by id: an outside script can open/close it via
 * `window[openGlobalName]`/`window[closeGlobalName]`, and — when `enableInjectionSlot` is set —
 * reach a dedicated DOM node inside it to inject content into (e.g. a vendor iframe), with the
 * host notified across that boundary when the component closes some other way.
 *
 * Mirrors the controlled/uncontrolled convention used elsewhere in this package: pass through
 * whatever `open`/`onOpenChange` props your component itself received, exactly as given (`undefined`
 * for either means this hook manages state internally).
 *
 * Renders nothing itself; wire its return value into a popover/dialog-like shell.
 *
 * @deprecated Backs the deprecated `TriggerablePopover`. Use `Popover`'s controlled `open`/
 * `onOpenChange` props with `@minneapolisstartribune/external-trigger` (or any other trigger
 * source of your choosing) instead — it carries a typed payload rather than only a boolean
 * open/close signal, and doesn't require the iframe-injection-slot machinery here.
 */
export function useExternalTrigger(
  id: string | undefined,
  openProp: boolean | undefined,
  onOpenChangeProp: ((open: boolean) => void) | undefined,
  options: UseExternalTriggerOptions & { enableInjectionSlot?: boolean } = {}
): UseExternalTriggerResult {
  const {
    openGlobalName = 'openTooltip',
    closeGlobalName = 'closeTooltip',
    closeNotifyGracePeriodMs = 200,
    slotSettleDebounceMs = 250,
    enableInjectionSlot = false,
  } = options;

  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? openProp : internalOpen;

  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [closeNotifyGraceActive, setCloseNotifyGraceActive] = useState(false);
  const [isSlotVisible, setIsSlotVisible] = useState(false);

  const [isExternallyTriggered, setIsExternallyTriggered] = useState(false);

  const injectionSlotId = id && enableInjectionSlot ? `${id}-injection-slot` : undefined;
  const injectionSlotRef = useRef<HTMLDivElement | null>(null);
  const closeNotifyGraceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bindGlobals(openGlobalName, closeGlobalName);
  }, [openGlobalName, closeGlobalName]);

  const clearCloseNotifyGraceTimeout = useCallback(() => {
    if (closeNotifyGraceTimeoutRef.current !== null) {
      clearTimeout(closeNotifyGraceTimeoutRef.current);
      closeNotifyGraceTimeoutRef.current = null;
    }
  }, []);

  // Derived during render (not via an effect) per React's guidance for state that depends only
  // on a prior render's value: https://react.dev/learn/you-might-not-need-an-effect
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setHasOpenedOnce(true);
  }

  const notifyInjectionSlotOfClose = useCallback(() => {
    if (!injectionSlotId) return false;

    const el = document.getElementById(injectionSlotId);
    const iframe = el instanceof HTMLIFrameElement ? el : el?.querySelector('iframe');

    if (!iframe?.contentWindow) return false;

    iframe.contentWindow.postMessage({ event: 'requestClose', id }, '*');
    return true;
  }, [injectionSlotId, id]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChangeProp?.(next);
    },
    [isControlled, onOpenChangeProp]
  );

  /** Single entry point for every open (external or local) — they differ only in `isExternallyTriggered`. */
  const openFrom = useCallback(
    (source: 'external' | 'local') => {
      clearCloseNotifyGraceTimeout();
      setCloseNotifyGraceActive(false);
      setIsExternallyTriggered(source === 'external');
      setOpen(true);
    },
    [clearCloseNotifyGraceTimeout, setOpen]
  );

  /**
   * Single entry point for every close. Only a locally-driven close (outside click, Escape, a
   * close button) needs to notify the injection slot and hold it through the grace period — an
   * externally-driven close means the caller that closed it already knows.
   */
  const closeFrom = useCallback(
    (source: 'external' | 'local') => {
      setIsExternallyTriggered(false);
      setIsSlotVisible(false);

      if (source === 'local' && notifyInjectionSlotOfClose()) {
        clearCloseNotifyGraceTimeout();
        setCloseNotifyGraceActive(true);
        closeNotifyGraceTimeoutRef.current = setTimeout(() => {
          closeNotifyGraceTimeoutRef.current = null;
          setCloseNotifyGraceActive(false);
        }, closeNotifyGracePeriodMs);
      }

      setOpen(false);
    },
    [notifyInjectionSlotOfClose, clearCloseNotifyGraceTimeout, closeNotifyGracePeriodMs, setOpen]
  );

  useEffect(() => {
    if (!id) return;

    registry.set(id, {
      open: () => openFrom('external'),
      close: () => closeFrom('external'),
    });

    return () => {
      clearCloseNotifyGraceTimeout();
      registry.delete(id);
    };
  }, [id, openFrom, closeFrom, clearCloseNotifyGraceTimeout]);

  // Identifies the current "waiting to reveal" cycle: truthy only while open, externally
  // triggered, and a slot exists. Reset isSlotVisible synchronously during render (not in the
  // effect below) whenever this changes, per React's guidance for state derived from a prior
  // render's value: https://react.dev/learn/you-might-not-need-an-effect
  const revealCycleKey = open && isExternallyTriggered ? injectionSlotId : undefined;
  const [prevRevealCycleKey, setPrevRevealCycleKey] = useState(revealCycleKey);
  if (revealCycleKey !== prevRevealCycleKey) {
    setPrevRevealCycleKey(revealCycleKey);
    if (revealCycleKey) setIsSlotVisible(false);
  }

  /**
   * Reveals the injection slot only once it has real content and that content's size has settled
   * (debounced via `ResizeObserver`) — never for an empty slot. Falls back to polling if
   * `ResizeObserver` isn't available.
   */
  useEffect(() => {
    if (!revealCycleKey) return;

    const hasInjectedContent = () => {
      const target = document.getElementById(revealCycleKey);
      if (!target) return false;
      return target !== injectionSlotRef.current || target.childNodes.length > 0;
    };

    if (typeof ResizeObserver === 'undefined') {
      const pollId = setInterval(() => {
        if (hasInjectedContent()) {
          clearInterval(pollId);
          setIsSlotVisible(true);
        }
      }, slotSettleDebounceMs);

      return () => clearInterval(pollId);
    }

    const target = document.getElementById(revealCycleKey);
    if (!target) return;

    let settleTimeout: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver(() => {
      if (settleTimeout !== null) clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => {
        settleTimeout = null;
        if (hasInjectedContent()) setIsSlotVisible(true);
      }, slotSettleDebounceMs);
    });
    observer.observe(target);

    return () => {
      observer.disconnect();
      if (settleTimeout !== null) clearTimeout(settleTimeout);
    };
  }, [revealCycleKey, slotSettleDebounceMs]);

  /**
   * The external script replaces/detaches the node it targets, so that node can't be one React
   * holds a reference to (React would later throw trying to reconcile a node it no longer
   * recognizes). React owns only this wrapper; the actual `id`-bearing target is created
   * imperatively inside it, outside React's virtual DOM.
   */
  const setInjectionSlotContainer = useCallback(
    (container: HTMLDivElement | null) => {
      if (container && injectionSlotId) {
        const slot = document.createElement('div');
        slot.id = injectionSlotId;
        container.appendChild(slot);
        injectionSlotRef.current = slot;
        return;
      }

      const slot = injectionSlotRef.current;
      if (slot?.parentNode) slot.parentNode.removeChild(slot);
      injectionSlotRef.current = null;
    },
    [injectionSlotId]
  );

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) openFrom('local');
      else closeFrom('local');
    },
    [openFrom, closeFrom]
  );

  const forceMount = Boolean(injectionSlotId && (!hasOpenedOnce || closeNotifyGraceActive));

  return {
    open,
    handleOpenChange,
    isExternallyTriggered,
    forceMount,
    injectionSlotProps: injectionSlotId
      ? {
          ref: setInjectionSlotContainer,
          'data-testid': 'external-trigger-injection-slot',
          style: !isExternallyTriggered
            ? { display: 'none' }
            : !isSlotVisible
              ? { visibility: 'hidden', position: 'absolute' }
              : {},
        }
      : null,
  };
}
