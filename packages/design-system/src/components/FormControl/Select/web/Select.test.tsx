import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';
import { act, waitFor } from '@testing-library/react';

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia', disabled: true },
];

describe('Select', () => {
  it.each(['native dialog', 'regional theme', 'theme inside dialog', 'dialog inside theme'])(
    'keeps options interactive inside a %s',
    async (scenario) => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const select = <FormControl.Select id="test" options={OPTIONS} onChange={onChange} />;
      const { getByRole, getByTestId, queryByRole } = renderWithProvider(
        scenario === 'native dialog' ? (
          <dialog open data-testid="portal-scope">
            {select}
          </dialog>
        ) : scenario === 'regional theme' ? (
          <section data-theme="dark" data-testid="portal-scope">
            {select}
          </section>
        ) : scenario === 'theme inside dialog' ? (
          <dialog open>
            <section data-theme="dark" data-testid="portal-scope">
              {select}
            </section>
          </dialog>
        ) : (
          <section data-theme="dark">
            <dialog open data-testid="portal-scope">
              {select}
            </dialog>
          </section>
        )
      );

      const trigger = getByRole('combobox');
      await user.click(trigger);
      const listbox = getByRole('listbox');
      expect(getByTestId('portal-scope').contains(listbox)).toBe(true);
      expect(trigger.contains(listbox)).toBe(false);
      await user.click(getByRole('option', { name: 'Canada' }));
      expect(onChange).toHaveBeenCalledExactlyOnceWith('ca');
      expect(queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    }
  );

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
      'opens on %s and navigates without scrolling ancestors',
      async (openWith) => {
        const user = userEvent.setup();
        const { getByRole, queryByRole, rerender } = renderWithProvider(
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

        expect(getByRole('listbox')).toBeInTheDocument();
        const firstOption = getByRole('option', { name: 'United States' });
        expect(select).toHaveAttribute('aria-activedescendant', firstOption.id);
        expect(scrollIntoView).not.toHaveBeenCalled();

        scrollIntoView.mockClear();
        await user.keyboard('{ArrowDown}');
        const secondOption = getByRole('option', { name: 'Canada' });
        expect(select).toHaveAttribute('aria-activedescendant', secondOption.id);
        expect(scrollIntoView).not.toHaveBeenCalled();

        await user.hover(firstOption);
        expect(select).toHaveAttribute('aria-activedescendant', firstOption.id);
        expect(scrollIntoView).not.toHaveBeenCalled();

        scrollIntoView.mockClear();
        rerender(<FormControl.Select id="test" options={OPTIONS} isError />);
        expect(scrollIntoView).not.toHaveBeenCalled();

        await user.keyboard('{Escape}');
        expect(queryByRole('listbox')).not.toBeInTheDocument();
        expect(scrollIntoView).not.toHaveBeenCalled();
      }
    );

    it('reopens at the selected option without scrolling ancestors', async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProvider(
        <FormControl.Select id="test" options={OPTIONS} value="ca" />
      );
      const trigger = getByRole('combobox');

      await user.click(trigger);
      await user.click(trigger);
      scrollIntoView.mockClear();
      await user.click(trigger);

      expect(trigger).toHaveAttribute(
        'aria-activedescendant',
        getByRole('option', { name: 'Canada' }).id
      );
      expect(scrollIntoView).not.toHaveBeenCalled();
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

    it('scrolls only the list to reveal selected and keyboard-active options', async () => {
      const user = userEvent.setup();
      const options = Array.from({ length: 12 }, (_, index) => ({
        value: String(index),
        label: `Option ${index}`,
      }));
      const originalRect = HTMLElement.prototype.getBoundingClientRect;
      const rectSpy = vi
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockImplementation(function (this: HTMLElement) {
          if (this.getAttribute('role') === 'listbox') {
            return new DOMRect(0, 100, 200, 120);
          }
          if (this.getAttribute('role') === 'option') {
            const index = Number(this.textContent?.replace('Option ', ''));
            return new DOMRect(0, 100 + index * 40 - (this.parentElement?.scrollTop ?? 0), 200, 40);
          }
          return originalRect.call(this);
        });
      const heightSpy = vi
        .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
        .mockImplementation(function (this: HTMLElement) {
          return this.getAttribute('role') === 'listbox' ? 120 : 0;
        });
      try {
        const { getByRole, getByTestId } = renderWithProvider(
          <div data-testid="scroll-parent" style={{ overflow: 'auto', height: 200 }}>
            <FormControl.Select id="test" options={options} value="9" />
          </div>
        );
        const parent = getByTestId('scroll-parent');
        parent.scrollTop = 400;
        await user.click(getByRole('combobox'));
        const listbox = getByRole('listbox');
        await waitFor(() => expect(listbox.scrollTop).toBe(280));
        await user.keyboard('{ArrowDown}');
        expect(listbox.scrollTop).toBe(320);
        await user.keyboard('{ArrowUp}');
        expect(listbox.scrollTop).toBe(320);
        await user.keyboard('{ArrowUp>3/}');
        expect(listbox.scrollTop).toBe(240);
        expect(parent.scrollTop).toBe(400);
        expect(scrollIntoView).not.toHaveBeenCalled();
      } finally {
        rectSpy.mockRestore();
        heightSpy.mockRestore();
      }
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
