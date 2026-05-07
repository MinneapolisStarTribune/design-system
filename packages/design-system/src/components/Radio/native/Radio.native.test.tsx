import { render, screen, fireEvent } from '@testing-library/react-native';

import { Radio } from './Radio.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

const wrapper = TestWrapperInDesignSystemProvider();

describe('Radio (native)', () => {
  it('renders label (required)', () => {
    render(<Radio label="Option 1" checked={false} onChange={jest.fn()} />, {
      wrapper,
    });

    expect(screen.getByText('Option 1')).toBeOnTheScreen();
  });

  it('renders description when provided', () => {
    render(
      <Radio
        label="Option 1"
        description="This is description"
        checked={false}
        onChange={jest.fn()}
      />,
      { wrapper }
    );

    expect(screen.getByText('This is description')).toBeOnTheScreen();
  });

  it('does not render description when not provided', () => {
    render(<Radio label="Option 1" checked={false} onChange={jest.fn()} />, {
      wrapper,
    });

    expect(screen.queryByText(/description/i)).toBeNull();
  });

  it('calls onChange when pressed (unchecked & enabled)', () => {
    const onChange = jest.fn();

    render(<Radio label="Option 1" checked={false} onChange={onChange} />, {
      wrapper,
    });

    fireEvent.press(screen.getByRole('radio'));

    expect(onChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onChange when already checked', () => {
    const onChange = jest.fn();

    render(<Radio label="Option 1" checked onChange={onChange} />, {
      wrapper,
    });

    fireEvent.press(screen.getByRole('radio'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('does NOT call onChange when disabled', () => {
    const onChange = jest.fn();

    render(<Radio label="Option 1" checked={false} disabled onChange={onChange} />, {
      wrapper,
    });

    fireEvent.press(screen.getByRole('radio'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies testID correctly', () => {
    render(
      <Radio label="Option 1" checked={false} onChange={jest.fn()} dataTestId="radio-test" />,
      { wrapper }
    );

    expect(screen.getByTestId('radio-test')).toBeOnTheScreen();
  });

  it('renders correctly with error state', () => {
    render(<Radio label="Option 1" checked={false} error onChange={jest.fn()} />, { wrapper });

    expect(screen.getByRole('radio')).toBeOnTheScreen();
  });

  it('renders correctly with brand color when checked', () => {
    render(<Radio label="Option 1" checked color="brand" onChange={jest.fn()} />, { wrapper });

    expect(screen.getByRole('radio')).toBeOnTheScreen();
  });

  it('throws error when used without DesignSystemProvider', () => {
    const renderWithoutProvider = () =>
      render(<Radio label="Option 1" checked={false} onChange={jest.fn()} />);

    expect(renderWithoutProvider).toThrow(/must be used within a DesignSystemProvider/);
  });
});
