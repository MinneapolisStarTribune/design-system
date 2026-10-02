import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import { Button, Link, UtilityBody } from '@/components/index.web';
import { ArrowDiagonalIcon, CameraIcon } from '@/icons';
import { ReactNode, useState } from 'react';

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
    className: {
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
    className: undefined,
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
  className="custom-popover"
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
      <Popover.Heading>Title</Popover.Heading>

      <Popover.Description>Description</Popover.Description>
    </Popover>
  );
};

/** A titled group in All variants, matching the Core Components Popover page. */
const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <section>
    <h2 style={{ marginBottom: 24 }}>{title}</h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 40,
      }}
    >
      {children}
    </div>
  </section>
);

const Example = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <div>
    <h3 style={{ marginBottom: 8 }}>{title}</h3>
    {description && (
      <UtilityBody size="x-small" style={{ margin: '0 0 24px' }}>
        {description}
      </UtilityBody>
    )}
    <div style={{ marginTop: description ? 0 : 24 }}>{children}</div>
  </div>
);

/** Core Components names pointers by the side the arrow is on, which is opposite `placement`. */
const POINTERS = [
  { pointer: 'Left', placement: 'right' },
  { pointer: 'Top', placement: 'bottom' },
  { pointer: 'Right', placement: 'left' },
  { pointer: 'Bottom', placement: 'top' },
] as const;

/**
 * All variants
 */
export const AllVariants: Story = {
  args: {
    trigger: <Button />,
    children: null,
  },

  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 80, padding: 80 }}>
      <Group title="Variants">
        <Example title="Text only" description="A popover with only a description.">
          <Popover trigger={<Button>Open</Button>}>
            <Popover.Heading>
              <Popover.Description>Description</Popover.Description>
            </Popover.Heading>
          </Popover>
        </Example>

        <Example title="With title" description="A short title above the description.">
          <Popover trigger={<Button>Open</Button>}>
            <Popover.Heading>Title</Popover.Heading>

            <Popover.Description>Description</Popover.Description>
          </Popover>
        </Example>

        <Example
          title="With custom content"
          description="Other components in the body, such as text and a link."
        >
          <Popover trigger={<Button>Open</Button>}>
            <Popover.Heading>Title</Popover.Heading>

            <Popover.Body>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-12)',
                  paddingTop: 'var(--spacing-12)',
                }}
              >
                <UtilityBody size="x-small" style={{ margin: 0 }}>
                  Body Content
                </UtilityBody>
                <Link
                  size="small"
                  href="https://varsity.startribune.com/"
                  icon={<ArrowDiagonalIcon />}
                >
                  View link
                </Link>
              </div>
            </Popover.Body>
          </Popover>
        </Example>

        <Example
          title="Scrollable content"
          description="Long content scrolls. The header and divider stay in place."
        >
          <Popover trigger={<Button>Open</Button>}>
            <Popover.Heading>Title</Popover.Heading>

            <Popover.Divider />

            <Popover.Body>
              {Array.from({ length: 20 }).map((_, i) => (
                <UtilityBody key={i}>Item {i + 1}</UtilityBody>
              ))}
            </Popover.Body>
          </Popover>
        </Example>
      </Group>

      <Group title="Pointer">
        {POINTERS.map(({ pointer, placement }) => (
          <Example key={pointer} title={pointer} description={`placement="${placement}"`}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
              <Popover placement={placement} trigger={<Button>Open</Button>}>
                <Popover.Heading>Title</Popover.Heading>

                <Popover.Description>Description</Popover.Description>
              </Popover>
            </div>
          </Example>
        ))}
      </Group>

      <Group title="Additional examples">
        <Example title="Without close button">
          <Popover placement="top" trigger={<Button>Open</Button>}>
            <Popover.Heading showCloseButton={false}>
              <Popover.Description>Description</Popover.Description>
            </Popover.Heading>
          </Popover>
        </Example>

        <Example title="With eyebrow and value">
          <Popover trigger={<Button>Open</Button>}>
            <Popover.Heading eyebrow="Eyebrow" value="value" showCloseButton={false}>
              Title
            </Popover.Heading>

            <Popover.Divider />

            <Popover.Body>
              <dl
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-8)',
                  margin: 0,
                  paddingTop: 'var(--spacing-12)',
                }}
              >
                {[
                  { label: 'Label', value: 'value' },
                  { label: 'Label', value: 'value' },
                ].map(({ label, value }, index) => (
                  <div
                    key={index}
                    className="typography-utility-text-regular-small text-on-light-secondary"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <dt>{label}</dt>
                    <dd style={{ margin: 0 }}>{value}</dd>
                  </div>
                ))}
              </dl>
            </Popover.Body>
          </Popover>
        </Example>

        <Example title="Icon button trigger">
          <Popover
            placement="top"
            trigger={<Button variant="ghost" icon={<CameraIcon />} aria-label="Photo details" />}
          >
            <Popover.Heading>Title</Popover.Heading>

            <Popover.Description>Description</Popover.Description>
          </Popover>
        </Example>

        <Example title="Externally controlled" description="Open state comes from the parent.">
          <ControlledExample />
        </Example>
      </Group>
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
    Description
  </Popover.Description>

  <Popover.Divider />

  <Popover.Body>
    <UtilityBody>Body Content</UtilityBody>
  </Popover.Body>
</Popover>
        `,
      },
    },
  },
};
