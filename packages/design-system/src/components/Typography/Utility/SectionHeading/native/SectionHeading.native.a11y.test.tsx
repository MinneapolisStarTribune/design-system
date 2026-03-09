import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { SectionHeading } from './SectionHeading.native';

describe('SectionHeading Accessibility (native)', () => {
  it('sets accessibilityRole to "header" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<SectionHeading importance={1}>Section Heading</SectionHeading>, { wrapper });

    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
