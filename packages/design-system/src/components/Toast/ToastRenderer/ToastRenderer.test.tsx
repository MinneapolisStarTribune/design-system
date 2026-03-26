import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToastRenderer } from '@/components/Toast/ToastRenderer/ToastRenderer';

describe('ToastRenderer', () => {
  it('renders toast container and provided toasts', () => {
    const onDismiss = vi.fn();

    render(
      <ToastRenderer
        items={[
          {
            id: 'toast-1',
            title: 'Hello',
            description: 'World',
            variant: 'success',
            showIcon: false,
            exiting: false,
            dataTestId: 'toast-test',
          },
        ]}
        onDismiss={onDismiss}
      />
    );

    const container = screen.getByTestId('toast-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('role', 'region');
    expect(container).toHaveAttribute('aria-label', 'Notifications');

    const toast = screen.getByTestId('toast-test');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveAttribute('role', 'status');
    expect(container.contains(toast)).toBe(true);
  });

  it('calls onDismiss(id) when the close button is clicked', () => {
    const onDismiss = vi.fn();

    render(
      <ToastRenderer
        items={[
          {
            id: 'toast-dismiss-me',
            title: 'Dismiss me',
            variant: 'info',
            showIcon: true,
            exiting: false,
          },
        ]}
        onDismiss={onDismiss}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith('toast-dismiss-me');
  });
});
