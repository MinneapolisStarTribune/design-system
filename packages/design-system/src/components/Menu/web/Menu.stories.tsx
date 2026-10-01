import type { Meta, StoryObj } from '@storybook/react-vite';
import { CSSProperties, MouseEvent, ReactNode, useState } from 'react';
import { Button, UtilityBody } from '@/components/index.web';
import {
  ArrowDiagonalIcon,
  CopyIcon,
  EditIcon,
  LinkIcon,
  LogOutIcon,
  LogoVarsityIcon,
  MenuVerticalIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
} from '@/icons';
import * as Menu from './Menu';
import type { Position } from '@/types';
import { getMenuPlacement } from '../getMenuPlacement';
import type { MenuLabelProps, MenuProps, MenuOrigin } from '../Menu.types';
import { MENU_HORIZONTAL_ORIGINS, MENU_VERTICAL_ORIGINS } from '../Menu.types';

type DemoProps = Omit<MenuProps, 'anchorEl' | 'open' | 'onClose' | keyof MenuLabelProps> &
  MenuLabelProps & {
    renderAnchor: (props: { onClick: (event: MouseEvent<HTMLElement>) => void }) => ReactNode;
  };

/** Owns the anchor state the way a consumer would. */
const MenuDemo = ({ renderAnchor, children, ...menuProps }: DemoProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      {renderAnchor({
        onClick: (event) => setAnchorEl(anchorEl ? null : event.currentTarget),
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
        <LogoVarsityIcon size="large" />
      </Menu.ItemIcon>
      Strib Varsity
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

// Storybook select controls need string options, so map "vertical-horizontal" labels to origins.
const ORIGIN_MAPPING = Object.fromEntries(
  MENU_VERTICAL_ORIGINS.flatMap((vertical) =>
    MENU_HORIZONTAL_ORIGINS.map((horizontal) => [
      `${vertical}-${horizontal}`,
      { vertical, horizontal },
    ])
  )
);
const ORIGIN_CONTROL = {
  control: 'select',
  options: Object.keys(ORIGIN_MAPPING),
  mapping: ORIGIN_MAPPING,
} as const;

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
    anchorOrigin: ORIGIN_CONTROL,
    transformOrigin: ORIGIN_CONTROL,
    placement: {
      control: 'select',
      options: [
        undefined,
        'top-start',
        'top',
        'top-end',
        'right-start',
        'right',
        'right-end',
        'bottom-start',
        'bottom',
        'bottom-end',
        'left-start',
        'left',
        'left-end',
      ],
      description: 'Overrides `anchorOrigin`/`transformOrigin` when set.',
    },
    closeOnSelect: { control: 'boolean' },
    hideArrow: { control: 'boolean' },
    surfaceWidth: { control: 'number' },
    itemMinHeight: { control: 'number' },
    maxHeight: { control: 'number' },
    arrowOffset: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end', 60, '35%'],
      description: 'Pins the pointer along its edge. Unset aims it at the anchor’s center.',
    },
  },
} satisfies Meta<typeof Menu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground
 */
export const Configurable: Story = {
  args: {
    anchorEl: null,
    open: false,
    children: null,
    'aria-label': 'Account',
    closeOnSelect: true,
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
      renderAnchor={({ onClick }) => <Button onClick={onClick}>Open menu</Button>}
    >
      <AccountItems />
    </MenuDemo>
  ),
  parameters: {
    docs: {
      source: {
        code: `
const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

<Button onClick={(event) => setAnchorEl(event.currentTarget)}>Open menu</Button>

<Menu.Root
  anchorEl={anchorEl}
  open={anchorEl !== null}
  onClose={() => setAnchorEl(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
  aria-label="Account"
>
  <Menu.Item href="https://varsity.startribune.com/" target="_blank">
    <Menu.ItemIcon><LogoVarsityIcon size="large" /></Menu.ItemIcon>
    Strib Varsity
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

const ALIGNMENTS = [
  { horizontal: 'left', vertical: 'top' },
  { horizontal: 'center', vertical: 'center' },
  { horizontal: 'right', vertical: 'bottom' },
] as const;

type PlacementCase = {
  anchorOrigin: MenuOrigin;
  transformOrigin: MenuOrigin;
};

// Every side and alignment, built from the origin pairs that produce them.
const PLACEMENT_GROUPS: Array<{ side: Position; title: string; cases: PlacementCase[] }> = [
  {
    side: 'bottom',
    title: 'Below the anchor',
    cases: ALIGNMENTS.map(({ horizontal }) => ({
      anchorOrigin: { vertical: 'bottom', horizontal },
      transformOrigin: { vertical: 'top', horizontal },
    })),
  },
  {
    side: 'top',
    title: 'Above the anchor',
    cases: ALIGNMENTS.map(({ horizontal }) => ({
      anchorOrigin: { vertical: 'top', horizontal },
      transformOrigin: { vertical: 'bottom', horizontal },
    })),
  },
  {
    side: 'right',
    title: 'Right of the anchor',
    cases: ALIGNMENTS.map(({ vertical }) => ({
      anchorOrigin: { vertical, horizontal: 'right' },
      transformOrigin: { vertical, horizontal: 'left' },
    })),
  },
  {
    side: 'left',
    title: 'Left of the anchor',
    cases: ALIGNMENTS.map(({ vertical }) => ({
      anchorOrigin: { vertical, horizontal: 'left' },
      transformOrigin: { vertical, horizontal: 'right' },
    })),
  },
];

// Pushes the anchor away from the side the menu opens on, so every menu fits in its cell.
const ANCHOR_ALIGNMENT: Record<Position, CSSProperties> = {
  bottom: { alignItems: 'flex-start', justifyContent: 'center' },
  top: { alignItems: 'flex-end', justifyContent: 'center' },
  right: { alignItems: 'center', justifyContent: 'flex-start' },
  left: { alignItems: 'center', justifyContent: 'flex-end' },
};

const formatOrigin = ({ vertical, horizontal }: MenuOrigin) => `${vertical} ${horizontal}`;

const CELL_STYLE = {
  display: 'flex',
  height: 166,
  padding: 16,
  border: '1px dashed var(--color-neutral-300)',
  borderRadius: 8,
} satisfies CSSProperties;

const COMPARISON_MENU_CLASS = 'menu-story-comparison';
const COMPARISON_MENU_WIDTH = 240;

const ComparisonMenuStyles = () => (
  <style>{`
    .${COMPARISON_MENU_CLASS} {
      --popover-min-width: ${COMPARISON_MENU_WIDTH}px;
      --popover-max-width: ${COMPARISON_MENU_WIDTH}px;
    }
  `}</style>
);

const PlacementCell = ({
  side,
  anchorOrigin,
  transformOrigin,
}: PlacementCase & { side: Position }) => {
  const resolvedPlacement = getMenuPlacement(anchorOrigin, transformOrigin);

  return (
    <figure style={{ margin: 0 }}>
      <div style={{ ...CELL_STYLE, ...ANCHOR_ALIGNMENT[side] }}>
        <MenuDemo
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          aria-label={`${resolvedPlacement} example`}
          wrapperClassName={COMPARISON_MENU_CLASS}
          renderAnchor={({ onClick }) => (
            <Button size="small" onClick={onClick}>
              {resolvedPlacement}
            </Button>
          )}
        >
          <Menu.Item onClick={() => undefined}>Item one</Menu.Item>
          <Menu.Item onClick={() => undefined}>Item two</Menu.Item>
        </MenuDemo>
      </div>
      <figcaption style={{ marginTop: 8, font: '12px/1.5 monospace' }}>
        <div>anchorOrigin: {formatOrigin(anchorOrigin)}</div>
        <div>transformOrigin: {formatOrigin(transformOrigin)}</div>
      </figcaption>
    </figure>
  );
};

const ARROW_OFFSET_EXAMPLES = [
  { label: 'Default (aims at anchor)', arrowOffset: undefined },
  { label: "arrowOffset='start'", arrowOffset: 'start' },
  { label: "arrowOffset='center'", arrowOffset: 'center' },
  { label: "arrowOffset='end'", arrowOffset: 'end' },
  { label: 'arrowOffset={60}', arrowOffset: 60 },
  { label: 'hideArrow', hideArrow: true },
] satisfies Array<{ label: string } & Pick<MenuProps, 'arrowOffset' | 'hideArrow'>>;

const formatPointer = ({
  arrowOffset,
  hideArrow,
}: Pick<MenuProps, 'arrowOffset' | 'hideArrow'>) => {
  if (hideArrow) return 'hideArrow';
  if (arrowOffset === undefined) return 'arrowOffset: not set';
  return `arrowOffset: ${typeof arrowOffset === 'string' ? `'${arrowOffset}'` : arrowOffset}`;
};

// Below and centred, so the pointer options compare against the centred default.
const POINTER_ORIGINS = {
  anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  transformOrigin: { vertical: 'top', horizontal: 'center' },
} satisfies Pick<PlacementCase, 'anchorOrigin' | 'transformOrigin'>;

/** One pointer option, using the same button and menu as the placement examples. */
const PointerCell = ({ label, ...pointerProps }: (typeof ARROW_OFFSET_EXAMPLES)[number]) => (
  <figure style={{ margin: 0 }}>
    <div style={{ ...CELL_STYLE, ...ANCHOR_ALIGNMENT.bottom }}>
      <MenuDemo
        {...pointerProps}
        {...POINTER_ORIGINS}
        aria-label={label}
        wrapperClassName={COMPARISON_MENU_CLASS}
        renderAnchor={({ onClick }) => (
          <Button size="small" onClick={onClick}>
            {label}
          </Button>
        )}
      >
        <Menu.Item onClick={() => undefined}>Item one</Menu.Item>
        <Menu.Item onClick={() => undefined}>Item two</Menu.Item>
      </MenuDemo>
    </div>
    <figcaption style={{ marginTop: 8, font: '12px/1.5 monospace' }}>
      <div>anchorOrigin: {formatOrigin(POINTER_ORIGINS.anchorOrigin)}</div>
      <div>transformOrigin: {formatOrigin(POINTER_ORIGINS.transformOrigin)}</div>
      <div>{formatPointer(pointerProps)}</div>
    </figcaption>
  </figure>
);

const PLACEMENT_GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
  gap: 16,
} satisfies CSSProperties;

/** Every side and alignment, then the pointer options on a centred placement. */
const PlacementGallery = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <ComparisonMenuStyles />
    {PLACEMENT_GROUPS.map(({ side, title, cases }) => (
      <section key={side}>
        <UtilityBody weight="semibold" style={{ margin: '0 0 8px' }}>
          {title}
        </UtilityBody>
        <div style={PLACEMENT_GRID_STYLE}>
          {cases.map((placementCase) => (
            <PlacementCell
              key={getMenuPlacement(placementCase.anchorOrigin, placementCase.transformOrigin)}
              side={side}
              {...placementCase}
            />
          ))}
        </div>
      </section>
    ))}
    <section>
      <UtilityBody weight="semibold" style={{ margin: '0 0 8px' }}>
        Pointer position
      </UtilityBody>
      <div style={PLACEMENT_GRID_STYLE}>
        {ARROW_OFFSET_EXAMPLES.map((example) => (
          <PointerCell key={example.label} {...example} />
        ))}
      </div>
    </section>
  </div>
);

type SectionProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
  /** Reserves room for the open menu so it doesn't cover the next section. */
  contentStyle?: CSSProperties;
};

/** A titled block in the All variants story, with a one-line explanation of what it shows. */
const Section = ({ title, description, children, contentStyle }: SectionProps) => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <UtilityBody size="large" weight="semibold" style={{ margin: 0 }}>
      {title}
    </UtilityBody>
    <UtilityBody size="small" style={{ margin: 0, maxWidth: 640 }}>
      {description}
    </UtilityBody>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: 16,
        ...contentStyle,
      }}
    >
      {children}
    </div>
  </section>
);

// Opens beside the trigger so tall menus use the empty space to the right.
const OPEN_RIGHT = {
  anchorOrigin: { vertical: 'top', horizontal: 'right' },
  transformOrigin: { vertical: 'top', horizontal: 'left' },
} satisfies Pick<MenuProps, 'anchorOrigin' | 'transformOrigin'>;

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

/** Every item variation in one menu. The counter shows the item that keeps the menu open. */
const ItemsDemo = () => {
  const [notes, setNotes] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <MenuDemo
        {...OPEN_RIGHT}
        aria-label="Item variations"
        renderAnchor={({ onClick }) => (
          <Button variant="outlined" onClick={onClick}>
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
      <span style={{ font: '12px/1.4 monospace' }}>Notes added: {notes}</span>
    </div>
  );
};

/**
 * All variants
 */
export const AllVariants: Story = {
  args: {
    anchorEl: null,
    open: false,
    children: null,
    'aria-label': 'Account',
  },
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: 24 }}>
      <Section
        title="Account menu"
        description="The Coaches Portal sidebar avatar menu. It opens to the right with bottom edges aligned (right-end)."
        contentStyle={{ minHeight: 160, alignItems: 'flex-end', paddingBottom: 8 }}
      >
        <MenuDemo
          aria-label="Account"
          surfaceWidth={315}
          itemMinHeight={48}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          renderAnchor={({ onClick }) => <Button onClick={onClick}>Account</Button>}
        >
          <AccountItems />
        </MenuDemo>
      </Section>

      <Section
        title="Row actions"
        description="The Coaches Portal icon-only trigger at the end of a table row. The menu opens below with right edges aligned."
        contentStyle={{ minHeight: 165 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 480,
            padding: '8px 16px',
            border: '1px solid var(--color-neutral-300)',
            borderRadius: 8,
          }}
        >
          <UtilityBody size="small">Table row</UtilityBody>
          <MenuDemo
            aria-label="Row actions"
            surfaceWidth={214}
            itemMinHeight={48}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            renderAnchor={({ onClick }) => (
              <Button
                variant="ghost"
                icon={<MenuVerticalIcon />}
                aria-label="Row actions"
                onClick={onClick}
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
            Text only, start icon, colored icon, link with an end icon, an item with{' '}
            <code>closeOnSelect={'{false}'}</code>, a disabled item, a divider, and a label that
            wraps.
          </>
        }
        contentStyle={{ minHeight: 360 }}
      >
        <ItemsDemo />
      </Section>

      <Section
        title="Long lists"
        description="The Core Components long-list pattern: menus taller than 362px scroll inside the rounded surface."
        contentStyle={{ minHeight: 505 }}
      >
        <MenuDemo
          {...OPEN_RIGHT}
          aria-label="Teams"
          renderAnchor={({ onClick }) => (
            <Button variant="outlined" onClick={onClick}>
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
        title="Placements"
        description="Every side and alignment, then the pointer options. Each placement button is labelled with the placement its origins resolve to. By default the pointer aims at the anchor's center; arrowOffset pins it along the edge and hideArrow removes it."
      >
        <div style={{ width: '100%' }}>
          <PlacementGallery />
        </div>
      </Section>
    </div>
  ),
};
