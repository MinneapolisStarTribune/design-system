import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/react';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

const OPTIONS = [
  { value: 'tech', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music', disabled: true },
];

describe('MultiSelect', () => {
  it('renders combobox trigger', () => {
    const { getByRole } = renderWithProvider(
      <FormControl.MultiSelect id="interests" options={OPTIONS} aria-label="Interests" />
    );

    expect(getByRole('combobox')).toBeInTheDocument();
  });

  it('opens and closes the dropdown from trigger click', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithProvider(
      <FormControl.MultiSelect id="interests" options={OPTIONS} aria-label="Interests" />
    );

    const trigger = getByRole('combobox');

    await user.click(trigger);
    expect(getByRole('listbox')).toBeInTheDocument();

    await user.click(trigger);
    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('keeps dropdown open while toggling options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole, getByText } = renderWithProvider(
      <FormControl.MultiSelect
        id="interests"
        options={OPTIONS}
        onChange={onChange}
        aria-label="Interests"
      />
    );

    const trigger = getByRole('combobox');
    await user.click(trigger);

    await user.click(getByText('Technology'));
    expect(getByRole('listbox')).toBeInTheDocument();

    await user.click(getByText('Sports'));
    expect(getByRole('listbox')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(['tech', 'sports']);
  });

  it('toggles selected value off when clicked again', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole } = renderWithProvider(
      <FormControl.MultiSelect
        id="interests"
        options={OPTIONS}
        value={['tech']}
        onChange={onChange}
        aria-label="Interests"
      />
    );

    await user.click(getByRole('combobox'));
    await user.click(getByRole('option', { name: 'Technology' }));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();

    const { getByRole, getByText, queryByRole } = renderWithProvider(
      <>
        <FormControl.MultiSelect id="interests" options={OPTIONS} aria-label="Interests" />
        <button>Outside</button>
      </>
    );

    await user.click(getByRole('combobox'));
    await user.click(getByText('Outside'));

    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not toggle disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole, getByText } = renderWithProvider(
      <FormControl.MultiSelect
        id="interests"
        options={OPTIONS}
        onChange={onChange}
        aria-label="Interests"
      />
    );

    await user.click(getByRole('combobox'));
    await user.click(getByText('Music'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses FormGroup label and description aria wiring', async () => {
    const user = userEvent.setup();

    const { getByRole } = renderWithProvider(
      <FormGroup>
        <FormGroup.Label>Interests</FormGroup.Label>
        <FormGroup.Description>Select all that apply</FormGroup.Description>
        <FormControl.MultiSelect options={OPTIONS} />
      </FormGroup>
    );

    const trigger = getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-labelledby');
    expect(trigger).toHaveAttribute('aria-describedby');

    await user.click(trigger);
    const listbox = getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('displays selected labels as comma-separated text', () => {
    const { getByRole } = renderWithProvider(
      <FormControl.MultiSelect
        id="interests"
        options={OPTIONS}
        value={['tech', 'sports']}
        aria-label="Interests"
      />
    );

    const trigger = getByRole('combobox');
    const valueText = within(trigger).getByText('Technology, Sports');
    expect(valueText).toBeInTheDocument();
  });

  it('treats value as initial selection when onChange is not provided', async () => {
    const user = userEvent.setup();

    const { getByRole } = renderWithProvider(
      <FormControl.MultiSelect
        id="interests"
        options={OPTIONS}
        value={['tech']}
        aria-label="Interests"
      />
    );

    await user.click(getByRole('combobox'));
    await user.click(getByRole('option', { name: 'Technology' }));

    expect(getByRole('combobox')).toHaveTextContent('Select options');
  });
});
