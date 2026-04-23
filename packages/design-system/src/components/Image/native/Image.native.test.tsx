import { render, fireEvent } from '@testing-library/react-native';
import { Image } from './Image.native';

describe('Image', () => {
  it('renders correctly', () => {
    const src = 'https://example.com/image.jpg';
    const alt = 'Example';

    const { getByTestId } = render(<Image src={src} alt={alt} />);

    const element = getByTestId('image');

    expect(element.props.source.uri).toBe(src);
    expect(element.props.accessibilityLabel).toBe(alt);
    expect(element.props.accessibilityRole).toBe('image');
  });

  it('handles press via pressable wrapper', () => {
    const onPress = jest.fn();

    const { getByTestId } = render(<Image src="https://example.com" alt="img" onPress={onPress} />);

    fireEvent.press(getByTestId('image-pressable'));

    expect(onPress).toHaveBeenCalled();
  });

  it('sets accessibilityRole to button when clickable', () => {
    const { getByTestId } = render(
      <Image src="https://example.com" alt="img" onPress={() => {}} />
    );

    const image = getByTestId('image');
    const pressable = getByTestId('image-pressable');

    expect(image.props.accessibilityRole).toBe('button');
    expect(pressable.props.accessibilityRole).toBe('button');
  });

  it('handles imgixParams correctly when no existing query', () => {
    const { getByTestId } = render(
      <Image src="https://example.com/image.jpg" imgixParams="w=400&h=300" alt="img" />
    );

    const element = getByTestId('image');

    expect(element.props.source.uri).toBe('https://example.com/image.jpg?w=400&h=300');
  });

  it('handles imgixParams correctly when src already has query params', () => {
    const { getByTestId } = render(
      <Image src="https://example.com/image.jpg?fit=crop" imgixParams="w=400" alt="img" />
    );

    const element = getByTestId('image');

    expect(element.props.source.uri).toBe('https://example.com/image.jpg?fit=crop&w=400');
  });

  it('handles imgixParams with leading ?', () => {
    const { getByTestId } = render(
      <Image src="https://example.com/image.jpg" imgixParams="?w=400" alt="img" />
    );

    const element = getByTestId('image');

    expect(element.props.source.uri).toBe('https://example.com/image.jpg?w=400');
  });

  it('falls back accessibilityLabel correctly when alt is missing', () => {
    const { getByTestId } = render(<Image src="https://example.com/image.jpg" />);

    const element = getByTestId('image');

    expect(element.props.accessibilityLabel).toBeUndefined();
  });

  it('prioritizes accessibilityLabel over alt', () => {
    const { getByTestId } = render(
      <Image src="https://example.com/image.jpg" alt="alt text" accessibilityLabel="custom label" />
    );

    const element = getByTestId('image');

    expect(element.props.accessibilityLabel).toBe('custom label');
  });
});
