import { ARROW_OFFSETS } from '@/components/Popover/floatingPopup';
import type { PopupArrowSpec } from '@/components/Popover/floatingPopup';
import { POSITIONS } from '@/types';

export const MENU_PLACEMENTS = POSITIONS.flatMap(
  (side) => [side, `${side}-start`, `${side}-end`] as const
);

/** Fixed arrow positions on the menu edge that faces the anchor. */
export const MENU_ARROW_OFFSETS = ARROW_OFFSETS;

/** Size from the Core Components Dropdown Menu design. The arrow stays clear of the rounded corners. */
export const MENU_ARROW: PopupArrowSpec = { width: 12, height: 9, cornerInset: 16 };

/** Values passed to `onClose`. */
export const MENU_CLOSE_REASONS = [
  'escapeKey',
  'outsidePress',
  'focusOut',
  'itemSelect',
  'triggerClick',
] as const;
