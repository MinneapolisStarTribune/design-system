import { type ReactNode, useRef, useState } from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Drawer from './Drawer';
import { DRAWER_POSITIONS } from './Drawer.constants';
import type { DrawerPosition, DrawerProps } from './Drawer.types';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '@/test-utils/render';
import { mockViewport } from '@/test-utils/viewport';

type TestDrawerProps = Omit<DrawerProps, 'open' | 'onClose' | 'children'> & {
  triggerLabel?: string;
  children: ReactNode | ((close: () => void) => ReactNode);
};

// Pairs an opening button with a drawer whose open state lives in the harness, like consumers do.
const TestDrawer = ({ triggerLabel = 'Open', children, ...props }: TestDrawerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <Drawer.Root {...props} open={open} onClose={() => setOpen(false)}>
        {typeof children === 'function' ? children(() => setOpen(false)) : children}
      </Drawer.Root>
    </>
  );
};

const openDrawer = async (user: ReturnType<typeof userEvent.setup>, name = 'Open') => {
  await user.click(screen.getByText(name));

  // Wait out the enter transition so its status update doesn't land outside act.
  return waitFor(() => {
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-status', 'open');
    return dialog;
  });
};

// The resolved edge is applied as a `position-*` class on the overlay.
const expectPosition = (position: DrawerPosition) =>
  expect(screen.getByTestId('drawer-overlay').className).toMatch(
    new RegExp(`(^|_|\\s)position-${position}(_|\\s|$)`)
  );

const expectClosed = () =>
  waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

