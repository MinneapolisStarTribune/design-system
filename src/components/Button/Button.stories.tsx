import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, BUTTON_VARIANTS, BUTTON_COLORS, BUTTON_SIZES } from './Button';
import { AnalyticsProvider } from '../../providers/AnalyticsProvider';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Analytics-ready: Button emits `button_click` events on click. Brands wrap with `AnalyticsProvider` and merge with page metadata. See "With Analytics" story.',
      },
    },
  },
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
    analytics: {
      description:
        'Per-button tracking data merged into the event. Use to distinguish buttons (e.g. cta_type, module_name).',
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

export const WithPerButtonAnalytics: Story = {
  args: {
    label: 'Subscribe',
    variant: 'filled',
    color: 'brand',
    analytics: { cta_type: 'subscribe', module_position: 'hero' },
  },
  decorators: [
    (Story) => (
      <AnalyticsProvider
        onTrackingEvent={(event) => {
          console.log('[Analytics] Event with custom data:', event);
        }}
      >
        <Story />
      </AnalyticsProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Pass `analytics` prop to add per-button tracking data. Each button can send different context (cta_type, module_name, etc.).',
      },
    },
  },
};

export const WithAnalytics: Story = {
  args: {
    label: 'Subscribe',
    variant: 'filled',
    color: 'brand',
  },
  decorators: [
    (Story) => (
      <AnalyticsProvider
        onTrackingEvent={(event) => {
          console.log('[Analytics] Event received:', event);
        }}
      >
        <Story />
      </AnalyticsProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'With AnalyticsProvider, clicks emit tracking events. Open DevTools console to see the payload brands would receive (event, component, label, etc.).',
      },
    },
  },
};
