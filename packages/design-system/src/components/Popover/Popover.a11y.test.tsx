import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '@/test-utils/render';
import * as Popover from './Popover';

// The dialog is portaled outside the render container, so scan the open dialog itself.
const expectAccessibleDialog = async () => {
  const dialog = await screen.findByRole('dialog');
  expect((await axe(dialog, { rules: { region: { enabled: false } } })).violations).toHaveLength(0);
};

describe('Popover accessibility', () => {
  it('has no violations with a heading and interactive content', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Description>Description</Popover.Description>
        <Popover.Divider />
        <Popover.Body>
          <Button>Action</Button>
        </Popover.Body>
      </Popover.Root>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await expectAccessibleDialog();
  });

  it('has no violations when named with aria-label', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <Popover.Root trigger={<Button>Open</Button>} aria-label="Popover information">
        <Popover.Body>Content</Popover.Body>
      </Popover.Root>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await expectAccessibleDialog();
  });
});
