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
    wrapperClassName: {
      control: 'text',
    },
    containerClassName: {
      control: 'text',
    },
    contentClassName: {
      control: 'text',
    },
    arrowClassName: {
      control: 'text',
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
    containerClassName: undefined,
    contentClassName: undefined,
    wrapperClassName: undefined,
    arrowClassName: undefined,
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
  containerClassName="custom-container"
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

// `Popover` has no built-in notion of "external" triggering — a consumer wanting that composes
// it themselves via the existing controlled `open`/`onOpenChange` props, exactly as shown here.
// `isExternallyTriggered` is just local state distinguishing "opened by some other trigger" from
// "opened by clicking this popover's own trigger", so the right content renders either way.
const ExternalTriggerExample = () => {
  const [open, setOpen] = useState(false);
  const [isExternallyTriggered, setIsExternallyTriggered] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setIsExternallyTriggered(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Popover open={open} onOpenChange={handleOpenChange} trigger={<Button>Open</Button>}>
        {isExternallyTriggered ? (
          <Popover.ExternalContent
            icon={<CameraIcon />}
            heading="Externally triggered"
            description="This content was shown by an external caller setting open=true, not by clicking the trigger."
            dismissText="Got it"
          />
        ) : (
          <>
            <Popover.Heading>Title</Popover.Heading>

            <Popover.Body>
              <UtilityBody>Normal content, shown when opened by clicking the trigger.</UtilityBody>
            </Popover.Body>
          </>
        )}
      </Popover>

      <Button
        variant="outlined"
        onClick={() => {
          setIsExternallyTriggered(true);
          setOpen(true);
        }}
      >
        Trigger externally
      </Button>
    </div>
  );
};

const AnchorOnlyExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.ExternalContent
          icon={<CameraIcon />}
          heading="Anchor-only popover"
          description="This popover has no trigger element at all — it can only ever be opened via a controlled open prop."
          dismissText="Got it"
        />
      </Popover>

      <Button onClick={() => setOpen(true)}>Trigger anchor-only popover</Button>
    </>
  );
};

/**
 * All variants
 */
export const AllVariants: Story = {
  args: {
    trigger: <Button />,
    children: null,
  },

  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 80,
        padding: 80,
        width: '100%',
      }}
    >
      <div>
        <h3 style={{ marginBottom: 24 }}>Description only</h3>

        <Popover trigger={<Button>Open</Button>}>
          <Popover.Heading>
            <Popover.Description>
              This is a popover, it is opened when button is clicked.
            </Popover.Description>
          </Popover.Heading>
        </Popover>
      </div>

      <div>
        <h3 style={{ marginBottom: 24 }}>With title</h3>

        <Popover trigger={<Button>Open</Button>}>
          <Popover.Heading>Title</Popover.Heading>

          <Popover.Description>
            This is a popover, it is opened when button is clicked.
          </Popover.Description>
        </Popover>
      </div>

      <div>
        <h3 style={{ marginBottom: 24 }}>Custom content</h3>

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
      </div>

      <div>
        <h3 style={{ marginBottom: 24 }}>With divider</h3>

        <Popover trigger={<Button>Open</Button>} placement="bottom">
          <Popover.Heading>Title</Popover.Heading>

          <Popover.Divider />

          <Popover.Body>
            <UtilityBody>Sample Content popover body</UtilityBody>
          </Popover.Body>
        </Popover>
      </div>

      <div>
        <h3 style={{ marginBottom: 24 }}>Scrollable body</h3>

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
      </div>

      <div>
        <h3 style={{ marginBottom: 24 }}>Icon trigger</h3>

        <Popover trigger={<CameraIcon size="large" />} placement="top">
          <Popover.Heading>Title</Popover.Heading>

          <Popover.Description>Sample Description</Popover.Description>

          <Popover.Divider />

          <Popover.Body>
            <UtilityBody>Sample Content popover body</UtilityBody>
          </Popover.Body>
        </Popover>
      </div>

      <div>
        <h3 style={{ marginBottom: 24 }}>All placements</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 120,
            padding: 80,
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
      </div>

      <div>
        <h3 style={{ marginBottom: 24 }}>Controlled</h3>

        <ControlledExample />
      </div>

      <div>
        <h3 style={{ marginBottom: 24 }}>
          Externally triggered (controlled open + Popover.ExternalContent)
        </h3>

        <ExternalTriggerExample />
      </div>

      <div>
        <h3 style={{ marginBottom: 24 }}>Anchor-only (no trigger, external open only)</h3>

        <AnchorOnlyExample />
      </div>
    </div>
  ),

  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      source: {
        code: `
<Popover
  trigger={<Button>Open</Button>}
  placement="bottom"
>
  <Popover.Heading>Title</Popover.Heading>

  <Popover.Description>
    Sample description
  </Popover.Description>

  <Popover.Divider />

  <Popover.Body>
    <UtilityBody>Sample Content</UtilityBody>
  </Popover.Body>
</Popover>
        `,
      },
    },
  },
};
