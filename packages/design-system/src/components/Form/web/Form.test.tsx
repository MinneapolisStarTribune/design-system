import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from './Form';
import { useFormLogic } from '../useFormLogic';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/index.web';

describe('Form', () => {
  it('calls onSubmit when form is submitted', async () => {
    const onSubmit = vi.fn();
    renderWithProvider(
      <Form onSubmit={onSubmit}>
        <Form.Button>Submit</Form.Button>
      </Form>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        preventDefault: expect.any(Function),
      })
    );
  });

  it('applies vertical class by default', () => {
    renderWithProvider(
      <Form dataTestId="f" onSubmit={vi.fn()}>
        <span>X</span>
      </Form>
    );

    const form = screen.getByTestId('f');
    expect(form.className.split(' ').some((c) => c.includes('formVertical'))).toBe(true);
  });
});

describe('Form + useFormLogic integration', () => {
  it('submits current values when user types and clicks submit', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    function FormWithHook() {
      const { values, handleChangeEvent, handleSubmit } = useFormLogic({
        initialValues: { email: '' },
        onSubmit,
      });

      return (
        <Form onSubmit={handleSubmit} dataTestId="form">
          <FormGroup>
            <FormGroup.Label>Email</FormGroup.Label>
            <FormControl.TextInput
              name="email"
              value={values.email as string}
              onChange={handleChangeEvent}
            />
          </FormGroup>
          <Form.Button>Submit</Form.Button>
        </Form>
      );
    }

    renderWithProvider(<FormWithHook />);

    // Accessible name comes from the associated FormGroup.Label (id/htmlFor + aria-labelledby)
    const input = screen.getByRole('textbox', { name: 'Email' });
    await user.type(input, 'jane@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ email: 'jane@example.com' });
  });

  it('does not call onSubmit when validation fails; errors are set', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    function FormWithValidation() {
      const { values, errors, handleChangeEvent, handleSubmit } = useFormLogic({
        initialValues: { email: '' },
        onSubmit,
        validate: (v) => {
          const email = (v.email as string) ?? '';
          if (!email.includes('@')) return { email: 'Enter a valid email' };
          return {};
        },
        validateOnSubmit: true,
      });

      return (
        <Form onSubmit={handleSubmit} dataTestId="form">
          <FormGroup>
            <FormGroup.Label>Email</FormGroup.Label>
            <FormControl.TextInput
              name="email"
              value={values.email as string}
              onChange={handleChangeEvent}
            />
            {errors.email && <FormGroup.Caption variant="error">{errors.email}</FormGroup.Caption>}
          </FormGroup>
          <Form.Button>Submit</Form.Button>
        </Form>
      );
    }

    renderWithProvider(<FormWithValidation />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    await user.type(input, 'invalid');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });
});
