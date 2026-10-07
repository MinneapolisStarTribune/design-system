import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as TriggerablePopover from './TriggerablePopover';
import { Button } from '@/components/Button/web/Button';
import { UtilityBody } from '@/components/Typography/Utility';
import { POPOVER_PLACEMENTS } from '@/components/Popover/Popover.types';

const meta = {
  title: 'Feedback & Status/TriggerablePopover',
  component: TriggerablePopover.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A `Popover` that an outside script can open, close, and inject content into by `triggerId`. Docs: `TriggerablePopover.mdx`.',
      },
    },
  },
  argTypes: {
    trigger: {
      control: false,
      description: 'Element that opens the popover. A single element gets the ARIA attributes.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: false,
      description:
        'Popover content, built from `TriggerablePopover.Heading`, `Description`, `Divider` and `Body`. Not rendered while opened by `triggerId`.',
      table: { type: { summary: 'ReactNode' } },
    },
    placement: {
      control: 'select',
      options: [...POPOVER_PLACEMENTS],
      description: 'Side of the trigger the popover opens on.',
      table: {
        type: { summary: 'top | right | bottom | left' },
        defaultValue: { summary: 'bottom' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Stops the trigger from opening the popover.',
      table: { type: { summary: 'boolean' } },
    },
    modal: {
      control: 'boolean',
      description: 'Traps focus inside the popover. Use for action-heavy content.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    triggerId: {
      control: 'text',
      description: 'ID an outside script uses to open or close this popover.',
      table: { type: { summary: 'string' } },
    },
    enableInjectionSlot: {
      control: 'boolean',
      description: 'Reserves a `${triggerId}-injection-slot` node for injected content.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof TriggerablePopover.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

type ExternalTriggerDemoProps = Omit<ComponentProps<typeof TriggerablePopover.Root>, 'children'>;

const callExternal = (name: 'openTooltip' | 'closeTooltip', id: string) =>
  (window as unknown as Record<string, (id: string) => void>)[name](id);

const ExternalTriggerDemo = ({ triggerId, ...props }: ExternalTriggerDemoProps) => {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!triggerId) return;
    // Simulates a vendor script (e.g. Piano Composer) finding the injection slot and adding its own markup.
    const observer = new MutationObserver(() => {
      const slot = document.getElementById(`${triggerId}-injection-slot`);
      if (slot && slot.childNodes.length === 0) {
        const injected = document.createElement('div');
        injected.style.padding = '12px';
        injected.style.fontFamily = 'sans-serif';
        injected.textContent = '👋 This content was injected by an external script.';
        slot.appendChild(injected);
        setLog((l) => [...l, 'external script found the slot and injected content']);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [triggerId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <TriggerablePopover.Root {...props} triggerId={triggerId}>
          <TriggerablePopover.Heading>App content</TriggerablePopover.Heading>
          <TriggerablePopover.Body>
            <UtilityBody>Shown when opened by clicking the trigger.</UtilityBody>
          </TriggerablePopover.Body>
        </TriggerablePopover.Root>

        <Button
          variant="outlined"
          isDisabled={!triggerId}
          onClick={() => {
            if (!triggerId) return;
            setLog((l) => [...l, 'window.openTooltip called']);
            callExternal('openTooltip', triggerId);
          }}
        >
          Simulate external trigger
        </Button>

        <Button
          variant="outlined"
          isDisabled={!triggerId}
          onClick={() => {
            if (!triggerId) return;
            setLog((l) => [...l, 'window.closeTooltip called']);
            callExternal('closeTooltip', triggerId);
          }}
        >
          Simulate external close
        </Button>
      </div>

      <UtilityBody size="small">
        {log.length === 0 ? 'Nothing happened yet.' : log.join(' → ')}
      </UtilityBody>
    </div>
  );
};

/**
 * Click the trigger to show the app's own content, or use the simulate buttons to open it the way a
 * vendor integration (e.g. Piano) does via `window.openTooltip`/`window.closeTooltip`. When opened
 * externally, the popover shows whatever is injected into the slot instead of its children.
 */
export const Configurable: Story = {
  args: {
    trigger: <Button>Open (click)</Button>,
    placement: 'bottom',
    triggerId: 'storybook-demo-tooltip',
    enableInjectionSlot: true,
    children: null,
  },
  render: ({ children: _children, ...args }) => <ExternalTriggerDemo {...args} />,
  parameters: {
    docs: {
      source: {
        // Built from args so the snippet follows the Controls panel.
        transform: (_code: string, { args }: { args: Story['args'] }) => {
          const props = [
            args?.placement && `placement="${args.placement}"`,
            args?.isDisabled && 'isDisabled',
            args?.modal && 'modal',
            args?.triggerId && `triggerId="${args.triggerId}"`,
            args?.enableInjectionSlot && 'enableInjectionSlot',
            'trigger={<Button>Open (click)</Button>}',
          ].filter(Boolean);

          return `<TriggerablePopover.Root ${props.join(' ')}>
  <TriggerablePopover.Heading>App content</TriggerablePopover.Heading>
  <TriggerablePopover.Body>
    <UtilityBody>Shown when opened by clicking the trigger.</UtilityBody>
  </TriggerablePopover.Body>
</TriggerablePopover.Root>

// Elsewhere, e.g. a vendor script:
window.openTooltip('${args?.triggerId ?? ''}');
window.closeTooltip('${args?.triggerId ?? ''}');`;
        },
      },
    },
  },
};
