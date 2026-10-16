import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from './Form';
import { renderWithProvider } from '@/test-utils/render';

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

  it('applies horizontal class when orientation is horizontal', () => {
    renderWithProvider(
      <Form dataTestId="f" orientation="horizontal" onSubmit={vi.fn()}>
        <span>X</span>
      </Form>
    );

    const form = screen.getByTestId('f');
    expect(form.className.split(' ').some((c) => c.includes('formHorizontal'))).toBe(true);
  });
});
