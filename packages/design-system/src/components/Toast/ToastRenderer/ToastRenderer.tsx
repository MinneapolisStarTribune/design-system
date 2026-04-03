'use client';

import React from 'react';
import { FloatingPortal } from '@floating-ui/react';
import { Toast } from '@/components/Toast/Toast';
import type { ToastVariant } from '@/components/Toast/Toast';
import containerStyles from '@/components/Toast/Toast.module.scss';

export type ToastRendererItem = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  showIcon?: boolean;
  /** When true, the toast shows its exit animation. */
  exiting?: boolean;
  dataTestId?: string;
  onClose?: () => void;
};

export type ToastRendererProps = {
  /** Toasts to render. Provider owns timers + exiting state. */
  items: ToastRendererItem[];
  /** Called when the user dismisses a toast (close button). */
  onDismiss: (id: string) => void;
  /** When set, the toast container portals into this element instead of document.body (e.g. tests). */
  portalRoot?: HTMLElement | null;
};

/**
 * Slot-driven toast renderer (presentational).
 * - Provider owns timer scheduling and state updates.
 * - This component owns stacking and exit visuals.
 */
export const ToastRenderer: React.FC<ToastRendererProps> = ({ items, onDismiss, portalRoot }) => {
  return (
    <FloatingPortal root={portalRoot ?? undefined}>
      <div
        className={containerStyles.container}
        role="region"
        aria-label="Notifications"
        data-testid="toast-container"
        aria-live="polite"
      >
        {items.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            showIcon={toast.showIcon}
            exiting={toast.exiting}
            onClose={() => onDismiss(toast.id)}
            dataTestId={toast.dataTestId}
          />
        ))}
      </div>
    </FloatingPortal>
  );
};
