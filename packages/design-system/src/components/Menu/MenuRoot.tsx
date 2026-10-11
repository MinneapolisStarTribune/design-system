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
import {
  composeTriggerProps,
  getPopupMiddleware,
  PopupArrow,
  popupStyles,
  resolveArrowOffset,
} from '@/components/Popover/floatingPopup';
import { resolveResponsive, useBreakpoint } from '@/hooks/useResponsiveValue';
import styles from './Menu.module.scss';
import { MENU_ARROW } from './Menu.constants';
import { MenuContext } from './MenuContext';
import type { MenuProps } from './Menu.types';

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
  /** the active item index in a list */
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [arrowElement, setArrowElement] = useState<SVGSVGElement | null>(null);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);
  const surfaceId = useId();

  const breakpoint = useBreakpoint();
  const placement = resolveResponsive(placementProp, breakpoint) ?? 'bottom-start';
  const boundary = portalRoot ?? undefined;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) onOpen();
      else onClose();
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
      arrowSpec: MENU_ARROW,
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
    // Disabled items stay focusable, as APG menus require. Skip only items hidden with CSS, such as
    // per-breakpoint items. jsdom has no `checkVisibility`.
    disabledIndices: (index) => {
      const item = itemsRef.current[index];
      return !item || !(item.checkVisibility?.() ?? true);
    },
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    listNavigation,
  ]);

  const contextValue = useMemo(
    () => ({ activeIndex, getItemProps, closeFromItem: onClose }),
    [activeIndex, getItemProps, onClose]
  );

  const triggerRef = useMergeRefs([setReference, trigger.props.ref ?? null]);
  const triggerElement = cloneElement(trigger, {
    ...composeTriggerProps(
      trigger.props,
      getReferenceProps({
        // Set explicitly: `useRole` would replace the menu's own accessible name with the trigger's.
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? surfaceId : undefined,
      })
    ),
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
                {...getFloatingProps({
                  // Shift+Tab would focus the trigger, which counts as inside, so the menu would stay
                  // open. Close it instead, and focus returns to the trigger. Tab already closes it.
                  onKeyDown: (event) => {
                    if (event.key !== 'Tab' || !event.shiftKey) return;
                    event.preventDefault();
                    handleOpenChange(false);
                  },
                })}
                id={surfaceId}
                role="menu"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
              >
                {!hideArrow && (
                  <PopupArrow
                    ref={setArrowElement}
                    context={context}
                    arrowSpec={MENU_ARROW}
                    staticOffset={resolveArrowOffset(
                      resolveResponsive(arrowOffset, breakpoint),
                      placement,
                      MENU_ARROW
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
