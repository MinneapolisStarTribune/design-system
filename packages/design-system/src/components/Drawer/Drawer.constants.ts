import { MODAL_ROLES } from '@/components/Modal/Modal.constants';

export const DRAWER_POSITIONS = ['top', 'left', 'bottom', 'right'] as const;

/** `alertdialog` is for urgent interruptions that need a response, like confirming a deletion. */
export const DRAWER_ROLES = MODAL_ROLES;
