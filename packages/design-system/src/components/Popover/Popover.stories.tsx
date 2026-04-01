import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import { Button, UtilityBody } from '@/components/index.web';
import { CameraIcon } from '@/icons';
import { useState } from 'react';

const meta = {
  title: 'Feedback & Status/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
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

/**
 * Playground
 */
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
    docs: {
      source: {
        code: `
<Popover
  placement="bottom"
  trigger={<Button>Open</Button>}
>
  <Popover.Heading>Title</Popover.Heading>
  <Popover.Description>
    This is a popover. Use the Controls panel to change the pointer position.
  </Popover.Description>
</Popover>
        `,
      },
    },
  },
};

/**
 * Description only
 */
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
  parameters: {
    docs: {
      source: {
        code: `
<Popover trigger={<Button>Open</Button>}>
  <Popover.Heading>
    <Popover.Description>
      This is a popover, it is opened when button is clicked.
    </Popover.Description>
  </Popover.Heading>
</Popover>
        `,
      },
    },
  },
};

/**
 * With title
 */
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
  parameters: {
    docs: {
      source: {
        code: `
<Popover trigger={<Button>Open</Button>}>
  <Popover.Heading>Title</Popover.Heading>
  <Popover.Description>
    This is a popover, it is opened when button is clicked.
  </Popover.Description>
</Popover>
        `,
      },
    },
  },
};

/**
 * Custom content
 */
export const WithCustomContent: Story = {
  args: {
    trigger: <Button>Open</Button>,
    placement: 'bottom',
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
  parameters: {
    docs: {
      source: {
        code: `
<Popover trigger={<Button>Open</Button>} placement="bottom">
  <Popover.Heading>Title</Popover.Heading>
  <Popover.Body>
    <UtilityBody size="small">Option 1</UtilityBody>
    <UtilityBody size="small">Option 2</UtilityBody>
    <UtilityBody size="small">Option 3</UtilityBody>
    <UtilityBody size="small">Option 4</UtilityBody>
    <UtilityBody size="small">Option 5</UtilityBody>
  </Popover.Body>
</Popover>
        `,
      },
    },
  },
};

/**
 * With divider
 */
export const WithDividerAndCustomContent: Story = {
  args: {
    trigger: <Button>Open</Button>,
    placement: 'bottom',
    children: (
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Divider />
        <Popover.Body>
          <UtilityBody>Sample Content popover body</UtilityBody>
        </Popover.Body>
      </>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `
<Popover trigger={<Button>Open</Button>} placement="bottom">
  <Popover.Heading>Title</Popover.Heading>
  <Popover.Divider />
  <Popover.Body>
    <UtilityBody>Sample Content popover body</UtilityBody>
  </Popover.Body>
</Popover>
        `,
      },
    },
  },
};

/**
 * Scrollable body
 */
export const ScrollableBody: Story = {
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
  parameters: {
    docs: {
      source: {
        code: `
<Popover trigger={<Button>Open</Button>}>
  <Popover.Heading>Scrollable content</Popover.Heading>
  <Popover.Description>This list is scrollable</Popover.Description>
  <Popover.Divider />
  <Popover.Body>
    {Array.from({ length: 20 }).map((_, i) => (
      <UtilityBody key={i}>Item {i + 1}</UtilityBody>
    ))}
  </Popover.Body>
</Popover>
        `,
      },
    },
  },
};

/**
 * Icon trigger
 */
export const IconPopover: Story = {
  args: {
    trigger: <CameraIcon size="large" />,
    placement: 'top',
    children: (
      <>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Description>Sample Description</Popover.Description>
        <Popover.Divider />
        <Popover.Body>
          <UtilityBody>Sample Content popover body</UtilityBody>
        </Popover.Body>
      </>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `
<Popover trigger={<CameraIcon size="large" />} placement="top">
  <Popover.Heading>Title</Popover.Heading>
  <Popover.Description>Sample Description</Popover.Description>
  <Popover.Divider />
  <Popover.Body>
    <UtilityBody>Sample Content popover body</UtilityBody>
  </Popover.Body>
</Popover>
        `,
      },
    },
  },
};

/**
 * All placements (correct version)
 */
export const AllPositions: Story = {
  args: {
    trigger: <Button />,
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
      <Popover placement="top" trigger={<Button>Top</Button>}>
        <Popover.Heading>Top</Popover.Heading>
        <Popover.Body>
          <UtilityBody>Arrow on top</UtilityBody>
        </Popover.Body>
      </Popover>

      <Popover placement="right" trigger={<Button>Right</Button>}>
        <Popover.Heading>Right</Popover.Heading>
        <Popover.Body>
          <UtilityBody>Arrow on right</UtilityBody>
        </Popover.Body>
      </Popover>

      <Popover placement="left" trigger={<Button>Left</Button>}>
        <Popover.Heading>Left</Popover.Heading>
        <Popover.Body>
          <UtilityBody>Arrow on left</UtilityBody>
        </Popover.Body>
      </Popover>

      <Popover placement="bottom" trigger={<Button>Bottom</Button>}>
        <Popover.Heading>Bottom</Popover.Heading>
        <Popover.Body>
          <UtilityBody>Arrow on bottom</UtilityBody>
        </Popover.Body>
      </Popover>
    </div>
  ),

  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

/**
 * Controlled example (important for DS)
 */
const ControlledExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>{open ? 'Close' : 'Open'}</Button>}
    >
      <Popover.Heading>Controlled</Popover.Heading>
      <Popover.Description>This popover is controlled via external state.</Popover.Description>
      <Popover.Divider />
      <Popover.Body>
        <UtilityBody>State is managed outside</UtilityBody>
      </Popover.Body>
    </Popover>
  );
};

export const Controlled: Story = {
  args: {
    trigger: <Button />,
    children: null,
  },

  render: () => <ControlledExample />,

  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = useState(false);

<Popover
  open={open}
  onOpenChange={setOpen}
  trigger={<Button>{open ? 'Close' : 'Open'}</Button>}
>
  <Popover.Heading>Controlled</Popover.Heading>
  <Popover.Description>
    This popover is controlled via external state.
  </Popover.Description>
  <Popover.Divider />
  <Popover.Body>
    <UtilityBody>State is managed outside</UtilityBody>
  </Popover.Body>
</Popover>
        `,
      },
    },
  },
};
