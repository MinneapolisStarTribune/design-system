import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, type IconProps } from './Icon';
import { iconOptions } from './iconOptions';
import { IconName } from './iconNames';
import { ICON_COLORS } from '../../types/globalTypes';

const meta = {
  title: 'Foundations/Icons',
  component: Icon,
  parameters: {},
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
      options: ['small', 'medium', 'large'],
      description: 'The size of the icon (small: 14x14, medium: 16x16, large: 24x24)',
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
  parameters: {
    controls: { disable: true },
  },
  args: {
    name: 'camera-filled',
    size: 'large',
  },
  render: (args: IconProps) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem',
      }}
    >
      {['small', 'medium', 'large'].map((size) => (
        <div
          key={size}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Size: {size}</span>
          <Icon name={args.name} size={size as 'small' | 'medium' | 'large'} />
        </div>
      ))}
      {ICON_COLORS.map((color) => {
        const isOnDark = color.includes('on-dark');
        return (
          <div
            key={color}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: isOnDark ? '#000000' : 'transparent',
            }}
          >
            <Icon name={args.name} color={color} size={args.size} />
            <span
              style={{
                fontSize: '0.75rem',
                color: isOnDark ? '#ffffff' : '#6b7280',
                textAlign: 'center',
                wordBreak: 'break-word',
                maxWidth: '100%',
              }}
            >
              {color}
            </span>
          </div>
        );
      })}
    </div>
  ),
};
