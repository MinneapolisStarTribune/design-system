import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { RadioGroupField } from './RadioGroupField';

const options = [
  { value: 'print', title: 'Print' },
  { value: 'digital', title: 'Digital' },
];

const Fixture = ({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) => {
  const form = useForm({
    defaultValues: { plan: null as string | null },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <SubmitForm form={form}>
      <form.Field
        name="plan"
        validators={{ onChange: ({ value }) => (value ? undefined : 'Pick a plan') }}
      >
        {(field) => (
          <RadioGroupField field={field} label="Plan" caption="Change anytime" options={options} />
        )}
      </form.Field>
    </SubmitForm>
  );
};

describe('RadioGroupField', () => {
  it('labels the group and writes the picked value', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toHaveAccessibleDescription(
      'Change anytime'
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Digital' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ plan: 'digital' });
  });

  it('shows the error after a submit attempt', async () => {
    render(<Fixture />);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Pick a plan');
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});
