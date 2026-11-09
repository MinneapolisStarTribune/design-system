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

it('toggles multiple selections without closing and preserves them during search', async () => {
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Autocomplete id="sports" options={options} multiple value={value} onChange={setValue} />
    );
  }
  const { getByRole } = renderWithProvider(<Example />);
  await user.click(getByRole('combobox'));
  await user.click(getByRole('option', { name: 'Football' }));
  expect(getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
  expect(getByRole('option', { name: 'Football' })).toHaveAttribute('aria-selected', 'true');
  await user.type(getByRole('combobox'), 'basket');
  await user.click(getByRole('option', { name: 'Basketball' }));
  await user.clear(getByRole('combobox'));
  expect(getByRole('option', { name: 'Football' })).toHaveAttribute('aria-selected', 'true');
  await user.click(getByRole('option', { name: 'Football' }));
  expect(getByRole('option', { name: 'Football' })).toHaveAttribute('aria-selected', 'false');
});

it.each([
  ['blur', 'input'],
  ['blur', 'toggle'],
  ['blur', 'keyboard'],
  ['Escape', 'input'],
  ['Escape', 'toggle'],
  ['Escape', 'keyboard'],
])('resets controlled multiple search after %s and reopening via %s', async (dismiss, reopen) => {
  const user = userEvent.setup();
  const search = vi.fn();
  function Example() {
    const [inputValue, setInputValue] = useState('');
    return (
      <>
        <Autocomplete
          id="controlled"
          options={options}
          multiple
          value={['b', 'c']}
          inputValue={inputValue}
          onInputChange={(next) => {
            search(next);
            setInputValue(next);
          }}
        />
        <button>Outside</button>
      </>
    );
  }
  const { getByRole, getAllByRole, queryByRole } = renderWithProvider(<Example />);
  const input = getByRole('combobox');
  await user.click(input);
  await user.type(input, 'basket');
  expect(getAllByRole('option')).toHaveLength(1);
  if (dismiss === 'blur') await user.click(getByRole('button', { name: 'Outside' }));
  else await user.keyboard('{Escape}');
  expect(queryByRole('listbox')).not.toBeInTheDocument();
  expect(input).toHaveValue('Basketball, Football');
  expect(search).toHaveBeenLastCalledWith('');
  expect(search).not.toHaveBeenCalledWith('Basketball, Football');
  if (reopen === 'input') await user.click(input);
  else if (reopen === 'toggle') await user.click(getByRole('button', { name: 'Open options' }));
  else {
    if (dismiss === 'blur') await user.tab({ shift: true });
    await user.keyboard('{ArrowDown}');
  }
  expect(input).toHaveValue('');
  expect(getAllByRole('option')).toHaveLength(3);
  expect(getByRole('option', { name: 'Football' })).toHaveAttribute('aria-selected', 'true');
});
