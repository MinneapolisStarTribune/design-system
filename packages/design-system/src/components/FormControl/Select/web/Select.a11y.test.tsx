import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { FormControl } from '@/components/FormControl/FormControl';

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
];

describe('Select Accessibility', () => {
  describe('standalone', () => {
    it('has no violations with default state', async () => {
      await expectNoA11yViolations(<FormControl.Select id="test" options={OPTIONS} />);
    });

    it('has no violations without placeholder', async () => {
      await expectNoA11yViolations(
        <FormControl.Select id="test" options={OPTIONS} showPlaceholder={false} />
      );
    });
  });

  describe('interactive', () => {
    it('has no violations when opened', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <FormControl.Select id="test" options={OPTIONS} />
      );

      const user = userEvent.setup();

      const trigger = renderResult.getByRole('button');
      await user.click(trigger);

      await checkA11y();
    });

    it('has no violations when selecting option', async () => {
      function Wrapper() {
        const [value, setValue] = useState<string | undefined>();
        return <FormControl.Select id="test" options={OPTIONS} value={value} onChange={setValue} />;
      }

      const { renderResult, checkA11y } = await renderAndCheckA11y(<Wrapper />);

      const user = userEvent.setup();

      await user.click(renderResult.getByRole('button'));
      await user.click(renderResult.getByText('Canada'));

      await checkA11y();
    });
  });
});
