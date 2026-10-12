import type { ComponentProps, ComponentPropsWithoutRef, CSSProperties, Ref } from 'react';
import type {
  AutoUpdateOptions,
  FloatingArrow,
  FloatingContext,
  FloatingFocusManager,
  FloatingPortal,
  Middleware,
  OpenChangeReason,
  Placement,
  Strategy,
} from '@floating-ui/react';
import { POSITIONS, type Position } from '@/types';

/** Side of the anchor the popup opens on, with an optional `-start` or `-end` edge alignment. */
export type FloatingPlacement = Position | `${Position}-${'start' | 'end'}`;

/** Every placement: each side alone, then aligned to its start or end edge. */
export const FLOATING_PLACEMENTS: readonly FloatingPlacement[] = POSITIONS.flatMap((side) => [
  side,
  `${side}-start` as const,
  `${side}-end` as const,
]);

export type PopupArrowSpec = {
  width: number;
  height: number;
  /** Minimum distance from the arrow to the surface's rounded corners. */
  cornerInset: number;
};

/** Fixed arrow positions on the surface edge that faces the anchor. */
export const ARROW_OFFSETS = ['start', 'center', 'end'] as const;

export type ArrowOffset = (typeof ARROW_OFFSETS)[number];

/** Trigger element props the popup reads before cloning the trigger. */
export type PopupTriggerProps = { style?: CSSProperties; ref?: Ref<Element> };

export type AnchoredMiddlewareOptions = {
  boundary: HTMLElement | undefined;
  arrowSpec: PopupArrowSpec;
  hideArrow?: boolean;
};

export type UseFloatingPopupOptions = {
  /** Controlled open state. When undefined, the popup keeps its own state. */
  open: boolean | undefined;
  onOpenChange: ((open: boolean) => void) | undefined;
  /** Called before `onOpenChange(false)` with Floating UI's reason, when it gives one. */
  onClose?: (reason: OpenChangeReason | undefined) => void;
  placement: Placement;
  /** Blocks opening. Closing still works. */
  disabled?: boolean;
  /** Receives the arrow element so `arrow()` can measure it. */
  middleware: (arrowElement: SVGSVGElement | null) => Middleware[];
  strategy?: Strategy;
  autoUpdateOptions?: AutoUpdateOptions;
  /** Registers the popup in a `FloatingTree`, for nested menus. */
  nodeId?: string;
};

export type FloatingPopupSurfaceProps = ComponentPropsWithoutRef<'div'> & {
  context: FloatingContext;
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  portalProps?: Omit<ComponentProps<typeof FloatingPortal>, 'children'>;
  /** `modal` defaults to false. */
  focusProps?: Omit<ComponentProps<typeof FloatingFocusManager>, 'context' | 'children'>;
  /**
   * Stops page scroll while open. The overlay lets presses through so the trigger can still toggle
   * the surface.
   */
  lockScroll?: boolean;
};

export type PopupArrowProps = Pick<
  ComponentProps<typeof FloatingArrow>,
  'ref' | 'context' | 'staticOffset' | 'className'
> & { arrowSpec: PopupArrowSpec };
