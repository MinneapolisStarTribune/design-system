import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { UtilityLabel } from './UtilityLabel.native';

describe('UtilityLabel Accessibility (native)', () => {
  it('renders text content', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<UtilityLabel size="small">Accessible label</UtilityLabel>, { wrapper });

    expect(screen.getByText('Accessible label')).toBeOnTheScreen();
  });
});
