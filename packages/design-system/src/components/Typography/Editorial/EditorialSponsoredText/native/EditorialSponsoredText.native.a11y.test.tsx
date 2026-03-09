import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { EditorialSponsoredText } from './EditorialSponsoredText.native';

describe('EditorialSponsoredText Accessibility (native)', () => {
  it('sets accessibilityRole to "text" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <EditorialSponsoredText size="medium">Editorial sponsored text</EditorialSponsoredText>,
      {
        wrapper,
      }
    );

    expect(screen.getByRole('text')).toBeOnTheScreen();
  });
});
