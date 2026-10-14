import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';

const Fixture = ({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) => {
  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => (value.length === 0 ? 'Email is required' : undefined),
        }}
      >
        {(field) => (
          <TextField
            field={field}
            label="Email"
            caption="We never share it"
            placeholderText="you@x.com"
          />
        )}
      </form.Field>
      <button type="submit">Submit</button>
    </form>
  );
};

describe('TextField', () => {
  it('renders a labelled input with the info caption', () => {
    render(<Fixture />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAccessibleDescription('We never share it');
  });

  it('writes typed values to the form', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'a@b.co');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.co' });
  });

  it('hides the error until the field is blurred, then swaps the caption for it', async () => {
    render(<Fixture />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    await userEvent.type(input, 'a');
    await userEvent.clear(input);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-invalid');

    await userEvent.tab();

    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Email is required');
    expect(screen.queryByText('We never share it')).not.toBeInTheDocument();
  });

  it('shows the error after a submit attempt', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('still calls consumer onChange/onBlur handlers', async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const HandlersFixture = () => {
      const form = useForm({ defaultValues: { name: '' } });
      return (
        <form.Field name="name">
          {(field) => <TextField field={field} label="Name" onChange={onChange} onBlur={onBlur} />}
        </form.Field>
      );
    };
    render(<HandlersFixture />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'x');
    await userEvent.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe('TextField binding', () => {
  it('binds initial values', async () => {
    const CityFixture = () => {
      const form = useForm({ defaultValues: { city: 'Minneapolis' } });
      return (
        <form.Field name="city">{(field) => <TextField field={field} label="City" />}</form.Field>
      );
    };
    render(<CityFixture />);

    const input = screen.getByRole('textbox', { name: 'City' });
    expect(input).toHaveValue('Minneapolis');

    await userEvent.clear(input);
    await userEvent.type(input, 'St. Paul');
    expect(input).toHaveValue('St. Paul');
  });

  it('only accepts string fields', () => {
    const NumberFixture = () => {
      const form = useForm({ defaultValues: { age: 1 } });
      return (
        <form.Field name="age">
          {/* @ts-expect-error TextField needs a string field */}
          {(field) => <TextField field={field} label="Age" />}
        </form.Field>
      );
    };
    expect(NumberFixture).toBeDefined();
  });
});
