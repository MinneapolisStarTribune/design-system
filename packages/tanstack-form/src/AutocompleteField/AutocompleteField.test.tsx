import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { AutocompleteField } from './AutocompleteField';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];
function Fixture({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) {
  const form = useForm({
    defaultValues: { single: '' },
    onSubmit: ({ value }) => onSubmit(value),
  });
  return (
    <SubmitForm form={form}>
      <form.Field
        name="single"
        validators={{ onBlur: ({ value }) => (value ? undefined : 'Required') }}
      >
        {(field) => <AutocompleteField field={field} label="Single" options={options} />}
      </form.Field>
      <button type="button" onClick={() => form.reset()}>
        Reset
      </button>
    </SubmitForm>
  );
}
it('submits a single selection and resets it', async () => {
  const user = userEvent.setup();
  const submit = vi.fn();
  render(<Fixture onSubmit={submit} />);
  await user.click(screen.getByRole('combobox', { name: 'Single' }));
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(submit).toHaveBeenCalledWith({ single: 'a' });
  await user.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByRole('combobox', { name: 'Single' })).toHaveValue('');
});
it('clears single values and validates on leaving the field', async () => {
  const user = userEvent.setup();
  render(<Fixture />);
  await user.click(screen.getByText('Single'));
  expect(screen.getByRole('combobox', { name: 'Single' })).toHaveFocus();
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  await user.clear(screen.getByRole('combobox', { name: 'Single' }));
  await user.tab();
  expect(await screen.findByRole('alert')).toHaveTextContent('Required');
});
