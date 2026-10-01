'use client';

import { CSSProperties, KeyboardEvent, useCallback, useContext, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { FloatingSurface } from '../../Popover/FloatingSurface';
import { PopoverPortalRootContext } from '../../Popover/PopoverContext';
import {
  getMenuPlacement,
  MENU_ARROW_CORNER_INSET,
  MENU_ARROW_SIZE,
  resolveMenuArrowOffset,
} from '../getMenuPlacement';
import { MenuContext } from '../MenuContext';
import { MenuProps } from '../Menu.types';
import styles from './Menu.module.scss';

const ENABLED_ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

const getEnabledItems = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(ENABLED_ITEM_SELECTOR));

const toCssLength = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value;

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

export const MenuRoot = ({
  anchorEl,
  open,
  onClose,
  anchorOrigin,
  transformOrigin,
  placement,
  closeOnSelect = true,
  hideArrow,
  arrowOffset,
  surfaceWidth,
  itemMinHeight,
  maxHeight,
  portalRoot,
  id,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  wrapperClassName,
  containerClassName,
  contentClassName,
  arrowClassName,
  children,
}: MenuProps) => {
  const initialFocusRef = useRef<HTMLElement | null>(null);

  // Items are all tabIndex -1, so point the focus manager at the first enabled one.
  const listRef = useCallback((node: HTMLDivElement | null) => {
    initialFocusRef.current = node ? (getEnabledItems(node)[0] ?? null) : null;
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) onClose?.();
    },
    [onClose]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = getEnabledItems(event.currentTarget);
    const current = items.findIndex((item) => item === document.activeElement);
    const next = getNextIndex(event.key, current, items.length);

    if (next === null || items.length === 0) return;

    event.preventDefault();
    items[next].focus();
  };

  const portalRootFromContext = useContext(PopoverPortalRootContext);
  const close = useCallback(() => onClose?.(), [onClose]);
  const resolvedPlacement = placement ?? getMenuPlacement(anchorOrigin, transformOrigin);
  const contextValue = useMemo(() => ({ closeOnSelect, close }), [closeOnSelect, close]);
  const surfaceStyle = {
    '--popover-min-width': toCssLength(surfaceWidth),
    '--popover-max-width': toCssLength(surfaceWidth),
    '--popover-max-height': toCssLength(maxHeight),
    '--menu-item-min-height': toCssLength(itemMinHeight),
  } as CSSProperties;

  return (
    <FloatingSurface
      anchorEl={anchorEl}
      open={open}
      onOpenChange={handleOpenChange}
      interactionRole="menu"
      placement={resolvedPlacement}
      hideArrow={hideArrow}
      arrowStaticOffset={resolveMenuArrowOffset(arrowOffset, resolvedPlacement)}
      arrowSize={MENU_ARROW_SIZE}
      arrowPadding={MENU_ARROW_CORNER_INSET}
      style={{ ...surfaceStyle, ...style }}
      initialFocus={initialFocusRef}
      portalRoot={portalRoot ?? portalRootFromContext}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      wrapperClassName={classNames(styles.menu, wrapperClassName)}
      containerClassName={classNames(styles.container, containerClassName)}
      contentClassName={contentClassName}
      arrowClassName={arrowClassName}
    >
      <MenuContext.Provider value={contextValue}>
        {/* Keyboard events bubble up from the focused menuitem; the div itself is not interactive. */}
        <div ref={listRef} className={styles.list} onKeyDown={handleKeyDown}>
          {children}
        </div>
      </MenuContext.Provider>
    </FloatingSurface>
  );
};
