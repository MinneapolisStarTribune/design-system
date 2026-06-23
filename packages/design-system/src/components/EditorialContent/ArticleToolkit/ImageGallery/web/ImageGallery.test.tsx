import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { renderWithProvider } from '@/test-utils/render';
import { ImageProps } from '@/components/Image/web/Image';
import { fireEvent } from '@testing-library/react';
import { ImageGallery } from './ImageGallery';

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'open', {
    configurable: true,
    writable: true,
    value: false,
  });

  HTMLDialogElement.prototype.showModal = vi.fn(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'open', {
      configurable: true,
      writable: true,
      value: true,
    });
  });

  HTMLDialogElement.prototype.close = vi.fn(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'open', {
      configurable: true,
      writable: true,
      value: false,
    });
  });
});

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
    const { getByTestId, getByText } = renderWithProvider(<ImageGallery images={images} />);
    expect(getByTestId('image-gallery-caption')).toHaveTextContent('Caption 1 (Photo credit 1)');
    expect(getByText(/Caption 1/i)).toBeInTheDocument();
    expect(getByText(/Photo credit 1/i)).toBeInTheDocument();
  });

  it('renders pagination and navigation from the shared caption', () => {
    const { queryByTestId, getAllByRole } = renderWithProvider(<ImageGallery images={images} />);

    expect(queryByTestId('image-gallery-caption-pagination')).not.toBeInTheDocument();
    expect(getAllByRole('button')).toHaveLength(2);
  });

  it('renders buy reprint in the inline gallery caption from the gallery-level purchase link', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery
        images={images}
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
      />
    );

    expect(getByTestId('image-gallery-caption-purchase-link')).toHaveAttribute(
      'href',
      'https://www.startribune.com/photos'
    );
  });

  it('renders default Buy Reprint when gallery-level purchaseLink.label is missing', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery
        images={images}
        purchaseLink={{
          link: 'https://www.startribune.com/photos',
        }}
      />
    );

    expect(getByTestId('image-gallery-caption-purchase-link')).toHaveTextContent('Buy Reprint');
    expect(getByTestId('image-gallery-caption-purchase-link')).toHaveAttribute(
      'href',
      'https://www.startribune.com/photos'
    );
  });

  it('renders default Buy Reprint when gallery-level purchaseLink.label is empty', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery
        images={images}
        purchaseLink={{
          label: '  ',
          link: 'https://www.startribune.com/photos',
        }}
      />
    );

    expect(getByTestId('image-gallery-caption-purchase-link')).toHaveTextContent('Buy Reprint');
    expect(getByTestId('image-gallery-caption-purchase-link')).toHaveAttribute(
      'href',
      'https://www.startribune.com/photos'
    );
  });

  it('prefers the image-level purchase link over the gallery-level purchase link', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery
        images={[
          {
            ...images[0],
            purchaseLink: {
              label: 'Image Buy Reprint',
              link: 'https://www.startribune.com/photos?image=1',
            },
          },
          images[1],
        ]}
        purchaseLink={{
          label: 'Gallery Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
      />
    );

    expect(getByTestId('image-gallery-caption-purchase-link')).toHaveAttribute(
      'href',
      'https://www.startribune.com/photos?image=1'
    );
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

  it('calls onIndexChange with the initial 1-based index', () => {
    const onIndexChange = vi.fn();

    renderWithProvider(<ImageGallery images={images} onIndexChange={onIndexChange} />);

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('respects explicit spaceBetween prop without resize dependency', () => {
    const { getByTestId } = renderWithProvider(<ImageGallery images={images} spaceBetween={32} />);
    fireEvent(window, new Event('resize'));
    expect(getByTestId('image-gallery')).toBeInTheDocument();
  });

  it('applies one gallery-level aspect ratio to every slide wrapper', () => {
    const mixedImages = [
      {
        src: 'https://picsum.photos/1080/1080?1',
        altText: 'Square image',
        width: 1080,
        height: 1080,
      },
      {
        src: 'https://picsum.photos/1080/720?2',
        altText: 'Landscape image',
        width: 1080,
        height: 720,
      },
      {
        src: 'https://picsum.photos/720/1080?3',
        altText: 'Portrait image',
      },
    ];

    const { container } = renderWithProvider(
      <ImageGallery images={mixedImages} aspectRatio="1 / 1" />
    );
    const wrappers = Array.from(container.querySelectorAll('.swiper-slide > div'));

    expect(wrappers).toHaveLength(3);
    wrappers.forEach((wrapper) => {
      expect(wrapper).toHaveStyle({ aspectRatio: '1 / 1' });
    });
  });

  it('applies gallery-level aspect ratio to the expanded dialog wrapper', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery images={images} expandable aspectRatio="1 / 1" dataTestId="gallery" />
    );

    fireEvent.click(getByTestId('gallery-expand-button-0'));

    const dialog = getByTestId('gallery-dialog');
    const dialogImageWrapper = dialog.querySelector('figure > div');

    expect(dialogImageWrapper).toHaveStyle({ aspectRatio: '1 / 1' });
  });

  it('does not render expand control by default', () => {
    const { queryByTestId } = renderWithProvider(
      <ImageGallery images={images} dataTestId="gallery" />
    );
    expect(queryByTestId('gallery-expand-button-0')).not.toBeInTheDocument();
  });

  it('renders expand control on each slide when expandable', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery images={images} expandable dataTestId="gallery" />
    );
    expect(getByTestId('gallery-expand-button-0')).toBeInTheDocument();
    expect(getByTestId('gallery-expand-button-1')).toBeInTheDocument();
  });

  it('opens and closes expanded dialog for the clicked slide when expandable', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery images={images} expandable dataTestId="gallery" />
    );

    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

    fireEvent.click(getByTestId('gallery-expand-button-0'));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

    const dialog = getByTestId('gallery-dialog');
    expect(dialog.querySelector('img')).toHaveAttribute('alt', 'Image 1');

    fireEvent.click(getByTestId('gallery-dialog-close-button'));
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it('renders dialog pagination and caption navigation when expandable', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery images={images} expandable dataTestId="gallery" />
    );

    fireEvent.click(getByTestId('gallery-expand-button-0'));

    const dialog = getByTestId('gallery-dialog');
    const buttons = dialog.querySelectorAll('button');

    expect(getByTestId('gallery-dialog-caption-pagination')).toHaveTextContent('1/2');

    fireEvent.click(buttons[2]);

    expect(getByTestId('gallery-dialog-caption-pagination')).toHaveTextContent('2/2');
    expect(dialog.querySelector('img')).toHaveAttribute('alt', 'Image 2');
    expect(getByTestId('gallery-dialog-caption')).toHaveTextContent('Caption 2');
  });

  it('renders buy reprint in the expanded dialog for the active image', () => {
    const { getByTestId } = renderWithProvider(
      <ImageGallery
        images={images}
        purchaseLink={{
          label: 'Buy Reprint',
          link: 'https://www.startribune.com/photos',
        }}
        expandable
        dataTestId="gallery"
      />
    );

    fireEvent.click(getByTestId('gallery-expand-button-0'));

    expect(getByTestId('gallery-dialog-caption-purchase-link')).toHaveAttribute(
      'href',
      'https://www.startribune.com/photos'
    );
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
  });
});
