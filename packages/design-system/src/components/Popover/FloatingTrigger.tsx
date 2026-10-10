'use client';

import { cloneElement, isValidElement, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { useMergeRefs } from '@floating-ui/react';
import type { OpenChangeReason } from '@floating-ui/react';

const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

type FloatingTriggerProps = {
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
  /** Sets `aria-haspopup`. Match the surface `role`. */
  popupRole: 'dialog' | 'menu';
  /** Id of the surface, used for `aria-controls`. */
  surfaceId: string;
  /** Receives the rendered trigger element, to pass to the surface as its `anchor`. */
  onElementChange: (element: HTMLElement | null) => void;
  isDisabled?: boolean;
};

type TriggerElementProps = {
  style?: CSSProperties;
  ref?: Ref<unknown>;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  [key: string]: unknown;
};

/** Internal trigger for Popover and Menu. Toggles on click and sets the popup ARIA attributes. */
export const FloatingTrigger = ({
  trigger,
  open,
  onOpenChange,
  popupRole,
  surfaceId,
  onElementChange,
  isDisabled,
}: FloatingTriggerProps) => {
  const childElement = isValidElement<TriggerElementProps>(trigger) ? trigger : null;
  const mergedRef = useMergeRefs([onElementChange, childElement?.props.ref ?? null]);
  // Space toggles on key up, like a native button, and only after a matching key down.
  const spacePressedRef = useRef(false);

  const toggle = (event: MouseEvent | KeyboardEvent) => {
    if (!isDisabled) onOpenChange(!open, event.nativeEvent, 'click');
  };

  const ariaProps = {
    'aria-haspopup': popupRole,
    'aria-expanded': open,
    'aria-controls': open ? surfaceId : undefined,
  };

  // Add ARIA attributes to a single trigger element. Otherwise, use a button-role wrapper.
  if (childElement) {
    return cloneElement(childElement, {
      ...ariaProps,
      ref: mergedRef,
      // Element triggers keep their own display, and their own style wins over the cursor.
      style: { cursor: isDisabled ? 'default' : 'pointer', ...childElement.props.style },
      onClick: (event: MouseEvent<HTMLElement>) => {
        childElement.props.onClick?.(event);
        toggle(event);
      },
    });
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter') toggle(event);
    if (event.key === ' ') {
      event.preventDefault();
      spacePressedRef.current = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== ' ' || !spacePressedRef.current) return;
    spacePressedRef.current = false;
    toggle(event);
  };

  return (
    <span
      ref={onElementChange}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      style={isDisabled ? DISABLED_TRIGGER_STYLE : ENABLED_TRIGGER_STYLE}
      {...ariaProps}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {trigger}
    </span>
  );
};
