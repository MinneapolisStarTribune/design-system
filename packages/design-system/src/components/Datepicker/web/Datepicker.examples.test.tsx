import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockViewport } from '@/test-utils/viewport';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { TodayDatepickerExample } from './Datepicker.examples';

const wrapper = TestWrapperInDesignSystemProvider();
let viewport: ReturnType<typeof mockViewport>;
const currentDate = '2026-03-10';
const todayButton = () => screen.queryByRole('button', { name: 'Today' });
const openButton = () => screen.getByRole('button', { name: 'Open calendar' });

beforeEach(() => {
  viewport = mockViewport(1024);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 2, 10, 12));
});
afterEach(() => {
  viewport.restore();
  vi.useRealTimers();
});

describe('Datepicker with Today action', () => {
  it('shows Today only while open, including after choosing another date', async () => {
    const user = userEvent.setup();
    render(<TodayDatepickerExample />, { wrapper });
    expect(openButton()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(todayButton()).not.toBeInTheDocument();

    await user.click(openButton());
    expect(screen.getByRole('button', { name: 'Close calendar' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(todayButton()).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Wednesday, March 11, 2026' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(openButton()).toHaveAttribute('aria-expanded', 'false');
    expect(openButton()).toHaveFocus();
    expect(todayButton()).not.toBeInTheDocument();
  });

  it.each(['2026-03-14', '2026-02-14'] as const)(
    'returns to today without closing the calendar from %s',
    async (defaultValue) => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TodayDatepickerExample defaultValue={defaultValue} onChange={onChange} />, {
        wrapper,
      });
      expect(todayButton()).not.toBeInTheDocument();
      await user.click(openButton());
      await user.click(screen.getByRole('button', { name: 'Today' }));

      expect(onChange).toHaveBeenCalledExactlyOnceWith(currentDate);
      expect(screen.getByRole('dialog')).toBeVisible();
      expect(todayButton()).toBeVisible();
      expect(todayButton()).toHaveFocus();
      expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('10');
      expect(screen.getByRole('grid')).toHaveAccessibleName('Choose a date March 2026');
    }
  );

  it('returns to the current month when today is already selected', async () => {
    const user = userEvent.setup();
    render(<TodayDatepickerExample />, { wrapper });
    await user.click(openButton());
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid')).toHaveAccessibleName('Choose a date April 2026');
    await user.click(screen.getByRole('button', { name: 'Today' }));

    expect(screen.getByRole('dialog')).toBeVisible();
    expect(todayButton()).toBeVisible();
    expect(screen.getByRole('grid')).toHaveAccessibleName('Choose a date March 2026');
    expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('10');
  });

  it('keeps the calendar open when focusing and activating Today with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TodayDatepickerExample defaultValue="2026-03-14" onChange={onChange} />, {
      wrapper,
    });
    await user.tab();
    expect(openButton()).toHaveFocus();
    await user.keyboard('{Enter}');
    act(() => screen.getByRole('button', { name: 'Close calendar' }).focus());
    await user.tab({ shift: true });
    expect(todayButton()).toHaveFocus();
    expect(screen.getByRole('dialog')).toBeVisible();
    await user.keyboard(' ');

    expect(onChange).toHaveBeenCalledExactlyOnceWith(currentDate);
    expect(todayButton()).toHaveFocus();
    expect(screen.getByRole('dialog')).toBeVisible();
    await user.keyboard('{Escape}');
    expect(todayButton()).not.toBeInTheDocument();
    expect(openButton()).toHaveFocus();
  });

  it('removes Today on Escape and outside dismissal without taking focus from another control', async () => {
    const user = userEvent.setup();
    render(
      <>
        <TodayDatepickerExample defaultValue={currentDate} />
        <button type="button">After calendar</button>
      </>,
      { wrapper }
    );
    await user.click(openButton());
    await user.keyboard('{Escape}');
    expect(todayButton()).not.toBeInTheDocument();
    expect(openButton()).toHaveFocus();

    await user.click(openButton());
    await user.click(screen.getByRole('button', { name: 'After calendar' }));
    expect(todayButton()).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'After calendar' })).toHaveFocus();
  });

  it.each([
    { defaultValue: '2026-03-14', min: '2026-03-12' },
    { defaultValue: '2026-03-04', max: '2026-03-08' },
  ] as const)('disables Today outside the allowed dates: %j', async (bounds) => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TodayDatepickerExample {...bounds} onChange={onChange} />, { wrapper });

    expect(todayButton()).not.toBeInTheDocument();
    await user.tab();
    expect(openButton()).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(todayButton()).toBeDisabled();
  });
});

describe('Mobile Datepicker with Today action', () => {
  beforeEach(() => viewport.resize(375));

  it('places one Today action inside the calendar and keeps it open on activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TodayDatepickerExample defaultValue="2026-02-14" onChange={onChange} />, {
      wrapper,
    });
    const initialIcon = openButton().querySelector('svg')?.innerHTML;
    expect(todayButton()).not.toBeInTheDocument();
    await user.click(openButton());
    expect(
      screen.getByRole('button', { name: 'Close calendar' }).querySelector('svg')?.innerHTML
    ).toBe(initialIcon);
    const action = within(screen.getByRole('dialog')).getByRole('button', { name: 'Today' });
    expect(screen.getAllByRole('button', { name: 'Today' })).toHaveLength(1);
    await user.click(action);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(currentDate);
    expect(screen.getByRole('grid')).toHaveAccessibleName('Choose a date March 2026');
    expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('10');
    expect(action).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    await user.click(action);
    expect(screen.getByRole('grid')).toHaveAccessibleName('Choose a date March 2026');
    await user.click(screen.getByRole('button', { name: 'Wednesday, March 11, 2026' }));
    expect(todayButton()).not.toBeInTheDocument();
    expect(openButton()).toHaveFocus();
  });

  it('supports the footer action with the keyboard and restores focus on Escape', async () => {
    const user = userEvent.setup();
    render(<TodayDatepickerExample />, { wrapper });
    await user.click(openButton());
    await user.tab();
    expect(todayButton()).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(todayButton()).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(todayButton()).not.toBeInTheDocument();
    expect(openButton()).toHaveFocus();
  });

  it('moves Today across the breakpoint without resetting the selected date or closing', async () => {
    const user = userEvent.setup();
    render(<TodayDatepickerExample defaultValue="2026-03-14" />, { wrapper });
    await user.click(openButton());
    act(() => todayButton()?.focus());
    viewport.resize(768);
    expect(todayButton()).toHaveFocus();
    expect(screen.getAllByRole('button', { name: 'Today' })).toHaveLength(1);
    expect(within(screen.getByRole('dialog')).queryByRole('button', { name: 'Today' })).toBeNull();
    viewport.resize(767);
    expect(todayButton()).toHaveFocus();
    expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Today' })).toBeVisible();
    expect(screen.getAllByRole('button', { name: 'Today' })).toHaveLength(1);
    expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('14');
  });

  it('disables the footer action when today is outside the allowed dates', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TodayDatepickerExample min="2026-03-12" defaultValue="2026-03-14" onChange={onChange} />,
      { wrapper }
    );
    await user.click(openButton());
    expect(todayButton()).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeVisible();
  });
});
