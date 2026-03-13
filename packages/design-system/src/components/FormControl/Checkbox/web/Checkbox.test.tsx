import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';

describe('Checkbox', () => {
  it('renders a semantic checkbox input', () => {
    const { getByTestId } = renderWithProvider(
      <FormControl.Checkbox
        label="Accept terms"
        checked={false}
        onChange={() => {}}
        dataTestId="checkbox"
      />
    );

    const input = getByTestId('checkbox').querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'checkbox');
  });

  it('associates label with input via htmlFor', () => {
    const { getByTestId } = renderWithProvider(
      <FormControl.Checkbox
        label="Accept terms"
        checked={false}
        onChange={() => {}}
        dataTestId="checkbox"
      />
    );

    const label = getByTestId('checkbox');
    const input = label.querySelector('input');
    expect(label).toHaveAttribute('for', input?.id);
  });

  it('displays label text', () => {
    const { getByText } = renderWithProvider(
      <FormControl.Checkbox
        label="Subscribe to newsletter"
        checked={false}
        onChange={() => {}}
      />
    );

    expect(getByText('Subscribe to newsletter')).toBeInTheDocument();
  });

  it('displays optional caption when provided', () => {
    const { getByText } = renderWithProvider(
      <FormControl.Checkbox
        label="Subscribe"
        caption="Daily email updates"
        checked={false}
        onChange={() => {}}
      />
    );

    expect(getByText('Daily email updates')).toBeInTheDocument();
  });

  it('calls onChange with new checked value when clicked', async () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithProvider(
      <FormControl.Checkbox
        label="Option"
        checked={false}
        onChange={onChange}
        dataTestId="checkbox"
      />
    );

    await userEvent.click(getByTestId('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('sets aria-checked="mixed" when indeterminate', () => {
    const { getByTestId } = renderWithProvider(
      <FormControl.Checkbox
        label="Select all"
        checked={false}
        indeterminate
        onChange={() => {}}
        dataTestId="checkbox"
      />
    );

    const input = getByTestId('checkbox').querySelector('input');
    expect(input).toHaveAttribute('aria-checked', 'mixed');
  });

  it('sets aria-invalid when error', () => {
    const { getByTestId } = renderWithProvider(
      <FormControl.Checkbox
        label="Required"
        checked={false}
        error
        onChange={() => {}}
        dataTestId="checkbox"
      />
    );

    const input = getByTestId('checkbox').querySelector('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables input when disabled prop is true', () => {
    const { getByTestId } = renderWithProvider(
      <FormControl.Checkbox
        label="Disabled option"
        checked={false}
        disabled
        onChange={() => {}}
        dataTestId="checkbox"
      />
    );

    const input = getByTestId('checkbox').querySelector('input');
    expect(input).toBeDisabled();
  });

  it('has tabIndex=-1 when focus is false (not focusable)', () => {
    const { getByTestId } = renderWithProvider(
      <FormControl.Checkbox
        label="Not focusable"
        checked={false}
        onChange={() => {}}
        focus={false}
        dataTestId="checkbox"
      />
    );

    const input = getByTestId('checkbox').querySelector('input');
    expect(input).toHaveAttribute('tabindex', '-1');
  });

  it('does not retain focus when focus is false and label is clicked', async () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithProvider(
      <FormControl.Checkbox
        label="Not focusable"
        checked={false}
        onChange={onChange}
        focus={false}
        dataTestId="checkbox"
      />
    );

    const checkbox = getByTestId('checkbox');
    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
    // Input should not have focus (blurred immediately)
    expect(checkbox.querySelector('input')).not.toHaveFocus();
  });

  it('does not call onChange when disabled and clicked', async () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithProvider(
      <FormControl.Checkbox
        label="Disabled"
        checked={false}
        disabled
        onChange={onChange}
        dataTestId="checkbox"
      />
    );

    await userEvent.click(getByTestId('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
