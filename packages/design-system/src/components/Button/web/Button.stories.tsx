import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Button,
  BUTTON_VARIANTS,
  BUTTON_COLORS,
  BUTTON_SIZES,
  ICON_ONLY_BUTTON_SIZES,
  type ButtonSize,
  type IconOnlyButtonSize,
} from './Button';
import { AnalyticsProvider } from '@/providers/AnalyticsProvider';
import { iconOptions } from '@/components/Icon/iconOptions';
import { IconName } from '@/components/Icon/iconNames';
import { NewsHeading } from '@/components/index.web';
import { allModes } from '@storybook-config/modes';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    chromatic: { modes: allModes },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The button label text',
    },
    variant: {
      control: 'select',
      options: [...BUTTON_VARIANTS] as string[],
      description: 'The visual style variant of the button',
    },
    color: {
      control: 'select',
      options: [...BUTTON_COLORS] as string[],
      description: 'The color token for the button',
    },
    size: {
      control: 'select',
      options: [...ICON_ONLY_BUTTON_SIZES] as string[],
      description: 'The size of the button. Note: "x-small" is only valid for icon-only buttons.',
    },
    icon: {
      control: 'select',
      options: Object.keys(iconOptions) as IconName[],
      description: 'The icon to display in the button',
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'The position of the icon relative to the text',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    capitalize: {
      control: 'boolean',
      description: 'Whether to capitalize the button text',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    children: 'See More',
    onClick: () => alert('Hello'),
    variant: 'filled',
    size: 'large',
    color: 'brand',
    icon: undefined,
    iconPosition: 'end',
    isDisabled: false,
    capitalize: false,
  },
};

/**
 * Button with analytics tracking enabled. Click the button and check the browser console
 * to see the tracking event payload. In production, brands wire this to GA4, Piano, etc.
 */
export const ButtonWithAnalytics: Story = {
  args: {
    children: 'Subscribe',
    onClick: () => alert('Subscribed!'),
    variant: 'filled',
    color: 'brand',
    icon: 'arrow-right',
    iconPosition: 'end',
    analytics: { cta_type: 'subscribe', module_position: 'hero' },
  },
  decorators: [
    (Story) => (
      <AnalyticsProvider
        onTrackingEvent={(event) => {
          // eslint-disable-next-line no-console
          console.log('[Analytics] Button click:', event);
        }}
      >
        <Story />
      </AnalyticsProvider>
    ),
  ],
};

/**
 * Helper function to render a section of buttons (text-only, with icons, or icon-only)
 */
function renderButtonSection(
  title: string,
  sizes: readonly (ButtonSize | IconOnlyButtonSize)[],
  iconOnly: boolean,
  withIcon: boolean
) {
  return (
    <div>
      <NewsHeading importance={2}>{title}</NewsHeading>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {BUTTON_VARIANTS.flatMap((variant) =>
          BUTTON_COLORS.map((color) => (
            <div
              key={`${variant}-${color}`}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${sizes.length}, 1fr)`,
                gap: '1rem',
              }}
            >
              {sizes.map((size) => (
                <div
                  key={`${variant}-${color}-${size}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  {iconOnly ? (
                    <Button
                      variant={variant}
                      color={color}
                      size={size as IconOnlyButtonSize}
                      icon="avatar"
                    />
                  ) : (
                    <Button
                      variant={variant}
                      color={color}
                      size={size as ButtonSize}
                      icon={withIcon ? 'avatar' : undefined}
                    >
                      {`${color} ${variant} ${size}`}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * All button variants - used for Chromatic visual regression testing.
 * Chromatic captures a snapshot for each brand/theme mode (star-tribune-light, star-tribune-dark,
 * varsity-light, varsity-dark) via chromatic.modes. Use the Brand and Theme toggles in the
 * toolbar to preview different combinations.
 */
export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <div style={{ padding: '2rem' }}>
      {renderButtonSection('All Text Buttons', BUTTON_SIZES, false, false)}
      {renderButtonSection('All Text Buttons with Icons', BUTTON_SIZES, false, true)}
      {renderButtonSection('All Icon Only Buttons', ICON_ONLY_BUTTON_SIZES, true, false)}
    </div>
  ),
};
