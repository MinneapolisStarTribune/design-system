import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { PageHeading } from './PageHeading.native';

describe('PageHeading Accessibility (native)', () => {
  it('sets accessibilityRole to "header" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<PageHeading importance={1}>Page Heading</PageHeading>, { wrapper });

    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
