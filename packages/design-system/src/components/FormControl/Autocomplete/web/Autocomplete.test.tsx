import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { Autocomplete } from './Autocomplete';

const options = [
  { value: 'a', label: 'Baseball', disabled: true },
  { value: 'b', label: 'Basketball' },
  { value: 'c', label: 'Football' },
];

describe('Autocomplete', () => {
  it('filters while typing and selects a custom option without losing focus', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { getByRole, queryByRole } = renderWithProvider(
      <Autocomplete
        id="sport"
        options={options}
        onChange={change}
        renderOption={({ key, ...props }, option) => (
          <li key={key} {...props}>
            <span aria-hidden>●</span>
            {option.label}
          </li>
        )}
      />
    );
    const input = getByRole('combobox');
    await user.type(input, 'foot');
    expect(queryByRole('option', { name: 'Basketball' })).not.toBeInTheDocument();
    await user.click(getByRole('option', { name: 'Football' }));
    expect(change).toHaveBeenCalledWith('c');
    expect(input).toHaveFocus();
    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('restores the selection on blur, and clears it when the text is erased', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<string | undefined>('c');
      return (
        <>
          <Autocomplete id="sport" options={options} value={value} onChange={setValue} />
          <button>Outside</button>
        </>
      );
    }
    const { getByRole } = renderWithProvider(<Example />);
    const input = getByRole('combobox');
    await user.type(input, 'x');
    await user.click(getByRole('button', { name: 'Outside' }));
    expect(input).toHaveValue('Football');
    await user.clear(input);
    await user.tab();
    expect(input).toHaveValue('');
  });

  it('keeps server results unfiltered and distinguishes loading from empty', async () => {
    const user = userEvent.setup();
    const { getByRole, rerender, queryByText } = renderWithProvider(
      <Autocomplete id="sport" options={options} filterOptions={false} loading />
    );
    await user.type(getByRole('combobox'), 'unmatched');
    expect(getByRole('option', { name: 'Football' })).toBeInTheDocument();
    expect(getByRole('status')).toHaveTextContent('Loading');
    expect(queryByText('No options found')).not.toBeInTheDocument();
    rerender(<Autocomplete id="sport" options={[]} />);
    expect(getByRole('status')).toHaveTextContent('No options found');
  });
});
