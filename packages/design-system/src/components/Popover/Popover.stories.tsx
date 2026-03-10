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
    placement: {
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
    placement: 'bottom',
    children: (
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Description>
          This is a popover. Use the Controls panel to change the pointer position.
        </Popover.Description>
      </>
    ),
  },
  parameters: {
    layout: 'centered',
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
  render: () => {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          width: '100vw',
          height: '100vh',
          boxSizing: 'border-box',
          padding: '3rem',
          gap: '3rem',
        }}
      >
        {/* Top-left quadrant: placement "right" */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Popover placement="right" trigger={<Button>Right</Button>} open>
            <Popover.Heading>Right</Popover.Heading>
            <Popover.Body>Arrow on right</Popover.Body>
          </Popover>
        </div>

        {/* Top-right quadrant: placement "left" */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Popover placement="left" trigger={<Button>Left</Button>} open>
            <Popover.Heading>Left</Popover.Heading>
            <Popover.Body>Arrow on left</Popover.Body>
          </Popover>
        </div>

        {/* Bottom-left quadrant: placement "bottom" */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Popover placement="bottom" trigger={<Button>Bottom</Button>} open>
            <Popover.Heading>Bottom</Popover.Heading>
            <Popover.Body>Arrow on bottom</Popover.Body>
          </Popover>
        </div>

        {/* Bottom-right quadrant: placement "top" */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Popover placement="top" trigger={<Button>Top</Button>} open>
            <Popover.Heading>Top</Popover.Heading>
            <Popover.Body>Arrow on top</Popover.Body>
          </Popover>
        </div>
      </div>
    );
  },
};
