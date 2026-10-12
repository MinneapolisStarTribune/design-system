import { useState, type ComponentProps } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { onTestFinished, vi } from 'vitest';
import { Button } from '@/components/Button/web/Button';
import * as Dialog from '@/components/Dialog/Dialog';
import { renderWithProvider } from '@/test-utils/render';
import { mockViewport } from '@/test-utils/viewport';
import * as Menu from './Menu';
import type { MenuLabelProps, MenuProps } from './Menu.types';

type User = ReturnType<typeof userEvent.setup>;

type HarnessProps = Partial<Omit<MenuProps, 'open' | 'onOpenChange' | keyof MenuLabelProps>> & {
  onOpenChange?: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const Harness = ({
  trigger = <button type="button">Actions</button>,
  onOpenChange,
  onEdit,
  onDelete,
  children,
  ...menuProps
}: HarnessProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Menu.Root
        aria-label="Row actions"
        {...menuProps}
        trigger={trigger}
        open={open}
        onOpenChange={(isOpen) => {
          onOpenChange?.(isOpen);
          setOpen(isOpen);
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

/** Renders the menu and returns a user for driving it. */
const renderMenu = (props: HarnessProps = {}) => {
  const user = userEvent.setup();
  renderWithProvider(<Harness {...props} />);
  return user;
};

const item = (name: string) => screen.getByRole('menuitem', { name });
const trigger = () => screen.getByRole('button', { name: 'Actions' });
const waitForClosed = () => waitFor(() => expect(screen.queryByRole('menu')).toBeNull());

const openMenu = async (user: User) => {
  await user.click(trigger());
  return screen.findByRole('menu', { name: 'Row actions' });
};

/** Opens the menu and waits for its first item to take focus. */
const openMenuWithFocus = async (user: User, firstItem = 'Edit') => {
  const menu = await openMenu(user);
  await waitFor(() => expect(item(firstItem)).toHaveFocus());
  return menu;
};

describe('Menu', () => {
  it('applies consumer classes to the surface, items, and dividers', async () => {
    const user = renderMenu({
      className: 'custom-menu',
      children: (
        <>
          <Menu.Item className="custom-item">Edit</Menu.Item>
          <Menu.Divider className="custom-divider" />
        </>
      ),
    });

    const menu = await openMenu(user);

    expect(menu).toHaveClass('custom-menu');
    expect(item('Edit')).toHaveClass('custom-item');
    expect(screen.getByRole('separator')).toHaveClass('custom-divider');
  });

  describe('trigger', () => {
    it('renders the trigger with menu button attributes', async () => {
      const user = renderMenu();

      expect(trigger()).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');

      const menu = await openMenu(user);

      expect(trigger()).toHaveAttribute('aria-expanded', 'true');
      expect(trigger()).toHaveAttribute('aria-controls', menu.id);
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
      ['div role="button"', divTrigger, 'Down Arrow', '{ArrowDown}'],
      ['div role="button"', divTrigger, 'Up Arrow', '{ArrowUp}'],
      ['native button', buttonTrigger, 'Enter', '{Enter}'],
      ['native button', buttonTrigger, 'Space', ' '],
    ])('opens once from a %s trigger with %s', async (_, triggerElement, _keyName, key) => {
      const onOpenChange = vi.fn();
      const user = renderMenu({ trigger: triggerElement, onOpenChange });

      trigger().focus();
      await user.keyboard(key);

      expect(onOpenChange.mock.calls).toEqual([[true]]);
    });

    it.each([
      ['Down Arrow', '{ArrowDown}', 'Edit'],
      ['Up Arrow', '{ArrowUp}', 'Delete'],
    ])('opens with %s and focuses %s', async (_, key, itemName) => {
      const user = renderMenu();

      trigger().focus();
      await user.keyboard(key);

      await waitFor(() => expect(item(itemName)).toHaveFocus());
    });

    it('focuses the first item on a click open after an Up Arrow open', async () => {
      const user = renderMenu();

      trigger().focus();
      await user.keyboard('{ArrowUp}');
      await waitFor(() => expect(item('Delete')).toHaveFocus());
      await user.keyboard('{Escape}');
      await waitForClosed();

      await openMenuWithFocus(user);
    });

    it('runs the trigger element handlers along with its own', async () => {
      const onClick = vi.fn();
      const onKeyDown = vi.fn();
      const onOpenChange = vi.fn();
      const user = renderMenu({
        trigger: (
          <button type="button" onClick={onClick} onKeyDown={onKeyDown}>
            Actions
          </button>
        ),
        onOpenChange,
      });

      await openMenuWithFocus(user);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onOpenChange.mock.calls).toEqual([[true]]);

      await user.keyboard('{Escape}');
      await waitFor(() => expect(trigger()).toHaveFocus());
      await user.keyboard('{ArrowDown}');
      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(onOpenChange.mock.calls).toEqual([[true], [false], [true]]);
    });

    it('closes when the trigger is clicked again', async () => {
      const onOpenChange = vi.fn();
      const user = renderMenu({ onOpenChange });

      await openMenu(user);
      await user.click(trigger());

      // The trigger closes it, and the surface doesn't also report an outside press.
      expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
      await waitForClosed();
    });
  });

  describe('uncontrolled', () => {
    const renderUncontrolled = (onOpenChange?: (open: boolean) => void) => {
      const user = userEvent.setup();
      renderWithProvider(
        <Menu.Root
          aria-label="Row actions"
          trigger={<button type="button">Actions</button>}
          onOpenChange={onOpenChange}
        >
          <Menu.Item>Edit</Menu.Item>
          <Menu.Item>Delete</Menu.Item>
        </Menu.Root>
      );
      return user;
    };

    it('opens from the trigger and closes on item select without open state', async () => {
      const user = renderUncontrolled();

      await openMenuWithFocus(user);
      expect(trigger()).toHaveAttribute('aria-expanded', 'true');

      await user.click(item('Edit'));
      await waitForClosed();
      expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    });

    it('reports each open and close to onOpenChange', async () => {
      const onOpenChange = vi.fn();
      const user = renderUncontrolled(onOpenChange);

      await openMenu(user);
      await user.keyboard('{Escape}');
      await waitForClosed();

      expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    });
  });

  describe('items', () => {
    it('calls onClick and then closes when an item is selected', async () => {
      const onEdit = vi.fn();
      const onOpenChange = vi.fn();
      const user = renderMenu({ onEdit, onOpenChange });

      await openMenu(user);
      await user.click(item('Edit'));

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
      await waitForClosed();
    });

    it('moves focus into a dialog opened from an item, then back to the trigger', async () => {
      const RowWithDelete = () => {
        const [deleteOpen, setDeleteOpen] = useState(false);
        return (
          <>
            <Harness>
              <Menu.Item onClick={() => setDeleteOpen(true)}>Delete</Menu.Item>
            </Harness>
            <Dialog.Root open={deleteOpen} onClose={() => setDeleteOpen(false)}>
              <Dialog.Title>Delete item?</Dialog.Title>
              <Dialog.Actions>
                <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
              </Dialog.Actions>
            </Dialog.Root>
          </>
        );
      };
      const user = userEvent.setup();
      renderWithProvider(<RowWithDelete />);

      await openMenuWithFocus(user, 'Delete');
      await user.keyboard('{Enter}');

      const dialog = await screen.findByRole('dialog', { name: 'Delete item?' });
      await waitForClosed();
      await waitFor(() => expect(dialog).toHaveFocus());

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it('stays open when an item sets closeOnSelect to false', async () => {
      const onClick = vi.fn();
      const user = renderMenu({
        children: (
          <Menu.Item onClick={onClick} closeOnSelect={false}>
            Stay
          </Menu.Item>
        ),
      });

      await openMenu(user);
      await user.click(item('Stay'));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('does not activate or close a disabled item with a click, Enter, or Space', async () => {
      const onClick = vi.fn();
      const onOpenChange = vi.fn();
      const user = renderMenu({
        onOpenChange,
        children: (
          <>
            <Menu.Item>Edit</Menu.Item>
            <Menu.Item disabled onClick={onClick}>
              Archive
            </Menu.Item>
          </>
        ),
      });

      await openMenuWithFocus(user);
      expect(item('Archive')).toHaveAttribute('aria-disabled', 'true');
      await user.click(item('Archive'));
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(onClick).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('renders a link item when href is set', async () => {
      const user = renderMenu({
        children: (
          <Menu.Item href="https://varsity.startribune.com/" target="_blank" rel="noreferrer">
            Strib Varsity
            <Menu.ItemIcon position="end">
              <svg />
            </Menu.ItemIcon>
          </Menu.Item>
        ),
      });

      await openMenu(user);

      expect(item('Strib Varsity').tagName).toBe('A');
      expect(item('Strib Varsity')).toHaveAttribute('href', 'https://varsity.startribune.com/');
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
        const user = renderMenu({
          children: (
            <Menu.Item as={MockNextLink} href="/profile" prefetch={false}>
              Profile
            </Menu.Item>
          ),
        });

        await openMenuWithFocus(user, 'Profile');
        const link = item('Profile');
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', '/profile');
        expect(link).toHaveAttribute('data-prefetch', 'false');

        await user.click(link);

        expect(navigate).toHaveBeenCalledWith('/profile');
      });

      it('does not navigate when disabled', async () => {
        const onOpenChange = vi.fn();
        const user = renderMenu({
          onOpenChange,
          children: (
            <Menu.Item as={MockNextLink} href="/profile" disabled>
              Profile
            </Menu.Item>
          ),
        });

        await openMenu(user);
        await user.click(item('Profile'));

        expect(navigate).not.toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus with arrow keys, Home, and End, including disabled items', async () => {
      const user = renderMenu();

      await openMenuWithFocus(user);

      for (const [key, expected] of [
        ['{ArrowDown}', 'Archive'],
        ['{ArrowDown}', 'Delete'],
        ['{ArrowDown}', 'Edit'],
        ['{ArrowUp}', 'Delete'],
        ['{Home}', 'Edit'],
        ['{End}', 'Delete'],
      ]) {
        await user.keyboard(key);
        expect(item(expected)).toHaveFocus();
      }
    });

    it('navigates items in document order through wrappers and conditional items', async () => {
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
      const user = userEvent.setup();
      renderWithProvider(<Composed />);

      await openMenuWithFocus(user, 'First');
      await user.keyboard('{ArrowDown}');
      expect(item('Show more')).toHaveFocus();

      await user.keyboard('{Enter}');
      await screen.findByRole('menuitem', { name: 'Inserted' });

      for (const [key, expected] of [
        ['{Home}', 'First'],
        ['{ArrowDown}', 'Inserted'],
        ['{ArrowDown}', 'Show more'],
      ]) {
        await user.keyboard(key);
        expect(item(expected)).toHaveFocus();
      }
    });

    it('skips items hidden with CSS', async () => {
      const original = HTMLElement.prototype.checkVisibility;
      HTMLElement.prototype.checkVisibility = function (this: HTMLElement) {
        return this.textContent !== 'Hidden';
      };
      onTestFinished(() => {
        HTMLElement.prototype.checkVisibility = original;
      });
      const user = renderMenu({
        children: (
          <>
            <Menu.Item>First</Menu.Item>
            <Menu.Item>Hidden</Menu.Item>
            <Menu.Item>Last</Menu.Item>
          </>
        ),
      });

      await openMenuWithFocus(user, 'First');
      await user.keyboard('{ArrowDown}');

      expect(item('Last')).toHaveFocus();
    });
  });

  describe('dismissal', () => {
    it('closes on Escape and returns focus to the trigger', async () => {
      const onOpenChange = vi.fn();
      const user = renderMenu({ onOpenChange });

      await openMenuWithFocus(user);
      await user.keyboard('{Escape}');

      expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
      await waitForClosed();
      await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it('closes on outside click', async () => {
      const onOpenChange = vi.fn();
      const user = renderMenu({ onOpenChange });

      await openMenu(user);
      await user.click(screen.getByRole('button', { name: 'Outside' }));
      await waitForClosed();
      expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    });

    it.each([
      ['Tab', false, 'Outside'],
      ['Shift+Tab', true, 'Actions'],
    ])('closes when focus leaves the menu with %s', async (_, shift, focusTarget) => {
      const onOpenChange = vi.fn();
      const user = renderMenu({ onOpenChange });

      await openMenuWithFocus(user);
      await user.tab({ shift });

      await waitForClosed();
      expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
      expect(screen.getByRole('button', { name: focusTarget })).toHaveFocus();
    });

    it('locks page scroll while open and restores it on close', async () => {
      const user = renderMenu();

      await openMenu(user);
      expect(document.body.style.overflow).toBe('hidden');

      await user.keyboard('{Escape}');
      await waitForClosed();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('positioning', () => {
    const arrowOf = (menu: HTMLElement) => menu.querySelector<SVGElement>(':scope > svg');

    it('hides the arrow when hideArrow is set', async () => {
      const user = renderMenu({ hideArrow: true });

      expect(arrowOf(await openMenu(user))).toBeNull();
    });

    it('opens on the side set by placement', async () => {
      const user = renderMenu({ placement: 'top-end' });

      // FloatingArrow pins itself to the menu edge that faces the anchor.
      expect(arrowOf(await openMenu(user))?.style.top).toBe('100%');
    });

    it('resolves a responsive placement at the current breakpoint', async () => {
      const viewport = mockViewport(375);
      onTestFinished(viewport.restore);
      const user = renderMenu({ placement: { small: 'top', large: 'bottom' } });

      const menu = await openMenu(user);
      expect(arrowOf(menu)?.style.top).toBe('100%');

      viewport.resize(1160);
      await waitFor(() => expect(arrowOf(menu)?.style.bottom).toBe('100%'));
    });

    it('renders in a portal by default', async () => {
      const user = renderMenu();

      expect((await openMenu(user)).closest('[data-floating-ui-portal]')).not.toBeNull();
    });

    it('renders into portalRoot when set', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      onTestFinished(() => container.remove());
      const user = renderMenu({ portalRoot: container });

      expect(container.contains(await openMenu(user))).toBe(true);
    });
  });

  it('puts a default test id on the surface and passes test ids to every part', async () => {
    const user = renderMenu({
      children: (
        <>
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
        </>
      ),
    });

    const menu = await openMenu(user);

    expect(menu).toHaveAttribute('data-testid', 'menu');
    expect(screen.getByTestId('edit-item')).toHaveAccessibleName('Edit');
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByTestId('divider')).toHaveAttribute('role', 'separator');
    expect(screen.getByTestId('profile-link').tagName).toBe('A');
  });
});
