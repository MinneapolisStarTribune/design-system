import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { NewsHeading } from './NewsHeading.native';

describe('NewsHeading Accessibility (native)', () => {
  it('sets accessibilityRole to "header" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<NewsHeading importance={1}>News Heading</NewsHeading>, { wrapper });

    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
