import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentType, type FC } from 'react';
import {
  UtilityButton,
  UTILITY_BUTTON_VARIANTS,
  UTILITY_BUTTON_SIZES,
  type UtilityButtonSize,
} from './UtilityButton';
import { BookmarkIcon, FlagIcon, HomeIcon, Share02Icon, StarIcon, VolumeIcon } from '@/icons';
import { allModes } from '@storybook-config/modes';

/** Outline-only icons for the demo (toggle + active swaps to filled when a pair exists in the design system). */
const CONFIGURABLE_ICON_OPTIONS = [
  'share02',
  'bookmark',
  'star',
  'home',
  'flag',
  'volume',
] as const;
type ConfigurableIconChoice = (typeof CONFIGURABLE_ICON_OPTIONS)[number];

type ConfigurableIconComponent = FC<Record<string, never>>;

const CONFIGURABLE_ICON_COMPONENTS: Record<ConfigurableIconChoice, ConfigurableIconComponent> = {
  share02: Share02Icon,
  bookmark: BookmarkIcon,
  star: StarIcon,
  home: HomeIcon,
  flag: FlagIcon,
  volume: VolumeIcon,
};

const ToggleInteractiveDemo = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        alignItems: 'flex-start',
      }}
    >
      <UtilityButton
        label={isActive ? 'Saved' : 'Save'}
        icon={<BookmarkIcon />}
        variant="toggle"
        size="small"
        active={isActive}
        onClick={() => setIsActive((prev) => !prev)}
      />
      <span style={{ fontSize: '12px', color: '#6b7280' }}>
        Click the button to toggle its pressed state (`aria-pressed`).
      </span>
    </div>
  );
};

/** Story-only args for configurable demo */
type ConfigurableArgs = {
  label?: string;
  ariaLabel?: string;
  variant: (typeof UTILITY_BUTTON_VARIANTS)[number];
  active: boolean;
  size: UtilityButtonSize;
  showIcon: boolean;
  iconChoice: ConfigurableIconChoice;
  iconPosition: 'start' | 'end';
  isDisabled: boolean;
  onClick: () => void;
};

const meta: Meta<ConfigurableArgs> = {
  title: 'Actions/Utility Button',
  component: UtilityButton as ComponentType<ConfigurableArgs>,
  parameters: {
    docs: {
      description: {
        component:
          'A compact, lightweight control designed for dense UI surfaces like navigation bars, toolbars, and cards. Supports icon-only and icon + label configurations. Pill shape with transparent background.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button label. Omit for icon-only button.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Required for icon-only buttons. Screen reader label.',
    },
    variant: {
      control: 'select',
      options: [...UTILITY_BUTTON_VARIANTS] as string[],
      description: 'Visual style variant.',
    },
    active: {
      control: 'boolean',
      description:
        'Pressed/active visuals (icon and text tokens). Only used when variant is "toggle"; default and link variants ignore this prop.',
      if: { arg: 'variant', eq: 'toggle' },
    },
    size: {
      control: 'select',
      options: [...UTILITY_BUTTON_SIZES] as string[],
      description: 'Button size',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show an icon',
    },
    iconChoice: {
      control: 'select',
      options: [...CONFIGURABLE_ICON_OPTIONS],
      description:
        'Outline icon only. With variant "toggle" and active on, bookmark/star/home/flag/volume use their filled asset; share02 has no filled pair.',
      if: { arg: 'showIcon' },
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Position of icon relative to label',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    label: 'Share',
    ariaLabel: 'Share',
    variant: 'default',
    active: false,
    size: 'large',
    showIcon: true,
    iconChoice: 'share02',
    iconPosition: 'start',
    isDisabled: false,
    onClick: () => {},
  } as ConfigurableArgs,
  parameters: {
    docs: {
      source: {
        code: `<UtilityButton
  label="Share"
  variant="default"
  size="large"
  iconPosition="start"
  isDisabled={false}
  onClick={() => {}}
  icon={<Share02Icon />}
  aria-label="Share"
/>`,
      },
    },
  },
  render: (args) => {
    const { showIcon, ariaLabel, iconChoice } = args as ConfigurableArgs;
    const IconComponent = CONFIGURABLE_ICON_COMPONENTS[iconChoice] ?? Share02Icon;
    const icon = showIcon ? <IconComponent /> : undefined;
    const resolvedAriaLabel = !args.label && icon ? ariaLabel : undefined;
    if (args.variant === 'toggle') {
      return (
        <UtilityButton
          label={args.label}
          variant="toggle"
          active={args.active}
          size={args.size}
          iconPosition={args.iconPosition}
          isDisabled={args.isDisabled}
          onClick={args.onClick}
          icon={icon}
          aria-label={resolvedAriaLabel}
        />
      );
    }

    return (
      <UtilityButton
        label={args.label}
        variant={args.variant}
        size={args.size}
        iconPosition={args.iconPosition}
        isDisabled={args.isDisabled}
        onClick={args.onClick}
        icon={icon}
        aria-label={resolvedAriaLabel}
      />
    );
  },
};

/**
 * All UtilityButton variants - used for Chromatic visual regression testing.
 */
export const AllVariants: Story = {
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>
          Default - Icon + Label
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <UtilityButton label="Share" icon={<Share02Icon />} size="small" />
          <UtilityButton label="Share" icon={<Share02Icon />} size="large" />
          <UtilityButton label="Share" icon={<Share02Icon />} size="small" iconPosition="end" />
          <UtilityButton label="Share" icon={<Share02Icon />} size="large" iconPosition="end" />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Icon Only</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <UtilityButton icon={<Share02Icon />} size="small" aria-label="Share" />
          <UtilityButton icon={<Share02Icon />} size="large" aria-label="Share" />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>
          Label Only (no icon)
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <UtilityButton label="Share" size="small" />
          <UtilityButton label="Share" size="large" />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Disabled</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <UtilityButton label="Share" icon={<Share02Icon />} size="small" isDisabled />
          <UtilityButton label="Share" icon={<Share02Icon />} size="large" isDisabled />
          <UtilityButton icon={<Share02Icon />} size="large" aria-label="Share" isDisabled />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>
          Toggle (inactive / active)
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <UtilityButton label="Save" icon={<BookmarkIcon />} variant="toggle" active={false} />
          <UtilityButton label="Saved" icon={<BookmarkIcon />} variant="toggle" active />
          <UtilityButton
            label="Save"
            icon={<BookmarkIcon />}
            variant="toggle"
            active={false}
            isDisabled
          />
          <UtilityButton label="Saved" icon={<BookmarkIcon />} variant="toggle" active isDisabled />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>
          Toggle (interactive)
        </h3>
        <ToggleInteractiveDemo />
      </div>
    </div>
  ),
};
