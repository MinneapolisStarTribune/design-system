export const MENU_VERTICAL_ORIGINS = ['top', 'center', 'bottom'] as const;
export const MENU_HORIZONTAL_ORIGINS = ['left', 'center', 'right'] as const;

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
