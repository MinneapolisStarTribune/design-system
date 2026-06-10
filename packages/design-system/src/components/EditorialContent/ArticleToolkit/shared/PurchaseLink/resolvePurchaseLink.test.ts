import { describe, expect, it } from 'vitest';

import { hasPurchaseLink, resolvePurchaseLink } from './resolvePurchaseLink';

describe('resolvePurchaseLink', () => {
  it('returns undefined when label or link is missing', () => {
    expect(resolvePurchaseLink(undefined)).toBeUndefined();
    expect(resolvePurchaseLink({ label: 'Buy Reprint', link: '' })).toBeUndefined();
    expect(
      resolvePurchaseLink({ label: '', link: 'https://www.startribune.com/photos' })
    ).toBeUndefined();
    expect(resolvePurchaseLink({ link: 'https://www.startribune.com/photos' })).toBeUndefined();
  });

  it('returns the trimmed label and link when both are configured', () => {
    expect(
      resolvePurchaseLink({
        label: ' Buy Reprint ',
        link: ' https://www.startribune.com/photos ',
      })
    ).toEqual({
      label: 'Buy Reprint',
      link: 'https://www.startribune.com/photos',
    });
  });
});

describe('hasPurchaseLink', () => {
  it('requires both label and link', () => {
    expect(
      hasPurchaseLink({ label: 'Buy Reprint', link: 'https://www.startribune.com/photos' })
    ).toBe(true);
    expect(hasPurchaseLink(undefined)).toBe(false);
    expect(hasPurchaseLink({})).toBe(false);
    expect(hasPurchaseLink({ label: '', link: 'https://www.startribune.com/photos' })).toBe(false);
    expect(hasPurchaseLink({ label: 'Buy Reprint', link: '' })).toBe(false);
    expect(hasPurchaseLink({ link: 'https://www.startribune.com/photos' })).toBe(false);
  });
});
