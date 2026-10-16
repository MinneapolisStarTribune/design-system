import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubmitForm } from '../test-utils/SubmitForm';
import { NumberField } from './NumberField';

const Fixture = ({
  initial,
  onSubmit = () => {},
}: {
  initial?: number;
  onSubmit?: (value: unknown) => void;
}) => {
  const form = useForm({
    defaultValues: { age: initial as number | undefined },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <SubmitForm form={form}>
      <form.Field
        name="age"
        validators={{
          onChange: ({ value }) => (value === undefined ? 'Age is required' : undefined),
        }}
      >
        {(field) => <NumberField field={field} label="Age" />}
      </form.Field>
    </SubmitForm>
  );
};

describe('NumberField', () => {
  it('writes numbers, not strings', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole('spinbutton', { name: 'Age' }), '42');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ age: 42 });
  });

  it('writes undefined when cleared and shows the error once blurred', async () => {
    render(<Fixture initial={7} />);
    const input = screen.getByRole('spinbutton', { name: 'Age' });
    expect(input).toHaveValue(7);

    await userEvent.clear(input);
    await userEvent.tab();

    expect(input).toHaveValue(null);
    expect(screen.getByRole('alert')).toHaveTextContent('Age is required');
  });

  it('only accepts number | undefined fields', () => {
    const StringFixture = () => {
      const form = useForm({ defaultValues: { age: '' } });
      return (
        <form.Field name="age">
          {/* @ts-expect-error NumberField needs a number | undefined field */}
          {(field) => <NumberField field={field} label="Age" />}
        </form.Field>
      );
    };
    expect(StringFixture).toBeDefined();
  });
});
