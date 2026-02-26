import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Button } from '@mantine/core';
import { Popover } from './Popover';
import { Icon, UtilityBody } from '../index';

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
      <div>
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
          <UtilityBody size="small">Option 1</UtilityBody>
          <UtilityBody size="small">Option 2</UtilityBody>
          <UtilityBody size="small">Option 3</UtilityBody>
          <UtilityBody size="small">Option 4</UtilityBody>
          <UtilityBody size="small">Option 5</UtilityBody>
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
          <UtilityBody>Sample Content popover body</UtilityBody>
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
            <UtilityBody key={i}>Item {i + 1}</UtilityBody>
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
        <Popover.Description>
          <Box>Sample Description</Box>
        </Popover.Description>
        <Popover.Divider />
        <Popover.Body>
          <UtilityBody>Sample Content popover body</UtilityBody>
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
        <Popover.Body>
          <UtilityBody>Arrow on top</UtilityBody>
        </Popover.Body>
      </Popover>

      {/* RIGHT */}
      <Popover
        pointer="right"
        trigger={<Button>Right</Button>}
        // middlewares={{ flip: false, shift: false }}
      >
        <Popover.Heading>Right</Popover.Heading>
        <Popover.Body>
          <UtilityBody>Arrow on right</UtilityBody>
        </Popover.Body>
      </Popover>

      {/* LEFT */}
      <Popover
        pointer="left"
        trigger={<Button>Left</Button>}
        // middlewares={{ flip: false, shift: false }}
      >
        <Popover.Heading>Left</Popover.Heading>
        <Popover.Body>
          <UtilityBody>Arrow on left</UtilityBody>
        </Popover.Body>
      </Popover>

      {/* BOTTOM */}
      <Popover
        pointer="bottom"
        trigger={<Button>Bottom</Button>}
        // middlewares={{ flip: false, shift: false }}
      >
        <Popover.Heading>Bottom</Popover.Heading>
        <Popover.Body>
          <UtilityBody>Arrow on bottom</UtilityBody>
        </Popover.Body>
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
