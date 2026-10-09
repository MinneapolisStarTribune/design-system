'use client';

import { type KeyboardEvent, useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';
import type { OpenChangeReason } from '@floating-ui/react';
import { FloatingSurface } from '@/components/Popover/FloatingSurface';
import { resolveResponsive, useBreakpoint } from '@/hooks/useResponsiveValue';
import styles from './Menu.module.scss';
import { MENU_ARROW_CORNER_INSET, MENU_ARROW_SIZE, resolveMenuArrowOffset } from './menuArrow';
import { MenuContext } from './MenuContext';
import type { MenuCloseReason, MenuProps } from './Menu.types';

const ENABLED_ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

const getEnabledItems = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(ENABLED_ITEM_SELECTOR));

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

// Any other Floating UI reason is an outside press.
const CLOSE_REASONS: Partial<Record<OpenChangeReason, MenuCloseReason>> = {
  'escape-key': 'escapeKey',
  'focus-out': 'focusOut',
  click: 'triggerClick',
};

/** A list of actions or links attached to a trigger. */
export const MenuRoot: React.FC<MenuProps> = ({
  trigger,
  open,
  onOpen,
  onClose,
  placement: placementProp,
  hideArrow,
  arrowOffset,
  className,
  portalRoot,
  id,
  dataTestId = 'menu',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
}) => {
  const initialFocusRef = useRef<HTMLElement | null>(null);

  // All items have tabIndex -1. Set the first enabled item as the initial focus target.
  const listRef = useCallback((node: HTMLDivElement | null) => {
    initialFocusRef.current = node ? (getEnabledItems(node)[0] ?? null) : null;
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean, _event?: Event, reason?: OpenChangeReason) => {
      if (nextOpen) onOpen();
      else onClose((reason && CLOSE_REASONS[reason]) ?? 'outsidePress');
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
    <FloatingSurface
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      interactionRole="menu"
      placement={placement}
      lockScroll
      hideArrow={hideArrow}
      arrowStaticOffset={resolveMenuArrowOffset(
        resolveResponsive(arrowOffset, breakpoint),
        placement
      )}
      arrowSize={MENU_ARROW_SIZE}
      arrowPadding={MENU_ARROW_CORNER_INSET}
      initialFocus={initialFocusRef}
      portalRoot={portalRoot}
      id={id}
      dataTestId={dataTestId}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={classNames(styles.menu, className)}
      containerClassName={styles.container}
    >
      <MenuContext.Provider value={contextValue}>
        <div ref={listRef} className={styles.list} onKeyDown={handleKeyDown}>
          {children}
        </div>
      </MenuContext.Provider>
    </FloatingSurface>
  );
};

MenuRoot.displayName = 'Menu.Root';
