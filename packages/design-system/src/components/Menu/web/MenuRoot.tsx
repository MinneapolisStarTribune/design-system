'use client';

import React, { KeyboardEvent, useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';
import type { OpenChangeReason } from '@floating-ui/react';
import { FLOATING_GAP, FloatingSurface } from '@/components/Popover/FloatingSurface';
import { resolveResponsive, useBreakpoint } from '@/hooks/useResponsiveValue';
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

// Map Floating UI close reasons to Menu close reasons.
const toCloseReason = (reason: OpenChangeReason | undefined): MenuCloseReason => {
  if (reason === 'escape-key') return 'escapeKey';
  if (reason === 'focus-out') return 'focusOut';
  if (reason === 'click') return 'triggerClick';
  return 'outsidePress';
};

export const MenuRoot: React.FC<MenuProps> = ({
  trigger,
  anchorEl,
  open,
  onOpen,
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

  // All items have tabIndex -1. Set the first enabled item as the initial focus target.
  const listRef = useCallback((node: HTMLDivElement | null) => {
    initialFocusRef.current = node ? (getEnabledItems(node)[0] ?? null) : null;
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean, _event?: Event, reason?: OpenChangeReason) => {
      if (nextOpen) onOpen?.();
      else onClose(toCloseReason(reason));
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

  const closeFromItem = useCallback(() => onClose('itemSelect'), [onClose]);
  const contextValue = useMemo(() => ({ closeFromItem }), [closeFromItem]);

  const breakpoint = useBreakpoint();
  const { vertical: anchorVertical, horizontal: anchorHorizontal } =
    resolveResponsive(anchorOrigin, breakpoint) ?? DEFAULT_ANCHOR_ORIGIN;
  const { vertical: transformVertical, horizontal: transformHorizontal } =
    resolveResponsive(transformOrigin, breakpoint) ?? DEFAULT_TRANSFORM_ORIGIN;
  const gap = (hideArrow ? 0 : MENU_ARROW_SIZE.height) + FLOATING_GAP;
  // Depend on origin fields so inline objects do not rebuild the middleware.
  const { placement, coversAnchor, offset } = useMemo(
    () =>
      getMenuOriginPosition(
        { vertical: anchorVertical, horizontal: anchorHorizontal },
        { vertical: transformVertical, horizontal: transformHorizontal },
        gap
      ),
    [anchorVertical, anchorHorizontal, transformVertical, transformHorizontal, gap]
  );
  const offsetDeps = useMemo(
    () => [anchorVertical, anchorHorizontal, transformVertical, transformHorizontal, gap],
    [anchorVertical, anchorHorizontal, transformVertical, transformHorizontal, gap]
  );

  const anchorProps = trigger ? { trigger } : { anchorEl: anchorEl ?? null };

  return (
    <FloatingSurface
      {...anchorProps}
      open={open}
      onOpenChange={handleOpenChange}
      interactionRole="menu"
      placement={placement}
      offset={offset}
      offsetDeps={offsetDeps}
      shiftCrossAxis={coversAnchor}
      lockScroll
      hideArrow={hideArrow || coversAnchor}
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
