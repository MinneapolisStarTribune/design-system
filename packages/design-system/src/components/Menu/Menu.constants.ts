export const MENU_VERTICAL_ORIGINS = ['top', 'center', 'bottom'] as const;
export const MENU_HORIZONTAL_ORIGINS = ['left', 'center', 'right'] as const;

/** Fixed arrow positions along the menu edge that faces the anchor. */
export const MENU_ARROW_OFFSETS = ['start', 'center', 'end'] as const;

/** Reasons that `onClose` receives. */
export const MENU_CLOSE_REASONS = ['escapeKey', 'outsidePress', 'focusOut', 'itemSelect'] as const;
