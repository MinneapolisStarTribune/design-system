import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button/web/Button';
import { TriggerablePopover } from '@/components/TriggerablePopover/TriggerablePopover';
import { UtilityLabel } from '@/components/Typography/Utility';
import { CalendarIcon } from '@/icons';
import { StaticDatePicker } from './StaticDatePicker';
import storyStyles from './StaticDatePicker.stories.module.scss';
import type { CalendarDate } from '../StaticDatePicker.types';
import { formatLongDate } from '../calendarDate';

const meta = {
  title: 'Forms/StaticDatePicker',
  component: StaticDatePicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected date as `YYYY-MM-DD` (controlled)',
    },
    min: { control: 'text', description: 'Earliest selectable date (`YYYY-MM-DD`)' },
    max: { control: 'text', description: 'Latest selectable date (`YYYY-MM-DD`)' },
    minMessage: { control: 'text', description: 'Tooltip on the previous arrow at `min`' },
    maxMessage: { control: 'text', description: 'Tooltip on the next arrow at `max`' },
    label: {
      control: 'text',
      description: 'Accessible name for the calendar',
    },
  },
} satisfies Meta<typeof StaticDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    value: '2026-03-10',
    label: 'Choose a game date',
  },
  render: function ConfigurableRender(args) {
    const [value, setValue] = useState(args.value);

    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StaticDatePicker {...args} value={value} onChange={setValue} />
        <UtilityLabel size="small">Selected: {value ?? 'none'}</UtilityLabel>
      </div>
    );
  },
};

const SEASON = {
  min: '2025-11-01',
  max: '2026-03-14',
  minMessage: 'No games to display before November 2025',
  maxMessage: 'No games to display after March 2026',
} as const;

const VARIANTS: {
  title: string;
  value: CalendarDate | null;
  defaultValue?: CalendarDate;
  season?: boolean;
}[] = [
  { title: 'Selected (5-week month)', value: '2026-03-10' },
  { title: 'Selected (6-week month)', value: '2026-08-31' },
  { title: 'Leap day', value: '2028-02-29' },
  { title: 'Uncontrolled with defaultValue', value: null, defaultValue: '2026-12-25' },
  { title: 'Season start (min)', value: '2025-11-08', season: true },
  { title: 'Season end (max)', value: '2026-03-10', season: true },
];

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
      {VARIANTS.map(({ title, value, defaultValue, season }) => (
        <div key={title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <UtilityLabel size="small" weight="semibold">
            {title}
          </UtilityLabel>
          {defaultValue ? (
            <StaticDatePicker defaultValue={defaultValue} />
          ) : (
            <StaticDatePicker value={value} onChange={() => {}} {...(season ? SEASON : {})} />
          )}
        </div>
      ))}
    </div>
  ),
};

/**
 * Opened from your own trigger: a Button that opens the calendar in a TriggerablePopover and closes
 * it once a day is picked. Use this when the trigger isn't a text field (otherwise use DatePicker).
 */
export const InPopover: Story = {
  args: {
    ...SEASON,
  },
  render: function InPopoverRender(args) {
    const [date, setDate] = useState<CalendarDate>('2026-03-10');
    const [open, setOpen] = useState(false);

    return (
      <TriggerablePopover
        open={open}
        onOpenChange={setOpen}
        aria-label="Choose a game date"
        containerClassName={storyStyles.popoverContainer}
        trigger={
          <Button
            variant="outlined"
            icon={<CalendarIcon />}
            iconPosition="start"
            className={storyStyles.trigger}
          >
            {formatLongDate(date)}
          </Button>
        }
      >
        <StaticDatePicker
          {...args}
          value={date}
          onChange={(next) => {
            setDate(next);
            setOpen(false);
          }}
        />
      </TriggerablePopover>
    );
  },
};
