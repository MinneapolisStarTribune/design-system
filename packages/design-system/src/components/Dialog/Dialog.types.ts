import type {
  ModalCloseReason,
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
