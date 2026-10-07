import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import { DATE_PICKER_SIZES } from '../DatePicker.types';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Forms/FormControl/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected date as `YYYY-MM-DD` (controlled)',
    },
    size: {
      control: 'select',
      options: DATE_PICKER_SIZES,
    },
    isDisabled: { control: 'boolean' },
    isError: { control: 'boolean' },
    placeholderText: { control: 'text' },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    value: '2026-03-10',
    size: 'medium',
    isDisabled: false,
    isError: false,
  },
  render: function ConfigurableRender(args) {
    const [value, setValue] = useState(args.value);

    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    return (
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FormGroup>
          <FormGroup.Label>Game date</FormGroup.Label>
          <DatePicker {...args} value={value} onChange={setValue} />
        </FormGroup>
        <UtilityLabel size="small">Value: {value ?? 'null'}</UtilityLabel>
      </div>
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 240px)', gap: 24 }}>
      {DATE_PICKER_SIZES.map((size) => (
        <DatePicker key={size} size={size} defaultValue="2026-03-10" aria-label={size} />
      ))}
      <DatePicker aria-label="Empty" />
      <DatePicker defaultValue="2026-03-10" isError aria-label="Error" />
      <DatePicker defaultValue="2026-03-10" isDisabled aria-label="Disabled" />
    </div>
  ),
};
