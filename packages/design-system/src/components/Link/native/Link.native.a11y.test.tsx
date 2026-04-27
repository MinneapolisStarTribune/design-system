import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Link } from './Link.native';

describe('Link Accessibility (native)', () => {
  const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

  it('renders utility link with link role and accessible label', () => {
    render(
      <Link size="medium" aria-label="Utility news link" dataTestId="link-a11y-utility">
        Read more
      </Link>,
      { wrapper }
    );

    const link = screen.getByRole('link', { name: 'Utility news link' });
    expect(link).toBeOnTheScreen();
    expect(screen.getByTestId('link-a11y-utility')).toBeOnTheScreen();
  });

  it('marks utility link as disabled in accessibility state', () => {
    render(
      <Link
        size="medium"
        disabled
        aria-label="Disabled utility link"
        dataTestId="link-a11y-disabled"
      >
        Read later
      </Link>,
      { wrapper }
    );

    const link = screen.getByTestId('link-a11y-disabled');
    expect(link.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
  });

  it('renders inline link with role, label, and token underline style', () => {
    render(
      <Link
        variant="inline"
        brand="startribune"
        aria-label="Inline terms link"
        dataTestId="link-a11y-inline"
      >
        terms
      </Link>,
      { wrapper }
    );

    const link = screen.getByRole('link', { name: 'Inline terms link' });
    expect(link).toBeOnTheScreen();
    expect(screen.getByTestId('link-a11y-inline')).toBeOnTheScreen();
    expect(link).toHaveStyle({ textDecorationLine: 'underline' });
  });

  it('marks inline link disabled and removes underline decoration', () => {
    render(
      <Link
        variant="inline"
        brand="startribune"
        disabled
        aria-label="Disabled inline link"
        dataTestId="link-a11y-inline-disabled"
      >
        archived
      </Link>,
      { wrapper }
    );

    const link = screen.getByTestId('link-a11y-inline-disabled');
    expect(link.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    expect(link).toHaveStyle({ textDecorationLine: 'none' });
  });
});
