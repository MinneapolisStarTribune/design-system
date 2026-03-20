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

  describe('analytics', () => {
    it('emits image_click when onClick is provided and image is clicked', () => {
      const mockOnTrackingEvent = vi.fn();
      const onClick = vi.fn();
      const { getByTestId } = renderWithProvider(
        <Image src="https://example.com/image.jpg" alt="Example" onClick={onClick} />,
        { mockOnTrackingEvent }
      );

      getByTestId('image').click();

      expect(mockOnTrackingEvent).toHaveBeenCalledTimes(1);
      expect(mockOnTrackingEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'image_click',
          component: 'Image',
          alt: 'Example',
        })
      );
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('merges analytics prop into tracking event', () => {
      const mockOnTrackingEvent = vi.fn();
      const { getByTestId } = renderWithProvider(
        <Image
          src="https://example.com/image.jpg"
          alt="Hero"
          onClick={() => {}}
          analytics={{ module_name: 'hero', position: 1 }}
        />,
        { mockOnTrackingEvent }
      );

      getByTestId('image').click();

      expect(mockOnTrackingEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'image_click',
          component: 'Image',
          module_name: 'hero',
          position: 1,
        })
      );
    });
  });
});
