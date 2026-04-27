import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import { ArrowRightIcon } from '@/icons';
import {
  LINK_ICON_POSITIONS,
  LINK_SIZES,
  type LinkIconPosition,
  type LinkSize,
} from '../Link.types';
import { Link } from './Link.native';
import { UtilityBody } from '@/index.native';

type LinkStoryArgs = {
  children?: string;
  size?: LinkSize;
  disabled?: boolean;
  showIcon?: boolean;
  iconPosition?: LinkIconPosition;
  onPress?: () => void;
  dataTestId?: string;
  'aria-label'?: string;
};

const meta = {
  title: 'Actions/Link',
  component: Link as React.ComponentType<LinkStoryArgs>,
  argTypes: {
    children: { control: 'text' },
    size: { control: 'select', options: [...LINK_SIZES] },
    disabled: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    iconPosition: { control: 'select', options: [...LINK_ICON_POSITIONS] },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<LinkStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    children: 'Read more',
    size: 'medium',
    disabled: false,
    showIcon: false,
    iconPosition: 'end',
  },

  render: (args) => (
    <Link
      size={args.size ?? 'medium'}
      disabled={args.disabled}
      iconPosition={args.iconPosition ?? 'end'}
      icon={args.showIcon ? <ArrowRightIcon /> : undefined}
      onPress={args.onPress}
      dataTestId={args.dataTestId}
      aria-label={args['aria-label']}
    >
      {args.children ?? 'Read more'}
    </Link>
  ),
};

export const AllVariants: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Use the Storybook **brand** and **mode** controls (preview toolbar / Controls) for light and dark themes.',
      },
    },
  },

  render: () => (
    <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ padding: 16, gap: 32 }}>
      {LINK_SIZES.map((size) => (
        <View key={size} style={{ gap: 12 }}>
          <UtilityBody size="small" weight="bold">
            {size}
          </UtilityBody>

          <View style={{ gap: 8 }}>
            {(
              [
                { label: 'Default', disabled: false, icon: undefined },
                { label: 'Disabled', disabled: true, icon: undefined },
                {
                  label: 'Icon start',
                  disabled: false,
                  icon: <ArrowRightIcon />,
                  iconPosition: 'start' as const,
                },
                {
                  label: 'Icon start · disabled',
                  disabled: true,
                  icon: <ArrowRightIcon />,
                  iconPosition: 'start' as const,
                },
                {
                  label: 'Icon end',
                  disabled: false,
                  icon: <ArrowRightIcon />,
                  iconPosition: 'end' as const,
                },
                {
                  label: 'Icon end · disabled',
                  disabled: true,
                  icon: <ArrowRightIcon />,
                  iconPosition: 'end' as const,
                },
              ] as const
            ).map((row) => (
              <View key={row.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <UtilityBody size="x-small" style={{ width: 160 }}>
                  {row.label}
                </UtilityBody>
                <Link
                  variant="utility"
                  size={size}
                  disabled={row.disabled}
                  icon={row.icon}
                  iconPosition={'iconPosition' in row ? row.iconPosition : 'end'}
                >
                  Read more
                </Link>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  ),
};
