import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { EnterpriseHeading } from './EnterpriseHeading.native';

describe('EnterpriseHeading Accessibility (native)', () => {
  it('sets accessibilityRole to "header" by default', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<EnterpriseHeading importance={1}>Enterprise Heading</EnterpriseHeading>, { wrapper });

    expect(screen.getByRole('header')).toBeOnTheScreen();
  });
});
