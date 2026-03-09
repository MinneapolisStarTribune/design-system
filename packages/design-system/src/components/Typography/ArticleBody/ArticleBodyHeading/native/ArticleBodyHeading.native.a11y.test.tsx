import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ArticleBodyHeading } from './ArticleBodyHeading.native';

const wrapper = TestWrapperInDesignSystemProvider();

describe('ArticleBodyHeading Accessibility (native)', () => {
  it('sets accessibilityRole to "header" by default', () => {
    render(<ArticleBodyHeading importance={1}>Article Body Heading</ArticleBodyHeading>, {
      wrapper,
    });
    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
