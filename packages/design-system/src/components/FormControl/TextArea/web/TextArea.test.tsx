import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { TextArea } from './TextArea';
import fieldStyles from '@/components/FormControl/FieldSurface.module.scss';
import styles from './TextArea.module.scss';

const mockTrack = vi.fn();

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ track: mockTrack }),
}));

describe('TextArea (web)', () => {
  beforeEach(() => {
    mockTrack.mockClear();
  });

  it('renders a textarea with placeholder and default rows', () => {
    render(<TextArea placeholderText="Write a comment" aria-label="Comment" dataTestId="ta" />);

    const textarea = screen.getByTestId('ta');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('placeholder', 'Write a comment');
    expect(textarea).toHaveAttribute('rows', '2');
    expect(textarea).toHaveClass('typography-utility-text-italic-medium');
  });

  it('is resizable by default and can opt out', () => {
    const { rerender } = render(<TextArea aria-label="Comment" dataTestId="ta" />);
    expect(screen.getByTestId('ta')).toHaveClass(styles.resizable);

    rerender(<TextArea aria-label="Comment" dataTestId="ta" resizable={false} />);
    expect(screen.getByTestId('ta')).not.toHaveClass(styles.resizable);
  });

  it('applies state classes', () => {
    render(
      <TextArea aria-label="Comment" dataTestId="ta" value="hi" onChange={() => {}} isError />
    );

    const textarea = screen.getByTestId('ta');
    expect(textarea).toHaveClass(fieldStyles.filled);
    expect(textarea).toHaveClass(fieldStyles.error);
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables the textarea', () => {
    render(<TextArea aria-label="Comment" dataTestId="ta" isDisabled />);

    const textarea = screen.getByTestId('ta');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass(fieldStyles.disabled);
  });

  it('picks up error state and ARIA wiring from FormGroup', () => {
    render(
      <FormGroup>
        <FormGroup.Label>Comment</FormGroup.Label>
        <TextArea dataTestId="ta" />
        <FormGroup.Caption variant="error">Required</FormGroup.Caption>
      </FormGroup>
    );

    const textarea = screen.getByTestId('ta');
    expect(textarea).toHaveClass(fieldStyles.error);
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleName('Comment');
    expect(textarea).toHaveAccessibleDescription('Required');
  });

  it('passes supported native attributes through', () => {
    render(
      <TextArea
        aria-label="Comment"
        dataTestId="ta"
        name="comment"
        maxLength={200}
        required
        readOnly
        defaultValue="draft"
      />
    );

    const textarea = screen.getByTestId('ta');
    expect(textarea).toHaveAttribute('name', 'comment');
    expect(textarea).toHaveAttribute('maxlength', '200');
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('readonly');
    expect(textarea).toHaveValue('draft');
  });

  it('forwards ref to the native textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea aria-label="Comment" dataTestId="ta" ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId('ta'));
  });

  it('tracks blur with value length and custom metadata', () => {
    const onBlur = vi.fn();
    render(
      <TextArea
        aria-label="Comment"
        dataTestId="ta"
        value="hello"
        onChange={() => {}}
        onBlur={onBlur}
        analytics={{ form_field: 'comment' }}
      />
    );

    fireEvent.blur(screen.getByTestId('ta'));

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(mockTrack).toHaveBeenCalledWith({
      event: 'text_area_blur',
      component: 'TextArea',
      value_length: 5,
      form_field: 'comment',
    });
  });
});
