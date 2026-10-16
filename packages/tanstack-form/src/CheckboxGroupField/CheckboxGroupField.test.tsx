import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { CheckboxGroupField } from './CheckboxGroupField';

const options = [
  { value: 'morning', title: 'Morning briefing' },
  { value: 'evening', title: 'Evening wrap' },
];

const Fixture = ({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) => {
  const form = useForm({
    defaultValues: { newsletters: [] as string[] },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <SubmitForm form={form}>
      <form.Field
        name="newsletters"
        validators={{ onChange: ({ value }) => (value.length > 0 ? undefined : 'Pick one') }}
      >
        {(field) => (
          <CheckboxGroupField
            field={field}
            label="Newsletters"
            caption="Sent by email"
            options={options}
          />
        )}
      </form.Field>
    </SubmitForm>
  );
};

describe('CheckboxGroupField', () => {
  it('labels the group and writes checked values', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    expect(screen.getByRole('group', { name: 'Newsletters' })).toHaveAccessibleDescription(
      'Sent by email'
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Evening wrap' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ newsletters: ['evening'] });
  });

  it('shows the error once focus leaves the group, not when moving inside it', async () => {
    render(<Fixture />);
    const morning = screen.getByRole('checkbox', { name: 'Morning briefing' });

    await userEvent.click(morning);
    await userEvent.click(morning);
    await userEvent.tab();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await userEvent.tab();

    expect(screen.getByRole('alert')).toHaveTextContent('Pick one');
    expect(screen.getByRole('group', { name: 'Newsletters' })).toHaveAccessibleDescription(
      'Pick one'
    );
  });
});
