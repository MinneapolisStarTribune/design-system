import { render, screen } from '@testing-library/react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { UtilityBody } from './UtilityBody.native';
import { UTILITY_BODY_SIZES, UTILITY_BODY_WEIGHTS } from '../UtilityBody.types';
import { StyleSheet } from 'react-native';

describe('UtilityBody (native)', () => {
  it('renders with defaults', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<UtilityBody>Utility body</UtilityBody>, { wrapper });
    expect(screen.getByText('Utility body')).toBeOnTheScreen();
  });

  it.each(UTILITY_BODY_SIZES)('renders size %s', (size) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<UtilityBody size={size}>Utility body</UtilityBody>, { wrapper });
    expect(screen.getByText('Utility body')).toBeOnTheScreen();
  });

  it.each(UTILITY_BODY_WEIGHTS)('renders weight %s', (weight) => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<UtilityBody weight={weight}>Utility body</UtilityBody>, { wrapper });
    expect(screen.getByText('Utility body')).toBeOnTheScreen();
  });

  it('uses utility body token styles', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <UtilityBody size="medium" weight="regular">
        Utility body
      </UtilityBody>,
      { wrapper }
    );

    const element = screen.getByText('Utility body');
    const flattenedStyle = StyleSheet.flatten(element.props.style);

    expect(flattenedStyle).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyUtilityTextRegularMedium
      )
    );
  });

  it('applies additional styles via style prop', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <UtilityBody style={{ color: 'red' }} size="medium" weight="regular">
        Utility body
      </UtilityBody>,
      { wrapper }
    );

    const element = screen.getByText('Utility body');
    const flattenedStyle = StyleSheet.flatten(element.props.style);

    expect(flattenedStyle).toEqual(
      expect.objectContaining({
        ...nativeTokenFixtures.startribune.light.typography.typographyUtilityTextRegularMedium,
        color: 'red',
      })
    );
  });
});
