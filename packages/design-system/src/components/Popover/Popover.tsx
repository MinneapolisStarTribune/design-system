import React, {
  cloneElement,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import styles from './Popover.module.scss';
import { PopoverBody } from './PopoverBody';
import {
  PopoverContext,
  PopoverPortalRootContext,
  PopoverPortalRootProvider,
} from './PopoverContext';
import { PopoverDescription } from './PopoverDescription';
import { PopoverDivider } from './PopoverDivider';
import { PopoverHeading } from './PopoverHeading';

export type Placement = 'top' | 'right' | 'bottom' | 'left';

export type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  /**
   * Which side of the trigger the popover appears on.
   * Defaults to 'bottom'.
   */
  placement?: Placement;
  isDisabled?: boolean;
  /**
   * Whether to trap focus inside the popover (modal behavior).
   * Use `true` for action-heavy popovers, `false` for informational ones.
   * Defaults to false.
   */
  modal?: boolean;
  className?: string;
  /** Controlled open state. If omitted, the component manages open state internally. */
  open?: boolean;
  /** Called when the popover requests an open/close transition. Required when `open` is provided. */
  onOpenChange?: (open: boolean) => void;
  /** When set, the popover content portals into this element instead of document.body (e.g. for Storybook). */
  portalRoot?: HTMLElement | null;
  /** Accessible label for the popover dialog. Provide this when no PopoverHeading is rendered. */
  'aria-label'?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'>;

const ARROW_HEIGHT = 8;
const GAP = 4;

// Extracted as a constant so it's not recreated on every render.
const DISABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'default' } as const;
const ENABLED_TRIGGER_STYLE = { display: 'inline-block', cursor: 'pointer' } as const;

const PopoverRoot: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  isDisabled,
  modal = false,
  className,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  portalRoot: portalRootProp,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const [openState, setOpenState] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);
  const headingId = useId();

  const portalRootFromContext = useContext(PopoverPortalRootContext);
  const resolvedPortalRoot = portalRootProp ?? portalRootFromContext ?? undefined;

  // Support controlled and uncontrolled modes
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isDisabled && nextOpen) return;
      if (!isControlled) setOpenState(nextOpen);
      onOpenChangeProp?.(nextOpen);
    },
    [isDisabled, isControlled, onOpenChangeProp]
  );

  const middleware = useMemo(
    () => [
      offset(ARROW_HEIGHT + GAP),
      shift({ boundary: resolvedPortalRoot, padding: GAP }),
      flip({ boundary: resolvedPortalRoot, padding: GAP }),
      // eslint-disable-next-line react-hooks/refs
      arrow({ element: arrowRef }),
    ],
    [resolvedPortalRoot]
  );

  const { refs, context, floatingStyles } = useFloating({
    placement,
    open,
    onOpenChange: handleOpenChange,
    whileElementsMounted: autoUpdate,
    middleware,
  });

  const click = useClick(context, { enabled: !isDisabled });
  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true });
  const role = useRole(context, { role: 'dialog' });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const close = useCallback(() => {
    if (!isControlled) {
      setOpenState(false);
    }
    onOpenChangeProp?.(false);
  }, [isControlled, onOpenChangeProp]);

  const childElement = isValidElement(trigger)
    ? (trigger as ReactElement<Record<string, unknown>> & { ref?: React.Ref<unknown> })
    : null;

  const mergedRef = useMergeRefs([refs.setReference, childElement?.ref ?? null]);

  const triggerStyle = isDisabled ? DISABLED_TRIGGER_STYLE : ENABLED_TRIGGER_STYLE;

  // Put ARIA attributes (aria-expanded, aria-haspopup) on the trigger when it's a single
  // element that allows them (e.g. button). Otherwise use a wrapper with role="button".
  const triggerElement = childElement ? (
    cloneElement(
      childElement,
      getReferenceProps({
        ...childElement.props,
        ref: mergedRef,
        // Merge consumer styles only when present to avoid creating an extra object
        // on every render when no custom style is provided
        style: childElement.props.style
          ? { ...childElement.props.style, ...triggerStyle }
          : triggerStyle,
      })
    )
  ) : (
    <span
      ref={refs.setReference}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      style={triggerStyle}
      {...getReferenceProps()}
    >
      {trigger}
    </span>
  );

  // Memoize context value to prevent unnecessary re-renders of all
  // context consumers when this component re-renders for unrelated reasons.
  const contextValue = useMemo(() => ({ close }), [close]);

  return (
    <PopoverPortalRootProvider>
      <PopoverContext.Provider value={contextValue}>
        {triggerElement}
        {open && (
          <FloatingPortal root={resolvedPortalRoot}>
            <FloatingFocusManager context={context} modal={modal}>
              <div
                // eslint-disable-next-line react-hooks/refs
                ref={refs.setFloating}
                style={floatingStyles}
                className={styles.wrapper}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabel ? undefined : `popover-heading-${headingId}`}
                {...getFloatingProps()}
                {...rest}
              >
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  height={ARROW_HEIGHT}
                  width={16}
                  fill="#fff"
                  stroke="#E3E5E8"
                  strokeWidth={1}
                />
                <div className={styles.container}>
                  <div className={`${styles.content} ${className ?? ''}`}>{children}</div>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </PopoverContext.Provider>
    </PopoverPortalRootProvider>
  );
};

/* Compound API */

type PopoverComponent = React.FC<PopoverProps> & {
  Heading: typeof PopoverHeading;
  Description: typeof PopoverDescription;
  Body: typeof PopoverBody;
  Divider: typeof PopoverDivider;
};

export const Popover = PopoverRoot as PopoverComponent;

Popover.Heading = PopoverHeading;
Popover.Body = PopoverBody;
Popover.Description = PopoverDescription;
Popover.Divider = PopoverDivider;
