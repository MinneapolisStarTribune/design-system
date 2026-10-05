import { ReactNode, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import { POPOVER_PLACEMENTS, Placement } from './Popover.types';
import { Button } from '@/components/Button/web/Button';
import { Link } from '@/components/Link/web/Link';
import { UtilityBody, UtilityLabel } from '@/components/Typography/Utility';
import { ArrowDiagonalIcon, CameraIcon } from '@/icons';
import styles from './Popover.stories.module.scss';

/** Core Components names pointers by the side the arrow is on, which is opposite `placement`. */
const POINTERS = [
  { pointer: 'Left', placement: 'right' },
  { pointer: 'Top', placement: 'bottom' },
  { pointer: 'Right', placement: 'left' },
  { pointer: 'Bottom', placement: 'top' },
] satisfies readonly { pointer: string; placement: Placement }[];

const DETAILS = [
  { label: 'Label', value: 'value' },
  { label: 'Label', value: 'value' },
];

const meta = {
  title: 'Feedback & Status/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Small surface that opens from a trigger with a title, description, or custom content. Docs: `Popover.mdx`.',
      },
    },
  },
  argTypes: {
    trigger: {
      control: false,
      description: 'Element that opens the popover. A single element gets the ARIA attributes.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: false,
      description:
        'Popover content, built from `Popover.Heading`, `Description`, `Divider` and `Body`.',
      table: { type: { summary: 'ReactNode' } },
    },
    placement: {
      control: 'select',
      options: [...POPOVER_PLACEMENTS],
      description: 'Side of the trigger the popover opens on.',
      table: {
        type: { summary: 'top | right | bottom | left' },
        defaultValue: { summary: 'bottom' },
      },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Stops the trigger from opening the popover.',
      table: { type: { summary: 'boolean' } },
    },
    modal: {
      control: 'boolean',
      description: 'Traps focus inside the popover. Use for action-heavy content.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Classes for the popover surface.',
      table: { type: { summary: 'string' } },
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
<Popover placement="bottom" trigger={<Button>Open</Button>}>
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
  <section className={styles.group}>
    <UtilityLabel size="large" weight="semibold">
      {title}
    </UtilityLabel>
    <div className={styles.groupGrid}>{children}</div>
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
  <div className={styles.example}>
    <UtilityLabel size="medium" weight="semibold">
      {title}
    </UtilityLabel>
    {description && (
      <UtilityBody size="x-small" className={styles.exampleDescription}>
        {description}
      </UtilityBody>
    )}
    <div className={styles.exampleContent}>{children}</div>
  </div>
);

export const AllVariants: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Each group matches a section of the Core Components Popover page: content variants, pointer positions, then heading options and trigger types.',
      },
      source: {
        code: `
<Popover trigger={<Button>Open</Button>} placement="bottom">
  <Popover.Heading>Title</Popover.Heading>

  <Popover.Description>Description</Popover.Description>

  <Popover.Divider />

  <Popover.Body>
    <UtilityBody>Body Content</UtilityBody>
  </Popover.Body>
</Popover>
        `,
      },
    },
  },
  args: { trigger: <Button />, children: null },
  render: () => (
    <div className={styles.page}>
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
              <div className={styles.customContent}>
                <UtilityBody size="x-small">Body Content</UtilityBody>
                <Link
                  size="small"
                  href="https://varsity.startribune.com/"
                  icon={<ArrowDiagonalIcon size="x-small" />}
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
              {Array.from({ length: 20 }, (_, i) => (
                <UtilityBody key={i}>Item {i + 1}</UtilityBody>
              ))}
            </Popover.Body>
          </Popover>
        </Example>
      </Group>

      <Group title="Pointer">
        {POINTERS.map(({ pointer, placement }) => (
          <Example key={pointer} title={pointer} description={`placement="${placement}"`}>
            <div className={styles.pointerFrame}>
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
              <dl className={styles.details}>
                {DETAILS.map(({ label, value }, index) => (
                  <div key={index} className={styles.detailRow}>
                    <dt>
                      <UtilityBody size="small" color="on-light-secondary">
                        {label}
                      </UtilityBody>
                    </dt>
                    <dd>
                      <UtilityBody size="small" color="on-light-secondary">
                        {value}
                      </UtilityBody>
                    </dd>
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
};
