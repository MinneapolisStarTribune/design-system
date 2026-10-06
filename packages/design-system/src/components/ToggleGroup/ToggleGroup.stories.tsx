import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as ToggleGroup from './ToggleGroup';
import {
  TOGGLE_GROUP_COLORS,
  TOGGLE_GROUP_TYPES,
  TOGGLE_GROUP_VARIANTS,
  type ToggleGroupMultipleProps,
  type ToggleGroupProps,
  type ToggleGroupSingleProps,
} from './ToggleGroup.types';
import { UtilityLabel } from '@/components/Typography/Utility';
import {
  CalendarIcon,
  ChartIcon,
  DeviceMobileIcon,
  MailIcon,
  MenuStackedIcon,
  NotificationIcon,
  SportsBaseballIcon,
  SportsBasketballIcon,
  SportsFootballIcon,
  SportsHockeyIcon,
} from '@/icons';
import { allModes } from '@storybook-config/modes';
import storyStyles from './ToggleGroup.stories.module.scss';

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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 8 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
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
  { value: 'baseball', label: 'Baseball', Icon: SportsBaseballIcon },
];

const ALERT_CHANNELS = [
  { value: 'push', label: 'Push notifications', Icon: NotificationIcon },
  { value: 'email', label: 'Email', Icon: MailIcon },
  { value: 'sms', label: 'Text message', Icon: DeviceMobileIcon },
];

const FinePrint = ({ children }: { children: React.ReactNode }) => (
  <span className={storyStyles.finePrint}>{children}</span>
);

