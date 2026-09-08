import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { TriggerablePopover } from './TriggerablePopover';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '../../test-utils/render';

const triggerExternally = (id: string) =>
  act(() => {
    (window as unknown as Record<string, (id: string) => void>).openTooltip(id);
  });

const closeExternally = (id: string) =>
  act(() => {
    (window as unknown as Record<string, (id: string) => void>).closeTooltip(id);
  });

describe('TriggerablePopover', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('opens via trigger click and renders children, same as a normal popover', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <TriggerablePopover trigger={<Button>Open</Button>}>
        <TriggerablePopover.Body>Popover Content</TriggerablePopover.Body>
      </TriggerablePopover>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
  });

  it('closes via the heading close button', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <TriggerablePopover trigger={<Button>Open</Button>}>
        <TriggerablePopover.Heading>Title</TriggerablePopover.Heading>
        <TriggerablePopover.Body>Content</TriggerablePopover.Body>
      </TriggerablePopover>
    );

    await user.click(screen.getByText('Open'));
    await waitFor(() => screen.getByText('Content'));

    await user.click(screen.getByLabelText('Close popover'));

    await waitFor(() => {
      expect(screen.queryByText('Content')).toBeNull();
    });
  });

  it('without a triggerId, is unaffected by window.openTooltip calls for any id', async () => {
    renderWithProvider(
      <TriggerablePopover trigger={<Button>Open</Button>}>
        <TriggerablePopover.Body>Content</TriggerablePopover.Body>
      </TriggerablePopover>
    );

    expect(() => triggerExternally('anything')).not.toThrow();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  describe('external triggering', () => {
    it('opens when window.openTooltip(triggerId) is called, without a trigger click', async () => {
      renderWithProvider(
        <TriggerablePopover
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover>
      );

      const getWrapper = () => document.querySelector('[data-state]');
      expect(getWrapper()).toHaveAttribute('data-state', 'closed');

      triggerExternally('share-top');

      await waitFor(() => {
        expect(getWrapper()).toHaveAttribute('data-state', 'open');
      });
    });

    it('closes when window.closeTooltip(triggerId) is called', async () => {
      renderWithProvider(
        <TriggerablePopover
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover>
      );

      const getWrapper = () => document.querySelector('[data-state]');

      triggerExternally('share-top');
      await waitFor(() => expect(getWrapper()).toHaveAttribute('data-state', 'open'));

      closeExternally('share-top');

      // An externally-driven close needs no grace period (the caller that closed it already
      // knows), so the shell unmounts entirely rather than staying rendered with data-state="closed".
      await waitFor(() => {
        expect(getWrapper()).not.toBeInTheDocument();
      });
    });

    it('does not render children while externally triggered, only the injection slot', async () => {
      renderWithProvider(
        <TriggerablePopover
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>App content</TriggerablePopover.Body>
        </TriggerablePopover>
      );

      triggerExternally('share-top');

      await waitFor(() => {
        expect(
          document.querySelector('[data-testid="external-trigger-injection-slot"]')
        ).toBeInTheDocument();
      });
      expect(screen.queryByText('App content')).not.toBeInTheDocument();
    });

    it('renders children (not the injection slot) when opened normally via trigger click, even with a triggerId set', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TriggerablePopover
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>App content</TriggerablePopover.Body>
        </TriggerablePopover>
      );

      await user.click(screen.getByText('Open'));

      await waitFor(() => {
        expect(screen.getByText('App content')).toBeInTheDocument();
      });
    });

    it('mounts the injection slot in the DOM before the first open, so an external script can find it early', () => {
      renderWithProvider(
        <TriggerablePopover
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover>
      );

      // Force-mounted but closed: present in the DOM, hidden via display:none.
      const slot = document.querySelector('[data-testid="external-trigger-injection-slot"]');
      expect(slot).toBeInTheDocument();
      expect(slot).toHaveStyle({ display: 'none' });
    });

    it('stops force-mounting the injection slot after the first real open (of any kind)', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TriggerablePopover
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover>
      );

      await user.click(screen.getByText('Open'));
      await waitFor(() => screen.getByText('Content'));
      await user.click(screen.getByText('Open'));
      await waitFor(() => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      });

      expect(
        document.querySelector('[data-testid="external-trigger-injection-slot"]')
      ).not.toBeInTheDocument();
    });

    it('supports controlled open/onOpenChange alongside external triggering', async () => {
      let open = false;
      const onOpenChange = (next: boolean) => {
        open = next;
      };

      const popover = (
        <TriggerablePopover
          triggerId="gift-top"
          enableInjectionSlot
          open={open}
          onOpenChange={onOpenChange}
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover>
      );

      const { rerender } = renderWithProvider(popover);

      triggerExternally('gift-top');
      // Controlled: the external trigger only calls onOpenChange — it's the consumer's job (here,
      // the rerender below) to feed the new value back as the `open` prop.
      expect(open).toBe(true);

      rerender(
        <TriggerablePopover
          triggerId="gift-top"
          enableInjectionSlot
          open={open}
          onOpenChange={onOpenChange}
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover>
      );

      await waitFor(() => {
        expect(document.querySelector('[data-state]')).toHaveAttribute('data-state', 'open');
      });
    });
  });
});
