import { renderWithProvider } from '@/test-utils/render';
import { InlineImage } from './InlineImage';

describe('InlineImage', () => {
  const image = {
    src: 'https://picsum.photos/id/1018/1200/800',
    altText: 'Alternative text for the image',
  };
  const dataTestId = 'inline-image-test';

  it('should render the image', () => {
    const { getByTestId } = renderWithProvider(
      <InlineImage dataTestId={dataTestId} image={image} size="medium" />
    );
    const el = getByTestId(dataTestId);
    const imgElement = el.querySelector('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', image.src);
    expect(imgElement).toHaveAttribute('alt', image.altText);
  });

  it('should apply imgix parameters to the image source URL', () => {
    const imgixParams = 'w=800&h=500&fit=crop&auto=format,compress&q=75';
    const { getByTestId } = renderWithProvider(
      <InlineImage dataTestId={dataTestId} image={image} size="medium" imgixParams={imgixParams} />
    );

    const el = getByTestId(dataTestId);
    const imgElement = el.querySelector('img');
    expect(imgElement).toHaveAttribute('src', `${image.src}?${imgixParams}`);
  });

  it('should render the caption', () => {
    const caption = 'Image caption';
    const { getByTestId } = renderWithProvider(
      <InlineImage dataTestId={dataTestId} image={image} size="medium" caption={caption} />
    );
    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');
    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveTextContent(caption);
  });

  it('should render the credit', () => {
    const credit = 'Image credit';
    const { getByTestId } = renderWithProvider(
      <InlineImage dataTestId={dataTestId} image={image} size="medium" credit={credit} />
    );
    const el = getByTestId(dataTestId);
    const creditElement = el.querySelector('figcaption');
    expect(creditElement).toBeInTheDocument();
    expect(creditElement).toHaveTextContent(`(${credit})`);
  });

  it('should render the caption and credit', () => {
    const caption = 'Image caption';
    const credit = 'Image credit';
    const { getByTestId } = renderWithProvider(
      <InlineImage
        dataTestId={dataTestId}
        image={image}
        size="medium"
        caption={caption}
        credit={credit}
      />
    );
    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');
    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveTextContent(`${caption} (${credit})`);
  });

  it('should not render the caption or credit when caption and credit are empty', () => {
    const { getByTestId } = renderWithProvider(
      <InlineImage dataTestId={dataTestId} image={image} size="medium" caption="" credit="" />
    );
    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');
    expect(captionElement).not.toBeInTheDocument();
  });

  it('should not render the caption when caption is empty', () => {
    const { getByTestId } = renderWithProvider(
      <InlineImage dataTestId={dataTestId} image={image} size="medium" caption="" />
    );
    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');
    expect(captionElement).not.toBeInTheDocument();
  });

  it('should not render the credit when credit is empty', () => {
    const { getByTestId } = renderWithProvider(
      <InlineImage dataTestId={dataTestId} image={image} size="medium" credit="" />
    );
    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');
    expect(captionElement).not.toBeInTheDocument();
  });
});
