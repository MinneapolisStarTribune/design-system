import { type ReactNode, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Drawer from './Drawer';
import { DRAWER_POSITIONS } from './Drawer.constants';
import type { DrawerPosition, DrawerProps } from './Drawer.types';
import { Button, FormControl, FormGroup, UtilityButton } from '@/components/index.web';
import { MODAL_ROLES } from '@/components/Modal/Modal.constants';
import { allModes } from '@storybook-config/modes';
import styles from '@/components/Modal/Modal.stories.module.scss';
import classNames from 'classnames';

const GAME_TYPES = [
  { value: 'regular-season', title: 'Regular Season' },
  { value: 'tournament', title: 'Tournament' },
];

const TIMEFRAMES = [
  { value: 'morning', title: 'Morning', description: '8am – 1pm' },
  { value: 'afternoon', title: 'Afternoon', description: '1pm – 6pm' },
  { value: 'evening', title: 'Evening', description: '6pm – 11pm' },
];

const SPORTS = [
  'Baseball',
  'Softball',
  'Boys Basketball',
  'Girls Basketball',
  'Football',
  'Flag Football',
  'Boys Hockey',
  'Girls Hockey',
  'Boys Lacrosse',
  'Girls Lacrosse',
].map((title) => ({ value: title.toLowerCase().replace(/\s+/g, '-'), title }));

// Fake results count for the sample content.
const countAthletes = (selected: number) => Math.max(12, 999 - selected * 87);

const FilterCalendarContent = ({ onClose }: { onClose: () => void }) => {
  const [gameTypes, setGameTypes] = useState<string[]>(['tournament']);
  const [timeframes, setTimeframes] = useState<string[]>(['morning']);
  const [sports, setSports] = useState<string[]>([]);

  const selectedCount = gameTypes.length + timeframes.length + sports.length;

  const clearAll = () => {
    setGameTypes([]);
    setTimeframes([]);
    setSports([]);
  };

  return (
    <>
      <Drawer.Heading>Filter Calendar</Drawer.Heading>

      <Drawer.Body>
        <div className={styles.stack}>
          <FormGroup>
            <FormGroup.Label>Game type</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={gameTypes}
              onChange={setGameTypes}
              options={GAME_TYPES}
              color="brand"
            />
          </FormGroup>

          <hr className={styles.divider} />

          <FormGroup>
            <FormGroup.Label>Timeframe</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={timeframes}
              onChange={setTimeframes}
              options={TIMEFRAMES}
              color="brand"
            />
          </FormGroup>

          <hr className={styles.divider} />

          <FormGroup>
            <FormGroup.Label>Sport</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={sports}
              onChange={setSports}
              options={SPORTS}
              color="brand"
            />
          </FormGroup>
        </div>
      </Drawer.Body>

      <Drawer.Footer>
        <Button variant="outlined" color="neutral" onClick={clearAll}>
          Clear All
        </Button>
        <Button color="brand" onClick={onClose}>
          {`Show ${countAthletes(selectedCount)} Athletes`}
        </Button>
      </Drawer.Footer>
    </>
  );
};

const meta = {
  title: 'Layout & Containers/Drawer',
  component: Drawer.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal panel attached to an edge of the viewport — a side panel for filters or supplementary content, or a bottom sheet on phones. Web only. Docs: `Drawer.mdx`.',
      },
    },
  },
  argTypes: {
    children: { control: false },
    position: {
      control: 'inline-radio',
      options: [...DRAWER_POSITIONS],
      description:
        'The edge the drawer is attached to — one edge for every screen size, or an object keyed by breakpoint (`small`, `medium` 768px+, `large` 1160px+). Leave it unset and resize the preview to watch the default switch.',
      table: {
        type: { summary: `Responsive<${DRAWER_POSITIONS.join(' | ')}>` },
        defaultValue: { summary: "{ small: 'bottom', medium: 'right' }" },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether the top-right X icon button is rendered.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    role: {
      control: 'inline-radio',
      options: [...MODAL_ROLES],
      description:
        'The ARIA role. Use `alertdialog` for urgent interruptions that need a response, like confirming a deletion.',
      table: {
        type: { summary: MODAL_ROLES.join(' | ') },
        defaultValue: { summary: "'dialog'" },
      },
    },
    describeWithBody: {
      control: 'boolean',
      description:
        'Whether the content describes it via `aria-describedby`. Keep it for short messages.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: "true for role='alertdialog', false otherwise" },
      },
    },
    closeLabel: {
      control: 'text',
      description: 'Accessible label for the X icon button.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'Close'" } },
    },
    open: {
      control: false,
      description: 'Whether the drawer is open.',
      table: { type: { summary: 'boolean' } },
    },
    onClose: {
      action: 'onClose',
      description:
        'Called when the drawer requests a close, with its trigger (close button, Escape or overlay press). Footer actions set `open` themselves.',
      table: {
        type: { summary: "(reason: 'closeButton' | 'escapeKey' | 'overlayPress') => void" },
      },
    },
    initialFocus: { control: false },
    portalRoot: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Drawer.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    open: false,
    onClose: () => {},
    showCloseButton: true,
    role: 'dialog',
    closeLabel: 'Close',
    children: null,
  },
  render: function Render({ onClose, ...args }) {
    const [open, setOpen] = useState(false);

    const handleClose: DrawerProps['onClose'] = (reason) => {
      setOpen(false);
      onClose(reason);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Filter calendar</Button>

        <Drawer.Root {...args} open={open} onClose={handleClose}>
          <FilterCalendarContent onClose={() => setOpen(false)} />
        </Drawer.Root>
      </>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useState } from 'react';
import { Button, Drawer, FormControl, FormGroup } from '@minneapolisstartribune/design-system/web';

const GAME_TYPES = [
  { value: 'regular-season', title: 'Regular Season' },
  { value: 'tournament', title: 'Tournament' },
];

export function FilterCalendarDrawer() {
  const [open, setOpen] = useState(false);
  const [gameTypes, setGameTypes] = useState<string[]>([]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Filter calendar</Button>

      {/* No position: a bottom sheet on phones, a right panel from 768px up */}
      <Drawer.Root open={open} onClose={() => setOpen(false)}>
        <Drawer.Heading>Filter Calendar</Drawer.Heading>
        <Drawer.Body>
          <FormGroup>
            <FormGroup.Label>Game type</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={gameTypes}
              onChange={setGameTypes}
              options={GAME_TYPES}
              color="brand"
            />
          </FormGroup>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="outlined" color="neutral" onClick={() => setGameTypes([])}>
            Clear All
          </Button>
          <Button color="brand" onClick={() => setOpen(false)}>
            Show Results
          </Button>
        </Drawer.Footer>
      </Drawer.Root>
    </>
  );
}
`,
      },
    },
  },
};

// Renders a drawer inside its own frame so positions can be compared side by side.
const PositionFrame = ({
  position,
  label,
  ariaLabel,
  initialOpen,
  children,
}: {
  position?: DrawerProps['position'];
  label: string;
  ariaLabel?: string;
  initialOpen: boolean;
  children: (onClose: () => void) => ReactNode;
}) => {
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(initialOpen);

  return (
    <figure className={styles.variant}>
      <figcaption className={classNames('typography-utility-text-regular-small', styles.caption)}>
        {label}
      </figcaption>

      <div ref={setPortalRoot} className={styles.frame}>
        <Button onClick={() => setOpen(true)}>Open</Button>

        {portalRoot && (
          <Drawer.Root
            open={open}
            onClose={() => setOpen(false)}
            position={position}
            portalRoot={portalRoot}
            aria-label={ariaLabel}
          >
            {children(() => setOpen(false))}
          </Drawer.Root>
        )}
      </div>
    </figure>
  );
};

const ShortContent = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      <Drawer.Heading>Game details</Drawer.Heading>
      <Drawer.Body>Kickoff moved from 6pm. Buses leave the south lot at 5:15pm.</Drawer.Body>
      <Drawer.Footer>
        <UtilityButton label="Dismiss" onClick={onClose} />
        <Button color="brand" onClick={onClose}>
          Add to calendar
        </Button>
      </Drawer.Footer>
    </>
  );
};

// Each placement below is its own story with hand-written source for the docs page. AllVariants
// reuses the same frames for Chromatic, so the placement stories skip snapshots. Drawers start
// open in the story canvas and closed on the docs page, so their focus traps don't take over it.
const EXAMPLE_ARGS = { open: false, onClose: () => {}, children: null };

const exampleParameters = (code: string) => ({
  chromatic: { disable: true },
  controls: { disable: true },
  layout: 'fullscreen',
  docs: { source: { code } },
});

const renderDefaultFrame = (initialOpen: boolean) => (
  <PositionFrame
    label="Default (position={{ small: 'bottom', medium: 'right' }})"
    initialOpen={initialOpen}
  >
    {(onClose) => <FilterCalendarContent onClose={onClose} />}
  </PositionFrame>
);

const renderPositionFrame = (position: DrawerPosition, initialOpen: boolean) => (
  <PositionFrame
    key={position}
    position={position}
    label={`position="${position}"`}
    initialOpen={initialOpen}
  >
    {(onClose) => <ShortContent onClose={onClose} />}
  </PositionFrame>
);

export const DefaultPosition: Story = {
  tags: ['!dev'],
  args: EXAMPLE_ARGS,
  parameters: exampleParameters(`
import { useState } from 'react';
import { Button, Drawer, FormControl, FormGroup } from '@minneapolisstartribune/design-system/web';

const GAME_TYPES = [
  { value: 'regular-season', title: 'Regular Season' },
  { value: 'tournament', title: 'Tournament' },
];

export function FilterCalendarDrawer() {
  const [open, setOpen] = useState(false);
  const [gameTypes, setGameTypes] = useState<string[]>([]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Filter calendar</Button>

      {/* No position: a bottom sheet on phones, a right panel from 768px up */}
      <Drawer.Root open={open} onClose={() => setOpen(false)}>
        <Drawer.Heading>Filter Calendar</Drawer.Heading>
        <Drawer.Body>
          <FormGroup>
            <FormGroup.Label>Game type</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={gameTypes}
              onChange={setGameTypes}
              options={GAME_TYPES}
              color="brand"
            />
          </FormGroup>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="outlined" color="neutral" onClick={() => setGameTypes([])}>
            Clear All
          </Button>
          <Button color="brand" onClick={() => setOpen(false)}>
            Show Results
          </Button>
        </Drawer.Footer>
      </Drawer.Root>
    </>
  );
}

// Pick an edge per breakpoint: small, medium (768px+), large (1160px+)
export function ResponsiveDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>

      <Drawer.Root
        position={{ small: 'bottom', large: 'left' }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Drawer.Heading>Game details</Drawer.Heading>
        <Drawer.Body>Kickoff moved from 6pm.</Drawer.Body>
      </Drawer.Root>
    </>
  );
}
`),
  render: (_args, { viewMode }) => (
    <div className={styles.grid}>{renderDefaultFrame(viewMode !== 'docs')}</div>
  ),
};

const positionStory = (position: DrawerPosition): Story => ({
  args: EXAMPLE_ARGS,
  parameters: exampleParameters(`
import { useState } from 'react';
import { Button, Drawer, UtilityButton } from '@minneapolisstartribune/design-system/web';

export function GameDetailsDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Game details</Button>

      <Drawer.Root position="${position}" open={open} onClose={() => setOpen(false)}>
        <Drawer.Heading>Game details</Drawer.Heading>
        <Drawer.Body>Kickoff moved from 6pm. Buses leave the south lot at 5:15pm.</Drawer.Body>
        <Drawer.Footer>
          <UtilityButton label="Dismiss" onClick={() => setOpen(false)} />
          <Button color="brand" onClick={() => setOpen(false)}>
            Add to calendar
          </Button>
        </Drawer.Footer>
      </Drawer.Root>
    </>
  );
}
`),
  render: (_args, { viewMode }) => (
    <div className={styles.grid}>{renderPositionFrame(position, viewMode !== 'docs')}</div>
  ),
});

export const Top: Story = { ...positionStory('top'), tags: ['!dev'] };
export const Left: Story = { ...positionStory('left'), tags: ['!dev'] };
export const Bottom: Story = { ...positionStory('bottom'), tags: ['!dev'] };
export const Right: Story = { ...positionStory('right'), tags: ['!dev'] };

/**
 * Every placement in one canvas, for Chromatic visual regression across brand and theme modes.
 * Not shown on the docs page; each placement has its own section there.
 */
export const AllVariants: Story = {
  args: EXAMPLE_ARGS,
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: (_args, { viewMode }) => {
    const initialOpen = viewMode !== 'docs';

    return (
      <div className={styles.grid}>
        {renderDefaultFrame(initialOpen)}
        {DRAWER_POSITIONS.map((position) => renderPositionFrame(position, initialOpen))}
      </div>
    );
  },
};
