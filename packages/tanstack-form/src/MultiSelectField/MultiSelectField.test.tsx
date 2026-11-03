import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { MultiSelectField } from './MultiSelectField';

const options = [
  { value: 'news', label: 'News' },
  { value: 'sports', label: 'Sports' },
  { value: 'food', label: 'Food' },
];

const Fixture = ({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) => {
  const form = useForm({
    defaultValues: { topics: ['news'] },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <SubmitForm form={form}>
      <form.Field
        name="topics"
        validators={{ onChange: ({ value }) => (value.length > 0 ? undefined : 'Pick a topic') }}
      >
        {(field) => <MultiSelectField field={field} label="Topics" options={options} />}
      </form.Field>
    </SubmitForm>
  );
};

describe('MultiSelectField', () => {
  it('binds the initial values and writes toggled options', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    const trigger = screen.getByRole('combobox', { name: 'Topics' });
    expect(trigger).toHaveTextContent('News');

    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('option', { name: 'Food' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ topics: ['news', 'food'] });
  });

  it('shows the error once focus leaves', async () => {
    render(<Fixture />);
    const trigger = screen.getByRole('combobox', { name: 'Topics' });

    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('option', { name: 'News' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.tab();

    expect(screen.getByRole('alert')).toHaveTextContent('Pick a topic');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });
});
