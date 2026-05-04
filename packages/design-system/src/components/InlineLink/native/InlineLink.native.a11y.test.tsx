import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { InlineLink } from './InlineLink.native';

describe('InlineLink Accessibility (native)', () => {
  const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

  it('renders as an accessible link with role and label', () => {
    render(
      <InlineLink brand="startribune" aria-label="Inline policy link" dataTestId="inline-a11y-link">
        policy
      </InlineLink>,
      { wrapper }
    );

    expect(screen.getByRole('link', { name: 'Inline policy link' })).toBeOnTheScreen();
    expect(screen.getByTestId('inline-a11y-link')).toBeOnTheScreen();
  });

  it('marks disabled inline link in accessibility state', () => {
    render(
      <InlineLink
        brand="startribune"
        disabled
        aria-label="Disabled inline policy link"
        dataTestId="inline-a11y-disabled"
      >
        policy
      </InlineLink>,
      { wrapper }
    );

    const link = screen.getByTestId('inline-a11y-disabled');
    expect(link.props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    expect(link).toHaveStyle({ textDecorationLine: 'none' });
  });
});
