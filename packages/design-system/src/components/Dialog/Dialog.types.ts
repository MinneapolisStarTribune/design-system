import type {
  ModalCloseReason,
  ModalHeadingProps,
  ModalRole,
  ModalSectionProps,
  ModalSharedProps,
} from '@/components/Modal/Modal.types';

export type DialogRole = ModalRole;
export type DialogCloseReason = ModalCloseReason;

export interface DialogProps extends ModalSharedProps {
  /** Dialog content. Compose with `Dialog.Title`, `Dialog.Content` and `Dialog.Actions`. */
  children: ModalSharedProps['children'];
  /**
   * Whether `Dialog.Content` describes the dialog via `aria-describedby`, so screen readers announce
   * it with the title. Keep it for short messages; forms and long content are noisy when read out.
   * @default true for `role="alertdialog"`, false otherwise
   */
  describeWithContent?: boolean;
  /** Accessible label for the dialog. Provide this when no `Dialog.Title` is rendered. */
  'aria-label'?: string;
  /**
   * Test id for the panel; also used as the prefix for `-overlay` and `-close-button`.
   * @default 'dialog'
   */
  dataTestId?: string;
}

export type DialogSectionProps = ModalSectionProps;
export type DialogTitleProps = ModalHeadingProps;

export interface DialogActionsProps extends DialogSectionProps {
  /**
   * At mobile breakpoint, stack the actions full width — the common pattern for short
   * confirmations. Turn it off to keep them side by side, for dialogs with more content like
   * forms. No effect from 768px up.
   * @default true
   */
  stackOnMobile?: boolean;
}
