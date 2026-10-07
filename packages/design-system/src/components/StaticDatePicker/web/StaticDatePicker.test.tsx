import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { StaticDatePicker } from './StaticDatePicker';
import { addDays, getMonthWeeks } from '../calendarDate';

describe('calendarDate', () => {
  it('pads a month into Sunday-first weeks', () => {
    // March 2026 starts on a Sunday and ends with Apr 1-4 padding the last week.
    const weeks = getMonthWeeks({ year: 2026, month: 2 });
    expect(weeks).toHaveLength(5);
    expect(weeks[0][0]).toEqual({ date: '2026-03-01', day: 1, inMonth: true });
    expect(weeks[4].at(-1)).toEqual({ date: '2026-04-04', day: 4, inMonth: false });
  });

  it('rolls over months, years and leap days', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29');
  });
});

describe('StaticDatePicker', () => {
  it('shows the selected month and calls onChange with a YYYY-MM-DD string', async () => {
    const onChange = vi.fn();
    const { getByText, getByRole } = renderWithProvider(
      <StaticDatePicker value="2026-03-10" onChange={onChange} />
    );

    expect(getByText('March 2026')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Tuesday, March 10, 2026' }).closest('td')).toHaveAttribute(
      'aria-selected',
      'true'
    );

    await userEvent.click(getByRole('button', { name: 'Friday, March 13, 2026' }));
    expect(onChange).toHaveBeenCalledWith('2026-03-13');
  });

  it('changes months across a year boundary', async () => {
    const { getByText, getByRole } = renderWithProvider(
      <StaticDatePicker defaultValue="2026-12-25" />
    );

    await userEvent.click(getByRole('button', { name: 'Next month' }));
    expect(getByText('January 2027')).toBeInTheDocument();
  });

  it('stops at min: disables earlier days and the previous arrow', async () => {
    const { getByText, getByRole } = renderWithProvider(
      <StaticDatePicker defaultValue="2025-11-08" min="2025-11-03" />
    );

    expect(getByRole('button', { name: 'Sunday, November 2, 2025' })).toBeDisabled();
    const previous = getByRole('button', { name: 'Previous month' });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(previous);
    expect(getByText('November 2025')).toBeInTheDocument();
  });

  it('moves focus between days with the arrow keys', async () => {
    const { getByRole, getByText } = renderWithProvider(
      <StaticDatePicker defaultValue="2026-03-31" />
    );

    getByRole('button', { name: 'Tuesday, March 31, 2026' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(getByText('April 2026')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Wednesday, April 1, 2026' })).toHaveFocus();
  });

  it('has no a11y violations', async () => {
    await expectNoA11yViolations(<StaticDatePicker value="2026-03-10" onChange={() => {}} />);
  });
});
