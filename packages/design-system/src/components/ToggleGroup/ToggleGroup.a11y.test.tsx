import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations, renderAndCheckA11y } from '@/test-utils/a11y';
import * as ToggleGroup from './ToggleGroup';
import { CalendarIcon, ChartIcon, MenuStackedIcon } from '@/icons';

const GameFilterItems = () => (
  <>
    <ToggleGroup.Item value="all">
      All Games <span>(48)</span>
    </ToggleGroup.Item>
    <ToggleGroup.Item value="past">
      Past <span>(30)</span>
    </ToggleGroup.Item>
    <ToggleGroup.Item value="upcoming">
      Upcoming <span>(18)</span>
    </ToggleGroup.Item>
  </>
);

describe('ToggleGroup Accessibility', () => {
  it('has no violations as a single-select group', async () => {
    await expectNoA11yViolations(
      <ToggleGroup.Root label="Filter games" value="all" onChange={() => {}}>
        <GameFilterItems />
      </ToggleGroup.Root>
    );
  });

  it('has no violations with the neutral color and a disabled item', async () => {
    await expectNoA11yViolations(
      <ToggleGroup.Root label="Filter games" value="past" onChange={() => {}} color="neutral">
        <ToggleGroup.Item value="all">All Games</ToggleGroup.Item>
        <ToggleGroup.Item value="past">Past</ToggleGroup.Item>
        <ToggleGroup.Item value="upcoming" disabled>
          Upcoming
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    );
  });

  it('has no violations as a multi-select group', async () => {
    await expectNoA11yViolations(
      <ToggleGroup.Root type="multiple" label="Levels" value={['varsity']} onChange={() => {}}>
        <ToggleGroup.Item value="varsity">Varsity</ToggleGroup.Item>
        <ToggleGroup.Item value="jv">JV</ToggleGroup.Item>
      </ToggleGroup.Root>
    );
  });

  it('has no violations with icon-only items', async () => {
    await expectNoA11yViolations(
      <ToggleGroup.Root label="View" value="list" onChange={() => {}}>
        <ToggleGroup.Item value="list" aria-label="List view">
          <MenuStackedIcon />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="calendar" aria-label="Calendar view">
          <CalendarIcon />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="chart" aria-label="Chart view">
          <ChartIcon />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    );
  });

  it('has no violations after changing the selection', async () => {
    function InteractiveToggleGroup() {
      const [value, setValue] = useState('all');

      return (
        <ToggleGroup.Root label="Filter games" value={value} onChange={setValue}>
          <GameFilterItems />
        </ToggleGroup.Root>
      );
    }

    const { renderResult, checkA11y } = await renderAndCheckA11y(<InteractiveToggleGroup />);
    await userEvent.click(renderResult.getByTestId('toggle-group-item-past'));
    await checkA11y();
  });
});
