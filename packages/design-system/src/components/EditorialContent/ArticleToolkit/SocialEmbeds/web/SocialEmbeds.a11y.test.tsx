import { describe, it } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { SocialEmbeds } from './SocialEmbeds';

describe('SocialEmbeds Accessibility', () => {
  it('has no violations for default render', async () => {
    await expectNoA11yViolations(
      <SocialEmbeds>
        <div>Mock Embed</div>
      </SocialEmbeds>
    );
  });

  it('has no violations with platform', async () => {
    await expectNoA11yViolations(
      <SocialEmbeds platform="instagram">
        <div>Mock Embed</div>
      </SocialEmbeds>
    );
  });

  it('has no violations with inline variant', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <SocialEmbeds variant="inline">
        <div>Mock Embed</div>
      </SocialEmbeds>
    );

    await checkA11y();
  });

  it('has no violations with full variant', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <SocialEmbeds variant="full">
        <div>Mock Embed</div>
      </SocialEmbeds>
    );

    await checkA11y();
  });
});
