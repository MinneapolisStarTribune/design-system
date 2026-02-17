import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading Accessibility', () => {
  it('has no accessibility violations with default rendering', async () => {
    await expectNoA11yViolations(
      <SectionHeading importance={1}>Accessible Heading</SectionHeading>
    );
  });

  it('renders the correct semantic heading level', async () => {
    const { renderResult, checkA11y } = await renderAndCheckA11y(
      <SectionHeading importance={3} data-testid="heading">
        Heading Level 3
      </SectionHeading>
    );

    const el = renderResult.getByTestId('heading');
    expect(el.tagName).toBe('H3');
    expect(el).toHaveClass('typography-utility-section-h3');

    await checkA11y();
  });
});
