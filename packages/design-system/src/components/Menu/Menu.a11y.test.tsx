import type { ReactNode } from 'react';
import { screen } from '@testing-library/react';
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
});
