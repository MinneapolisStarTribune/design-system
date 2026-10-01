import type { MenuArrowOffset, MenuOrigin, MenuPlacement } from './Menu.types';

export const DEFAULT_ANCHOR_ORIGIN: MenuOrigin = { vertical: 'bottom', horizontal: 'left' };
export const DEFAULT_TRANSFORM_ORIGIN: MenuOrigin = { vertical: 'top', horizontal: 'left' };

const HORIZONTAL_ALIGNMENT = { left: '-start', center: '', right: '-end' } as const;
const VERTICAL_ALIGNMENT = { top: '-start', center: '', bottom: '-end' } as const;

/**
 * The side comes from the origins that sit on opposite edges (anchor bottom + menu top means "below");
 * alignment comes from the menu's origin on the other axis. Combos that would cover the anchor (e.g. top-left to top-left) fall back
 * to opening below, because the menu tip has to point at the anchor.
 */
export const getMenuPlacement = (
  anchorOrigin: MenuOrigin = DEFAULT_ANCHOR_ORIGIN,
  transformOrigin: MenuOrigin = DEFAULT_TRANSFORM_ORIGIN
): MenuPlacement => {
  if (anchorOrigin.vertical === 'bottom' && transformOrigin.vertical === 'top') {
    return `bottom${HORIZONTAL_ALIGNMENT[transformOrigin.horizontal]}`;
  }
  if (anchorOrigin.vertical === 'top' && transformOrigin.vertical === 'bottom') {
    return `top${HORIZONTAL_ALIGNMENT[transformOrigin.horizontal]}`;
  }
  if (anchorOrigin.horizontal === 'right' && transformOrigin.horizontal === 'left') {
    return `right${VERTICAL_ALIGNMENT[transformOrigin.vertical]}`;
  }
  if (anchorOrigin.horizontal === 'left' && transformOrigin.horizontal === 'right') {
    return `left${VERTICAL_ALIGNMENT[transformOrigin.vertical]}`;
  }
  return `bottom${HORIZONTAL_ALIGNMENT[transformOrigin.horizontal]}`;
};

/** Core Components' Menu pointer specifies 12 × 9. Popover keeps its own 16 × 8 default. */
export const MENU_ARROW_SIZE = { width: 12, height: 9 };
/** Keeps the arrow clear of the Popover's 16px rounded corners. */
export const MENU_ARROW_CORNER_INSET = 16;
const ARROW_EDGE_INSET = `${MENU_ARROW_CORNER_INSET}px`;
// The same inset from the far edge: staticOffset positions the arrow box's near edge.
const ARROW_FAR_EDGE = `calc(100% - ${MENU_ARROW_CORNER_INSET + MENU_ARROW_SIZE.width}px)`;
// Centring subtracts half the arrow box's width.
const ARROW_CENTER = `calc(50% - ${MENU_ARROW_SIZE.width / 2}px)`;

/**
 * Maps `arrowOffset` to Popover's `arrowStaticOffset`. Leaving it unset returns null so
 * floating-ui aims the arrow at the anchor's centre.
 *
 * FloatingArrow measures a static offset from the menu's end edge (right/bottom) for '-end'
 * placements and from its start edge otherwise. 'start' and 'end' are converted so they always
 * mean the menu's start and end edges; numbers and CSS lengths are passed through, so they are
 * measured from whichever edge FloatingArrow uses.
 */
export const resolveMenuArrowOffset = (
  arrowOffset: MenuArrowOffset | undefined,
  placement: MenuPlacement
): string | number | null => {
  if (arrowOffset === undefined || arrowOffset === null) return null;
  if (arrowOffset === 'center') return ARROW_CENTER;

  const measuresFromEnd = placement.endsWith('-end');
  if (arrowOffset === 'start') return measuresFromEnd ? ARROW_FAR_EDGE : ARROW_EDGE_INSET;
  if (arrowOffset === 'end') return measuresFromEnd ? ARROW_EDGE_INSET : ARROW_FAR_EDGE;
  return arrowOffset;
};
