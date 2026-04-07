import { renderWithProvider } from '@/test-utils/render';
import { InlineVideo } from './InlineVideo';

describe('InlineVideo', () => {
  const dataTestId = 'inline-video-test';

  it('should render the video player (children)', () => {
    const { getByTestId } = renderWithProvider(
      <InlineVideo dataTestId={dataTestId}>
        <video data-testid="video-element" />
      </InlineVideo>
    );

    const el = getByTestId(dataTestId);
    const videoElement = el.querySelector('[data-testid="video-element"]');

    expect(videoElement).toBeInTheDocument();
  });

  it('should render the caption', () => {
    const caption = 'Video caption';

    const { getByTestId } = renderWithProvider(
      <InlineVideo dataTestId={dataTestId} caption={caption}>
        <video />
      </InlineVideo>
    );

    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');

    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveTextContent(caption);
  });

  it('should render the video credit', () => {
    const credit = 'Video credit';

    const { getByTestId } = renderWithProvider(
      <InlineVideo dataTestId={dataTestId} videoCredit={credit}>
        <video />
      </InlineVideo>
    );

    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');

    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveTextContent(`(${credit})`);
  });

  it('should render the caption and video credit', () => {
    const caption = 'Video caption';
    const credit = 'Video credit';

    const { getByTestId } = renderWithProvider(
      <InlineVideo dataTestId={dataTestId} caption={caption} videoCredit={credit}>
        <video />
      </InlineVideo>
    );

    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');

    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveTextContent(`${caption} (${credit})`);
  });

  it('should not render caption when both caption and credit are empty', () => {
    const { getByTestId } = renderWithProvider(
      <InlineVideo dataTestId={dataTestId} caption="" videoCredit="">
        <video />
      </InlineVideo>
    );

    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');

    expect(captionElement).not.toBeInTheDocument();
  });

  it('should not render caption when caption is empty', () => {
    const { getByTestId } = renderWithProvider(
      <InlineVideo dataTestId={dataTestId} caption="">
        <video />
      </InlineVideo>
    );

    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');

    expect(captionElement).not.toBeInTheDocument();
  });

  it('should not render caption when credit is empty', () => {
    const { getByTestId } = renderWithProvider(
      <InlineVideo dataTestId={dataTestId} videoCredit="">
        <video />
      </InlineVideo>
    );

    const el = getByTestId(dataTestId);
    const captionElement = el.querySelector('figcaption');

    expect(captionElement).not.toBeInTheDocument();
  });

  it('should apply variant and orientation classes', () => {
    const { getByTestId } = renderWithProvider(
      <InlineVideo dataTestId={dataTestId} variant="immersive" orientation="vertical">
        <video />
      </InlineVideo>
    );

    const el = getByTestId(dataTestId);

    expect(el.className).toMatch(/variant-immersive/);
    expect(el.className).toMatch(/orientation-vertical/);
  });
});
