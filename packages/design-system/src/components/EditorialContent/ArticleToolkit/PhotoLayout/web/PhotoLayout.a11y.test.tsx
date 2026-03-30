import { expectNoA11yViolations } from '@/test-utils/a11y';
import { PhotoLayout } from './PhotoLayout';

describe('PhotoLayout Accessibility', () => {
  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(<PhotoLayout imageList={[]} />);
  });

  it('has no accessibility violations with additional props', async () => {
    await expectNoA11yViolations(
      <PhotoLayout
        imageList={[]}
        caption="Caption for the image"
        imageCredit="Credit for the image"
        expandable
      />
    );
  });

  it('has no accessibility violations with imgix parameters', async () => {
    await expectNoA11yViolations(
      <PhotoLayout imageList={[]} imgixParams="w=800&h=500&fit=crop&auto=format,compress&q=75" />
    );
  });
});
