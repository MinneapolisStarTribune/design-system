import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  BUTTON_COLORS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  ICON_ONLY_BUTTON_SIZES,
  type ButtonColor,
  type ButtonNativeProps,
  type ButtonSize,
  type ButtonVariant,
  type IconOnlyButtonSize,
} from '@/components/Button/Button.types';
import { AvatarIcon, ArrowRightIcon } from '@/icons';
import { Button } from './Button.native';

/** Story-only arg for toggling demo icon in Configurable (matches web). */
type ConfigurableArgs = ButtonNativeProps & { showIcon?: boolean };

const meta = {
  title: 'Actions/Button',
  component: Button as ComponentType<ConfigurableArgs>,
  argTypes: {
    color: { control: 'select', options: BUTTON_COLORS },
    variant: { control: 'select', options: BUTTON_VARIANTS },
    size: { control: 'select', options: [...BUTTON_SIZES, 'x-small'] },
    capitalize: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    showIcon: {
      control: 'boolean',
      description:
        'Stories only: toggles AvatarIcon. In apps, pass icon={<YourIcon />} (see Button `icon` prop docs).',
    },
    iconPosition: {
      control: 'radio',
      options: ['start', 'end'],
      if: { arg: 'showIcon', truthy: true },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Use the Storybook **brand** and **mode** controls (preview toolbar / Controls) for light and dark themes.',
      },
    },
  },
} satisfies Meta<ConfigurableArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: StoryObj<ConfigurableArgs> = {
  args: {
    color: 'brand',
    variant: 'filled',
    size: 'large',
    capitalize: false,
    isDisabled: false,
    isLoading: false,
    showIcon: false,
    iconPosition: 'end',
    children: 'See More',
    onPress: () => {},
  },
  render: (args) => {
    const { showIcon, iconPosition, ...buttonProps } = args as ConfigurableArgs;
    return (
      <Button
        {...buttonProps}
        icon={showIcon ? <AvatarIcon /> : undefined}
        {...(showIcon ? { iconPosition: iconPosition ?? 'end' } : {})}
      />
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <ScrollView contentContainerStyle={styles.scroll} style={styles.scrollView}>
      <Text style={styles.sectionTitle}>Colors × variants (medium, neutral/brand/accent)</Text>
      {BUTTON_COLORS.map((color: ButtonColor) => (
        <View key={color} style={styles.block}>
          <Text style={styles.label}>{color}</Text>
          {BUTTON_VARIANTS.map((variant: ButtonVariant) => (
            <Button
              key={`${color}-${variant}`}
              color={color}
              variant={variant}
              onPress={() => {}}
              testID={`btn-${color}-${variant}`}
            >
              {variant}
            </Button>
          ))}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Sizes (filled neutral)</Text>
      <View style={styles.rowWrap}>
        {BUTTON_SIZES.map((size: ButtonSize) => (
          <Button key={size} size={size} onPress={() => {}} testID={`size-${size}`}>
            Size {size}
          </Button>
        ))}
      </View>

      <Text style={styles.sectionTitle}>States</Text>
      <View style={styles.rowWrap}>
        <Button onPress={() => {}}>Default</Button>
        <Button onPress={() => {}} isDisabled>
          Disabled
        </Button>
        <Button onPress={() => {}} isLoading>
          Loading
        </Button>
      </View>

      <Text style={styles.sectionTitle}>Icons</Text>
      <View style={styles.rowWrap}>
        <Button icon={<AvatarIcon />} iconPosition="start" onPress={() => {}}>
          Leading
        </Button>
        <Button icon={<ArrowRightIcon />} iconPosition="end" onPress={() => {}}>
          Trailing
        </Button>
      </View>

      <Text style={styles.sectionTitle}>Icon-only (use brand/mode in Controls for light/dark)</Text>
      <View style={styles.rowWrap}>
        {ICON_ONLY_BUTTON_SIZES.map((size: IconOnlyButtonSize) => (
          <Button
            key={size}
            size={size}
            icon={<AvatarIcon />}
            accessibilityLabel={`${size} icon`}
            onPress={() => {}}
            testID={`icon-only-${size}`}
          />
        ))}
      </View>
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, width: '100%' },
  scroll: {
    padding: 16,
    gap: 16,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  block: {
    gap: 8,
    width: '100%',
  },
  label: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
});
