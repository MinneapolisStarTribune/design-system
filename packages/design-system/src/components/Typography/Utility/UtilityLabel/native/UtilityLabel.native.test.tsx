import { render, screen } from '@testing-library/react-native';
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

    const element = screen.getByText('Label');
    expect(element.props.style).toEqual(
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

    const element = screen.getByText('Label');
    expect(element.props.style).toEqual(
      expect.objectContaining(
        nativeTokenFixtures.startribune.light.typography.typographyUtilityLabelSemiboldMediumCaps
      )
    );
  });
});
