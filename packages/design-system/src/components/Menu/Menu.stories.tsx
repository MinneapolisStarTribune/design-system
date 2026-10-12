import { ComponentProps, ReactElement, ReactNode, useContext, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import classNames from 'classnames';
import * as Menu from './Menu';
import type { MenuLabelProps, MenuPlacement, MenuProps } from './Menu.types';
import { Button } from '@/components/Button/web/Button';
import * as Dialog from '@/components/Dialog/Dialog';
import { ARROW_OFFSETS } from '@/components/FloatingPopup/floatingPopup.types';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
import { POSITIONS as SIDES } from '@/types';
import { UtilityBody, UtilityLabel } from '@/components/Typography/Utility';
import {
  ArrowDiagonalIcon,
  AvatarIcon,
  HelpIcon,
  LogOutIcon,
  LogoStribColorIcon,
  LogoVarsityIcon,
  MenuVerticalIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
} from '@/icons';
import styles from './Menu.stories.module.scss';

/** `frame` aligns the trigger in its cell so the menu has room on the side it opens. */
const POSITIONS = [
  { label: 'Below, left edges (default)', frame: 'bottom-start', placement: 'bottom-start' },
  { label: 'Above, centered', frame: 'top', placement: 'top' },
  { label: 'Left, top edges', frame: 'left', placement: 'left-start' },
  { label: 'Right, bottom edges', frame: 'right', placement: 'right-end' },
  { label: 'hideArrow', frame: 'bottom', placement: 'bottom', hideArrow: true },
] satisfies {
  label: string;
  frame: 'bottom' | 'bottom-start' | 'top' | 'right' | 'left';
  placement: MenuPlacement;
  hideArrow?: boolean;
}[];

type DemoMenuProps = Omit<MenuProps, 'open' | 'onOpenChange' | keyof MenuLabelProps> &
  MenuLabelProps & {
    /** Starts open without a click, so All variants and its Chromatic snapshot show an open menu. */
    initialOpen?: boolean;
  };

/** Menu has no `defaultOpen`, so the demo owns the open state. */
const DemoMenu = ({ initialOpen = false, ...menuProps }: DemoMenuProps) => {
  const [open, setOpen] = useState(initialOpen);

  return <Menu.Root {...menuProps} open={open} onOpenChange={setOpen} />;
};

type ExamplePosition = Pick<MenuProps, 'placement' | 'hideArrow' | 'arrowOffset'>;

/**
 * Stand-in for `next/link` so Storybook doesn't depend on `next`.
 * In your app: `import NextLink from 'next/link'` and pass `as={NextLink}`.
 */
const StoryMockNextLink = ({
  prefetch,
  ...rest
}: ComponentProps<'a'> & { href: string; prefetch?: boolean }) => (
  <a {...rest} data-prefetch={prefetch === undefined ? undefined : String(prefetch)} />
);

/** Follows the Brand toolbar. */
const BRAND_SITES = {
  startribune: {
    label: 'Star Tribune',
    href: 'https://www.startribune.com/',
    icon: <LogoStribColorIcon size="large" />,
  },
  varsity: {
    label: 'Strib Varsity',
    href: 'https://varsity.startribune.com/',
    icon: <LogoVarsityIcon size="large" color="brand-01" />,
  },
};

const AccountItems = () => {
  const site = BRAND_SITES[useContext(DesignSystemContext)?.brand ?? 'startribune'];

  return (
    <>
      <Menu.Item href={site.href} target="_blank" rel="noreferrer">
        <Menu.ItemIcon>{site.icon}</Menu.ItemIcon>
        {site.label}
        <Menu.ItemIcon position="end">
          <ArrowDiagonalIcon />
        </Menu.ItemIcon>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item href="https://varsity.startribune.com/">
        <Menu.ItemIcon>
          <HelpIcon size="large" />
        </Menu.ItemIcon>
        Help Center
      </Menu.Item>
      <Menu.Item as={StoryMockNextLink} href="#profile" prefetch={false}>
        <Menu.ItemIcon>
          <SettingsIcon size="large" />
        </Menu.ItemIcon>
        Manage Profile
      </Menu.Item>
      <Menu.Item onClick={() => undefined}>
        <Menu.ItemIcon>
          <LogOutIcon size="large" />
        </Menu.ItemIcon>
        Log Out
      </Menu.Item>
    </>
  );
};

const ItemActionsDemo = (props: ExamplePosition) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const closeDelete = () => setDeleteOpen(false);

  return (
    <div className={styles.itemRow}>
      <DemoMenu
        {...props}
        aria-label="Item actions"
        className={styles.itemActionsMenu}
        trigger={<Button variant="ghost" icon={<MenuVerticalIcon />} aria-label="Item actions" />}
      >
        <Menu.Item onClick={() => setDeleteOpen(true)}>
          <Menu.ItemIcon>
            <TrashIcon size="large" />
          </Menu.ItemIcon>
          Delete
        </Menu.Item>
      </DemoMenu>
      <Dialog.Root open={deleteOpen} onClose={closeDelete}>
        <Dialog.Title>Delete item?</Dialog.Title>
        <Dialog.Content>
          Are you sure you want to delete this item? This cannot be undone.
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="outlined" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="error" onClick={closeDelete}>
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog.Root>
    </div>
  );
};

