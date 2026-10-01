import { useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithProvider } from '../../../test-utils/render';
import * as Menu from './Menu';
import type { MenuLabelProps, MenuProps } from '../Menu.types';

type HarnessProps = Partial<Omit<MenuProps, 'anchorEl' | 'open' | keyof MenuLabelProps>> & {
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
        onClose={() => {
          onClose?.();
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

  it('keeps consumer styling hooks on each menu layer', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <Harness wrapperClassName="custom-wrapper" containerClassName="custom-container">
        <Menu.Item className="custom-item">Edit</Menu.Item>
        <Menu.Divider className="custom-divider" />
      </Harness>
    );

    const menu = await openMenu(user);

    expect(menu).toHaveClass('custom-wrapper');
    expect(menu.querySelector('.custom-container')).toBeInTheDocument();
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
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('stays open when closeOnSelect is false', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    renderWithProvider(<Harness onEdit={onEdit} closeOnSelect={false} />);

    await openMenu(user);
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('lets an item override closeOnSelect', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <Harness>
        <Menu.Item closeOnSelect={false}>Stay</Menu.Item>
      </Harness>
    );

    await openMenu(user);
    await user.click(screen.getByRole('menuitem', { name: 'Stay' }));

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
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus());
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProvider(<Harness onClose={onClose} />);

    await openMenu(user);
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(onClose).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('closes when focus leaves the menu with Tab', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProvider(<Harness onClose={onClose} />);

    await openMenu(user);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
    await user.tab();

    await waitFor(() => expect(onClose).toHaveBeenCalled());
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

    expect(menu.querySelector('svg.arrow')).toBeNull();
  });

  it('exports its parts as a namespace', () => {
    expect(Object.keys(Menu).sort()).toEqual(['Divider', 'Item', 'ItemIcon', 'Root']);
  });
});
