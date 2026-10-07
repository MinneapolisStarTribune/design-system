import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { parseDateText } from '@/components/DatePicker/calendarDate';
import { FormControl } from '@/components/FormControl/FormControl';

describe('parseDateText', () => {
  it('parses US and ISO dates and rejects impossible ones', () => {
    expect(parseDateText('3/1/2026')).toBe('2026-03-01');
    expect(parseDateText('2026-03-01')).toBe('2026-03-01');
    expect(parseDateText('Nov 30 2026')).toBe('2026-11-30');
    expect(parseDateText('November 30, 2026')).toBe('2026-11-30');
    expect(parseDateText('02/30/2026')).toBeNull();
    expect(parseDateText('soon')).toBeNull();
  });
});

describe('FormControl.DatePicker', () => {
  it('commits typed dates on blur and normalizes the text', async () => {
    const onChange = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <FormControl.DatePicker aria-label="Game date" onChange={onChange} />
    );
    const input = getByLabelText('Game date');

    await userEvent.type(input, '3/1/2026');
    await userEvent.tab();

    expect(onChange).toHaveBeenCalledWith('2026-03-01');
    expect(input).toHaveValue('March 1, 2026');
  });

  it('marks invalid text as an error without calling onChange', async () => {
    const onChange = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <FormControl.DatePicker aria-label="Game date" onChange={onChange} />
    );
    const input = getByLabelText('Game date');

    await userEvent.type(input, '02/30/2026{Enter}');

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('picks a date from the calendar popover', async () => {
    const onChange = vi.fn();
    const { getByLabelText, getByRole, queryByRole } = renderWithProvider(
      <FormControl.DatePicker
        aria-label="Game date"
        defaultValue="2026-03-10"
        onChange={onChange}
      />
    );

    await userEvent.click(getByRole('button', { name: /Choose date/ }));
    await userEvent.click(getByRole('button', { name: 'Friday, March 13, 2026' }));

    expect(onChange).toHaveBeenCalledWith('2026-03-13');
    expect(getByLabelText('Game date')).toHaveValue('March 13, 2026');
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    await expectNoA11yViolations(
      <FormControl.DatePicker aria-label="Game date" defaultValue="2026-03-10" />
    );
  });
});
