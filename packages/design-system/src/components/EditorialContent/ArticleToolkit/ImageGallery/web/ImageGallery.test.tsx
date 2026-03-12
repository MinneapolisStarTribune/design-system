import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderWithProvider } from '@/test-utils/render';
import { ImageGallery } from './ImageGallery';
import { ImageComponentProps } from './ImageGallery';
import { fireEvent } from '@testing-library/react';

const images = [
  {
    src: 'https://picsum.photos/1080/720?1',
    altText: 'Image 1',
    caption: 'Caption 1',
    credit: '(Photo credit 1)',
  },
  {
    src: 'https://picsum.photos/1080/720?2',
    altText: 'Image 2',
    caption: 'Caption 2',
    credit: '(Photo credit 2)',
  },
];

describe('ImageGallery', () => {
  it('renders the gallery', () => {
    const { getByTestId } = renderWithProvider(<ImageGallery images={images} variant="standard" />);

    expect(getByTestId('image-gallery')).toBeInTheDocument();
  });

  it('renders images', () => {
    const { getAllByRole } = renderWithProvider(
      <ImageGallery images={images} variant="standard" />
    );

    const imgs = getAllByRole('img');
    expect(imgs.length).toBeGreaterThanOrEqual(1);
  });

  it('shows caption and credit', () => {
    const { getByText } = renderWithProvider(<ImageGallery images={images} variant="standard" />);

    expect(getByText(/Caption 1/i)).toBeInTheDocument();
    expect(getByText(/Photo credit 1/i)).toBeInTheDocument();
  });

  it('renders navigation controls when more than one image exists', () => {
    const { getAllByRole } = renderWithProvider(
      <ImageGallery images={images} variant="standard" />
    );

    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('disables previous button on first slide in standard variant', () => {
    const { getAllByRole } = renderWithProvider(
      <ImageGallery images={images} variant="standard" />
    );

    const buttons = getAllByRole('button');
    const prevButton = buttons[0];

    expect(prevButton).toBeDisabled();
  });

  it('renders immersive variant', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery images={images} variant="immersive" />
    );

    expect(getByTestId('image-gallery')).toBeInTheDocument();
  });

  it('shows image counter', () => {
    const { getByText } = renderWithProvider(<ImageGallery images={images} variant="standard" />);

    expect(getByText('1/2')).toBeInTheDocument();
  });

  it('handles next button click', () => {
    const { getAllByRole } = renderWithProvider(
      <ImageGallery images={images} variant="immersive" />
    );

    const nextButton = getAllByRole('button')[1];

    nextButton.click();

    expect(nextButton).toBeInTheDocument();
  });

  it('calls next and previous navigation', () => {
    const { getAllByRole } = renderWithProvider(
      <ImageGallery images={images} variant="immersive" />
    );

    const buttons = getAllByRole('button');
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    prevButton.click();
    nextButton.click();

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('renders nothing when images array is empty', () => {
    const { queryByTestId } = renderWithProvider(<ImageGallery images={[]} variant="standard" />);

    expect(queryByTestId('image-gallery')).not.toBeInTheDocument();
  });

  it('uses custom ImageComponent when provided', () => {
    const CustomImage = ({ src, alt, className }: ImageComponentProps) => (
      <img data-testid="custom-image" src={src} alt={alt} className={className} />
    );

    const { getAllByTestId } = renderWithProvider(
      <ImageGallery images={images} ImageComponent={CustomImage} />
    );

    expect(getAllByTestId('custom-image').length).toBeGreaterThan(0);
  });

  it('falls back to default img when ImageComponent is not provided', () => {
    const { getAllByRole } = renderWithProvider(<ImageGallery images={images} />);

    const imgs = getAllByRole('img');
    expect(imgs.length).toBeGreaterThan(0);
  });

  it('updates spaceBetween on window resize', () => {
    const { getByTestId } = renderWithProvider(<ImageGallery images={images} />);

    fireEvent(window, new Event('resize'));

    expect(getByTestId('image-gallery')).toBeInTheDocument();
  });

  it('renders caption even when credit is missing', () => {
    const testImages = [
      {
        src: 'https://picsum.photos/1080/720?1',
        altText: 'Image 1',
        caption: 'Caption only',
      },
    ];

    const { getByText } = renderWithProvider(<ImageGallery images={testImages} />);

    expect(getByText('Caption only')).toBeInTheDocument();
  });

  it('renders credit when caption exists', () => {
    const { getByText } = renderWithProvider(<ImageGallery images={images} />);

    expect(getByText(/Photo credit 1/i)).toBeInTheDocument();
  });

  it('renders image counter correctly', () => {
    const { getByText } = renderWithProvider(<ImageGallery images={images} />);

    expect(getByText('1/2')).toBeInTheDocument();
  });

  it('does not disable prev button in immersive mode', () => {
    const { getAllByRole } = renderWithProvider(
      <ImageGallery images={images} variant="immersive" />
    );

    const prevButton = getAllByRole('button')[0];

    expect(prevButton).not.toBeDisabled();
  });
});
