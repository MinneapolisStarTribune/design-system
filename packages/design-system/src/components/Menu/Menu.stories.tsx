import { ReactElement, ReactNode, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import classNames from 'classnames';
import * as Menu from './Menu';
import { MENU_ARROW_OFFSETS } from './Menu.constants';
import type { MenuAnchorProps, MenuLabelProps, MenuOrigin, MenuProps } from './Menu.types';
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

const origin = (
  vertical: MenuOrigin['vertical'],
  horizontal: MenuOrigin['horizontal']
): MenuOrigin => ({ vertical, horizontal });

const formatOrigin = ({ vertical, horizontal }: MenuOrigin) => `${vertical} ${horizontal}`;

const OPEN_RIGHT = {
  anchorOrigin: origin('top', 'right'),
  transformOrigin: origin('top', 'left'),
};

/** `frame` aligns the trigger in its cell so the menu has room on the side it opens. */
const POSITIONS = [
  {
    label: 'Below, left edges (default)',
    frame: 'bottom',
    anchorOrigin: origin('bottom', 'left'),
    transformOrigin: origin('top', 'left'),
  },
  {
    label: 'Above, centered',
    frame: 'top',
    anchorOrigin: origin('top', 'center'),
    transformOrigin: origin('bottom', 'center'),
  },
  {
    label: 'Right, bottom edges',
    frame: 'right',
    anchorOrigin: origin('bottom', 'right'),
    transformOrigin: origin('bottom', 'left'),
  },
  {
    label: 'Over the anchor',
    frame: 'center',
    anchorOrigin: origin('top', 'left'),
    transformOrigin: origin('top', 'left'),
  },
  {
    label: 'Centered on the anchor',
    frame: 'center',
    anchorOrigin: origin('center', 'center'),
    transformOrigin: origin('center', 'center'),
  },
  {
    label: 'hideArrow',
    frame: 'bottom',
    anchorOrigin: origin('bottom', 'center'),
    transformOrigin: origin('top', 'center'),
    hideArrow: true,
  },
] satisfies {
  label: string;
  frame: 'bottom' | 'top' | 'right' | 'center';
  anchorOrigin: MenuOrigin;
  transformOrigin: MenuOrigin;
  hideArrow?: boolean;
}[];

type DemoProps = Omit<
  MenuProps,
  keyof MenuAnchorProps | 'open' | 'onClose' | keyof MenuLabelProps
> &
  MenuLabelProps & {
    trigger: ReactElement;
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

/** For an anchor the menu doesn't render, such as one shared by several menus. */
const AnchorElDemo = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <Button
        variant="outlined"
        aria-haspopup="menu"
        aria-expanded={anchorEl !== null}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Open with anchorEl
      </Button>
      <Menu.Root
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        aria-label="Anchor element example"
      >
        <RowActionItems />
      </Menu.Root>
    </>
  );
};

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

const ItemsDemo = () => {
  const [notes, setNotes] = useState(0);

  return (
    <div className={styles.itemsDemo}>
      <MenuDemo
        {...OPEN_RIGHT}
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

const meta = {
  title: 'Feedback & Status/Menu',
  component: Menu.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'List of actions or links that opens from a trigger or an anchor element. Docs: `Menu.mdx`.',
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
    anchorEl: {
      control: false,
      description:
        'Element the menu attaches to, when the consumer renders it. Use instead of `trigger`.',
      table: { type: { summary: 'Element | null' } },
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
    anchorOrigin: {
      control: 'object',
      description: 'Point on the anchor that the menu attaches to.',
      table: {
        type: { summary: 'Responsive<{ vertical, horizontal }>' },
        defaultValue: { summary: "{ vertical: 'bottom', horizontal: 'left' }" },
      },
    },
    transformOrigin: {
      control: 'object',
      description: 'Point on the menu that attaches to `anchorOrigin`.',
      table: {
        type: { summary: 'Responsive<{ vertical, horizontal }>' },
        defaultValue: { summary: "{ vertical: 'top', horizontal: 'left' }" },
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

/**
 * Playground
 */
export const Configurable: Story = {
  args: {
    anchorOrigin: origin('bottom', 'left'),
    transformOrigin: origin('top', 'left'),
    hideArrow: false,
  },
  render: ({ anchorOrigin, transformOrigin, hideArrow, arrowOffset, className }) => (
    <MenuDemo
      trigger={<Button>Open menu</Button>}
      aria-label="Account"
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      hideArrow={hideArrow}
      arrowOffset={arrowOffset}
      className={className}
    >
      <AccountItems />
    </MenuDemo>
  ),
  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = useState(false);

<Menu.Root
  trigger={<Button>Open menu</Button>}
  open={open}
  onOpen={() => setOpen(true)}
  onClose={() => setOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
  aria-label="Account"
>
  <Menu.Item href="https://varsity.startribune.com/" target="_blank">
    <Menu.ItemIcon><HelpIcon size="large" /></Menu.ItemIcon>
    Help Center
    <Menu.ItemIcon position="end"><ArrowDiagonalIcon /></Menu.ItemIcon>
  </Menu.Item>

  <Menu.Divider />

  <Menu.Item onClick={openProfile}>
    <Menu.ItemIcon><SettingsIcon size="large" /></Menu.ItemIcon>
    Manage Profile
  </Menu.Item>

  <Menu.Item onClick={logOut}>
    <Menu.ItemIcon><LogOutIcon size="large" /></Menu.ItemIcon>
    Log Out
  </Menu.Item>
</Menu.Root>
        `,
      },
    },
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

export const AllVariants: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The account menu starts open in the story canvas (and in Chromatic snapshots); on this docs page it starts closed so it does not take focus or lock scrolling. Only one menu can be open at a time.',
      },
      source: {
        code: `
<Menu.Root
  trigger={<Button>Account</Button>}
  open={open}
  onOpen={() => setOpen(true)}
  onClose={() => setOpen(false)}
  aria-label="Account"
>
  <Menu.Item onClick={openProfile}>
    <Menu.ItemIcon><SettingsIcon size="large" /></Menu.ItemIcon>
    Manage Profile
  </Menu.Item>

  <Menu.Divider />

  <Menu.Item onClick={logOut}>Log Out</Menu.Item>
</Menu.Root>
        `,
      },
    },
  },
  render: (_args, { viewMode }) => (
    <div className={styles.page}>
      <Group title="Examples">
        <Example
          title="Account menu"
          description="Account links and actions, opened from a profile or avatar button."
        >
          <div className={styles.accountFrame}>
            <MenuDemo
              initialOpen={viewMode !== 'docs'}
              aria-label="Account"
              className={styles.accountMenu}
              anchorOrigin={origin('bottom', 'right')}
              transformOrigin={origin('bottom', 'left')}
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
              anchorOrigin={origin('bottom', 'right')}
              transformOrigin={origin('top', 'right')}
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
          <ItemsDemo />
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
          <Example
            key={label}
            title={label}
            description={
              <>
                anchorOrigin: {formatOrigin(menuProps.anchorOrigin)}
                <br />
                transformOrigin: {formatOrigin(menuProps.transformOrigin)}
              </>
            }
          >
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

      <Group title="Additional examples">
        <Example
          title="Anchor element"
          description="Pass anchorEl when the consumer renders the anchor and opens the menu."
        >
          <AnchorElDemo />
        </Example>
      </Group>
    </div>
  ),
};
