import { ComponentProps, ReactElement, ReactNode, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import classNames from 'classnames';
import * as Menu from './Menu';
import { MENU_ARROW_OFFSETS, MENU_PLACEMENTS } from './Menu.constants';
import type { MenuLabelProps, MenuPlacement, MenuProps } from './Menu.types';
import { Button } from '@/components/Button/web/Button';
import { UtilityBody, UtilityLabel } from '@/components/Typography/Utility';
import {
  ArrowDiagonalIcon,
  CopyIcon,
  EditIcon,
  HelpIcon,
  LinkIcon,
  LogOutIcon,
  LogoVarsityIcon,
  MenuVerticalIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
} from '@/icons';
import styles from './Menu.stories.module.scss';

const OPEN_RIGHT = { placement: 'right-start' } as const;

/** `frame` aligns the trigger in its cell so the menu has room on the side it opens. */
const POSITIONS = [
  { label: 'Below, left edges (default)', frame: 'bottom', placement: 'bottom-start' },
  { label: 'Above, centered', frame: 'top', placement: 'top' },
  { label: 'Right, bottom edges', frame: 'right', placement: 'right-end' },
  { label: 'Left, top edges', frame: 'left', placement: 'left-start' },
  { label: 'hideArrow', frame: 'bottom', placement: 'bottom', hideArrow: true },
] satisfies {
  label: string;
  frame: 'bottom' | 'top' | 'right' | 'left';
  placement: MenuPlacement;
  hideArrow?: boolean;
}[];

type DemoProps = Omit<MenuProps, 'open' | 'onOpen' | 'onClose' | keyof MenuLabelProps> &
  MenuLabelProps & {
    /** Starts open without a click, e.g. for Chromatic snapshots. */
    initialOpen?: boolean;
  };

/** Owns the open state so each story only passes the trigger and menu props. */
const MenuDemo = ({ initialOpen = false, ...menuProps }: DemoProps) => {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Menu.Root
      {...menuProps}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    />
  );
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

const AccountItems = () => (
  <>
    <Menu.Item href="https://varsity.startribune.com/" target="_blank" rel="noreferrer">
      <Menu.ItemIcon>
        <HelpIcon size="large" />
      </Menu.ItemIcon>
      Help Center
      <Menu.ItemIcon position="end">
        <ArrowDiagonalIcon />
      </Menu.ItemIcon>
    </Menu.Item>
    <Menu.Divider />
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

const RowActionItems = () => (
  <>
    <Menu.Item onClick={() => undefined}>
      <Menu.ItemIcon>
        <EditIcon size="large" />
      </Menu.ItemIcon>
      Edit
    </Menu.Item>
    <Menu.Item onClick={() => undefined}>
      <Menu.ItemIcon>
        <TrashIcon size="large" />
      </Menu.ItemIcon>
      Delete
    </Menu.Item>
  </>
);

const ItemsDemo = (position: ExamplePosition) => {
  const [notes, setNotes] = useState(0);

  return (
    <div className={styles.itemsDemo}>
      <MenuDemo
        {...position}
        aria-label="Item variations"
        trigger={<Button variant="outlined">Open items</Button>}
      >
        <Menu.Item onClick={() => undefined}>Text only</Menu.Item>
        <Menu.Item onClick={() => undefined}>
          <Menu.ItemIcon>
            <CopyIcon />
          </Menu.ItemIcon>
          Start icon
        </Menu.Item>
        <Menu.Item onClick={() => undefined}>
          <Menu.ItemIcon>
            <LogoVarsityIcon size="large" color="brand-01" />
          </Menu.ItemIcon>
          Colored icon (brand-01)
        </Menu.Item>
        <Menu.Item
          href="https://varsity.startribune.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Menu.ItemIcon>
            <LinkIcon />
          </Menu.ItemIcon>
          Link with end icon
          <Menu.ItemIcon position="end">
            <ArrowDiagonalIcon />
          </Menu.ItemIcon>
        </Menu.Item>
        <Menu.Item onClick={() => setNotes((prev) => prev + 1)} closeOnSelect={false}>
          <Menu.ItemIcon>
            <PlusIcon />
          </Menu.ItemIcon>
          Add note (stays open)
        </Menu.Item>
        <Menu.Item disabled onClick={() => undefined}>
          <Menu.ItemIcon>
            <TrashIcon />
          </Menu.ItemIcon>
          Disabled
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => undefined}>
          <Menu.ItemIcon>
            <EditIcon />
          </Menu.ItemIcon>
          A long label that needs more than one line to show all of its text
        </Menu.Item>
      </MenuDemo>
      <UtilityBody size="x-small">Notes added: {notes}</UtilityBody>
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

const OPEN_STATE_CODE = `const [open, setOpen] = useState(false);

`;

const OPEN_STATE_PROPS = `  open={open}
  onOpen={() => setOpen(true)}
  onClose={() => setOpen(false)}`;

const ROW_ACTION_ITEMS_CODE = `  <Menu.Item onClick={onEdit}>
    <Menu.ItemIcon><EditIcon size="large" /></Menu.ItemIcon>
    Edit
  </Menu.Item>
  <Menu.Item onClick={onDelete}>
    <Menu.ItemIcon><TrashIcon size="large" /></Menu.ItemIcon>
    Delete
  </Menu.Item>`;

/** Examples for the Configurable story. Each keeps its own position unless a control overrides it. */
const EXAMPLES = {
  account: {
    label: 'Account menu',
    placement: 'right-end',
    render: (position) => (
      <div className={styles.accountFrame}>
        <MenuDemo
          {...position}
          aria-label="Account"
          className={styles.accountMenu}
          trigger={<Button>Account</Button>}
        >
          <AccountItems />
        </MenuDemo>
      </div>
    ),
    code: (positionProps) => `import NextLink from 'next/link';

${OPEN_STATE_CODE}<Menu.Root
  trigger={<Button>Account</Button>}
${OPEN_STATE_PROPS}
${positionProps}  aria-label="Account"
>
  <Menu.Item href="https://varsity.startribune.com/" target="_blank" rel="noreferrer">
    <Menu.ItemIcon><HelpIcon size="large" /></Menu.ItemIcon>
    Help Center
    <Menu.ItemIcon position="end"><ArrowDiagonalIcon /></Menu.ItemIcon>
  </Menu.Item>
  <Menu.Divider />
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
  rowActions: {
    label: 'Row actions',
    placement: 'bottom-end',
    render: (position) => (
      <div className={styles.tableRow}>
        <UtilityBody size="small">Table row</UtilityBody>
        <MenuDemo
          {...position}
          aria-label="Row actions"
          className={styles.rowActionsMenu}
          trigger={<Button variant="ghost" icon={<MenuVerticalIcon />} aria-label="Row actions" />}
        >
          <RowActionItems />
        </MenuDemo>
      </div>
    ),
    code: (positionProps) => `${OPEN_STATE_CODE}<Menu.Root
  trigger={<Button variant="ghost" icon={<MenuVerticalIcon />} aria-label="Row actions" />}
${OPEN_STATE_PROPS}
${positionProps}  aria-label="Row actions"
>
${ROW_ACTION_ITEMS_CODE}
</Menu.Root>`,
  },
  items: {
    label: 'Menu items',
    ...OPEN_RIGHT,
    render: (position) => <ItemsDemo {...position} />,
    code: (positionProps) => `${OPEN_STATE_CODE}<Menu.Root
  trigger={<Button variant="outlined">Open items</Button>}
${OPEN_STATE_PROPS}
${positionProps}  aria-label="Item variations"
>
  <Menu.Item onClick={onSelect}>Text only</Menu.Item>
  <Menu.Item onClick={onSelect}>
    <Menu.ItemIcon><CopyIcon /></Menu.ItemIcon>
    Start icon
  </Menu.Item>
  <Menu.Item onClick={onSelect}>
    <Menu.ItemIcon><LogoVarsityIcon size="large" color="brand-01" /></Menu.ItemIcon>
    Colored icon (brand-01)
  </Menu.Item>
  <Menu.Item href="https://varsity.startribune.com/" target="_blank" rel="noopener noreferrer">
    <Menu.ItemIcon><LinkIcon /></Menu.ItemIcon>
    Link with end icon
    <Menu.ItemIcon position="end"><ArrowDiagonalIcon /></Menu.ItemIcon>
  </Menu.Item>
  <Menu.Item onClick={addNote} closeOnSelect={false}>
    <Menu.ItemIcon><PlusIcon /></Menu.ItemIcon>
    Add note (stays open)
  </Menu.Item>
  <Menu.Item disabled onClick={onSelect}>
    <Menu.ItemIcon><TrashIcon /></Menu.ItemIcon>
    Disabled
  </Menu.Item>
  <Menu.Divider />
  <Menu.Item onClick={onSelect}>
    <Menu.ItemIcon><EditIcon /></Menu.ItemIcon>
    A long label that needs more than one line to show all of its text
  </Menu.Item>
</Menu.Root>`,
  },
  longList: {
    label: 'Long list',
    ...OPEN_RIGHT,
    render: (position) => (
      <MenuDemo
        {...position}
        aria-label="Options"
        trigger={<Button variant="outlined">Open 20 items</Button>}
      >
        {Array.from({ length: 20 }, (_, index) => (
          <Menu.Item key={index} onClick={() => undefined}>
            Option {index + 1}
          </Menu.Item>
        ))}
      </MenuDemo>
    ),
    code: (positionProps) => `${OPEN_STATE_CODE}<Menu.Root
  trigger={<Button variant="outlined">Open 20 items</Button>}
${OPEN_STATE_PROPS}
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
    open: false,
    onOpen: () => undefined,
    onClose: () => undefined,
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
    open: { control: false, table: { type: { summary: 'boolean' } } },
    onOpen: { control: false, table: { type: { summary: '() => void' } } },
    onClose: {
      control: false,
      table: { type: { summary: '(reason: MenuCloseReason) => void' } },
    },
    children: {
      control: false,
      description: 'Menu content, built from `Menu.Item`, `Menu.ItemIcon` and `Menu.Divider`.',
      table: { type: { summary: 'ReactNode' } },
    },
    placement: {
      control: 'select',
      options: [undefined, ...MENU_PLACEMENTS],
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
      options: [undefined, ...MENU_ARROW_OFFSETS],
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

/** A titled group in All variants. */
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
  description?: ReactNode;
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

/** Every example on one page for Chromatic. Only the account menu starts open, since open menus lock scroll. */
export const AllVariants: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => (
    <div className={styles.page}>
      <Group title="Examples">
        <Example
          title="Account menu"
          description="Account links and actions, opened from a profile or avatar button."
        >
          <div className={styles.accountFrame}>
            <MenuDemo
              initialOpen
              aria-label="Account"
              className={styles.accountMenu}
              placement="right-end"
              trigger={<Button>Account</Button>}
            >
              <AccountItems />
            </MenuDemo>
          </div>
        </Example>

        <Example
          title="Row actions"
          description="Actions for one item in a list or table, opened from an icon button."
        >
          <div className={styles.tableRow}>
            <UtilityBody size="small">Table row</UtilityBody>
            <MenuDemo
              aria-label="Row actions"
              className={styles.rowActionsMenu}
              placement="bottom-end"
              trigger={
                <Button variant="ghost" icon={<MenuVerticalIcon />} aria-label="Row actions" />
              }
            >
              <RowActionItems />
            </MenuDemo>
          </div>
        </Example>
      </Group>

      <Group title="Items">
        <Example
          title="Menu items"
          description={
            <>
              Text, icons, links, disabled items, dividers, and items that keep the menu open (
              <code>closeOnSelect={'{false}'}</code>).
            </>
          }
        >
          <ItemsDemo {...OPEN_RIGHT} />
        </Example>

        <Example title="Long lists" description="Long menus scroll inside the surface.">
          <MenuDemo
            {...OPEN_RIGHT}
            aria-label="Options"
            trigger={<Button variant="outlined">Open 20 items</Button>}
          >
            {Array.from({ length: 20 }, (_, index) => (
              <Menu.Item key={index} onClick={() => undefined}>
                Option {index + 1}
              </Menu.Item>
            ))}
          </MenuDemo>
        </Example>
      </Group>

      <Group title="Positioning">
        {POSITIONS.map(({ label, frame, ...menuProps }) => (
          <Example key={label} title={label} description={`placement="${menuProps.placement}"`}>
            <div className={classNames(styles.positionFrame, styles[`positionFrame-${frame}`])}>
              <MenuDemo
                {...menuProps}
                aria-label={label}
                className={styles.positionMenu}
                trigger={<Button size="small">Open</Button>}
              >
                <Menu.Item onClick={() => undefined}>Item one</Menu.Item>
                <Menu.Item onClick={() => undefined}>Item two</Menu.Item>
              </MenuDemo>
            </div>
          </Example>
        ))}
      </Group>
    </div>
  ),
};
