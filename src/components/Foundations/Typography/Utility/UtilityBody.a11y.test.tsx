import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { UtilityBody } from './UtilityBody';

describe('UtilityBody Accessibility', () => {
  describe('static rendering', () => {
    it('has no accessibility violations with default props', async () => {
      await expectNoA11yViolations(<UtilityBody>Default utility body text</UtilityBody>);
    });

    it('applies the correct class for size and weight', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <UtilityBody size="large" weight="bold" data-testid="utility-body">
          Large bold text
        </UtilityBody>
      );

      const el = renderResult.getByTestId('utility-body');
      expect(el).toHaveClass('typography-utility-text-bold-large');

      await checkA11y();
    });

    it('has no accessibility violations with different elements', async () => {
      await expectNoA11yViolations(<UtilityBody as="span">Span text</UtilityBody>);

      await expectNoA11yViolations(<UtilityBody as="div">Div text</UtilityBody>);
    });
  });
});
