import { renderWithProvider } from '@/test-utils/render';
import { PullQuote } from './PullQuote';

describe('PullQuote', () => {
  const testId = 'test-pull-quote';
  const defaultProps = {
    quote: 'Test quote',
    attribution: 'John Doe',
    jobTitle: 'Author',
    dataTestId: testId,
  };

  it('renders the pull quote component', () => {
    const { getByTestId } = renderWithProvider(<PullQuote {...defaultProps} />);
    expect(getByTestId(testId)).toBeInTheDocument();
  });

  it('renders nothing when quote is not provided', () => {
    const { queryByTestId } = renderWithProvider(<PullQuote {...defaultProps} quote="" />);
    expect(queryByTestId(testId)).toBeNull();
  });

  it('renders the quote text', () => {
    const { getByTestId } = renderWithProvider(<PullQuote {...defaultProps} />);
    expect(getByTestId(testId)).toHaveTextContent('Test quote');
  });

  it('renders attribution when provided', () => {
    const { getByTestId } = renderWithProvider(<PullQuote {...defaultProps} />);
    expect(getByTestId(`${testId}-attribution`)).toHaveTextContent('John Doe');
  });
  it('renders job title when provided', () => {
    const { getByTestId } = renderWithProvider(<PullQuote {...defaultProps} />);
    expect(getByTestId(`${testId}-job-title`)).toHaveTextContent('Author');
  });

  it('does not render attribution when not provided', () => {
    const { queryByTestId } = renderWithProvider(
      <PullQuote {...defaultProps} attribution={undefined} />
    );
    expect(queryByTestId(`${testId}-attribution`)).toBeNull();
  });

  it('does not render job title when not provided', () => {
    const { queryByTestId } = renderWithProvider(
      <PullQuote {...defaultProps} jobTitle={undefined} />
    );
    expect(queryByTestId(`${testId}-job-title`)).toBeNull();
  });

  it('applies custom data-testid', () => {
    const { getByTestId } = renderWithProvider(<PullQuote {...defaultProps} />);
    expect(getByTestId(testId)).toBeInTheDocument();
  });
});
