import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as ToggleGroup from './ToggleGroup';
import { TOGGLE_GROUP_SIZES, TOGGLE_GROUP_TYPES, type ToggleGroupSize } from './ToggleGroup.types';
import {
  CalendarIcon,
  ChartIcon,
  DeviceMobileIcon,
  MailIcon,
  MenuStackedIcon,
  NotificationIcon,
  SportsBasketballIcon,
  SportsFootballIcon,
  SportsHockeyIcon,
} from '@/icons';
import { allModes } from '@storybook-config/modes';
import storyStyles from './ToggleGroup.stories.module.scss';
import { SectionHeading } from '@/index.web';

const GAME_FILTERS = [
  { value: 'all', label: 'All Games', count: 48 },
  { value: 'past', label: 'Past', count: 30 },
  { value: 'upcoming', label: 'Upcoming', count: 18 },
];

const LEVELS = [
  { value: 'varsity', label: 'Varsity' },
  { value: 'jv', label: 'JV' },
  { value: 'sophomore', label: 'Sophomore' },
  { value: 'freshman', label: 'Freshman' },
];

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <SectionHeading importance={6} className={storyStyles.sectionLabel}>
    {children}
  </SectionHeading>
);

const VIEWS = [
  { value: 'list', label: 'List view', Icon: MenuStackedIcon },
  { value: 'calendar', label: 'Calendar view', Icon: CalendarIcon },
  { value: 'chart', label: 'Chart view', Icon: ChartIcon },
];

const SPORTS = [
  { value: 'football', label: 'Football', Icon: SportsFootballIcon },
  { value: 'basketball', label: 'Basketball', Icon: SportsBasketballIcon },
  { value: 'hockey', label: 'Hockey', Icon: SportsHockeyIcon },
];

const ALERT_CHANNELS = [
  { value: 'push', label: 'Push notifications', Icon: NotificationIcon },
  { value: 'email', label: 'Email', Icon: MailIcon },
  { value: 'sms', label: 'Text message', Icon: DeviceMobileIcon },
];

const GameFilterItems = () =>
  GAME_FILTERS.map(({ value, label, count }) => (
    <ToggleGroup.Item key={value} value={value}>
      {label} <ToggleGroup.Detail>({count})</ToggleGroup.Detail>
    </ToggleGroup.Item>
  ));

const LevelItems = () =>
  LEVELS.map(({ value, label }) => (
    <ToggleGroup.Item key={value} value={value}>
      {label}
    </ToggleGroup.Item>
  ));

const meta = {
  title: 'Actions/ToggleGroup',
  component: ToggleGroup.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A set of joined toggles. `single` keeps exactly one selected (a radio group); `multiple` lets any number be selected. Web only. Docs: `ToggleGroup.mdx`.',
      },
    },
  },
  argTypes: {
    children: { control: false },
    type: {
      control: 'inline-radio',
      options: [...TOGGLE_GROUP_TYPES],
      description: 'Selection mode. `single` behaves as a radio group, `multiple` as checkboxes.',
      table: {
        type: { summary: TOGGLE_GROUP_TYPES.join(' | ') },
        defaultValue: { summary: "'single'" },
      },
    },
    label: {
      control: 'text',
      description: 'Accessible name for the group (not shown).',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'inline-radio',
      options: [...TOGGLE_GROUP_SIZES],
      description: 'Item height and padding, matching `Button` sizes.',
      table: {
        type: { summary: TOGGLE_GROUP_SIZES.join(' | ') },
        defaultValue: { summary: "'medium'" },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch to the container width, splitting it evenly between items.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every item.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    value: { control: false },
    onChange: { action: 'onChange' },
  },
} satisfies Meta<typeof ToggleGroup.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every prop except `value` (the story owns the selection so clicks respond). Switch `type` to
 * `multiple` to see the checkbox behavior; it swaps in the level filters.
 */
export const Configurable: Story = {
  args: {
    type: 'single',
    label: 'Filter games',
    value: 'all',
    size: 'medium',
    fullWidth: false,
    disabled: false,
    onChange: () => {},
    children: null,
  },
  render: function ConfigurableRender({ type, label, size, fullWidth, disabled, onChange }) {
    const [single, setSingle] = useState('all');
    const [multiple, setMultiple] = useState<string[]>(['varsity']);
    const reportChange = onChange as (value: string | string[]) => void;

    if (type === 'multiple') {
      return (
        <ToggleGroup.Root
          type="multiple"
          label={label ?? 'Filter games'}
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          value={multiple}
          onChange={(next) => {
            setMultiple(next);
            reportChange(next);
          }}
        >
          <LevelItems />
        </ToggleGroup.Root>
      );
    }

    return (
      <ToggleGroup.Root
        label={label ?? 'Filter games'}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        value={single}
        onChange={(next) => {
          setSingle(next);
          reportChange(next);
        }}
      >
        <GameFilterItems />
      </ToggleGroup.Root>
    );
  },
};

interface ExampleProps {
  label: string;
  size?: ToggleGroupSize;
  fullWidth?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

/** A single-select group that owns its selection, so every example responds to clicks. */
const SingleExample = ({
  initialValue,
  label,
  size,
  fullWidth,
  disabled,
  children,
}: ExampleProps & { initialValue: string }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <ToggleGroup.Root
      label={label}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      value={value}
      onChange={setValue}
    >
      {children}
    </ToggleGroup.Root>
  );
};

const MultipleExample = ({
  initialValue,
  label,
  size,
  fullWidth,
  disabled,
  children,
}: ExampleProps & { initialValue: string[] }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <ToggleGroup.Root
      type="multiple"
      label={label}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      value={value}
      onChange={setValue}
    >
      {children}
    </ToggleGroup.Root>
  );
};

