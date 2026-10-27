import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { UtilityButton } from '@/components/Button/web/UtilityButton';
import { UtilityLabel } from '@/components/Typography/Utility';
import { CalendarIcon } from '@/icons';
import { Datepicker } from './Datepicker';
import { ScheduleDatepickerExample } from './Datepicker.examples';
import styles from './Datepicker.module.scss';

const TRIGGERS = {
  Inline: undefined,
  'Date button': <UtilityButton label="Choose date" />,
  'Calendar icon': <UtilityButton icon={<CalendarIcon />} aria-label="Open calendar" />,
};

const meta = {
  title: 'Forms/Datepicker',
  component: Datepicker,
  parameters: { layout: 'centered' },
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled YYYY-MM-DD date; null is an empty selection.',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial uncontrolled selection. Changes here remount the playground.',
    },
    onChange: { action: 'date changed', control: false },
    label: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    trigger: { control: 'select', options: Object.keys(TRIGGERS), mapping: TRIGGERS },
  },
} satisfies Meta<typeof Datepicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: { value: '2026-03-10', label: 'Choose a date', trigger: undefined },
  render: function ConfigurableCalendar(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => {
      setValue(args.value);
    }, [args.value]);
    return (
      <Datepicker
        key={args.defaultValue ?? 'empty'}
        value={args.value === undefined ? undefined : value}
        defaultValue={args.defaultValue}
        onChange={(nextValue) => {
          args.onChange?.(nextValue);
          if (args.value !== undefined) setValue(nextValue);
        }}
        label={args.label}
        min={args.min}
        max={args.max}
        trigger={args.trigger}
      />
    );
  },
};

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div className={styles.examples}>
      <section className={styles.example}>
        <UtilityLabel size="large" weight="semibold">
          Inline selection
        </UtilityLabel>
        <Datepicker defaultValue="2026-03-10" />
      </section>
      <section className={styles.example}>
        <UtilityLabel size="large" weight="semibold">
          Empty, limited to March
        </UtilityLabel>
        <Datepicker value={null} min="2026-03-05" max="2026-03-25" />
      </section>
      <section className={styles.example}>
        <UtilityLabel size="large" weight="semibold">
          Leap year and date limits
        </UtilityLabel>
        <Datepicker defaultValue="2024-02-29" min="2024-02-10" max="2024-03-05" />
      </section>
      <section className={`${styles.example} ${styles.popoverExample}`}>
        <UtilityLabel size="large" weight="semibold">
          Schedule calendar and Today
        </UtilityLabel>
        <ScheduleDatepickerExample />
      </section>
    </div>
  ),
};
