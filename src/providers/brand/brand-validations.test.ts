import { validateComponentForBrand } from '@/providers/brand/brand-validations';

describe('validateComponentForBrand', () => {
  it('should not throw when NewsHeading is used with startribune brand', () => {
    expect(() => validateComponentForBrand('NewsHeading', 'startribune')).not.toThrow();
  });

  it('should not throw when NewsHeading is used with varsity brand', () => {
    expect(() => validateComponentForBrand('NewsHeading', 'varsity')).not.toThrow();
  });

  it('should not throw when ArticleBodySponsoredHeading is used with startribune brand', () => {
    expect(() =>
      validateComponentForBrand('ArticleBodySponsoredHeading', 'startribune')
    ).not.toThrow();
  });

  it('should throw when ArticleBodySponsoredHeading is used with varsity brand', () => {
    expect(() => validateComponentForBrand('ArticleBodySponsoredHeading', 'varsity')).toThrow();
  });
});
