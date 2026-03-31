import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { FormGroupProvider } from '../FormGroupContext';
import { FormGroupCaption } from './caption/FormGroup.Caption.native';
import { FormGroupDescription } from './description/FormGroup.Description.native';
import { FormGroupLabel } from './label/FormGroup.Label.native';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

describe('FormGroup (native)', () => {
  describe('FormGroupLabel', () => {
    it('renders label text inside provider', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
          <FormGroupLabel>Email</FormGroupLabel>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByText('Email')).toBeOnTheScreen();
    });

    it('shows optional hint when optional is true', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
          <FormGroupLabel optional>Phone</FormGroupLabel>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByText('Phone')).toBeOnTheScreen();
      expect(screen.getByText('(Optional)')).toBeOnTheScreen();
    });

    it('forwards dataTestId to the label', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
          <FormGroupLabel dataTestId="fg-label-test">Field</FormGroupLabel>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByTestId('fg-label-test')).toBeOnTheScreen();
    });
  });

  describe('FormGroupDescription', () => {
    it('renders description text', () => {
      render(
        <FormGroupProvider hasLabel={false} hasDescription hasCaption={false}>
          <FormGroupDescription>Help text here</FormGroupDescription>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByText('Help text here')).toBeOnTheScreen();
    });

    it('forwards dataTestId', () => {
      render(
        <FormGroupProvider hasLabel={false} hasDescription hasCaption={false}>
          <FormGroupDescription dataTestId="fg-desc-test">Desc</FormGroupDescription>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByTestId('fg-desc-test')).toBeOnTheScreen();
    });
  });

  describe('FormGroupCaption', () => {
    it('renders caption text for each variant', () => {
      const variants = ['info', 'error', 'success'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <FormGroupProvider hasLabel={false} hasDescription={false} hasCaption>
            <FormGroupCaption variant={variant}>Caption {variant}</FormGroupCaption>
          </FormGroupProvider>,
          { wrapper: ds }
        );

        expect(screen.getByText(`Caption ${variant}`)).toBeOnTheScreen();
        unmount();
      });
    });

    it('sets alert live region for error variant', () => {
      render(
        <FormGroupProvider
          hasLabel={false}
          hasDescription={false}
          hasCaption
          captionVariant="error"
        >
          <FormGroupCaption variant="error" dataTestId="fg-cap-error">
            Invalid
          </FormGroupCaption>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      const root = screen.getByTestId('fg-cap-error');
      expect(root.props.accessibilityRole).toBe('alert');
      expect(root.props.accessibilityLiveRegion).toBe('assertive');
    });

    it('does not set alert role for info variant', () => {
      render(
        <FormGroupProvider hasLabel={false} hasDescription={false} hasCaption>
          <FormGroupCaption variant="info" dataTestId="fg-cap-info">
            Hint
          </FormGroupCaption>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      const root = screen.getByTestId('fg-cap-info');
      expect(root.props.accessibilityRole).toBeUndefined();
      expect(root.props.accessibilityLiveRegion).toBeUndefined();
    });
  });
});
