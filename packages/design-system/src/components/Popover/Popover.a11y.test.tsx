import { describe, it } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Button, UtilityBody } from '@/components/index.web';
import * as Popover from './Popover';

describe('Popover Accessibility', () => {
  it('has no violations for basic popover', async () => {
    await expectNoA11yViolations(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>

        <Popover.Description>This is a popover description.</Popover.Description>
      </Popover.Root>
    );
  });

  it('has no violations with body content', async () => {
    await expectNoA11yViolations(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>

        <Popover.Body>
          <UtilityBody>Option 1</UtilityBody>
          <UtilityBody>Option 2</UtilityBody>
          <UtilityBody>Option 3</UtilityBody>
        </Popover.Body>
      </Popover.Root>
    );
  });

  it('has no violations with divider', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>

        <Popover.Divider />

        <Popover.Body>
          <UtilityBody>Popover body content</UtilityBody>
        </Popover.Body>
      </Popover.Root>
    );

    await checkA11y();
  });

  it('has no violations without heading using aria-label', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Popover.Root trigger={<Button>Open</Button>} aria-label="Popover information">
        <Popover.Body>
          <UtilityBody>Content without heading</UtilityBody>
        </Popover.Body>
      </Popover.Root>
    );

    await checkA11y();
  });

  it('has no violations with custom classNames', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Popover.Root trigger={<Button>Open</Button>} className="custom-popover">
        <Popover.Heading className="custom-header">Title</Popover.Heading>

        <Popover.Description className="custom-description">Description</Popover.Description>

        <Popover.Divider className="custom-divider" />

        <Popover.Body className="custom-body">
          <UtilityBody>Body content</UtilityBody>
        </Popover.Body>
      </Popover.Root>
    );

    await checkA11y();
  });
});
