import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';
import { within } from '@testing-library/react';

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia', disabled: true },
];

describe('Select', () => {
  it('renders combobox', () => {
    const { getByRole } = renderWithProvider(<FormControl.Select id="test" options={OPTIONS} />);

    expect(getByRole('combobox')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();

    const { getByRole } = renderWithProvider(<FormControl.Select id="test" options={OPTIONS} />);

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    await user.click(trigger);

    expect(getByRole('listbox')).toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();

    const { getByRole, getByText, queryByRole } = renderWithProvider(
      <>
        <FormControl.Select id="test" options={OPTIONS} />
        <button>Outside</button>
      </>
    );

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    await user.click(trigger);
    await user.click(getByText('Outside'));

    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onChange when selecting option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole, getByText } = renderWithProvider(
      <FormControl.Select id="test" options={OPTIONS} onChange={onChange} />
    );

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    await user.click(trigger);
    await user.click(getByText('Canada'));

    expect(onChange).toHaveBeenCalledWith('ca');
  });

  describe.each(['combobox', 'button'] as const)('Enter on the %s', (role) => {
    it.each([
      { value: undefined, label: 'United States', expectedValue: 'us' },
      { value: 'ca', label: 'Canada', expectedValue: 'ca' },
      { value: 'missing', label: 'United States', expectedValue: 'us' },
    ])(
      'highlights $label when value is $value, then selects it',
      async ({ value, label, expectedValue }) => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { getByRole, queryByRole } = renderWithProvider(
          <FormControl.Select id="test" options={OPTIONS} value={value} onChange={onChange} />
        );

        getByRole(role).focus();
        await user.keyboard('{Enter}');

        const select = getByRole('combobox');
        const option = getByRole('option', { name: label });
        expect(select).toHaveAttribute('aria-expanded', 'true');
        expect(select).toHaveAttribute('aria-activedescendant', option.id);
        expect(onChange).not.toHaveBeenCalled();

        await user.keyboard('{Enter}');

        expect(onChange).toHaveBeenCalledExactlyOnceWith(expectedValue);
        expect(queryByRole('listbox')).not.toBeInTheDocument();
        expect(select).not.toHaveAttribute('aria-activedescendant');
      }
    );
  });

  describe('dropdown scrolling', () => {
    const originalScrollIntoView = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'scrollIntoView'
    );
    const scrollIntoView = vi.fn<HTMLElement['scrollIntoView']>();

    beforeEach(() => {
      scrollIntoView.mockClear();
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
        configurable: true,
        value: scrollIntoView,
      });
    });

    afterEach(() => {
      if (originalScrollIntoView) {
        Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView);
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
      }
    });

    it.each(['click', 'Enter', 'ArrowDown', 'ArrowUp'])(
      'reveals the listbox on %s, without scrolling it again during navigation',
      async (openWith) => {
        const user = userEvent.setup();
        const { getByRole, queryByRole, rerender } = renderWithProvider(
          <FormControl.Select id="test" options={OPTIONS} />
        );

        expect(scrollIntoView).not.toHaveBeenCalled();
        const select = getByRole('combobox');
        if (openWith === 'click') {
          await user.click(within(select).getByRole('button'));
        } else {
          select.focus();
          await user.keyboard(`{${openWith}}`);
        }

        const listbox = getByRole('listbox');
        const firstOption = getByRole('option', { name: 'United States' });
        expect(select).toHaveAttribute('aria-activedescendant', firstOption.id);
        expect(scrollIntoView.mock.contexts).toEqual([firstOption, listbox]);
        expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest', inline: 'nearest' });

        scrollIntoView.mockClear();
        await user.keyboard('{ArrowDown}');
        const secondOption = getByRole('option', { name: 'Canada' });
        expect(scrollIntoView.mock.contexts).toEqual([secondOption]);
        expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest' });

        await user.hover(firstOption);
        expect(scrollIntoView.mock.contexts).toEqual([secondOption, firstOption]);

        scrollIntoView.mockClear();
        rerender(<FormControl.Select id="test" options={OPTIONS} isError />);
        expect(scrollIntoView).not.toHaveBeenCalled();

        await user.keyboard('{Escape}');
        expect(queryByRole('listbox')).not.toBeInTheDocument();
        expect(scrollIntoView).not.toHaveBeenCalled();
      }
    );

    it('reveals the selected option and listbox again after closing with the trigger', async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProvider(
        <FormControl.Select id="test" options={OPTIONS} value="ca" />
      );
      const trigger = getByRole('button');

      await user.click(trigger);
      await user.click(trigger);
      scrollIntoView.mockClear();
      await user.click(trigger);

      expect(scrollIntoView.mock.contexts).toEqual([
        getByRole('option', { name: 'Canada' }),
        getByRole('listbox'),
      ]);
      expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest', inline: 'nearest' });
    });

    it('does not open or scroll a disabled Select', async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProvider(
        <FormControl.Select id="test" options={OPTIONS} isDisabled />
      );

      await user.click(getByRole('button'));
      getByRole('combobox').focus();
      await user.keyboard('{Enter}{ArrowDown}{ArrowUp}');

      expect(queryByRole('listbox')).not.toBeInTheDocument();
      expect(scrollIntoView).not.toHaveBeenCalled();
    });

    it('can open when scrollIntoView is unavailable', async () => {
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { value: undefined });
      const user = userEvent.setup();
      const { getByRole } = renderWithProvider(<FormControl.Select id="test" options={OPTIONS} />);

      getByRole('combobox').focus();
      await user.keyboard('{Enter}');

      expect(getByRole('listbox')).toBeInTheDocument();
      expect(getByRole('combobox')).toHaveAttribute(
        'aria-activedescendant',
        getByRole('option', { name: 'United States' }).id
      );
    });
  });
});
