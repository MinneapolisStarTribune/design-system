import { render } from '@testing-library/react-native';
import { Image } from './Image.native';

describe('Image Accessibility', () => {
  it('applies default accessibility props', () => {
    const { getByTestId } = render(
      <Image src="https://via.placeholder.com/150" alt="Placeholder Image" />
    );

    const element = getByTestId('image');

    expect(element.props.accessible).toBe(true);
    expect(element.props.accessibilityRole).toBe('image');
    expect(element.props.accessibilityLabel).toBe('Placeholder Image');
  });

  it('applies accessibility props with imgix params', () => {
    const { getByTestId } = render(
      <Image
        src="https://via.placeholder.com/150"
        alt="Placeholder Image"
        imgixParams="w=400&h=300&fit=crop"
      />
    );

    const element = getByTestId('image');

    expect(element.props.source.uri).toBe('https://via.placeholder.com/150?w=400&h=300&fit=crop');
    expect(element.props.accessibilityLabel).toBe('Placeholder Image');
  });

  it('uses alt as fallback for accessibilityLabel', () => {
    const { getByTestId } = render(
      <Image src="https://via.placeholder.com/150" alt="Accessible image" />
    );

    const element = getByTestId('image');

    expect(element.props.accessibilityLabel).toBe('Accessible image');
  });

  it('supports custom accessibilityLabel override', () => {
    const { getByTestId } = render(
      <Image
        src="https://via.placeholder.com/150"
        alt="Alt text"
        accessibilityLabel="Custom label"
      />
    );

    const element = getByTestId('image');

    expect(element.props.accessibilityLabel).toBe('Custom label');
  });

  it('is accessible when pressable', () => {
    const { getByTestId } = render(
      <Image src="https://via.placeholder.com/150" alt="Pressable image" onPress={() => {}} />
    );

    const element = getByTestId('image');

    expect(element.props.accessible).toBe(true);
    expect(element.props.accessibilityRole).toBe('image');
  });
});
