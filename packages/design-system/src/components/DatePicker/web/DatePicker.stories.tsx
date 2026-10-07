import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button/web/Button';
import { UtilityLabel } from '@/components/Typography/Utility';
import { CalendarIcon } from '@/icons';
import { DatePicker } from './DatePicker';
import type { CalendarDate } from '../DatePicker.types';
import { formatLongDate } from '../calendarDate';

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
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
} satisfies Meta<typeof DatePicker>;

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
        <DatePicker
          value={value}
          onChange={setValue}
          label={args.label}
          min={args.min}
          max={args.max}
          minMessage={args.minMessage}
          maxMessage={args.maxMessage}
        />
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
            <DatePicker defaultValue={defaultValue} />
          ) : (
            <DatePicker value={value} onChange={() => {}} {...(season ? SEASON : {})} />
          )}
        </div>
      ))}
    </div>
  ),
};

/**
 * With a `trigger`, the calendar opens in a popover: here, a Button showing the selected date. It
 * closes once a day is picked.
 */
export const WithTrigger: Story = {
  args: {
    ...SEASON,
    label: 'Choose a game date',
  },
  render: function WithTriggerRender(args) {
    const [date, setDate] = useState<CalendarDate>('2026-03-10');

    return (
      <DatePicker
        {...args}
        value={date}
        onChange={setDate}
        trigger={
          <Button variant="outlined" icon={<CalendarIcon />} iconPosition="start">
            {formatLongDate(date)}
          </Button>
        }
      />
    );
  },
};
