import { describe, it } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Button, UtilityBody } from '@/components/index.web';
import { TriggerablePopover } from './TriggerablePopover';

describe('TriggerablePopover Accessibility', () => {
  it('has no violations for a plain popover (no triggerId), same as Popover', async () => {
    await expectNoA11yViolations(
      <TriggerablePopover trigger={<Button>Open</Button>}>
        <TriggerablePopover.Heading>Title</TriggerablePopover.Heading>

        <TriggerablePopover.Body>
          <UtilityBody>Content</UtilityBody>
        </TriggerablePopover.Body>
      </TriggerablePopover>
    );
  });

  it('has no violations without a heading using aria-label', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <TriggerablePopover trigger={<Button>Open</Button>} aria-label="Popover information">
        <TriggerablePopover.Body>
          <UtilityBody>Content without heading</UtilityBody>
        </TriggerablePopover.Body>
      </TriggerablePopover>
    );

    await checkA11y();
  });

  it('has no violations while force-mounted but closed, with an injection slot present', async () => {
    // Exercises the state unique to this component: the shell is in the DOM (force-mounted ahead
    // of the first external open) but closed — the hidden injection slot shouldn't introduce any
    // violations, and the closed trigger should still read correctly.
    const { checkA11y } = await renderAndCheckA11y(
      <TriggerablePopover triggerId="a11y-demo" enableInjectionSlot trigger={<Button>Open</Button>}>
        <TriggerablePopover.Heading>Title</TriggerablePopover.Heading>

        <TriggerablePopover.Body>
          <UtilityBody>Content</UtilityBody>
        </TriggerablePopover.Body>
      </TriggerablePopover>
    );

    await checkA11y();
  });
});
