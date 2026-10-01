export const MODAL_POSITIONS = ['top', 'left', 'bottom', 'right', 'center'] as const;

/** `alertdialog` is for urgent interruptions that need a response, like confirming a deletion. */
export const MODAL_ROLES = ['dialog', 'alertdialog'] as const;

/** What triggered `onClose`. */
export const MODAL_CLOSE_REASONS = ['closeButton', 'escapeKey', 'overlayPress'] as const;
