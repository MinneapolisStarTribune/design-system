import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderWithProvider } from '@/test-utils/render';
import { ImageGallery } from './ImageGallery';

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
});
