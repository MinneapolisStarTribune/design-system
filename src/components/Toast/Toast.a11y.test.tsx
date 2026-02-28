import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Toast } from './Toast';

describe('Toast Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with default (info, title and description)', async () => {
      await expectNoA11yViolations(
        <Toast
          title="Update saved"
          description="Your changes have been saved."
          variant="info"
          onClose={() => {}}
        />
      );
    });

    it('has no violations with title only', async () => {
      await expectNoA11yViolations(<Toast title="Title only" variant="info" onClose={() => {}} />);
    });

    it('has no violations without icon', async () => {
      await expectNoA11yViolations(
        <Toast
          title="No icon"
          description="Toast with showIcon set to false."
          showIcon={false}
          variant="info"
          onClose={() => {}}
        />
      );
    });

    it('has no violations with all variants', async () => {
      await expectNoA11yViolations(<Toast title="Info" variant="info" onClose={() => {}} />);
      await expectNoA11yViolations(<Toast title="Success" variant="success" onClose={() => {}} />);
      await expectNoA11yViolations(<Toast title="Warning" variant="warning" onClose={() => {}} />);
      await expectNoA11yViolations(<Toast title="Error" variant="error" onClose={() => {}} />);
    });

    it('has no violations with dataTestId', async () => {
      await expectNoA11yViolations(
        <Toast title="Test toast" onClose={() => {}} dataTestId="toast-a11y-test" />
      );
    });
  });

  describe('interactive states', () => {
    it('has no violations when close button is focused', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <Toast title="Focus test" onClose={() => {}} dataTestId="toast-close" />
      );

      const closeButton = renderResult.getByRole('button', {
        name: 'Dismiss notification',
      });
      closeButton.focus();
      expect(closeButton).toHaveFocus();

      await checkA11y();
    });

    it('has no violations when close button is clicked', async () => {
      const handleClose = vi.fn();
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <Toast title="Click test" onClose={handleClose} dataTestId="toast-close" />
      );

      const closeButton = renderResult.getByRole('button', {
        name: 'Dismiss notification',
      });
      await userEvent.click(closeButton);

      await checkA11y();
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
