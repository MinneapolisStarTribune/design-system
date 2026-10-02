import type { OffsetOptions, Placement } from '@floating-ui/react';
import type { MenuOrigin, MenuPlacement } from './Menu.types';

export const DEFAULT_ANCHOR_ORIGIN: MenuOrigin = { vertical: 'bottom', horizontal: 'left' };
export const DEFAULT_TRANSFORM_ORIGIN: MenuOrigin = { vertical: 'top', horizontal: 'left' };

const FRACTION = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 } as const;
const HORIZONTAL_ALIGNMENT = { left: '-start', center: '', right: '-end' } as const;
const VERTICAL_ALIGNMENT = { top: '-start', center: '', bottom: '-end' } as const;

export type MenuOriginPosition = {
  placement: MenuPlacement;
  /** True when the origins place the menu over the anchor. The menu then has no arrow edge. */
  coversAnchor: boolean;
  offset: OffsetOptions;
};

/**
 * Opposite origins set the menu side. The other origin axis sets alignment.
 * All other origin pairs place the menu over the anchor.
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

const getAlignedStart = (placement: Placement, anchorLength: number, menuLength: number) => {
  if (placement.endsWith('-start')) return 0;
  if (placement.endsWith('-end')) return anchorLength - menuLength;
  return (anchorLength - menuLength) / 2;
};

/**
 * Converts MUI-style origins to a Floating UI placement and offset.
 * The offset aligns the two origins.
 *
 * Menus beside the anchor use only `gap` on the main axis, so `flip` can move them.
 * Menus over the anchor use both axes. `flip` has no effect.
 */
export const getMenuOriginPosition = (
  anchorOrigin: MenuOrigin,
  transformOrigin: MenuOrigin,
  gap: number
): MenuOriginPosition => {
  const { placement, coversAnchor } = getOriginPlacement(anchorOrigin, transformOrigin);

  const offset: OffsetOptions = ({ rects: { reference, floating }, placement: current }) => {
    // Position the menu relative to the anchor when the origins meet.
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
