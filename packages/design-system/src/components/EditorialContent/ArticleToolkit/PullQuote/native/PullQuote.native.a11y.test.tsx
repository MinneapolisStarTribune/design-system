import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { PullQuote } from './PullQuote.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('PullQuote Accessibility (native)', () => {
  const defaultProps = {
    quote: 'This is a pull quote',
    attribution: 'John Doe',
    jobTitle: 'Author',
    dataTestId: 'pull-quote-a11y',
  } as const;

  it('exposes quote and attribution text for assistive tech', () => {
    render(<PullQuote {...defaultProps} />, { wrapper });

    expect(screen.getByText('This is a pull quote')).toBeOnTheScreen();
    expect(screen.getByText('John Doe')).toBeOnTheScreen();
    expect(screen.getByText('Author')).toBeOnTheScreen();
  });

  it('maps aria-label to accessibilityLabel on the root', () => {
    render(<PullQuote {...defaultProps} aria-label="Highlighted testimony from the trial" />, {
      wrapper,
    });

    const root = screen.getByTestId('pull-quote-a11y');
    expect(root.props.accessibilityLabel).toBe('Highlighted testimony from the trial');
  });

  it('maps aria-hidden to hide the subtree from the accessibility tree', () => {
    render(<PullQuote {...defaultProps} aria-hidden />, { wrapper });

    const root = screen.getByTestId('pull-quote-a11y', { includeHiddenElements: true });
    expect(root.props.accessibilityElementsHidden).toBe(true);
    expect(root.props.importantForAccessibility).toBe('no-hide-descendants');
  });

  it('uses auto importantForAccessibility when not aria-hidden', () => {
    render(<PullQuote {...defaultProps} />, { wrapper });

    const root = screen.getByTestId('pull-quote-a11y');
    expect(root.props.importantForAccessibility).toBe('auto');
  });

  it('renders nothing when quote is empty so no stale accessible nodes remain', () => {
    render(<PullQuote {...defaultProps} quote="" />, { wrapper });

    expect(screen.queryByTestId('pull-quote-a11y')).not.toBeOnTheScreen();
  });

  it('still exposes quote text when attribution and job title are omitted', () => {
    render(<PullQuote quote="Standalone quote" dataTestId="pull-quote-solo" />, { wrapper });

    expect(screen.getByText('Standalone quote')).toBeOnTheScreen();
    expect(screen.queryByTestId('pull-quote-solo-attribution')).not.toBeOnTheScreen();
  });

  it('renders for immersive variant without changing root accessibility defaults', () => {
    render(<PullQuote {...defaultProps} variant="immersive" />, { wrapper });

    const root = screen.getByTestId('pull-quote-a11y');
    expect(root.props.importantForAccessibility).toBe('auto');
    expect(screen.getByText('This is a pull quote')).toBeOnTheScreen();
  });
});
