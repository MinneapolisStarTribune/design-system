import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { CheckboxField } from './CheckboxField';

const Fixture = ({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) => {
  const form = useForm({
    defaultValues: { terms: false },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <SubmitForm form={form}>
      <form.Field
        name="terms"
        validators={{ onChange: ({ value }) => (value ? undefined : 'Accept the terms') }}
      >
        {(field) => <CheckboxField field={field} label="I accept the terms" />}
      </form.Field>
    </SubmitForm>
  );
};

describe('CheckboxField', () => {
  it('writes the checked state', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('checkbox', { name: 'I accept the terms' }));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ terms: true });
  });

  it('shows the error once blurred', async () => {
    render(<Fixture />);
    const checkbox = screen.getByRole('checkbox', { name: 'I accept the terms' });

    await userEvent.click(checkbox);
    await userEvent.click(checkbox);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.tab();

    expect(screen.getByRole('alert')).toHaveTextContent('Accept the terms');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription('Accept the terms');
  });

  it('only accepts boolean fields', () => {
    const StringFixture = () => {
      const form = useForm({ defaultValues: { terms: '' } });
      return (
        <form.Field name="terms">
          {/* @ts-expect-error CheckboxField needs a boolean field */}
          {(field) => <CheckboxField field={field} label="Terms" />}
        </form.Field>
      );
    };
    expect(StringFixture).toBeDefined();
  });
});
