import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Button } from './Button';

describe('Button Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with all variants', async () => {
      await expectNoA11yViolations(
        <Button onClick={() => {}} variant="filled">
          Primary Button
        </Button>
      );

      await expectNoA11yViolations(
        <Button onClick={() => {}} variant="outlined">
          Primary Button
        </Button>
      );

      await expectNoA11yViolations(
        <Button onClick={() => {}} variant="ghost">
          Primary Button
        </Button>
      );
    });

    it('has no violations when disabled', async () => {
      await expectNoA11yViolations(
        <Button onClick={() => {}} isDisabled>
          Disabled Button
        </Button>
      );
    });

    it('has no violations with an icon and text', async () => {
      await expectNoA11yViolations(
        <Button onClick={() => {}} icon="camera-filled">
          Button with Icon
        </Button>
      );
    });

    it('has no violations with an icon', async () => {
      await expectNoA11yViolations(
        <Button onClick={() => {}} icon="camera-filled">
          Button with Icon
        </Button>
      );
    });
  });

  describe('interactive states', () => {
    it('has no violations when focused', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <Button onClick={() => {}} data-testid="button">
          Focusable Button
        </Button>
      );

      // Focus the button
      const button = renderResult.getByTestId('button');
      await userEvent.tab();
      expect(button).toHaveFocus();

      // Check accessibility with focus
      await checkA11y();
    });

    it('has no violations when clicked', async () => {
      const handleClick = vi.fn();
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <Button onClick={handleClick} data-testid="button">
          Clickable Button
        </Button>
      );

      // Click the button
      const button = renderResult.getByTestId('button');
      await userEvent.click(button);

      // Check accessibility after interaction
      await checkA11y();
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
