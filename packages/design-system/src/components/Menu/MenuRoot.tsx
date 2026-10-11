'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { FloatingList, useInteractions, useListNavigation, useTypeahead } from '@floating-ui/react';
import type { OpenChangeReason } from '@floating-ui/react';
import { FloatingSurface, useFloatingSurface } from '@/components/Popover/FloatingSurface';
import { resolveResponsive, useBreakpoint } from '@/hooks/useResponsiveValue';
import styles from './Menu.module.scss';
import { MENU_ARROW_CORNER_INSET, MENU_ARROW_SIZE, resolveMenuArrowOffset } from './menuArrow';
import { MenuContext } from './MenuContext';
import type { MenuCloseReason, MenuProps } from './Menu.types';

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
  const elementsRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleOpenChange = useCallback(
    (nextOpen: boolean, _event?: Event, reason?: OpenChangeReason) => {
      if (nextOpen) onOpen();
      else onClose((reason && CLOSE_REASONS[reason]) ?? 'outsidePress');
    },
    [onOpen, onClose]
  );

  const breakpoint = useBreakpoint();
  const placement = resolveResponsive(placementProp, breakpoint) ?? 'bottom-start';

  const surface = useFloatingSurface({
    open,
    onOpenChange: handleOpenChange,
    placement,
    interactionRole: 'menu',
    hideArrow,
    arrowSize: MENU_ARROW_SIZE,
    arrowPadding: MENU_ARROW_CORNER_INSET,
    portalRoot,
    id,
  });

  // Skips items with aria-disabled="true".
  const listNavigation = useListNavigation(surface.context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    focusItemOnOpen: true,
  });
  const typeahead = useTypeahead(surface.context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: open ? setActiveIndex : undefined,
  });

  const interactions = useInteractions([...surface.interactions, listNavigation, typeahead]);
  const { getItemProps } = interactions;

  const contextValue = useMemo(
    () => ({ activeIndex, getItemProps, closeFromItem: () => onClose('itemSelect') }),
    [activeIndex, getItemProps, onClose]
  );

  return (
    <FloatingSurface
      surface={surface}
      interactions={interactions}
      trigger={trigger}
      lockScroll
      arrowStaticOffset={resolveMenuArrowOffset(
        resolveResponsive(arrowOffset, breakpoint),
        placement
      )}
      dataTestId={dataTestId}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={classNames(styles.menu, className)}
      containerClassName={styles.container}
    >
      <MenuContext.Provider value={contextValue}>
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          <div className={styles.list}>{children}</div>
        </FloatingList>
      </MenuContext.Provider>
    </FloatingSurface>
  );
};

MenuRoot.displayName = 'Menu.Root';
