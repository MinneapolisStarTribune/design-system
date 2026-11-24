import { screen } from '@testing-library/react';
import { renderWithProvider } from '@/test-utils/render';
import { useFormGroupContext } from '../FormGroupContext';
import { FormGroup } from './FormGroup';

const ContextProbe = () => {
  const c = useFormGroupContext();
  return (
    <>
      <span data-testid="ctx-has-error">{String(c?.hasError)}</span>
      <span data-testid="ctx-has-success">{String(c?.hasSuccess)}</span>
    </>
  );
};

describe('FormGroup', () => {
  it('passes caption variant from FormGroup.Caption into context', () => {
    const { rerender } = renderWithProvider(
      <FormGroup>
        <FormGroup.Label>Field</FormGroup.Label>
        <ContextProbe />
        <FormGroup.Caption variant="error">Error</FormGroup.Caption>
      </FormGroup>
    );

    expect(screen.getByTestId('ctx-has-error')).toHaveTextContent('true');
    expect(screen.getByTestId('ctx-has-success')).toHaveTextContent('false');

    rerender(
      <FormGroup>
        <FormGroup.Label>Field</FormGroup.Label>
        <ContextProbe />
        <FormGroup.Caption variant="success">OK</FormGroup.Caption>
      </FormGroup>
    );

    expect(screen.getByTestId('ctx-has-error')).toHaveTextContent('false');
    expect(screen.getByTestId('ctx-has-success')).toHaveTextContent('true');
  });

  describe('empty slots', () => {
    const getSlots = (container: HTMLElement) => ({
      above: container.querySelector('.form-group__above'),
      control: container.querySelector('.form-group__control'),
      caption: container.querySelector('.form-group__caption'),
    });

    it('marks empty slots with data-empty and aria-hidden', () => {
      const { container } = renderWithProvider(
        <FormGroup>
          <input aria-label="Plain" />
        </FormGroup>
      );
      const { above, control, caption } = getSlots(container);

      [above, caption].forEach((el) => {
        expect(el).toHaveAttribute('data-empty');
        expect(el).toHaveAttribute('aria-hidden', 'true');
      });
      expect(control).not.toHaveAttribute('data-empty');
      expect(above).not.toBeVisible();
      expect(caption).not.toBeVisible();
    });

    it('does not mark populated slots as empty', () => {
      const { container } = renderWithProvider(
        <FormGroup>
          <FormGroup.Label>Field</FormGroup.Label>
          <input aria-label="Plain" />
          <FormGroup.Caption variant="info">Help</FormGroup.Caption>
        </FormGroup>
      );
      const { above, control, caption } = getSlots(container);

      [above, control, caption].forEach((el) => {
        expect(el).not.toHaveAttribute('data-empty');
        expect(el).not.toHaveAttribute('aria-hidden');
      });
    });

    it('keeps populated slots visible when another library sets aria-hidden on them', () => {
      const { container } = renderWithProvider(
        <FormGroup>
          <FormGroup.Label>Field</FormGroup.Label>
          <input aria-label="Plain" />
          <FormGroup.Caption variant="info">Help</FormGroup.Caption>
        </FormGroup>
      );
      const { above, caption } = getSlots(container);
      above?.setAttribute('aria-hidden', 'true');
      caption?.setAttribute('aria-hidden', 'true');

      expect(above).toBeVisible();
      expect(caption).toBeVisible();
    });
  });
});
