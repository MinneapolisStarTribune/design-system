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

  it('has no accessibility violations when quote is not provided', async () => {
    await expectNoA11yViolations(<PullQuote {...defaultProps} quote="" />);
  });

  it('has no accessibility violations when attribution is not provided', async () => {
    await expectNoA11yViolations(<PullQuote {...defaultProps} attribution={undefined} />);
  });

  it('has no accessibility violations when variant is standard', async () => {
    await expectNoA11yViolations(<PullQuote {...defaultProps} variant="standard" />);
  });
});
