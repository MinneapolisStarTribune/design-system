import { useForm } from '@tanstack/react-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextAreaField } from './TextAreaField';

const Fixture = ({ onSubmit = () => {} }: { onSubmit?: (value: unknown) => void }) => {
  const form = useForm({
    defaultValues: { comment: '' },
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
        name="comment"
        validators={{
          onChange: ({ value }) => (value.length === 0 ? 'Comment is required' : undefined),
        }}
      >
        {(field) => (
          <TextAreaField
            field={field}
            label="Comment"
            caption="Keep it civil"
            placeholderText="Write a comment"
          />
        )}
      </form.Field>
      <button type="submit">Submit</button>
    </form>
  );
};

describe('TextAreaField', () => {
  it('renders a labelled textarea with the info caption', () => {
    render(<Fixture />);

    const textarea = screen.getByRole('textbox', { name: 'Comment' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('name', 'comment');
    expect(textarea).toHaveAccessibleDescription('Keep it civil');
  });

  it('writes typed values, including newlines, to the form', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Comment' }), 'Line one{Enter}two');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ comment: 'Line one\ntwo' });
  });

  it('hides the error until the field is blurred, then swaps the caption for it', async () => {
    render(<Fixture />);
    const textarea = screen.getByRole('textbox', { name: 'Comment' });

    await userEvent.type(textarea, 'a');
    await userEvent.clear(textarea);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(textarea).not.toHaveAttribute('aria-invalid');

    await userEvent.tab();

    expect(screen.getByRole('alert')).toHaveTextContent('Comment is required');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription('Comment is required');
    expect(screen.queryByText('Keep it civil')).not.toBeInTheDocument();
  });

  it('shows the error after a submit attempt', async () => {
    const onSubmit = vi.fn();
    render(<Fixture onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Comment is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('still calls consumer onChange/onBlur handlers', async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const HandlersFixture = () => {
      const form = useForm({ defaultValues: { notes: '' } });
      return (
        <form.Field name="notes">
          {(field) => (
            <TextAreaField field={field} label="Notes" onChange={onChange} onBlur={onBlur} />
          )}
        </form.Field>
      );
    };
    render(<HandlersFixture />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Notes' }), 'x');
    await userEvent.tab();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe('TextAreaField binding', () => {
  it('binds initial values', async () => {
    const BioFixture = () => {
      const form = useForm({ defaultValues: { bio: 'Hello' } });
      return (
        <form.Field name="bio">{(field) => <TextAreaField field={field} label="Bio" />}</form.Field>
      );
    };
    render(<BioFixture />);

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(textarea).toHaveValue('Hello');

    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'Goodbye');
    expect(textarea).toHaveValue('Goodbye');
  });

  it('only accepts string fields', () => {
    const NumberFixture = () => {
      const form = useForm({ defaultValues: { count: 1 } });
      return (
        <form.Field name="count">
          {/* @ts-expect-error TextAreaField needs a string field */}
          {(field) => <TextAreaField field={field} label="Count" />}
        </form.Field>
      );
    };
    expect(NumberFixture).toBeDefined();
  });
});
