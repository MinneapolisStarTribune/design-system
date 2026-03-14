import { useEffect } from 'react';
import { act, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProvider } from '@/test-utils/render';
import { ToastRenderer, useToast } from './ToastRenderer';

const DEFAULT_DURATION_MS = 5000;

function ToastTrigger({ duration = DEFAULT_DURATION_MS }: { duration?: number }) {
  const { showToast } = useToast();
  useEffect(() => {
    showToast({
      title: 'Timed toast',
      dataTestId: 'timed-toast',
      duration,
    });
  }, [showToast, duration]);
  return null;
}

/** With two timeouts: exit starts at duration - 120ms, remove at duration. Toast is gone at exactly duration. */
describe('ToastRenderer', () => {
  it('removes toast from DOM at exactly the duration (5s) when using fake timers', async () => {
    vi.useFakeTimers();

    renderWithProvider(
      <ToastRenderer>
        <ToastTrigger />
      </ToastRenderer>
    );

    await act(async () => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByTestId('timed-toast')).toBeInTheDocument();

    // Just before 5s: toast still in DOM
    await act(async () => {
      vi.advanceTimersByTime(DEFAULT_DURATION_MS - 1);
    });
    expect(screen.getByTestId('timed-toast')).toBeInTheDocument();

    // At 5s: remove timeout fires, toast is removed
    await act(async () => {
      vi.advanceTimersByTime(2);
    });
    expect(screen.queryByTestId('timed-toast')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('measures total display time: toast is removed at exactly duration (exit starts at duration - 120ms)', async () => {
    vi.useFakeTimers();

    renderWithProvider(
      <ToastRenderer>
        <ToastTrigger />
      </ToastRenderer>
    );

    await act(async () => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByTestId('timed-toast')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(DEFAULT_DURATION_MS - 1);
    });
    expect(screen.getByTestId('timed-toast')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2);
    });
    expect(screen.queryByTestId('timed-toast')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('keeps toast container in DOM with correct structure', () => {
    vi.useFakeTimers();

    renderWithProvider(
      <ToastRenderer>
        <ToastTrigger duration={DEFAULT_DURATION_MS} />
      </ToastRenderer>
    );

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const container = screen.getByTestId('toast-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('role', 'region');
    expect(container).toHaveAttribute('aria-label', 'Notifications');

    const toast = screen.getByTestId('timed-toast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveAttribute('role', 'status');
    expect(container.contains(toast)).toBe(true);

    vi.useRealTimers();
  });
});
