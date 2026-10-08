import { useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithProvider } from '@/test-utils/render';
import { mockViewport } from '@/test-utils/viewport';
import * as Menu from './Menu';
import type { MenuAnchorProps, MenuCloseReason, MenuLabelProps, MenuProps } from './Menu.types';
import type * as MenuOrigin from './menuOrigin';

// Records the anchor origin of each offset function Floating UI runs. The wrappers share one
// source, as the real offset functions do, which Floating UI compares as equal.
const offsetCalls = vi.hoisted((): string[] => []);
vi.mock('./menuOrigin', async (importOriginal) => {
  const actual = await importOriginal<typeof MenuOrigin>();
  return {
    ...actual,
    getMenuOriginPosition: (...args: Parameters<typeof actual.getMenuOriginPosition>) => {
      const position = actual.getMenuOriginPosition(...args);
      const { vertical, horizontal } = args[0];
      const offset = position.offset;
      if (typeof offset !== 'function') return position;
      return {
        ...position,
        offset: (state: Parameters<typeof offset>[0]) => {
          offsetCalls.push(`${vertical} ${horizontal}`);
          return offset(state);
        },
      };
    },
  };
});

type HarnessProps = Partial<
  Omit<MenuProps, keyof MenuAnchorProps | 'open' | keyof MenuLabelProps>
> & {
  onEdit?: () => void;
  onDelete?: () => void;
};

const Harness = ({ onEdit, onDelete, onClose, children, ...menuProps }: HarnessProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <button type="button" onClick={(event) => setAnchorEl(event.currentTarget)}>
        Actions
      </button>
      <button type="button">Outside</button>
      <Menu.Root
        aria-label="Row actions"
        {...menuProps}
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={(reason) => {
          onClose?.(reason);
          setAnchorEl(null);
        }}
      >
        {children ?? (
          <>
            <Menu.Item onClick={onEdit}>
              <Menu.ItemIcon>
                <svg />
              </Menu.ItemIcon>
              Edit
            </Menu.Item>
            <Menu.Item disabled>Archive</Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={onDelete}>Delete</Menu.Item>
          </>
        )}
      </Menu.Root>
    </>
  );
};

const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Actions' }));
  return screen.findByRole('menu', { name: 'Row actions' });
};

