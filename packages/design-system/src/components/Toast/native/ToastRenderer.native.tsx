import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ToastVariant } from '@/components/Toast/Toast.types';

import { ToastNative } from './Toast.native';

export type ToastRendererItem = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  showIcon?: boolean;
  showCloseButton?: boolean;
  exiting?: boolean;
  dataTestId?: string;
  onClose?: () => void;
};

export type ToastRendererProps = {
  items: ToastRendererItem[];
  onDismiss: (id: string) => void;
};

export const ToastRenderer: React.FC<ToastRendererProps> = ({ items, onDismiss }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.overlay} testID="toast-container">
      <View pointerEvents="box-none" style={styles.stack}>
        {items.map((toast) => (
          <ToastNative
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            showIcon={toast.showIcon}
            showCloseButton={toast.showCloseButton}
            exiting={toast.exiting}
            onClose={() => onDismiss(toast.id)}
            dataTestId={toast.dataTestId}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
  },
  stack: {
    width: '100%',
    maxWidth: 372,
    flexDirection: 'column-reverse',
    gap: 8,
  },
});
