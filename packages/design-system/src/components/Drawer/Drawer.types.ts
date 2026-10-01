import type {
  ModalCloseReason,
  ModalRole,
  ModalSectionProps,
  ModalSharedProps,
} from '@/components/Modal/Modal.types';
import type { Responsive } from '@/types/globalTypes';
import type { DRAWER_POSITIONS } from './Drawer.constants';

export type DrawerPosition = (typeof DRAWER_POSITIONS)[number];
export type DrawerRole = ModalRole;
export type DrawerCloseReason = ModalCloseReason;

export interface DrawerProps extends ModalSharedProps {
  /** Drawer content. Compose with `Drawer.Heading`, `Drawer.Body` and `Drawer.Footer`. */
  children: ModalSharedProps['children'];
  /**
   * The edge the drawer is attached to. Pass one edge for every screen size, or an object keyed
   * by breakpoint (`small`, `medium` 768px+, `large` 1160px+); each key applies from that
   * breakpoint up, and sizes below the smallest key use the default.
   * @default { small: 'bottom', medium: 'right' }
   */
  position?: Responsive<DrawerPosition>;
  /**
   * Whether `Drawer.Body` describes the drawer via `aria-describedby`, so screen readers announce it
   * with the name. Keep it for short messages; long or interactive content is noisy when read out.
   * @default true for `role="alertdialog"`, false otherwise
   */
  describeWithBody?: boolean;
  /** Accessible label for the drawer. Provide this when no `Drawer.Heading` is rendered. */
  'aria-label'?: string;
  /**
   * Test id for the panel; also used as the prefix for `-overlay` and `-close-button`.
   * @default 'drawer'
   */
  dataTestId?: string;
}

export type DrawerSectionProps = ModalSectionProps;
