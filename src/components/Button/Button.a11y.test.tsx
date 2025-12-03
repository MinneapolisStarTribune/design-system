import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Button } from './Button';

describe('Button Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations with all variants', async () => {
      await expectNoA11yViolations(
        <Button label="Text Button" onClick={() => {}} variant="text" />
      );

      await expectNoA11yViolations(
        <Button label="Primary Button" onClick={() => {}} variant="filled" />
      );
    });

    it('has no violations when disabled', async () => {
      await expectNoA11yViolations(
        <Button label="Disabled Button" onClick={() => {}} isDisabled />
      );
    });

    it('has no violations with an icon', async () => {
      await expectNoA11yViolations(
        <Button label="Button with Icon" onClick={() => {}} icon="camera-filled" />
      );
    });
  });

  describe('interactive states', () => {
    it('has no violations when focused', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <Button label="Focusable Button" onClick={() => {}} />
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
        <Button label="Clickable Button" onClick={handleClick} />
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
