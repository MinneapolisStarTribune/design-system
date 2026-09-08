import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { TriggerablePopover } from './TriggerablePopover';
import { Button, UtilityBody } from '@/components/index.web';

const meta = {
  title: 'Feedback & Status/TriggerablePopover',
  component: TriggerablePopover,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    trigger: { control: false },
    children: { control: false },
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
} satisfies Meta<typeof TriggerablePopover>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground — behaves exactly like `Popover` when no `triggerId` is set.
 */
export const Configurable: Story = {
  args: {
    trigger: <Button>Open</Button>,
    placement: 'bottom',
    children: (
      <>
        <TriggerablePopover.Heading>Title</TriggerablePopover.Heading>
        <TriggerablePopover.Description>
          Without a `triggerId`, this is identical to a plain Popover.
        </TriggerablePopover.Description>
      </>
    ),
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
        <TriggerablePopover
          triggerId={triggerId}
          enableInjectionSlot
          trigger={<Button>Open (click)</Button>}
        >
          <TriggerablePopover.Heading>App content</TriggerablePopover.Heading>
          <TriggerablePopover.Body>
            <UtilityBody>Shown when opened by clicking the trigger.</UtilityBody>
          </TriggerablePopover.Body>
        </TriggerablePopover>

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
export const ExternalTrigger: Story = {
  args: {
    trigger: <Button />,
    children: null,
  },
  render: () => <ExternalTriggerDemo />,
  parameters: {
    controls: { disable: true },
  },
};
