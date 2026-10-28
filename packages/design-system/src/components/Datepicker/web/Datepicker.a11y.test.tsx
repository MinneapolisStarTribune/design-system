import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { BRANDS } from '@/providers/theme-helpers';
import { Datepicker } from './Datepicker';

describe('Datepicker accessibility', () => {
  it.each(BRANDS)('has no inline violations for %s', async (brand) => {
    const { container } = render(
      <Datepicker value="2026-03-10" min="2026-03-05" max="2026-04-10" />,
      {
        wrapper: TestWrapperInDesignSystemProvider({ brand }),
      }
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('checks the actual open portal and exposes full date and weekday names', async () => {
    render(
      <Datepicker value="2026-03-10" trigger={<button type="button">March 10, 2026</button>} />,
      {
        wrapper: TestWrapperInDesignSystemProvider(),
      }
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'March 10, 2026' }));
    const dialog = screen.getByRole('dialog', { name: 'Choose a date' });
    expect(await axe(dialog)).toHaveNoViolations();
    expect(within(dialog).getByRole('button', { name: 'Tuesday, March 10, 2026' })).toHaveFocus();
    expect(within(dialog).getAllByRole('columnheader')[0]).toHaveAttribute('abbr', 'Sunday');
    expect(within(dialog).getByRole('gridcell', { selected: true })).toHaveTextContent('10');
  });
});
