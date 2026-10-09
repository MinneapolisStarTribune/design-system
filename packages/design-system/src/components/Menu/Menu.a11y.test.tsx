import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { DesignSystemProvider } from '@/providers/DesignSystemProvider';
import * as Menu from './Menu';

describe('Menu Accessibility', () => {
  it('has no violations when open', async () => {
    render(
      <DesignSystemProvider brand="startribune" forceColorScheme="light">
        <Menu.Root
          trigger={<button type="button">Account</button>}
          open
          onOpen={vi.fn()}
          onClose={vi.fn()}
          aria-label="Account"
        >
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
  });

  it('has no violations when named by aria-labelledby', async () => {
    render(
      <DesignSystemProvider brand="startribune" forceColorScheme="light">
        <Menu.Root
          trigger={
            <button type="button" id="menu-trigger">
              Account
            </button>
          }
          open
          onOpen={vi.fn()}
          onClose={vi.fn()}
          aria-labelledby="menu-trigger"
        >
          <Menu.Item>Manage Profile</Menu.Item>
        </Menu.Root>
      </DesignSystemProvider>
    );

    const menu = await screen.findByRole('menu', { name: 'Account' });
    expect(menu).toHaveAttribute('aria-labelledby', 'menu-trigger');
    const results = await axe(menu, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });

  it('only sets aria-labelledby when it is supplied', async () => {
    render(
      <DesignSystemProvider brand="startribune" forceColorScheme="light">
        <Menu.Root
          trigger={<button type="button">Account</button>}
          open
          onOpen={vi.fn()}
          onClose={vi.fn()}
          aria-label="Account"
        >
          <Menu.Item>Manage Profile</Menu.Item>
        </Menu.Root>
      </DesignSystemProvider>
    );

    const menu = await screen.findByRole('menu', { name: 'Account' });
    expect(menu).not.toHaveAttribute('aria-labelledby');
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
