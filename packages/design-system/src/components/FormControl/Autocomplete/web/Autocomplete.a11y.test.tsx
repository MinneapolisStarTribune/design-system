import { it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderWithProvider } from '@/test-utils/render';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { Autocomplete } from './Autocomplete';
import { AUTOCOMPLETE_LOADING_VARIANTS } from '../Autocomplete.types';

const options = [
  { value: 'a', label: 'Baseball', disabled: true },
  { value: 'b', label: 'Basketball' },
  { value: 'c', label: 'Football' },
];

it('connects the form label and exposes accessible custom options and loading status', async () => {
  const user = userEvent.setup();
  const { getByRole, baseElement } = renderWithProvider(
    <FormGroup>
      <FormGroup.Label htmlFor="team">Team</FormGroup.Label>
      <Autocomplete
        id="team"
        loading
        options={[{ value: 'a', label: 'Team A' }]}
        renderOption={({ key, ...props }, option) => (
          <li key={key} {...props}>
            <span aria-hidden>●</span>
            {option.label}
          </li>
        )}
      />
    </FormGroup>
  );
  await user.click(getByRole('combobox', { name: 'Team' }));
  expect(getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
  expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
});

it('skips disabled options and commits with Enter', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { getByRole } = renderWithProvider(
    <Autocomplete id="sport" options={options} onChange={change} />
  );
  const input = getByRole('combobox');
  await user.click(input);
  await user.keyboard('{ArrowDown}');
  expect(input).toHaveAttribute('aria-activedescendant', 'sport-option-1');
  expect(input).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(change).toHaveBeenCalledWith('b');
});

it('does not select on Tab or Escape and does not open while disabled', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { getByRole, queryByRole, rerender } = renderWithProvider(
    <Autocomplete id="sport" options={options} onChange={change} />
  );
  await user.click(getByRole('combobox'));
  await user.keyboard('{ArrowDown}{Escape}');
  expect(queryByRole('listbox')).not.toBeInTheDocument();
  expect(getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
  expect(getByRole('combobox')).not.toHaveAttribute('aria-controls');
  expect(getByRole('combobox')).toHaveFocus();
  await user.keyboard('{ArrowDown}{Tab}');
  expect(change).not.toHaveBeenCalled();
  rerender(<Autocomplete id="sport" options={options} isDisabled />);
  await user.click(getByRole('combobox'));
  expect(queryByRole('listbox')).not.toBeInTheDocument();
});
it.each(AUTOCOMPLETE_LOADING_VARIANTS)(
  'keeps %s skeletons out of keyboard navigation and announces loading until options arrive',
  async (loadingVariant) => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { getByRole, queryAllByRole, queryByRole, rerender } = renderWithProvider(
      <Autocomplete
        id="loading"
        options={[]}
        loading
        loadingVariant={loadingVariant}
        onChange={change}
      />
    );
    await user.click(getByRole('combobox'));
    expect(getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
    expect(getByRole('status')).toHaveTextContent('Loading');
    expect(queryAllByRole('option')).toHaveLength(0);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(change).not.toHaveBeenCalled();
    expect(getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
    rerender(<Autocomplete id="loading" options={options} onChange={change} />);
    expect(queryByRole('status')).not.toBeInTheDocument();
    expect(getByRole('listbox')).toHaveAttribute('aria-busy', 'false');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(change).toHaveBeenCalledWith('b');
  }
);

it('removes active-option references when an expanded control becomes disabled', async () => {
  const user = userEvent.setup();
  const { getByRole, queryByRole, rerender } = renderWithProvider(
    <Autocomplete id="disable" options={options} />
  );
  const input = getByRole('combobox');
  await user.click(input);
  await user.keyboard('{ArrowDown}');
  expect(input).toHaveAttribute('aria-activedescendant', 'disable-option-1');
  rerender(<Autocomplete id="disable" options={options} isDisabled />);
  expect(queryByRole('listbox')).not.toBeInTheDocument();
  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(input).not.toHaveAttribute('aria-controls');
  expect(input).not.toHaveAttribute('aria-activedescendant');
});
