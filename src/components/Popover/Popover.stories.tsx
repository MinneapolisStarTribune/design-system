import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Button } from '@mantine/core';
import { Popover } from './Popover';
import { Icon } from '../index';
const meta = {
  title: 'Feedback & Status/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: false },
    children: { control: false },
    pointer: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextOnly: Story = {
  args: {
    trigger: <Button>Open</Button>,
    children: (
      <Popover.Heading>
        <Popover.Description>
          This is a popover, it is opened when button is clicked.
        </Popover.Description>
      </Popover.Heading>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    trigger: <Button>Open</Button>,
    children: (
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Description>
          This is a popover, it is opened when button is clicked.
        </Popover.Description>
      </>
    ),
  },
};

export const WithCustomContent: Story = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: 120,
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    trigger: <Button>Open</Button>,
    pointer: 'bottom',
    children: (
      <>
        <Popover.Heading>Title</Popover.Heading>

        <Popover.Body>
          <Box>Option 1</Box>
          <Box>Option 2</Box>
          <Box>Option 3</Box>
        </Popover.Body>
      </>
    ),
  },
};

export const WithDividerAndCustomContent: Story = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: 120,
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    trigger: <Button>Open</Button>,
    children: (
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>
          <Box>Sample Content popover body</Box>
        </Popover.Body>
      </>
    ),
    pointer: 'bottom',
  },
};

export const ScrollableBody: Story = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: 120,
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    trigger: <Button>Open</Button>,
    children: (
      <>
        <Popover.Heading>Scrollable content</Popover.Heading>
        <Popover.Description>This list is scrollable</Popover.Description>

        <Popover.Divider />

        <Popover.Body>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>Item {i + 1}</div>
          ))}
        </Popover.Body>
      </>
    ),
  },
};

export const IconPopover: Story = {
  parameters: {
    layout: 'centered',
  },
  args: {
    trigger: <Icon name="camera" />,
    children: (
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>
          <Box>Sample Description</Box>
        </Popover.Body>
        <Popover.Divider />
        <Popover.Body>
          <Box>Sample Content popover body</Box>
        </Popover.Body>
      </>
    ),
    pointer: 'top',
  },
};

export const AllPositions: Story = {
  args: {
    trigger: null,
    children: null,
  },

  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 120,
        padding: 160,
        minHeight: '100vh',
        placeItems: 'center',
      }}
    >
      {/* TOP */}
      <Popover
        pointer="top"
        trigger={<Button>Top</Button>}
        // middlewares={{ flip: false, shift: false }}
      >
        <Popover.Heading>Top</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>Arrow on top</Popover.Body>
      </Popover>

      {/* RIGHT */}
      <Popover
        pointer="right"
        trigger={<Button>Right</Button>}
        // middlewares={{ flip: false, shift: false }}
      >
        <Popover.Heading>Right</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>Arrow on right</Popover.Body>
      </Popover>

      {/* LEFT */}
      <Popover
        pointer="left"
        trigger={<Button>Left</Button>}
        // middlewares={{ flip: false, shift: false }}
      >
        <Popover.Heading>Left</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>Arrow on left</Popover.Body>
      </Popover>

      {/* BOTTOM */}
      <Popover
        pointer="bottom"
        trigger={<Button>Bottom</Button>}
        // middlewares={{ flip: false, shift: false }}
      >
        <Popover.Heading>Bottom</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>Arrow on bottom</Popover.Body>
      </Popover>
    </div>
  ),

  parameters: {
    layout: 'fullscreen',
    controls: {
      exclude: ['pointer', 'trigger', 'children'],
    },
  },
};
