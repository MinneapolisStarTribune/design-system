import { expectNoA11yViolations } from '@/test-utils/a11y';
import { InlineImage } from './InlineImage';

describe('InlineImage Accessibility', () => {
  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(<InlineImage image={{ src: '', altText: '' }} />);
  });

  it('has no accessibility violations with additional props', async () => {
    await expectNoA11yViolations(
      <InlineImage
        image={{ src: '', altText: '' }}
        altText="Alternative text for the image"
        caption="Caption for the image"
        credit="Credit for the image"
        expandable
      />
    );
  });

  it('has no accessibility violations with imgix parameters', async () => {
    await expectNoA11yViolations(
      <InlineImage
        image={{ src: '', altText: '' }}
        imgixParams="w=800&h=500&fit=crop&auto=format,compress&q=75"
      />
    );
  });
});
