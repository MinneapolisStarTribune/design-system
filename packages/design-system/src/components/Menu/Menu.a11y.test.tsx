import { type ReactNode, useState } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { renderWithProvider } from '@/test-utils/render';
import * as Menu from './Menu';
import type { MenuLabelProps } from './Menu.types';

const renderOpenMenu = (
  labelProps: MenuLabelProps,
  children: ReactNode = <Menu.Item>Manage Profile</Menu.Item>
) =>
  renderWithProvider(
    <Menu.Root
      {...labelProps}
      trigger={
        <button type="button" id="menu-trigger">
          Account
        </button>
      }
      open
      onOpen={vi.fn()}
      onClose={vi.fn()}
    >
      {children}
    </Menu.Root>
  );

// The menu renders outside the test container. Check it alone to omit focus guards and page landmarks.
const axeMenu = (menu: HTMLElement) => axe(menu, { rules: { region: { enabled: false } } });

const Harness = () => {
  const [open, setOpen] = useState(false);
  return (
    <Menu.Root
      trigger={<button type="button">Account</button>}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      aria-label="Account"
    >
      <Menu.Item>Manage Profile</Menu.Item>
      <Menu.Divider />
      <Menu.Item>Log Out</Menu.Item>
    </Menu.Root>
  );
};

describe('Menu Accessibility', () => {
  it('has no violations when open', async () => {
    renderOpenMenu(
      { 'aria-label': 'Account' },
      <>
        <Menu.Item href="https://varsity.startribune.com/">
          Strib Varsity
          <Menu.ItemIcon position="end">
            <svg />
          </Menu.ItemIcon>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>Manage Profile</Menu.Item>
        <Menu.Item disabled>Log Out</Menu.Item>
      </>
    );

    expect(await axeMenu(await screen.findByRole('menu'))).toHaveNoViolations();
  });

  it('has no violations when named by aria-labelledby', async () => {
    renderOpenMenu({ 'aria-labelledby': 'menu-trigger' });

    const menu = await screen.findByRole('menu', { name: 'Account' });
    expect(menu).toHaveAttribute('aria-labelledby', 'menu-trigger');
    expect(await axeMenu(menu)).toHaveNoViolations();
  });

  it('only sets aria-labelledby when it is supplied', async () => {
    renderOpenMenu({ 'aria-label': 'Account' });

    const menu = await screen.findByRole('menu', { name: 'Account' });
    expect(menu).not.toHaveAttribute('aria-labelledby');
  });

  it('has no trigger violations when closed or open', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Account' });

    expect(await axe(trigger)).toHaveNoViolations();

    await user.click(trigger);
    await screen.findByRole('menu');

    expect(await axe(trigger)).toHaveNoViolations();
  });

  it('requires an accessible name at compile time', () => {
    const trigger = <button type="button">Account</button>;
    const unlabeled = (
      // @ts-expect-error a menu needs aria-label or aria-labelledby
      <Menu.Root trigger={trigger} open onOpen={vi.fn()} onClose={vi.fn()}>
        <Menu.Item>Manage Profile</Menu.Item>
      </Menu.Root>
    );
    const doublyLabeled = (
      // @ts-expect-error aria-label and aria-labelledby are mutually exclusive
      <Menu.Root
        trigger={trigger}
        open
        onOpen={vi.fn()}
        onClose={vi.fn()}
        aria-label="Account"
        aria-labelledby="menu-trigger"
      >
        <Menu.Item>Manage Profile</Menu.Item>
      </Menu.Root>
    );

    expect(unlabeled).toBeDefined();
    expect(doublyLabeled).toBeDefined();
  });
});
