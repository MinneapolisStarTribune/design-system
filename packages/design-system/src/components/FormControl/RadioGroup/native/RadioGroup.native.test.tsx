import { fireEvent, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { RadioGroup } from './RadioGroup.native';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

const OPTIONS = [
  { value: 'a', title: 'Option A', description: 'First option' },
  { value: 'b', title: 'Option B' },
  { value: 'c', title: 'Option C' },
];

describe('RadioGroup (native)', () => {
  it('renders all options with titles and descriptions', () => {
    render(
      <RadioGroup name="test" value="a" options={OPTIONS} onChange={() => {}} dataTestId="rg" />,
      { wrapper: ds }
    );

    expect(screen.getByText('Option A', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('First option', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('Option B', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('Option C', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it('calls onChange with selected value when a radio is pressed', () => {
    const onChange = jest.fn();

    render(
      <RadioGroup name="test" value="a" options={OPTIONS} onChange={onChange} dataTestId="rg" />,
      { wrapper: ds }
    );

    fireEvent.press(screen.getByTestId('rg-option-b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onChange when pressing already selected radio', () => {
    const onChange = jest.fn();

    render(
      <RadioGroup name="test" value="a" options={OPTIONS} onChange={onChange} dataTestId="rg" />,
      { wrapper: ds }
    );

    fireEvent.press(screen.getByTestId('rg-option-a'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();

    render(
      <RadioGroup
        name="test"
        value="a"
        options={OPTIONS}
        disabled
        onChange={onChange}
        dataTestId="rg"
      />,
      { wrapper: ds }
    );

    fireEvent.press(screen.getByTestId('rg-option-b'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies error state to all radios', () => {
    render(
      <RadioGroup
        name="test"
        value=""
        options={OPTIONS}
        error
        onChange={() => {}}
        dataTestId="rg"
      />,
      { wrapper: ds }
    );

    expect(screen.getByText('Option A')).toBeOnTheScreen();
    expect(screen.getByText('Option B')).toBeOnTheScreen();
  });
});
