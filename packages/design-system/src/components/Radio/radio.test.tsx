import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { Radio } from './radio';

describe('Radio', () => {
  it('renders a semantic radio input', () => {
    const { getByTestId } = renderWithProvider(
      <Radio title="Option" checked={false} onChange={() => {}} dataTestId="radio" />
    );

    const input = getByTestId('radio').querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'radio');
  });

  it('associates label with input via htmlFor', () => {
    const { getByTestId } = renderWithProvider(
      <Radio title="Option" checked={false} onChange={() => {}} dataTestId="radio" />
    );

    const label = getByTestId('radio');
    const input = label.querySelector('input');
    expect(label).toHaveAttribute('for', input?.id);
  });

  it('displays title text', () => {
    const { getByText } = renderWithProvider(
      <Radio title="Subscribe to newsletter" checked={false} onChange={() => {}} />
    );

    expect(getByText('Subscribe to newsletter')).toBeInTheDocument();
  });

  it('displays optional description when provided', () => {
    const { getByText } = renderWithProvider(
      <Radio title="Subscribe" description="Weekly updates" checked={false} onChange={() => {}} />
    );

    expect(getByText('Weekly updates')).toBeInTheDocument();
  });

  it('calls onChange with checked value when clicked', async () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithProvider(
      <Radio title="Option" checked={false} onChange={onChange} dataTestId="radio" />
    );

    await userEvent.click(getByTestId('radio'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('sets aria-invalid when error', () => {
    const { getByTestId } = renderWithProvider(
      <Radio title="Required" checked={false} error onChange={() => {}} dataTestId="radio" />
    );

    const input = getByTestId('radio').querySelector('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables input when disabled prop is true', () => {
    const { getByTestId } = renderWithProvider(
      <Radio
        title="Disabled option"
        checked={false}
        disabled
        onChange={() => {}}
        dataTestId="radio"
      />
    );

    const input = getByTestId('radio').querySelector('input');
    expect(input).toBeDisabled();
  });

  it('does not call onChange when disabled and clicked', async () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithProvider(
      <Radio title="Disabled" checked={false} disabled onChange={onChange} dataTestId="radio" />
    );

    await userEvent.click(getByTestId('radio'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
