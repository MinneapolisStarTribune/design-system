import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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

export const AllSizes: Story = {
  args: {
    name: 'camera-filled',
  },
  render: (args: IconProps) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon name={args.name} size="small" />
        <span style={{ fontSize: '12px' }}>Small (14x14)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon name={args.name} size="medium" />
        <span style={{ fontSize: '12px' }}>Medium (16x16)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon name={args.name} size="large" />
        <span style={{ fontSize: '12px' }}>Large (24x24)</span>
      </div>
    </div>
  ),
};

export const ColorVariants: Story = {
  args: {
    name: 'camera-filled',
    size: 'large',
  },
  render: (args: IconProps) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '24px',
        padding: '24px',
      }}
    >
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
                fontSize: '12px',
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

export const IconGallery: Story = {
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
