import type { ComponentProps, CSSProperties, Ref } from 'react';
import type { FloatingArrow, Placement } from '@floating-ui/react';

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

export type PopupMiddlewareOptions = {
  boundary: HTMLElement | undefined;
  arrowElement: SVGSVGElement | null;
  arrowSpec: PopupArrowSpec;
  hideArrow?: boolean;
};

export type UsePopupOptions = Omit<PopupMiddlewareOptions, 'arrowElement'> & {
  /** Controlled open state. When undefined, the popup keeps its own state. */
  open: boolean | undefined;
  onOpenChange: ((open: boolean) => void) | undefined;
  placement: Placement;
  /** Blocks opening. Closing still works. */
  disabled?: boolean;
};

export type PopupArrowProps = Pick<
  ComponentProps<typeof FloatingArrow>,
  'ref' | 'context' | 'staticOffset'
> & { arrowSpec: PopupArrowSpec };
