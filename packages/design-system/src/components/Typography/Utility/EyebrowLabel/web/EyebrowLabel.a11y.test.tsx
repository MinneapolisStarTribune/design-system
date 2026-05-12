import { expectNoA11yViolations } from '@/test-utils/a11y';
import { EyebrowLabel } from './EyebrowLabel';

describe('EyebrowLabel Accessibility', () => {
  it('has no violations for neutral/light', async () => {
    await expectNoA11yViolations(
      <EyebrowLabel color="neutral" background="on-light">
        Label
      </EyebrowLabel>
    );
  });

  it('has no violations for live/dark', async () => {
    await expectNoA11yViolations(
      <EyebrowLabel color="live" background="on-dark" logo brand="startribune">
        Live
      </EyebrowLabel>
    );
  });

  it('has no violations for subscriber-only', async () => {
    await expectNoA11yViolations(
      <EyebrowLabel isSubscriberOnly background="on-light" logo brand="startribune">
        Subscriber only
      </EyebrowLabel>
    );
  });
});
