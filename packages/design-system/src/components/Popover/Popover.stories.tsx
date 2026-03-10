import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import { Button } from '@/components/index.web';
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

export const Configurable: Story = {
  args: {
    trigger: <Button>Open</Button>,
    pointer: 'bottom',
    children: (
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Description>
          This is a popover. Use the Controls panel to change the pointer position.
        </Popover.Description>
      </>
    ),
  },
};

export const AllVariants: Story = {
  args: {
    trigger: <Button>Open</Button>,
    children: null,
  },
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
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
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '2rem',
        padding: '2rem',
        minHeight: '100vh',
        placeItems: 'center',
      }}
    >
      <Popover pointer="top" trigger={<Button>Top</Button>}>
        <Popover.Heading>Top</Popover.Heading>
        <Popover.Body>Arrow on top</Popover.Body>
      </Popover>

      <Popover pointer="right" trigger={<Button>Right</Button>}>
        <Popover.Heading>Right</Popover.Heading>
        <Popover.Body>Arrow on right</Popover.Body>
      </Popover>

      <Popover pointer="left" trigger={<Button>Left</Button>}>
        <Popover.Heading>Left</Popover.Heading>
        <Popover.Body>Arrow on left</Popover.Body>
      </Popover>

      <Popover pointer="bottom" trigger={<Button>Bottom</Button>}>
        <Popover.Heading>Bottom</Popover.Heading>
        <Popover.Body>Arrow on bottom</Popover.Body>
      </Popover>
    </div>
  ),
};
