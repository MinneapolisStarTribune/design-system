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
  });

  it('handles press', () => {
    const onPress = jest.fn();

    const { getByTestId } = render(<Image src="https://example.com" alt="img" onPress={onPress} />);

    fireEvent.press(getByTestId('image'));

    expect(onPress).toHaveBeenCalled();
  });
});
