import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import { FormControl } from '@/components/FormControl/FormControl';
import { within } from '@testing-library/react';

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia', disabled: true },
];

describe('Select', () => {
  it('renders combobox', () => {
    const { getByRole } = renderWithProvider(<FormControl.Select id="test" options={OPTIONS} />);

    expect(getByRole('combobox')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();

    const { getByRole } = renderWithProvider(<FormControl.Select id="test" options={OPTIONS} />);

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    await user.click(trigger);

    expect(getByRole('listbox')).toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();

    const { getByRole, getByText, queryByRole } = renderWithProvider(
      <>
        <FormControl.Select id="test" options={OPTIONS} />
        <button>Outside</button>
      </>
    );

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    await user.click(trigger);
    await user.click(getByText('Outside'));

    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onChange when selecting option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { getByRole, getByText } = renderWithProvider(
      <FormControl.Select id="test" options={OPTIONS} onChange={onChange} />
    );

    const select = getByRole('combobox');
    const trigger = within(select).getByRole('button');

    await user.click(trigger);
    await user.click(getByText('Canada'));

    expect(onChange).toHaveBeenCalledWith('ca');
  });
});