describe('Menu', () => {
  it('renders nothing when closed', () => {
    renderWithProvider(<Harness />);

    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('renders a menu with menuitems and a separator when open', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);

    await openMenu(user);

    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('applies consumer classes to the surface, items, and dividers', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <Harness className="custom-menu">
        <Menu.Item className="custom-item">Edit</Menu.Item>
        <Menu.Divider className="custom-divider" />
      </Harness>
    );

    const menu = await openMenu(user);

    expect(menu).toHaveClass('custom-menu');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveClass('custom-item');
    expect(screen.getByRole('separator')).toHaveClass('custom-divider');
  });

  it('focuses the first enabled item on open', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);

    await openMenu(user);

    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
  });

  it('calls onClick and then closes when an item is selected', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onClose = vi.fn();
    renderWithProvider(<Harness onEdit={onEdit} onClose={onClose} />);

    await openMenu(user);
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('itemSelect');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('stays open when an item sets closeOnSelect to false', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProvider(
      <Harness>
        <Menu.Item onClick={onClick} closeOnSelect={false}>
          Stay
        </Menu.Item>
      </Harness>
    );

    await openMenu(user);
    await user.click(screen.getByRole('menuitem', { name: 'Stay' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('does not fire or close for a disabled item', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClose = vi.fn();
    renderWithProvider(
      <Harness onClose={onClose}>
        <Menu.Item disabled onClick={onClick}>
          Archive
        </Menu.Item>
      </Harness>
    );

    await openMenu(user);
    const item = screen.getByRole('menuitem', { name: 'Archive' });
    await user.click(item);

    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(onClick).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('moves focus with arrow keys, Home, and End, skipping disabled items', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);

    await openMenu(user);
    const edit = screen.getByRole('menuitem', { name: 'Edit' });
    const del = screen.getByRole('menuitem', { name: 'Delete' });
    await waitFor(() => expect(edit).toHaveFocus());

    await user.keyboard('{ArrowDown}');
    expect(del).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(edit).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(del).toHaveFocus();

    await user.keyboard('{Home}');
    expect(edit).toHaveFocus();

    await user.keyboard('{End}');
    expect(del).toHaveFocus();
  });

  it('closes on Escape and returns focus to the anchor', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProvider(<Harness onClose={onClose} />);

    await openMenu(user);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('escapeKey');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus());
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProvider(<Harness onClose={onClose} />);

    await openMenu(user);
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(onClose).toHaveBeenCalledWith('outsidePress');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('closes when focus leaves the menu with Tab', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProvider(<Harness onClose={onClose} />);

    await openMenu(user);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
    await user.tab();

    await waitFor(() => expect(onClose).toHaveBeenCalledWith('focusOut'));
  });

  it('renders a link item when href is set', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <Harness>
        <Menu.Item href="https://varsity.startribune.com/" target="_blank" rel="noreferrer">
          Strib Varsity
          <Menu.ItemIcon position="end">
            <svg />
          </Menu.ItemIcon>
        </Menu.Item>
      </Harness>
    );

    await openMenu(user);
    const link = screen.getByRole('menuitem', { name: 'Strib Varsity' });

    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://varsity.startribune.com/');
  });

  it('hides the arrow when hideArrow is set', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness hideArrow />);

    const menu = await openMenu(user);

    expect(menu.querySelector(':scope > svg')).toBeNull();
  });

  it('resolves responsive origins at the current breakpoint', async () => {
    const viewport = mockViewport(375);
    const user = userEvent.setup();
    // Top-left to top-left covers the anchor and hides the arrow. Bottom-left opens below it.
    renderWithProvider(
      <Harness
        anchorOrigin={{
          small: { vertical: 'top', horizontal: 'left' },
          large: { vertical: 'bottom', horizontal: 'left' },
        }}
      />
    );

    const menu = await openMenu(user);
    expect(menu.querySelector(':scope > svg')).toBeNull();

    viewport.resize(1160);
    await waitFor(() => expect(menu.querySelector(':scope > svg')).not.toBeNull());
    viewport.restore();
  });

  it('positions with the new origins when they change while open', async () => {
    const user = userEvent.setup();
    const above = {
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
      transformOrigin: { vertical: 'bottom', horizontal: 'center' },
    } as const;
    const beside = {
      anchorOrigin: { vertical: 'center', horizontal: 'right' },
      transformOrigin: { vertical: 'center', horizontal: 'left' },
    } as const;
    const { rerender } = renderWithProvider(<Harness {...above} />);

    await openMenu(user);
    await waitFor(() => expect(offsetCalls.at(-1)).toBe('top center'));
    rerender(<Harness {...beside} />);

    await waitFor(() => expect(offsetCalls.at(-1)).toBe('center right'));
  });

  it('renders in a portal by default', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);

    const menu = await openMenu(user);

    expect(menu.closest('[data-floating-ui-portal]')).not.toBeNull();
  });

  it('renders into portalRoot when set', async () => {
    const user = userEvent.setup();
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderWithProvider(<Harness portalRoot={container} />);

    const menu = await openMenu(user);

    expect(container.contains(menu)).toBe(true);
    container.remove();
  });

  it('locks page scroll while open and restores it on close', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);

    await openMenu(user);
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(document.body.style.overflow).toBe('');
  });

  it('puts a default test id on the surface and passes test ids to every part', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <Harness>
        <Menu.Item dataTestId="edit-item">
          <Menu.ItemIcon dataTestId="edit-icon">
            <svg />
          </Menu.ItemIcon>
          Edit
        </Menu.Item>
        <Menu.Divider dataTestId="divider" />
        <Menu.Item href="/profile" dataTestId="profile-link">
          Profile
        </Menu.Item>
      </Harness>
    );

    const menu = await openMenu(user);

    expect(menu).toHaveAttribute('data-testid', 'menu');
    expect(screen.getByTestId('edit-item')).toHaveAccessibleName('Edit');
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByTestId('divider')).toHaveAttribute('role', 'separator');
    expect(screen.getByTestId('profile-link').tagName).toBe('A');
  });

  describe('with a trigger', () => {
    const TriggerHarness = ({ onClose }: { onClose?: (reason: MenuCloseReason) => void }) => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <Menu.Root
            trigger={<button type="button">Account</button>}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={(reason) => {
              onClose?.(reason);
              setOpen(false);
            }}
            aria-label="Account menu"
          >
            <Menu.Item>Profile</Menu.Item>
          </Menu.Root>
          <button type="button">Outside</button>
        </>
      );
    };

    it('renders the trigger with menu button attributes', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TriggerHarness />);
      const trigger = screen.getByRole('button', { name: 'Account' });

      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      const menu = await screen.findByRole('menu', { name: 'Account menu' });

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('aria-controls', menu.id);
    });

    it('closes with triggerClick when the trigger is clicked again', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderWithProvider(<TriggerHarness onClose={onClose} />);
      const trigger = screen.getByRole('button', { name: 'Account' });

      await user.click(trigger);
      await screen.findByRole('menu', { name: 'Account menu' });
      await user.click(trigger);

      expect(onClose).toHaveBeenCalledWith('triggerClick');
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });

    it('closes on Escape and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderWithProvider(<TriggerHarness onClose={onClose} />);
      const trigger = screen.getByRole('button', { name: 'Account' });

      await user.click(trigger);
      await screen.findByRole('menu', { name: 'Account menu' });
      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalledWith('escapeKey');
      await waitFor(() => expect(trigger).toHaveFocus());
    });
  });

  it('names each part with its namespace for React DevTools', () => {
    expect(Menu.Root.displayName).toBe('Menu.Root');
    expect(Menu.Item.displayName).toBe('Menu.Item');
    expect(Menu.ItemIcon.displayName).toBe('Menu.ItemIcon');
    expect(Menu.Divider.displayName).toBe('Menu.Divider');
  });

  it('exports its parts as a namespace', () => {
    expect(Object.keys(Menu).sort()).toEqual(['Divider', 'Item', 'ItemIcon', 'Root']);
  });
});
