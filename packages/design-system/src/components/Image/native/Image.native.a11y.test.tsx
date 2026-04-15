import { expectNoA11yViolations } from '@/test-utils/a11y';
import { Image } from './Image.native';

describe('Image Accessibility', () => {
  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(
      <Image src="https://via.placeholder.com/150" alt="Placeholder Image" />
    );
  });

  it('has no accessibility violations with imgix params', async () => {
    await expectNoA11yViolations(
      <Image
        src="https://via.placeholder.com/150"
        alt="Placeholder Image"
        imgixParams="w=400&h=300&fit=crop"
      />
    );
  });

  it('has accessibility label fallback from alt', async () => {
    await expectNoA11yViolations(
      <Image src="https://via.placeholder.com/150" alt="Accessible image" />
    );
  });

  it('supports custom accessibilityLabel override', async () => {
    await expectNoA11yViolations(
      <Image
        src="https://via.placeholder.com/150"
        alt="Alt text"
        accessibilityLabel="Custom label"
      />
    );
  });
});
