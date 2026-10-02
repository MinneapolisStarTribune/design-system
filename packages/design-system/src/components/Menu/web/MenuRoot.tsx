'use client';

import React, { KeyboardEvent, useCallback, useContext, useMemo, useRef } from 'react';
import classNames from 'classnames';
import type { OpenChangeReason } from '@floating-ui/react';
import { FloatingPortalRootContext } from '../../Popover/FloatingPortalRootContext';
import { FLOATING_GAP, FloatingSurface } from '../../Popover/FloatingSurface';
import { MENU_ARROW_CORNER_INSET, MENU_ARROW_SIZE, resolveMenuArrowOffset } from '../menuArrow';
import { MenuContext } from '../MenuContext';
import {
  DEFAULT_ANCHOR_ORIGIN,
  DEFAULT_TRANSFORM_ORIGIN,
  getMenuOriginPosition,
} from '../menuOrigin';
import { MenuCloseReason, MenuProps } from '../Menu.types';
import styles from './Menu.module.scss';

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

// `useDismiss` reports Escape and outside presses. The focus manager reports focus that leaves the
// menu. Nothing else closes an anchored menu.
const toCloseReason = (reason: OpenChangeReason | undefined): MenuCloseReason => {
  if (reason === 'escape-key') return 'escapeKey';
  if (reason === 'focus-out') return 'focusOut';
  return 'outsidePress';
};

export const MenuRoot: React.FC<MenuProps> = ({
  anchorEl,
  open,
  onClose,
  anchorOrigin,
  transformOrigin,
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

  // All items have tabIndex -1, so tell the focus manager to focus the first enabled item.
  const listRef = useCallback((node: HTMLDivElement | null) => {
    initialFocusRef.current = node ? (getEnabledItems(node)[0] ?? null) : null;
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean, _event?: Event, reason?: OpenChangeReason) => {
      if (!nextOpen) onClose?.(toCloseReason(reason));
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

  const portalRootFromContext = useContext(FloatingPortalRootContext);
  const closeFromItem = useCallback(() => onClose?.('itemSelect'), [onClose]);
  const contextValue = useMemo(() => ({ closeFromItem }), [closeFromItem]);

  const { vertical: anchorVertical, horizontal: anchorHorizontal } =
    anchorOrigin ?? DEFAULT_ANCHOR_ORIGIN;
  const { vertical: transformVertical, horizontal: transformHorizontal } =
    transformOrigin ?? DEFAULT_TRANSFORM_ORIGIN;
  const gap = (hideArrow ? 0 : MENU_ARROW_SIZE.height) + FLOATING_GAP;
  // Depends on the origin fields, not the objects, so inline origin objects don't rebuild the middleware on each render.
  const { placement, coversAnchor, offset } = useMemo(
    () =>
      getMenuOriginPosition(
        { vertical: anchorVertical, horizontal: anchorHorizontal },
        { vertical: transformVertical, horizontal: transformHorizontal },
        gap
      ),
    [anchorVertical, anchorHorizontal, transformVertical, transformHorizontal, gap]
  );

  return (
    <FloatingSurface
      anchorEl={anchorEl}
      open={open}
      onOpenChange={handleOpenChange}
      interactionRole="menu"
      placement={placement}
      offset={offset}
      shiftCrossAxis={coversAnchor}
      lockScroll
      hideArrow={hideArrow || coversAnchor}
      arrowStaticOffset={resolveMenuArrowOffset(arrowOffset, placement)}
      arrowSize={MENU_ARROW_SIZE}
      arrowPadding={MENU_ARROW_CORNER_INSET}
      initialFocus={initialFocusRef}
      portalRoot={portalRoot ?? portalRootFromContext}
      id={id}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      wrapperClassName={classNames(styles.menu, className)}
      containerClassName={styles.container}
      arrowClassName={styles.arrow}
    >
      <MenuContext.Provider value={contextValue}>
        {/* Keyboard events bubble up from the focused item. The div itself is not interactive. */}
        <div ref={listRef} className={styles.list} onKeyDown={handleKeyDown}>
          {children}
        </div>
      </MenuContext.Provider>
    </FloatingSurface>
  );
};

MenuRoot.displayName = 'Menu.Root';
