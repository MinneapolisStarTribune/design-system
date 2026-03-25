import { useEffect } from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProvider } from '@/test-utils/render';
import { useCandyBar, useToast } from './SnackProvider';

function ToastTrigger({ dataTestId, duration }: { dataTestId: string; duration?: number }) {
  const { show } = useToast();
  useEffect(() => {
    show({ title: 'Test toast', dataTestId, duration, variant: 'success', showIcon: false });
  }, [show, dataTestId, duration]);
  return null;
}

function CandyBarTrigger({ text }: { text: string }) {
  const { show } = useCandyBar();
  useEffect(() => {
    show({ children: text });
  }, [show, text]);
  return null;
}

function CandyBarReplacementTrigger() {
  const { show } = useCandyBar();
  useEffect(() => {
    show({ children: 'First candy' });
    show({ children: 'Second candy' });
  }, [show]);
  return null;
}

function ToastAndCandyBarTrigger() {
  return (
    <>
      <ToastTrigger dataTestId="toast-simultaneous" duration={0} />
      <CandyBarTrigger text="Candy bar simultaneous" />
    </>
  );
}

describe('SnackProvider', () => {
  it('renders toast and candybar simultaneously without interference', async () => {
    renderWithProvider(<ToastAndCandyBarTrigger />);

    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    expect(await screen.findByTestId('toast-simultaneous')).toBeInTheDocument();
    expect(await screen.findByTestId('candy-bar-renderer')).toBeInTheDocument();
    expect(await screen.findByText('Candy bar simultaneous')).toBeInTheDocument();
  });

  it('isolates slots (toast does not render candybar; candybar does not render toast)', async () => {
    const { unmount } = renderWithProvider(
      <>
        <ToastTrigger dataTestId="toast-only" duration={0} />
      </>
    );

    await screen.findByTestId('toast-only');
    expect(screen.queryByTestId('candy-bar-renderer')).not.toBeInTheDocument();

    unmount();

    renderWithProvider(<CandyBarTrigger text="Candy bar only" />);
    expect(await screen.findByTestId('candy-bar-renderer')).toBeInTheDocument();
    expect(await screen.findByText('Candy bar only')).toBeInTheDocument();
    expect(screen.queryByTestId('toast-only')).not.toBeInTheDocument();
  });

  it('auto-dismisses toast after 5s default duration', async () => {
    vi.useFakeTimers();

    renderWithProvider(<ToastTrigger dataTestId="toast-auto" />);

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByTestId('toast-auto')).toBeInTheDocument();

    // Just before 5s: toast still in DOM
    await act(async () => {
      vi.advanceTimersByTime(4999);
    });
    expect(screen.getByTestId('toast-auto')).toBeInTheDocument();

    // At 5s: removed
    await act(async () => {
      vi.advanceTimersByTime(2);
    });
    expect(screen.queryByTestId('toast-auto')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('throws a clear error when useToast is used outside SnackProvider', () => {
    function Outside() {
      useToast();
      return null;
    }

    expect(() => render(<Outside />)).toThrow('useSnack must be used within a SnackProvider.');
  });

  it('replaces existing candybar on show() and never auto-dismisses', async () => {
    vi.useFakeTimers();

    renderWithProvider(<CandyBarReplacementTrigger />);

    // Allow CandyBarRenderer transition to mount when using fake timers.
    await act(async () => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByTestId('candy-bar-renderer')).toBeInTheDocument();
    expect(screen.getByText('Second candy')).toBeInTheDocument();
    expect(screen.queryByText('First candy')).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });

    expect(screen.getByText('Second candy')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
