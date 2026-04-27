import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { FormGroupProvider } from '../FormGroupContext';
import { FormGroupCaption } from './Caption/FormGroup.Caption.native';
import { FormGroupDescription } from './Description/FormGroup.Description.native';
import { FormGroupLabel } from './Label/FormGroup.Label.native';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

describe('FormGroup Accessibility (native)', () => {
  it('exposes label text as text role', () => {
    render(
      <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
        <FormGroupLabel>Email address</FormGroupLabel>
      </FormGroupProvider>,
      { wrapper: ds }
    );

    expect(screen.getByRole('text', { name: 'Email address' })).toBeOnTheScreen();
  });

  it('exposes optional field label and optional hint as readable text', () => {
    render(
      <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
        <FormGroupLabel optional>Phone</FormGroupLabel>
      </FormGroupProvider>,
      { wrapper: ds }
    );

    expect(screen.getByText('Phone')).toBeOnTheScreen();
    expect(screen.getByText('(Optional)')).toBeOnTheScreen();
    expect(screen.getAllByRole('text').length).toBeGreaterThanOrEqual(2);
  });

  it('exposes description as readable text', () => {
    render(
      <FormGroupProvider hasLabel={false} hasDescription hasCaption={false}>
        <FormGroupDescription>We never share your email.</FormGroupDescription>
      </FormGroupProvider>,
      { wrapper: ds }
    );

    expect(screen.getByText('We never share your email.')).toBeOnTheScreen();
  });

  it('marks error caption container as alert with assertive live region', () => {
    render(
      <FormGroupProvider hasLabel={false} hasDescription={false} hasCaption captionVariant="error">
        <FormGroupCaption variant="error" dataTestId="fg-cap-a11y-error">
          This field is required.
        </FormGroupCaption>
      </FormGroupProvider>,
      { wrapper: ds }
    );

    const container = screen.getByTestId('fg-cap-a11y-error');
    expect(container.props.accessibilityRole).toBe('alert');
    expect(container.props.accessibilityLiveRegion).toBe('assertive');
    expect(screen.getByText('This field is required.')).toBeOnTheScreen();
  });

  it('does not mark info caption as alert', () => {
    render(
      <FormGroupProvider hasLabel={false} hasDescription={false} hasCaption>
        <FormGroupCaption variant="info" dataTestId="fg-cap-a11y-info">
          Helper text
        </FormGroupCaption>
      </FormGroupProvider>,
      { wrapper: ds }
    );

    const container = screen.getByTestId('fg-cap-a11y-info');
    expect(container.props.accessibilityRole).toBeUndefined();
    expect(container.props.accessibilityLiveRegion).toBeUndefined();
    expect(screen.getByText('Helper text')).toBeOnTheScreen();
  });
});
