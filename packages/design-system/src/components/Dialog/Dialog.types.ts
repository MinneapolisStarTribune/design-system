import type { ReactNode, RefObject } from 'react';
import type { AccessibilityProps, BaseProps } from '@/types/globalTypes';
import type { DIALOG_CLOSE_REASONS, DIALOG_ROLES } from './Dialog.constants';

export type DialogRole = (typeof DIALOG_ROLES)[number];
export type DialogCloseReason = (typeof DIALOG_CLOSE_REASONS)[number];

export interface DialogProps extends BaseProps, Pick<AccessibilityProps, 'aria-label'> {
  /** Dialog content. Compose with `Dialog.Title`, `Dialog.Content` and `Dialog.Actions`. */
  children: ReactNode;
  /** Whether the dialog is open. */
  open: boolean;
  /**
   * Called when the dialog requests a close — via the X icon button, Escape or an overlay press —
   * with what triggered it (`'closeButton' | 'escapeKey' | 'overlayPress'`). Set `open` to `false`
   * in response, or ignore a reason (e.g. `'overlayPress'` while a form has unsaved input). Actions
   * set it themselves.
   */
  onClose: (reason: DialogCloseReason) => void;
  /**
   * The ARIA role. Use `alertdialog` for urgent interruptions that need a response, like
   * confirming a deletion, and point `initialFocus` at the least destructive action.
   * @default 'dialog'
   */
  role?: DialogRole;
  /**
   * Whether `Dialog.Content` describes the dialog via `aria-describedby`, so screen readers announce
   * it with the title. Keep it for short messages; forms and long content are noisy when read out.
   * @default true for `role="alertdialog"`, false otherwise
   */
  describeWithContent?: boolean;
  /**
   * Accessible label for the X icon button.
   * @default 'Close'
   */
  closeLabel?: string;
  /**
   * Whether the top-right X icon button is rendered.
   * @default true
   */
  showCloseButton?: boolean;
  /** Element to focus when the dialog opens. Defaults to the panel itself. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** When set, the dialog renders into this element instead of `document.body` (e.g. for Storybook). */
  portalRoot?: HTMLElement | null;
  /** Accessible label for the dialog. Provide this when no `Dialog.Title` is rendered. */
  'aria-label'?: string;
  /**
   * Test id for the panel; also used as the prefix for `-overlay` and `-close-button`.
   * @default 'dialog'
   */
  dataTestId?: string;
}

export interface DialogSectionProps extends Pick<BaseProps, 'className' | 'dataTestId'> {
  children: ReactNode;
}
