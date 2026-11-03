import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { SelectField } from './SelectField';

const options = [
  { value: 'mn', label: 'Minnesota' },
  { value: 'wi', label: 'Wisconsin' },
];

const required = ({ value }: { value: string }) => (value ? undefined : 'Pick a state');

const Fixture = ({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) => {
  const form = useForm({
    defaultValues: { state: '' },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <SubmitForm form={form}>
      <form.Field name="state" validators={{ onChange: required, onBlur: required }}>
        {(field) => (
          <SelectField field={field} label="State" caption="Where you live" options={options} />
        )}
      </form.Field>
    </SubmitForm>
  );
};

describe('SelectField', () => {
  it('labels the combobox and writes the picked option', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    expect(screen.getByRole('combobox', { name: 'State' })).toHaveAccessibleDescription(
      'Where you live'
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'State' }));
    await userEvent.click(screen.getByRole('option', { name: 'Wisconsin' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ state: 'wi' });
  });

  it('shows the error after a submit attempt', async () => {
    render(<Fixture />);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Pick a state');
    expect(screen.getByRole('combobox', { name: 'State' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('marks the field blurred only when focus leaves the select', async () => {
    render(<Fixture />);

    await userEvent.click(screen.getByRole('combobox', { name: 'State' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await userEvent.click(document.body);

    expect(screen.getByRole('alert')).toHaveTextContent('Pick a state');
  });
});
