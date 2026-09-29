import { useRef, useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer } from './Drawer';
import { useDrawerClose } from './DrawerContext';
import { DRAWER_POSITIONS } from './Drawer.types';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '@/test-utils/render';

const openDrawer = async (user: ReturnType<typeof userEvent.setup>, name = 'Open') => {
  await user.click(screen.getByText(name));

  return waitFor(() => screen.getByRole('dialog'));
};

const expectClosed = () =>
  waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

describe('Drawer', () => {
  describe('rendering', () => {
    it('renders the trigger without the drawer', () => {
      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>Content</Drawer.Body>
        </Drawer>
      );

      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens when the trigger is clicked', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>Drawer content</Drawer.Body>
        </Drawer>
      );

      await openDrawer(user);

      expect(screen.getByText('Drawer content')).toBeInTheDocument();
    });

    it('wraps a non-element trigger in a focusable button', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger="Open" aria-label="Filters">
          <Drawer.Body>Drawer content</Drawer.Body>
        </Drawer>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });

      expect(trigger).toHaveAttribute('tabindex', '0');

      await openDrawer(user);

      expect(screen.getByText('Drawer content')).toBeInTheDocument();
    });

    it('renders the composed sections', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>}>
          <Drawer.Heading>Filter calendar</Drawer.Heading>
          <Drawer.Description>Narrow the games shown.</Drawer.Description>
          <Drawer.Body>Body copy</Drawer.Body>
          <Drawer.Footer>
            <Button>Apply</Button>
          </Drawer.Footer>
        </Drawer>
      );

      await openDrawer(user);

      expect(
        screen.getByRole('heading', { level: 2, name: 'Filter calendar' })
      ).toBeInTheDocument();
      expect(screen.getByText('Narrow the games shown.')).toBeInTheDocument();
      expect(screen.getByText('Body copy')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    it.each(DRAWER_POSITIONS)('applies the %s position', async (position) => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters" position={position}>
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      const drawer = await openDrawer(user);

      expect(drawer).toHaveAttribute('data-position', position);
      expect(screen.getByTestId('drawer-overlay').className).toMatch(
        new RegExp(`position-${position}`)
      );
    });

    it('defaults to the right edge', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      const drawer = await openDrawer(user);

      expect(drawer).toHaveAttribute('data-position', 'right');
    });

    it('uses position on mobile unless mobilePosition is set', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <>
          <Drawer
            trigger={<Button>Open side</Button>}
            aria-label="Side"
            position="left"
            dataTestId="side"
          >
            <Drawer.Body>Body copy</Drawer.Body>
          </Drawer>
          <Drawer
            trigger={<Button>Open sheet</Button>}
            aria-label="Sheet"
            position="right"
            mobilePosition="bottom"
            dataTestId="sheet"
          >
            <Drawer.Body>Body copy</Drawer.Body>
          </Drawer>
        </>
      );

      await user.click(screen.getByText('Open side'));
      await waitFor(() => screen.getByTestId('side'));

      expect(screen.getByTestId('side')).toHaveAttribute('data-mobile-position', 'left');

      await user.keyboard('{Escape}');
      await expectClosed();

      await user.click(screen.getByText('Open sheet'));
      await waitFor(() => screen.getByTestId('sheet'));

      expect(screen.getByTestId('sheet')).toHaveAttribute('data-mobile-position', 'bottom');
      expect(screen.getByTestId('sheet-overlay').className).toMatch(/mobile-position-bottom/);
    });

    it('passes className, style, overlayClassName and contentClassName through', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer
          trigger={<Button>Open</Button>}
          aria-label="Filters"
          className="custom-panel"
          style={{ maxWidth: 320 }}
          overlayClassName="custom-overlay"
          contentClassName="custom-content"
        >
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      const drawer = await openDrawer(user);

      expect(drawer).toHaveClass('custom-panel');
      expect(drawer.style.maxWidth).toBe('320px');
      expect(screen.getByTestId('drawer-overlay')).toHaveClass('custom-overlay');
      expect(screen.getByText('Body copy').parentElement).toHaveClass('custom-content');
    });

    it('renders into a custom portal root', async () => {
      const user = userEvent.setup();
      const portalRoot = document.createElement('div');
      document.body.append(portalRoot);

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters" portalRoot={portalRoot}>
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      const drawer = await openDrawer(user);

      expect(portalRoot.contains(drawer)).toBe(true);

      portalRoot.remove();
    });

    it('throws when a section is used outside a Drawer', () => {
      expect(() => renderWithProvider(<Drawer.Heading>Orphan</Drawer.Heading>)).toThrow(
        'Drawer components must be used within <Drawer>'
      );
    });
  });

  describe('accessible name and description', () => {
    it('names the drawer from the heading and description', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>}>
          <Drawer.Heading>Filter calendar</Drawer.Heading>
          <Drawer.Description>Narrow the games shown.</Drawer.Description>
        </Drawer>
      );

      const drawer = await openDrawer(user);

      expect(drawer).toHaveAttribute('aria-modal', 'true');
      expect(drawer).toHaveAccessibleName('Filter calendar');
      expect(drawer).toHaveAccessibleDescription('Narrow the games shown.');
    });

    it('falls back to aria-label when there is no heading', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
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
        <Drawer trigger={<Button>Open</Button>}>
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
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
        <Drawer trigger={<Button>Open</Button>}>
          <Drawer.Heading>Filter calendar</Drawer.Heading>
        </Drawer>
      );

      await openDrawer(user);
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(warn).not.toHaveBeenCalled();

      warn.mockRestore();
    });

    it('uses closeButtonLabel as the close button name', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer
          trigger={<Button>Open</Button>}
          aria-label="Filters"
          closeButtonLabel="Close filters"
        >
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      await openDrawer(user);

      expect(screen.getByRole('button', { name: 'Close filters' })).toBeInTheDocument();
    });
  });

  describe('dismissal', () => {
    it('closes with the close button', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      await openDrawer(user);
      await user.click(screen.getByRole('button', { name: 'Close' }));

      await expectClosed();
    });

    it('omits the close button when showCloseButton is false', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters" showCloseButton={false}>
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      await openDrawer(user);

      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      await openDrawer(user);
      await user.keyboard('{Escape}');

      await expectClosed();
    });

    it('closes when the overlay is pressed', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      await openDrawer(user);
      await user.click(screen.getByTestId('drawer-overlay'));

      await expectClosed();
    });

    it('stays open on a press inside the panel', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      await openDrawer(user);
      await user.click(screen.getByText('Body copy'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('ignores Escape and overlay presses when isDismissable is false', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters" isDismissable={false}>
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      await openDrawer(user);
      await user.keyboard('{Escape}');
      await user.click(screen.getByTestId('drawer-overlay'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Close' }));

      await expectClosed();
    });

    it('closes from a consumer control via useDrawerClose', async () => {
      const user = userEvent.setup();

      const ApplyButton = () => {
        const close = useDrawerClose();

        return <Button onClick={close}>Apply</Button>;
      };

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Footer>
            <ApplyButton />
          </Drawer.Footer>
        </Drawer>
      );

      await openDrawer(user);
      await user.click(screen.getByText('Apply'));

      await expectClosed();
    });

    it('reports open changes without self-closing when controlled', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      renderWithProvider(
        <Drawer open onOpenChange={onOpenChange} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('focus management', () => {
    it('moves focus to the panel on open', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>
            <Button>First action</Button>
          </Drawer.Body>
        </Drawer>
      );

      const drawer = await openDrawer(user);

      await waitFor(() => expect(drawer).toHaveFocus());
    });

    it('moves focus to initialFocus on open', async () => {
      const user = userEvent.setup();

      const Harness = () => {
        const inputRef = useRef<HTMLInputElement>(null);

        return (
          <Drawer trigger={<Button>Open</Button>} aria-label="Filters" initialFocus={inputRef}>
            <Drawer.Body>
              <Button>Before</Button>
              <input ref={inputRef} aria-label="Search teams" />
            </Drawer.Body>
          </Drawer>
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
          <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
            <Drawer.Footer>
              <Button>Clear all</Button>
              <Button>Apply</Button>
            </Drawer.Footer>
          </Drawer>
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

    it('returns focus to the trigger on close', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <Drawer trigger={<Button>Open</Button>} aria-label="Filters">
          <Drawer.Body>Body copy</Drawer.Body>
        </Drawer>
      );

      await openDrawer(user);
      await user.keyboard('{Escape}');
      await expectClosed();

      await waitFor(() => expect(screen.getByText('Open').closest('button')).toHaveFocus());
    });

    it('returns focus to the opening control when controlled without a trigger', async () => {
      const user = userEvent.setup();

      const Harness = () => {
        const [open, setOpen] = useState(false);

        return (
          <>
            <Button onClick={() => setOpen(true)}>Filters</Button>
            <Drawer open={open} onOpenChange={setOpen} aria-label="Filters">
              <Drawer.Body>Body copy</Drawer.Body>
            </Drawer>
          </>
        );
      };

      renderWithProvider(<Harness />);

      await openDrawer(user, 'Filters');
      await user.keyboard('{Escape}');
      await expectClosed();

      await waitFor(() => expect(screen.getByText('Filters').closest('button')).toHaveFocus());
    });
  });
});
