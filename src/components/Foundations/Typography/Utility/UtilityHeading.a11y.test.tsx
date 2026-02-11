import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { UtilityHeading } from './UtilityHeading';

describe('UtilityHeading Accessibility', () => {
  it('has no accessibility violations with default rendering', async () => {
    await expectNoA11yViolations(
      <UtilityHeading importance={1}>Accessible Heading</UtilityHeading>
    );
  });

  it('renders the correct semantic heading level', async () => {
    const { renderResult, checkA11y } = await renderAndCheckA11y(
      <UtilityHeading importance={3} data-testid="heading">
        Heading Level 3
      </UtilityHeading>
    );

    const el = renderResult.getByTestId('heading');
    expect(el.tagName).toBe('H3');
    expect(el).toHaveClass('typography-utility-section-h3');

    await checkA11y();
  });
});
