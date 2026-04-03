import { fireEvent, render, screen } from '@testing-library/react-native';
import { ActivityIndicator, View } from 'react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import {
  BUTTON_COLORS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  ICON_ONLY_BUTTON_SIZES,
} from '../Button.types';
import { Button } from './Button.native';

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

  it.each(ICON_ONLY_BUTTON_SIZES)('renders icon-only at %s size', (size) => {
    render(
      <Button size={size} icon={<MockIcon />} accessibilityLabel="Close" onPress={() => {}} />,
      { wrapper }
    );
    expect(screen.getByLabelText('Close')).toBeOnTheScreen();
    expect(screen.getByTestId('mock-icon', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it.each(BUTTON_COLORS)('renders filled %s color', (color) => {
    render(
      <Button color={color} variant="filled" onPress={() => {}}>
        {color}
      </Button>,
      { wrapper }
    );
    expect(screen.getByText(color)).toBeOnTheScreen();
  });

  it.each(BUTTON_VARIANTS)('renders %s variant (neutral)', (variant) => {
    render(
      <Button variant={variant} onPress={() => {}}>
        {variant}
      </Button>,
      { wrapper }
    );
    expect(screen.getByText(variant)).toBeOnTheScreen();
  });

  it.each(BUTTON_SIZES)('renders %s size', (size) => {
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
});