const GameFilterItems = () =>
  GAME_FILTERS.map(({ value, label, count }) => (
    <ToggleGroup.Item key={value} value={value}>
      {label} <FinePrint>({count})</FinePrint>
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
    color: {
      control: 'inline-radio',
      options: [...TOGGLE_GROUP_COLORS],
      description: 'Fill of the selected items. Matches the `filled` Button of the same color.',
      table: {
        type: { summary: TOGGLE_GROUP_COLORS.join(' | ') },
        defaultValue: { summary: "'brand'" },
      },
    },
    variant: {
      control: 'inline-radio',
      options: [...TOGGLE_GROUP_VARIANTS],
      description: 'Visual style.',
      table: {
        type: { summary: TOGGLE_GROUP_VARIANTS.join(' | ') },
        defaultValue: { summary: "'segmented'" },
      },
    },
    label: {
      control: 'text',
      description: 'Accessible name for the group (not shown).',
      table: { type: { summary: 'string' } },
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

export const Configurable: Story = {
  argTypes: { type: { control: false } },
  args: {
    label: 'Filter games',
    value: 'all',
    color: 'brand',
    variant: 'segmented',
    fullWidth: false,
    disabled: false,
    onChange: () => {},
    children: null,
  },
  render: function ConfigurableRender({ onChange, ...args }) {
    const [value, setValue] = useState<string>('all');

    return (
      <ToggleGroup.Root
        {...(args as Omit<ToggleGroupProps, 'type' | 'value' | 'onChange'>)}
        value={value}
        onChange={(next: string) => {
          setValue(next);
          (onChange as (value: string) => void)(next);
        }}
      >
        <GameFilterItems />
      </ToggleGroup.Root>
    );
  },
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
    label: 'Levels',
    value: ['varsity'],
    onChange: () => {},
    children: null,
  },
  render: function MultipleRender({ onChange, ...args }) {
    const [value, setValue] = useState<string[]>(['varsity']);

    useEffect(() => {
      if (Array.isArray(args.value)) setValue(args.value);
    }, [args.value]);

    return (
      <ToggleGroup.Root
        {...(args as Omit<ToggleGroupProps, 'type' | 'value' | 'onChange'>)}
        type="multiple"
        value={value}
        onChange={(next: string[]) => {
          setValue(next);
          (onChange as (value: string[]) => void)(next);
        }}
      >
        {LEVELS.map(({ value: levelValue, label }) => (
          <ToggleGroup.Item key={levelValue} value={levelValue}>
            {label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    );
  },
};

/** A single-select group that owns its selection, so every example responds to clicks. */
const SingleExample = ({
  initialValue,
  ...props
}: Omit<ToggleGroupSingleProps, 'type' | 'value' | 'onChange'> & { initialValue: string }) => {
  const [value, setValue] = useState(initialValue);
  return <ToggleGroup.Root {...props} value={value} onChange={setValue} />;
};

const MultipleExample = ({
  initialValue,
  ...props
}: Omit<ToggleGroupMultipleProps, 'type' | 'value' | 'onChange'> & { initialValue: string[] }) => {
  const [value, setValue] = useState(initialValue);
  return <ToggleGroup.Root {...props} type="multiple" value={value} onChange={setValue} />;
};

/**
 * Icons from `@/icons` go in the children, like text. They take the item's text color, so they
 * read on the selected fill too. Icon-only items need `aria-label`, and are laid out square.
 */
export const IconOnly: Story = {
  args: { value: 'list', onChange: () => {}, children: null },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <SectionLabel>View switcher</SectionLabel>
        <SingleExample label="View" initialValue="list">
          {VIEWS.map(({ value, label, Icon }) => (
            <ToggleGroup.Item key={value} value={value} aria-label={label}>
              <Icon />
            </ToggleGroup.Item>
          ))}
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Sport (neutral)</SectionLabel>
        <SingleExample label="Sport" color="neutral" initialValue="hockey">
          {SPORTS.map(({ value, label, Icon }) => (
            <ToggleGroup.Item key={value} value={value} aria-label={label}>
              <Icon />
            </ToggleGroup.Item>
          ))}
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Alert channels (multiple)</SectionLabel>
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
        <SingleExample label="View" initialValue="calendar">
          {VIEWS.map(({ value, label, Icon }) => (
            <ToggleGroup.Item key={value} value={value}>
              <Icon size="small" />
              {label.replace(' view', '')}
            </ToggleGroup.Item>
          ))}
        </SingleExample>
      </div>
    </div>
  ),
};

/**
 * Every color and state, for Chromatic visual regression across brand and theme modes.
 */
export const AllVariants: Story = {
  args: { value: 'all', onChange: () => {}, children: null },
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'grid', gap: '2rem', maxWidth: 560 }}>
      <div>
        <SectionLabel>Brand</SectionLabel>
        <SingleExample label="Filter games" initialValue="all">
          <GameFilterItems />
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Neutral</SectionLabel>
        <SingleExample label="Filter games" color="neutral" initialValue="past">
          <GameFilterItems />
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Text only</SectionLabel>
        <SingleExample label="Range" initialValue="day">
          <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
          <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
          <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Full width</SectionLabel>
        <SingleExample label="Filter games" initialValue="all" fullWidth>
          <GameFilterItems />
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Multiple</SectionLabel>
        <MultipleExample label="Levels" initialValue={['varsity', 'jv']}>
          {LEVELS.map(({ value, label }) => (
            <ToggleGroup.Item key={value} value={value}>
              {label}
            </ToggleGroup.Item>
          ))}
        </MultipleExample>
      </div>

      <div>
        <SectionLabel>Icon only</SectionLabel>
        <SingleExample label="View" initialValue="calendar">
          {VIEWS.map(({ value, label, Icon }) => (
            <ToggleGroup.Item key={value} value={value} aria-label={label}>
              <Icon />
            </ToggleGroup.Item>
          ))}
        </SingleExample>
      </div>

      <div>
        <SectionLabel>Disabled item</SectionLabel>
        <SingleExample label="Filter games" initialValue="all">
          <ToggleGroup.Item value="all">
            All Games <FinePrint>(48)</FinePrint>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="past">
            Past <FinePrint>(30)</FinePrint>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="upcoming" disabled>
            Upcoming <FinePrint>(0)</FinePrint>
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
