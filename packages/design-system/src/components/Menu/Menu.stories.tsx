import { ReactElement, ReactNode, useContext, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor, within } from 'storybook/test';
import classNames from 'classnames';
import * as Menu from './Menu';
import { MENU_ARROW_POSITIONS, MENU_PLACEMENTS } from './Menu.constants';
import type { MenuLabelProps, MenuPlacement, MenuProps } from './Menu.types';
import { Button } from '@/components/Button/web/Button';
import * as Dialog from '@/components/Dialog/Dialog';
import { DesignSystemContext } from '@/providers/DesignSystemContext';
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
    onClose: { control: false, table: { type: { summary: '() => void' } } },
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
    arrowPosition: {
      control: 'select',
      options: [undefined, ...MENU_ARROW_POSITIONS],
      description:
        'Sets a fixed arrow position. When not set, the arrow points at the anchor’s center.',
      table: { type: { summary: 'Responsive<start | center | end>' } },
    },
    className: {
      control: 'text',
      description: 'Classes for the menu surface.',
      table: { type: { summary: 'string' } },
    },
    lockScroll: {
      control: 'boolean',
      description: 'Stops page scroll while the menu is open.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    portalRoot: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Menu.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/* Demo menus shared by the stories */

type DemoMenuProps = Omit<MenuProps, 'open' | 'onOpen' | 'onClose' | keyof MenuLabelProps> &
  MenuLabelProps;

const DemoMenu = (menuProps: DemoMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root
      {...menuProps}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    />
  );
};

type ExamplePosition = Pick<MenuProps, 'placement' | 'hideArrow' | 'arrowPosition' | 'lockScroll'>;
type ExampleRenderProps = ExamplePosition & Pick<MenuProps, 'portalRoot'>;

const BRAND_SITES = {
  startribune: {
    label: 'Star Tribune',
    icon: <LogoStribColorIcon size="large" />,
  },
  varsity: {
    label: 'Strib Varsity',
    icon: <LogoVarsityIcon size="large" color="brand-01" />,
  },
};

