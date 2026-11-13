import type {
  ModalCloseReason,
  ModalHeadingProps,
  ModalRole,
  ModalSectionProps,
  ModalSharedProps,
} from '@/components/Modal/Modal.types';
import { DIALOG_MAX_WIDTHS } from './Dialog.constants';

export { DIALOG_MAX_WIDTHS };

export const DIALOG_WIDTH_OPTIONS = Object.keys(DIALOG_MAX_WIDTHS) as Array<
  keyof typeof DIALOG_MAX_WIDTHS
>;

export type DialogRole = ModalRole;
export type DialogCloseReason = ModalCloseReason;

export interface DialogProps extends ModalSharedProps {
  /**
   * Panel width preset from 768px up, also bounded by the available viewport width.
   * xs: 476px, sm: 500px, md: 560px, lg: 720px, xl: 1086px.
   * No effect on the mobile bottom sheet.
   * @default 'md'
   */
  maxWidth?: keyof typeof DIALOG_MAX_WIDTHS;
  /**
   * Stretch the panel to `maxWidth` when space allows. Set false to size it to its content.
   * No effect below 768px: the bottom sheet always fills the viewport width.
   * @default true
   */
  fullWidth?: boolean;
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
