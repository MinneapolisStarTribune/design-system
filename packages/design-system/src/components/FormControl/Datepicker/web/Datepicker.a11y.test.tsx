import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { FormControlDatepicker } from './Datepicker';

describe('FormControlDatepicker accessibility', () => {
  it('checks the input, actual calendar portal and validation error', async () => {
    const { container } = render(
      <FormGroup>
        <FormGroup.Label>Date</FormGroup.Label>
        <FormControlDatepicker defaultValue="2026-04-18" required />
      </FormGroup>,
      { wrapper: TestWrapperInDesignSystemProvider() }
    );
    expect(await axe(container)).toHaveNoViolations();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Choose a date' }));
    expect(await axe(screen.getByRole('dialog'))).toHaveNoViolations();
    await user.keyboard('{Escape}');
    await user.clear(screen.getByRole('textbox'));
    await user.click(document.body);
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a date.');
    expect(await axe(container)).toHaveNoViolations();
  });
});
