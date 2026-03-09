import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { OpinionHeading } from './OpinionHeading.native';

describe('OpinionHeading Accessibility (native)', () => {
  it('sets accessibilityRole to "header" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<OpinionHeading importance={1}>Opinion Heading</OpinionHeading>, { wrapper });

    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
