import type { MenuArrowOffset, MenuPlacement } from './Menu.types';

/** Arrow size from the Core Components Dropdown Menu design (12 × 9). Popover uses its own 16 × 8 size. */
export const MENU_ARROW_SIZE = { width: 12, height: 9 };
/** Minimum distance between the arrow and the 16px rounded corners. */
export const MENU_ARROW_CORNER_INSET = 16;
const ARROW_EDGE_INSET = `${MENU_ARROW_CORNER_INSET}px`;
// The same inset from the far edge. `staticOffset` sets the arrow's near edge, so subtract its width.
const ARROW_FAR_EDGE = `calc(100% - ${MENU_ARROW_CORNER_INSET + MENU_ARROW_SIZE.width}px)`;
// To center the arrow, subtract half of its width.
const ARROW_CENTER = `calc(50% - ${MENU_ARROW_SIZE.width / 2}px)`;

/**
 * Converts `arrowOffset` to the `arrowStaticOffset` value for `FloatingSurface`. Returns null when
 * `arrowOffset` is not set, so Floating UI points the arrow at the center of the anchor.
 *
 * For '-end' placements, FloatingArrow measures from the menu's end edge (right or bottom). For all
 * other placements, it measures from the start edge. So for '-end' placements, this function swaps
 * 'start' and 'end'.
 */
export const resolveMenuArrowOffset = (
  arrowOffset: MenuArrowOffset | undefined,
  placement: MenuPlacement
): string | null => {
  if (arrowOffset === undefined) return null;
  if (arrowOffset === 'center') return ARROW_CENTER;

  const measuresFromEnd = placement.endsWith('-end');
  if (arrowOffset === 'start') return measuresFromEnd ? ARROW_FAR_EDGE : ARROW_EDGE_INSET;
  return measuresFromEnd ? ARROW_EDGE_INSET : ARROW_FAR_EDGE;
};
