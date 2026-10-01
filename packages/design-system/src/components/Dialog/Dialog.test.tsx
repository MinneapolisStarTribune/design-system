import { type ReactNode, useRef, useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Dialog from './Dialog';
import type { DialogProps } from './Dialog.types';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '@/test-utils/render';

type TestDialogProps = Omit<DialogProps, 'open' | 'onClose' | 'children'> & {
  children: ReactNode | ((close: () => void) => ReactNode);
};

// Pairs an opening button with a dialog whose open state lives in the harness, like consumers do.
const TestDialog = ({ children, ...props }: TestDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog.Root {...props} open={open} onClose={() => setOpen(false)}>
        {typeof children === 'function' ? children(() => setOpen(false)) : children}
      </Dialog.Root>
    </>
  );
};

const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByText('Open'));

  // Wait out the enter transition so its status update doesn't land outside act.
  return waitFor(() => {
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-status', 'open');
    return dialog;
  });
};

const expectClosed = () =>
  waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

describe('Dialog', () => {
  describe('rendering', () => {
    it('renders nothing while closed', () => {
      renderWithProvider(
        <TestDialog aria-label="Add game">
          <Dialog.Content>Content</Dialog.Content>
        </TestDialog>
      );

      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders the composed sections', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog>
          <Dialog.Title>Add Game</Dialog.Title>
          <Dialog.Content>Are you sure?</Dialog.Content>
          <Dialog.Actions>
            <Button>Yes</Button>
          </Dialog.Actions>
        </TestDialog>
      );

      await openDialog(user);

      expect(screen.getByRole('heading', { level: 2, name: 'Add Game' })).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('defaults test ids to the dialog prefix', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game">
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      const dialog = await openDialog(user);

      expect(dialog).toHaveAttribute('data-testid', 'dialog');
      expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-close-button')).toBeInTheDocument();
    });

    it('passes className and style through to the panel', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game" className="custom-panel" style={{ maxWidth: 320 }}>
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      const dialog = await openDialog(user);

      expect(dialog).toHaveClass('custom-panel');
      expect(dialog.style.maxWidth).toBe('320px');
    });

    it('passes className and dataTestId through to the sections', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog>
          <Dialog.Title className="custom-title" dataTestId="title">
            Add Game
          </Dialog.Title>
          <Dialog.Content className="custom-content" dataTestId="content">
            Body copy
          </Dialog.Content>
          <Dialog.Actions className="custom-actions" dataTestId="actions">
            <Button>Yes</Button>
          </Dialog.Actions>
        </TestDialog>
      );

      await openDialog(user);

      expect(screen.getByTestId('title')).toHaveClass('custom-title');
      expect(screen.getByTestId('content')).toHaveClass('custom-content');
      expect(screen.getByTestId('actions')).toHaveClass('custom-actions');
    });

    it('renders into a custom portal root', async () => {
      const user = userEvent.setup();
      const portalRoot = document.createElement('div');
      document.body.append(portalRoot);

      renderWithProvider(
        <TestDialog aria-label="Add game" portalRoot={portalRoot}>
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      const dialog = await openDialog(user);

      expect(portalRoot.contains(dialog)).toBe(true);

      portalRoot.remove();
    });
  });

  it('throws when a section is used outside a Dialog', () => {
    expect(() => renderWithProvider(<Dialog.Title>Orphan</Dialog.Title>)).toThrow(
      'Dialog components must be used within <Dialog.Root>'
    );
  });

  describe('accessible name', () => {
    it('names the dialog from the title', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog>
          <Dialog.Title>Add Game</Dialog.Title>
        </TestDialog>
      );

      const dialog = await openDialog(user);

      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAccessibleName('Add Game');
    });

    it('falls back to aria-label when there is no title', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Game details">
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      const dialog = await openDialog(user);

      expect(dialog).toHaveAccessibleName('Game details');
      expect(dialog).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('dismissal', () => {
    it('closes with the close button', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game">
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      await openDialog(user);
      await user.click(screen.getByRole('button', { name: 'Close' }));

      await expectClosed();
    });

    it('omits the close button when showCloseButton is false', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game" showCloseButton={false}>
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      await openDialog(user);

      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game">
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      await openDialog(user);
      await user.keyboard('{Escape}');

      await expectClosed();
    });

    it('closes when the overlay is pressed', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game">
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      await openDialog(user);
      await user.click(screen.getByTestId('dialog-overlay'));

      await expectClosed();
    });

    it('stays open on a press inside the panel', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game">
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      await openDialog(user);
      await user.click(screen.getByText('Body copy'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes from an action that sets open to false', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game">
          {(close) => (
            <Dialog.Actions>
              <Button onClick={close}>Cancel</Button>
            </Dialog.Actions>
          )}
        </TestDialog>
      );

      await openDialog(user);
      await user.click(screen.getByText('Cancel'));

      await expectClosed();
    });

    it('calls onClose without closing until open changes', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithProvider(
        <Dialog.Root open onClose={onClose} aria-label="Add game">
          <Dialog.Content>Body copy</Dialog.Content>
        </Dialog.Root>
      );

      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('focus management', () => {
    it('moves focus to the panel on open', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game">
          <Dialog.Content>
            <Button>First action</Button>
          </Dialog.Content>
        </TestDialog>
      );

      const dialog = await openDialog(user);

      await waitFor(() => expect(dialog).toHaveFocus());
    });

    it('moves focus to initialFocus on open', async () => {
      const user = userEvent.setup();

      const Harness = () => {
        const inputRef = useRef<HTMLInputElement>(null);

        return (
          <TestDialog aria-label="Add game" initialFocus={inputRef}>
            <Dialog.Content>
              <Button>Before</Button>
              <input ref={inputRef} aria-label="Location" />
            </Dialog.Content>
          </TestDialog>
        );
      };

      renderWithProvider(<Harness />);

      await openDialog(user);

      await waitFor(() => expect(screen.getByLabelText('Location')).toHaveFocus());
    });

    it('keeps Tab and Shift+Tab inside the dialog', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <>
          <Button>Outside</Button>
          <TestDialog aria-label="Add game">
            <Dialog.Actions>
              <Button>Cancel</Button>
              <Button>Add Game</Button>
            </Dialog.Actions>
          </TestDialog>
        </>
      );

      const dialog = await openDialog(user);
      await waitFor(() => expect(dialog).toHaveFocus());

      const close = screen.getByRole('button', { name: 'Close' });
      const cancel = screen.getByText('Cancel').closest('button');
      const addGame = screen.getByText('Add Game').closest('button');

      await user.tab();
      expect(close).toHaveFocus();

      await user.tab();
      expect(cancel).toHaveFocus();

      await user.tab();
      expect(addGame).toHaveFocus();

      // Focus guards redirect asynchronously, hence the waits.
      await user.tab();
      await waitFor(() => expect(close).toHaveFocus());

      await user.tab({ shift: true });
      await waitFor(() => expect(addGame).toHaveFocus());
    });

    it('returns focus to the opening control on close', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDialog aria-label="Add game">
          <Dialog.Content>Body copy</Dialog.Content>
        </TestDialog>
      );

      await openDialog(user);
      await user.keyboard('{Escape}');
      await expectClosed();

      await waitFor(() => expect(screen.getByText('Open').closest('button')).toHaveFocus());
    });
  });

  describe('role and description', () => {
    // Rendered open so the role can be queried without the dialog-only open helper.
    const waitForOpen = (role: 'dialog' | 'alertdialog') =>
      waitFor(() => {
        const panel = screen.getByRole(role);
        expect(panel).toHaveAttribute('data-status', 'open');
        return panel;
      });

    it('uses the dialog role by default, without a description', async () => {
      renderWithProvider(
        <Dialog.Root open onClose={() => {}} aria-label="Add game">
          <Dialog.Content>Body copy</Dialog.Content>
        </Dialog.Root>
      );

      const panel = await waitForOpen('dialog');

      expect(panel).not.toHaveAttribute('aria-describedby');
    });

    it('renders an alertdialog described by its content', async () => {
      renderWithProvider(
        <Dialog.Root open onClose={() => {}} role="alertdialog" aria-label="Delete game">
          <Dialog.Content>This can’t be undone.</Dialog.Content>
        </Dialog.Root>
      );

      const panel = await waitForOpen('alertdialog');

      expect(panel).toHaveAccessibleDescription('This can’t be undone.');
    });

    it('describes a dialog with describeWithContent', async () => {
      renderWithProvider(
        <Dialog.Root open onClose={() => {}} aria-label="Add game" describeWithContent>
          <Dialog.Content>Short message</Dialog.Content>
        </Dialog.Root>
      );

      const panel = await waitForOpen('dialog');

      expect(panel).toHaveAccessibleDescription('Short message');
    });

    it('drops the alertdialog description when describeWithContent is false', async () => {
      renderWithProvider(
        <Dialog.Root
          open
          onClose={() => {}}
          role="alertdialog"
          aria-label="Delete game"
          describeWithContent={false}
        >
          <Dialog.Content>This can’t be undone.</Dialog.Content>
        </Dialog.Root>
      );

      const panel = await waitForOpen('alertdialog');

      expect(panel).not.toHaveAttribute('aria-describedby');
    });

    it('omits the description when there is no content', async () => {
      renderWithProvider(
        <Dialog.Root open onClose={() => {}} role="alertdialog" aria-label="Delete game">
          <Dialog.Actions>
            <Button>Delete</Button>
          </Dialog.Actions>
        </Dialog.Root>
      );

      const panel = await waitForOpen('alertdialog');

      expect(panel).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('close reasons', () => {
    const renderOpen = (onClose = vi.fn()) => {
      renderWithProvider(
        <Dialog.Root open onClose={onClose} aria-label="Add game">
          <Dialog.Content>Body copy</Dialog.Content>
        </Dialog.Root>
      );

      return onClose;
    };

    it('reports closeButton', async () => {
      const user = userEvent.setup();
      const onClose = renderOpen();

      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(onClose).toHaveBeenCalledWith('closeButton');
    });

    it('reports escapeKey', async () => {
      const user = userEvent.setup();
      const onClose = renderOpen();

      await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus());
      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalledWith('escapeKey');
    });

    it('reports overlayPress', async () => {
      const user = userEvent.setup();
      const onClose = renderOpen();

      await user.click(screen.getByTestId('dialog-overlay'));

      expect(onClose).toHaveBeenCalledWith('overlayPress');
    });

    it('lets consumers ignore overlay presses', async () => {
      const user = userEvent.setup();

      const Harness = () => {
        const [open, setOpen] = useState(true);

        return (
          <Dialog.Root
            open={open}
            onClose={(reason) => {
              if (reason !== 'overlayPress') setOpen(false);
            }}
            aria-label="Add game"
          >
            <Dialog.Content>Unsaved input</Dialog.Content>
          </Dialog.Root>
        );
      };

      renderWithProvider(<Harness />);

      await user.click(screen.getByTestId('dialog-overlay'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      await expectClosed();
    });
  });

  it('labels the close button with closeLabel', () => {
    renderWithProvider(
      <Dialog.Root open onClose={() => {}} aria-label="Add game" closeLabel="Cerrar">
        <Dialog.Content>Body copy</Dialog.Content>
      </Dialog.Root>
    );

    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });
});
