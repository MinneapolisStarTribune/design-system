import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { PULL_QUOTE_SIZES } from '../../types';
import { PullQuote } from './PullQuote.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('PullQuote (native)', () => {
  const testId = 'test-pull-quote';

  const defaultProps = {
    quote: 'Test quote',
    attribution: 'John Doe',
    jobTitle: 'Editor',
    dataTestId: testId,
  } as const;

  it('renders the pull quote', () => {
    render(<PullQuote {...defaultProps} />, { wrapper });
    expect(screen.getByTestId(testId)).toBeOnTheScreen();
    expect(screen.getByText('Test quote')).toBeOnTheScreen();
  });

  it('renders nothing when quote is not provided', () => {
    render(<PullQuote {...defaultProps} quote="" />, { wrapper });
    expect(screen.queryByTestId(testId)).not.toBeOnTheScreen();
  });

  it.each(PULL_QUOTE_SIZES)('renders %s size variant', (size) => {
    render(<PullQuote {...defaultProps} size={size} />, { wrapper });
    expect(screen.getByTestId(testId)).toBeOnTheScreen();
  });

  it('renders attribution and job title when provided', () => {
    render(<PullQuote {...defaultProps} />, { wrapper });
    expect(screen.getByTestId(`${testId}-attribution`)).toBeOnTheScreen();
    expect(screen.getByTestId(`${testId}-job-title`)).toBeOnTheScreen();
  });

  it('does not render attribution and job title when omitted', () => {
    render(<PullQuote quote="Test quote" dataTestId={testId} />, { wrapper });
    expect(screen.queryByTestId(`${testId}-attribution`)).not.toBeOnTheScreen();
    expect(screen.queryByTestId(`${testId}-job-title`)).not.toBeOnTheScreen();
  });
});
