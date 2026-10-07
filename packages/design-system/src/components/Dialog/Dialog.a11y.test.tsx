import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import axeCore from 'axe-core';
import * as Dialog from './Dialog';
import { Button, FormControl, FormGroup, UtilityBody } from '@/components/index.web';
import { DesignSystemProvider } from '@/providers/DesignSystemProvider';

// The dialog portals into `body`, so scan `body` rather than the render container, excluding
// Floating UI's focus guards. Open via `open` so no focusable trigger is left under aria-hidden.
const renderOpenDialogAndCheckA11y = async (
  ui: React.ReactElement,
  role: 'dialog' | 'alertdialog' = 'dialog'
) => {
  render(
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      {ui}
    </DesignSystemProvider>
  );

  // Wait for the enter transition to settle so its status update lands inside act, not mid-scan.
  await waitFor(() => expect(screen.getByRole(role)).toHaveAttribute('data-status', 'open'));

  const results = await axeCore.run({
    include: [['body']],
    exclude: [['[data-floating-ui-focus-guard]']],
  });

  expect(results).toHaveNoViolations();
};

const noop = () => {};

describe('Dialog Accessibility', () => {
  it('has no violations for an alertdialog confirmation', async () => {
    await renderOpenDialogAndCheckA11y(
      <Dialog.Root open onClose={noop} role="alertdialog">
        <Dialog.Title>Delete game?</Dialog.Title>
        <Dialog.Content>
          <UtilityBody size="small">Are you sure you want to delete?</UtilityBody>
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="ghost">Cancel</Button>
          <Button color="brand">Delete</Button>
        </Dialog.Actions>
      </Dialog.Root>,
      'alertdialog'
    );
  });

  it('has no violations for a dialog named by aria-label', async () => {
    await renderOpenDialogAndCheckA11y(
      <Dialog.Root open onClose={noop} aria-label="Game details">
        <Dialog.Content>
          <UtilityBody size="small">Content without a visible title.</UtilityBody>
        </Dialog.Content>
      </Dialog.Root>
    );
  });

  it('has no violations without the close button', async () => {
    await renderOpenDialogAndCheckA11y(
      <Dialog.Root open onClose={noop} showCloseButton={false}>
        <Dialog.Title>Game added</Dialog.Title>
        <Dialog.Actions>
          <Button color="brand">Done</Button>
        </Dialog.Actions>
      </Dialog.Root>
    );
  });

  it('has no violations for a form', async () => {
    await renderOpenDialogAndCheckA11y(
      <Dialog.Root open onClose={noop}>
        <Dialog.Title>Add Game</Dialog.Title>
        <Dialog.Content>
          <FormGroup>
            <FormGroup.Label>Location</FormGroup.Label>
            <FormControl.TextInput placeholderText="e.g. East High School" />
          </FormGroup>
          <FormGroup>
            <FormGroup.Label optional>Livestream Link</FormGroup.Label>
            <FormControl.TextInput placeholderText="Enter URL..." />
          </FormGroup>
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="ghost">Cancel</Button>
          <Button color="brand">Add Game</Button>
        </Dialog.Actions>
      </Dialog.Root>
    );
  });
});
