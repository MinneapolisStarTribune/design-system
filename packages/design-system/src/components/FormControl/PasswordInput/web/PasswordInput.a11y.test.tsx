import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

describe('PasswordInput Accessibility', () => {
  it('has no violations as a standalone field with aria-label', async () => {
    await expectNoA11yViolations(
      <FormControl.PasswordInput aria-label="Password" autoComplete="current-password" />
    );
  });

  it('has no violations inside FormGroup with supporting text', async () => {
    await expectNoA11yViolations(
      <FormGroup>
        <FormGroup.Label>Password</FormGroup.Label>
        <FormGroup.Description>Use at least 8 characters.</FormGroup.Description>
        <FormControl.PasswordInput autoComplete="new-password" />
        <FormGroup.Caption variant="info">Password strength is good.</FormGroup.Caption>
      </FormGroup>
    );
  });

  it('has no violations in error state with validation icon', async () => {
    await expectNoA11yViolations(
      <FormControl.PasswordInput
        aria-label="Password"
        autoComplete="current-password"
        isError
        defaultValue="password123!"
      />
    );
  });

  it('has no violations in success state with validation icon', async () => {
    await expectNoA11yViolations(
      <FormControl.PasswordInput
        aria-label="Password"
        autoComplete="current-password"
        isSuccess
        defaultValue="password123!"
      />
    );
  });

  it('has no violations when visibility is toggled', async () => {
    const user = userEvent.setup();
    const { renderResult, checkA11y } = await renderAndCheckA11y(
      <FormControl.PasswordInput
        aria-label="Password"
        autoComplete="current-password"
        defaultPasswordVisible
      />
    );

    await user.click(renderResult.getByRole('button', { name: 'Hide password' }));
    await checkA11y();
  });
});
