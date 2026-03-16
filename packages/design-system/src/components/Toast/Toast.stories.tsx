import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toast, TOAST_VARIANTS } from './Toast';
import type { ToastProps } from './Toast';
import { ToastRenderer, useToast } from '@/providers/ToastRenderer/ToastRenderer';
import styles from './Toast.stories.module.scss';

const meta = {
  title: 'Feedback & Status/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Toast title',
    },
    description: {
      control: 'text',
      description: 'Optional body text',
    },
    variant: {
      control: 'select',
      options: [...TOAST_VARIANTS],
      description: 'Visual variant (info, success, warning, error)',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the variant icon',
    },
    onClose: {
      action: 'onClose',
      description: 'Called when the close button is clicked',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

// Wrapper so the toast can be dismissed and shown again
// (Storybook doesn't pass functions in args).
function ToastWithClose(props: ToastProps) {
  const [open, setOpen] = useState(true);
  const { onClose: _onClose, ...toastProps } = props;
  return (
    <>
      {open ? (
        <Toast {...toastProps} onClose={() => setOpen(false)} />
      ) : (
        <button type="button" onClick={() => setOpen(true)}>
          Show toast again
        </button>
      )}
    </>
  );
}

const renderWithClose = (args: ToastProps) => <ToastWithClose {...args} />;

export const Configurable: Story = {
  args: {
    title: 'Changes saved',
    description: 'Your changes were saved.',
    variant: 'info',
    showIcon: true,
    onClose: () => {},
    dataTestId: 'toast-demo',
  },
  render: renderWithClose,
};

export const AllVariants: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  args: {
    title: 'Status message',
    description: 'Brief supporting text can go here.',
    variant: 'info',
    showIcon: true,
    onClose: () => {},
    dataTestId: 'toast-all-variants',
  },
  render: () => (
    <div className={styles.list}>
      {TOAST_VARIANTS.map((variant) => (
        <div key={variant} className={styles.variantGroup}>
          <Toast
            title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} message`}
            description="With icon"
            variant={variant}
            showIcon
            onClose={() => {}}
          />
          <Toast
            title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} message (no icon)`}
            description="Without icon"
            variant={variant}
            showIcon={false}
            onClose={() => {}}
          />
        </div>
      ))}
    </div>
  ),
};

function ToastRendererDemo() {
  const { showToast } = useToast();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280 }}>
      <button
        type="button"
        onClick={() =>
          showToast({ title: 'Info', description: 'From global provider', variant: 'info' })
        }
      >
        Show info toast
      </button>
      <button
        type="button"
        onClick={() =>
          showToast({
            title: 'Saved',
            description: 'Your changes were saved.',
            variant: 'success',
          })
        }
      >
        Show success (auto-dismiss)
      </button>
      <button type="button" onClick={() => showToast({ title: 'Warning', variant: 'warning' })}>
        Show warning
      </button>
      <button
        type="button"
        onClick={() =>
          showToast({ title: 'Error', description: 'Something went wrong.', variant: 'error' })
        }
      >
        Show error
      </button>
    </div>
  );
}

export const WithRenderer = {
  parameters: {
    layout: 'centered',
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Wrap your app with `ToastRenderer` and use `useToast()` to show toasts from anywhere. Toasts appear in a fixed bottom-right container.',
      },
    },
  },
  render: () => (
    <ToastRenderer>
      <ToastRendererDemo />
    </ToastRenderer>
  ),
} satisfies Omit<Story, 'args'>;
