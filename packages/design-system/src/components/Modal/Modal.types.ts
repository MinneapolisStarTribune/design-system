import type { ReactNode, RefObject } from 'react';
import type { AccessibilityProps, BaseProps } from '@/types/globalTypes';
import type { MODAL_CLOSE_REASONS, MODAL_POSITIONS, MODAL_ROLES } from './Modal.constants';

export type ModalPosition = (typeof MODAL_POSITIONS)[number];
export type ModalRole = (typeof MODAL_ROLES)[number];
export type ModalCloseReason = (typeof MODAL_CLOSE_REASONS)[number];

/** The public components built on the modal base, used in error and warning messages. */
export type ModalComponentName = 'Drawer' | 'Dialog';

/** Props shared by `Drawer.Root` and `Dialog.Root`. Each redeclares the ones it documents differently. */
export interface ModalSharedProps extends BaseProps, Pick<AccessibilityProps, 'aria-label'> {
  children: ReactNode;
  /** Whether the panel is open. */
  open: boolean;
  /**
   * Called when the panel requests a close — via the X icon button, Escape or an overlay press —
   * with what triggered it (`'closeButton' | 'escapeKey' | 'overlayPress'`). Set `open` to `false`
   * in response, or ignore a reason (e.g. `'overlayPress'` while a form has unsaved input). Actions
   * inside the panel set it themselves.
   */
  onClose: (reason: ModalCloseReason) => void;
  /**
   * The ARIA role. Use `alertdialog` for urgent interruptions that need a response, like
   * confirming a deletion, and point `initialFocus` at the least destructive action.
   * @default 'dialog'
   */
  role?: ModalRole;
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
  /** Element to focus when the panel opens. Defaults to the panel itself. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** When set, the panel renders into this element instead of `document.body` (e.g. for Storybook). */
  portalRoot?: HTMLElement | null;
  'aria-label'?: string;
  /** Test id for the panel; also used as the prefix for `-overlay` and `-close-button`. */
  dataTestId?: string;
}

export interface ModalRootProps extends ModalSharedProps {
  /** Resolved placement for the current viewport. */
  position: ModalPosition;
  role: ModalRole;
  /** Whether the body section describes the panel via `aria-describedby`. */
  describeWithBody: boolean;
  /** Names the public component in dev warnings, e.g. `{ component: 'Drawer', heading: 'Heading' }`. */
  names: { component: ModalComponentName; heading: string };
  dataTestId: string;
}

export interface ModalSectionProps extends Pick<BaseProps, 'className' | 'dataTestId'> {
  children: ReactNode;
}

export interface ModalSectionBaseProps extends ModalSectionProps {
  /** The public component the section belongs to, for the "used outside Root" error. */
  componentName: ModalComponentName;
}