const ItemsDemo = (props: ExamplePosition) => {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.itemsDemo}>
      <DemoMenu
        {...props}
        aria-label="Other variations"
        className={styles.itemsMenu}
        trigger={<Button variant="outlined">Other Variations</Button>}
      >
        <Menu.Item onClick={() => undefined}>Text only</Menu.Item>
        <Menu.Item onClick={() => setCount((prev) => prev + 1)} closeOnSelect={false}>
          <Menu.ItemIcon>
            <PlusIcon />
          </Menu.ItemIcon>
          Click me (stays open)
        </Menu.Item>
        <Menu.Item disabled onClick={() => undefined}>
          <Menu.ItemIcon>
            <TrashIcon />
          </Menu.ItemIcon>
          Disabled
        </Menu.Item>
      </DemoMenu>
      <UtilityBody size="x-small">Count: {count}</UtilityBody>
    </div>
  );
};

type MenuExample = {
  label: string;
  placement?: MenuPlacement;
  render: (position: ExamplePosition) => ReactElement;
  /** Builds the docs snippet from the formatted position props. */
  code: (positionProps: string) => string;
};

/** Examples for the Configurable story. Each keeps its own position unless a control overrides it. */
const EXAMPLES = {
  account: {
    label: 'Account Items',
    placement: 'right-end',
    render: (position) => (
      <div className={styles.accountFrame}>
        <Menu.Root
          {...position}
          aria-label="Account"
          className={styles.accountMenu}
          trigger={<Button variant="ghost" icon={<AvatarIcon />} aria-label="Account" />}
        >
          <AccountItems />
        </Menu.Root>
      </div>
    ),
    code: (positionProps) => `import NextLink from 'next/link';

<Menu.Root
  trigger={<Button variant="ghost" icon={<AvatarIcon />} aria-label="Account" />}
${positionProps}  aria-label="Account"
>
  <Menu.Item href="https://varsity.startribune.com/" target="_blank" rel="noreferrer">
    <Menu.ItemIcon><LogoVarsityIcon size="large" color="brand-01" /></Menu.ItemIcon>
    Strib Varsity
    <Menu.ItemIcon position="end"><ArrowDiagonalIcon /></Menu.ItemIcon>
  </Menu.Item>
  <Menu.Divider />
  <Menu.Item href="https://varsity.startribune.com/">
    <Menu.ItemIcon><HelpIcon size="large" /></Menu.ItemIcon>
    Help Center
  </Menu.Item>
  <Menu.Item as={NextLink} href="/profile" prefetch={false}>
    <Menu.ItemIcon><SettingsIcon size="large" /></Menu.ItemIcon>
    Manage Profile
  </Menu.Item>
  <Menu.Item onClick={logOut}>
    <Menu.ItemIcon><LogOutIcon size="large" /></Menu.ItemIcon>
    Log Out
  </Menu.Item>
</Menu.Root>`,
  },
  itemActions: {
    label: 'Action Items',
    placement: 'bottom-end',
    render: (position) => <ItemActionsDemo {...position} />,
    code: (positionProps) => `const [deleteOpen, setDeleteOpen] = useState(false);

<Menu.Root
  trigger={<Button variant="ghost" icon={<MenuVerticalIcon />} aria-label="Item actions" />}
${positionProps}  aria-label="Item actions"
>
  <Menu.Item onClick={() => setDeleteOpen(true)}>
    <Menu.ItemIcon><TrashIcon size="large" /></Menu.ItemIcon>
    Delete
  </Menu.Item>
</Menu.Root>

<Dialog.Root open={deleteOpen} onClose={() => setDeleteOpen(false)}>
  <Dialog.Title>Delete item?</Dialog.Title>
  <Dialog.Content>
    Are you sure you want to delete this item? This cannot be undone.
  </Dialog.Content>
  <Dialog.Actions>
    <Button variant="outlined" onClick={() => setDeleteOpen(false)}>Cancel</Button>
    <Button color="error" onClick={deleteItem}>Delete</Button>
  </Dialog.Actions>
</Dialog.Root>`,
  },
  items: {
    label: 'Other Items',
    placement: 'right-start',
    render: (position) => <ItemsDemo {...position} />,
    code: (positionProps) => `<Menu.Root
  trigger={<Button variant="outlined">Other Variations</Button>}
${positionProps}  aria-label="Other variations"
>
  <Menu.Item onClick={onSelect}>Text only</Menu.Item>
  <Menu.Item onClick={increment} closeOnSelect={false}>
    <Menu.ItemIcon><PlusIcon /></Menu.ItemIcon>
    Click me (stays open)
  </Menu.Item>
  <Menu.Item disabled onClick={onSelect}>
    <Menu.ItemIcon><TrashIcon /></Menu.ItemIcon>
    Disabled
  </Menu.Item>
</Menu.Root>`,
  },
  list: {
    label: 'List Items',
    render: (position) => (
      <Menu.Root
        {...position}
        aria-label="Options"
        trigger={<Button variant="outlined">Scrollable List</Button>}
      >
        {Array.from({ length: 20 }, (_, index) => (
          <Menu.Item key={index} onClick={() => undefined}>
            Option {index + 1}
          </Menu.Item>
        ))}
      </Menu.Root>
    ),
    code: (positionProps) => `<Menu.Root
  trigger={<Button variant="outlined">Scrollable List</Button>}
${positionProps}  aria-label="Options"
>
  {options.map((option) => (
    <Menu.Item key={option.id} onClick={() => onSelect(option)}>
      {option.label}
    </Menu.Item>
  ))}
</Menu.Root>`,
  },
} satisfies Record<string, MenuExample>;

