'use client';

import { useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  FloatingList,
  FloatingNode,
  FloatingTree,
  useClick,
  useFloatingNodeId,
  useDismiss,
  useInteractions,
  useListNavigation,
  useMergeRefs,
} from '@floating-ui/react';
import {
  cloneTrigger,
  FloatingPopupSurface,
  PopupArrow,
  popupStyles,
  resolveArrowOffset,
} from '@/components/FloatingPopup/FloatingPopup';
import {
  createAnchoredMiddleware,
  useFloatingPopup,
} from '@/components/FloatingPopup/useFloatingPopup';
import type { PopupArrowSpec } from '@/components/FloatingPopup/FloatingPopup.types';
import { resolveResponsive, useBreakpoint } from '@/hooks/useResponsiveValue';
import styles from './Menu.module.scss';
import { MenuContext } from './MenuContext';
import { isHiddenItem } from './menuItems';
import type { MenuProps } from './Menu.types';

/** Size from the Core Components Dropdown Menu design. The arrow stays clear of the rounded corners. */
const MENU_ARROW_SPEC: PopupArrowSpec = { width: 12, height: 9, cornerInset: 16 };

/** A list of actions or links attached to a trigger. */
export const MenuRoot: React.FC<MenuProps> = (props) => (
  // The tree lets submenus count as inside the menu for dismissal and focus.
  <FloatingTree>
    <MenuRootContent {...props} />
  </FloatingTree>
);

MenuRoot.displayName = 'Menu.Root';

const MenuRootContent: React.FC<MenuProps> = ({
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
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
  const itemsRef = useRef<Array<HTMLElement | null>>([]);
  const surfaceId = useId();
  const nodeId = useFloatingNodeId();

  const breakpoint = useBreakpoint();
  const placement = resolveResponsive(placementProp, breakpoint) ?? 'bottom-start';
  const boundary = portalRoot ?? undefined;

  const {
    open,
    setOpen,
    setArrowElement,
    refs: { setReference, setFloating },
    context,
    floatingStyles,
  } = useFloatingPopup({
    open: openProp,
    onOpenChange: onOpenChangeProp,
    placement,
    nodeId,
    middleware: createAnchoredMiddleware({ boundary, arrowSpec: MENU_ARROW_SPEC, hideArrow }),
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
    disabledIndices: (index) => isHiddenItem(itemsRef.current[index]),
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    listNavigation,
  ]);

  const contextValue = useMemo(
    () => ({ activeIndex, getItemProps, closeFromItem: () => setOpen(false), boundary }),
    [activeIndex, getItemProps, setOpen, boundary]
  );

  const triggerRef = useMergeRefs([setReference, trigger.props.ref ?? null]);
  const triggerElement = cloneTrigger(
    trigger,
    triggerRef,
    getReferenceProps({
      // Set explicitly: `useRole` would replace the menu's own accessible name with the trigger's.
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      'aria-controls': open ? surfaceId : undefined,
    }),
    'pointer'
  );

  return (
    <FloatingNode id={nodeId}>
      {triggerElement}
      <FloatingPopupSurface
        context={context}
        setFloating={setFloating}
        floatingStyles={floatingStyles}
        portalProps={{ root: boundary }}
        focusProps={{ initialFocus: -1 }}
        lockScroll
        className={classNames(popupStyles.wrapper, styles.menu, className)}
        data-testid={dataTestId}
        {...getFloatingProps({
          // Shift+Tab would focus the trigger, which counts as inside, so the menu would stay
          // open. Close it instead, and focus returns to the trigger. Tab already closes it.
          onKeyDown: (event) => {
            if (event.key !== 'Tab' || !event.shiftKey) return;
            event.preventDefault();
            setOpen(false);
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
            arrowSpec={MENU_ARROW_SPEC}
            staticOffset={resolveArrowOffset(
              resolveResponsive(arrowOffset, breakpoint),
              placement,
              MENU_ARROW_SPEC
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
      </FloatingPopupSurface>
    </FloatingNode>
  );
};
