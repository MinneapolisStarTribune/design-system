import { type ReactNode, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Drawer from './Drawer';
import { DRAWER_POSITIONS, type DrawerPosition } from './Drawer.types';
import { Button, FormControl, FormGroup, UtilityBody, UtilityButton } from '@/components/index.web';
import { allModes } from '@storybook-config/modes';
import styles from './Drawer.stories.module.scss';

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
        <div className={styles.filters}>
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
        <UtilityButton label="Clear All" onClick={clearAll} />
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
      description: 'The edge the drawer is attached to at 768px and up.',
      table: {
        type: { summary: DRAWER_POSITIONS.join(' | ') },
        defaultValue: { summary: 'right' },
      },
    },
    mobilePosition: {
      control: 'inline-radio',
      options: [...DRAWER_POSITIONS],
      description:
        'The edge the drawer is attached to at 767px and below. Resize the preview to watch it switch.',
      table: {
        type: { summary: DRAWER_POSITIONS.join(' | ') },
        defaultValue: { summary: 'bottom' },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether the top-right X icon button is rendered.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    open: {
      control: false,
      description: 'Whether the drawer is open.',
      table: { type: { summary: 'boolean' } },
    },
    onClose: {
      action: 'onClose',
      description:
        'Called when the drawer requests a close (close button, Escape or overlay press). Footer actions set `open` themselves.',
      table: { type: { summary: '() => void' } },
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
    position: 'right',
    mobilePosition: 'bottom',
    showCloseButton: true,
    children: null,
  },
  render: function Render({ onClose, ...args }) {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
      setOpen(false);
      onClose();
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
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Filter calendar</Button>

<Drawer.Root open={open} onClose={() => setOpen(false)}>
  <Drawer.Heading>Filter Calendar</Drawer.Heading>

  <Drawer.Body>
    <FormGroup>
      <FormGroup.Label>Game type</FormGroup.Label>
      <FormControl.CheckboxGroup value={gameTypes} onChange={setGameTypes} options={GAME_TYPES} />
    </FormGroup>
  </Drawer.Body>

  <Drawer.Footer>
    <UtilityButton label="Clear All" onClick={clearAll} />
    <Button color="brand" onClick={() => setOpen(false)}>
      Show {count} Athletes
    </Button>
  </Drawer.Footer>
</Drawer.Root>
        `,
      },
    },
  },
};

// Renders a drawer inside its own frame so positions can be compared side by side.
const PositionFrame = ({
  position,
  mobilePosition,
  label,
  ariaLabel,
  initialOpen,
  children,
}: {
  position?: DrawerPosition;
  mobilePosition?: DrawerPosition;
  label: string;
  ariaLabel?: string;
  initialOpen: boolean;
  children: (onClose: () => void) => ReactNode;
}) => {
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(initialOpen);

  return (
    <figure className={styles.variant}>
      <figcaption className={styles.caption}>
        <UtilityBody size="small">{label}</UtilityBody>
      </figcaption>

      <div ref={setPortalRoot} className={styles.frame}>
        <Button onClick={() => setOpen(true)}>Open</Button>

        {portalRoot && (
          <Drawer.Root
            open={open}
            onClose={() => setOpen(false)}
            position={position}
            mobilePosition={mobilePosition}
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
      <Drawer.Body>
        <UtilityBody size="small">
          Kickoff moved from 6pm. Buses leave the south lot at 5:15pm.
        </UtilityBody>
      </Drawer.Body>
      <Drawer.Footer>
        <UtilityButton label="Dismiss" onClick={onClose} />
        <Button color="brand" onClick={onClose}>
          Add to calendar
        </Button>
      </Drawer.Footer>
    </>
  );
};

export const AllVariants: Story = {
  args: {
    open: false,
    onClose: () => {},
    children: null,
  },
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          "The default placement (`position='right'`, `mobilePosition='bottom'`), then each position passed as both `position` and `mobilePosition`, each in its own frame. The default frame switches from a right panel to a bottom sheet below 768px. Drawers start open in the story canvas (and in Chromatic snapshots); on this docs page they start closed so their focus traps don't take over the page — use Open.",
      },
    },
  },
  render: (_args, { viewMode }) => {
    const initialOpen = viewMode !== 'docs';

    return (
      <div className={styles.grid}>
        <PositionFrame
          label='Default (position="right", mobilePosition="bottom")'
          initialOpen={initialOpen}
        >
          {(onClose) => <FilterCalendarContent onClose={onClose} />}
        </PositionFrame>

        {DRAWER_POSITIONS.map((position) => (
          <PositionFrame
            key={position}
            position={position}
            mobilePosition={position}
            label={`position="${position}" mobilePosition="${position}"`}
            initialOpen={initialOpen}
          >
            {(onClose) => <ShortContent onClose={onClose} />}
          </PositionFrame>
        ))}
      </div>
    );
  },
};
