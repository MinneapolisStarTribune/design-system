import { expectNoA11yViolations } from '@/test-utils/a11y';
import { Image } from './Image';

describe('Image Accessibility', () => {
  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(
      <Image src="https://via.placeholder.com/150" alt="Placeholder Image" />
    );
  });

  it('has no accessibility violations with imgix parameters', async () => {
    await expectNoA11yViolations(
      <Image
        src="https://via.placeholder.com/150"
        alt="Placeholder Image"
        imgixParams="w=800&h=500&fit=crop&auto=format,compress&q=75"
      />
    );
  });

  it('has no accessibility violations with additional props', async () => {
    await expectNoA11yViolations(
      <Image
        src="https://via.placeholder.com/150"
        alt="Placeholder Image"
        imgixParams="w=800&h=500&fit=crop&auto=format,compress&q=75"
        height="500"
        width="800"
        loading="lazy"
      />
    );
  });
});
