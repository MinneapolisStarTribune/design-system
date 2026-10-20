import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';
import { act } from '@testing-library/react';

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

  it('puts no undefined class on the container when a value is selected', () => {
    const { getByRole } = renderWithProvider(
      <FormControl.Select id="test" options={OPTIONS} value="ca" />
    );

    expect(getByRole('combobox')).not.toHaveClass('undefined');
  });

  it('uses 16px option text at every size', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(
      <FormControl.Select id="test" options={OPTIONS} size="small" />
    );

    await user.click(getByRole('combobox'));

    expect(getByRole('listbox')).toHaveClass('typography-utility-text-regular-medium');
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();

    const { getByRole } = renderWithProvider(<FormControl.Select id="test" options={OPTIONS} />);

    const select = getByRole('combobox');
    const trigger = select;

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
    const trigger = select;

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
    const trigger = select;

    await user.click(trigger);
    await user.click(getByText('Canada'));

    expect(onChange).toHaveBeenCalledWith('ca');
  });

  it('renders the listbox outside a clipping container and keeps focus on the combobox', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { getByRole, getByTestId, findByRole } = renderWithProvider(
      <div data-testid="clip" style={{ overflow: 'auto' }}>
        <FormControl.Select id="test" options={OPTIONS} onChange={onChange} />
      </div>
    );
    const select = getByRole('combobox');

    await user.click(select);
    const listbox = await findByRole('listbox');

    expect(getByTestId('clip').contains(listbox)).toBe(false);
    expect(select).toHaveAttribute('aria-controls', listbox.id);

    await user.click(getByRole('option', { name: 'Canada' }));

    expect(onChange).toHaveBeenCalledWith('ca');
    expect(select).toHaveFocus();
  });

  it('selects the active option and closes on Tab', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { getByRole, queryByRole } = renderWithProvider(
      <FormControl.Select id="test" options={OPTIONS} onChange={onChange} />
    );

    getByRole('combobox').focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Tab}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('ca');
    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes when focus moves to another control', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText, queryByRole } = renderWithProvider(
      <>
        <FormControl.Select id="test" options={OPTIONS} />
        <button>Other</button>
      </>
    );

    await user.click(getByRole('combobox'));
    expect(getByRole('listbox')).toBeInTheDocument();

    act(() => getByText('Other').focus());

    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens with Space and selects the active option with Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { getByRole, queryByRole } = renderWithProvider(
      <FormControl.Select id="test" options={OPTIONS} onChange={onChange} />
    );

    getByRole('combobox').focus();
    await user.keyboard(' ');
    expect(getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{ArrowDown} ');
    expect(onChange).toHaveBeenCalledExactlyOnceWith('ca');
    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });

  describe('Enter on the combobox', () => {
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

        getByRole('combobox').focus();
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

  it.each(['click', 'Enter', 'ArrowDown', 'ArrowUp'])(
    'keeps an empty list without an active option when opened with %s',
    async (openWith) => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { getByRole, queryAllByRole } = renderWithProvider(
        <FormControl.Select id="test" options={[]} onChange={onChange} />
      );
      const select = getByRole('combobox');

      if (openWith === 'click') {
        await user.click(getByRole('combobox'));
      } else {
        select.focus();
        await user.keyboard(`{${openWith}}`);
      }

      expect(getByRole('listbox')).toBeInTheDocument();
      expect(queryAllByRole('option')).toHaveLength(0);
      expect(select).not.toHaveAttribute('aria-activedescendant');

      for (const key of ['ArrowDown', 'ArrowUp', 'Enter']) {
        await user.keyboard(`{${key}}`);
        expect(select).not.toHaveAttribute('aria-activedescendant');
      }

      expect(onChange).not.toHaveBeenCalled();
    }
  );

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
      'reveals the active option on %s without scrolling the page to the listbox',
      async (openWith) => {
        const user = userEvent.setup();
        const { findByRole, getByRole, queryByRole, rerender } = renderWithProvider(
          <FormControl.Select id="test" options={OPTIONS} />
        );

        expect(scrollIntoView).not.toHaveBeenCalled();
        const select = getByRole('combobox');
        if (openWith === 'click') {
          await user.click(select);
        } else {
          select.focus();
          await user.keyboard(`{${openWith}}`);
        }

        const firstOption = await findByRole('option', { name: 'United States' });
        expect(select).toHaveAttribute('aria-activedescendant', firstOption.id);
        expect(scrollIntoView.mock.contexts).toEqual([firstOption]);
        expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest' });

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

    it('reveals the selected option again after closing with the trigger', async () => {
      const user = userEvent.setup();
      const { findByRole, getByRole } = renderWithProvider(
        <FormControl.Select id="test" options={OPTIONS} value="ca" />
      );
      const trigger = getByRole('combobox');

      await user.click(trigger);
      await user.click(trigger);
      scrollIntoView.mockClear();
      await user.click(trigger);

      expect(scrollIntoView.mock.contexts).toEqual([
        await findByRole('option', { name: 'Canada' }),
      ]);
      expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest' });
    });

    it('does not open or scroll a disabled Select', async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProvider(
        <FormControl.Select id="test" options={OPTIONS} isDisabled />
      );

      await user.click(getByRole('combobox'));
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
