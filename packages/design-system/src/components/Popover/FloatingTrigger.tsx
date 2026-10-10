'use client';

import { cloneElement, isValidElement, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { useMergeRefs } from '@floating-ui/react';
import type { OpenChangeReason } from '@floating-ui/react';

const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;
// Elements whose own keyboard behavior fires click or uses Enter and Space for input.
const NATIVE_KEYBOARD_SELECTOR = 'button, a[href], input, select, textarea, summary';

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
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLElement>) => void;
  [key: string]: unknown;
};

/** Enter activates on key down. Space activates on key up, only after a matching key down, like a native button. */
const useButtonKeys = (activate: (event: KeyboardEvent) => void) => {
  const spacePressedRef = useRef(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') activate(event);
    if (event.key === ' ') {
      event.preventDefault();
      spacePressedRef.current = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== ' ' || !spacePressedRef.current) return;
    spacePressedRef.current = false;
    activate(event);
  };

  return { handleKeyDown, handleKeyUp };
};

/** Internal trigger for Popover and Menu. Toggles on click, Enter, and Space, and sets the popup ARIA attributes. */
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
  const toggle = (event: MouseEvent | KeyboardEvent) => {
    if (!isDisabled) onOpenChange(!open, event.nativeEvent, 'click');
  };

  const ariaProps = {
    'aria-haspopup': popupRole,
    'aria-expanded': open,
    'aria-controls': open ? surfaceId : undefined,
    'aria-disabled': isDisabled || undefined,
  };

  const { handleKeyDown, handleKeyUp } = useButtonKeys(toggle);

  // Menu buttons also open with Down Arrow or Up Arrow. The menu reads the key to pick the first or last item.
  const handleArrowKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (popupRole !== 'menu' || open || isDisabled) return;
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    onOpenChange(true, event.nativeEvent, 'list-navigation');
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
      // Give element triggers without native button behavior, like `div role="button"`, the same keys.
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        childElement.props.onKeyDown?.(event);
        if (event.defaultPrevented) return;
        handleArrowKeyDown(event);
        if (event.currentTarget.matches(NATIVE_KEYBOARD_SELECTOR)) return;
        handleKeyDown(event);
      },
      onKeyUp: (event: KeyboardEvent<HTMLElement>) => {
        childElement.props.onKeyUp?.(event);
        if (event.defaultPrevented || event.currentTarget.matches(NATIVE_KEYBOARD_SELECTOR)) return;
        handleKeyUp(event);
      },
    });
  }

  return (
    <span
      ref={onElementChange}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      style={isDisabled ? DISABLED_TRIGGER_STYLE : ENABLED_TRIGGER_STYLE}
      {...ariaProps}
      onClick={toggle}
      onKeyDown={(event) => {
        handleArrowKeyDown(event);
        handleKeyDown(event);
      }}
      onKeyUp={handleKeyUp}
    >
      {trigger}
    </span>
  );
};
