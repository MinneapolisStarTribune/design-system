'use client';

import { type KeyboardEvent, useCallback, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import type { OpenChangeReason } from '@floating-ui/react';
import { FloatingSurface } from '@/components/Popover/FloatingSurface';
import { FloatingTrigger } from '@/components/Popover/FloatingTrigger';
import { resolveResponsive, useBreakpoint } from '@/hooks/useResponsiveValue';
import styles from './Menu.module.scss';
import { MENU_ARROW_CORNER_INSET, MENU_ARROW_SIZE, resolveMenuArrowOffset } from './menuArrow';
import { MenuContext } from './MenuContext';
import type { MenuCloseReason, MenuProps } from './Menu.types';

const POPUP_ROLE = 'menu';
const ENABLED_ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

// Skips items hidden with CSS, such as per-breakpoint items. jsdom has no `checkVisibility`.
const getEnabledItems = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(ENABLED_ITEM_SELECTOR)).filter(
    (item) => item.checkVisibility?.() ?? true
  );

const getNextIndex = (key: string, current: number, count: number) => {
  switch (key) {
    case 'ArrowDown':
      return (current + 1) % count;
    case 'ArrowUp':
      return current <= 0 ? count - 1 : current - 1;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
};

// The reasons FloatingTrigger, useDismiss, and FloatingFocusManager send with this setup.
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
  className,
  dataTestId = 'menu',
  children,
  ...rest
}) => {
  const initialFocusRef = useRef<HTMLElement | null>(null);
  const focusLastOnOpenRef = useRef(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const surfaceId = useId();

  // All items have tabIndex -1. Set the first enabled item, or the last after Up Arrow, as the initial focus target.
  const listRef = useCallback((node: HTMLDivElement | null) => {
    const items = node ? getEnabledItems(node) : [];
    initialFocusRef.current =
      (focusLastOnOpenRef.current ? items[items.length - 1] : items[0]) ?? null;
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean, event?: Event, reason?: OpenChangeReason) => {
      if (nextOpen) {
        focusLastOnOpenRef.current = event instanceof KeyboardEvent && event.key === 'ArrowUp';
        onOpen();
      } else onClose((reason && CLOSE_REASONS[reason]) ?? FALLBACK_CLOSE_REASON);
    },
    [onOpen, onClose]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = getEnabledItems(event.currentTarget);
    const current = items.findIndex((item) => item === document.activeElement);
    const next = getNextIndex(event.key, current, items.length);

    if (next === null || items.length === 0) return;

    event.preventDefault();
    items[next].focus();
  };

  const contextValue = useMemo(() => ({ closeFromItem: () => onClose('itemSelect') }), [onClose]);

  const breakpoint = useBreakpoint();
  const placement = resolveResponsive(placementProp, breakpoint) ?? 'bottom-start';

  return (
    <>
      <FloatingTrigger
        trigger={trigger}
        open={open}
        onOpenChange={handleOpenChange}
        popupRole={POPUP_ROLE}
        surfaceId={surfaceId}
        onElementChange={setAnchorElement}
      />
      <FloatingSurface
        {...rest}
        anchor={anchorElement}
        open={open}
        onOpenChange={handleOpenChange}
        role={POPUP_ROLE}
        id={surfaceId}
        placement={placement}
        lockScroll
        arrowStaticOffset={resolveMenuArrowOffset(
          resolveResponsive(arrowOffset, breakpoint),
          placement
        )}
        arrowSize={MENU_ARROW_SIZE}
        arrowPadding={MENU_ARROW_CORNER_INSET}
        initialFocus={initialFocusRef}
        dataTestId={dataTestId}
        className={classNames(styles.menu, className)}
        containerClassName={styles.container}
      >
        <MenuContext.Provider value={contextValue}>
          <div ref={listRef} className={styles.list} onKeyDown={handleKeyDown}>
            {children}
          </div>
        </MenuContext.Provider>
      </FloatingSurface>
    </>
  );
};

MenuRoot.displayName = 'Menu.Root';
