import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
