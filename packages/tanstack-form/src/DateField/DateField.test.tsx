import { useForm } from '@tanstack/react-form';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider, validateDateInput } from '@minneapolisstartribune/design-system/web';
import { DateField } from './DateField';

const limits = { required: true, min: '2026-04-18', max: '2026-04-20' };
const validate = ({ value }: { value: string | null }) => validateDateInput(value, limits);
function Example({
  onSubmit = vi.fn(),
  onChange = vi.fn(),
  onBlur = vi.fn(),
  initial = '2026-04-18' as string | null,
}) {
  const form = useForm({
    defaultValues: { date: initial },
    onSubmit: ({ value }) => onSubmit(value.date),
  });
  return (
    <DesignSystemProvider brand="varsity">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="date" validators={{ onChange: validate, onBlur: validate }}>
          {(field) => (
            <DateField
              {...limits}
              field={field}
              label="Game date"
              description="Season date"
              caption="Choose a date"
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        </form.Field>
        <button type="submit">Save</button>
        <button type="button" onClick={() => void form.handleSubmit()}>
          Submit programmatically
        </button>
        <button type="button" onClick={() => form.reset()}>
          Reset
        </button>
      </form>
    </DesignSystemProvider>
  );
}

describe('DateField', () => {
  it('submits a calendar selection and connects the label and descriptions', async () => {
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    render(<Example onSubmit={onSubmit} onChange={onChange} />);
    const user = userEvent.setup();
    expect(screen.getByRole('textbox', { name: 'Game date' })).toHaveAccessibleDescription(
      'Season date Choose a date'
    );
    await user.click(screen.getByRole('button', { name: 'Choose a date' }));
    await user.click(screen.getByRole('button', { name: 'Monday, April 20, 2026' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('2026-04-20'));
    expect(onChange).toHaveBeenCalledWith('2026-04-20');
  });

  it('blocks an out-of-range programmatic submission and restores the initial value on reset', async () => {
    const onSubmit = vi.fn();
    const onBlur = vi.fn();
    render(<Example onSubmit={onSubmit} onBlur={onBlur} />);
    const user = userEvent.setup();
    const input = screen.getByRole('textbox', { name: 'Game date' });
    await user.clear(input);
    await user.type(input, '4/21/2026');
    await user.click(screen.getByRole('button', { name: 'Submit programmatically' }));
    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible());
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(onBlur).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(input).toHaveValue('April 18, 2026');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('2026-04-18'));
  });

  it('runs blur validation after a calendar-only visit', async () => {
    render(<Example initial={null} />);
    const user = userEvent.setup();
    const trigger = screen.getByRole('button', { name: 'Choose a date' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.tab();
    expect(await screen.findByRole('alert')).toHaveTextContent('Choose a date.');
  });

  it('shows an untouched empty field error on submit and clears it on reset', async () => {
    const onSubmit = vi.fn();
    render(<Example initial={null} onSubmit={onSubmit} />);
    const user = userEvent.setup();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Choose a date.');
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
