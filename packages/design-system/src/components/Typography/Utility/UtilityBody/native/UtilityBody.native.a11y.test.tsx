import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { UtilityBody } from './UtilityBody.native';

describe('UtilityBody Accessibility (native)', () => {
  it('renders text content', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<UtilityBody>Accessible utility body</UtilityBody>, { wrapper });

    expect(screen.getByText('Accessible utility body')).toBeOnTheScreen();
  });
});
