import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { SwitchField } from './SwitchField';

const Fixture = ({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) => {
  const form = useForm({
    defaultValues: { alerts: true },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <SubmitForm form={form}>
      <form.Field
        name="alerts"
        validators={{ onChange: ({ value }) => (value ? undefined : 'Alerts are required') }}
      >
        {(field) => <SwitchField field={field} label="Breaking news alerts" />}
      </form.Field>
    </SubmitForm>
  );
};

describe('SwitchField', () => {
  it('binds and writes the selected state', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    const toggle = screen.getByRole('switch', { name: 'Breaking news alerts' });
    expect(toggle).toBeChecked();
    expect(toggle).toHaveAttribute('name', 'alerts');

    await userEvent.click(toggle);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Alerts are required');
    expect(toggle).toHaveAccessibleDescription('Alerts are required');
  });
});