type ExampleKey = keyof typeof EXAMPLES;

const EXAMPLE_KEYS = Object.keys(EXAMPLES).filter((key): key is ExampleKey => key in EXAMPLES);

const isExampleKey = (value: unknown): value is ExampleKey =>
  typeof value === 'string' && value in EXAMPLES;

/** Control values win; otherwise each example keeps its own placement. */
const resolvePosition = (
  example: MenuExample,
  { placement, hideArrow, arrowOffset }: ExamplePosition
): ExamplePosition => ({
  placement: placement ?? example.placement,
  hideArrow,
  arrowOffset,
});

const formatValue = (value: unknown) =>
  typeof value === 'string'
    ? `"${value}"`
    : `{${JSON.stringify(value)
        .replace(/"([^"]+)":/g, ' $1: ')
        .replace(/"/g, "'")
        .replace(/}/g, ' }')}}`;

/** One prop per line, each ending in a newline, for the docs snippet. */
const formatPositionProps = (position: ExamplePosition) =>
  Object.entries(position)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([name, value]) => (value === true ? `  ${name}\n` : `  ${name}=${formatValue(value)}\n`))
    .join('');

const getExampleCode = (key: ExampleKey, position: ExamplePosition) => {
  const example: MenuExample = EXAMPLES[key];
  return example.code(formatPositionProps(resolvePosition(example, position)));
};

