export const TOAST_VARIANTS = ['info', 'success', 'warning', 'error'] as const;
export type ToastVariant = (typeof TOAST_VARIANTS)[number];

/** Shared props for web and native Toast. */
export type ToastBaseProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  showIcon?: boolean;
  showCloseButton?: boolean;
  onClose: () => void;
  dataTestId?: string;
};

/** Web Toast — supports exit animation state from the renderer. */
export type ToastProps = ToastBaseProps & {
  exiting?: boolean;
};

/** Native Toast — supports exit animation state from the renderer. */
export type ToastNativeProps = ToastBaseProps & {
  exiting?: boolean;
};
