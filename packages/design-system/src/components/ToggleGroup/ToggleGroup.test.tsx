import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as ToggleGroup from './ToggleGroup';
import styles from './ToggleGroup.module.scss';
import { CalendarIcon, MenuStackedIcon } from '@/icons';

const SingleGroup = ({
  initial = 'all',
  onChange,
  disabled,
}: {
  initial?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) => {
  const [value, setValue] = useState(initial);

  return (
    <ToggleGroup.Root
      label="Filter games"
      value={value}
      disabled={disabled}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    >
      <ToggleGroup.Item value="all">
        All Games <span>(48)</span>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="past">
        Past <span>(30)</span>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="upcoming" disabled>
        Upcoming
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

const MultipleGroup = ({
  initial = [],
  onChange,
}: {
  initial?: string[];
  onChange?: (value: string[]) => void;
}) => {
  const [value, setValue] = useState(initial);

  return (
    <ToggleGroup.Root
      type="multiple"
      label="Levels"
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    >
      <ToggleGroup.Item value="varsity">Varsity</ToggleGroup.Item>
      <ToggleGroup.Item value="jv">JV</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

describe('ToggleGroup', () => {
  describe('single', () => {
    it('renders a labelled radio group with one radio per item', () => {
      render(<SingleGroup />);

      expect(screen.getByRole('radiogroup', { name: 'Filter games' })).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(3);
      expect(screen.getByRole('radio', { name: 'All Games (48)' })).toBeChecked();
    });

    it('selects the clicked item and reports its value', async () => {
      const onChange = vi.fn();
      render(<SingleGroup onChange={onChange} />);

      await userEvent.click(screen.getByTestId('toggle-group-item-past'));

      expect(onChange).toHaveBeenCalledWith('past');
      expect(screen.getByRole('radio', { name: 'Past (30)' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'All Games (48)' })).not.toBeChecked();
      expect(screen.getByTestId('toggle-group-item-past')).toHaveClass(styles.selected);
    });

    it('does not report a change when the selected item is clicked again', async () => {
      const onChange = vi.fn();
      render(<SingleGroup onChange={onChange} />);

      await userEvent.click(screen.getByTestId('toggle-group-item-all'));

      expect(onChange).not.toHaveBeenCalled();
    });

    it('moves the selection with arrow keys', async () => {
      const onChange = vi.fn();
      render(<SingleGroup onChange={onChange} />);

      await userEvent.tab();
      expect(screen.getByRole('radio', { name: 'All Games (48)' })).toHaveFocus();

      await userEvent.keyboard('{ArrowRight}');
      expect(onChange).toHaveBeenCalledWith('past');
    });

    it('ignores disabled items', async () => {
      const onChange = vi.fn();
      render(<SingleGroup onChange={onChange} />);

      expect(screen.getByRole('radio', { name: 'Upcoming' })).toBeDisabled();
      await userEvent.click(screen.getByTestId('toggle-group-item-upcoming'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('disables every item when the group is disabled', () => {
      render(<SingleGroup disabled />);

      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).toBeDisabled();
      }
    });
  });

  describe('multiple', () => {
    it('renders a labelled group of checkboxes', () => {
      render(<MultipleGroup />);

      expect(screen.getByRole('group', { name: 'Levels' })).toBeInTheDocument();
      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    });

    it('adds and removes values as items are toggled', async () => {
      const onChange = vi.fn();
      render(<MultipleGroup initial={['varsity']} onChange={onChange} />);

      await userEvent.click(screen.getByTestId('toggle-group-item-jv'));
      expect(onChange).toHaveBeenLastCalledWith(['varsity', 'jv']);

      await userEvent.click(screen.getByTestId('toggle-group-item-varsity'));
      expect(onChange).toHaveBeenLastCalledWith(['jv']);
      expect(screen.getByRole('checkbox', { name: 'Varsity' })).not.toBeChecked();
    });

    it('lets every item be deselected', async () => {
      const onChange = vi.fn();
      render(<MultipleGroup initial={['jv']} onChange={onChange} />);

      await userEvent.click(screen.getByTestId('toggle-group-item-jv'));
      expect(onChange).toHaveBeenLastCalledWith([]);
    });
  });

  describe('icons', () => {
    it('names icon-only items with aria-label and lays them out square', () => {
      render(
        <ToggleGroup.Root label="View" value="list" onChange={() => {}}>
          <ToggleGroup.Item value="list" aria-label="List view">
            <MenuStackedIcon />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="calendar" aria-label="Calendar view">
            <CalendarIcon />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      );

      expect(screen.getByRole('radio', { name: 'List view' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Calendar view' })).not.toBeChecked();
      expect(screen.getByTestId('toggle-group-item-list')).toHaveClass(styles.iconOnly);
    });

    it('keeps the label as the name when an icon sits beside it', () => {
      render(
        <ToggleGroup.Root label="View" value="list" onChange={() => {}}>
          <ToggleGroup.Item value="list">
            <MenuStackedIcon size="small" />
            List
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      );

      expect(screen.getByRole('radio', { name: 'List' })).toBeInTheDocument();
      expect(screen.getByTestId('toggle-group-item-list')).not.toHaveClass(styles.iconOnly);
    });

    it('warns when an item has no text and no aria-label', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(
        <ToggleGroup.Root label="View" value="list" onChange={() => {}}>
          <ToggleGroup.Item value="list">
            <MenuStackedIcon />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="calendar" aria-label="Calendar view">
            <CalendarIcon />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      );

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain('Item "list" has no text');
      warn.mockRestore();
    });
  });

  it('applies the fullWidth class to the root', () => {
    render(
      <ToggleGroup.Root label="View" value="day" onChange={() => {}} fullWidth>
        <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
      </ToggleGroup.Root>
    );

    const root = screen.getByTestId('toggle-group');
    expect(root).toHaveClass(styles.root, styles.fullWidth);
  });

  it('prefers aria-labelledby over label', () => {
    render(
      <>
        <h2 id="schedule-heading">Schedule</h2>
        <ToggleGroup.Root
          label="Ignored"
          aria-labelledby="schedule-heading"
          value="day"
          onChange={() => {}}
        >
          <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
        </ToggleGroup.Root>
      </>
    );

    expect(screen.getByRole('radiogroup', { name: 'Schedule' })).toBeInTheDocument();
  });

  it('throws when an item is rendered outside a root', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ToggleGroup.Item value="day">Day</ToggleGroup.Item>)).toThrow(
      'ToggleGroup.Item must be rendered inside ToggleGroup.Root'
    );
    error.mockRestore();
  });
});
