export const MODAL_POSITIONS = ['top', 'left', 'bottom', 'right', 'center'] as const;

/** `alertdialog` is for urgent interruptions that need a response, like confirming a deletion. */
export const MODAL_ROLES = ['dialog', 'alertdialog'] as const;

/** Elements the heading can render as. `div` is for content that isn't a single heading. */
export const MODAL_HEADING_ELEMENTS = ['h1', 'h2', 'h3', 'h4', 'div'] as const;

/** What triggered `onClose`. */
export const MODAL_CLOSE_REASONS = ['closeButton', 'escapeKey', 'overlayPress'] as const;
