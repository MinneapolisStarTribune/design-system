import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { PasswordField } from './PasswordField';

const Fixture = ({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) => {
  const form = useForm({
    defaultValues: { password: '' },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <SubmitForm form={form}>
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => (value.length < 8 ? 'At least 8 characters' : undefined),
        }}
      >
        {(field) => <PasswordField field={field} label="Password" autoComplete="new-password" />}
      </form.Field>
    </SubmitForm>
  );
};

describe('PasswordField', () => {
  it('writes typed values to the form', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('name', 'password');
    await userEvent.type(input, 'hunter2!!');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ password: 'hunter2!!' });
  });

  it('shows the error once blurred', async () => {
    render(<Fixture />);
    const input = screen.getByLabelText('Password');

    await userEvent.type(input, 'short');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.tab();

    expect(screen.getByRole('alert')).toHaveTextContent('At least 8 characters');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