describe('Drawer', () => {
  describe('rendering', () => {
    it('renders nothing while closed', () => {
      renderWithProvider(
        <TestDrawer aria-label="Filters">
          <Drawer.Body>Content</Drawer.Body>
        </TestDrawer>
      );

      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when open is set', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters">
          <Drawer.Body>Drawer content</Drawer.Body>
        </TestDrawer>
      );

      await openDrawer(user);

      expect(screen.getByText('Drawer content')).toBeInTheDocument();
    });

    it('renders the composed sections', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer>
          <Drawer.Heading>Filter calendar</Drawer.Heading>
          <Drawer.Body>Body copy</Drawer.Body>
          <Drawer.Footer>
            <Button>Apply</Button>
          </Drawer.Footer>
        </TestDrawer>
      );

      await openDrawer(user);

      expect(
        screen.getByRole('heading', { level: 2, name: 'Filter calendar' })
      ).toBeInTheDocument();
      expect(screen.getByText('Body copy')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    it.each(DRAWER_POSITIONS)('applies the %s position', async (position) => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters" position={position}>
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      await openDrawer(user);

      expectPosition(position);
    });

    describe('responsive position', () => {
      let viewport: ReturnType<typeof mockViewport>;

      afterEach(() => viewport.restore());

      it('defaults to a bottom sheet on phones and a right panel from 768px up', async () => {
        viewport = mockViewport(375);
        const user = userEvent.setup();

        renderWithProvider(
          <TestDrawer aria-label="Filters">
            <Drawer.Body>Body copy</Drawer.Body>
          </TestDrawer>
        );

        await openDrawer(user);

        expectPosition('bottom');

        viewport.resize(1024);

        expectPosition('right');
      });

      it('applies a plain position at every size', async () => {
        viewport = mockViewport(375);
        const user = userEvent.setup();

        renderWithProvider(
          <TestDrawer aria-label="Filters" position="left">
            <Drawer.Body>Body copy</Drawer.Body>
          </TestDrawer>
        );

        await openDrawer(user);

        expectPosition('left');

        viewport.resize(1200);

        expectPosition('left');
      });

      it('uses the default below the smallest breakpoint key', async () => {
        viewport = mockViewport(375);
        const user = userEvent.setup();

        renderWithProvider(
          <TestDrawer aria-label="Filters" position={{ large: 'left' }}>
            <Drawer.Body>Body copy</Drawer.Body>
          </TestDrawer>
        );

        await openDrawer(user);

        expectPosition('bottom');

        viewport.resize(800);

        expectPosition('right');

        viewport.resize(1200);

        expectPosition('left');
      });
    });

    it('passes className and style through to the panel', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters" className="custom-panel" style={{ maxWidth: 320 }}>
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      const drawer = await openDrawer(user);

      expect(drawer).toHaveClass('custom-panel');
      expect(drawer.style.maxWidth).toBe('320px');
    });

    it('renders into a custom portal root', async () => {
      const user = userEvent.setup();
      const portalRoot = document.createElement('div');
      document.body.append(portalRoot);

      renderWithProvider(
        <TestDrawer aria-label="Filters" portalRoot={portalRoot}>
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      const drawer = await openDrawer(user);

      expect(portalRoot.contains(drawer)).toBe(true);

      portalRoot.remove();
    });

    it('throws when a section is used outside a Drawer', () => {
      expect(() => renderWithProvider(<Drawer.Heading>Orphan</Drawer.Heading>)).toThrow(
        'Drawer components must be used within <Drawer.Root>'
      );
    });
  });

  describe('accessible name', () => {
    it('names the drawer from the heading', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer>
          <Drawer.Heading>Filter calendar</Drawer.Heading>
        </TestDrawer>
      );

      const drawer = await openDrawer(user);

      expect(drawer).toHaveAttribute('aria-modal', 'true');
      expect(drawer).toHaveAccessibleName('Filter calendar');
    });

    it('falls back to aria-label when there is no heading', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      const drawer = await openDrawer(user);

      expect(drawer).toHaveAccessibleName('Filters');
      expect(drawer).not.toHaveAttribute('aria-labelledby');
      expect(drawer).not.toHaveAttribute('aria-describedby');
    });

    it('warns in development when the drawer has no accessible name', async () => {
      const user = userEvent.setup();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      renderWithProvider(
        <TestDrawer>
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      await openDrawer(user);

      await waitFor(() => {
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('accessible name'));
      });

      warn.mockRestore();
    });

    it('does not warn when a heading names the drawer', async () => {
      const user = userEvent.setup();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      renderWithProvider(
        <TestDrawer>
          <Drawer.Heading>Filter calendar</Drawer.Heading>
        </TestDrawer>
      );

      await openDrawer(user);
      await act(() => new Promise((resolve) => setTimeout(resolve, 10)));

      expect(warn).not.toHaveBeenCalled();

      warn.mockRestore();
    });
  });

  describe('dismissal', () => {
    it('closes with the close button', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      await openDrawer(user);
      await user.click(screen.getByRole('button', { name: 'Close' }));

      await expectClosed();
    });

    it('omits the close button when showCloseButton is false', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters" showCloseButton={false}>
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      await openDrawer(user);

      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      await openDrawer(user);
      await user.keyboard('{Escape}');

      await expectClosed();
    });

    it('closes when the overlay is pressed', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      await openDrawer(user);
      await user.click(screen.getByTestId('drawer-overlay'));

      await expectClosed();
    });

    it('stays open on a press inside the panel', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      await openDrawer(user);
      await user.click(screen.getByText('Body copy'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes from a footer control that sets open to false', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters">
          {(close) => (
            <Drawer.Footer>
              <Button onClick={close}>Apply</Button>
            </Drawer.Footer>
          )}
        </TestDrawer>
      );

      await openDrawer(user);
      await user.click(screen.getByText('Apply'));

      await expectClosed();
    });

    it('calls onClose without closing until open changes', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithProvider(
        <Drawer.Root open onClose={onClose} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer.Root>
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
        <TestDrawer aria-label="Filters">
          <Drawer.Body>
            <Button>First action</Button>
          </Drawer.Body>
        </TestDrawer>
      );

      const drawer = await openDrawer(user);

      await waitFor(() => expect(drawer).toHaveFocus());
    });

    it('moves focus to initialFocus on open', async () => {
      const user = userEvent.setup();

      const Harness = () => {
        const inputRef = useRef<HTMLInputElement>(null);

        return (
          <TestDrawer aria-label="Filters" initialFocus={inputRef}>
            <Drawer.Body>
              <Button>Before</Button>
              <input ref={inputRef} aria-label="Search teams" />
            </Drawer.Body>
          </TestDrawer>
        );
      };

      renderWithProvider(<Harness />);

      await openDrawer(user);

      await waitFor(() => expect(screen.getByLabelText('Search teams')).toHaveFocus());
    });

    it('keeps Tab and Shift+Tab inside the drawer', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <>
          <Button>Outside</Button>
          <TestDrawer aria-label="Filters">
            <Drawer.Footer>
              <Button>Clear all</Button>
              <Button>Apply</Button>
            </Drawer.Footer>
          </TestDrawer>
        </>
      );

      const drawer = await openDrawer(user);
      await waitFor(() => expect(drawer).toHaveFocus());

      const close = screen.getByRole('button', { name: 'Close' });
      const clearAll = screen.getByText('Clear all').closest('button');
      const apply = screen.getByText('Apply').closest('button');

      await user.tab();
      expect(close).toHaveFocus();

      await user.tab();
      expect(clearAll).toHaveFocus();

      await user.tab();
      expect(apply).toHaveFocus();

      // Focus guards redirect asynchronously, hence the waits.
      await user.tab();
      await waitFor(() => expect(close).toHaveFocus());

      await user.tab({ shift: true });
      await waitFor(() => expect(apply).toHaveFocus());
    });

    it('returns focus to the opening control on close', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TestDrawer aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </TestDrawer>
      );

      await openDrawer(user);
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
        <Drawer.Root open onClose={() => {}} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer.Root>
      );

      const panel = await waitForOpen('dialog');

      expect(panel).not.toHaveAttribute('aria-describedby');
    });

    it('renders an alertdialog described by its body', async () => {
      renderWithProvider(
        <Drawer.Root open onClose={() => {}} role="alertdialog" aria-label="Delete game">
          <Drawer.Body>This can’t be undone.</Drawer.Body>
        </Drawer.Root>
      );

      const panel = await waitForOpen('alertdialog');

      expect(panel).toHaveAccessibleDescription('This can’t be undone.');
    });

    it('describes a dialog with describeWithBody', async () => {
      renderWithProvider(
        <Drawer.Root open onClose={() => {}} aria-label="Filters" describeWithBody>
          <Drawer.Body>Short message</Drawer.Body>
        </Drawer.Root>
      );

      const panel = await waitForOpen('dialog');

      expect(panel).toHaveAccessibleDescription('Short message');
    });

    it('drops the alertdialog description when describeWithBody is false', async () => {
      renderWithProvider(
        <Drawer.Root
          open
          onClose={() => {}}
          role="alertdialog"
          aria-label="Delete game"
          describeWithBody={false}
        >
          <Drawer.Body>This can’t be undone.</Drawer.Body>
        </Drawer.Root>
      );

      const panel = await waitForOpen('alertdialog');

      expect(panel).not.toHaveAttribute('aria-describedby');
    });

    it('omits the description when there is no body', async () => {
      renderWithProvider(
        <Drawer.Root open onClose={() => {}} role="alertdialog" aria-label="Delete game">
          <Drawer.Footer>
            <Button>Delete</Button>
          </Drawer.Footer>
        </Drawer.Root>
      );

      const panel = await waitForOpen('alertdialog');

      expect(panel).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('close reasons', () => {
    const renderOpen = (onClose = vi.fn()) => {
      renderWithProvider(
        <Drawer.Root open onClose={onClose} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer.Root>
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

      await user.click(screen.getByTestId('drawer-overlay'));

      expect(onClose).toHaveBeenCalledWith('overlayPress');
    });

    it('lets consumers ignore overlay presses', async () => {
      const user = userEvent.setup();

      const Harness = () => {
        const [open, setOpen] = useState(true);

        return (
          <Drawer.Root
            open={open}
            onClose={(reason) => {
              if (reason !== 'overlayPress') setOpen(false);
            }}
            aria-label="Filters"
          >
            <Drawer.Body>Unsaved input</Drawer.Body>
          </Drawer.Root>
        );
      };

      renderWithProvider(<Harness />);

      await user.click(screen.getByTestId('drawer-overlay'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      await expectClosed();
    });
  });

  it('labels the close button with closeLabel', () => {
    renderWithProvider(
      <Drawer.Root open onClose={() => {}} aria-label="Filters" closeLabel="Cerrar">
        <Drawer.Body>Body copy</Drawer.Body>
      </Drawer.Root>
    );

    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });
});
