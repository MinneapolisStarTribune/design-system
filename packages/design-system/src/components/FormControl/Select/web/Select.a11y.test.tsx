import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';
import { within } from '@testing-library/react';

const OPTIONS = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3', disabled: true },
];

describe('Select', () => {
  it('renders combobox', () => {
    const { getByRole } = renderWithProvider(
      <FormControl.Select id="test" options={OPTIONS} aria-label="Select option" />
    );

    expect(getByRole('combobox')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();

    const { getByRole } = renderWithProvider(
      <FormControl.Select id="test" options={OPTIONS} aria-label="Select option" />
    );

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    await user.click(trigger);

    expect(getByRole('listbox')).toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();

    const { getByRole, getByText, queryByRole } = renderWithProvider(
      <>
        <FormControl.Select id="test" options={OPTIONS} aria-label="Select option" />
        <button data-testid="outside">Outside</button>
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
      <FormControl.Select
        id="test"
        options={OPTIONS}
        onChange={onChange}
        aria-label="Select option"
      />
    );

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    await user.click(trigger);
    await user.click(getByText('Option 2'));

    expect(onChange).toHaveBeenCalledWith('opt2');
  });

  it('does not call onChange for disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole, getByText } = renderWithProvider(
      <FormControl.Select
        id="test"
        options={OPTIONS}
        onChange={onChange}
        aria-label="Select option"
      />
    );

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    await user.click(trigger);
    await user.click(getByText('Option 3'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets aria-expanded correctly', async () => {
    const user = userEvent.setup();

    const { getByRole } = renderWithProvider(
      <FormControl.Select id="test" options={OPTIONS} aria-label="Select option" />
    );

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    expect(select).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(select).toHaveAttribute('aria-expanded', 'true');
  });

  it.each([
    { value: 'opt2', label: 'Option 2', selected: true },
    { value: undefined, label: 'Option 1', selected: false },
  ])(
    'exposes $label as the active option when Enter opens the list',
    async ({ value, label, selected }) => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProvider(
        <FormControl.Select id="test" options={OPTIONS} value={value} />
      );
      const select = getByRole('combobox');

      select.focus();
      await user.keyboard('{Enter}');

      const listbox = getByRole('listbox');
      const activeOption = within(listbox).getByRole('option', { name: label });
      expect(select).toHaveFocus();
      expect(select).toHaveAttribute('aria-expanded', 'true');
      expect(select).toHaveAttribute('aria-controls', listbox.id);
      expect(select).toHaveAttribute('aria-activedescendant', activeOption.id);
      expect(activeOption).toHaveAttribute('aria-selected', String(selected));

      await user.keyboard('{Escape}');

      expect(select).toHaveFocus();
      expect(select).toHaveAttribute('aria-expanded', 'false');
      expect(select).not.toHaveAttribute('aria-controls');
      expect(select).not.toHaveAttribute('aria-activedescendant');
      expect(queryByRole('listbox')).not.toBeInTheDocument();
    }
  );
});
