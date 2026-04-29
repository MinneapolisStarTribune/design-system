import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { renderWithProvider } from '@/test-utils/render';

describe('Switch', () => {
  it('renders a semantic switch input', () => {
    const { getByRole } = renderWithProvider(
      <FormControl.Switch selected={false} onChange={() => {}} aria-label="Demo switch" />
    );

    expect(getByRole('switch')).toBeInTheDocument();
  });

  it('calls onChange with toggled value when clicked', async () => {
    const onChange = vi.fn();

    const { getByRole } = renderWithProvider(
      <FormControl.Switch selected={false} onChange={onChange} label="Enable setting" />
    );

    await userEvent.click(getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('shows check icon when selected', () => {
    const { getByTestId } = renderWithProvider(
      <FormControl.Switch
        selected={true}
        onChange={() => {}}
        aria-label="Enabled switch"
        dataTestId="switch"
      />
    );

    expect(getByTestId('switch-check-icon')).toBeInTheDocument();
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();

    const { getByRole } = renderWithProvider(
      <FormControl.Switch
        selected={false}
        isDisabled
        onChange={onChange}
        aria-label="Disabled switch"
      />
    );

    await userEvent.click(getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('associates standalone caption via aria-describedby', () => {
    const { getByRole } = renderWithProvider(
      <FormControl.Switch
        selected={false}
        onChange={() => {}}
        label="Enable setting"
        caption="Changes apply immediately"
      />
    );

    const input = getByRole('switch');
    const describedById = input.getAttribute('aria-describedby');
    expect(describedById).toBeTruthy();
    expect(describedById).toContain('caption');
  });

  it('uses FormGroup label and descriptions when rendered inside FormGroup', () => {
    const { getByRole, getByText } = renderWithProvider(
      <FormGroup>
        <FormGroup.Label>Personalized homepage</FormGroup.Label>
        <FormGroup.Description>Show stories based on preferences.</FormGroup.Description>
        <FormControl.Switch selected={true} onChange={() => {}} />
        <FormGroup.Caption variant="info">Applies instantly.</FormGroup.Caption>
      </FormGroup>
    );

    const input = getByRole('switch');

    expect(input).toHaveAttribute('aria-labelledby');
    expect(input).toHaveAttribute('aria-describedby');

    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy.split(' ').length).toBeGreaterThanOrEqual(2);

    expect(getByText('Personalized homepage')).toBeInTheDocument();
    expect(getByText('Show stories based on preferences.')).toBeInTheDocument();
    expect(getByText('Applies instantly.')).toBeInTheDocument();
  });
});
