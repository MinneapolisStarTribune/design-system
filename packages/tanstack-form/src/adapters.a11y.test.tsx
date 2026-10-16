import React from 'react';
import { type AnyFieldApi, useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from './test-utils/SubmitForm';
import { TextField } from './index';

// Only covers what the adapters wire up on top of the controls (label, description and error
// associations). The controls' own a11y is covered by their suites in design-system.

const Fixture = ({ render: renderField }: { render: (field: AnyFieldApi) => React.ReactNode }) => {
  const form = useForm({ defaultValues: { value: '' } });
  return (
    <SubmitForm form={form}>
      <form.Field
        name="value"
        validators={{ onChange: ({ value }) => (value === '' ? 'Required' : undefined) }}
      >
        {(field) => renderField(field)}
      </form.Field>
    </SubmitForm>
  );
};

const getControl = () => screen.getByRole('textbox', { name: 'Label' });

describe('TextField accessibility', () => {
  const renderDescribed = () =>
    render(
      <Fixture
        render={(field) => <TextField field={field} label="Label" description="Some help" />}
      />
    );

  it('names the control by its label and describes it by the description', () => {
    renderDescribed();

    expect(getControl()).toHaveAccessibleDescription('Some help');
  });

  it('adds the visible validation error to the description', async () => {
    renderDescribed();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(getControl()).toHaveAccessibleDescription('Some help Required');
  });

  it('clicking the label focuses the input with a custom id', async () => {
    render(<Fixture render={(field) => <TextField field={field} label="Label" id="custom" />} />);

    await userEvent.click(screen.getByText('Label'));

    expect(getControl()).toHaveFocus();
  });
});
