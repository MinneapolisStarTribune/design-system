export interface ToastNativeProps {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  showIcon?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  dataTestId?: string;
}

export const ToastNative: React.FC<ToastNativeProps> = () => {
  return null;
};
