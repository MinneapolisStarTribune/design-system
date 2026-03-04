import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, BUTTON_VARIANTS, BUTTON_COLORS, BUTTON_SIZES } from './Button';
import { AnalyticsProvider } from '@/providers/AnalyticsProvider';
import { iconOptions } from '@/components/Icon/iconOptions';
import { IconName } from '@/components/Icon/iconNames';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
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
      options: [...BUTTON_SIZES] as string[],
      description: 'The size of the button',
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
 * All button variants for Star Tribune brand (light mode) - used for Chromatic visual regression testing.
 * This story renders all combinations of variant, color, and size with the startribune brand theme in light mode.
 */
export const AllVariantsStarTribuneLight: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    brand: 'startribune',
    theme: 'light',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {BUTTON_VARIANTS.flatMap((variant) =>
        BUTTON_COLORS.flatMap((color) =>
          BUTTON_SIZES.map((size) => (
            <div
              key={`${variant}-${color}-${size}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <Button variant={variant} color={color} size={size}>
                {`${color} ${variant} ${size}`}
              </Button>
            </div>
          ))
        )
      )}
    </div>
  ),
};

/**
 * All button variants for Star Tribune brand (dark mode) - used for Chromatic visual regression testing.
 * This story renders all combinations of variant, color, and size with the startribune brand theme in dark mode.
 */
export const AllVariantsStarTribuneDark: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    brand: 'startribune',
    theme: 'dark',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {BUTTON_VARIANTS.flatMap((variant) =>
        BUTTON_COLORS.flatMap((color) =>
          BUTTON_SIZES.map((size) => (
            <div
              key={`${variant}-${color}-${size}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <Button variant={variant} color={color} size={size}>
                {`${color} ${variant} ${size}`}
              </Button>
            </div>
          ))
        )
      )}
    </div>
  ),
};

/**
 * All button variants for Varsity brand (light mode) - used for Chromatic visual regression testing.
 * This story renders all combinations of variant, color, and size with the varsity brand theme in light mode.
 */
export const AllVariantsVarsityLight: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    brand: 'varsity',
    theme: 'light',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {BUTTON_VARIANTS.flatMap((variant) =>
        BUTTON_COLORS.flatMap((color) =>
          BUTTON_SIZES.map((size) => (
            <div
              key={`${variant}-${color}-${size}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <Button variant={variant} color={color} size={size}>
                {`${color} ${variant} ${size}`}
              </Button>
            </div>
          ))
        )
      )}
    </div>
  ),
};

/**
 * All button variants for Varsity brand (dark mode) - used for Chromatic visual regression testing.
 * This story renders all combinations of variant, color, and size with the varsity brand theme in dark mode.
 */
export const AllVariantsVarsityDark: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    brand: 'varsity',
    theme: 'dark',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {BUTTON_VARIANTS.flatMap((variant) =>
        BUTTON_COLORS.flatMap((color) =>
          BUTTON_SIZES.map((size) => (
            <div
              key={`${variant}-${color}-${size}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <Button variant={variant} color={color} size={size}>
                {`${color} ${variant} ${size}`}
              </Button>
            </div>
          ))
        )
      )}
    </div>
  ),
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
