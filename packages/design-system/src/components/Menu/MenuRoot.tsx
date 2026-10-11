'use client';

import { cloneElement, useCallback, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingList,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useMergeRefs,
} from '@floating-ui/react';
import type { OpenChangeReason } from '@floating-ui/react';
import { getPopupMiddleware, PopupArrow, popupStyles } from '@/components/Popover/floatingPopup';
import { resolveResponsive, useBreakpoint } from '@/hooks/useResponsiveValue';
import styles from './Menu.module.scss';
import { MENU_ARROW_CORNER_INSET, MENU_ARROW_SIZE, resolveMenuArrowOffset } from './menuArrow';
import { MenuContext } from './MenuContext';
import type { MenuCloseReason, MenuProps } from './Menu.types';

// The reasons useClick, useDismiss, and FloatingFocusManager send with this setup.
const CLOSE_REASONS: Partial<Record<OpenChangeReason, MenuCloseReason>> = {
  'escape-key': 'escapeKey',
  'focus-out': 'focusOut',
  'outside-press': 'outsidePress',
  click: 'triggerClick',
};
// For a reason not listed above, the menu still closes and reports this.
const FALLBACK_CLOSE_REASON: MenuCloseReason = 'outsidePress';

/** A list of actions or links attached to a trigger. */
export const MenuRoot: React.FC<MenuProps> = ({
  trigger,
  open,
  onOpen,
  onClose,
  placement: placementProp,
  arrowOffset,
  hideArrow = false,
  portalRoot,
  className,
  dataTestId = 'menu',
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);
  const surfaceId = useId();

  const breakpoint = useBreakpoint();
  const placement = resolveResponsive(placementProp, breakpoint) ?? 'bottom-start';
  const boundary = portalRoot ?? undefined;

  const handleOpenChange = useCallback(
    (nextOpen: boolean, _event?: Event, reason?: OpenChangeReason) => {
      if (nextOpen) onOpen();
      else onClose((reason && CLOSE_REASONS[reason]) ?? FALLBACK_CLOSE_REASON);
    },
    [onOpen, onClose]
  );

  const {
    refs: { setReference, setFloating },
    context,
    floatingStyles,
  } = useFloating({
    placement,
    open,
    onOpenChange: handleOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: getPopupMiddleware({
      boundary,
      arrowElement,
      arrowSize: MENU_ARROW_SIZE,
      arrowPadding: MENU_ARROW_CORNER_INSET,
      hideArrow,
    }),
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  // Opens with Down Arrow or Up Arrow, focuses the first or last item, and handles Home and End.
  const listNavigation = useListNavigation(context, {
    listRef: itemsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    focusItemOnOpen: true,
    // Also skips items hidden with CSS, such as per-breakpoint items. jsdom has no `checkVisibility`.
    disabledIndices: (index) => {
      const item = itemsRef.current[index];
      return (
        !item ||
        item.getAttribute('aria-disabled') === 'true' ||
        !(item.checkVisibility?.() ?? true)
      );
    },
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    listNavigation,
  ]);

  const contextValue = useMemo(
    () => ({ getItemProps, closeFromItem: () => onClose('itemSelect') }),
    [getItemProps, onClose]
  );

  const triggerRef = useMergeRefs([setReference, trigger.props.ref ?? null]);
  const triggerElement = cloneElement(trigger, {
    ...getReferenceProps({
      ...trigger.props,
      // Set explicitly: `useRole` would replace the menu's own accessible name with the trigger's.
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      'aria-controls': open ? surfaceId : undefined,
    }),
    ref: triggerRef,
    // Element triggers keep their own display, and their own style wins over the cursor.
    style: { cursor: 'pointer', ...trigger.props.style },
  });

  return (
    <>
      {triggerElement}
      {open && (
        <FloatingPortal root={boundary}>
          {/* Lets presses through so the trigger can still toggle the menu. */}
          <FloatingOverlay lockScroll style={{ pointerEvents: 'none' }}>
            <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
              <div
                ref={setFloating}
                style={{ ...floatingStyles, pointerEvents: 'auto' }}
                className={classNames(popupStyles.wrapper, styles.menu, className)}
                data-testid={dataTestId}
                {...getFloatingProps()}
                id={surfaceId}
                role="menu"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
              >
                {!hideArrow && (
                  <PopupArrow
                    ref={setArrowElement}
                    context={context}
                    arrowSize={MENU_ARROW_SIZE}
                    staticOffset={resolveMenuArrowOffset(
                      resolveResponsive(arrowOffset, breakpoint),
                      placement
                    )}
                  />
                )}
                <div className={classNames(popupStyles.container, styles.container)}>
                  <div className={popupStyles.content}>
                    <MenuContext.Provider value={contextValue}>
                      <FloatingList elementsRef={itemsRef}>
                        <div className={styles.list}>{children}</div>
                      </FloatingList>
                    </MenuContext.Provider>
                  </div>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );
};

MenuRoot.displayName = 'Menu.Root';
