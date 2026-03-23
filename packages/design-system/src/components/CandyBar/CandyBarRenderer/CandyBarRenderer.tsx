import React from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import { CandyBar } from '@/components/CandyBar/CandyBar';

export type CandyBarRendererItem = {
  id: string;
  children: React.ReactNode;
};

export type CandyBarRendererProps = {
  /** Single active candy bar item (pass first slot item from your provider). */
  activeItem: CandyBarRendererItem | null;
  /** Called when the candy bar close button is pressed. */
  onDismiss: (id: string) => void;
  /** When set, portal content mounts into this element instead of `document.body` (e.g. Storybook). */
  portalRoot?: HTMLElement | null;
};

/**
 * Provider-agnostic candy bar renderer. This only handles portal + transition + placement.
 * Feed `activeItem`/`onDismiss` from your snack provider integration layer.
 */
export const CandyBarRenderer: React.FC<CandyBarRendererProps> = ({
  activeItem,
  onDismiss,
  portalRoot,
}) => {
  const { refs, context } = useFloating({
    open: !!activeItem,
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 200,
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
      <FloatingFocusManager context={context} modal={false}>
        <div
          // eslint-disable-next-line react-hooks/refs -- Floating UI sets the floating node ref
          ref={refs.setFloating}
          style={transitionStyles}
        >
          <CandyBar onClose={() => onDismiss(activeItem.id)}>{activeItem.children}</CandyBar>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};
