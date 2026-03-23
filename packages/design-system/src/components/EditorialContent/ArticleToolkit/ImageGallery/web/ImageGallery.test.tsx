import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderWithProvider } from '@/test-utils/render';
import { ImageGallery } from './ImageGallery';
import { ImageProps } from '@/components/Image/web/Image';
import { fireEvent } from '@testing-library/react';

const images = [
  {
    src: 'https://picsum.photos/1080/720?1',
    altText: 'Image 1',
    caption: 'Caption 1',
    credit: '(Photo credit 1)',
    imgixParams: 'w=800&q=75',
  },
  {
    src: 'https://picsum.photos/1080/720?2',
    altText: 'Image 2',
    caption: 'Caption 2',
    credit: '(Photo credit 2)',
  },
];

describe('ImageGallery', () => {
  it('renders gallery', () => {
    const { getByTestId } = renderWithProvider(<ImageGallery images={images} />);
    expect(getByTestId('image-gallery')).toBeInTheDocument();
  });

  it('renders images', () => {
    const { getAllByRole } = renderWithProvider(<ImageGallery images={images} />);
    expect(getAllByRole('img').length).toBeGreaterThan(0);
  });

  it('applies imgix params correctly', () => {
    const { getAllByRole } = renderWithProvider(<ImageGallery images={images} />);
    const imgs = getAllByRole('img');

    expect(imgs[0]).toHaveAttribute('src', expect.stringContaining('w=800'));
  });

  it('shows caption and credit', () => {
    const { getByText } = renderWithProvider(<ImageGallery images={images} />);
    expect(getByText(/Caption 1/i)).toBeInTheDocument();
    expect(getByText(/Photo credit 1/i)).toBeInTheDocument();
  });

  it('renders controls when multiple images', () => {
    const { getAllByRole } = renderWithProvider(<ImageGallery images={images} />);
    expect(getAllByRole('button').length).toBe(2);
  });

  it('disables prev button initially (standard)', () => {
    const { getAllByRole } = renderWithProvider(
      <ImageGallery images={images} variant="standard" />
    );
    expect(getAllByRole('button')[0]).toBeDisabled();
  });

  it('does not disable prev button in immersive', () => {
    const { getAllByRole } = renderWithProvider(
      <ImageGallery images={images} variant="immersive" />
    );
    expect(getAllByRole('button')[0]).not.toBeDisabled();
  });

  it('handles navigation clicks', () => {
    const { getAllByRole } = renderWithProvider(
      <ImageGallery images={images} variant="immersive" />
    );

    const [prev, next] = getAllByRole('button');

    fireEvent.click(prev);
    fireEvent.click(next);

    expect(prev).toBeInTheDocument();
    expect(next).toBeInTheDocument();
  });

  it('renders nothing for empty images', () => {
    const { queryByTestId } = renderWithProvider(<ImageGallery images={[]} />);
    expect(queryByTestId('image-gallery')).not.toBeInTheDocument();
  });

  it('supports custom ImageComponent', () => {
    const CustomImage = ({ src, alt }: ImageProps) => (
      <img data-testid="custom-image" src={src} alt={alt} />
    );

    const { getAllByTestId } = renderWithProvider(
      <ImageGallery images={images} ImageComponent={CustomImage} />
    );

    expect(getAllByTestId('custom-image').length).toBeGreaterThan(0);
  });

  it('updates on resize', () => {
    const { getByTestId } = renderWithProvider(<ImageGallery images={images} />);
    fireEvent(window, new Event('resize'));
    expect(getByTestId('image-gallery')).toBeInTheDocument();
  });

  it('applies custom classNames', () => {
    const { container } = renderWithProvider(
      <ImageGallery
        images={images}
        className="root"
        imageClassName="img"
        wrapperClassName="wrap"
        captionClassName="cap"
        controlsClassName="ctrl"
      />
    );

    expect(container.querySelector('.root')).toBeInTheDocument();
    expect(container.querySelector('.img')).toBeInTheDocument();
    expect(container.querySelector('.wrap')).toBeInTheDocument();
    expect(container.querySelector('.cap')).toBeInTheDocument();
    expect(container.querySelector('.ctrl')).toBeInTheDocument();
  });
});
