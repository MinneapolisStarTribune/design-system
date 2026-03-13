import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import type { IconColor, IconSize, IconWrapperProps } from '@/components/Icon/Icon.types';
import { CameraIcon } from '@/icons';
import * as Icons from '@/icons';
import { UtilityLabel } from '@/components/index.web';

const iconEntries = Object.entries(Icons).filter(
  (entry): entry is [string, React.FunctionComponent<IconWrapperProps>] =>
    typeof entry[1] === 'function' && entry[0].endsWith('Icon')
);

const meta = {
  title: 'Foundations/Icons',
  component: CameraIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Import icons from the barrel; use \`size\` and \`color\` with design-system tokens (e.g. \`<CameraIcon size="small" color="on-dark-secondary" />\`). Defaults: size \`medium\`, color \`on-light-primary\`.`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CameraIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    size: 'medium',
    color: 'on-light-primary',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['x-small', 'small', 'medium', 'large', 'x-large'] satisfies IconSize[],
    },
    color: {
      control: 'select',
      options: [
        'on-light-primary',
        'on-light-secondary',
        'on-light-tertiary',
        'on-dark-primary',
        'on-dark-secondary',
        'on-dark-tertiary',
        'brand-01',
        'brand-02',
        'brand-03',
        'state-attention-on-light',
        'state-attention-on-dark',
        'state-disabled-on-light',
        'state-disabled-on-dark',
      ] satisfies IconColor[],
    },
  },
  render: (args) => <CameraIcon {...args} aria-hidden />,
};

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
          <IconComponent size="large" aria-hidden />
          <UtilityLabel
            size="small"
            weight="regular"
            capitalize={false}
            style={{ wordBreak: 'break-word' }}
          >
            {name}
          </UtilityLabel>
        </div>
      ))}
    </div>
  ),
};
