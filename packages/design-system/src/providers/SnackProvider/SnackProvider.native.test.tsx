import { jest } from '@jest/globals';
import React, { useEffect } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { DesignSystemProvider } from '@/providers/DesignSystemProvider.native';
import { useToast } from './SnackProvider.native';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DesignSystemProvider brand="startribune">{children}</DesignSystemProvider>
);

function ToastTrigger({
  dataTestId,
  duration,
  onClose,
}: {
  dataTestId: string;
  duration?: number;
  onClose?: () => void;
}) {
  const { show } = useToast();

  useEffect(() => {
    show({
      title: 'Test toast',
      description: 'Secondary text',
      dataTestId,
      duration,
      variant: 'success',
      showIcon: false,
      onClose,
    });
  }, [show, dataTestId, duration, onClose]);

  return null;
}

function ToastTriggerWithAlias() {
  const { showToast } = useToast();

  useEffect(() => {
    showToast({
      title: 'Alias toast',
      dataTestId: 'toast-alias-native',
      duration: 0,
      variant: 'info',
      showIcon: false,
    });
  }, [showToast]);

  return null;
}

describe('SnackProvider (native)', () => {
  it('renders a toast from useToast inside DesignSystemProvider', async () => {
    render(<ToastTrigger dataTestId="toast-native-provider" duration={0} />, { wrapper });

    expect(await screen.findByTestId('toast-container')).toBeOnTheScreen();
    expect(await screen.findByTestId('toast-native-provider')).toBeOnTheScreen();
    expect(screen.getByText('Test toast')).toBeOnTheScreen();
  });

  it('auto-dismisses toast after the default duration', async () => {
    jest.useFakeTimers();

    render(<ToastTrigger dataTestId="toast-native-auto" />, { wrapper });

    expect(await screen.findByTestId('toast-native-auto')).toBeOnTheScreen();

    await act(async () => {
      jest.advanceTimersByTime(5001);
    });

    expect(screen.queryByTestId('toast-native-auto')).toBeNull();
    expect(screen.queryByTestId('toast-container')).toBeNull();

    jest.useRealTimers();
  });

  it('dismisses toast and calls onClose when the close button is pressed', async () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    render(<ToastTrigger dataTestId="toast-native-dismiss" duration={0} onClose={onClose} />, {
      wrapper,
    });

    fireEvent.press(await screen.findByRole('button', { name: 'Dismiss notification' }));
    await act(async () => {
      jest.advanceTimersByTime(121);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('toast-native-dismiss')).toBeNull();
    jest.useRealTimers();
  });

  it('supports the showToast alias', async () => {
    render(<ToastTriggerWithAlias />, { wrapper });

    expect(await screen.findByTestId('toast-alias-native')).toBeOnTheScreen();
    expect(screen.getByText('Alias toast')).toBeOnTheScreen();
  });

  it('throws a clear error when useToast is used outside SnackProvider', () => {
    function Outside() {
      useToast();
      return null;
    }

    expect(() => render(<Outside />)).toThrow('useSnack must be used within a SnackProvider.');
  });
});
