import { describe, it, vi } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Coachmark } from './Coachmark';
import { Button } from '@/components/Button/web/Button';
import { StarIcon } from '@/icons';

describe('Coachmark Accessibility', () => {
  it('has no violations when closed', async () => {
    await expectNoA11yViolations(
      <Coachmark
        open={false}
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );
  });

  it('has no violations when open', async () => {
    await expectNoA11yViolations(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );
  });

  it('has no violations with an icon and badge', async () => {
    await expectNoA11yViolations(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        icon={<StarIcon size="x-large" color="on-dark-primary" />}
        badgeText="New"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );
  });

  it('has no violations with secondary content', async () => {
    await expectNoA11yViolations(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
        secondaryContent={<a href="/login">Log in</a>}
      >
        <Button>Trigger</Button>
      </Coachmark>
    );
  });

  it('gives the dialog an accessible name/description from title/description', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Coachmark
        open
        onOpenChange={vi.fn()}
        title="Title"
        description="Description"
        ctaText="Do it"
      >
        <Button>Trigger</Button>
      </Coachmark>
    );

    await checkA11y();
  });
});
