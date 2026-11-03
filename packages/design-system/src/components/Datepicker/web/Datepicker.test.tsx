import { createRef, useState } from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import * as Dialog from '@/components/Dialog/Dialog';
import { Datepicker, type DatepickerProps } from './Datepicker';

const wrapper = TestWrapperInDesignSystemProvider();
const day = (name: string) => screen.getByRole('button', { name });
const march10 = 'Tuesday, March 10, 2026';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 2, 10, 12));
});
afterEach(() => vi.useRealTimers());

describe('Datepicker', () => {
  it('selects a date inline without closing the calendar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Datepicker defaultValue="2026-03-10" onChange={onChange} />, { wrapper });
    await user.click(day('Wednesday, March 11, 2026'));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('2026-03-11');
    expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('11');
    expect(screen.getByRole('grid')).toBeVisible();
  });

  it('keeps null controlled and applies defaultValue only on the first render', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Datepicker value={null} defaultValue="2026-03-08" onChange={onChange} />,
      { wrapper }
    );
    await user.click(day(march10));
    expect(onChange).toHaveBeenCalledWith('2026-03-10');
    expect(screen.queryByRole('gridcell', { selected: true })).not.toBeInTheDocument();
    rerender(<Datepicker value="2026-04-02" onChange={onChange} />);
    expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('2');
  });

  it('does not reapply an uncontrolled defaultValue after mount', () => {
    const { rerender } = render(<Datepicker defaultValue="2026-03-10" />, { wrapper });
    rerender(<Datepicker defaultValue="2026-04-02" />);
    expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('10');
    expect(screen.getByRole('grid')).toHaveAccessibleName('Choose a date March 2026');
  });

  it('allows a controlled consumer to update the selection', async () => {
    function Controlled() {
      const [value, setValue] = useState<DatepickerProps['value']>(null);
      return <Datepicker value={value} onChange={setValue} />;
    }
    render(<Controlled />, { wrapper });
    await userEvent.setup().click(day(march10));
    expect(screen.getByRole('gridcell', { selected: true })).toHaveTextContent('10');
  });

  it('describes a named trigger, preserves its description, handler and ref, and restores focus', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    const change = vi.fn();
    render(
      <>
        <span id="hint">Event</span>
        <Datepicker
          value="2026-03-10"
          label="Choose event date"
          onChange={change}
          trigger={
            <button
              type="button"
              ref={ref}
              aria-label="March 10, 2026"
              aria-describedby="hint"
              onClick={click}
            >
              Open
            </button>
          }
        />
      </>,
      { wrapper }
    );
    const trigger = screen.getByRole('button', { name: 'March 10, 2026' });
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAccessibleDescription('Event Choose event date');
    await user.click(trigger);
    expect(click).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Choose event date' })).toHaveAttribute(
      'id',
      trigger.getAttribute('aria-controls')
    );
    expect(day(march10)).toHaveFocus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(change).toHaveBeenCalledExactlyOnceWith('2026-03-11');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('opens with the keyboard and dismisses with Escape without selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Datepicker onChange={onChange} trigger={<button type="button">Open calendar</button>} />,
      { wrapper }
    );
    await user.tab();
    await user.keyboard('{Enter}');
    expect(day(march10)).toHaveFocus();
    await user.keyboard('{ArrowDown}{Escape}');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open calendar' })).toHaveFocus();
    await user.keyboard(' ');
    expect(day(march10)).toHaveFocus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith('2026-03-10');
  });

  it('dismisses on outside press and lets focus move to the clicked control', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Datepicker trigger={<button type="button">Open calendar</button>} />
        <button type="button">Outside</button>
      </>,
      { wrapper }
    );
    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  });

  it('has one tabbable day and does not trap Tab in the popover', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Datepicker trigger={<button type="button">Open calendar</button>} />
        <button type="button">After calendar</button>
      </>,
      { wrapper }
    );
    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    expect(
      within(screen.getByRole('grid'))
        .getAllByRole('button')
        .filter((button) => button.tabIndex === 0)
    ).toEqual([day(march10)]);
    await user.tab();
    expect(screen.getByRole('button', { name: 'After calendar' })).toHaveFocus();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  const keyboardCases = [
    ['{ArrowLeft}', 'Monday, March 9, 2026'],
    ['{ArrowRight}', 'Wednesday, March 11, 2026'],
    ['{ArrowUp}', 'Tuesday, March 3, 2026'],
    ['{ArrowDown}', 'Tuesday, March 17, 2026'],
    ['{Home}', 'Sunday, March 8, 2026'],
    ['{End}', 'Saturday, March 14, 2026'],
    ['{PageUp}', 'Tuesday, February 10, 2026'],
    ['{PageDown}', 'Friday, April 10, 2026'],
    ['{Shift>}{PageUp}{/Shift}', 'Monday, March 10, 2025'],
    ['{Shift>}{PageDown}{/Shift}', 'Wednesday, March 10, 2027'],
  ];
  it.each(keyboardCases)(
    'moves focus with %s without changing selection',
    async (key, expected) => {
      const onChange = vi.fn();
      render(<Datepicker value="2026-03-10" onChange={onChange} />, { wrapper });
      act(() => day(march10).focus());
      await userEvent.setup().keyboard(key);
      expect(day(expected)).toHaveFocus();
      expect(onChange).not.toHaveBeenCalled();
    }
  );

  it('handles leap days, month ends, and crossing a year boundary', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Datepicker value="2024-01-31" />, { wrapper });
    act(() => day('Wednesday, January 31, 2024').focus());
    await user.keyboard('{PageDown}');
    expect(day('Thursday, February 29, 2024')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(day('Friday, March 1, 2024')).toHaveFocus();
    rerender(<Datepicker value="2026-12-31" />);
    await user.keyboard('{ArrowRight}');
    expect(day('Friday, January 1, 2027')).toHaveFocus();
  });

  it('enforces inclusive bounds for clicking, keyboard movement, and month navigation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Datepicker
        defaultValue="2026-03-10"
        min="2026-03-10"
        max="2026-04-02"
        onChange={onChange}
      />,
      { wrapper }
    );
    expect(day('Monday, March 9, 2026')).toBeDisabled();
    await user.click(day('Monday, March 9, 2026'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Previous month' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    act(() => day(march10).focus());
    await user.keyboard('{ArrowLeft}');
    expect(day(march10)).toHaveFocus();
    await user.keyboard('{PageDown}');
    expect(day('Thursday, April 2, 2026')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(day('Thursday, April 2, 2026')).toHaveFocus();
    expect(day('Friday, April 3, 2026')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledExactlyOnceWith('2026-04-02');
  });

  it('keeps month navigation focused when it reaches the last allowed month', async () => {
    const user = userEvent.setup();
    render(<Datepicker value="2026-03-10" max="2026-04-02" />, { wrapper });
    const next = screen.getByRole('button', { name: 'Next month' });
    await user.click(next);
    expect(next).toHaveFocus();
    expect(next).toHaveAttribute('aria-disabled', 'true');
    await user.click(next);
    expect(screen.getByRole('grid')).toHaveAccessibleName('Choose a date April 2026');
  });

  it('reconciles changing bounds and out-of-range controlled values without emitting a selection', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Datepicker value="2026-03-10" onChange={onChange} />, { wrapper });
    act(() => day(march10).focus());
    rerender(
      <Datepicker value="2026-03-10" min="2026-04-01" max="2026-04-20" onChange={onChange} />
    );
    expect(day('Wednesday, April 1, 2026')).toHaveFocus();
    rerender(
      <Datepicker value="2026-06-15" min="2026-04-01" max="2026-04-20" onChange={onChange} />
    );
    expect(day('Monday, April 20, 2026')).toHaveFocus();
    expect(
      within(screen.getByRole('grid'))
        .getAllByRole('button')
        .filter((button) => button.tabIndex === 0)
    ).toHaveLength(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not steal focus when inline props change', async () => {
    const { rerender } = render(
      <>
        <button type="button">Other</button>
        <Datepicker value="2026-03-10" />
      </>,
      { wrapper }
    );
    expect(day(march10)).not.toHaveFocus();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Other' }));
    rerender(
      <>
        <button type="button">Other</button>
        <Datepicker value="2026-04-10" />
      </>
    );
    expect(screen.getByRole('button', { name: 'Other' })).toHaveFocus();
  });

  it('opens on the closest permitted date when today is outside the range', async () => {
    render(<Datepicker min="2026-05-01" trigger={<button type="button">Open</button>} />, {
      wrapper,
    });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Open' }));
    expect(day('Friday, May 1, 2026')).toHaveFocus();
  });

  it('treats malformed dates as empty and malformed bounds as absent', () => {
    render(<Datepicker value="2026-02-30" min="2026-3-1" max="2026-13-01" />, { wrapper });
    expect(screen.queryByRole('gridcell', { selected: true })).not.toBeInTheDocument();
    expect(day(march10)).toBeEnabled();
    expect(day(march10)).toHaveAttribute('aria-current', 'date');
  });

  it('disables all dates in an inverted range and keeps a focusable calendar', async () => {
    render(
      <Datepicker
        min="2026-04-10"
        max="2026-03-01"
        trigger={<button type="button">Open</button>}
      />,
      { wrapper }
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('grid')).toHaveFocus();
    expect(
      within(screen.getByRole('grid'))
        .getAllByRole('button')
        .every((button) => button.hasAttribute('disabled'))
    ).toBe(true);
  });

  it('supports early years without the Date constructor 1900 offset and renders on the server', () => {
    const html = renderToString(wrapper({ children: <Datepicker value="0099-01-02" /> }));
    expect(html).toContain('January 99');
    expect(html).toContain('January 2, 99');
  });

  it.each([
    { props: {}, month: 'March 2026', tabbableDay: 'Tuesday, March 31, 2026' },
    { props: { value: '2026-03-10' }, month: 'March 2026', tabbableDay: march10 },
    { props: { defaultValue: '2026-03-10' }, month: 'March 2026', tabbableDay: march10 },
    { props: { min: '2026-04-02' }, month: 'April 2026', tabbableDay: 'Thursday, April 2, 2026' },
  ] satisfies { props: DatepickerProps; month: string; tabbableDay: string }[])(
    'hydrates across UTC/Bogotá without replacing server markup: $props',
    async ({ props, month, tabbableDay }) => {
      vi.setSystemTime(new Date('2026-04-01T00:30:00Z'));
      vi.stubEnv('TZ', 'UTC');
      onTestFinished(() => {
        vi.unstubAllEnvs();
      });
      expect(new Date().getDate()).toBe(1);
      const onChange = vi.fn();
      const component = wrapper({ children: <Datepicker {...props} onChange={onChange} /> });
      const container = document.createElement('div');
      container.innerHTML = renderToString(component);
      document.body.appendChild(container);
      const serverCalendar = container.firstElementChild;
      onTestFinished(() => container.remove());

      vi.stubEnv('TZ', 'America/Bogota');
      expect(new Date().getDate()).toBe(31);
      const onRecoverableError = vi.fn();
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      onTestFinished(() => consoleError.mockRestore());
      const root = await act(async () => hydrateRoot(container, component, { onRecoverableError }));
      onTestFinished(() => act(() => root.unmount()));

      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
      expect(container.firstElementChild).toBe(serverCalendar);
      expect(screen.getByRole('grid')).toHaveAccessibleName(`Choose a date ${month}`);
      expect(day(tabbableDay)).toHaveAttribute('tabindex', '0');
      expect(day('Tuesday, March 31, 2026')).toHaveAttribute('aria-current', 'date');
      expect(day('Wednesday, April 1, 2026')).not.toHaveAttribute('aria-current');
      expect(onChange).not.toHaveBeenCalled();
    }
  );

  it('keeps a nested calendar inside its dialog and dismisses only the calendar on Escape', async () => {
    const onClose = vi.fn();
    render(
      <Dialog.Root open onClose={onClose} aria-label="Edit event">
        <Dialog.Content>
          <Datepicker value="2026-03-10" trigger={<button type="button">Open calendar</button>} />
        </Dialog.Content>
      </Dialog.Root>,
      { wrapper }
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    expect(
      screen
        .getByRole('dialog', { name: 'Edit event' })
        .contains(screen.getByRole('dialog', { name: 'Choose a date' }))
    ).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Choose a date' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open calendar' })).toHaveFocus();
    expect(onClose).not.toHaveBeenCalled();
  });
});
