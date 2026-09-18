import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import { Button, UtilityBody } from '@/components/index.web';
import { DesignSystemProvider } from '@/providers/DesignSystemProvider';
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

  it('has no violations with a composed Popover.ExternalContent', async () => {
    render(
      <DesignSystemProvider brand="startribune" forceColorScheme="light">
        <Popover open aria-label="External content example">
          <Popover.ExternalContent
            icon={<span aria-hidden>icon</span>}
            heading="Heads up"
            description="Some external content"
            dismissText="Got it"
          />
        </Popover>
      </DesignSystemProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Heads up')).toBeInTheDocument();
    });

    const results = await axe(document.body, {
      rules: {
        // `FloatingFocusManager` (@floating-ui/react) renders invisible focus-guard <span>s that
        // get `role="button"` with no accessible name specifically under Safari (detected via
        // `navigator.vendor` containing "Apple"). jsdom's default `navigator.vendor` also matches
        // that check, so this fires here purely as a test-environment artifact — unrelated to
        // this component or its content — and doesn't reproduce in real (non-Safari) browsers.
        'aria-command-name': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
