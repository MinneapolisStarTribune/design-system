import { describe, expect, it } from 'vitest';
import { validateDateInput } from './dateInput';

describe('date input values', () => {
  it('validates empty, impossible and out-of-range dates using the same contract as forms', () => {
    expect(validateDateInput(null)).toBeUndefined();
    expect(validateDateInput('', { required: true })).toBe('Choose a date.');
    expect(validateDateInput('2025-02-29')).toContain('valid date');
    const limits = { min: '2026-04-18', max: '2026-04-20' };
    expect(validateDateInput(limits.min, limits)).toBeUndefined();
    expect(validateDateInput(limits.max, limits)).toBeUndefined();
    expect(validateDateInput('2026-04-17', limits)).toContain('on or after');
    expect(validateDateInput('2026-04-21', limits)).toContain('on or before');
  });
});
