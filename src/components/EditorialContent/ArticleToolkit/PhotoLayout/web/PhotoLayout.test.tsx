import { renderWithProvider } from '@/test-utils/render';
import { PhotoLayout } from './PhotoLayout';

describe('PhotoLayout', () => {
  const images = [
    { src: 'https://example.com/image1.jpg', altText: 'Image 1' },
    { src: 'https://example.com/image2.jpg', altText: 'Image 2' },
    { src: 'https://example.com/image3.jpg', altText: 'Image 3' },
    { src: 'https://example.com/image4.jpg', altText: 'Image 4' },
  ];
  it('renders the default number of images for 2up layout', () => {
    const { getAllByRole } = renderWithProvider(<PhotoLayout imageList={images} />);

    const imageElements = getAllByRole('img');
    expect(imageElements).toHaveLength(2);
  });

  it('renders caption and image credit correctly', () => {
    const caption = 'This is a caption';
    const imageCredit = 'Image credit text';

    const { getByTestId } = renderWithProvider(
      <PhotoLayout imageList={images} caption={caption} imageCredit={imageCredit} />
    );
    const element = getByTestId('photo-layout-caption');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(`${caption} (${imageCredit})`);
  });

  it('renders caption without image credit when image credit is not provided', () => {
    const caption = 'This is a caption';

    const { getByTestId } = renderWithProvider(
      <PhotoLayout imageList={images} caption={caption} />
    );
    const element = getByTestId('photo-layout-caption');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(caption);
  });

  it('does not render caption when caption and image credit are empty', () => {
    const { queryByText } = renderWithProvider(
      <PhotoLayout imageList={images} caption="" imageCredit="" />
    );

    expect(queryByText('This is a caption')).not.toBeInTheDocument();
    expect(queryByText('Image credit text')).not.toBeInTheDocument();
  });

  it('renders the correct number of images for 2up layout', () => {
    const { getAllByRole } = renderWithProvider(
      <PhotoLayout imageList={images} photoLayout="2up" />
    );

    const imageElements = getAllByRole('img');
    expect(imageElements).toHaveLength(2);
  });

  it('renders the correct number of images for 3up layout', () => {
    const { getAllByRole } = renderWithProvider(
      <PhotoLayout imageList={images} photoLayout="3up" />
    );

    const imageElements = getAllByRole('img');
    expect(imageElements).toHaveLength(3);
  });

  it('renders the correct number of images for 4up layout', () => {
    const { getAllByRole } = renderWithProvider(
      <PhotoLayout imageList={images} photoLayout="4up" />
    );

    const imageElements = getAllByRole('img');
    expect(imageElements).toHaveLength(4);
  });

  it('renders with the correct className', () => {
    const className = 'custom-class';
    const { getByTestId } = renderWithProvider(
      <PhotoLayout imageList={images} className={className} />
    );

    const element = getByTestId('photo-layout');
    expect(element).toHaveClass(className);
  });

  it('renders with imgix parameters applied to image URLs', () => {
    const imgixParams = 'w=800&h=600&fit=crop&auto=format,compress&q=75';
    const { getAllByRole } = renderWithProvider(
      <PhotoLayout imageList={images} imgixParams={imgixParams} />
    );

    const imageElements = getAllByRole('img');
    expect(imageElements[0]).toHaveAttribute('src', `${images[0].src}?${imgixParams}`);
    expect(imageElements[1]).toHaveAttribute('src', `${images[1].src}?${imgixParams}`);
  });
});
