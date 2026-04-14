import { useEffect } from 'react';
import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ToastVariant } from '@/components/Toast/Toast.types';
import { renderAndCheckA11y } from '@/test-utils/a11y';
import { useToast } from '@/providers/SnackProvider/SnackProvider';

function ToastTrigger({
  dataTestId = 'timed-toast',
  variant = 'success',
}: {
  dataTestId?: string;
  variant?: ToastVariant;
}) {
  const { show } = useToast();
  useEffect(() => {
    show({
      title: variant === 'error' ? 'Something went wrong' : 'Update saved',
      description: variant === 'error' ? 'Please try again.' : 'Your changes have been saved.',
      variant,
      dataTestId,
    });
  }, [show, dataTestId, variant]);
  return null;
}

describe('ToastRenderer Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations when a toast is shown', async () => {
      vi.useFakeTimers();

      const { checkA11y } = await renderAndCheckA11y(<ToastTrigger />);

      await act(async () => {
        vi.advanceTimersByTime(0);
      });
      vi.useRealTimers();

      await checkA11y();
    });

    it('has no violations when error variant toast is shown', async () => {
      vi.useFakeTimers();

      const { checkA11y } = await renderAndCheckA11y(
        <ToastTrigger dataTestId="toast-a11y-error" variant="error" />
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });
      vi.useRealTimers();

      await checkA11y();
    });
  });

  describe('interactive states', () => {
    it('has no violations when close button is focused', async () => {
      vi.useFakeTimers();

      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <ToastTrigger dataTestId="toast-a11y-close" />
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });
      vi.useRealTimers();

      const closeButton = renderResult.getByRole('button', { name: 'Dismiss notification' });
      closeButton.focus();
      expect(closeButton).toHaveFocus();

      await checkA11y();
    });

    it('has no violations when close button is clicked', async () => {
      vi.useFakeTimers();

      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <ToastTrigger dataTestId="toast-a11y-click" />
      );

      await act(async () => {
        vi.advanceTimersByTime(0);
      });
      vi.useRealTimers();

      const closeButton = renderResult.getByRole('button', { name: 'Dismiss notification' });
      fireEvent.click(closeButton);

      await checkA11y();
    });
  });
});
