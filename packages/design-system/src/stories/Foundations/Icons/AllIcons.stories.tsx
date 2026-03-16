import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import * as Icons from '@/icons';

const iconEntries = Object.entries(Icons).filter(
  (entry): entry is [string, React.FunctionComponent<React.SVGProps<SVGSVGElement>>] =>
    typeof entry[1] === 'function' && entry[0].endsWith('Icon')
);

const meta = {
  title: 'Foundations/Icons',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Gallery of all available icons. Import only the ones you need.`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: 16,
        padding: 24,
      }}
    >
      {iconEntries.map(([name, IconComponent]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: 12,
            border: '1px solid #eee',
            borderRadius: 8,
          }}
        >
          <IconComponent width={24} height={24} aria-hidden />
          <span style={{ fontSize: 11, textAlign: 'center', wordBreak: 'break-word' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
