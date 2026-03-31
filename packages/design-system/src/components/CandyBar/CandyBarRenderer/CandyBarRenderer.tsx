'use client';

import React from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import { CandyBar } from '@/components/CandyBar/CandyBar';

export type CandyBarRendererItem = {
  id: string;
  children: React.ReactNode;
  onClose?: () => void;
};

export type CandyBarRendererProps = {
  /** Single active candy bar item (pass first slot item from your provider — single-slot, not a queue). */
  activeItem: CandyBarRendererItem | null;
  /** Called when the candy bar should be removed (close button, Escape, or programmatic hide). */
  onDismiss: (id: string) => void;
  /** When set, portal content mounts into this element instead of `document.body` (e.g. Storybook). */
  portalRoot?: HTMLElement | null;
  /**
   * Accessible name for the floating region (focus trap).
   * @default 'Site notice'
   */
  'aria-label'?: string;
};

const TRANSITION_MS = 200;

/**
 * Renders the active CandyBar in a portal, full-width, flush to the bottom of the viewport.
 * Uses Floating UI for portal placement, enter/exit transitions, focus management, and Escape to dismiss.
 *
 * **Not** auto-dismissed (no timer) — stays until `onDismiss` clears `activeItem` or the user dismisses.
 * Provider-agnostic: feed `activeItem` / `onDismiss` from your snack/slot layer (e.g. single-slot `items[0]`).
 */
export const CandyBarRenderer: React.FC<CandyBarRendererProps> = ({
  activeItem,
  onDismiss,
  portalRoot,
  'aria-label': ariaLabel = 'Site notice',
}) => {
  const open = !!activeItem;

  const { refs, context } = useFloating({
    open,
    onOpenChange: (nextOpen) => {
      if (!nextOpen && activeItem) {
        onDismiss(activeItem.id);
      }
    },
  });

  const dismiss = useDismiss(context, {
    escapeKey: true,
    /** Bar is persistent — only explicit close / Escape, not outside click */
    outsidePress: false,
  });

  const { getFloatingProps } = useInteractions([dismiss]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: TRANSITION_MS,
    common: {
      position: 'fixed',
      insetInline: 0,
      bottom: 'max(0px, env(safe-area-inset-bottom))',
      zIndex: 10000,
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      pointerEvents: 'auto',
    },
    initial: {
      opacity: 0,
      transform: 'translateY(16px)',
    },
    open: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    close: {
      opacity: 0,
      transform: 'translateY(16px)',
    },
  });

  if (!isMounted || !activeItem) {
    return null;
  }

  return (
    <FloatingPortal root={portalRoot ?? undefined}>
      <FloatingFocusManager context={context} modal>
        <div
          // eslint-disable-next-line react-hooks/refs -- Floating UI sets the floating node ref
          ref={refs.setFloating}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          data-testid="candy-bar-renderer"
          {...getFloatingProps()}
          style={transitionStyles}
        >
          <CandyBar onClose={() => onDismiss(activeItem.id)}>{activeItem.children}</CandyBar>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};
