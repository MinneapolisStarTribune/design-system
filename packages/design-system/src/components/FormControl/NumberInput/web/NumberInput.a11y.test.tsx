import { expectNoA11yViolations } from '@/test-utils/a11y';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

describe('NumberInput Accessibility', () => {
  it('has no violations as a standalone field with aria-label', async () => {
    await expectNoA11yViolations(<FormControl.NumberInput aria-label="Build number" />);
  });

  it('has no violations inside FormGroup with supporting text', async () => {
    await expectNoA11yViolations(
      <FormGroup>
        <FormGroup.Label>Build Number</FormGroup.Label>
        <FormGroup.Description>Enter the release build number.</FormGroup.Description>
        <FormControl.NumberInput />
        <FormGroup.Caption variant="info">Digits only.</FormGroup.Caption>
      </FormGroup>
    );
  });
});
