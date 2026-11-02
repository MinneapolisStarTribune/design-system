import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { FormControl } from '../../FormControl';
import { FormControlDatepicker, type FormControlDatepickerProps } from './Datepicker';

const Provider = TestWrapperInDesignSystemProvider();
function fixture(props: FormControlDatepickerProps) {
  return (
    <Provider>
      <form aria-label="Schedule">
        <FormGroup>
          <FormGroup.Label>Game date</FormGroup.Label>
          <FormControl.Datepicker name="date" defaultValue="2026-04-18" {...props} />
        </FormGroup>
        <button type="reset">Reset</button>
      </form>
    </Provider>
  );
}

function setup(props: FormControlDatepickerProps = {}) {
  const view = render(fixture(props));
  return {
    updateProps: (next: FormControlDatepickerProps) => view.rerender(fixture(next)),
    user: userEvent.setup(),
    input: screen.getByRole<HTMLInputElement>('textbox', { name: 'Game date' }),
    form: screen.getByRole<HTMLFormElement>('form'),
  };
}

describe('FormControl.Datepicker', () => {
  it('supports numeric typing, ISO paste and clear', async () => {
    const { user, input, form } = setup();
    await user.clear(input);
    await user.type(input, '2/29/2024');
    await user.click(document.body);
    expect(input).toHaveValue('February 29, 2024');
    expect(new FormData(form).get('date')).toBe('2024-02-29');
    await user.clear(input);
    await user.paste('2026-05-10');
    await user.click(document.body);
    expect(input).toHaveValue('May 10, 2026');
    await user.clear(input);
    await user.click(document.body);
    expect(new FormData(form).get('date')).toBe('');
    expect(input).toBeValid();
  });

  it('keeps the caret in place when replacing the month of an existing date', async () => {
    const { user, input, form } = setup();
    await user.click(input);
    input.setSelectionRange(0, 2);
    await user.keyboard('12');
    expect(input).toHaveValue('12/18/2026');
    await user.click(document.body);
    expect(input).toHaveValue('December 18, 2026');
    expect(new FormData(form).get('date')).toBe('2026-12-18');
  });

  it.each(['4/31/2026', '04/'])(
    'preserves invalid edits without a stale selection: %s',
    async (text) => {
      const { user, input, form } = setup();
      await user.clear(input);
      await user.type(input, text);
      await user.click(document.body);
      expect(input).toHaveValue(text);
      expect(new FormData(form).get('date')).toBe(text);
      expect(input).toBeInvalid();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription('Enter a valid date in MM/DD/YYYY format.');
    }
  );

  it('restores uncontrolled defaults and validation on native reset', async () => {
    const { input, form, user } = setup({ required: true });
    await user.clear(input);
    await user.click(document.body);
    expect(input).toBeInvalid();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(input).toHaveValue('April 18, 2026');
    expect(new FormData(form).get('date')).toBe('2026-04-18');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).toBeValid();
  });

  it('supports controlled changes and updated limits', () => {
    const onChange = vi.fn();
    const { input, updateProps } = setup({ value: '2026-04-18', onChange });
    fireEvent.change(input, { target: { value: '04/20/2026' } });
    expect(onChange).toHaveBeenCalledWith('2026-04-20');
    updateProps({ value: '2026-04-20', max: '2026-04-19', onChange });
    expect(input).toHaveValue('April 20, 2026');
    expect(input.validity.valid).toBe(false);
  });

  it.each([{ isDisabled: true }, { readOnly: true }])(
    'prevents calendar edits for %j',
    async (props) => {
      const { input, form, user } = setup(props);
      const trigger = screen.getByRole('button', { name: 'Choose a date' });
      expect(trigger).toBeDisabled();
      expect(getComputedStyle(trigger).cursor).toBe('not-allowed');
      await user.click(trigger);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(input).toHaveValue('April 18, 2026');
      expect(new FormData(form).get('date')).toBe(props.isDisabled ? null : '2026-04-18');
    }
  );

  it('closes the open calendar when the field becomes disabled', async () => {
    const { user, updateProps } = setup();
    await user.click(screen.getByRole('button', { name: 'Choose a date' }));
    expect(screen.getByRole('dialog')).toBeVisible();
    updateProps({ isDisabled: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('respects a cancelled native reset', async () => {
    const { user, input, form } = setup();
    await user.clear(input);
    await user.type(input, '04/');
    await user.click(document.body);
    form.addEventListener('reset', (event) => event.preventDefault());
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(input).toHaveValue('04/');
    expect(input).toBeInvalid();
  });

  it('associates with external forms and blocks invalid native submission', async () => {
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <Provider>
        <form id="external" aria-label="External" onSubmit={submit}>
          <button type="submit">Save</button>
        </form>
        <FormControlDatepicker
          aria-label="Date"
          form="external"
          name="date"
          defaultValue="2026-04-18"
          required
        />
      </Provider>
    );
    const form = screen.getByRole<HTMLFormElement>('form');
    expect(new FormData(form).get('date')).toBe('2026-04-18');
    const user = userEvent.setup();
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).not.toHaveBeenCalled();
    expect(await screen.findByRole('alert')).toHaveTextContent('Choose a date.');
  });

  it('inherits FormGroup errors and forwards callbacks without a duplicate error', async () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onChange = vi.fn();
    render(
      <Provider>
        <FormGroup>
          <FormGroup.Label>Date</FormGroup.Label>
          <FormGroup.Description>Season date</FormGroup.Description>
          <FormControlDatepicker
            defaultValue="04/"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            aria-describedby="extra"
          />
          <FormGroup.Caption variant="error">Check this date.</FormGroup.Caption>
        </FormGroup>
        <p id="extra">Extra context</p>
      </Provider>
    );
    const user = userEvent.setup();
    const input = screen.getByRole('textbox', { name: 'Date' });
    await user.click(input);
    await user.type(input, '2');
    await user.click(document.body);
    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('04/2');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Extra context Season date Check this date.');
    expect(screen.getAllByRole('alert')).toHaveLength(1);
  });
});
