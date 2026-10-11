import { useState, type ComponentProps } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { onTestFinished, vi } from 'vitest';
import { renderWithProvider } from '@/test-utils/render';
import { mockViewport } from '@/test-utils/viewport';
import * as Menu from './Menu';
import type { MenuLabelProps, MenuProps } from './Menu.types';

type HarnessProps = Partial<
  Omit<MenuProps, 'trigger' | 'onOpen' | 'open' | keyof MenuLabelProps>
> & {
  onEdit?: () => void;
  onDelete?: () => void;
};

const Harness = ({ onEdit, onDelete, onClose, children, ...menuProps }: HarnessProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Menu.Root
        aria-label="Row actions"
        {...menuProps}
        trigger={<button type="button">Actions</button>}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={(reason) => {
          onClose?.(reason);
          setOpen(false);
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
      <button type="button">Outside</button>
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

  it.each([
    ['Down Arrow', '{ArrowDown}', 'Edit'],
    ['Up Arrow', '{ArrowUp}', 'Delete'],
  ])('opens from the trigger with %s and focuses %s', async (_, key, itemName) => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard(key);

    await waitFor(() => expect(screen.getByRole('menuitem', { name: itemName })).toHaveFocus());
  });

  it('focuses the first item on a click open after an Up Arrow open', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());

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

  it('closes on Escape and returns focus to the trigger', async () => {
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

  describe('with a router link as the item', () => {
    const navigate = vi.fn();

    // Mirrors next/link: runs onClick, then navigates on the client unless the click was prevented.
    const MockNextLink = ({
      href,
      prefetch,
      onClick,
      ...rest
    }: ComponentProps<'a'> & { href: string; prefetch?: boolean }) => (
      <a
        {...rest}
        href={href}
        data-prefetch={String(prefetch)}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          navigate(href);
        }}
      />
    );

    beforeEach(() => navigate.mockClear());

    it('renders the link with menuitem semantics and navigates, then closes', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderWithProvider(
        <Harness onClose={onClose}>
          <Menu.Item as={MockNextLink} href="/profile" prefetch={false}>
            Profile
          </Menu.Item>
        </Harness>
      );

      await openMenu(user);
      const link = screen.getByRole('menuitem', { name: 'Profile' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/profile');
      expect(link).toHaveAttribute('data-prefetch', 'false');
      await waitFor(() => expect(link).toHaveFocus());

      await user.click(link);

      expect(navigate).toHaveBeenCalledWith('/profile');
      expect(onClose).toHaveBeenCalledWith('itemSelect');
    });

    it('does not navigate when disabled', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderWithProvider(
        <Harness onClose={onClose}>
          <Menu.Item as={MockNextLink} href="/profile" disabled>
            Profile
          </Menu.Item>
        </Harness>
      );

      await openMenu(user);
      await user.click(screen.getByRole('menuitem', { name: 'Profile' }));

      expect(navigate).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it('hides the arrow when hideArrow is set', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness hideArrow />);

    const menu = await openMenu(user);

    expect(menu.querySelector(':scope > svg')).toBeNull();
  });

  it('opens on the side set by placement', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness placement="top-end" />);

    const menu = await openMenu(user);

    // FloatingArrow pins itself to the menu edge that faces the anchor.
    expect(menu.querySelector<SVGElement>(':scope > svg')?.style.top).toBe('100%');
  });

  it('resolves a responsive placement at the current breakpoint', async () => {
    const viewport = mockViewport(375);
    onTestFinished(viewport.restore);
    const user = userEvent.setup();
    renderWithProvider(<Harness placement={{ small: 'top', large: 'bottom' }} />);

    const menu = await openMenu(user);
    const arrow = () => menu.querySelector<SVGElement>(':scope > svg');
    expect(arrow()?.style.top).toBe('100%');

    viewport.resize(1160);
    await waitFor(() => expect(arrow()?.style.bottom).toBe('100%'));
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
    onTestFinished(() => container.remove());
    renderWithProvider(<Harness portalRoot={container} />);

    const menu = await openMenu(user);

    expect(container.contains(menu)).toBe(true);
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

  it('renders the trigger with menu button attributes', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Actions' });

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const menu = await openMenu(user);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
  });

  const divTrigger = (
    <div role="button" tabIndex={0}>
      Actions
    </div>
  );
  const buttonTrigger = <button type="button">Actions</button>;

  it.each([
    ['div role="button"', divTrigger, 'Enter', '{Enter}'],
    ['div role="button"', divTrigger, 'Space', ' '],
    ['native button', buttonTrigger, 'Enter', '{Enter}'],
    ['native button', buttonTrigger, 'Space', ' '],
  ])('opens once from a %s trigger with %s', async (_, trigger, _keyName, key) => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    renderWithProvider(
      <Menu.Root
        aria-label="Row actions"
        trigger={trigger}
        open={false}
        onOpen={onOpen}
        onClose={vi.fn()}
      >
        <Menu.Item>Edit</Menu.Item>
      </Menu.Root>
    );

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard(key);

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('closes with triggerClick when the trigger is clicked again', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProvider(<Harness onClose={onClose} />);

    await openMenu(user);
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    // The trigger closes it, and the surface doesn't also report an outside press.
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('triggerClick');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it.each([
    ['Down Arrow', '{ArrowDown}'],
    ['Up Arrow', '{ArrowUp}'],
  ])('opens from a div role="button" trigger with %s', async (_, key) => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    renderWithProvider(
      <Menu.Root
        aria-label="Row actions"
        trigger={divTrigger}
        open={false}
        onOpen={onOpen}
        onClose={vi.fn()}
      >
        <Menu.Item>Edit</Menu.Item>
      </Menu.Root>
    );

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard(key);

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('runs the trigger element handlers along with its own', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    const onOpen = vi.fn();

    renderWithProvider(
      <Menu.Root
        aria-label="Row actions"
        trigger={
          <button type="button" onClick={onClick} onKeyDown={onKeyDown}>
            Actions
          </button>
        }
        open={false}
        onOpen={onOpen}
        onClose={vi.fn()}
      >
        <Menu.Item>Edit</Menu.Item>
      </Menu.Root>
    );

    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(1);

    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  describe('item composition', () => {
    it('navigates items in document order through wrappers and conditional items', async () => {
      const user = userEvent.setup();

      const Composed = () => {
        const [showExtra, setShowExtra] = useState(false);
        return (
          <Harness>
            <div>
              <Menu.Item>First</Menu.Item>
              {showExtra && <Menu.Item>Inserted</Menu.Item>}
            </div>
            <Menu.Divider />
            <div>
              <Menu.Item closeOnSelect={false} onClick={() => setShowExtra(true)}>
                Show more
              </Menu.Item>
            </div>
          </Harness>
        );
      };
      renderWithProvider(<Composed />);

      await openMenu(user);
      const first = screen.getByRole('menuitem', { name: 'First' });
      const showMore = screen.getByRole('menuitem', { name: 'Show more' });
      await waitFor(() => expect(first).toHaveFocus());

      await user.keyboard('{ArrowDown}');
      expect(showMore).toHaveFocus();

      await user.keyboard('{Enter}');
      const inserted = await screen.findByRole('menuitem', { name: 'Inserted' });

      await user.keyboard('{Home}');
      expect(first).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(inserted).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(showMore).toHaveFocus();
    });

    it('skips items hidden with CSS', async () => {
      const user = userEvent.setup();
      const visible = (element: Element) => element.textContent !== 'Hidden';
      const original = HTMLElement.prototype.checkVisibility;
      HTMLElement.prototype.checkVisibility = function (this: HTMLElement) {
        return visible(this);
      };
      onTestFinished(() => {
        HTMLElement.prototype.checkVisibility = original;
      });

      renderWithProvider(
        <Harness>
          <Menu.Item>First</Menu.Item>
          <Menu.Item>Hidden</Menu.Item>
          <Menu.Item>Last</Menu.Item>
        </Harness>
      );

      await openMenu(user);
      await waitFor(() => expect(screen.getByRole('menuitem', { name: 'First' })).toHaveFocus());

      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Last' })).toHaveFocus();
    });

    it('navigates to a router link item and selects it with Enter', async () => {
      const user = userEvent.setup();
      const navigate = vi.fn();
      const onClose = vi.fn();
      const RouterLink = ({ href, onClick, ...rest }: ComponentProps<'a'> & { href: string }) => (
        <a
          {...rest}
          href={href}
          onClick={(event) => {
            onClick?.(event);
            event.preventDefault();
            navigate(href);
          }}
        />
      );

      renderWithProvider(
        <Harness onClose={onClose}>
          <Menu.Item>Edit</Menu.Item>
          <Menu.Item disabled>Archive</Menu.Item>
          <Menu.Item as={RouterLink} href="/profile">
            Profile
          </Menu.Item>
        </Harness>
      );

      await openMenu(user);
      await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());

      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(navigate).toHaveBeenCalledWith('/profile');
      expect(onClose).toHaveBeenCalledWith('itemSelect');
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
