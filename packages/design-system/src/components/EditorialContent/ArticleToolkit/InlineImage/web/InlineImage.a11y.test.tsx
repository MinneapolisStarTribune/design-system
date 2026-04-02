import { expectNoA11yViolations } from '@/test-utils/a11y';
import { InlineImage } from './InlineImage';

const imageList = [{ src: '', altText: '' }];

describe('InlineImage Accessibility', () => {
  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(<InlineImage imageList={imageList} />);
  });

  it('has no accessibility violations with additional props', async () => {
    await expectNoA11yViolations(
      <InlineImage
        imageList={imageList}
        caption="Caption for the image"
        credit="Credit for the image"
        expandable
      />
    );
  });

  it('has no accessibility violations with imgix parameters', async () => {
    await expectNoA11yViolations(
      <InlineImage
        imageList={imageList}
        imgixParams="w=800&h=500&fit=crop&auto=format,compress&q=75"
      />
    );
  });
});
