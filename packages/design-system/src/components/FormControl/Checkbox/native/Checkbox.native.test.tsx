import { fireEvent, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Checkbox } from './Checkbox.native';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

describe('Checkbox (native)', () => {
  it('renders title and optional description', () => {
    render(
      <Checkbox
        title="Subscribe"
        description="Daily updates"
        checked={false}
        onChange={() => {}}
        dataTestId="cb"
      />,
      { wrapper: ds }
    );

    expect(screen.getByText('Subscribe', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('Daily updates', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it('calls onChange with toggled value when pressed', () => {
    const onChange = jest.fn();
    render(<Checkbox title="Opt" checked={false} onChange={onChange} dataTestId="cb" />, {
      wrapper: ds,
    });

    fireEvent.press(screen.getByTestId('cb-control'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('when indeterminate, calls onChange(true)', () => {
    const onChange = jest.fn();
    render(
      <Checkbox
        title="Select all"
        checked={false}
        indeterminate
        onChange={onChange}
        dataTestId="cb"
      />,
      { wrapper: ds }
    );

    fireEvent.press(screen.getByTestId('cb-control'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();
    render(<Checkbox title="Opt" checked={false} disabled onChange={onChange} dataTestId="cb" />, {
      wrapper: ds,
    });

    fireEvent.press(screen.getByTestId('cb-control'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
