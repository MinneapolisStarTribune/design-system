import type { Meta, StoryObj } from '@storybook/react-vite';
import { MouseEvent, ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { Button, UtilityBody } from '@/components/index.web';
import {
  ArrowDiagonalIcon,
  CopyIcon,
  EditIcon,
  HelpIcon,
  LinkIcon,
  LogOutIcon,
  MenuVerticalIcon,
  PlusIcon,
  SettingsIcon,
  LogoVarsityIcon,
  TrashIcon,
} from '@/icons';
import * as Menu from './Menu';
import styles from './Menu.stories.module.scss';
import { MENU_ARROW_OFFSETS } from '../Menu.constants';
import type { MenuLabelProps, MenuOrigin, MenuProps } from '../Menu.types';

type AnchorProps = {
  ref: (element: HTMLElement | null) => void;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
};

type DemoProps = Omit<MenuProps, 'anchorEl' | 'open' | 'onClose' | keyof MenuLabelProps> &
  MenuLabelProps & {
    renderAnchor: (anchorProps: AnchorProps) => ReactNode;
    /** Open the menu after the anchor mounts. Do not simulate a click. */
    initialOpen?: boolean;
  };

const MenuDemo = ({ renderAnchor, initialOpen = false, children, ...menuProps }: DemoProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // React calls ref callbacks after later renders. Without this guard, the menu opens again after it closes.
  const [needsInitialOpen, setNeedsInitialOpen] = useState(initialOpen);
  const anchorRef = useCallback(
    (element: HTMLElement | null) => {
      if (!needsInitialOpen || !element) return;
      setNeedsInitialOpen(false);
      setAnchorEl(element);
    },
    [needsInitialOpen]
  );

  return (
    <>
      {renderAnchor({
        ref: anchorRef,
        onClick: (event) => setAnchorEl(anchorEl ? null : event.currentTarget),
        'aria-haspopup': 'menu',
        'aria-expanded': anchorEl !== null,
      })}
      <Menu.Root
        {...menuProps}
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
      >
        {children}
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

const meta = {
  title: 'Feedback & Status/Menu',
  component: Menu.Root,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    anchorEl: { control: false },
    open: { control: false },
    onClose: { control: false },
    children: { control: false },
    portalRoot: { control: false, table: { disable: true } },
    anchorOrigin: { control: 'object' },
    transformOrigin: { control: 'object' },
    hideArrow: { control: 'boolean' },
    arrowOffset: {
      control: 'select',
      options: [undefined, ...MENU_ARROW_OFFSETS],
      description:
        'Sets a fixed arrow position. When not set, the arrow points at the anchor’s center.',
    },
  },
} satisfies Meta<typeof Menu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    anchorEl: null,
    open: false,
    onClose: () => undefined,
    children: null,
    'aria-label': 'Account',
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
    hideArrow: false,
  },
  render: ({
    anchorEl: _anchorEl,
    open: _open,
    onClose: _onClose,
    children: _children,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    ...args
  }) => (
    <MenuDemo
      {...args}
      aria-label="Account"
      renderAnchor={(anchorProps) => <Button {...anchorProps}>Open menu</Button>}
    >
      <AccountItems />
    </MenuDemo>
  ),
  parameters: {
    docs: {
      source: {
        code: `
const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

<Button
  aria-haspopup="menu"
  aria-expanded={anchorEl !== null}
  onClick={(event) => setAnchorEl(event.currentTarget)}
>
  Open menu
</Button>

<Menu.Root
  anchorEl={anchorEl}
  open={anchorEl !== null}
  onClose={() => setAnchorEl(null)}
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

type MenuOrigins = Pick<MenuProps, 'anchorOrigin' | 'transformOrigin'>;

const origin = (
  vertical: MenuOrigin['vertical'],
  horizontal: MenuOrigin['horizontal']
): MenuOrigin => ({ vertical, horizontal });

const OPEN_RIGHT = {
  anchorOrigin: origin('top', 'right'),
  transformOrigin: origin('top', 'left'),
} satisfies MenuOrigins;

const POSITION_EXAMPLES = [
  {
    label: 'Below, left edges (default)',
    cell: 'bottom',
    anchorOrigin: origin('bottom', 'left'),
    transformOrigin: origin('top', 'left'),
  },
  {
    label: 'Above, centered',
    cell: 'top',
    anchorOrigin: origin('top', 'center'),
    transformOrigin: origin('bottom', 'center'),
  },
  {
    label: 'Right, bottom edges',
    cell: 'right',
    anchorOrigin: origin('bottom', 'right'),
    transformOrigin: origin('bottom', 'left'),
  },
  {
    label: 'Over the anchor',
    cell: 'center',
    anchorOrigin: origin('top', 'left'),
    transformOrigin: origin('top', 'left'),
  },
  {
    label: 'Centered on the anchor',
    cell: 'center',
    anchorOrigin: origin('center', 'center'),
    transformOrigin: origin('center', 'center'),
  },
  {
    label: 'hideArrow',
    cell: 'bottom',
    anchorOrigin: origin('bottom', 'center'),
    transformOrigin: origin('top', 'center'),
    hideArrow: true,
  },
] satisfies Array<
  { label: string; cell: 'bottom' | 'top' | 'right' | 'center' } & MenuOrigins &
    Pick<MenuProps, 'hideArrow'>
>;

const formatOrigin = ({ vertical, horizontal }: MenuOrigin) => `${vertical} ${horizontal}`;

const PositionCell = ({ label, cell, ...menuProps }: (typeof POSITION_EXAMPLES)[number]) => (
  <figure className={styles.figure}>
    <div className={classNames(styles.cell, styles[`cell-${cell}`])}>
      <MenuDemo
        {...menuProps}
        aria-label={label}
        className={styles.comparisonMenu}
        renderAnchor={(anchorProps) => (
          <Button size="small" {...anchorProps}>
            {label}
          </Button>
        )}
      >
        <Menu.Item onClick={() => undefined}>Item one</Menu.Item>
        <Menu.Item onClick={() => undefined}>Item two</Menu.Item>
      </MenuDemo>
    </div>
    <figcaption className={styles.caption}>
      <div>{`anchorOrigin: ${formatOrigin(menuProps.anchorOrigin)}`}</div>
      <div>{`transformOrigin: ${formatOrigin(menuProps.transformOrigin)}`}</div>
    </figcaption>
  </figure>
);

type SectionProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

const Section = ({ title, description, children, contentClassName }: SectionProps) => (
  <section className={styles.section}>
    <UtilityBody size="large" weight="semibold" className={styles.sectionTitle}>
      {title}
    </UtilityBody>
    <UtilityBody size="small" className={styles.sectionDescription}>
      {description}
    </UtilityBody>
    <div className={classNames(styles.sectionContent, contentClassName)}>{children}</div>
  </section>
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
        renderAnchor={(anchorProps) => (
          <Button variant="outlined" {...anchorProps}>
            Open items
          </Button>
        )}
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
      <span className={styles.counter}>Notes added: {notes}</span>
    </div>
  );
};

export const AllVariants: Story = {
  args: {
    anchorEl: null,
    open: false,
    onClose: () => undefined,
    children: null,
    'aria-label': 'Account',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'The account menu starts open in the story canvas (and in Chromatic snapshots); on this docs page it starts closed so it does not take focus or lock scrolling. Only one menu can be open at a time.',
      },
    },
  },
  render: (_args, { viewMode }) => (
    <div className={styles.page}>
      <Section
        title="Account menu"
        description="A menu of account links and actions, opened from a profile or avatar button."
        contentClassName={styles.accountContent}
      >
        <MenuDemo
          initialOpen={viewMode !== 'docs'}
          aria-label="Account"
          className={styles.accountMenu}
          anchorOrigin={origin('bottom', 'right')}
          transformOrigin={origin('bottom', 'left')}
          renderAnchor={(anchorProps) => <Button {...anchorProps}>Account</Button>}
        >
          <AccountItems />
        </MenuDemo>
      </Section>

      <Section
        title="Row actions"
        description="Actions for one item in a list or table, opened from an icon button."
        contentClassName={styles.rowActionsContent}
      >
        <div className={styles.tableRow}>
          <UtilityBody size="small">Table row</UtilityBody>
          <MenuDemo
            aria-label="Row actions"
            className={styles.rowActionsMenu}
            anchorOrigin={origin('bottom', 'right')}
            transformOrigin={origin('top', 'right')}
            renderAnchor={(anchorProps) => (
              <Button
                variant="ghost"
                icon={<MenuVerticalIcon />}
                aria-label="Row actions"
                {...anchorProps}
              />
            )}
          >
            <RowActionItems />
          </MenuDemo>
        </div>
      </Section>

      <Section
        title="Menu items"
        description={
          <>
            The item types: text, icons, links, disabled items, dividers, and items that keep the
            menu open (<code>closeOnSelect={'{false}'}</code>).
          </>
        }
        contentClassName={styles.itemsContent}
      >
        <ItemsDemo />
      </Section>

      <Section
        title="Long lists"
        description="Long menus scroll inside the surface."
        contentClassName={styles.longListContent}
      >
        <MenuDemo
          {...OPEN_RIGHT}
          aria-label="Options"
          renderAnchor={(anchorProps) => (
            <Button variant="outlined" {...anchorProps}>
              Open 20 items
            </Button>
          )}
        >
          {Array.from({ length: 20 }, (_, index) => (
            <Menu.Item key={index} onClick={() => undefined}>
              Option {index + 1}
            </Menu.Item>
          ))}
        </MenuDemo>
      </Section>

      <Section
        title="Positioning"
        description={
          <>
            <code>anchorOrigin</code> and <code>transformOrigin</code> set where the menu opens
            relative to its anchor.
          </>
        }
      >
        <div className={styles.grid}>
          {POSITION_EXAMPLES.map((example) => (
            <PositionCell key={example.label} {...example} />
          ))}
        </div>
      </Section>
    </div>
  ),
};
