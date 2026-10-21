import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

describe('TextArea Accessibility', () => {
  describe('standalone', () => {
    it('has no violations when used with aria-label', async () => {
      await expectNoA11yViolations(
        <FormControl.TextArea placeholderText="Write a comment" aria-label="Comment" />
      );
    });

    it('has no violations when disabled', async () => {
      await expectNoA11yViolations(
        <FormControl.TextArea placeholderText="Disabled" isDisabled aria-label="Disabled" />
      );
    });

    it('has no violations in error state (aria-invalid)', async () => {
      await expectNoA11yViolations(
        <FormControl.TextArea placeholderText="Comment" isError aria-label="Comment with error" />
      );
    });
  });

  describe('within FormGroup', () => {
    it('has no violations with label, description, and caption', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label optional>Comment</FormGroup.Label>
          <FormGroup.Description>Keep it civil</FormGroup.Description>
          <FormControl.TextArea placeholderText="Write a comment" maxLength={200} />
          <FormGroup.Caption variant="info">0/200 characters</FormGroup.Caption>
        </FormGroup>
      );
    });

    it('has no violations with error caption', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Comment</FormGroup.Label>
          <FormControl.TextArea placeholderText="Write a comment" />
          <FormGroup.Caption variant="error">Comment is required</FormGroup.Caption>
        </FormGroup>
      );
    });
  });

  describe('interactive', () => {
    it('has no violations when focused', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <FormControl.TextArea placeholderText="Focus me" aria-label="Comment" dataTestId="ta" />
      );

      const textarea = renderResult.getByTestId('ta');
      await userEvent.tab();
      expect(textarea).toHaveFocus();

      await checkA11y();
    });
  });
});
