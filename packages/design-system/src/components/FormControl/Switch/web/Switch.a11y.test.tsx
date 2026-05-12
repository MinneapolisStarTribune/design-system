import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';

describe('Switch Accessibility', () => {
  it('has no violations in standalone mode with visible label and caption', async () => {
    await expectNoA11yViolations(
      <FormControl.Switch
        selected={false}
        onChange={() => {}}
        label="Enable alerts"
        caption="Sends push notifications for major stories."
      />
    );
  });

  it('has no violations in standalone mode with aria-label only', async () => {
    await expectNoA11yViolations(
      <FormControl.Switch selected={false} onChange={() => {}} aria-label="Enable autoplay" />
    );
  });

  it('has no violations when used inside FormGroup', async () => {
    await expectNoA11yViolations(
      <FormGroup>
        <FormGroup.Label>Personalized homepage</FormGroup.Label>
        <FormGroup.Description>Show stories based on your reading behavior.</FormGroup.Description>
        <FormControl.Switch selected={true} onChange={() => {}} />
        <FormGroup.Caption variant="info">Changes are immediate.</FormGroup.Caption>
      </FormGroup>
    );
  });

  it('has no violations when toggled', async () => {
    function ToggleSwitch() {
      const [selected, setSelected] = useState(false);
      return <FormControl.Switch selected={selected} onChange={setSelected} label="Toggle me" />;
    }

    const { renderResult, checkA11y } = await renderAndCheckA11y(<ToggleSwitch />);
    const input = renderResult.getByRole('switch');

    await userEvent.click(input);
    expect(input).toBeChecked();

    await checkA11y();
  });
});
