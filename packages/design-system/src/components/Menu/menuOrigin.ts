import type { OffsetOptions, Placement } from '@floating-ui/react';
import type { MenuOrigin, MenuPlacement } from './Menu.types';

export const DEFAULT_ANCHOR_ORIGIN: MenuOrigin = { vertical: 'bottom', horizontal: 'left' };
export const DEFAULT_TRANSFORM_ORIGIN: MenuOrigin = { vertical: 'top', horizontal: 'left' };

const FRACTION = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 } as const;
const HORIZONTAL_ALIGNMENT = { left: '-start', center: '', right: '-end' } as const;
const VERTICAL_ALIGNMENT = { top: '-start', center: '', bottom: '-end' } as const;

export type MenuOriginPosition = {
  placement: MenuPlacement;
  /** True when the origins put the menu over the anchor. Then no edge is available for the arrow. */
  coversAnchor: boolean;
  offset: OffsetOptions;
};

/**
 * Origins on opposite edges set the side. For example, anchor bottom and menu top means "below".
 * The menu's origin on the other axis sets the alignment. All other pairs put the menu over the
 * anchor.
 */
const getOriginPlacement = (
  anchorOrigin: MenuOrigin,
  transformOrigin: MenuOrigin
): Pick<MenuOriginPosition, 'placement' | 'coversAnchor'> => {
  const below = `bottom${HORIZONTAL_ALIGNMENT[transformOrigin.horizontal]}` as const;

  if (anchorOrigin.vertical === 'bottom' && transformOrigin.vertical === 'top') {
    return { placement: below, coversAnchor: false };
  }
  if (anchorOrigin.vertical === 'top' && transformOrigin.vertical === 'bottom') {
    return {
      placement: `top${HORIZONTAL_ALIGNMENT[transformOrigin.horizontal]}`,
      coversAnchor: false,
    };
  }
  if (anchorOrigin.horizontal === 'right' && transformOrigin.horizontal === 'left') {
    return {
      placement: `right${VERTICAL_ALIGNMENT[transformOrigin.vertical]}`,
      coversAnchor: false,
    };
  }
  if (anchorOrigin.horizontal === 'left' && transformOrigin.horizontal === 'right') {
    return {
      placement: `left${VERTICAL_ALIGNMENT[transformOrigin.vertical]}`,
      coversAnchor: false,
    };
  }
  return { placement: below, coversAnchor: true };
};

/** Position of the menu's near edge on the cross axis, relative to the anchor's near edge. */
const getAlignedStart = (placement: Placement, anchorLength: number, menuLength: number) => {
  if (placement.endsWith('-start')) return 0;
  if (placement.endsWith('-end')) return anchorLength - menuLength;
  return (anchorLength - menuLength) / 2;
};

/**
 * Converts MUI-style origins to a Floating UI placement and an offset. The offset moves the menu
 * from the placement's position to the exact point where the two origins meet.
 *
 * When the menu is beside the anchor, the main axis gets only `gap`. This lets `flip` move the menu
 * to the opposite side. When the menu covers the anchor, the offset moves both axes, and `flip` has
 * no effect.
 */
export const getMenuOriginPosition = (
  anchorOrigin: MenuOrigin,
  transformOrigin: MenuOrigin,
  gap: number
): MenuOriginPosition => {
  const { placement, coversAnchor } = getOriginPlacement(anchorOrigin, transformOrigin);

  const offset: OffsetOptions = ({ rects: { reference, floating }, placement: current }) => {
    // Position of the menu's top-left corner, relative to the anchor's top-left corner, when the origins meet.
    const targetX =
      FRACTION[anchorOrigin.horizontal] * reference.width -
      FRACTION[transformOrigin.horizontal] * floating.width;
    const targetY =
      FRACTION[anchorOrigin.vertical] * reference.height -
      FRACTION[transformOrigin.vertical] * floating.height;

    if (current.startsWith('top') || current.startsWith('bottom')) {
      const mainAxis = current.startsWith('bottom')
        ? targetY - reference.height
        : -(targetY + floating.height);
      return {
        mainAxis: coversAnchor ? mainAxis : gap,
        crossAxis: targetX - getAlignedStart(current, reference.width, floating.width),
      };
    }

    const mainAxis = current.startsWith('right')
      ? targetX - reference.width
      : -(targetX + floating.width);
    return {
      mainAxis: coversAnchor ? mainAxis : gap,
      crossAxis: targetY - getAlignedStart(current, reference.height, floating.height),
    };
  };

  return { placement, coversAnchor, offset };
};
