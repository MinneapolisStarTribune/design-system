import { vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormLogic } from './useFormLogic';

describe('useFormLogic', () => {
  it('returns initial values and empty errors', () => {
    const { result } = renderHook(() =>
      useFormLogic({
        initialValues: { email: '', name: 'Jane' },
        onSubmit: vi.fn(),
      })
    );

    expect(result.current.values).toEqual({ email: '', name: 'Jane' });
    expect(result.current.errors).toEqual({});
  });

  it('setFieldValue updates value and clears that field error', () => {
    const { result } = renderHook(() =>
      useFormLogic({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
        validate: (v) => (v.email ? {} : { email: 'Required' }),
      })
    );

    act(() => {
      result.current.setFieldError('email', 'Required');
    });
    expect(result.current.errors.email).toBe('Required');

    act(() => {
      result.current.setFieldValue('email', 'a@b.com');
    });
    expect(result.current.values.email).toBe('a@b.com');
    expect(result.current.errors.email).toBeUndefined();
  });

  it('setFieldError sets and clears field error', () => {
    const { result } = renderHook(() =>
      useFormLogic({ initialValues: { email: '' }, onSubmit: vi.fn() })
    );

    act(() => {
      result.current.setFieldError('email', 'Invalid');
    });
    expect(result.current.errors.email).toBe('Invalid');

    act(() => {
      result.current.setFieldError('email', undefined);
    });
    expect(result.current.errors).toEqual({});
  });

  it('handleChangeEvent updates value by e.target.name and e.target.value', () => {
    const { result } = renderHook(() =>
      useFormLogic({ initialValues: { email: '' }, onSubmit: vi.fn() })
    );

    act(() => {
      result.current.handleChangeEvent({
        target: { name: 'email', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('handleSubmit prevents default and calls onSubmit when no validate', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useFormLogic({ initialValues: { email: 'a@b.com' }, onSubmit })
    );

    const e = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    act(() => {
      result.current.handleSubmit(e);
    });

    expect(e.preventDefault).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com' });
  });

  it('handleSubmit runs validate on submit; when errors exist, does not call onSubmit', () => {
    const onSubmit = vi.fn();
    const validate = vi.fn((v: { email: string }) =>
      v.email?.includes('@') ? {} : { email: 'Invalid email' }
    );

    const { result } = renderHook(() =>
      useFormLogic({
        initialValues: { email: 'bad' },
        onSubmit,
        validate,
        validateOnSubmit: true,
      })
    );

    const e = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    act(() => {
      result.current.handleSubmit(e);
    });

    expect(validate).toHaveBeenCalledWith({ email: 'bad' });
    expect(result.current.errors.email).toBe('Invalid email');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('handleSubmit when validate passes calls onSubmit with current values', () => {
    const onSubmit = vi.fn();
    const validate = vi.fn(() => ({}));

    const { result } = renderHook(() =>
      useFormLogic({
        initialValues: { email: 'good@example.com' },
        onSubmit,
        validate,
        validateOnSubmit: true,
      })
    );

    const e = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    act(() => {
      result.current.handleSubmit(e);
    });

    expect(validate).toHaveBeenCalledWith({ email: 'good@example.com' });
    expect(onSubmit).toHaveBeenCalledWith({ email: 'good@example.com' });
  });

  it('validateOnSubmit: false skips validation and still calls onSubmit', () => {
    const onSubmit = vi.fn();
    const validate = vi.fn(() => ({ email: 'Always invalid' }));

    const { result } = renderHook(() =>
      useFormLogic({
        initialValues: { email: 'x' },
        onSubmit,
        validate,
        validateOnSubmit: false,
      })
    );

    const e = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    act(() => {
      result.current.handleSubmit(e);
    });

    expect(validate).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith({ email: 'x' });
  });

  it('handleBlur with validateOnBlur runs validate and sets field error', () => {
    const validate = vi.fn((v: { email: string }) =>
      v.email?.includes('@') ? {} : { email: 'Include @' }
    );

    const { result } = renderHook(() =>
      useFormLogic({
        initialValues: { email: 'nope' },
        onSubmit: vi.fn(),
        validate,
        validateOnBlur: true,
      })
    );

    act(() => {
      result.current.handleBlur('email');
    });

    expect(validate).toHaveBeenCalledWith({ email: 'nope' });
    expect(result.current.errors.email).toBe('Include @');
  });

  it('handleBlur with validateOnBlur: false does not run validate', () => {
    const validate = vi.fn(() => ({}));

    const { result } = renderHook(() =>
      useFormLogic({
        initialValues: { email: '' },
        onSubmit: vi.fn(),
        validate,
        validateOnBlur: false,
      })
    );

    act(() => {
      result.current.handleBlur('email');
    });

    expect(validate).not.toHaveBeenCalled();
  });

  it('handleChange is an alias for setFieldValue', () => {
    const { result } = renderHook(() =>
      useFormLogic({ initialValues: { a: 0 }, onSubmit: vi.fn() })
    );

    act(() => {
      result.current.handleChange('a', 1);
    });

    expect(result.current.values.a).toBe(1);
  });
});
