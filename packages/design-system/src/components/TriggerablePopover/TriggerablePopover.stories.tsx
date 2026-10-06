import { useEffect, useState } from 'react';
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

/** Without a `triggerId`, this behaves like `Popover`. See Popover's stories for all variants. */
export const Configurable: Story = {
  args: {
    trigger: <Button>Open</Button>,
    placement: 'bottom',
    children: (
      <>
        <TriggerablePopover.Heading>Title</TriggerablePopover.Heading>
        <TriggerablePopover.Description>
          This is a popover. Use the Controls panel to change the pointer position.
        </TriggerablePopover.Description>
      </>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `
<TriggerablePopover.Root placement="bottom" trigger={<Button>Open</Button>}>
  <TriggerablePopover.Heading>Title</TriggerablePopover.Heading>

  <TriggerablePopover.Description>
    This is a popover. Use the Controls panel to change the pointer position.
  </TriggerablePopover.Description>
</TriggerablePopover.Root>
        `,
      },
    },
  },
};

const ExternalTriggerDemo = () => {
  const [log, setLog] = useState<string[]>([]);
  const triggerId = 'storybook-demo-tooltip';

  useEffect(() => {
    // Simulates the vendor's iframe finding the injection slot and dropping its own markup in —
    // exactly what a real Piano Composer template does, minus the sandboxed iframe itself.
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
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <TriggerablePopover.Root
          triggerId={triggerId}
          enableInjectionSlot
          trigger={<Button>Open (click)</Button>}
        >
          <TriggerablePopover.Heading>App content</TriggerablePopover.Heading>
          <TriggerablePopover.Body>
            <UtilityBody>Shown when opened by clicking the trigger.</UtilityBody>
          </TriggerablePopover.Body>
        </TriggerablePopover.Root>

        <Button
          variant="outlined"
          onClick={() => {
            setLog((l) => [...l, 'window.openTooltip called']);
            (window as unknown as Record<string, (id: string) => void>).openTooltip(triggerId);
          }}
        >
          Simulate external trigger
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            setLog((l) => [...l, 'window.closeTooltip called']);
            (window as unknown as Record<string, (id: string) => void>).closeTooltip(triggerId);
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
 * Demonstrates the mechanism a vendor integration (e.g. Piano) relies on: the same popover
 * shows the app's own content when opened by a click, but defers to whatever's injected into
 * the slot when opened externally via `window.openTooltip`/`window.closeTooltip`.
 */
export const AllVariants: Story = {
  args: {
    trigger: <Button />,
    children: null,
  },
  render: () => <ExternalTriggerDemo />,
  parameters: {
    controls: { disable: true },
  },
};
