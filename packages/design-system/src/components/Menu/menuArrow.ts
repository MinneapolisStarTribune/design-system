import type { MenuArrowPosition, MenuPlacement } from './Menu.types';

/** Arrow size from the Core Components Dropdown Menu design. Popover uses 16 × 8. */
export const MENU_ARROW_SIZE = { width: 12, height: 9 };

export const MENU_ARROW_CORNER_INSET = 16;

// FloatingSurface renders a 1px stroke on each side of the arrow SVG.
const ARROW_RENDERED_WIDTH = MENU_ARROW_SIZE.width + 2;
// Fixed arrows are centered in a 64px edge region in the approved menu design.
const FIXED_ARROW_EDGE_INSET = 32 - ARROW_RENDERED_WIDTH / 2;
const ARROW_EDGE_INSET = `${FIXED_ARROW_EDGE_INSET}px`;
// `staticOffset` sets the arrow's near edge. Subtract the rendered arrow width for the far edge.
const ARROW_FAR_EDGE = `calc(100% - ${FIXED_ARROW_EDGE_INSET + ARROW_RENDERED_WIDTH}px)`;

const ARROW_CENTER = `calc(50% - ${ARROW_RENDERED_WIDTH / 2}px)`;

/**
 * Converts `arrowPosition` to `FloatingSurface`'s `arrowStaticOffset` value.
 * Returns null when `arrowPosition` is not set. Floating UI then points to the anchor center.
 *
 * For `-end` placements, FloatingArrow measures from the menu end edge. This function swaps
 * `start` and `end` for these placements.
 */
export const resolveMenuArrowPosition = (
  arrowPosition: MenuArrowPosition | undefined,
  placement: MenuPlacement
): string | null => {
  if (arrowPosition === undefined) return null;
  if (arrowPosition === 'center') return ARROW_CENTER;

  const measuresFromEnd = placement.endsWith('-end');
  if (arrowPosition === 'start') return measuresFromEnd ? ARROW_FAR_EDGE : ARROW_EDGE_INSET;
  return measuresFromEnd ? ARROW_EDGE_INSET : ARROW_FAR_EDGE;
};