const meta = {
  title: 'Actions/Menu',
  component: Menu.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'List of actions or links that opens from a trigger. Docs: `Menu.mdx`.',
      },
    },
  },
  // Required props. Stories own the open state, so these are placeholders.
  args: {
    trigger: <Button>Open menu</Button>,
    children: null,
    'aria-label': 'Account',
  },
  argTypes: {
    trigger: {
      control: false,
      description:
        'Element that opens the menu. Menu adds the click handler, ref, and ARIA attributes.',
      table: { type: { summary: 'ReactElement' } },
    },
    open: {
      control: false,
      description: 'Controlled open state. Leave it out to let the menu manage its own state.',
      table: { type: { summary: 'boolean' } },
    },
    onOpenChange: {
      control: false,
      description: 'Called when the menu requests to open or close.',
      table: { type: { summary: '(open: boolean) => void' } },
    },
    children: {
      control: false,
      description: 'Menu content, built from `Menu.Item`, `Menu.ItemIcon` and `Menu.Divider`.',
      table: { type: { summary: 'ReactNode' } },
    },
    placement: {
      control: 'select',
      options: [undefined, ...SIDES.flatMap((side) => [side, `${side}-start`, `${side}-end`])],
      description: 'Where the menu opens relative to the anchor.',
      table: {
        type: { summary: 'Responsive<MenuPlacement>' },
        defaultValue: { summary: 'bottom-start' },
      },
    },
    hideArrow: {
      control: 'boolean',
      description: 'Hides the arrow.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    arrowOffset: {
      control: 'select',
      options: [undefined, ...ARROW_OFFSETS],
      description:
        'Sets a fixed arrow position. When not set, the arrow points at the anchor’s center.',
      table: { type: { summary: 'Responsive<start | center | end>' } },
    },
    className: {
      control: 'text',
      description: 'Classes for the menu surface.',
      table: { type: { summary: 'string' } },
    },
    portalRoot: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Menu.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

type ExampleArgs = ExamplePosition & { example: ExampleKey };

const POSITION_CONTROLS = ['placement', 'hideArrow', 'arrowOffset'];

/** Playground. The `example` control picks which menu it shows. */
export const Configurable: StoryObj<ExampleArgs> = {
  args: { example: 'account' },
  argTypes: {
    example: {
      control: {
        type: 'select',
        labels: Object.fromEntries(EXAMPLE_KEYS.map((key) => [key, EXAMPLES[key].label])),
      },
      options: EXAMPLE_KEYS,
      description: 'Which example to show. Docs only.',
    },
  },
  parameters: {
    chromatic: { disable: true },
    controls: { include: ['example', ...POSITION_CONTROLS] },
    docs: {
      source: {
        transform: (_code: string, { args }: { args: Partial<ExampleArgs> }) =>
          isExampleKey(args.example) ? getExampleCode(args.example, args) : _code,
      },
    },
  },
  render: ({ example, ...position }) => {
    const selected: MenuExample = EXAMPLES[example];
    return selected.render(resolvePosition(selected, position));
  },
};

/** A group of examples in All variants, with an optional title. */
const Group = ({
  title,
  threeColumns = false,
  children,
}: {
  title?: string;
  /** Three per row on desktop instead of two. */
  threeColumns?: boolean;
  children: ReactNode;
}) => (
  <section className={styles.group}>
    {title && (
      <UtilityLabel size="large" weight="semibold">
        {title}
      </UtilityLabel>
    )}
    <div className={classNames(styles.groupGrid, threeColumns && styles.groupGridThreeColumns)}>
      {children}
    </div>
  </section>
);

const Example = ({
  title,
  description,
  fitContent = false,
  children,
}: {
  title: string;
  description?: ReactNode;
  /** Sizes the example to its text, so full-width content matches the description. */
  fitContent?: boolean;
  children: ReactNode;
}) => (
  <div className={classNames(styles.example, fitContent && styles.exampleFitContent)}>
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

/**
 * Every example on one page for Chromatic. Only the account menu starts open: open menus compete for focus,
 * and the first outside click would close the others.
 */
export const AllVariants: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => (
    <div className={styles.page}>
      <Group>
        <Example
          title="Account Items"
          description="Links and actions related to the user’s account"
        >
          <div className={styles.accountFrame}>
            <DemoMenu
              initialOpen
              aria-label="Account"
              className={styles.accountMenu}
              placement="right-end"
              trigger={<Button variant="ghost" icon={<AvatarIcon />} aria-label="Account" />}
            >
              <AccountItems />
            </DemoMenu>
          </div>
        </Example>

        <Example
          title="Other Items"
          description="Text-only items, disabled items, and items that keep the menu open"
        >
          <ItemsDemo placement="right-start" />
        </Example>

        <Example
          fitContent
          title="Action Items"
          description="Any action that needs the user to confirm can open a confirmation dialog"
        >
          <ItemActionsDemo placement="bottom-end" />
        </Example>

        <Example
          title="List Items"
          description="Lists longer than seven items scroll inside the surface."
        >
          <DemoMenu
            aria-label="Options"
            trigger={<Button variant="outlined">Scrollable List</Button>}
          >
            {Array.from({ length: 20 }, (_, index) => (
              <Menu.Item key={index} onClick={() => undefined}>
                Option {index + 1}
              </Menu.Item>
            ))}
          </DemoMenu>
        </Example>
      </Group>

      <Group title="Positioning" threeColumns>
        {POSITIONS.map(({ label, frame, ...menuProps }) => (
          <Example key={label} title={label} description={`placement="${menuProps.placement}"`}>
            <div className={classNames(styles.positionFrame, styles[`positionFrame-${frame}`])}>
              <Menu.Root
                {...menuProps}
                aria-label={label}
                className={styles.positionMenu}
                trigger={<Button size="small">Open</Button>}
              >
                <Menu.Item onClick={() => undefined}>Item one</Menu.Item>
                <Menu.Item onClick={() => undefined}>Item two</Menu.Item>
              </Menu.Root>
            </div>
          </Example>
        ))}
      </Group>
    </div>
  ),
};
