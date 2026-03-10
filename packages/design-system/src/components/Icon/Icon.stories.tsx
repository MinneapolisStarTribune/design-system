import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { iconOptions } from './iconOptions';
import { IconName } from './iconNames';
import { ICON_COLORS } from '../../types/globalTypes';
import { allModes } from '@storybook-config/modes';

const meta = {
  title: 'Foundations/Icons',
  component: Icon,
  parameters: {
    chromatic: { modes: allModes },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(iconOptions) as IconName[],
      description: 'The name of the icon to display',
    },
    color: {
      control: 'select',
      options: [...ICON_COLORS] as string[],
      description: 'The color token for the icon',
    },
    size: {
      control: 'select',
      options: ['x-small', 'small', 'medium', 'large', 'x-large'],
      description:
        'The size of the icon (x-small: 14x14, small: 16x16, medium: 20x20, large: 24x24, x-large: 32x32)',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    name: 'camera-filled',
  },
};

export const AllVariants: Story = {
  args: {
    name: 'camera-filled',
  },
  render: () => {
    const iconNames = Object.keys(iconOptions) as IconName[];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '24px',
          padding: '24px',
        }}
      >
        {iconNames.map((iconName) => (
          <div
            key={iconName}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <Icon name={iconName} size="large" />
            <span
              style={{
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center',
                wordBreak: 'break-word',
                maxWidth: '100%',
              }}
            >
              {iconName}
            </span>
          </div>
        ))}
      </div>
    );
  },
};
