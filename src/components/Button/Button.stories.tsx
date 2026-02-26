import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, BUTTON_VARIANTS, BUTTON_COLORS, BUTTON_SIZES } from './Button';
import { AnalyticsProvider } from '../../providers/AnalyticsProvider';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [...BUTTON_VARIANTS] as string[],
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
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfigurableButton: Story = {
  args: {
    label: 'See More',
    onClick: () => alert('Hello'),
    variant: 'filled',
    size: 'large',
    color: 'brand',
  },
};

export const WithIcon: Story = {
  args: {
    ...ConfigurableButton.args,
    icon: 'camera-filled',
    iconPosition: 'start',
  },
};

export const ButtonWithIcon: Story = {
  args: {
    label: 'View All Sports Hubs',
    onClick: () => alert('Clicked'),
    variant: 'filled',
    icon: 'camera-filled',
    iconPosition: 'start',
  },
};

/**
 * Button with analytics tracking enabled. Click the button and check the browser console
 * to see the tracking event payload. In production, brands wire this to GA4, Piano, etc.
 */
export const ButtonWithAnalytics: Story = {
  args: {
    label: 'Subscribe',
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
