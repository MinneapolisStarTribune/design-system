import type { TextInputProps } from '../TextInput/web/TextInput';

export interface PasswordInputProps extends Omit<TextInputProps, 'type' | 'icon' | 'iconPosition'> {
  /** Initial password visibility when uncontrolled. Defaults to hidden. */
  defaultPasswordVisible?: boolean;
  /** Controlled password visibility state. */
  passwordVisible?: boolean;
  /** Called when the user toggles password visibility. */
  onPasswordVisibleChange?: (visible: boolean) => void;
  /** Password manager hint. Required for WCAG 1.3.5. */
  autoComplete: 'current-password' | 'new-password';
}
