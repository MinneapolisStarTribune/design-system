import { expectNoA11yViolations } from '@/test-utils/a11y';
import { InlineVideo } from './InlineVideo';

describe('InlineVideo Accessibility', () => {
  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(
      <InlineVideo>
        <video />
      </InlineVideo>
    );
  });

  it('has no accessibility violations with caption and credit', async () => {
    await expectNoA11yViolations(
      <InlineVideo caption="Video caption" videoCredit="Video credit">
        <video />
      </InlineVideo>
    );
  });

  it('has no accessibility violations with different variants and orientation', async () => {
    await expectNoA11yViolations(
      <InlineVideo variant="immersive" orientation="vertical">
        <video />
      </InlineVideo>
    );
  });
});
