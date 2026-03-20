import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { ImageGallery } from './ImageGallery';
import { ImageComponentProps } from './ImageGallery';

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

describe('ImageGallery Accessibility', () => {
  describe('static rendering', () => {
    it('has no accessibility violations in standard variant', async () => {
      await expectNoA11yViolations(<ImageGallery images={images} variant="standard" />);
    });

    it('has no accessibility violations in immersive variant', async () => {
      await expectNoA11yViolations(<ImageGallery images={images} variant="immersive" />);
    });

    it('has no accessibility violations with single image', async () => {
      await expectNoA11yViolations(<ImageGallery images={[images[0]]} variant="standard" />);
    });
  });

  describe('interactive states', () => {
    it('has no violations after clicking next', async () => {
      const { renderResult, checkA11y } = await renderAndCheckA11y(
        <ImageGallery images={images} variant="immersive" />
      );

      const nextButton = renderResult.getAllByRole('button')[1];

      await userEvent.click(nextButton);

      await checkA11y();
    });

    it('supports keyboard navigation focus', async () => {
      const { checkA11y } = await renderAndCheckA11y(
        <ImageGallery images={images} variant="standard" />
      );

      await userEvent.tab();

      await checkA11y();
    });

    it('has no accessibility violations with custom ImageComponent', async () => {
      const CustomImage = ({ src, alt }: ImageComponentProps) => <img src={src} alt={alt} />;

      await expectNoA11yViolations(<ImageGallery images={images} ImageComponent={CustomImage} />);
    });
  });
});
