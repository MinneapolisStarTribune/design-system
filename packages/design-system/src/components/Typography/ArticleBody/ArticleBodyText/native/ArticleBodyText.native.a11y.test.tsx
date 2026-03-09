import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { ArticleBodyText } from './ArticleBodyText.native';

describe('ArticleBodyText Accessibility (native)', () => {
  it('sets accessibilityRole to "text" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<ArticleBodyText>Article Body Text</ArticleBodyText>, { wrapper });

    expect(screen.getByRole('text')).toBeOnTheScreen();
  });
});
