import { cleanMarkup } from './DangerousCodeBlock.utils';

describe('cleanMarkup', () => {
  it('converts smart quotes when cleanQuotes is true', () => {
    const input = `‘single’ “double” ″test″`;
    const result = cleanMarkup(input, true);

    expect(result).toBe(`'single' "double" "test"`);
  });

  it('does not modify quotes when cleanQuotes is false', () => {
    const input = `‘single’ “double”`;
    const result = cleanMarkup(input, false);

    expect(result).toBe(input);
  });

  it('returns empty string for null/undefined input', () => {
    expect(cleanMarkup(null, true)).toBe('');
    expect(cleanMarkup(undefined, true)).toBe('');
  });

  it('returns original string if cleanQuotes is false even with nullish handling', () => {
    expect(cleanMarkup('', false)).toBe('');
  });
});