import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { renderWithProvider } from '@/test-utils/render';
import type { RadioOption } from './RadioGroup';

const options: RadioOption[] = [
  { value: 'a', title: 'Option A' },
  { value: 'b', title: 'Option B' },
  { value: 'c', title: 'Option C' },
];

describe('RadioGroup', () => {
  it('renders all options', () => {
    const { getByText } = renderWithProvider(
      <FormControl.RadioGroup
        name="options"
        value={null}
        onChange={() => {}}
        options={options}
        dataTestId="radio-group"
      />
    );

    expect(getByText('Option A')).toBeInTheDocument();
    expect(getByText('Option B')).toBeInTheDocument();
    expect(getByText('Option C')).toBeInTheDocument();
  });

  it('marks only the selected value as checked', () => {
    const { getByTestId } = renderWithProvider(
      <FormControl.RadioGroup
        name="options"
        value="b"
        onChange={() => {}}
        options={options}
        dataTestId="radio-group"
      />
    );

    expect(getByTestId('radio-group-option-a').querySelector('input')).not.toBeChecked();
    expect(getByTestId('radio-group-option-b').querySelector('input')).toBeChecked();
    expect(getByTestId('radio-group-option-c').querySelector('input')).not.toBeChecked();
  });

  it('calls onChange with option value when a radio is selected', async () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithProvider(
      <FormControl.RadioGroup
        name="options"
        value={null}
        onChange={onChange}
        options={options}
        dataTestId="radio-group"
      />
    );

    await userEvent.click(getByTestId('radio-group-option-b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('applies disabled state to all radios', () => {
    const { getByTestId } = renderWithProvider(
      <FormControl.RadioGroup
        name="options"
        value={null}
        onChange={() => {}}
        options={options}
        disabled
        dataTestId="radio-group"
      />
    );

    expect(getByTestId('radio-group-option-a').querySelector('input')).toBeDisabled();
    expect(getByTestId('radio-group-option-b').querySelector('input')).toBeDisabled();
    expect(getByTestId('radio-group-option-c').querySelector('input')).toBeDisabled();
  });

  it('sets role to radiogroup', () => {
    const { getByRole } = renderWithProvider(
      <FormControl.RadioGroup
        name="options"
        value={null}
        onChange={() => {}}
        options={options}
        dataTestId="radio-group"
      />
    );

    expect(getByRole('radiogroup')).toBeInTheDocument();
  });

  it('wires FormGroup label and description to group aria attributes', () => {
    const { getByRole } = renderWithProvider(
      <FormGroup>
        <FormGroup.Label>Choose one</FormGroup.Label>
        <FormGroup.Description>Only one option may be selected</FormGroup.Description>
        <FormControl.RadioGroup name="options" value={null} onChange={() => {}} options={options} />
      </FormGroup>
    );

    const group = getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-labelledby');
    expect(group).toHaveAttribute('aria-describedby');
  });
});
