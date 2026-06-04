import { jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ActivityIndicator, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { AvatarIcon, ArrowRightIcon } from '@/icons/index.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import {
  BUTTON_COLORS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  ICON_ONLY_BUTTON_SIZES,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
  type IconOnlyButtonSize,
} from '../Button.types';
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
import { Button } from './Button.native';
import { getNativeButtonSurface } from './buttonTheme';

const wrapper = TestWrapperInDesignSystemProvider();

function MockIcon(props: { width?: number; height?: number; color?: string }) {
  return (
    <View
      testID="mock-icon"
      style={{
        width: props.width ?? 16,
        height: props.height ?? 16,
        backgroundColor: props.color ?? '#888',
      }}
    />
  );
}

describe('Button (native)', () => {
  it('renders label text', () => {
    render(<Button onPress={() => {}}>Submit</Button>, { wrapper });
    expect(screen.getByText('Submit')).toBeOnTheScreen();
    expect(screen.getByRole('button')).toBeOnTheScreen();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Go</Button>, { wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(
      <Button onPress={onPress} isDisabled>
        Go
      </Button>,
      { wrapper }
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    render(
      <Button onPress={onPress} isLoading>
        Go
      </Button>,
      { wrapper }
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.queryByText('Go')).not.toBeOnTheScreen();
    expect(screen.getByRole('button').props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
  });

  it('shows ActivityIndicator when loading', () => {
    const { UNSAFE_getByType } = render(
      <Button onPress={() => {}} isLoading>
        Go
      </Button>,
      { wrapper }
    );
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('uses custom accessibilityLabel', () => {
    render(
      <Button onPress={() => {}} accessibilityLabel="Custom action">
        X
      </Button>,
      { wrapper }
    );
    expect(screen.getByLabelText('Custom action')).toBeOnTheScreen();
  });

  it('throws when x-small is used with text children', () => {
    expect(() =>
      render(
        <Button size="x-small" onPress={() => {}}>
          Bad
        </Button>,
        { wrapper }
      )
    ).toThrow(/x-small size is only valid for icon-only/);
  });

  it.each(ICON_ONLY_BUTTON_SIZES)('renders icon-only at %s size', (size: IconOnlyButtonSize) => {
    render(
      <Button size={size} icon={<MockIcon />} accessibilityLabel="Close" onPress={() => {}} />,
      { wrapper }
    );
    expect(screen.getByLabelText('Close')).toBeOnTheScreen();
    expect(screen.getByTestId('mock-icon', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it.each(BUTTON_COLORS)('renders filled %s color', (color: ButtonColor) => {
    render(
      <Button color={color} variant="filled" onPress={() => {}}>
        {color}
      </Button>,
      { wrapper }
    );
    expect(screen.getByText(color)).toBeOnTheScreen();
  });

  it.each(BUTTON_VARIANTS)('renders %s variant (neutral)', (variant: ButtonVariant) => {
    render(
      <Button variant={variant} onPress={() => {}}>
        {variant}
      </Button>,
      { wrapper }
    );
    expect(screen.getByText(variant)).toBeOnTheScreen();
  });

  it.each(BUTTON_SIZES)('renders %s size', (size: ButtonSize) => {
    render(
      <Button size={size} onPress={() => {}}>
        {size}
      </Button>,
      { wrapper }
    );
    expect(screen.getByText(size)).toBeOnTheScreen();
  });

  it('places icon at start when iconPosition is start', () => {
    render(
      <Button icon={<MockIcon />} iconPosition="start" onPress={() => {}}>
        Save
      </Button>,
      { wrapper }
    );
    expect(screen.getByTestId('mock-icon', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('Save')).toBeOnTheScreen();
  });

  it('places icon at end when iconPosition is end', () => {
    render(
      <Button icon={<MockIcon />} iconPosition="end" onPress={() => {}}>
        Next
      </Button>,
      { wrapper }
    );
    expect(screen.getByTestId('mock-icon', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('Next')).toBeOnTheScreen();
  });

  describe('design-system icons (SvgXml)', () => {
    it('renders AvatarIcon for icon-only buttons with scaled dimensions', () => {
      render(
        <Button
          size="medium"
          icon={<AvatarIcon testID="avatar-icon" />}
          accessibilityLabel="Profile"
          onPress={() => {}}
        />,
        { wrapper }
      );

      const icon = screen.getByTestId('avatar-icon', { includeHiddenElements: true });
      expect(icon).toBeOnTheScreen();
      expect(icon.props.width).toBe(24);
      expect(icon.props.height).toBe(24);
    });

    it('renders AvatarIcon at start for text buttons (story: Leading)', () => {
      render(
        <Button icon={<AvatarIcon testID="leading-icon" />} iconPosition="start" onPress={() => {}}>
          Leading
        </Button>,
        { wrapper }
      );

      const icon = screen.getByTestId('leading-icon', { includeHiddenElements: true });
      expect(icon).toBeOnTheScreen();
      expect(icon.props.width).toBe(16);
      expect(icon.props.height).toBe(16);
      expect(screen.getByText('Leading')).toBeOnTheScreen();
    });

    it('renders ArrowRightIcon at end for text buttons (story: Trailing)', () => {
      render(
        <Button
          icon={<ArrowRightIcon testID="trailing-icon" />}
          iconPosition="end"
          onPress={() => {}}
        >
          Trailing
        </Button>,
        { wrapper }
      );

      const icon = screen.getByTestId('trailing-icon', { includeHiddenElements: true });
      expect(icon).toBeOnTheScreen();
      expect(icon.props.width).toBe(16);
      expect(icon.props.height).toBe(16);
      expect(screen.getByText('Trailing')).toBeOnTheScreen();
    });

    it('applies button foreground color into the icon SVG (currentColor replacement)', () => {
      const theme = {
        ...nativeTokenFixtures.startribune.light.theme,
        ...nativeTokenFixtures.startribune.light.typography,
      };
      const { color } = getNativeButtonSurface(theme, 'brand', 'filled', false, 'light');

      render(
        <Button
          color="brand"
          variant="filled"
          icon={<AvatarIcon testID="colored-icon" />}
          onPress={() => {}}
        >
          Brand
        </Button>,
        { wrapper }
      );

      const icon = screen.getByTestId('colored-icon', { includeHiddenElements: true });
      expect(typeof icon.props.xml).toBe('string');
      expect(icon.props.xml).toContain(color);
      expect(icon.props.xml).not.toMatch(/currentcolor/i);
    });

    it('hides icon while loading and shows ActivityIndicator', () => {
      const { UNSAFE_getByType } = render(
        <Button icon={<AvatarIcon testID="loading-icon" />} isLoading onPress={() => {}}>
          Save
        </Button>,
        { wrapper }
      );

      expect(
        screen.queryByTestId('loading-icon', { includeHiddenElements: true })
      ).not.toBeOnTheScreen();
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it.each(ICON_ONLY_BUTTON_SIZES)(
      'renders SvgXml for icon-only %s',
      (size: IconOnlyButtonSize) => {
        const { UNSAFE_getAllByType } = render(
          <Button
            size={size}
            icon={<AvatarIcon testID={`icon-only-${size}`} />}
            accessibilityLabel={`${size} icon`}
            onPress={() => {}}
          />,
          { wrapper }
        );

        expect(
          screen.getByTestId(`icon-only-${size}`, { includeHiddenElements: true })
        ).toBeOnTheScreen();
        expect(UNSAFE_getAllByType(SvgXml).length).toBeGreaterThan(0);
      }
    );
  });

  it('uses white foreground for ghost neutral button on dark surface', () => {
    const theme = {
      ...nativeTokenFixtures.startribune.light.theme,
      ...nativeTokenFixtures.startribune.light.typography,
    };

    expect(getNativeButtonSurface(theme, 'neutral', 'ghost', false, 'dark').color).toBe('#ffffff');

    render(
      <Button
        surface="dark"
        variant="ghost"
        icon={<MockIcon />}
        accessibilityLabel="Previous"
        onPress={() => {}}
      />,
      { wrapper }
    );

    expect(screen.getByLabelText('Previous')).toBeOnTheScreen();
  });
});
