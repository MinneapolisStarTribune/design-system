import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { DesignSystemProvider } from '@/providers/DesignSystemProvider';
import * as Menu from './Menu';

describe('Menu Accessibility', () => {
  it('has no violations when open', async () => {
    const anchor = document.createElement('button');
    anchor.textContent = 'Account';
    document.body.appendChild(anchor);

    render(
      <DesignSystemProvider brand="startribune" forceColorScheme="light">
        <Menu.Root anchorEl={anchor} open onClose={vi.fn()} aria-label="Account">
          <Menu.Item href="https://varsity.startribune.com/">
            Strib Varsity
            <Menu.ItemIcon position="end">
              <svg />
            </Menu.ItemIcon>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item>Manage Profile</Menu.Item>
          <Menu.Item disabled>Log Out</Menu.Item>
        </Menu.Root>
      </DesignSystemProvider>
    );

    // The menu renders outside the test container. Check it alone to omit focus guards and page landmarks.
    const menu = await screen.findByRole('menu');
    const results = await axe(menu, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();

    anchor.remove();
  });

  it('has no violations when named by aria-labelledby', async () => {
    const anchor = document.createElement('button');
    anchor.id = 'menu-anchor';
    anchor.textContent = 'Account';
    document.body.appendChild(anchor);

    render(
      <DesignSystemProvider brand="startribune" forceColorScheme="light">
        <Menu.Root anchorEl={anchor} open onClose={vi.fn()} aria-labelledby="menu-anchor">
          <Menu.Item>Manage Profile</Menu.Item>
        </Menu.Root>
      </DesignSystemProvider>
    );

    const menu = await screen.findByRole('menu', { name: 'Account' });
    expect(menu).toHaveAttribute('aria-labelledby', 'menu-anchor');
    const results = await axe(menu, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();

    anchor.remove();
  });

  it('only sets aria-labelledby when it is supplied', async () => {
    render(
      <DesignSystemProvider brand="startribune" forceColorScheme="light">
        <Menu.Root anchorEl={document.body} open onClose={vi.fn()} aria-label="Account">
          <Menu.Item>Manage Profile</Menu.Item>
        </Menu.Root>
      </DesignSystemProvider>
    );

    const menu = await screen.findByRole('menu', { name: 'Account' });
    expect(menu).not.toHaveAttribute('aria-labelledby');
  });

  it('requires an accessible name at compile time', () => {
    const anchor = document.body;
    const unlabeled = (
      // @ts-expect-error a menu needs aria-label or aria-labelledby
      <Menu.Root anchorEl={anchor} open onClose={vi.fn()}>
        <Menu.Item>Manage Profile</Menu.Item>
      </Menu.Root>
    );
    const doublyLabeled = (
      // @ts-expect-error aria-label and aria-labelledby are mutually exclusive
      <Menu.Root
        anchorEl={anchor}
        open
        onClose={vi.fn()}
        aria-label="Account"
        aria-labelledby="menu-anchor"
      >
        <Menu.Item>Manage Profile</Menu.Item>
      </Menu.Root>
    );

    expect(unlabeled).toBeDefined();
    expect(doublyLabeled).toBeDefined();
  });
});
