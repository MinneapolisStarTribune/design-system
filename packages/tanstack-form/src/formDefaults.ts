import { createErrorVisibility, type ReusableErrorVisibility } from '@tanstack/react-form';

/**
 * Shared `useForm` defaults. Spread them in first so per-form options win:
 * `useForm({ ...formDefaults, defaultValues, validators })`.
 */
export const formDefaults: { errorVisibility: ReusableErrorVisibility } = {
  // Show a field's errors once it's been blurred or the form has been submitted
  errorVisibility: createErrorVisibility(
    ({ fieldState, state }) => fieldState.meta.isBlurred || state.submissionAttempts > 0
  ),
};
