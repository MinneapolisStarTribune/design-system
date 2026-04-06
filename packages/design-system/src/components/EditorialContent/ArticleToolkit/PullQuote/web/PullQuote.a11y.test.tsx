import { expectNoA11yViolations } from '@/test-utils/a11y';
import { PullQuote } from './PullQuote';

describe('PullQuote Accessibility', () => {
  const defaultProps = {
    quote: 'This is a pull quote',
    attribution: 'John Doe',
    jobTitle: 'Author',
  };
  it('has no accessibility violations with default props', async () => {
    await expectNoA11yViolations(<PullQuote {...defaultProps} />);
  });

  it('has no accessibility violations when quote is long', async () => {
    await expectNoA11yViolations(<PullQuote {...defaultProps} isLongQuote />);
  });

  it('has no accessibility violations when quote is not provided', async () => {
    await expectNoA11yViolations(<PullQuote {...defaultProps} quote="" />);
  });
});
