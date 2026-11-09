import { it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { renderWithProvider } from '@/test-utils/render';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { Autocomplete } from './Autocomplete';

it('connects the form label and exposes accessible custom options and loading status', async () => {
  const user = userEvent.setup();
  const { getByRole, baseElement } = renderWithProvider(
    <FormGroup>
      <FormGroup.Label htmlFor="team">Team</FormGroup.Label>
      <Autocomplete
        id="team"
        loading
        options={[{ value: 'a', label: 'Team A' }]}
        renderOption={({ key, ...props }, option) => (
          <li key={key} {...props}>
            <span aria-hidden>●</span>
            {option.label}
          </li>
        )}
      />
    </FormGroup>
  );
  await user.click(getByRole('combobox', { name: 'Team' }));
  expect(getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
  expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
});