const AccountItems = () => {
  const site = BRAND_SITES[useContext(DesignSystemContext)?.brand ?? 'startribune'];

  return (
    <>
      <Menu.Item onClick={() => undefined}>
        <Menu.ItemIcon>{site.icon}</Menu.ItemIcon>
        {site.label}
        <Menu.ItemIcon position="end">
          <ArrowDiagonalIcon />
        </Menu.ItemIcon>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => undefined}>
        <Menu.ItemIcon>
          <HelpIcon size="large" />
        </Menu.ItemIcon>
        Help Center
      </Menu.Item>
      <Menu.Item onClick={() => undefined}>
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

const AccountDemo = (props: ExampleRenderProps) => (
  <div className={styles.accountFrame}>
    <DemoMenu
      {...props}
      aria-label="Account"
      className={styles.accountMenu}
      trigger={<Button variant="ghost" icon={<AvatarIcon />} aria-label="Account" />}
    >
      <AccountItems />
    </DemoMenu>
  </div>
);

const ItemActionsDemo = (props: ExampleRenderProps) => {
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

const ItemsDemo = (props: ExampleRenderProps) => {
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

const ListDemo = (props: ExampleRenderProps) => (
  <DemoMenu
    {...props}
    aria-label="Items"
    trigger={<Button variant="outlined">Scrollable List</Button>}
  >
    {Array.from({ length: 10 }, (_, index) => (
      <Menu.Item key={index} onClick={() => undefined}>
        Item {index + 1}
      </Menu.Item>
    ))}
  </DemoMenu>
);

/* Configurable */

type MenuExample = {
  label: string;
  placement?: MenuPlacement;
  render: (props: ExampleRenderProps) => ReactElement;
  code: (positionProps: string) => string;
};

const OPEN_STATE_CODE = `const [open, setOpen] = useState(false);

`;

const OPEN_STATE_PROPS = `  open={open}
  onOpen={() => setOpen(true)}
  onClose={() => setOpen(false)}
`;

const EXAMPLES = {
  account: {
    label: 'Account Items',
    placement: 'right-end',
    render: (position) => <AccountDemo {...position} />,
    code: (positionProps) => `${OPEN_STATE_CODE}<Menu.Root
  trigger={<Button variant="ghost" icon={<AvatarIcon />} aria-label="Account" />}
${OPEN_STATE_PROPS}${positionProps}  aria-label="Account"
>
  <Menu.Item onClick={openVarsity}>
    <Menu.ItemIcon><LogoVarsityIcon size="large" color="brand-01" /></Menu.ItemIcon>
    Strib Varsity
    <Menu.ItemIcon position="end"><ArrowDiagonalIcon /></Menu.ItemIcon>
  </Menu.Item>
  <Menu.Divider />
  <Menu.Item onClick={openHelpCenter}>
    <Menu.ItemIcon><HelpIcon size="large" /></Menu.ItemIcon>
    Help Center
  </Menu.Item>
  <Menu.Item onClick={openProfile}>
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
    code: (positionProps) => `const [open, setOpen] = useState(false);
const [deleteOpen, setDeleteOpen] = useState(false);

<Menu.Root
  trigger={<Button variant="ghost" icon={<MenuVerticalIcon />} aria-label="Item actions" />}
${OPEN_STATE_PROPS}${positionProps}  aria-label="Item actions"
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
    code: (positionProps) => `${OPEN_STATE_CODE}<Menu.Root
  trigger={<Button variant="outlined">Other Variations</Button>}
${OPEN_STATE_PROPS}${positionProps}  aria-label="Other variations"
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
    render: (position) => <ListDemo {...position} />,
    code: (positionProps) => `${OPEN_STATE_CODE}<Menu.Root
  trigger={<Button variant="outlined">Scrollable List</Button>}
${OPEN_STATE_PROPS}${positionProps}  aria-label="Items"
>
  {items.map((item) => (
    <Menu.Item key={item.id} onClick={() => onSelect(item)}>
      {item.label}
    </Menu.Item>
  ))}
</Menu.Root>`,
  },
} satisfies Record<string, MenuExample>;

type ExampleKey = keyof typeof EXAMPLES;

const EXAMPLE_KEYS = Object.keys(EXAMPLES).filter((key): key is ExampleKey => key in EXAMPLES);

const isExampleKey = (value: unknown): value is ExampleKey =>
  typeof value === 'string' && value in EXAMPLES;

const resolvePosition = (
  example: MenuExample,
  { placement, hideArrow, arrowPosition, lockScroll }: ExamplePosition
): ExamplePosition => ({
  placement: placement ?? example.placement,
  hideArrow,
  arrowPosition,
  lockScroll,
});

const formatValue = (value: unknown) =>
  typeof value === 'string'
    ? `"${value}"`
    : `{${JSON.stringify(value)
        .replace(/"([^"]+)":/g, ' $1: ')
        .replace(/"/g, "'")
        .replace(/}/g, ' }')}}`;

// Props left at their default are omitted from the code sample.
const DEFAULT_POSITION: Record<string, unknown> = { hideArrow: false, lockScroll: true };

const formatPositionProps = (position: ExamplePosition) =>
  Object.entries(position)
    .filter(([name, value]) => value !== undefined && value !== DEFAULT_POSITION[name])
    .map(([name, value]) => (value === true ? `  ${name}\n` : `  ${name}=${formatValue(value)}\n`))
    .join('');

const getExampleCode = (key: ExampleKey, position: ExamplePosition) => {
  const example: MenuExample = EXAMPLES[key];
  return example.code(formatPositionProps(resolvePosition(example, position)));
};

type ExampleArgs = ExamplePosition & { example: ExampleKey };

const POSITION_CONTROLS = ['placement', 'hideArrow', 'arrowPosition', 'lockScroll'];

/** Renders the menu inside the canvas frame, which it flips, shifts, and shrinks to stay inside. */
const ConfigurableFrame = ({
  example,
  position,
}: {
  example: ExampleKey;
  position: ExamplePosition;
}) => {
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const selected: MenuExample = EXAMPLES[example];

  return (
    <div ref={setFrame} className={styles.configurableFrame}>
      {frame && selected.render({ ...resolvePosition(selected, position), portalRoot: frame })}
    </div>
  );
};

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
    layout: 'padded',
    chromatic: { disable: true },
    controls: { include: ['example', ...POSITION_CONTROLS] },
    docs: {
      source: {
        transform: (_code: string, { args }: { args: Partial<ExampleArgs> }) =>
          isExampleKey(args.example) ? getExampleCode(args.example, args) : _code,
      },
    },
  },
  render: ({ example, ...position }) => <ConfigurableFrame example={example} position={position} />,
};

/* Open state */

export const OpenState: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className={styles.page}>
      <AccountDemo placement="right-end" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Account' }));
    // The menu portals out of the canvas.
    const menu = await screen.findByRole('menu', { name: 'Account' });
    await expect(menu).toBeVisible();
    // Moves keyboard focus to the second item so Chromatic captures the item focus style.
    await userEvent.keyboard('{ArrowDown}');
    await expect(within(menu).getAllByRole('menuitem')[1]).toHaveFocus();
  },
};

/** A wide trigger at the viewport edge must not force the fixed arrow back to the center. */
export const AboveWideTrigger: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => (
    <div className={styles.wideTriggerFrame}>
      <DemoMenu
        aria-label="Profile actions"
        placement="top"
        arrowPosition="end"
        trigger={<Button className={styles.wideTrigger}>Account</Button>}
      >
        <Menu.Item>
          <Menu.ItemIcon>
            <SettingsIcon size="large" />
          </Menu.ItemIcon>
          Manage Profile
        </Menu.Item>
        <Menu.Item>
          <Menu.ItemIcon>
            <LogOutIcon size="large" />
          </Menu.ItemIcon>
          Log Out
        </Menu.Item>
      </DemoMenu>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = await canvas.findByRole('button', { name: 'Account' });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu', { name: 'Profile actions' });
    await waitFor(() => {
      const bounds = menu.getBoundingClientRect();
      const anchor = trigger.getBoundingClientRect();
      expect(bounds.width).toBe(324);
      expect(bounds.height).toBe(96);
      expect(Math.abs(bounds.left - anchor.left - 8)).toBeLessThanOrEqual(1);
      const arrow = menu.querySelector(':scope > svg');
      expect(arrow).not.toBeNull();
      if (!arrow) return;
      const arrowBounds = arrow.getBoundingClientRect();
      expect(
        Math.abs(bounds.right - (arrowBounds.left + arrowBounds.width / 2) - 32)
      ).toBeLessThanOrEqual(0.5);
      expect(arrowBounds.top).toBeGreaterThanOrEqual(bounds.bottom - 1);
      expect(bounds.bottom).toBeLessThan(anchor.top);
    });
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(await screen.findByRole('menu', { name: 'Profile actions' })).toBeVisible();
    await expect(screen.getByRole('menuitem', { name: 'Manage Profile' })).toHaveFocus();
  },
};

/** Tablet account menu beside a collapsed navigation rail, using Menu defaults. */
export const BesideNarrowTrigger: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => (
    <div className={styles.narrowTriggerFrame}>
      <DemoMenu
        aria-label="Tablet account"
        placement="right"
        trigger={
          <button type="button" className={styles.narrowTrigger} aria-label="Account">
            <AvatarIcon size="large" color="on-dark-secondary" />
          </button>
        }
      >
        <Menu.Item>
          <Menu.ItemIcon>
            <LogoVarsityIcon size="large" />
          </Menu.ItemIcon>
          Strib Varsity
          <Menu.ItemIcon position="end">
            <ArrowDiagonalIcon />
          </Menu.ItemIcon>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Menu.ItemIcon>
            <SettingsIcon size="large" />
          </Menu.ItemIcon>
          Manage Profile
        </Menu.Item>
        <Menu.Item>
          <Menu.ItemIcon>
            <LogOutIcon size="large" />
          </Menu.ItemIcon>
          Log Out
        </Menu.Item>
      </DemoMenu>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Account' }));
    await expect(await screen.findByRole('menu', { name: 'Tablet account' })).toBeVisible();
  },
};

/* All variants */

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

const Group = ({
  title,
  threeColumns = false,
  children,
}: {
  title?: string;
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

/** Every menu starts closed. `OpenState` covers the open state. */
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
          <AccountDemo placement="right-end" />
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

        <Example title="List Items" description="Long lists scroll inside the surface.">
          <ListDemo />
        </Example>
      </Group>

      <Group title="Positioning" threeColumns>
        {POSITIONS.map(({ label, frame, ...menuProps }) => (
          <Example key={label} title={label} description={`placement="${menuProps.placement}"`}>
            <div className={classNames(styles.positionFrame, styles[`positionFrame-${frame}`])}>
              <DemoMenu
                {...menuProps}
                aria-label={label}
                className={styles.positionMenu}
                trigger={<Button size="small">Open</Button>}
              >
                <Menu.Item onClick={() => undefined}>Item one</Menu.Item>
                <Menu.Item onClick={() => undefined}>Item two</Menu.Item>
              </DemoMenu>
            </div>
          </Example>
        ))}
      </Group>
    </div>
  ),
};
