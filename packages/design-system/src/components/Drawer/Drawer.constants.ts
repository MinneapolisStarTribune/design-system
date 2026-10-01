export const DRAWER_POSITIONS = ['top', 'left', 'bottom', 'right'] as const;

/** `alertdialog` is for urgent interruptions that need a response, like confirming a deletion. */
export const DRAWER_ROLES = ['dialog', 'alertdialog'] as const;

/** What triggered `onClose`. */
export const DRAWER_CLOSE_REASONS = ['closeButton', 'escapeKey', 'overlayPress'] as const;
