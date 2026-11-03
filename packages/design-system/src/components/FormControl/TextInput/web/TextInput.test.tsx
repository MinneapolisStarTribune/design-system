import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import fieldStyles from '@/components/FormControl/FieldSurface.module.scss';
import { TextInput } from './TextInput';

describe('TextInput (web)', () => {
  it.each([
    ['small', 'typography-utility-text-italic-small'],
    ['medium', 'typography-utility-text-italic-medium'],
    ['large', 'typography-utility-text-italic-large'],
  ] as const)('applies %s placeholder typography class', (size, typographyClass) => {
    render(
      <TextInput
        size={size}
        placeholderText="Enter text"
        aria-label="Test input"
        dataTestId="text-input"
      />
    );

    expect(screen.getByTestId('text-input')).toHaveClass(typographyClass);
  });

  it.each([
    ['error', fieldStyles.error],
    ['success', fieldStyles.success],
  ] as const)('picks up the %s state from a FormGroup caption', (variant, stateClass) => {
    render(
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <TextInput dataTestId="text-input" />
        <FormGroup.Caption variant={variant}>Message</FormGroup.Caption>
      </FormGroup>
    );

    expect(screen.getByTestId('text-input').parentElement).toHaveClass(stateClass);
  });

  it('lets isError={false} override an error caption', () => {
    render(
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <TextInput dataTestId="text-input" isError={false} />
        <FormGroup.Caption variant="error">Message</FormGroup.Caption>
      </FormGroup>
    );

    expect(screen.getByTestId('text-input').parentElement).not.toHaveClass(fieldStyles.error);
  });
});
