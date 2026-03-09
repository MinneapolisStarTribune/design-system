import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { EditorialText } from './EditorialText.native';

describe('EditorialText Accessibility (native)', () => {
  it('sets accessibilityRole to "text" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider();
    render(<EditorialText size="medium">Editorial text</EditorialText>, { wrapper });

    expect(screen.getByRole('text')).toBeOnTheScreen();
  });
});
