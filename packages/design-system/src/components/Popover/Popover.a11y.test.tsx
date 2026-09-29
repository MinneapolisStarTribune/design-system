import { describe, it } from 'vitest';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Button, UtilityBody } from '@/components/index.web';
import { Popover } from './Popover';

describe('Popover Accessibility', () => {
  it('has no violations for basic popover', async () => {
    await expectNoA11yViolations(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>

        <Popover.Description>This is a popover description.</Popover.Description>
      </Popover>
    );
  });

  it('has no violations with body content', async () => {
    await expectNoA11yViolations(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>

        <Popover.Body>
          <UtilityBody>Option 1</UtilityBody>
          <UtilityBody>Option 2</UtilityBody>
          <UtilityBody>Option 3</UtilityBody>
        </Popover.Body>
      </Popover>
    );
  });

  it('has no violations with divider', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Popover trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>

        <Popover.Divider />

        <Popover.Body>
          <UtilityBody>Popover body content</UtilityBody>
        </Popover.Body>
      </Popover>
    );

    await checkA11y();
  });

  it('has no violations without heading using aria-label', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Popover trigger={<Button>Open</Button>} aria-label="Popover information">
        <Popover.Body>
          <UtilityBody>Content without heading</UtilityBody>
        </Popover.Body>
      </Popover>
    );

    await checkA11y();
  });

  it('has no violations with custom classNames', async () => {
    const { checkA11y } = await renderAndCheckA11y(
      <Popover
        trigger={<Button>Open</Button>}
        wrapperClassName="custom-wrapper"
        containerClassName="custom-container"
        contentClassName="custom-content"
        arrowClassName="custom-arrow"
      >
        <Popover.Heading
          headerClassName="custom-header"
          titleClassName="custom-title"
          closeButtonClassName="custom-close-button"
        >
          Title
        </Popover.Heading>

        <Popover.Description descriptionClassName="custom-description">
          Description
        </Popover.Description>

        <Popover.Divider dividerClassName="custom-divider" />

        <Popover.Body bodyClassName="custom-body">
          <UtilityBody>Body content</UtilityBody>
        </Popover.Body>
      </Popover>
    );

    await checkA11y();
  });
});
