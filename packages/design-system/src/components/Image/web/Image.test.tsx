import { vi } from 'vitest';
import { renderWithProvider } from '@/test-utils/render';
import { Image } from './Image';

describe('Image', () => {
  it('renders with the correct source and alt text', () => {
    const src = 'https://example.com/image.jpg';
    const alt = 'Example image';

    const { getByTestId } = renderWithProvider(<Image src={src} alt={alt} />);

    const element = getByTestId('image');
    expect(element).toHaveAttribute('src', src);
    expect(element).toHaveAttribute('alt', alt);
  });

  it('applies imgix parameters to the source URL', () => {
    const src = 'https://example.com/image.jpg';
    const alt = 'Example image';
    const imgixParams = 'w=800&h=500&fit=crop&auto=format,compress&q=75';

    const { getByTestId } = renderWithProvider(
      <Image src={src} alt={alt} imgixParams={imgixParams} />
    );

    const element = getByTestId('image');
    expect(element).toHaveAttribute('src', `${src}?${imgixParams}`);
  });

  it('passes through additional props to the img element', () => {
    const src = 'https://example.com/image.jpg';
    const alt = 'Example image';
    const imgixParams = 'w=800&h=500&fit=crop&auto=format,compress&q=75';
    const height = '500';
    const width = '800';
    const loading = 'lazy';

    const { getByTestId } = renderWithProvider(
      <Image
        src={src}
        alt={alt}
        imgixParams={imgixParams}
        height={height}
        width={width}
        loading={loading}
      />
    );

    const element = getByTestId('image');
    expect(element).toHaveAttribute('height', height);
    expect(element).toHaveAttribute('width', width);
    expect(element).toHaveAttribute('loading', loading);
  });

  it('calls onClick when image is clicked', () => {
    const onClick = vi.fn();
    const { getByTestId } = renderWithProvider(
      <Image src="https://example.com/image.jpg" alt="Example" onClick={onClick} />
    );

    getByTestId('image').click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
