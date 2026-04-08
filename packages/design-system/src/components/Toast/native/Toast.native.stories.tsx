import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import {
  TOAST_VARIANTS,
  type ToastNativeProps,
  type ToastVariant,
} from '@/components/Toast/Toast.types';
import { ToastNative } from './Toast.native';

/** Matches product “Types” spec; aligned with `web/Toast.stories.tsx`. */
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
  component: ToastNative,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Primary line of copy. Keep it concise and scannable.',
    },
    description: {
      control: 'text',
      description: 'Optional supporting sentence. Omit when the title is enough.',
    },
    variant: {
      control: 'select',
      options: [...TOAST_VARIANTS],
      description: 'Sets semantic color and leading glyph.',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether the leading variant glyph is visible.',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether the dismiss control is shown (default true).',
    },
    onClose: {
      action: 'onClose',
      description: 'Invoked when the user activates the dismiss control.',
    },
  },
} satisfies Meta<typeof ToastNative>;

export default meta;

type Story = StoryObj<typeof meta>;

function ToastWithClose(props: ToastNativeProps) {
  const [open, setOpen] = useState(true);
  const { onClose: _onClose, ...toastProps } = props;
  return (
    <View style={styles.configurableWrap}>
      {open ? (
        <ToastNative {...toastProps} onClose={() => setOpen(false)} />
      ) : (
        <Pressable
          onPress={() => setOpen(true)}
          style={({ pressed }) => [styles.showAgain, pressed && styles.showAgainPressed]}
        >
          <Text style={styles.showAgainText}>Show toast again</Text>
        </Pressable>
      )}
    </View>
  );
}

export const Configurable: Story = {
  parameters: {
    // Preview owns `brand` / `mode`; hide `brand` only so `mode` still merges into context for the decorator.
    controls: { exclude: ['brand'] },
  },
  args: {
    title: 'Changes saved',
    description: 'Your changes were saved.',
    variant: 'info',
    showIcon: true,
    showCloseButton: true,
    onClose: () => {},
    dataTestId: 'toast-native-demo',
  },
  render: (args) => {
    const {
      brand: _brand,
      mode: _mode,
      ...toastArgs
    } = args as ToastNativeProps & {
      brand?: string;
      mode?: string;
    };
    return <ToastNative key={String(toastArgs.variant ?? 'info')} {...toastArgs} />;
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Each block lists the type, the **variant** value, when to use it, then examples with and without the leading glyph. Dismiss works like **Configurable**: closing shows **Show toast again**.',
      },
    },
  },
  args: { title: 'All variants', onClose: () => {} },
  render: () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {TOAST_VARIANTS.map((variant) => {
        const { label, purpose } = TOAST_VARIANT_GUIDE[variant];
        return (
          <View key={variant} style={styles.variantGroup}>
            <View style={styles.variantHeader}>
              <View style={styles.variantHeading}>
                <UtilityLabel size="medium" weight="semibold">
                  {label}
                </UtilityLabel>
                <UtilityLabel size="small" weight="regular">
                  {' '}
                  ({variant})
                </UtilityLabel>
              </View>
              <UtilityBody size="small" weight="regular">
                {purpose}
              </UtilityBody>
            </View>
            <View style={styles.variantToasts}>
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
            </View>
          </View>
        );
      })}
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  configurableWrap: {
    alignItems: 'flex-start',
  },
  showAgain: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9ca3af',
  },
  showAgainPressed: {
    opacity: 0.85,
  },
  showAgainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  scrollContent: {
    gap: 24,
    paddingBottom: 32,
    width: '100%',
  },
  variantGroup: {
    gap: 12,
    width: '100%',
  },
  variantHeader: {
    gap: 8,
  },
  variantHeading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  variantToasts: {
    gap: 12,
    width: '100%',
  },
});
