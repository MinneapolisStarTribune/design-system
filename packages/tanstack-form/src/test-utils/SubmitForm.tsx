import React from 'react';
import { type AnyFormApi } from '@tanstack/react-form';

/** `<form>` that submits through TanStack, plus a Submit button. */
export const SubmitForm = ({ form, children }: { form: AnyFormApi; children: React.ReactNode }) => (
  <form
    onSubmit={(event) => {
      event.preventDefault();
      void form.handleSubmit();
    }}
  >
    {children}
    <button type="submit">Submit</button>
  </form>
);
