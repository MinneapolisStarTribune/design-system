import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, TOAST_VARIANTS, ToastProps, ToastVariant } from '@/components/Toast/web/Toast';
import { useToast } from '@/providers/SnackProvider/SnackProvider';
import { UtilityBody, UtilityLabel } from '@/components/Typography/Utility';
import styles from './Toast.stories.module.scss';

/** Matches product “Types” spec; used in All variants story and aligned with Docs. */
const TOAST_VARIANT_GUIDE: Record<ToastVariant, { label: string; purpose: string }> = {
  info: {
    label: 'Informational',
    purpose: 'Used for neutral awareness or contextual system feedback.',
  },
  success: {
    label: 'Success',
    purpose: 'Confirms that an action completed successfully.',
  },
  warning: {
    label: 'Warning',
    purpose: 'Communicates a potential issue that does not block progress. Use sparingly.',
  },
  error: {
    label: 'Error',
    purpose:
      'Communicates a failure that is temporary or system-generated. Should not be used for errors that require user correction.',
  },
};

const meta = {
  title: 'Feedback & Status/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['exiting'],
    },
    docs: {
      description: {
        component:
          'Short, non-blocking status messages with optional icon, title, optional description, and a close control. Docs: `Toast.mdx`.',
      },
      controls: {
        exclude: ['exiting'],
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Primary line of copy. Keep it concise and scannable.',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: 'Optional supporting sentence. Omit when the title is enough.',
      table: {
        type: { summary: 'string' },
      },
    },
    variant: {
      control: 'select',
      options: [...TOAST_VARIANTS],
      description:
        'Sets semantic color and icon. See the Types table in Toast docs for when to use each value.',
      table: {
        type: { summary: 'info | success | warning | error' },
      },
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether the leading variant icon is visible.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description:
        'Whether the dismiss control is shown (default true). Set false only for special cases such as non-interactive screenshots.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onClose: {
      action: 'onClose',
      description: 'Invoked when the user activates the dismiss control.',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: '—' },
      },
    },
    exiting: {
      control: false,
      table: { disable: true },
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
        <button type="button" className={styles.showToastAgain} onClick={() => setOpen(true)}>
          Show toast again
        </button>
      )}
    </>
  );
}

export const Configurable: Story = {
  args: {
    title: 'Changes saved',
    description: 'Your changes were saved.',
    variant: 'info',
    showIcon: true,
    showCloseButton: true,
    onClose: () => {},
    dataTestId: 'toast-demo',
  },
  // Named function so Storybook can bind Docs controls to args
  render: function ConfigurableToast(args) {
    return <ToastWithClose {...args} />;
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Each block lists the **type** (from the design spec), the **`variant`** value, when to use it, then examples with and without the icon. Dismiss works like **Configurable**: closing a toast shows **Show toast again** so you can restore it.',
      },
    },
  },
  args: { title: 'All variants', onClose: () => {} },
  render: () => (
    <div className={styles.list}>
      {TOAST_VARIANTS.map((variant) => {
        const { label, purpose } = TOAST_VARIANT_GUIDE[variant];
        return (
          <section key={variant} className={styles.variantGroup}>
            <header className={styles.variantHeader}>
              <div className={styles.variantHeading}>
                <UtilityLabel size="medium" weight="semibold">
                  {label}
                </UtilityLabel>{' '}
                <UtilityLabel size="small" weight="regular" className={styles.variantCode}>
                  ({variant})
                </UtilityLabel>
              </div>
              <UtilityBody size="small" weight="regular" className={styles.variantPurpose}>
                {purpose}
              </UtilityBody>
            </header>
            <div className={styles.variantToasts}>
              <ToastWithClose
                title={`${label} message`}
                description="With icon"
                variant={variant}
                showIcon
                onClose={() => {}}
              />
              <ToastWithClose
                title={`${label} message (no icon)`}
                description="Without icon"
                variant={variant}
                showIcon={false}
                onClose={() => {}}
              />
            </div>
          </section>
        );
      })}
    </div>
  ),
};

function ToastRendererDemo() {
  const { show } = useToast();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280 }}>
      <button
        type="button"
        onClick={() =>
          show({ title: 'Info', description: 'From global provider', variant: 'info' })
        }
      >
        Show info toast
      </button>
      <button
        type="button"
        onClick={() =>
          show({
            title: 'Saved',
            description: 'Your changes were saved.',
            variant: 'success',
          })
        }
      >
        Show success (auto-dismiss)
      </button>
      <button type="button" onClick={() => show({ title: 'Warning', variant: 'warning' })}>
        Show warning
      </button>
      <button
        type="button"
        onClick={() =>
          show({ title: 'Error', description: 'Something went wrong.', variant: 'error' })
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
          'Storybook already provides `DesignSystemProvider` (and `SnackProvider`) via preview. Use `useToast()` to show toasts from anywhere; toasts appear in a fixed bottom-right container.',
      },
    },
  },
  render: () => <ToastRendererDemo />,
} satisfies Omit<Story, 'args'>;
