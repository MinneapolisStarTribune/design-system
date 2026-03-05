import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { FormControl } from '../FormControl';
import { FormGroup } from '@/components/FormGroup/FormGroup';

describe('TextInput Accessibility', () => {
  describe('standalone', () => {
    it('has no violations when used with aria-label', async () => {
      await expectNoA11yViolations(
        <FormControl.TextInput placeholderText="Enter text" aria-label="Username" />
      );
    });

    it('has no violations when disabled', async () => {
      await expectNoA11yViolations(
        <FormControl.TextInput placeholderText="Disabled" isDisabled aria-label="Disabled input" />
      );
    });

    it('has no violations with decorative icon', async () => {
      await expectNoA11yViolations(
        <FormControl.TextInput
          placeholderText="Search"
          icon="search"
          iconPosition="start"
          aria-label="Search"
        />
      );
    });

    it('has no violations in error state (aria-invalid)', async () => {
      await expectNoA11yViolations(
        <FormControl.TextInput placeholderText="Email" isError aria-label="Email with error" />
      );
    });

    it('has no violations in success state', async () => {
      await expectNoA11yViolations(
        <FormControl.TextInput placeholderText="Email" isSuccess aria-label="Email validated" />
      );
    });
  });

  describe('within FormGroup', () => {
    it('has no violations with label, description, and caption', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Email</FormGroup.Label>
          <FormGroup.Description>We&apos;ll never share your email</FormGroup.Description>
          <FormControl.TextInput placeholderText="you@example.com" />
          <FormGroup.Caption variant="info">Enter a valid email address</FormGroup.Caption>
        </FormGroup>
      );
    });

    it('has no violations with error caption (error border on input)', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Password</FormGroup.Label>
          <FormControl.TextInput type="password" placeholderText="Enter password" />
          <FormGroup.Caption variant="error">Password is required</FormGroup.Caption>
        </FormGroup>
      );
    });

    it('has no violations with success caption', async () => {
      await expectNoA11yViolations(
        <FormGroup>
          <FormGroup.Label>Email</FormGroup.Label>
          <FormControl.TextInput placeholderText="you@example.com" />
          <FormGroup.Caption variant="success">Email is valid</FormGroup.Caption>
        </FormGroup>
      );
    });
  });

  describe('interactive', () => {
    it('has no violations when focused', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <FormControl.TextInput
          placeholderText="Focus me"
          aria-label="Focusable input"
          dataTestId="text-input"
        />
      );

      const input = renderResult.getByTestId('text-input');
      await userEvent.tab();
      expect(input).toHaveFocus();

      await checkA11y();
    });
  });
});
