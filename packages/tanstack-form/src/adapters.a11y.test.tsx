import React from 'react';
import { type AnyFieldApi, useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleGroup } from '@minneapolisstartribune/design-system/web';
import { SubmitForm } from './test-utils/SubmitForm';
import {
  CheckboxGroupField,
  MultiSelectField,
  NumberField,
  PasswordField,
  RadioGroupField,
  SelectField,
  TextAreaField,
  TextField,
  ToggleGroupField,
} from './index';

// Only covers what the adapters wire up on top of the controls (label, description and error
// associations). The controls' own a11y is covered by their suites in design-system.

const labelProps = { label: 'Label', description: 'Some help' };
const options = [
  { value: 'a', label: 'A', title: 'A' },
  { value: 'b', label: 'B', title: 'B' },
];

interface Case {
  name: string;
  /** Role of the labelled element. `null` for password inputs, which have no role. */
  role: string | null;
  defaultValue: unknown;
  render: (field: AnyFieldApi) => React.ReactNode;
}

const cases: Case[] = [
  {
    name: 'TextField',
    role: 'textbox',
    defaultValue: '',
    render: (field) => <TextField field={field} {...labelProps} />,
  },
  {
    name: 'TextAreaField',
    role: 'textbox',
    defaultValue: '',
    render: (field) => <TextAreaField field={field} {...labelProps} />,
  },
  {
    name: 'PasswordField',
    role: null,
    defaultValue: '',
    render: (field) => (
      <PasswordField field={field} {...labelProps} autoComplete="current-password" />
    ),
  },
  {
    name: 'NumberField',
    role: 'spinbutton',
    defaultValue: undefined,
    render: (field) => <NumberField field={field} {...labelProps} />,
  },
  {
    name: 'SelectField',
    role: 'combobox',
    defaultValue: '',
    render: (field) => <SelectField field={field} {...labelProps} options={options} />,
  },
  {
    name: 'MultiSelectField',
    role: 'combobox',
    defaultValue: [],
    render: (field) => <MultiSelectField field={field} {...labelProps} options={options} />,
  },
  {
    name: 'RadioGroupField',
    role: 'radiogroup',
    defaultValue: null,
    render: (field) => <RadioGroupField field={field} {...labelProps} options={options} />,
  },
  {
    name: 'CheckboxGroupField',
    role: 'group',
    defaultValue: [],
    render: (field) => <CheckboxGroupField field={field} {...labelProps} options={options} />,
  },
  {
    name: 'ToggleGroupField (single)',
    role: 'radiogroup',
    defaultValue: '',
    render: (field) => (
      <ToggleGroupField type="single" field={field} {...labelProps}>
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      </ToggleGroupField>
    ),
  },
  {
    name: 'ToggleGroupField (multiple)',
    role: 'group',
    defaultValue: [],
    render: (field) => (
      <ToggleGroupField type="multiple" field={field} {...labelProps}>
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      </ToggleGroupField>
    ),
  },
];

const getControl = ({ role }: Case) =>
  role ? screen.getByRole(role, { name: 'Label' }) : screen.getByLabelText('Label');

const isEmpty = (value: unknown) =>
  value == null || value === '' || (Array.isArray(value) && value.length === 0);

const Fixture = ({ defaultValue, render: renderField }: Case) => {
  const form = useForm({ defaultValues: { value: defaultValue } });
  return (
    <SubmitForm form={form}>
      <form.Field
        name="value"
        validators={{ onChange: ({ value }) => (isEmpty(value) ? 'Required' : undefined) }}
      >
        {(field) => renderField(field)}
      </form.Field>
    </SubmitForm>
  );
};

describe.each(cases)('$name accessibility', (testCase) => {
  it('names the control by its label and describes it by the description', () => {
    render(<Fixture {...testCase} />);

    expect(getControl(testCase)).toHaveAccessibleDescription('Some help');
  });

  it('adds the visible validation error to the description', async () => {
    render(<Fixture {...testCase} />);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(getControl(testCase)).toHaveAccessibleDescription('Some help Required');
  });
});

describe('custom control id', () => {
  const idCases: Case[] = [
    {
      name: 'TextField',
      role: 'textbox',
      defaultValue: '',
      render: (field) => <TextField field={field} label="Label" id="custom" />,
    },
    {
      name: 'TextAreaField',
      role: 'textbox',
      defaultValue: '',
      render: (field) => <TextAreaField field={field} label="Label" id="custom" />,
    },
    {
      name: 'PasswordField',
      role: null,
      defaultValue: '',
      render: (field) => (
        <PasswordField field={field} label="Label" id="custom" autoComplete="current-password" />
      ),
    },
    {
      name: 'NumberField',
      role: 'spinbutton',
      defaultValue: undefined,
      render: (field) => <NumberField field={field} label="Label" id="custom" />,
    },
  ];

  it.each(idCases)('$name: clicking the label focuses the input', async (testCase) => {
    render(<Fixture {...testCase} />);

    await userEvent.click(screen.getByText('Label'));

    expect(getControl(testCase)).toHaveFocus();
  });
});
