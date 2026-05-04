import { render, screen } from '@testing-library/react-native';

import { Radio } from './Radio.native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

const wrapper = TestWrapperInDesignSystemProvider();

describe('Radio Accessibility (native)', () => {
  it('has accessibility role "radio"', () => {
    render(<Radio label="Option 1" checked={false} onChange={jest.fn()} />, {
      wrapper,
    });

    expect(screen.getByRole('radio')).toBeOnTheScreen();
  });

  it('sets accessibilityState checked correctly (true)', () => {
    render(<Radio label="Option 1" checked onChange={jest.fn()} />, {
      wrapper,
    });

    const radio = screen.getByRole('radio');

    expect(radio.props.accessibilityState).toMatchObject({
      checked: true,
    });
  });

  it('sets accessibilityState checked correctly (false)', () => {
    render(<Radio label="Option 1" checked={false} onChange={jest.fn()} />, {
      wrapper,
    });

    const radio = screen.getByRole('radio');

    expect(radio.props.accessibilityState).toMatchObject({
      checked: false,
    });
  });

  it('sets accessibilityState disabled correctly', () => {
    render(<Radio label="Option 1" checked={false} disabled onChange={jest.fn()} />, { wrapper });

    const radio = screen.getByRole('radio');

    expect(radio.props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });
});
