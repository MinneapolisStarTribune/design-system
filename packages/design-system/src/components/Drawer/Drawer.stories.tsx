import { type ReactNode, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';
import { DRAWER_POSITIONS, type DrawerPosition } from './Drawer.types';
import { useDrawerClose } from './DrawerContext';
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

const FilterCalendarContent = () => {
  const close = useDrawerClose();
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
        <Button color="brand" onClick={close}>
          {`Show ${countAthletes(selectedCount)} Athletes`}
        </Button>
      </Drawer.Footer>
    </>
  );
};

const meta = {
  title: 'Layout & Containers/Drawer',
  component: Drawer,
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
    trigger: { control: false },
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
        'The edge the drawer is attached to at 767px and below. Defaults to `position`. Resize the preview to watch it switch.',
      table: { type: { summary: DRAWER_POSITIONS.join(' | ') } },
    },
    isDismissable: {
      control: 'boolean',
      description: 'Whether Escape or a press on the overlay dismisses the drawer.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether the top-right close button is rendered.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    closeButtonLabel: {
      control: 'text',
      description: 'Accessible name of the close button.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Close' } },
    },
    open: {
      control: false,
      description: 'Controlled open state. Omit it to let the drawer manage its own state.',
      table: { type: { summary: 'boolean' } },
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Called when the drawer requests an open/close transition.',
      table: { type: { summary: '(open: boolean) => void' } },
    },
    initialFocus: { control: false },
    overlayClassName: { control: 'text' },
    contentClassName: { control: 'text' },
    portalRoot: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    trigger: <Button>Filter calendar</Button>,
    position: 'right',
    mobilePosition: 'bottom',
    isDismissable: true,
    showCloseButton: true,
    closeButtonLabel: 'Close filters',
    children: <FilterCalendarContent />,
  },
  parameters: {
    docs: {
      source: {
        code: `
const ShowResultsButton = ({ count }) => {
  const close = useDrawerClose();

  return <Button color="brand" onClick={close}>Show {count} Athletes</Button>;
};

<Drawer
  trigger={<Button>Filter calendar</Button>}
  position="right"
  mobilePosition="bottom"
  closeButtonLabel="Close filters"
>
  <Drawer.Heading>Filter Calendar</Drawer.Heading>

  <Drawer.Body>
    <FormGroup>
      <FormGroup.Label>Game type</FormGroup.Label>
      <FormControl.CheckboxGroup value={gameTypes} onChange={setGameTypes} options={GAME_TYPES} />
    </FormGroup>
  </Drawer.Body>

  <Drawer.Footer>
    <UtilityButton label="Clear All" onClick={clearAll} />
    <ShowResultsButton count={count} />
  </Drawer.Footer>
</Drawer>
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
  position: DrawerPosition;
  mobilePosition?: DrawerPosition;
  label: string;
  ariaLabel?: string;
  initialOpen: boolean;
  children: ReactNode;
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
          <Drawer
            open={open}
            onOpenChange={setOpen}
            position={position}
            mobilePosition={mobilePosition}
            portalRoot={portalRoot}
            aria-label={ariaLabel}
          >
            {children}
          </Drawer>
        )}
      </div>
    </figure>
  );
};

const ShortContent = () => {
  const close = useDrawerClose();

  return (
    <>
      <Drawer.Heading>Game details</Drawer.Heading>
      <Drawer.Description>Minneapolis South at Edina · Friday, 7pm</Drawer.Description>
      <Drawer.Body>
        <UtilityBody size="small">
          Kickoff moved from 6pm. Buses leave the south lot at 5:15pm.
        </UtilityBody>
      </Drawer.Body>
      <Drawer.Footer>
        <UtilityButton label="Dismiss" onClick={close} />
        <Button color="brand" onClick={close}>
          Add to calendar
        </Button>
      </Drawer.Footer>
    </>
  );
};

export const AllVariants: Story = {
  args: {
    children: null,
  },
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          "Every position in its own frame. Drawers start open in the story canvas (and in Chromatic snapshots); on this docs page they start closed so their focus traps don't take over the page — use Open.",
      },
    },
  },
  render: (_args, { viewMode }) => {
    const initialOpen = viewMode !== 'docs';

    return (
      <div className={styles.grid}>
        {DRAWER_POSITIONS.map((position) => (
          <PositionFrame
            key={position}
            position={position}
            label={`position="${position}"`}
            initialOpen={initialOpen}
          >
            <ShortContent />
          </PositionFrame>
        ))}

        <PositionFrame
          position="right"
          mobilePosition="bottom"
          label="Filter drawer (scrolling)"
          initialOpen={initialOpen}
        >
          <FilterCalendarContent />
        </PositionFrame>

        <PositionFrame
          position="right"
          label="aria-label, no heading"
          ariaLabel="Game notes"
          initialOpen={initialOpen}
        >
          <Drawer.Body>
            <UtilityBody size="small">
              Content without a visible title. The drawer is named with aria-label.
            </UtilityBody>
          </Drawer.Body>
        </PositionFrame>
      </div>
    );
  },
};
