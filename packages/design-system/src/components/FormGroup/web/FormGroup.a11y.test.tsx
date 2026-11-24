import { screen } from '@testing-library/react';
import { renderAndCheckA11y } from '@/test-utils/a11y';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from './FormGroup';

describe('FormGroup Accessibility', () => {
  it('has no violations with empty slots', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <FormGroup>
        <FormControl.TextInput aria-label="Plain" />
      </FormGroup>
    );
    await checkA11y();
  });

  it('keeps the control name and description when another library sets aria-hidden on label and caption slots', async () => {
    const { renderResult, checkA11y } = await renderAndCheckA11y(
      <FormGroup>
        <FormGroup.Label>Display name</FormGroup.Label>
        <FormControl.TextInput placeholderText="Enter display name" />
        <FormGroup.Caption variant="info">Pick one</FormGroup.Caption>
      </FormGroup>
    );
    renderResult.container
      .querySelectorAll('.form-group__above, .form-group__caption')
      .forEach((el) => el.setAttribute('aria-hidden', 'true'));

    await checkA11y();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleName('Display name');
    expect(input).toHaveAccessibleDescription('Pick one');
  });
});
