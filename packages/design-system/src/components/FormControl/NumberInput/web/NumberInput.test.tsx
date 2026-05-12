import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

describe('NumberInput', () => {
  it('renders an input with type="number"', () => {
    const { getByLabelText } = renderWithProvider(
      <FormControl.NumberInput aria-label="Build number" />
    );

    const input = getByLabelText('Build number');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('prevents non-digit keyboard input', async () => {
    const { getByLabelText } = renderWithProvider(
      <FormControl.NumberInput aria-label="Order number" />
    );

    const input = getByLabelText('Order number');
    await userEvent.type(input, '12abc3');

    expect(input).toHaveValue(123);
  });

  it('works with FormGroup accessibility wiring', () => {
    const { getByLabelText, getByText } = renderWithProvider(
      <FormGroup>
        <FormGroup.Label>Build Number</FormGroup.Label>
        <FormGroup.Description>Enter the release build number.</FormGroup.Description>
        <FormControl.NumberInput />
        <FormGroup.Caption variant="info">Digits only.</FormGroup.Caption>
      </FormGroup>
    );

    const input = getByLabelText('Build Number');
    const description = getByText('Enter the release build number.');
    const caption = getByText('Digits only.');

    expect(input).toHaveAttribute('aria-describedby');
    const ariaDescribedBy = input.getAttribute('aria-describedby') ?? '';
    expect(ariaDescribedBy).toContain(description.id);
    expect(ariaDescribedBy).toContain(caption.id);
  });
});
