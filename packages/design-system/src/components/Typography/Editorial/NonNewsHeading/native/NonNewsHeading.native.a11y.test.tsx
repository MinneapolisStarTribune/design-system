import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { NonNewsHeading } from './NonNewsHeading.native';

describe('NonNewsHeading Accessibility (native)', () => {
  it('sets accessibilityRole to "header" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<NonNewsHeading importance={1}>Non-news Heading</NonNewsHeading>, { wrapper });

    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
