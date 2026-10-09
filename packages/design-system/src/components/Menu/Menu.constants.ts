import { POSITIONS } from '@/types';

export const MENU_PLACEMENTS = POSITIONS.flatMap(
  (side) => [side, `${side}-start`, `${side}-end`] as const
);

/** Fixed arrow positions on the menu edge that faces the anchor. */
export const MENU_ARROW_OFFSETS = ['start', 'center', 'end'] as const;

/** Values passed to `onClose`. */
export const MENU_CLOSE_REASONS = [
  'escapeKey',
  'outsidePress',
  'focusOut',
  'itemSelect',
  'triggerClick',
] as const;
