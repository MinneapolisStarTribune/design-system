import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as TriggerablePopover from './TriggerablePopover';
import { Button } from '@/components/Button/web/Button';
import { renderWithProvider } from '@/test-utils/render';

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
      <TriggerablePopover.Root trigger={<Button>Open</Button>}>
        <TriggerablePopover.Body>Popover Content</TriggerablePopover.Body>
      </TriggerablePopover.Root>
    );

    await user.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByText('Popover Content')).toBeInTheDocument();
    });
  });

  it('names the dialog by its heading', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <TriggerablePopover.Root trigger={<Button>Open</Button>}>
        <TriggerablePopover.Heading>Title</TriggerablePopover.Heading>
        <TriggerablePopover.Body>Content</TriggerablePopover.Body>
      </TriggerablePopover.Root>
    );

    await user.click(screen.getByText('Open'));

    expect(await screen.findByRole('dialog', { name: 'Title' })).toBeInTheDocument();
  });

  it('closes via the heading close button', async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <TriggerablePopover.Root trigger={<Button>Open</Button>}>
        <TriggerablePopover.Heading>Title</TriggerablePopover.Heading>
        <TriggerablePopover.Body>Content</TriggerablePopover.Body>
      </TriggerablePopover.Root>
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
      <TriggerablePopover.Root trigger={<Button>Open</Button>}>
        <TriggerablePopover.Body>Content</TriggerablePopover.Body>
      </TriggerablePopover.Root>
    );

    expect(() => triggerExternally('anything')).not.toThrow();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  describe('external triggering', () => {
    it('opens when window.openTooltip(triggerId) is called, without a trigger click', async () => {
      renderWithProvider(
        <TriggerablePopover.Root
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover.Root>
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
        <TriggerablePopover.Root
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover.Root>
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
        <TriggerablePopover.Root
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>App content</TriggerablePopover.Body>
        </TriggerablePopover.Root>
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
        <TriggerablePopover.Root
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>App content</TriggerablePopover.Body>
        </TriggerablePopover.Root>
      );

      await user.click(screen.getByText('Open'));

      await waitFor(() => {
        expect(screen.getByText('App content')).toBeInTheDocument();
      });
    });

    it('mounts the injection slot in the DOM before the first open, so an external script can find it early', () => {
      renderWithProvider(
        <TriggerablePopover.Root
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover.Root>
      );

      // Force-mounted but closed: present in the DOM, hidden via display:none.
      const slot = document.querySelector('[data-testid="external-trigger-injection-slot"]');
      expect(slot).toBeInTheDocument();
      expect(slot).toHaveStyle({ display: 'none' });
    });

    it('stops force-mounting the injection slot after the first real open (of any kind)', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <TriggerablePopover.Root
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover.Root>
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
        <TriggerablePopover.Root
          triggerId="gift-top"
          enableInjectionSlot
          open={open}
          onOpenChange={onOpenChange}
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover.Root>
      );

      const { rerender } = renderWithProvider(popover);

      triggerExternally('gift-top');
      // Controlled: the external trigger only calls onOpenChange — it's the consumer's job (here,
      // the rerender below) to feed the new value back as the `open` prop.
      expect(open).toBe(true);

      rerender(
        <TriggerablePopover.Root
          triggerId="gift-top"
          enableInjectionSlot
          open={open}
          onOpenChange={onOpenChange}
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>Content</TriggerablePopover.Body>
        </TriggerablePopover.Root>
      );

      await waitFor(() => {
        expect(document.querySelector('[data-state]')).toHaveAttribute('data-state', 'open');
      });
    });

    it('reveals injected content on an external open after a click open and close', async () => {
      // jsdom has no ResizeObserver, so the hook would poll instead. Use the browser path.
      class ResizeObserverStub {
        constructor(private callback: ResizeObserverCallback) {}
        observe() {
          this.callback([], this as unknown as ResizeObserver);
        }
        disconnect() {}
        unobserve() {}
      }
      vi.stubGlobal('ResizeObserver', ResizeObserverStub);
      const user = userEvent.setup();

      renderWithProvider(
        <TriggerablePopover.Root
          triggerId="share-top"
          enableInjectionSlot
          trigger={<Button>Open</Button>}
        >
          <TriggerablePopover.Body>App content</TriggerablePopover.Body>
        </TriggerablePopover.Root>
      );

      await user.click(screen.getByText('Open'));
      await waitFor(() => screen.getByText('App content'));
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByText('App content')).not.toBeInTheDocument());

      triggerExternally('share-top');
      const slot = await waitFor(() => {
        const element = document.getElementById('share-top-injection-slot');
        expect(element).not.toBeNull();
        return element!;
      });
      slot.appendChild(document.createElement('iframe'));

      await waitFor(() =>
        expect(
          document.querySelector<HTMLElement>('[data-testid="external-trigger-injection-slot"]')
            ?.style.visibility
        ).toBe('')
      );
      vi.unstubAllGlobals();
    });
  });
});
