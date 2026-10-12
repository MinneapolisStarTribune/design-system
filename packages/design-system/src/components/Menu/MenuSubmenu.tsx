'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  FloatingList,
  FloatingNode,
  safePolygon,
  useClick,
  useDismiss,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
} from '@floating-ui/react';
import { ChevronRightIcon } from '@/icons';
import { FloatingPopupSurface, popupStyles } from '@/components/FloatingPopup/FloatingPopup';
import type { PopupArrowSpec } from '@/components/FloatingPopup/FloatingPopup.types';
import {
  createAnchoredMiddleware,
  useFloatingPopup,
} from '@/components/FloatingPopup/useFloatingPopup';
import styles from './Menu.module.scss';
import { MenuContext, useMenuContext } from './MenuContext';
import { isHiddenItem } from './menuItems';
import type { MenuSubmenuProps } from './Menu.types';

/** Submenus have no arrow, so only the gap from the parent item applies. */
const SUBMENU_ARROW_SPEC: PopupArrowSpec = { width: 0, height: 0, cornerInset: 0 };

type MenuOpenEvent = { nodeId: string | undefined; parentId: string | null };

/**
 * A row that opens a nested menu beside it. Right Arrow, Enter, Space, a click, or hovering opens
 * it. Left Arrow or Escape closes it and returns focus to the row.
 */
export const MenuSubmenu: React.FC<MenuSubmenuProps> = ({
  label,
  icon,
  disabled = false,
  children,
  className,
  dataTestId,
}) => {
  const parent = useMenuContext();
  const parentItem = useListItem();
  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const triggerId = useId();
  const submenuId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);

  const {
    open,
    setOpen,
    refs: { setReference, setFloating },
    context,
    floatingStyles,
  } = useFloatingPopup({
    open: undefined,
    onOpenChange: undefined,
    placement: 'right-start',
    disabled,
    nodeId,
    middleware: createAnchoredMiddleware({
      boundary: parent.boundary,
      arrowSpec: SUBMENU_ARROW_SPEC,
      hideArrow: true,
    }),
  });

  const hover = useHover(context, {
    enabled: !disabled,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  // Hover already opens it for a mouse, so a click only opens it for touch and pen.
  const click = useClick(context, { enabled: !disabled, toggle: false, ignoreMouse: true });
  // Escape closes only this submenu. A press outside the whole menu closes every level.
  const dismiss = useDismiss(context, { bubbles: { escapeKey: false, outsidePress: true } });
  const listNavigation = useListNavigation(context, {
    listRef: itemsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    nested: true,
    loop: true,
    disabledIndices: (index) => isHiddenItem(itemsRef.current[index]),
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    hover,
    click,
    dismiss,
    listNavigation,
  ]);

  // Opening one submenu closes its open siblings.
  useEffect(() => {
    if (!tree) return;
    const closeIfSibling = (event: MenuOpenEvent) => {
      if (event.nodeId !== nodeId && event.parentId === parentId) setOpen(false);
    };
    tree.events.on('menuopen', closeIfSibling);
    return () => tree.events.off('menuopen', closeIfSibling);
  }, [tree, nodeId, parentId, setOpen]);

  useEffect(() => {
    if (open) tree?.events.emit('menuopen', { nodeId, parentId } satisfies MenuOpenEvent);
  }, [tree, open, nodeId, parentId]);

  const contextValue = useMemo(
    () => ({
      activeIndex,
      getItemProps,
      closeFromItem: parent.closeFromItem,
      boundary: parent.boundary,
    }),
    [activeIndex, getItemProps, parent.closeFromItem, parent.boundary]
  );

  const triggerRef = useMergeRefs([setReference, parentItem.ref]);

  return (
    <FloatingNode id={nodeId}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? submenuId : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={parent.activeIndex === parentItem.index ? 0 : -1}
        data-testid={dataTestId}
        className={classNames(
          styles.item,
          'typography-utility-text-regular-medium',
          open && styles.itemExpanded,
          disabled && styles.itemDisabled,
          className
        )}
        {...getReferenceProps(parent.getItemProps())}
      >
        {icon && (
          <span aria-hidden="true" className={styles.icon}>
            {icon}
          </span>
        )}
        {label}
        <span aria-hidden="true" className={classNames(styles.icon, styles.iconEnd)}>
          <ChevronRightIcon size="medium" />
        </span>
      </button>
      <FloatingPopupSurface
        context={context}
        setFloating={setFloating}
        floatingStyles={floatingStyles}
        portalProps={{ root: parent.boundary }}
        focusProps={{ initialFocus: -1 }}
        className={classNames(popupStyles.wrapper, styles.menu)}
        {...getFloatingProps()}
        id={submenuId}
        role="menu"
        aria-labelledby={triggerId}
      >
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

MenuSubmenu.displayName = 'Menu.Submenu';
