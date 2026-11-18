import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '@/test-utils/render';
import meta, { Configurable } from './Autocomplete.stories';
import type { AutocompleteProps } from '../Autocomplete.types';

// Docs can render the story without Storybook's preview-hook context.
const Story = Configurable.render as (args: AutocompleteProps) => React.ReactElement;

describe('Autocomplete Configurable story', () => {
  it('renders without preview hooks and supports selection and updated controls', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const args = { ...meta.args, onChange };
    const { getByRole, rerender } = renderWithProvider(<Story {...args} />);
    const input = getByRole('combobox');
    await user.type(input, 'soft');
    await user.click(getByRole('option', { name: 'Softball' }));
    expect(input).toHaveValue('Softball');
    expect(onChange).toHaveBeenCalledWith('softball');
    rerender(<Story {...args} value="football" />);
    expect(getByRole('combobox')).toHaveValue('Football');
  });

  it('keeps controlled search editable and responds to search controls', async () => {
    const user = userEvent.setup();
    const args = { ...meta.args, inputValue: '' };
    const { getByRole, rerender } = renderWithProvider(<Story {...args} />);
    await user.type(getByRole('combobox'), 'soft');
    expect(getByRole('combobox')).toHaveValue('soft');
    expect(getByRole('option', { name: 'Softball' })).toBeInTheDocument();
    rerender(<Story {...args} inputValue="foot" />);
    expect(getByRole('combobox')).toHaveValue('foot');
  });
});
