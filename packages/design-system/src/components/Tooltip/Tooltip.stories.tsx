import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '@/components/index.web';
import { InformationIcon, HelpIcon } from '@/icons';

const meta = {
  title: 'Feedback & Status/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
    label: {
      control: 'text',
    },
    pointer: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    icon: { control: false },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
    },
    isDisabled: {
      control: 'boolean',
    },
    showDelay: {
      control: 'number',
    },
    hideDelay: {
      control: 'number',
    },
    wrapperClassName: {
      control: 'text',
    },
    contentClassName: {
      control: 'text',
    },
    labelClassName: {
      control: 'text',
    },
    iconClassName: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic Tooltip
 */
export const Configurable: Story = {
  args: {
    label: 'Tooltip',
    pointer: 'top',
    icon: <InformationIcon size="small" color="on-dark-primary" />,
    iconPosition: 'start',
    children: <Button>Hover me</Button>,
  },
  parameters: {
    docs: {
      source: {
        code: `
<Tooltip label="Hover or focus for more information">
  <Button>Hover me</Button>
</Tooltip>
        `,
      },
    },
  },
};

/**
 * All Variants - Shows all placements and key variations
 */
export const AllVariants: Story = {
  args: {
    children: <Button>Variants</Button>,
    label: 'All positions',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '80px',
        padding: '80px',
        justifyContent: 'center',
      }}
    >
      {/* Top Placement */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        <Tooltip label="Top position" pointer="top">
          <Button>Top</Button>
        </Tooltip>
      </div>

      {/* Right Placement */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Tooltip label="Right position" pointer="right">
          <Button>Right</Button>
        </Tooltip>
      </div>

      {/* Bottom Placement */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Tooltip label="Bottom position" pointer="bottom">
          <Button>Bottom</Button>
        </Tooltip>
      </div>

      {/* Left Placement */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Tooltip label="Left position" pointer="left">
          <Button>Left</Button>
        </Tooltip>
      </div>

      {/* With Icon Start */}
      <Tooltip
        label="With icon"
        icon={<InformationIcon size="small" color="on-dark-primary" />}
        iconPosition="start"
      >
        <Button>Icon Start</Button>
      </Tooltip>

      {/* With Icon End */}
      <Tooltip
        label="With icon"
        icon={<InformationIcon size="small" color="on-dark-primary" />}
        iconPosition="end"
      >
        <Button>Icon End</Button>
      </Tooltip>

      {/* Icon Button */}
      <Tooltip label="Help" pointer="top">
        <Button icon={<HelpIcon />} variant="ghost" />
      </Tooltip>

      {/* Disabled */}
      <Tooltip label="Disabled tooltip" isDisabled>
        <Button disabled>Disabled</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `
<Tooltip label="Top position" pointer="top">
  <Button>Top</Button>
</Tooltip>

<Tooltip label="Right position" pointer="right">
  <Button>Right</Button>
</Tooltip>

<Tooltip label="Bottom position" pointer="bottom">
  <Button>Bottom</Button>
</Tooltip>

<Tooltip label="Left position" pointer="left">
  <Button>Left</Button>
</Tooltip>

<Tooltip label="With icon" icon={<InformationIcon />} iconPosition="start">
  <Button>Icon Start</Button>
</Tooltip>

<Tooltip label="Help" pointer="top">
  <Button icon={<HelpIcon />} variant="ghost" />
</Tooltip>
        `,
      },
    },
  },
};
