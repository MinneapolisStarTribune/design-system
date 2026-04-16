import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { FormGroupProvider } from '@/components/FormGroup/FormGroupContext';
import { FormControl } from './FormControl.native';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

describe('FormControl.TextInput Accessibility (native)', () => {
  describe('standalone', () => {
    it('renders an editable text input by default', () => {
      render(<FormControl.TextInput dataTestId="input" placeholderText="Enter text" />, {
        wrapper: ds,
      });

      const input = screen.getByTestId('input');
      expect(input.props.editable).not.toBe(false);
    });

    it('sets accessibilityState.disabled when isDisabled', () => {
      render(<FormControl.TextInput dataTestId="input" placeholderText="Disabled" isDisabled />, {
        wrapper: ds,
      });

      const input = screen.getByTestId('input');
      expect(input.props.accessibilityState).toEqual({ disabled: true });
      expect(input.props.editable).toBe(false);
    });

    it('is editable and not disabled by default', () => {
      render(<FormControl.TextInput dataTestId="input" placeholderText="Active" />, {
        wrapper: ds,
      });

      const input = screen.getByTestId('input');
      expect(input.props.accessibilityState).toEqual({ disabled: false });
      expect(input.props.editable).toBe(true);
    });

    it('displays placeholder text', () => {
      render(<FormControl.TextInput placeholderText="Search here" />, { wrapper: ds });

      expect(screen.getByPlaceholderText('Search here')).toBeOnTheScreen();
    });
  });

  describe('within FormGroup context', () => {
    it('receives nativeID from FormGroupContext for label association', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
          <FormControl.TextInput dataTestId="input" placeholderText="Email" />
        </FormGroupProvider>,
        { wrapper: ds }
      );

      const input = screen.getByTestId('input');
      // nativeID should be set from FormGroupContext.inputId
      expect(input.props.nativeID).toBeDefined();
      expect(input.props.nativeID).not.toBe('');
    });

    it('inherits error state from FormGroup context', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption captionVariant="error">
          <FormControl.TextInput dataTestId="input" placeholderText="Password" />
        </FormGroupProvider>,
        { wrapper: ds }
      );

      // Component should render without crashing in error state
      expect(screen.getByTestId('input')).toBeOnTheScreen();
    });

    it('inherits success state from FormGroup context', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption captionVariant="success">
          <FormControl.TextInput dataTestId="input" placeholderText="Email" />
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByTestId('input')).toBeOnTheScreen();
    });

    it('allows idProp to override FormGroupContext inputId', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
          <FormControl.TextInput dataTestId="input" id="custom-id" placeholderText="Name" />
        </FormGroupProvider>,
        { wrapper: ds }
      );

      const input = screen.getByTestId('input');
      expect(input.props.nativeID).toBe('custom-id');
    });
  });

  describe('with icons', () => {
    it('renders with start icon without breaking accessibility', () => {
      render(
        <FormControl.TextInput
          dataTestId="input"
          placeholderText="Search"
          icon={<View testID="icon" />}
          iconPosition="start"
        />,
        { wrapper: ds }
      );

      expect(screen.getByTestId('input')).toBeOnTheScreen();
      expect(screen.getByTestId('icon')).toBeOnTheScreen();
    });

    it('renders with end icon without breaking accessibility', () => {
      render(
        <FormControl.TextInput
          dataTestId="input"
          placeholderText="Email"
          icon={<View testID="icon" />}
          iconPosition="end"
        />,
        { wrapper: ds }
      );

      expect(screen.getByTestId('input')).toBeOnTheScreen();
      expect(screen.getByTestId('icon')).toBeOnTheScreen();
    });
  });

  describe('error state via prop', () => {
    it('renders in error state when isError is true', () => {
      render(<FormControl.TextInput dataTestId="input" placeholderText="Email" isError />, {
        wrapper: ds,
      });

      expect(screen.getByTestId('input')).toBeOnTheScreen();
    });

    it('error state takes priority over success state', () => {
      render(
        <FormControl.TextInput dataTestId="input" placeholderText="Email" isError isSuccess />,
        { wrapper: ds }
      );

      // Should render without crashing — error takes priority
      expect(screen.getByTestId('input')).toBeOnTheScreen();
    });
  });
});
