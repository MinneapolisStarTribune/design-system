import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { UtilityLabel } from './UtilityLabel.native';

describe('UtilityLabel (native)', () => {
  it('renders with required props', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(<UtilityLabel size="medium">Label</UtilityLabel>, { wrapper });

    expect(screen.getByText('Label')).toBeOnTheScreen();
  });

  it('uses regular token styles', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <UtilityLabel size="small" weight="regular">
        Label
      </UtilityLabel>,
      { wrapper }
    );

    const flattenedStyle = StyleSheet.flatten(screen.getByText('Label').props.style);
    expect(flattenedStyle).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyUtilityLabelSmall
      )
    );
  });

  it('uses semibold caps token styles', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <UtilityLabel size="medium" weight="semibold" capitalize>
        Label
      </UtilityLabel>,
      { wrapper }
    );

    const flattenedStyle = StyleSheet.flatten(screen.getByText('Label').props.style);
    expect(flattenedStyle).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyUtilityLabelSemiboldMediumCaps
      )
    );
  });

  it('preserves caps token styles when a custom style is supplied', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <UtilityLabel size="medium" weight="semibold" capitalize style={{ color: 'red' }}>
        Label
      </UtilityLabel>,
      { wrapper }
    );

    const flattenedStyle = StyleSheet.flatten(screen.getByText('Label').props.style);

    expect(flattenedStyle).toEqual(
      expect.objectContaining({
        ...nativeTokenFixtures.startribune.light.typography
          .typographyUtilityLabelSemiboldMediumCaps,
        color: 'red',
      })
    );
  });

  it('composes caller styles after token styles so callers can override them', () => {
    const wrapper = TestWrapperInDesignSystemProvider({ brand: 'startribune' });
    render(
      <UtilityLabel
        size="medium"
        capitalize
        style={[{ color: 'red' }, { color: 'blue', textTransform: 'none' }]}
      >
        Label
      </UtilityLabel>,
      { wrapper }
    );

    const flattenedStyle = StyleSheet.flatten(screen.getByText('Label').props.style);

    expect(flattenedStyle).toEqual(
      expect.objectContaining({
        ...nativeTokenFixtures.startribune.light.typography.typographyUtilityLabelMediumCaps,
        color: 'blue',
        textTransform: 'none',
      })
    );
  });
});