/**
 * Every content type and state, for Chromatic visual
 * regression across brand and theme modes. Icons go in the children, like text, and take the
 * item's text color; icon-only items need `aria-label`.
 */
export const AllVariants: Story = {
  args: { label: 'Filter games', value: 'all', onChange: () => {}, children: null },
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'padded',
  },
  render: () => (
    <div className={storyStyles.toggleGroupContainer}>
      <div>
        <SectionLabel>Single</SectionLabel>
        <SingleExample label="Filter games" initialValue="all">
          <GameFilterItems />
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Multiple</SectionLabel>
        <MultipleExample label="Levels" initialValue={['varsity', 'jv']}>
          <LevelItems />
        </MultipleExample>
      </div>

      <div>
        <SectionLabel>Icon only</SectionLabel>
        <SingleExample label="View" initialValue="list">
          {VIEWS.map(({ value, label, Icon }) => (
            <ToggleGroup.Item key={value} value={value} aria-label={label}>
              <Icon />
            </ToggleGroup.Item>
          ))}
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Icon only, multiple</SectionLabel>
        <MultipleExample label="Alert channels" initialValue={['push']}>
          {ALERT_CHANNELS.map(({ value, label, Icon }) => (
            <ToggleGroup.Item key={value} value={value} aria-label={label}>
              <Icon />
            </ToggleGroup.Item>
          ))}
        </MultipleExample>
      </div>

      <div>
        <SectionLabel>Icon and label</SectionLabel>
        <SingleExample label="Sport" initialValue="hockey">
          {SPORTS.map(({ value, label, Icon }) => (
            <ToggleGroup.Item key={value} value={value}>
              <Icon />
              {label}
            </ToggleGroup.Item>
          ))}
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Sizes</SectionLabel>
        <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
          {TOGGLE_GROUP_SIZES.map((size) => (
            <SingleExample
              key={size}
              label={`Filter games (${size})`}
              initialValue="all"
              size={size}
            >
              <GameFilterItems />
            </SingleExample>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Full width</SectionLabel>
        <SingleExample label="Filter games" initialValue="all" fullWidth>
          <GameFilterItems />
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Disabled item</SectionLabel>
        <SingleExample label="Filter games" initialValue="all">
          <ToggleGroup.Item value="all">
            All Games <ToggleGroup.Detail>(48)</ToggleGroup.Detail>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="past">
            Past <ToggleGroup.Detail>(30)</ToggleGroup.Detail>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="upcoming" disabled>
            Upcoming <ToggleGroup.Detail>(0)</ToggleGroup.Detail>
          </ToggleGroup.Item>
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Disabled group</SectionLabel>
        <SingleExample label="Filter games" initialValue="all" disabled>
          <GameFilterItems />
        </SingleExample>
      </div>
    </div>
  ),
};
