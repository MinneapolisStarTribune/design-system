import { createEvent, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

describe('PasswordInput', () => {
  it('renders an input with type="password" by default', () => {
    const { getByLabelText } = renderWithProvider(
      <FormControl.PasswordInput aria-label="Password" autoComplete="current-password" />
    );

    expect(getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('toggles input type and button state when visibility changes', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = renderWithProvider(
      <FormControl.PasswordInput aria-label="Password" autoComplete="current-password" />
    );

    const input = getByLabelText('Password');
    const toggle = getByRole('button', { name: 'Show password' });

    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);

    expect(input).toHaveAttribute('type', 'text');
    expect(getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('announces visibility changes to screen readers', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = renderWithProvider(
      <FormControl.PasswordInput aria-label="Password" autoComplete="current-password" />
    );

    await user.click(getByRole('button', { name: 'Show password' }));
    expect(getByText('Password shown')).toBeInTheDocument();

    await user.click(getByRole('button', { name: 'Hide password' }));
    expect(getByText('Password hidden')).toBeInTheDocument();
  });

  it('prevents copy and cut when password is hidden', () => {
    const { getByLabelText } = renderWithProvider(
      <FormControl.PasswordInput aria-label="Password" autoComplete="current-password" />
    );

    const input = getByLabelText('Password');

    const copyEvent = createEvent.copy(input);
    const copySpy = vi.spyOn(copyEvent, 'preventDefault');
    fireEvent(input, copyEvent);
    expect(copySpy).toHaveBeenCalled();

    const cutEvent = createEvent.cut(input);
    const cutSpy = vi.spyOn(cutEvent, 'preventDefault');
    fireEvent(input, cutEvent);
    expect(cutSpy).toHaveBeenCalled();
  });

  it('allows paste when password is hidden', async () => {
    const user = userEvent.setup();
    const { getByLabelText } = renderWithProvider(
      <FormControl.PasswordInput aria-label="Password" autoComplete="current-password" />
    );

    const input = getByLabelText('Password');
    await user.click(input);
    await user.paste('secret-value');

    expect(input).toHaveValue('secret-value');
  });

  it('shows validation icons in success and error states', () => {
    const { rerender, getByLabelText, container } = renderWithProvider(
      <FormControl.PasswordInput
        aria-label="Password"
        autoComplete="current-password"
        isSuccess
        defaultValue="password123!"
      />
    );

    expect(container.querySelector('[class*="validation-icon-success"]')).toBeInTheDocument();

    rerender(
      <FormControl.PasswordInput
        aria-label="Password"
        autoComplete="current-password"
        isError
        defaultValue="password123!"
      />
    );

    expect(container.querySelector('[class*="validation-icon-error"]')).toBeInTheDocument();
    expect(getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('applies extra padding when validation icon is present', () => {
    const { container, rerender } = renderWithProvider(
      <FormControl.PasswordInput aria-label="Password" autoComplete="current-password" />
    );

    const inputWrapper = container.querySelector('[class*="password-input-medium"]');
    expect(inputWrapper?.className.includes('has-validation-icon')).toBe(false);

    rerender(
      <FormControl.PasswordInput
        aria-label="Password"
        autoComplete="current-password"
        isSuccess
        defaultValue="password123!"
      />
    );

    expect(container.querySelector('[class*="has-validation-icon"]')).toBeInTheDocument();
  });

  it('passes autocomplete to the input', () => {
    const { getByLabelText } = renderWithProvider(
      <FormControl.PasswordInput aria-label="Password" autoComplete="new-password" />
    );

    expect(getByLabelText('Password')).toHaveAttribute('autocomplete', 'new-password');
  });

  it('works with FormGroup accessibility wiring', () => {
    const { getByLabelText, getByText } = renderWithProvider(
      <FormGroup>
        <FormGroup.Label>Password</FormGroup.Label>
        <FormGroup.Description>Use at least 8 characters.</FormGroup.Description>
        <FormControl.PasswordInput autoComplete="new-password" />
        <FormGroup.Caption variant="info">Password strength is good.</FormGroup.Caption>
      </FormGroup>
    );

    const input = getByLabelText('Password');
    const description = getByText('Use at least 8 characters.');
    const caption = getByText('Password strength is good.');

    expect(input).toHaveAttribute('aria-describedby');
    const ariaDescribedBy = input.getAttribute('aria-describedby') ?? '';
    expect(ariaDescribedBy).toContain(description.id);
    expect(ariaDescribedBy).toContain(caption.id);
  });
});
